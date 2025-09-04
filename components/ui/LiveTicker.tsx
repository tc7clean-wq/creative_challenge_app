'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function LiveTicker() {
  const [prizePool, setPrizePool] = useState(50000)
  const [recentActivity, setRecentActivity] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPrizeData()
    const interval = setInterval(fetchPrizeData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchPrizeData = async () => {
    try {
      const supabase = createClient()
      
      // Get total revenue from crypto payments and Stripe
      const { data: cryptoRevenue } = await supabase
        .from('revenue_transactions')
        .select('amount')
        .eq('status', 'completed')

      const { data: stripeRevenue } = await supabase
        .from('revenue_transactions')
        .select('amount')
        .eq('payment_method', 'stripe')
        .eq('status', 'completed')

      const cryptoTotal = cryptoRevenue?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0
      const stripeTotal = stripeRevenue?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0
      const totalPrizePool = cryptoTotal + stripeTotal + 50000 // Base prize pool

      setPrizePool(totalPrizePool)

      // Get recent activity
      const { data: recentSubmissions } = await supabase
        .from('submissions')
        .select('title, profiles!inner(username)')
        .order('created_at', { ascending: false })
        .limit(5)

            const activities = recentSubmissions?.map(sub => {
        const profile = Array.isArray(sub.profiles) ? sub.profiles[0] : sub.profiles
        return `${profile?.username || 'Artist'} submitted "${sub.title}"`
      }) || []

      setRecentActivity(activities)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching prize data:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-2 px-4 overflow-hidden">
        <div className="animate-pulse">Loading prize data...</div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-2 px-4 overflow-hidden relative">
      <div className="flex items-center space-x-8 animate-scroll">
        {/* Prize Pool */}
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="font-bold text-lg">💰</span>
          <span className="font-bold text-lg">Prize Pool: ${prizePool.toLocaleString()}</span>
        </div>

        {/* Recent Activity */}
        {recentActivity.map((activity, index) => (
          <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
            <span className="font-bold text-lg">🎨</span>
            <span className="text-sm">{activity}</span>
          </div>
        ))}

        {/* Repeat for continuous scroll */}
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="font-bold text-lg">💰</span>
          <span className="font-bold text-lg">Prize Pool: ${prizePool.toLocaleString()}</span>
        </div>

        {recentActivity.map((activity, index) => (
          <div key={`repeat-${index}`} className="flex items-center space-x-2 whitespace-nowrap">
            <span className="font-bold text-lg">🎨</span>
            <span className="text-sm">{activity}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
