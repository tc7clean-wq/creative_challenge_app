'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import JackpotDisplay from '@/components/jackpot/JackpotDisplay'
import ParticleSystem from '@/components/quantum/ParticleSystem'

export default function JackpotPage() {
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading jackpot...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Quantum Background */}
      <div className="absolute inset-0">
        <div className="quantum-grid absolute inset-0"></div>
        <ParticleSystem particleCount={15} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="quantum-glass-ultra mx-4 mt-4 rounded-2xl p-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold gradient-holographic-text mb-2">
              Creator Jackpot
            </h1>
            <p className="text-gray-300">
              Earn entries through your creative achievements and win amazing prizes!
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 max-w-4xl mx-auto">
          {user ? (
            <JackpotDisplay />
          ) : (
            <div className="quantum-glass p-8 rounded-2xl text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
              <p className="text-gray-300 mb-6">
                You need to be signed in to view your jackpot entries and participate in draws.
              </p>
              <a
                href="/auth-simple"
                className="quantum-button px-8 py-3 text-lg"
              >
                Sign In Now
              </a>
            </div>
          )}
        </div>

        {/* How It Works Section */}
        <div className="p-4 max-w-6xl mx-auto">
          <div className="quantum-glass p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              How to Earn Jackpot Entries
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🥇</div>
                <h3 className="text-xl font-bold text-white mb-2">Win Competitions</h3>
                <p className="text-gray-300">
                  First place: 10 entries<br/>
                  Second place: 5 entries<br/>
                  Third place: 3 entries
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-white mb-2">Submit Artwork</h3>
                <p className="text-gray-300">
                  Each artwork submission earns you 1 entry into the monthly jackpot draw.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">👍</div>
                <h3 className="text-xl font-bold text-white mb-2">Community Engagement</h3>
                <p className="text-gray-300">
                  Vote on artwork, share on social media, and refer friends to earn bonus entries.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔑</div>
                <h3 className="text-xl font-bold text-white mb-2">Daily Login</h3>
                <p className="text-gray-300">
                  Log in daily to earn 1 entry per day. Consistency pays off!
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-white mb-2">Refer Friends</h3>
                <p className="text-gray-300">
                  Refer friends to the platform and earn 5 entries when they sign up.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-xl font-bold text-white mb-2">Special Events</h3>
                <p className="text-gray-300">
                  Participate in special events and challenges for bonus entry opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
