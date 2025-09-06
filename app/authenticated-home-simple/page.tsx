'use client'

import { createClient } from '@/utils/supabase/client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import NavigationHeader from '@/components/navigation/NavigationHeader'
import { useRouter } from 'next/navigation'

interface Submission {
  id: string
  title: string
  description: string
  image_url: string
  category: string
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
}

export default function SimpleAuthenticatedHomePage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [userStats, setUserStats] = useState<UserStats>({ total_submissions: 0, total_votes_received: 0 })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ user_metadata?: { full_name?: string }; email?: string } | null>(null)
  const router = useRouter()

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          // Check if user has a username set
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single()

          if (!profile?.username) {
            // User doesn't have a username, redirect to setup
            router.push('/setup-username')
            return
          }
          // Fetch recent submissions
          const { data: submissionsData } = await supabase
            .from('submissions')
            .select(`
              id,
              title,
              description,
              image_url,
              category,
              created_at,
              profiles:user_id (
                username,
                full_name,
                avatar_url
              )
            `)
            .order('created_at', { ascending: false })
            .limit(12)

          if (submissionsData) {
            // Transform the data to match our interface
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const transformedData = submissionsData.map((item: any) => ({
              ...item,
              profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
            }))
            setSubmissions(transformedData as Submission[])
          }

          // Fetch user stats
          const { data: statsData } = await supabase
            .from('submissions')
            .select('id')
            .eq('user_id', user.id)

          setUserStats({
            total_submissions: statsData?.length || 0,
            total_votes_received: 0 // Simplified for now
          })
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching data:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen cyber-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen cyber-bg">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 bg-clip-text text-transparent font-serif tracking-wide">
            Welcome back, {user?.user_metadata?.full_name || user?.email}!
          </h1>
          <p className="text-xl text-gray-300">
            Showcase your AI art and discover amazing creations from fellow artists
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{userStats.total_submissions}</div>
              <div className="text-gray-300">Your Submissions</div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{submissions.length}</div>
              <div className="text-gray-300">Total Artworks</div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">🎨</div>
              <div className="text-gray-300">Community</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link 
            href="/submit"
            className="cyber-card cyber-glow p-8 rounded-2xl hover:scale-105 transition-all duration-300 transform"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-2">Showcase Art</h3>
              <p className="text-gray-200">Upload and share your AI-generated masterpieces</p>
            </div>
          </Link>
          
          <Link 
            href="/gallery"
            className="bg-gradient-to-r from-purple-600 to-pink-700 text-white p-8 rounded-2xl hover:from-purple-700 hover:to-pink-800 transition-all duration-300 transform hover:scale-105 border border-purple-400/30"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-2">Explore Gallery</h3>
              <p className="text-gray-200">Discover amazing AI art from talented creators</p>
            </div>
          </Link>
        </div>

        {/* Recent Submissions */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 bg-clip-text text-transparent font-serif tracking-wide">Latest AI Art</h2>
          
          {submissions.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-xl">No artwork yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submissions.map((submission) => (
                <div key={submission.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group">
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                    <Image
                      src={submission.image_url}
                      alt={submission.title}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-yellow-400 mb-2">{submission.title}</h3>
                    <p className="text-gray-300 mb-4 line-clamp-2">{submission.description}</p>
                    
                    <div className="flex items-center space-x-3">
                      {submission.profiles.avatar_url ? (
                        <Image
                          src={submission.profiles.avatar_url}
                          alt={submission.profiles.full_name || submission.profiles.username}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {(submission.profiles.full_name || submission.profiles.username).charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-200 font-medium">{submission.profiles.full_name || submission.profiles.username}</p>
                        <p className="text-gray-400 text-sm">{submission.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link 
            href="/submit"
            className="cyber-btn inline-block px-8 py-4 rounded-xl text-lg font-semibold hover:scale-105 transition-all duration-300 transform cyber-glow"
          >
            🎨 Showcase Your Art
          </Link>
        </div>
      </div>
    </div>
  )
}
