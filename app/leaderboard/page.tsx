'use client'

import { useState, useEffect } from 'react'
// import { createClient } from '@/utils/supabase/client' // Not used in mock data
import SocialNavbar from '@/components/layout/SocialNavbar'
import Link from 'next/link'
import Image from 'next/image'

interface LeaderboardEntry {
  id: string
  username: string
  full_name: string
  avatar_url?: string
  total_wins: number
  total_submissions: number
  total_likes: number
  rank: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'wins' | 'submissions' | 'likes'>('wins')

  useEffect(() => {
    fetchLeaderboard()
  }, [sortBy])

  const fetchLeaderboard = async () => {
    try {
      // const supabase = createClient() // Not used in mock data
      
      // Mock data for now - replace with actual query
      const mockData: LeaderboardEntry[] = [
        {
          id: '1',
          username: 'cyber_artist_1',
          full_name: 'Alex Chen',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          total_wins: 12,
          total_submissions: 45,
          total_likes: 2340,
          rank: 1
        },
        {
          id: '2',
          username: 'neon_creator',
          full_name: 'Maya Rodriguez',
          avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          total_wins: 8,
          total_submissions: 32,
          total_likes: 1890,
          rank: 2
        },
        {
          id: '3',
          username: 'digital_dreamer',
          full_name: 'Jordan Kim',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          total_wins: 6,
          total_submissions: 28,
          total_likes: 1650,
          rank: 3
        },
        {
          id: '4',
          username: 'pixel_master',
          full_name: 'Sam Taylor',
          avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          total_wins: 5,
          total_submissions: 22,
          total_likes: 1420,
          rank: 4
        },
        {
          id: '5',
          username: 'art_engineer',
          full_name: 'Casey Lee',
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
          total_wins: 4,
          total_submissions: 18,
          total_likes: 1200,
          rank: 5
        }
      ]

      setLeaderboard(mockData)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSortLabel = (type: string) => {
    switch (type) {
      case 'wins': return 'Contest Wins'
      case 'submissions': return 'Total Submissions'
      case 'likes': return 'Total Likes'
      default: return 'Contest Wins'
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  if (loading) {
    return (
      <div className="cyber-bg min-h-screen">
        <SocialNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-2xl text-cyan-300">Loading leaderboard...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cyber-bg min-h-screen">
      <SocialNavbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold cyber-text glitch mb-2" data-text="[LEADERBOARD]" style={{ fontFamily: 'var(--font-header)' }}>
            [LEADERBOARD]
          </h1>
          <p className="text-lg text-cyan-300 mb-6">{'// Top performers in the creative arena'}</p>
          
          {/* Sort Options */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setSortBy('wins')}
              className={`px-4 py-2 rounded-lg transition-all ${
                sortBy === 'wins' 
                  ? 'bg-cyan-500 text-black font-bold' 
                  : 'bg-white/10 text-cyan-300 hover:bg-white/20'
              }`}
            >
              🏆 Wins
            </button>
            <button
              onClick={() => setSortBy('submissions')}
              className={`px-4 py-2 rounded-lg transition-all ${
                sortBy === 'submissions' 
                  ? 'bg-cyan-500 text-black font-bold' 
                  : 'bg-white/10 text-cyan-300 hover:bg-white/20'
              }`}
            >
              📝 Submissions
            </button>
            <button
              onClick={() => setSortBy('likes')}
              className={`px-4 py-2 rounded-lg transition-all ${
                sortBy === 'likes' 
                  ? 'bg-cyan-500 text-black font-bold' 
                  : 'bg-white/10 text-cyan-300 hover:bg-white/20'
              }`}
            >
              ❤️ Likes
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto">
          <div className="cyber-card p-6">
            <h2 className="text-2xl font-bold cyber-text mb-6 text-center" style={{ fontFamily: 'var(--font-header)' }}>
              Top Artists - {getSortLabel(sortBy)}
            </h2>
            
            <div className="space-y-4">
              {leaderboard.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-500/50 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-cyan-400">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      {entry.avatar_url ? (
                        <Image
                          src={entry.avatar_url}
                          alt={entry.full_name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-lg">
                          {entry.full_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{entry.full_name}</h3>
                      <p className="text-cyan-300 text-sm">@{entry.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-right">
                    <div>
                      <div className="text-2xl font-bold text-cyan-400">{entry.total_wins}</div>
                      <div className="text-xs text-white/60">Wins</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">{entry.total_submissions}</div>
                      <div className="text-xs text-white/60">Submissions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-pink-400">{entry.total_likes}</div>
                      <div className="text-xs text-white/60">Likes</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8">
            <div className="cyber-card p-6 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold cyber-text mb-4" style={{ fontFamily: 'var(--font-header)' }}>
                Want to Climb the Ranks?
              </h2>
              <p className="text-white/80 mb-6">Submit your best artwork and compete for the top spot!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/submit"
                  className="cyber-btn text-lg transform hover:scale-105 transition-all duration-300"
                >
                  🎨 Submit Artwork
                </Link>
                <Link
                  href="/contests"
                  className="cyber-card text-lg hover:bg-white/20 transition-all"
                >
                  🏆 View Contests
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}