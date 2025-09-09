'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import SocialNavbar from '@/components/layout/SocialNavbar'
import Link from 'next/link'

interface Contest {
  id: string
  title: string
  description: string
  prize_amount: number
  start_date: string
  end_date: string
  is_active: boolean
  submissions_count: number
}

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchContests = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('contests')
        .select(`
          id,
          title,
          description,
          prize_amount,
          start_date,
          end_date,
          is_active,
          submissions!inner(count)
        `)
        .eq('is_active', true)
        .order('end_date', { ascending: true })

      if (error) {
        console.error('Error fetching contests:', error)
        return
      }

      // Transform the data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedData = data?.map((contest: Record<string, any>) => ({
        ...contest,
        submissions_count: contest.submissions?.[0]?.count || 0
      })) || []

      setContests(transformedData as Contest[])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContests()
  }, [fetchContests])

  const isContestActive = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    return now >= start && now <= end
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
        <div className="text-white text-2xl">Loading contests...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <SocialNavbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2" style={{
            fontFamily: 'var(--font-bebas-neue), "Arial Black", "Impact", sans-serif',
            background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF8C00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Active Contests
          </h1>
          <p className="text-lg text-white/80 mb-6">Win contests to earn entries for our future money draw!</p>
        </div>

        {/* Contests Grid */}
        <div className="max-w-6xl mx-auto">
          {contests.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">No Active Contests</h2>
                <p className="text-white/80 mb-6">Check back soon for new contests and competitions!</p>
                <Link
                  href="/submit"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all inline-block"
                >
                  Submit Artwork
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contests.map((contest) => (
                <div key={contest.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white line-clamp-2">{contest.title}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isContestActive(contest.start_date, contest.end_date)
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {isContestActive(contest.start_date, contest.end_date) ? 'Active' : 'Ended'}
                    </div>
                  </div>

                  <p className="text-white/70 text-sm mb-4 line-clamp-3">{contest.description}</p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Prize</span>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold text-lg">
                          5 Entries
                        </div>
                        <div className="text-cyan-300 text-xs">
                          Future Money Draw
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Submissions</span>
                      <span className="text-white font-medium">
                        {contest.submissions_count}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Time Left</span>
                      <span className="text-white font-medium">
                        {getTimeRemaining(contest.end_date)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="space-y-2">
                      <Link
                        href={`/contest/${contest.id}/vote`}
                        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-all text-center block"
                      >
                        🗳️ Vote Now
                      </Link>
                      <Link
                        href={`/contest/${contest.id}`}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-center block"
                      >
                        View Details
                      </Link>
                    </div>
                    <Link
                      href="/submit"
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-2 px-4 rounded-lg font-medium transition-all text-center block"
                    >
                      Submit Entry
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Compete?</h2>
            <p className="text-white/80 mb-6">Submit your artwork and start earning jackpot spots!</p>
            <Link
              href="/submit"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-8 rounded-lg text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl inline-block"
            >
              Submit Your Art
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
