'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import SocialNavbar from '@/components/layout/SocialNavbar'
import Link from 'next/link'

interface Contest {
  id: string
  title: string
  description: string
  theme: string
  start_date: string
  end_date: string
  prize_pool: number
  max_submissions: number
  rules: string
  created_at: string
  submissions_count: number
}

interface Submission {
  id: string
  title: string
  description: string
  image_url: string
  user_id: string
  created_at: string
  votes_count: number
  profiles: {
    username: string
    full_name: string
  }
}

export default function ContestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [contest, setContest] = useState<Contest | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [, setUser] = useState<unknown>(null)

  const fetchContestData = useCallback(async (contestId: string) => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      // Fetch contest details
      const { data: contestData, error: contestError } = await supabase
        .from('contests')
        .select(`
          *,
          submissions!inner(count)
        `)
        .eq('id', contestId)
        .single()

      if (contestError) {
        console.error('Error fetching contest:', contestError)
        return
      }

      const transformedContest: Contest = {
        id: contestData.id,
        title: contestData.title,
        description: contestData.description,
        theme: contestData.theme,
        start_date: contestData.start_date,
        end_date: contestData.end_date,
        prize_pool: contestData.prize_pool,
        max_submissions: contestData.max_submissions,
        rules: contestData.rules,
        created_at: contestData.created_at,
        submissions_count: (contestData.submissions as any)?.[0]?.count || 0 // eslint-disable-line @typescript-eslint/no-explicit-any
      }

      setContest(transformedContest)

      // Fetch submissions for this contest
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles:user_id (username, full_name),
          votes!inner(count)
        `)
        .eq('contest_id', contestId)
        .order('created_at', { ascending: false })

      if (submissionsError) {
        console.error('Error fetching submissions:', submissionsError)
        return
      }

      const transformedSubmissions: Submission[] = submissionsData?.map((submission: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
        id: submission.id,
        title: submission.title,
        description: submission.description,
        image_url: submission.image_url,
        user_id: submission.user_id,
        created_at: submission.created_at,
        votes_count: (submission.votes as any)?.[0]?.count || 0, // eslint-disable-line @typescript-eslint/no-explicit-any
        profiles: submission.profiles
      })) || []

      setSubmissions(transformedSubmissions)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    const loadData = async () => {
      const resolvedParams = await params
      getUser()
      fetchContestData(resolvedParams.id)
    }

    loadData()
  }, [params, fetchContestData])

  const isContestActive = (endDate: string) => {
    return new Date(endDate) > new Date()
  }

  const getTimeRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h left`
    return `${hours}h left`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading contest...</div>
      </div>
    )
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Contest Not Found</h1>
          <Link href="/contests" className="text-blue-400 hover:text-blue-300">Back to Contests</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <SocialNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Contest Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">{contest.title}</h1>
            <p className="text-lg text-white/80 mb-4">{contest.description}</p>
            <div className="flex justify-center items-center space-x-4">
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                isContestActive(contest.end_date)
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {isContestActive(contest.end_date) ? 'Active' : 'Ended'}
              </div>
              <div className="text-white/60 text-sm">
                {getTimeRemaining(contest.end_date)}
              </div>
            </div>
          </div>

          {/* Contest Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">Contest Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Theme</h3>
                    <p className="text-white/80">{contest.theme || 'Open theme - be creative!'}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Rules</h3>
                    <p className="text-white/80">{contest.rules || 'No specific rules - just create amazing art!'}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Prize</h3>
                    <div className="text-yellow-400 font-bold text-xl">
                      5 Entries for Future Money Draw
                    </div>
                    <p className="text-cyan-300 text-sm">
                      Win this contest to earn 5 entries into our upcoming money draw!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Contest Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">Submissions</span>
                    <span className="text-white font-semibold">
                      {contest.submissions_count} / {contest.max_submissions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Start Date</span>
                    <span className="text-white font-semibold">
                      {new Date(contest.start_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">End Date</span>
                    <span className="text-white font-semibold">
                      {new Date(contest.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/contest/${contest.id}/vote`}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-all text-center block"
                >
                  🗳️ Vote Now
                </Link>
                <Link
                  href="/submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-center block"
                >
                  Submit Entry
                </Link>
              </div>
            </div>
          </div>

          {/* Submissions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Submissions ({submissions.length})</h2>
            
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-white/60 text-lg">No submissions yet</div>
                <div className="text-white/40 text-sm mt-2">Be the first to submit your artwork!</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.map((submission) => (
                  <div key={submission.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="aspect-square bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-white/60 text-center">
                        <div className="text-4xl mb-2">🎨</div>
                        <div className="text-sm">Artwork Preview</div>
                      </div>
                    </div>
                    <h3 className="text-white font-semibold mb-2">{submission.title}</h3>
                    <p className="text-white/60 text-sm mb-3 line-clamp-2">{submission.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-white/60 text-sm">
                        by {submission.profiles?.full_name || submission.profiles?.username || 'Anonymous'}
                      </div>
                      <div className="text-yellow-400 font-semibold">
                        {submission.votes_count} votes
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
