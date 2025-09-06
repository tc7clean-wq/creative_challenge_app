'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import AdminNavbar from '@/components/layout/AdminNavbar'
import AdminGuard from '@/components/auth/AdminGuard'

interface Submission {
  id: string
  title: string
  description: string
  image_url: string
  votes: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  profiles: {
    username: string
    full_name: string
    avatar_url: string
  }
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const router = useRouter()

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      let query = supabase
        .from('submissions')
        .select(`
          id,
          title,
          description,
          image_url,
          votes,
          status,
          created_at,
          profiles!inner(username, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching submissions:', error)
        setError('Failed to fetch submissions')
        return
      }

      // Transform the data to ensure profiles is a single object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedData = data?.map((submission: any) => ({
        ...submission,
        profiles: Array.isArray(submission.profiles) ? submission.profiles[0] : submission.profiles
      })) || []

      setSubmissions(transformedData)
    } catch (err) {
      console.error('Error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }, [filter])

  const updateSubmissionStatus = async (submissionId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('submissions')
        .update({ status: newStatus })
        .eq('id', submissionId)

      if (error) {
        console.error('Error updating submission:', error)
        setError(`Failed to ${newStatus} submission`)
        return
      }

      // Update local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId 
            ? { ...sub, status: newStatus }
            : sub
        )
      )
    } catch (err) {
      console.error('Error:', err)
      setError('An unexpected error occurred')
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading submissions...</div>
      </div>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen cyber-bg p-6">
        <AdminNavbar />
        <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Admin - Submissions</h1>
          <button
            onClick={() => router.back()}
            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            ← Back
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-white text-purple-900'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} 
              {status !== 'all' && (
                <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                  {submissions.filter(s => s.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Submissions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((submission) => (
            <div key={submission.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              {/* Image */}
              <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                <img
                  src={submission.image_url}
                  alt={submission.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white truncate">{submission.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                    {submission.status}
                  </span>
                </div>

                <p className="text-gray-300 text-sm line-clamp-2">{submission.description}</p>

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {submission.profiles?.username?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {submission.profiles?.full_name || submission.profiles?.username || 'Unknown'}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Votes */}
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-white font-medium">{submission.votes} votes</span>
                </div>

                {/* Action Buttons */}
                {submission.status === 'pending' && (
                  <div className="flex space-x-2 pt-3">
                    <button
                      onClick={() => updateSubmissionStatus(submission.id, 'approved')}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => updateSubmissionStatus(submission.id, 'rejected')}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}

                {submission.status !== 'pending' && (
                  <div className="pt-3">
                    <button
                      onClick={() => updateSubmissionStatus(submission.id, 'pending')}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      Reset to Pending
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {submissions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white text-xl">No submissions found for the selected filter.</p>
          </div>
        )}
        </div>
      </div>
    </AdminGuard>
  )
}
