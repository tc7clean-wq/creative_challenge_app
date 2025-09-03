'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import NavigationHeader from '@/components/navigation/NavigationHeader'

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

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
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
            const transformedData = submissionsData.map(item => ({
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
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent font-serif tracking-wide">
            Welcome back, {user?.user_metadata?.full_name || user?.email}!
          </h1>
          <p className="text-xl text-gray-300">
            Share your creativity and discover amazing artwork from the community
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
            className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-8 rounded-2xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 border border-purple-400/30"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-2">Submit Artwork</h3>
              <p className="text-gray-200">Share your AI-generated artwork with the community</p>
            </div>
          </Link>
          
          <Link 
            href="/artists"
            className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-8 rounded-2xl hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 border border-indigo-400/30"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-2">Discover Artists</h3>
              <p className="text-gray-200">Explore amazing artwork from talented creators</p>
            </div>
          </Link>
        </div>

        {/* Recent Submissions */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent font-serif tracking-wide">Recent Community Artwork</h2>
          
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
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 border border-purple-400/30 shadow-lg shadow-purple-500/25"
          >
            🎨 Share Your Artwork
          </Link>
        </div>
      </div>
    </div>
  )
}
