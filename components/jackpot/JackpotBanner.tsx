'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

interface JackpotDraw {
  draw_id: string
  draw_name: string
  prize_amount: number
  start_date: string
  end_date: string
  is_active: boolean
}

export default function JackpotBanner() {
  const [activeDraw, setActiveDraw] = useState<JackpotDraw | null>(null)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchActiveDraw()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activeDraw) {
      const timer = setInterval(updateCountdown, 1000)
      return () => clearInterval(timer)
    }
  }, [activeDraw]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchActiveDraw = async () => {
    try {
      setLoading(true)
      
      const { data: activeDrawData } = await supabase
        .from('jackpot_draws')
        .select('*')
        .eq('is_active', true)
        .gte('start_date', new Date().toISOString())
        .lte('end_date', new Date().toISOString())
        .single()

      if (activeDrawData) {
        setActiveDraw(activeDrawData)
        updateCountdown(activeDrawData.end_date)
      } else {
        // Create a default active draw if none exists
        const defaultDraw = {
          draw_id: 'default',
          draw_name: 'Monthly Creator Jackpot',
          prize_amount: 1000,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true
        }
        setActiveDraw(defaultDraw)
        updateCountdown(defaultDraw.end_date)
      }
    } catch (error) {
      console.error('Error fetching active draw:', error)
      // Create a default active draw on error
      const defaultDraw = {
        draw_id: 'default',
        draw_name: 'Monthly Creator Jackpot',
        prize_amount: 1000,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true
      }
      setActiveDraw(defaultDraw)
      updateCountdown(defaultDraw.end_date)
    } finally {
      setLoading(false)
    }
  }

  const updateCountdown = (endDate?: string) => {
    if (!endDate && !activeDraw) return
    
    const end = new Date(endDate || activeDraw!.end_date)
    const now = new Date()
    const diff = end.getTime() - now.getTime()

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    } else {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
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

  const sanitizeText = (text: string) => {
    return text
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, 100) // Limit length
  }

  if (loading) {
    return (
      <div className="quantum-glass-ultra mx-4 mb-8 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  if (!activeDraw) {
    return (
      <div className="quantum-glass-ultra mx-4 mb-8 rounded-2xl p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">🎰 Creator Jackpot</h2>
        <p className="text-gray-300 mb-4">No active jackpot draw at the moment</p>
        <Link
          href="/jackpot"
          className="quantum-button px-6 py-2"
        >
          Learn More
        </Link>
      </div>
    )
  }

  return (
    <div className="quantum-glass-ultra mx-4 mb-8 rounded-2xl p-6 border border-cyan-500/20">
              <div className="text-center">
          <h2 className="text-3xl font-bold gradient-holographic-text mb-2">
            {sanitizeText(activeDraw.draw_name)}
          </h2>
        
        {/* Prize Amount */}
        <div className="text-5xl font-bold text-cyan-400 mb-4">
          {formatCurrency(activeDraw.prize_amount)}
        </div>

        {/* Countdown Timer */}
        <div className="mb-6">
          <p className="text-gray-300 mb-4">Time Remaining:</p>
          <div className="flex justify-center gap-4">
            <div className="bg-white/10 rounded-lg p-3 min-w-[80px]">
              <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
              <div className="text-xs text-gray-300">Days</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 min-w-[80px]">
              <div className="text-2xl font-bold text-white">{timeLeft.hours}</div>
              <div className="text-xs text-gray-300">Hours</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 min-w-[80px]">
              <div className="text-2xl font-bold text-white">{timeLeft.minutes}</div>
              <div className="text-xs text-gray-300">Minutes</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 min-w-[80px]">
              <div className="text-2xl font-bold text-white">{timeLeft.seconds}</div>
              <div className="text-xs text-gray-300">Seconds</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/jackpot"
            className="quantum-button px-8 py-3 text-lg"
          >
            View Jackpot Details
          </Link>
          <Link
            href="/submit"
            className="quantum-button-secondary px-8 py-3 text-lg"
          >
            Submit Artwork
          </Link>
        </div>

        {/* How to Earn Entries */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <p className="text-sm text-gray-300 mb-2">Earn entries by:</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
            <span>🥇 Winning competitions</span>
            <span>📝 Submitting artwork</span>
            <span>👍 Community votes</span>
            <span>🔑 Daily login</span>
          </div>
        </div>
      </div>
    </div>
  )
}
