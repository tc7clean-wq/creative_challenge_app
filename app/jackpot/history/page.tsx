'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import NavigationHeader from '@/components/navigation/NavigationHeader'
import ParticleSystem from '@/components/quantum/ParticleSystem'

interface JackpotEntry {
  entry_id: string
  source_reason: string
  entry_count: number
  created_at: string
  contests?: {
    title: string
  } | null
}

export default function JackpotHistoryPage() {
  const [entries, setEntries] = useState<JackpotEntry[]>([])
  const [totalEntries, setTotalEntries] = useState(0)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string } | null>(null) // eslint-disable-line @typescript-eslint/no-unused-vars
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        fetchJackpotHistory(user.id)
      } else {
        window.location.href = '/auth-simple'
      }
    } catch (error) {
      console.error('Error checking user:', error)
    }
  }

  const fetchJackpotHistory = async (userId: string) => {
    try {
      setLoading(true)
      
      // Fetch user's jackpot entries
      const { data: entriesData } = await supabase
        .from('jackpot_entries')
        .select(`
          entry_id,
          source_reason,
          entry_count,
          created_at,
          contests:competition_id (
            title
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      // Fetch user's current total entries
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_jackpot_entries')
        .eq('id', userId)
        .single()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setEntries((entriesData || []).map((entry: any) => ({
        ...entry,
        contests: entry.contests?.[0] || null
      })))
      setTotalEntries(profile?.current_jackpot_entries || 0)
    } catch (error) {
      console.error('Error fetching jackpot history:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatSourceReason = (reason: string) => {
    const reasonMap: { [key: string]: { emoji: string; text: string; color: string } } = {
      'FIRST_PLACE_WIN': { emoji: '🥇', text: 'First Place Win', color: 'text-yellow-400' },
      'SECOND_PLACE_WIN': { emoji: '🥈', text: 'Second Place Win', color: 'text-gray-300' },
      'THIRD_PLACE_WIN': { emoji: '🥉', text: 'Third Place Win', color: 'text-orange-400' },
      'BASE_SUBMISSION': { emoji: '📝', text: 'Artwork Submission', color: 'text-blue-400' },
      'COMMUNITY_VOTE': { emoji: '👍', text: 'Community Vote', color: 'text-green-400' },
      'PEOPLES_CHOICE': { emoji: '👑', text: 'People\'s Choice', color: 'text-purple-400' },
      'SOCIAL_SHARE': { emoji: '📱', text: 'Social Share', color: 'text-pink-400' },
      'DAILY_LOGIN': { emoji: '🔑', text: 'Daily Login', color: 'text-cyan-400' },
      'REFERRAL': { emoji: '👥', text: 'Referral', color: 'text-indigo-400' },
      'MANUAL_ENTRY': { emoji: '🎁', text: 'Bonus Entry', color: 'text-red-400' }
    }
    return reasonMap[reason] || { emoji: '❓', text: reason, color: 'text-gray-400' }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading jackpot history...</p>
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
        <NavigationHeader />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="quantum-glass-ultra mb-8 rounded-2xl p-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold gradient-holographic-text mb-2">
                Jackpot History
              </h1>
              <p className="text-gray-300">
                Track all your jackpot entries and see how you earned them
              </p>
              <div className="mt-4 text-2xl font-bold text-cyan-400">
                Total Entries: {totalEntries}
              </div>
            </div>
          </div>

          {/* Entries List */}
          <div className="quantum-glass rounded-2xl p-6">
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎰</div>
                <h3 className="text-xl font-bold text-white mb-2">No Entries Yet</h3>
                <p className="text-gray-300 mb-6">
                  Start participating in contests and activities to earn jackpot entries!
                </p>
                <a
                  href="/submit"
                  className="quantum-button px-6 py-3"
                >
                  Submit Artwork
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => {
                  const reasonInfo = formatSourceReason(entry.source_reason)
                  return (
                    <div
                      key={entry.entry_id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{reasonInfo.emoji}</div>
                        <div>
                          <div className={`font-medium ${reasonInfo.color}`}>
                            {reasonInfo.text}
                          </div>
                          {entry.contests && (
                            <div className="text-sm text-gray-400">
                              {entry.contests.title}
                            </div>
                          )}
                          <div className="text-xs text-gray-500">
                            {formatDate(entry.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-cyan-400">
                          +{entry.entry_count}
                        </div>
                        <div className="text-xs text-gray-400">
                          {entry.entry_count === 1 ? 'entry' : 'entries'}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <a
              href="/jackpot"
              className="quantum-button px-8 py-3"
            >
              Back to Jackpot
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
