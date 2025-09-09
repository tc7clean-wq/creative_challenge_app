'use client'

import { useState, useEffect } from 'react'
import SocialNavbar from '@/components/layout/SocialNavbar'
import Link from 'next/link'
import Image from 'next/image'

interface Winner {
  id: string
  title: string
  description: string
  image_url: string
  votes_count: number
  contest_title: string
  contest_id: string
  winner_name: string
  winner_username: string
  won_date: string
}

export default function HallOfFamePage() {
  const [winners, setWinners] = useState<Winner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWinners()
  }, [])

  const fetchWinners = async () => {
    try {
      setLoading(true)
      
      // For now, we'll create mock data to show the structure
      // In a real implementation, this would query the database for actual winners
      const mockWinners: Winner[] = [
        {
          id: '1',
          title: 'Digital Dreams',
          description: 'A stunning digital artwork showcasing futuristic cityscapes',
          image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop',
          votes_count: 127,
          contest_title: 'Cyberpunk Art Challenge',
          contest_id: 'contest-1',
          winner_name: 'Alex Chen',
          winner_username: 'alexchen',
          won_date: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          title: 'Neon Nights',
          description: 'Vibrant neon-lit artwork capturing the essence of nightlife',
          image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop',
          votes_count: 98,
          contest_title: 'Neon Art Showdown',
          contest_id: 'contest-2',
          winner_name: 'Maya Rodriguez',
          winner_username: 'mayar',
          won_date: '2024-01-10T00:00:00Z'
        },
        {
          id: '3',
          title: 'Abstract Universe',
          description: 'An abstract representation of cosmic energy and movement',
          image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop',
          votes_count: 156,
          contest_title: 'Abstract Art Competition',
          contest_id: 'contest-3',
          winner_name: 'Jordan Kim',
          winner_username: 'jordank',
          won_date: '2024-01-05T00:00:00Z'
        },
        {
          id: '4',
          title: 'Steampunk Machinery',
          description: 'Intricate steampunk-inspired mechanical artwork',
          image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop',
          votes_count: 89,
          contest_title: 'Steampunk Design Contest',
          contest_id: 'contest-4',
          winner_name: 'Sam Wilson',
          winner_username: 'samw',
          won_date: '2024-01-01T00:00:00Z'
        },
        {
          id: '5',
          title: 'Fantasy Forest',
          description: 'Magical forest scene with glowing creatures and mystical atmosphere',
          image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop',
          votes_count: 203,
          contest_title: 'Fantasy Art Battle',
          contest_id: 'contest-5',
          winner_name: 'Luna Park',
          winner_username: 'lunap',
          won_date: '2023-12-28T00:00:00Z'
        },
        {
          id: '6',
          title: 'Minimalist Geometry',
          description: 'Clean geometric patterns with perfect symmetry and balance',
          image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop',
          votes_count: 142,
          contest_title: 'Minimalist Design Challenge',
          contest_id: 'contest-6',
          winner_name: 'Max Chen',
          winner_username: 'maxc',
          won_date: '2023-12-20T00:00:00Z'
        }
      ]

      setWinners(mockWinners)
    } catch (error) {
      console.error('Error fetching winners:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <SocialNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4" style={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF8C00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              🏆 HALL OF FAME 🏆
            </h1>
            <p className="text-xl text-white/80 mb-6">Celebrating the champions of creative excellence</p>
            <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-yellow-200 text-sm">
                <strong>Legendary Artists:</strong> These are the winners who earned the most votes in their respective contests and have been immortalized in our Hall of Fame.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">{winners.length}</div>
              <div className="text-white/70">Total Winners</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {winners.reduce((sum, winner) => sum + winner.votes_count, 0)}
              </div>
              <div className="text-white/70">Total Votes Received</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {Math.max(...winners.map(w => w.votes_count), 0)}
              </div>
              <div className="text-white/70">Highest Vote Count</div>
            </div>
          </div>

          {/* Winners Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-white text-2xl">Loading champions...</div>
            </div>
          ) : winners.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">No Winners Yet</h2>
                <p className="text-white/80 mb-6">Contest winners will appear here once contests are completed!</p>
                <Link
                  href="/contests"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all inline-block"
                >
                  View Contests
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {winners.map((winner, index) => (
                <div key={winner.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all group">
                  {/* Winner Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-sm">#{index + 1}</span>
                      </div>
                      <span className="text-yellow-400 font-bold text-sm">WINNER</span>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold text-lg">{winner.votes_count}</div>
                      <div className="text-white/60 text-xs">votes</div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={winner.image_url}
                      alt={winner.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2">{winner.title}</h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{winner.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Artist</span>
                      <span className="text-white font-medium">{winner.winner_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Contest</span>
                      <span className="text-cyan-300 font-medium">{winner.contest_title}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Won on</span>
                      <span className="text-white font-medium">{formatDate(winner.won_date)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/submission/${winner.id}`}
                      className="flex-1 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 py-2 px-4 rounded-lg font-medium transition-all text-center"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/contest/${winner.contest_id}`}
                      className="flex-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 py-2 px-4 rounded-lg font-medium transition-all text-center"
                    >
                      View Contest
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-xl p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">Want to Join the Hall of Fame?</h2>
              <p className="text-white/80 mb-6 text-lg">
                Participate in our contests, create amazing artwork, and earn votes from the community. 
                Winners are automatically added to this prestigious Hall of Fame!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contests"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition-all text-lg"
                >
                  View Active Contests
                </Link>
                <Link
                  href="/submit"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition-all text-lg"
                >
                  Submit Your Art
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}