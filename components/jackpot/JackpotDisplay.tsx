'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface JackpotDraw {
  draw_id: string
  draw_name: string
  prize_amount: number
  start_date: string
  end_date: string
  days_remaining: number
}

interface JackpotEntries {
  entries: Array<{
    entry_id: string
    source_reason: string
    entry_count: number
    created_at: string
    contests?: {
      title: string
    } | null
  }>
  total_entries: number
}

export default function JackpotDisplay() {
  const [activeDraw, setActiveDraw] = useState<JackpotDraw | null>(null)
  const [userEntries, setUserEntries] = useState<JackpotEntries | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchJackpotData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchJackpotData = async () => {
    try {
      setLoading(true)
      
      // Fetch active draw
      const { data: activeDrawData } = await supabase
        .from('jackpot_draws')
        .select('*')
        .eq('is_active', true)
        .gte('start_date', new Date().toISOString())
        .lte('end_date', new Date().toISOString())
        .single()

      if (activeDrawData) {
        const daysRemaining = Math.ceil(
          (new Date(activeDrawData.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )
        
        setActiveDraw({
          ...activeDrawData,
          days_remaining: daysRemaining
        })
      }

      // Fetch user entries
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
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
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        const { data: profile } = await supabase
          .from('profiles')
          .select('current_jackpot_entries')
          .eq('id', user.id)
          .single()

        setUserEntries({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          entries: (entriesData || []).map((entry: any) => ({
            ...entry,
            contests: entry.contests?.[0] || null
          })),
          total_entries: profile?.current_jackpot_entries || 0
        })
      }
    } catch (error) {
      console.error('Error fetching jackpot data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatSourceReason = (reason: string) => {
    const reasonMap: { [key: string]: string } = {
      'FIRST_PLACE_WIN': '🥇 First Place Win',
      'SECOND_PLACE_WIN': '🥈 Second Place Win',
      'THIRD_PLACE_WIN': '🥉 Third Place Win',
      'BASE_SUBMISSION': '📝 Artwork Submission',
      'COMMUNITY_VOTE': '👍 Community Vote',
      'SOCIAL_SHARE': '📱 Social Share',
      'DAILY_LOGIN': '🔑 Daily Login',
      'REFERRAL': '👥 Referral',
      'MANUAL_ENTRY': '🎁 Bonus Entry'
    }
    return reasonMap[reason] || 'Unknown Entry'
  }

  const sanitizeText = (text: string) => {
    return text
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, 100) // Limit length
  }

  if (loading) {
    return (
      <div className="quantum-glass p-6 rounded-2xl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Active Jackpot Draw */}
      {activeDraw ? (
        <div className="quantum-glass p-6 rounded-2xl border border-cyan-500/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold gradient-holographic-text mb-2">
              {sanitizeText(activeDraw.draw_name)}
            </h2>
            <div className="text-4xl font-bold text-cyan-400 mb-2">
              {formatCurrency(activeDraw.prize_amount)}
            </div>
            <div className="text-gray-300 mb-4">
              {activeDraw.days_remaining > 0 
                ? `${activeDraw.days_remaining} days remaining`
                : 'Draw in progress'
              }
            </div>
            {userEntries && (
              <div className="text-lg text-white">
                Your Entries: <span className="text-yellow-400 font-bold">{userEntries.total_entries}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="quantum-glass p-6 rounded-2xl text-center">
          <h2 className="text-xl font-bold text-white mb-2">No Active Jackpot</h2>
          <p className="text-gray-300">Check back soon for the next jackpot draw!</p>
        </div>
      )}

      {/* User's Entry History */}
      {userEntries && userEntries.entries.length > 0 && (
        <div className="quantum-glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Your Entry History</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {userEntries.entries.map((entry) => (
              <div key={entry.entry_id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">
                    {formatSourceReason(entry.source_reason)}
                  </div>
                  {entry.contests && (
                    <div className="text-gray-400 text-sm">
                      {entry.contests.title}
                    </div>
                  )}
                  <div className="text-gray-500 text-xs">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-cyan-400 font-bold">
                  +{entry.entry_count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
