'use client'

import { useState, useEffect, useCallback } from 'react'
// import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface ArtworkLikesProps {
  submissionId: string
  initialLikes: number
  onLikeUpdate?: (newCount: number) => void
}

export default function ArtworkLikes({ submissionId, initialLikes, onLikeUpdate }: ArtworkLikesProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const checkUserLike = useCallback(async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/likes?submission_id=${submissionId}`)
      const data = await response.json()

      if (!response.ok) {
        console.error('Error checking likes:', data.error)
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userLike = data.likes.find((like: Record<string, any>) => like.user_id === user.id)
      setIsLiked(!!userLike)
    } catch (err) {
      console.error('Error:', err)
    }
  }, [submissionId, user])

  const toggleLike = async () => {
    if (!user) {
      // Redirect to auth if not logged in
      window.location.href = '/auth'
      return
    }

    try {
      setLoading(true)
      
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submission_id: submissionId,
          action: isLiked ? 'unlike' : 'like'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Error toggling like:', data.error)
        return
      }

      if (isLiked) {
        setLikes(prev => prev - 1)
        setIsLiked(false)
        onLikeUpdate?.(likes - 1)
      } else {
        setLikes(prev => prev + 1)
        setIsLiked(true)
        onLikeUpdate?.(likes + 1)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkUserLike()
  }, [checkUserLike])

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleLike}
        disabled={loading}
        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
          isLiked
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            : 'bg-white/10 text-gray-300 hover:bg-white/20'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
      >
        <span className="text-lg">
          {isLiked ? '❤️' : '🤍'}
        </span>
        <span className="text-sm font-medium">{likes}</span>
      </button>
      
      <div className="text-xs text-gray-400">
        {likes === 1 ? '1 like' : `${likes} likes`}
      </div>
    </div>
  )
}
