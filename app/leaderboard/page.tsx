'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import SocialNavbar from '@/components/layout/SocialNavbar'

interface LeaderboardEntry {
  username: string
  full_name: string
  avatar_url: string
  total_votes: number
  submissions_count: number
  rank: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'all' | 'week' | 'month'>('all')

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      // Get users with their total votes and submission counts
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          username,
          full_name,
          avatar_url,
          submissions!inner(
            votes
          )
        `)

      if (error) {
        console.error('Error fetching leaderboard:', error)
        return
      }

      // Process the data to calculate totals
      const userStats = new Map<string, { username: string, full_name: string, avatar_url: string, total_votes: number, submissions_count: number }>()
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data?.forEach((profile: Record<string, any>) => {
        const username = profile.username || 'anonymous'
        const existing = userStats.get(username) || {
          username,
          full_name: profile.full_name || 'Anonymous',
          avatar_url: profile.avatar_url || '',
          total_votes: 0,
          submissions_count: 0
        }
        
        existing.total_votes += profile.submissions?.votes || 0
        existing.submissions_count += 1
        userStats.set(username, existing)
      })

      // Convert to array and sort by total votes
      const sortedLeaderboard = Array.from(userStats.values())
        .sort((a, b) => b.total_votes - a.total_votes)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1
        }))
        .slice(0, 50) // Top 50

      setLeaderboard(sortedLeaderboard)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    if (rank <= 10) return '🏆'
    return '⭐'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading leaderboard...</div>
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
            Leaderboard
          </h1>
          <p className="text-lg text-white/80 mb-6">Top artists by community votes</p>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Top Artists</h2>
              <div className="flex gap-2">
                {(['all', 'week', 'month'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      timeframe === period
                        ? 'bg-white text-purple-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {period === 'all' ? 'All Time' : period === 'week' ? 'This Week' : 'This Month'}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {leaderboard.map((entry) => (
                <div key={entry.username} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getRankEmoji(entry.rank)}</div>
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {entry.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-semibold text-lg">
                          {entry.full_name}
                        </div>
                        <div className="text-gray-300 text-sm">
                          @{entry.username}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white font-bold text-xl">
                        {entry.total_votes.toLocaleString()}
                      </div>
                      <div className="text-gray-300 text-sm">
                        {entry.submissions_count} submission{entry.submissions_count !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {leaderboard.length === 0 && (
              <div className="p-12 text-center">
                <div className="text-gray-400 text-lg">No artists found</div>
                <div className="text-gray-500 text-sm mt-2">Submit your first artwork to get on the leaderboard!</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
