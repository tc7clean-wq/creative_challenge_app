'use client'

import { useState, useEffect, useCallback } from 'react'
// import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface Comment {
  id: string
  content: string
  created_at: string
  profiles: {
    username: string
    full_name: string
    avatar_url: string
  }
}

interface ArtworkCommentsProps {
  submissionId: string
}

export default function ArtworkComments({ submissionId }: ArtworkCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/comments?submission_id=${submissionId}`)
      const data = await response.json()

      if (!response.ok) {
        console.error('Error fetching comments:', data.error)
        return
      }

      setComments(data.comments || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }, [submissionId])

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    try {
      setSubmitting(true)
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submission_id: submissionId,
          content: newComment.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Error submitting comment:', data.error)
        return
      }

      setComments(prev => [...prev, data.comment])
      setNewComment('')
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        💬 Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={submitComment} className="mb-6">
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">
                {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this artwork..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">{newComment.length}/500</span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-gray-300 text-sm">
            <a href="/auth" className="text-purple-400 hover:text-purple-300 underline">
              Sign in
            </a> to join the conversation!
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4">
            <div className="text-gray-400">Loading comments...</div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm">No comments yet. Be the first to share your thoughts!</div>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">
                  {comment.profiles?.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-medium text-sm">
                      {comment.profiles?.full_name || comment.profiles?.username || 'Anonymous'}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-200 text-sm whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
