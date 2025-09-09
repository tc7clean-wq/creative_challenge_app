'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import SocialNavbar from '@/components/layout/SocialNavbar'
import type { SupabaseClient } from '@supabase/supabase-js'

interface Contest {
  id: string
  title: string
  theme: string
  status: string
  start_date: string
  end_date: string
  prize_pool: number
  submission_count: number
  created_at: string
}

interface CategoryVote {
  id: string
  category: string
  vote_count: number
}

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

interface RevenueTransaction {
  amount_paid: string | number
  platform_cut: string | number
  prize_pool_contribution: string | number
  transaction_type: string
}

export default function AdminDashboard() {
  const [contests, setContests] = useState<Contest[]>([])
  const [categoryVotes, setCategoryVotes] = useState<CategoryVote[]>([])
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
  const [isAdmin, setIsAdmin] = useState<{
    canCreateContests: boolean;
    canManagePayouts: boolean;
    canManagePlatform: boolean;
  }>({
    canCreateContests: false,
    canManagePayouts: false,
    canManagePlatform: false
  })
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
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()
        
        // Controlled admin access - only authorized users can manage platform
        const canCreateContests = true
        const canManagePayouts = profile?.is_admin || (user.email && user.email.endsWith('@creativechallenge.app'))
        const canManagePlatform = profile?.is_admin || (user.email && user.email.endsWith('@creativechallenge.app'))
        
        setIsAdmin({
          canCreateContests,
          canManagePayouts,
          canManagePlatform
        })

        if (canManagePlatform) {
          // Fetch contests
          const { data: contestsData } = await supabase
            .from('contests')
            .select('*')
            .order('created_at', { ascending: false })

          setContests(contestsData || [])

          // Fetch category votes
          const { data: votesData } = await supabase
            .from('category_votes')
            .select('*')
            .order('vote_count', { ascending: false })

          setCategoryVotes(votesData || [])

          // Fetch revenue data
          const { data: revenueData } = await supabase
            .from('revenue_transactions')
            .select('*')

          if (revenueData) {
            const totalRevenue = revenueData.reduce((sum: number, t: RevenueTransaction) => sum + Number(t.amount_paid), 0)
            const platformCut = revenueData.reduce((sum: number, t: RevenueTransaction) => sum + Number(t.platform_cut), 0)
            const prizePoolContribution = revenueData.reduce((sum: number, t: RevenueTransaction) => sum + Number(t.prize_pool_contribution), 0)
            
            const entryFees = revenueData.filter(t => t.transaction_type === 'entry_fee').reduce((sum: number, t: RevenueTransaction) => sum + Number(t.amount_paid), 0)
            const submissionPins = revenueData.filter(t => t.transaction_type === 'submission_pin').reduce((sum: number, t: RevenueTransaction) => sum + Number(t.amount_paid), 0)
            const voteMultipliers = revenueData.filter(t => t.transaction_type === 'vote_multiplier').reduce((sum: number, t: RevenueTransaction) => sum + Number(t.amount_paid), 0)
            const profileBoosts = revenueData.filter(t => t.transaction_type === 'profile_boost').reduce((sum: number, t: RevenueTransaction) => sum + Number(t.amount_paid), 0)

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

          // Fetch contest-specific stats
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
      }
      setLoading(false)
    }
    
    fetchData()
  }, [supabase])

  const addCategoryOption = async (category: string) => {
    if (!supabase) return
    const { error } = await supabase
      .from('category_votes')
      .insert([{ category, vote_count: 0 }])

    if (!error) {
      setCategoryVotes(prev => [...prev, { id: Date.now().toString(), category, vote_count: 0 }])
    }
  }

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
          <h1 className="text-2xl font-bold text-white mb-4">Please sign in to access this page</h1>
          <Link href="/login" className="text-blue-400 hover:text-blue-300">Sign In</Link>
        </div>
      </div>
    )
  }

  if (!isAdmin.canManagePlatform) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/60 mb-4">You don&apos;t have permission to access this page.</p>
          <Link href="/authenticated-home" className="text-blue-400 hover:text-blue-300">Return to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <SocialNavbar />
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-white/60 text-sm">Manage contests and community</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/authenticated-home"
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                View Site
              </Link>
              <button 
                onClick={() => {
                  const supabase = createClient()
                  supabase.auth.signOut()
                  window.location.href = '/auth'
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Revenue Overview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              💰 Revenue Analytics
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
              <div className="text-white/60 text-sm">Your Platform Cut</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                ${revenueData.prize_pool_contribution.toLocaleString()}
              </div>
              <div className="text-white/60 text-sm">Prize Pool Contribution</div>
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
              📊 Contest Performance
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
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 font-bold">${contest.prize_pool.toLocaleString()}</div>
                    <div className="text-white/60">Prize Pool</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-bold">
                      {contest.total_revenue > 0 ? Math.round((contest.platform_cut / contest.total_revenue) * 100) : 0}%
                    </div>
                    <div className="text-white/60">Platform %</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/create-contest"
            className="group relative p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-white font-semibold mb-2">Create Contest</h3>
              <p className="text-white/60 text-sm">Start a new creative competition</p>
            </div>
          </Link>

          <div className="group relative p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-white font-semibold mb-2">Analytics</h3>
              <p className="text-white/60 text-sm">View platform statistics</p>
            </div>
          </div>

          <div className="group relative p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-white font-semibold mb-2">Manage Users</h3>
              <p className="text-white/60 text-sm">User management tools</p>
            </div>
          </div>
        </div>

        {/* Active Contests */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Active Contests</h2>
          <div className="space-y-4">
            {contests.map((contest) => (
              <div key={contest.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-semibold">{contest.title}</h3>
                    <p className="text-white/60 text-sm">{contest.theme}</p>
                    <p className="text-white/40 text-xs">
                      {new Date(contest.start_date).toLocaleDateString()} - {new Date(contest.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold">${contest.prize_pool.toLocaleString()}</div>
                    <div className="text-white/60 text-sm">{contest.submission_count} submissions</div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      contest.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {contest.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Voting */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Next Contest Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-4">Current Votes</h3>
              <div className="space-y-3">
                {categoryVotes.map((vote) => (
                  <div key={vote.id} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                    <span className="text-white">{vote.category}</span>
                    <span className="text-yellow-400 font-bold">{vote.vote_count} votes</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Add New Category</h3>
              <div className="space-y-3">
                {['Abstract Art', 'Portrait Photography', 'Digital Illustration', 'Street Art', 'Nature Photography', 'Concept Art'].map((category) => (
                  <button
                    key={category}
                    onClick={() => addCategoryOption(category)}
                    className="w-full text-left px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    + {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
