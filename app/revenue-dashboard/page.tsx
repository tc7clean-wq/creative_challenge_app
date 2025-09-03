'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import NavigationHeader from '@/components/navigation/NavigationHeader'
import type { SupabaseClient } from '@/types/supabase'

interface RevenueData {
  total_revenue: number
  platform_cut: number
  prize_pool_contribution: number
  entry_fees: number
  submission_pins: number
  vote_multipliers: number
  profile_boosts: number
  transaction_count: number
}

interface ContestStats {
  id: string
  title: string
  total_revenue: number
  platform_cut: number
  prize_pool: number
  submission_count: number
  pin_count: number
  multiplier_count: number
  boost_count: number
}

export default function RevenueDashboard() {
  const [revenueData, setRevenueData] = useState<RevenueData>({
    total_revenue: 0,
    platform_cut: 0,
    prize_pool_contribution: 0,
    entry_fees: 0,
    submission_pins: 0,
    vote_multipliers: 0,
    profile_boosts: 0,
    transaction_count: 0
  })
  const [contestStats, setContestStats] = useState<ContestStats[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    // Initialize Supabase client
    const client = createClient()
    setSupabase(client)
  }, [])

  useEffect(() => {
    if (!supabase) return

    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Fetch contests for public viewing
        const { data: contestsData } = await supabase
          .from('contests')
          .select('*')
          .order('created_at', { ascending: false })

        // Fetch revenue data for transparency
        const { data: revenueData } = await supabase
          .from('revenue_transactions')
          .select('*')

        if (revenueData) {
          const totalRevenue = revenueData.reduce((sum: number, t: { amount_paid: string | number }) => sum + Number(t.amount_paid), 0)
          const platformCut = revenueData.reduce((sum: number, t: { platform_cut: string | number }) => sum + Number(t.platform_cut), 0)
          const prizePoolContribution = revenueData.reduce((sum: number, t: { prize_pool_contribution: string | number }) => sum + Number(t.prize_pool_contribution), 0)
          
          const entryFees = revenueData.filter(t => t.transaction_type === 'entry_fee').reduce((sum: number, t: { amount_paid: string | number }) => sum + Number(t.amount_paid), 0)
          const submissionPins = revenueData.filter(t => t.transaction_type === 'submission_pin').reduce((sum: number, t: { amount_paid: string | number }) => sum + Number(t.amount_paid), 0)
          const voteMultipliers = revenueData.filter(t => t.transaction_type === 'vote_multiplier').reduce((sum: number, t: { amount_paid: string | number }) => sum + Number(t.amount_paid), 0)
          const profileBoosts = revenueData.filter(t => t.transaction_type === 'profile_boost').reduce((sum: number, t: { amount_paid: string | number }) => sum + Number(t.amount_paid), 0)

          setRevenueData({
            total_revenue: totalRevenue,
            platform_cut: platformCut,
            prize_pool_contribution: prizePoolContribution,
            entry_fees: entryFees,
            submission_pins: submissionPins,
            vote_multipliers: voteMultipliers,
            profile_boosts: profileBoosts,
            transaction_count: revenueData.length
          })
        }

        // Fetch contest-specific stats for transparency
        const contestStatsData = await Promise.all(
          (contestsData || []).map(async (contest) => {
            const { data: contestRevenue } = await supabase
              .from('revenue_transactions')
              .select('*')
              .eq('contest_id', contest.id)

            const { data: pins } = await supabase
              .from('submission_pins')
              .select('id')
              .eq('status', 'active')

            const { data: multipliers } = await supabase
              .from('vote_multipliers')
              .select('id')
              .eq('contest_id', contest.id)

            const { data: boosts } = await supabase
              .from('profile_boosts')
              .select('id')
              .eq('status', 'active')

            const contestTotalRevenue = contestRevenue?.reduce((sum, t) => sum + Number(t.amount_paid), 0) || 0
            const contestPlatformCut = contestRevenue?.reduce((sum, t) => sum + Number(t.platform_cut), 0) || 0
            const contestPrizePool = contestRevenue?.reduce((sum, t) => sum + Number(t.prize_pool_contribution), 0) || 0

            return {
              id: contest.id,
              title: contest.title,
              total_revenue: contestTotalRevenue,
              platform_cut: contestPlatformCut,
              prize_pool: contestPrizePool,
              submission_count: contest.submission_count || 0,
              pin_count: pins?.length || 0,
              multiplier_count: multipliers?.length || 0,
              boost_count: boosts?.length || 0
            }
          })
        )

        setContestStats(contestStatsData)
      }
      setLoading(false)
    }
    
    fetchData()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please sign in to view revenue transparency</h1>
          <a href="/auth" className="text-blue-400 hover:text-blue-300">Sign In</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <NavigationHeader />
      
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">📊</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Revenue Transparency</h1>
                <p className="text-white/60 text-sm">See exactly how your money is distributed fairly</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Fairness Promise */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              🎯 Our Fairness Promise
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">💰</div>
              <div className="text-white font-semibold mb-1">60% to Prize Pool</div>
              <div className="text-white/60 text-sm">Entry fees go directly to winners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-white font-semibold mb-1">80% to Prize Pool</div>
              <div className="text-white/60 text-sm">Pins, multipliers, and boosts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">⚖️</div>
              <div className="text-white font-semibold mb-1">Transparent</div>
              <div className="text-white/60 text-sm">See every dollar tracked</div>
            </div>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              💰 Total Platform Revenue
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-green-400 mb-1">
                ${revenueData.total_revenue.toLocaleString()}
              </div>
              <div className="text-white/60 text-sm">Total Revenue</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                ${revenueData.platform_cut.toLocaleString()}
              </div>
              <div className="text-white/60 text-sm">Platform Operations</div>
              <div className="text-white/40 text-xs">
                {revenueData.total_revenue > 0 ? Math.round((revenueData.platform_cut / revenueData.total_revenue) * 100) : 0}% of total
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                ${revenueData.prize_pool_contribution.toLocaleString()}
              </div>
              <div className="text-white/60 text-sm">Paid to Winners</div>
              <div className="text-white/40 text-xs">
                {revenueData.total_revenue > 0 ? Math.round((revenueData.prize_pool_contribution / revenueData.total_revenue) * 100) : 0}% of total
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {revenueData.transaction_count}
              </div>
              <div className="text-white/60 text-sm">Total Transactions</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-500/30">
              <div className="text-lg font-bold text-blue-400 mb-1">
                ${revenueData.entry_fees.toLocaleString()}
              </div>
              <div className="text-white/60 text-sm">Entry Fees</div>
              <div className="text-white/40 text-xs">60% to prize pool</div>
            </div>
            
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-4 border border-pink-500/30">
              <div className="text-lg font-bold text-pink-400 mb-1">
                ${revenueData.submission_pins.toLocaleString()}
              </div>
              <div className="text-white/60 text-sm">Submission Pins</div>
              <div className="text-white/40 text-xs">80% to prize pool</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30">
              <div className="text-lg font-bold text-green-400 mb-1">
                ${revenueData.vote_multipliers.toLocaleString()}
              </div>
              <div className="text-white/60 text-sm">Vote Multipliers</div>
              <div className="text-white/40 text-xs">80% to prize pool</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
              <div className="text-lg font-bold text-purple-400 mb-1">
                ${revenueData.profile_boosts.toLocaleString()}
              </div>
              <div className="text-white/60 text-sm">Profile Boosts</div>
              <div className="text-white/40 text-xs">80% to prize pool</div>
            </div>
          </div>
        </div>

        {/* Contest Performance */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              📊 Contest-by-Contest Breakdown
            </span>
          </h2>
          
          <div className="space-y-4">
            {contestStats.map((contest) => (
              <div key={contest.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{contest.title}</h3>
                    <p className="text-white/60 text-sm">
                      {contest.submission_count} submissions • {contest.pin_count} pins • {contest.multiplier_count} multipliers • {contest.boost_count} boosts
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-400">
                      ${contest.total_revenue.toLocaleString()}
                    </div>
                    <div className="text-white/60 text-sm">Total Revenue</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-blue-400 font-bold">${contest.platform_cut.toLocaleString()}</div>
                    <div className="text-white/60">Platform Cut</div>
                    <div className="text-white/40 text-xs">
                      {contest.total_revenue > 0 ? Math.round((contest.platform_cut / contest.total_revenue) * 100) : 0}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 font-bold">${contest.prize_pool.toLocaleString()}</div>
                    <div className="text-white/60">Prize Pool</div>
                    <div className="text-white/40 text-xs">
                      {contest.total_revenue > 0 ? Math.round((contest.prize_pool / contest.total_revenue) * 100) : 0}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-bold">
                      {contest.total_revenue > 0 ? Math.round((contest.prize_pool / contest.total_revenue) * 100) : 0}%
                    </div>
                    <div className="text-white/60">Winner Share</div>
                    <div className="text-white/40 text-xs">Fair distribution</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contest Suggestion */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              💡 Suggest a Contest
            </span>
          </h2>
          
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-500/30">
            <p className="text-white/80 mb-4">
              Have an idea for a contest? We&apos;d love to hear it! Submit your suggestion and we&apos;ll review it quickly. 
              If approved, you can even become a moderator for that specific contest.
            </p>
            <a 
              href="/admin/create-contest" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
            >
              <span>🏆</span>
              Suggest New Contest
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
