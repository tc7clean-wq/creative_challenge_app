'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LogoutButton from '@/components/auth/LogoutButton'
import CategoryVoting from '@/components/voting/CategoryVoting'
import LiveTicker from '@/components/ticker/LiveTicker'
import NavigationHeader from '@/components/navigation/NavigationHeader'
import SocialShare from '@/components/sharing/SocialShare'
import type { SupabaseClient } from '@/types/supabase'

interface Contest {
  id: string
  title: string
  theme: string
  description: string
  start_date: string
  end_date: string
  prize_pool: number
  submission_count: number
  max_submissions: number
  rules: string
}

interface Submission {
  id: string
  title: string
  description: string
  image_url: string
  vote_count: number
  tier: string
  created_at: string
  profiles: {
    username: string
    full_name: string
    avatar_url: string
  }
}

interface UserStats {
  total_submissions: number
  total_votes_received: number
  contests_entered: number
  wins: number
}

export default function AuthenticatedHomePage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [featuredSubmissions, setFeaturedSubmissions] = useState<Submission[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    total_submissions: 0,
    total_votes_received: 0,
    contests_entered: 0,
    wins: 0
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    // Initialize Supabase client
    const client = createClient()
    setSupabase(client)
  }, [])

  useEffect(() => {
    if (!supabase) return

    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          // Fetch active contests with more details
          const { data: contestsData } = await supabase
            .from('contests')
            .select(`
              *,
              submissions!inner(count)
            `)
            .gte('end_date', new Date().toISOString())
            .lte('start_date', new Date().toISOString())
            .order('end_date', { ascending: true })

          setContests(contestsData || [])

          // Fetch featured submissions with user details
          const { data: submissionsData } = await supabase
            .from('submissions')
            .select(`
              *,
              profiles:user_id (username, full_name, avatar_url)
            `)
            .order('vote_count', { ascending: false })
            .limit(6)

          setFeaturedSubmissions(submissionsData || [])

          // Fetch user stats
          const [submissionsResult, , contestsResult] = await Promise.all([
            supabase
              .from('submissions')
              .select('id, vote_count')
              .eq('user_id', user.id),
            supabase
              .from('votes')
              .select('submission_id')
              .in('submission_id', 
                submissionsData?.map(s => s.id) || []
              ),
            supabase
              .from('contests')
              .select('id')
              .eq('winner_1st', user.id)
              .or(`winner_2nd.eq.${user.id},winner_3rd.eq.${user.id}`)
          ])

          const totalVotesReceived = submissionsResult.data?.reduce((sum, sub) => sum + (sub.vote_count || 0), 0) || 0
          
          setUserStats({
            total_submissions: submissionsResult.data?.length || 0,
            total_votes_received: totalVotesReceived,
            contests_entered: new Set(submissionsResult.data?.map(s => s.id)).size,
            wins: contestsResult.data?.length || 0
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <NavigationHeader />
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">CC</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Creative Challenge</h1>
                <p className="text-white/60 text-sm">Where creativity meets competition</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {/* User Stats */}
              <div className="hidden md:flex items-center space-x-4 text-white/80 text-sm">
                <div className="text-center">
                  <div className="font-bold text-white">{userStats.total_submissions}</div>
                  <div className="text-xs">Submissions</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white">{userStats.total_votes_received}</div>
                  <div className="text-xs">Votes</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white">{userStats.wins}</div>
                  <div className="text-xs">Wins</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-white font-medium">{user?.email}</div>
                  <div className="text-white/60 text-xs">Creative Artist</div>
                </div>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Welcome Back, Creative Artist!
          </h2>
          <p className="text-xl text-white/80 mb-4 max-w-3xl mx-auto">
            Ready to showcase your latest masterpiece? Join thousands of artists competing for incredible prizes and recognition in our vibrant creative community.
          </p>
          <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
            Submit your artwork, vote for your favorites, and climb the leaderboards. Every submission is a chance to win and inspire others.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="relative z-10">Submit Your Artwork</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Active Contests */}
      {contests.length > 0 && (
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-4xl font-bold text-white mb-12 text-center">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Active Contests
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {contests.map((contest, index) => (
                <div
                  key={contest.id}
                  className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105"
                  style={{
                    animationDelay: `${index * 200}ms`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm font-semibold rounded-full">
                        Active Contest
                      </span>
                      <span className="text-white/60 text-sm">
                        {contest.submission_count || 0} / {contest.max_submissions || 100} entries
                      </span>
                    </div>
                    
                    <h4 className="text-xl font-bold text-white mb-2">{contest.title}</h4>
                    <p className="text-white/80 mb-2 font-medium">{contest.theme}</p>
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                      {contest.description || "Showcase your creativity and compete for amazing prizes in this exciting contest!"}
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-white/60 mb-1">
                        <span>Ends in:</span>
                        <span>{new Date(contest.end_date).toLocaleDateString()}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min((contest.submission_count || 0) / (contest.max_submissions || 100) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-yellow-400">
                          ${contest.prize_pool.toLocaleString()}
                        </span>
                        <div className="text-white/60 text-xs">Total Prize Pool</div>
                      </div>
                      <Link
                        href={`/submit?contest=${contest.id}`}
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                      >
                        Submit Entry
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Submissions */}
      {featuredSubmissions.length > 0 && (
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-4xl font-bold text-white mb-12 text-center">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Featured Submissions
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredSubmissions.map((submission, index) => (
                <div
                  key={submission.id}
                  className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105"
                  style={{
                    animationDelay: `${index * 150}ms`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      {submission.image_url ? (
                        <Image
                          src={submission.image_url}
                          alt={submission.title}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-white/60 text-center">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-2xl">🎨</span>
                          </div>
                          <p>Artwork Preview</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          submission.tier === 'spotlight' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                          submission.tier === 'featured' ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white' :
                          'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
                        }`}>
                          {submission.tier?.toUpperCase() || 'STANDARD'}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-white/80 text-sm font-medium">
                            {submission.vote_count || 0}
                          </span>
                        </div>
                      </div>
                      
                      <h4 className="text-white font-semibold mb-2 line-clamp-1">{submission.title}</h4>
                      <p className="text-white/60 text-sm mb-2 line-clamp-2">
                        {submission.description || "A beautiful creative submission that showcases incredible talent and artistic vision."}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {(submission.profiles?.username || 'A').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white/80 text-sm font-medium">
                              {submission.profiles?.full_name || submission.profiles?.username || 'Anonymous Artist'}
                            </p>
                            <p className="text-white/50 text-xs">
                              {new Date(submission.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-full transition-all duration-300">
                          Vote
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social Sharing */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SocialShare />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-white mb-12 text-center">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Quick Actions
            </span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: 'Submit Artwork', 
                description: 'Upload your latest creation and compete for prizes',
                href: '/submit', 
                icon: '🎨', 
                gradient: 'from-pink-500 to-purple-600',
                stats: `${userStats.total_submissions} submitted`
              },
              { 
                title: 'View Contests', 
                description: 'Browse active contests and see current standings',
                href: '/dashboard', 
                icon: '🏆', 
                gradient: 'from-yellow-500 to-orange-600',
                stats: `${contests.length} active`
              },
              { 
                title: 'My Profile', 
                description: 'Manage your profile and view your achievements',
                href: '/dashboard', 
                icon: '👤', 
                gradient: 'from-blue-500 to-cyan-600',
                stats: `${userStats.wins} wins`
              },
              { 
                title: 'Community Gallery', 
                description: 'Explore amazing artwork from talented artists',
                href: '/dashboard', 
                icon: '🌟', 
                gradient: 'from-emerald-500 to-teal-600',
                stats: `${featuredSubmissions.length} featured`
              }
            ].map((action, index) => (
              <Link
                key={action.title}
                href={action.href}
                className="group relative p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 text-center"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{action.icon}</div>
                  <h4 className="text-white font-semibold mb-2">{action.title}</h4>
                  <p className="text-white/60 text-sm mb-3">{action.description}</p>
                  <div className="text-white/40 text-xs font-medium">{action.stats}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Voting & Live Ticker */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <CategoryVoting />
            <LiveTicker />
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-white mb-12 text-center">
            <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">
              Community Impact
            </span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Total Artists', value: '2,847', icon: '👥', color: 'from-blue-400 to-cyan-500' },
              { label: 'Artworks Submitted', value: '12,456', icon: '🎨', color: 'from-purple-400 to-pink-500' },
              { label: 'Prizes Awarded', value: '$89,234', icon: '💰', color: 'from-yellow-400 to-orange-500' },
              { label: 'Community Votes', value: '156,789', icon: '❤️', color: 'from-red-400 to-pink-500' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center group"
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Creative Challenge</h4>
              <p className="text-white/60 text-sm">
                The ultimate platform for creative artists to showcase their talent, compete for amazing prizes, and build their portfolio in a vibrant community.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/submit" className="block text-white/60 hover:text-white text-sm transition-colors">Submit Artwork</Link>
                <Link href="/dashboard" className="block text-white/60 hover:text-white text-sm transition-colors">My Dashboard</Link>
                <Link href="/rules" className="block text-white/60 hover:text-white text-sm transition-colors">Contest Rules</Link>
                <Link href="/admin/dashboard" className="block text-white/60 hover:text-white text-sm transition-colors">Admin Panel</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <p className="text-white/60 text-sm">Need help? Contact our support team</p>
                <p className="text-white/60 text-sm">Email: support@creativechallenge.app</p>
                <p className="text-white/60 text-sm">Join our Discord community</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2024 Creative Challenge App. All rights reserved. Showcase your creativity and compete for amazing prizes!
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
