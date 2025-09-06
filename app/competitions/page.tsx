'use client'

import { useState, useEffect } from 'react'
import NavigationHeader from '@/components/navigation/NavigationHeader'
import Link from 'next/link'

interface Competition {
  id: string
  title: string
  description: string
  theme: string
  start_date: string
  end_date: string
  status: 'active' | 'upcoming' | 'ended'
  submission_count: number
  prize_description: string
  image_url?: string
}

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        // For now, we'll use mock data since we haven't set up the competitions table yet
        const mockCompetitions: Competition[] = [
          {
            id: '1',
            title: 'Weekly AI Art Challenge',
            description: 'Create stunning AI art based on the weekly theme and compete for exclusive platform rewards!',
            theme: 'Cyberpunk Dreams',
            start_date: '2024-01-15',
            end_date: '2024-01-22',
            status: 'active',
            submission_count: 47,
            prize_description: 'Winner gets exclusive "Cyberpunk Master" badge, featured profile border, and early access to new features!',
            image_url: '/api/placeholder/400/200'
          },
          {
            id: '2',
            title: 'Monthly Masterpiece',
            description: 'Our biggest monthly competition with amazing rewards for the most creative AI artists.',
            theme: 'Futuristic Landscapes',
            start_date: '2024-02-01',
            end_date: '2024-02-28',
            status: 'upcoming',
            submission_count: 0,
            prize_description: 'Winner gets "Master Artist" badge, gold profile border, and featured artist spotlight!',
            image_url: '/api/placeholder/400/200'
          },
          {
            id: '3',
            title: 'Community Choice',
            description: 'Vote for your favorite AI art and the community decides the winner!',
            theme: 'Abstract Emotions',
            start_date: '2024-01-01',
            end_date: '2024-01-14',
            status: 'ended',
            submission_count: 89,
            prize_description: 'Winner gets "Community Favorite" badge and special recognition!',
            image_url: '/api/placeholder/400/200'
          }
        ]
        
        setCompetitions(mockCompetitions)
      } catch (error) {
        console.error('Error fetching competitions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompetitions()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-400/30'
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30'
      case 'ended':
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Live Now'
      case 'upcoming':
        return 'Coming Soon'
      case 'ended':
        return 'Ended'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white/80">Loading competitions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Futuristic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          <div className="grid-pattern"></div>
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-500/20 rounded-full blur-xl animate-float-slow"></div>
      </div>
      
      <div className="relative z-10">
        <NavigationHeader />
        
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-wider" 
                style={{
                  fontFamily: 'var(--font-bebas-neue), "Arial Black", "Impact", sans-serif',
                  textTransform: 'uppercase',
                  fontWeight: 900,
                  background: 'linear-gradient(45deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)',
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradientShift 4s ease-in-out infinite'
                }}>
              COMPETITIONS
            </h1>
            <p className="text-2xl text-white/80 max-w-3xl mx-auto">
              Participate in professional AI art competitions and earn recognition for your creative achievements
            </p>
          </div>

          {/* Competitions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {competitions.map((competition) => (
              <div key={competition.id} className="group relative cyber-card rounded-3xl p-8 transition-all duration-500 hover:scale-105 cyber-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative">
                  {/* Status Badge */}
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border mb-4 ${getStatusColor(competition.status)}`}>
                    {getStatusText(competition.status)}
                  </div>
                  
                  {/* Competition Image */}
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mb-6 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl">🏆</div>
                    </div>
                  </div>
                  
                  {/* Competition Details */}
                  <h3 className="text-2xl font-bold text-white mb-3">{competition.title}</h3>
                  <p className="text-white/70 mb-4 line-clamp-3">{competition.description}</p>
                  
                  {/* Theme */}
                  <div className="mb-4">
                    <span className="text-cyan-400 font-semibold">Theme: </span>
                    <span className="text-white">{competition.theme}</span>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
                    <span>👥 {competition.submission_count} submissions</span>
                    <span>📅 {competition.end_date}</span>
                  </div>
                  
                  {/* Prize Description */}
                  <div className="mb-6">
                    <p className="text-yellow-400 font-semibold text-sm mb-2">🏅 Prize:</p>
                    <p className="text-white/80 text-sm">{competition.prize_description}</p>
                  </div>

                  {/* Jackpot Entries */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg border border-purple-400/30">
                    <p className="text-purple-300 font-semibold text-sm mb-2">🎰 Jackpot Entries:</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-yellow-400 font-bold">🥇 1st</div>
                        <div className="text-white">100 entries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-300 font-bold">🥈 2nd</div>
                        <div className="text-white">50 entries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-orange-400 font-bold">🥉 3rd</div>
                        <div className="text-white">25 entries</div>
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-cyan-400 font-bold">📝 Submission</div>
                      <div className="text-white">1 entry</div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  {competition.status === 'active' ? (
                    <Link
                      href={`/competitions/${competition.id}`}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl text-center transition-all duration-300 hover:scale-105"
                    >
                      Enter Competition
                    </Link>
                  ) : competition.status === 'upcoming' ? (
                    <button
                      disabled
                      className="w-full bg-gray-600 text-gray-300 font-bold py-3 px-6 rounded-xl text-center cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  ) : (
                    <Link
                      href={`/competitions/${competition.id}`}
                      className="w-full bg-gray-600 text-white font-bold py-3 px-6 rounded-xl text-center transition-all duration-300 hover:scale-105"
                    >
                      View Results
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 mb-16">
            <h2 className="text-4xl font-bold text-center text-white mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-xl font-bold text-white mb-3">1. Create Art</h3>
                <p className="text-white/70">Use any AI art generator to create artwork based on the competition theme</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">📤</div>
                <h3 className="text-xl font-bold text-white mb-3">2. Submit</h3>
                <p className="text-white/70">Upload your creation and add a description explaining your artistic vision</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-white mb-3">3. Win Rewards</h3>
                <p className="text-white/70">Get votes from the community and win exclusive badges and platform features</p>
              </div>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-8">Platform Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
                <div className="text-4xl mb-3">🥇</div>
                <h3 className="text-lg font-bold text-white mb-2">Winner Badges</h3>
                <p className="text-white/70 text-sm">Exclusive badges for competition winners</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/30">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="text-lg font-bold text-white mb-2">Profile Features</h3>
                <p className="text-white/70 text-sm">Special borders and profile enhancements</p>
              </div>
              <div className="cyber-card rounded-2xl p-6 cyber-glow">
                <div className="text-4xl mb-3">🌟</div>
                <h3 className="text-lg font-bold text-white mb-2">Featured Spotlights</h3>
                <p className="text-white/70 text-sm">Get featured on the homepage and gallery</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-lg font-bold text-white mb-2">Early Access</h3>
                <p className="text-white/70 text-sm">Access to new features before everyone else</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
