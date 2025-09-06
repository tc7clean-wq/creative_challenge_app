'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

interface JackpotStatsProps {
  userId: string
  showHistoryLink?: boolean
  className?: string
}

export default function JackpotStats({ 
  userId, 
  showHistoryLink = true, 
  className = '' 
}: JackpotStatsProps) {
  const [entryCount, setEntryCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [activeDraw, setActiveDraw] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const supabase = createClient()

  useEffect(() => {
    fetchJackpotData()
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchJackpotData = async () => {
    try {
      setLoading(true)
      
      // Fetch user's current entry count
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_jackpot_entries')
        .eq('id', userId)
        .single()

      if (profile) {
        setEntryCount(profile.current_jackpot_entries || 0)
      }

      // Fetch active draw
      const { data: activeDrawData } = await supabase
        .from('jackpot_draws')
        .select('*')
        .eq('is_active', true)
        .gte('start_date', new Date().toISOString())
        .lte('end_date', new Date().toISOString())
        .single()

      if (activeDrawData) {
        setActiveDraw(activeDrawData)
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

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  if (loading) {
    return (
      <div className={`quantum-glass p-4 rounded-xl ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`quantum-glass p-6 rounded-xl border border-cyan-500/20 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-bold text-white mb-2">
          🎰 Creator Jackpot
        </h3>
        
        {/* Entry Count */}
        <div className="mb-4">
          <div className="text-3xl font-bold text-cyan-400 mb-1">
            {entryCount}
          </div>
          <div className="text-sm text-gray-300">
            {entryCount === 1 ? 'Entry' : 'Entries'}
          </div>
        </div>

        {/* Active Draw Info */}
        {activeDraw && (
          <div className="mb-4 p-3 bg-white/5 rounded-lg">
            <div className="text-lg font-bold text-yellow-400 mb-1">
              {formatCurrency(activeDraw.prize_amount)}
            </div>
            <div className="text-sm text-gray-300">
              {getDaysRemaining(activeDraw.end_date)} days remaining
            </div>
          </div>
        )}

        {/* History Link */}
        {showHistoryLink && (
          <Link
            href="/jackpot"
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View History</span>
            <span>→</span>
          </Link>
        )}
      </div>
    </div>
  )
}
