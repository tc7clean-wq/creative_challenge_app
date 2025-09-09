'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import SocialNavbar from '@/components/layout/SocialNavbar'
import Link from 'next/link'
import Image from 'next/image'

interface Submission {
  id: string
  title: string
  description: string
  image_url: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  contest_id: string
  contest_title?: string
  votes_count?: number
}

export default function MySubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<unknown>(null)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        fetchSubmissions(user.id)
      } else {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  const fetchSubmissions = async (userId: string) => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          contests(title),
          votes(count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching submissions:', error)
        return
      }

      const transformedData: Submission[] = data?.map((submission: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
        id: submission.id as string,
        title: submission.title as string,
        description: submission.description as string,
        image_url: submission.image_url as string,
        status: submission.status as 'pending' | 'approved' | 'rejected',
        created_at: submission.created_at as string,
        contest_id: submission.contest_id as string,
        votes_count: (submission.votes as any)?.[0]?.count || 0, // eslint-disable-line @typescript-eslint/no-explicit-any
        contest_title: (submission.contests as any)?.title || 'Unknown Contest' // eslint-disable-line @typescript-eslint/no-explicit-any
      })) || []

      setSubmissions(transformedData)
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✅'
      case 'rejected':
        return '❌'
      case 'pending':
        return '⏳'
      default:
        return '❓'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please sign in to view your submissions</h1>
          <Link href="/auth" className="text-blue-400 hover:text-blue-300">Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <SocialNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">My Submissions</h1>
            <p className="text-lg text-white/80">Track your creative submissions and their status</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{submissions.length}</div>
                <div className="text-white/70">Total Submissions</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {submissions.filter(s => s.status === 'approved').length}
                </div>
                <div className="text-white/70">Approved</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {submissions.filter(s => s.status === 'pending').length}
                </div>
                <div className="text-white/70">Pending Review</div>
              </div>
            </div>
          </div>

          {/* Submissions List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-white text-2xl">Loading your submissions...</div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">No Submissions Yet</h2>
                <p className="text-white/80 mb-6">Start creating and submit your artwork to contests!</p>
                <Link
                  href="/submit"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all inline-block"
                >
                  Submit Artwork
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {submissions.map((submission) => (
                <div key={submission.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="md:w-48 flex-shrink-0">
                      <div className="relative w-full h-48 md:h-32 rounded-lg overflow-hidden">
                        <Image
                          src={submission.image_url}
                          alt={submission.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-white">{submission.title}</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)} {submission.status.toUpperCase()}
                        </div>
                      </div>

                      <p className="text-white/70 text-sm mb-4 line-clamp-2">{submission.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-white/60 text-sm">Contest</span>
                          <p className="text-white font-medium">{submission.contest_title}</p>
                        </div>
                        <div>
                          <span className="text-white/60 text-sm">Submitted</span>
                          <p className="text-white font-medium">{formatDate(submission.created_at)}</p>
                        </div>
                        <div>
                          <span className="text-white/60 text-sm">Votes</span>
                          <p className="text-white font-medium">{submission.votes_count}</p>
                        </div>
                      </div>

                      {submission.status === 'approved' && (
                        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3 mb-4">
                          <p className="text-green-200 text-sm">
                            🎉 Congratulations! Your submission was approved and is now live in the gallery.
                          </p>
                        </div>
                      )}

                      {submission.status === 'rejected' && (
                        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 mb-4">
                          <p className="text-red-200 text-sm">
                            ❌ Your submission was not approved. Please review the contest requirements and try again.
                          </p>
                        </div>
                      )}

                      {submission.status === 'pending' && (
                        <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3 mb-4">
                          <p className="text-yellow-200 text-sm">
                            ⏳ Your submission is under review. We&apos;ll notify you once it&apos;s been processed.
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Link
                          href={`/submission/${submission.id}`}
                          className="px-4 py-2 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded-lg font-medium transition-all"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/contest/${submission.contest_id}`}
                          className="px-4 py-2 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg font-medium transition-all"
                        >
                          View Contest
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Link
              href="/submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all inline-block text-lg"
            >
              Submit New Artwork
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
