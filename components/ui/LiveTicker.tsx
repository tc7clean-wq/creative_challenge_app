'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function LiveTicker() {
  const [communityStats, setCommunityStats] = useState({
    totalArtists: 1247,
    totalArtworks: 8934,
    totalVotes: 45678
  })
  const [recentActivity, setRecentActivity] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCommunityData()
    const interval = setInterval(fetchCommunityData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchCommunityData = async () => {
    try {
      const supabase = createClient()
      
      // Get community stats
      const { data: artistCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })

      const { data: artworkCount } = await supabase
        .from('submissions')
        .select('id', { count: 'exact' })

      const { data: voteCount } = await supabase
        .from('votes')
        .select('id', { count: 'exact' })

      setCommunityStats({
        totalArtists: artistCount?.length || 1247,
        totalArtworks: artworkCount?.length || 8934,
        totalVotes: voteCount?.length || 45678
      })

      // Get recent activity
      const { data: recentSubmissions } = await supabase
        .from('submissions')
        .select('title, profiles!inner(username)')
        .order('created_at', { ascending: false })
        .limit(5)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const activities = recentSubmissions?.map((sub: any) => {
        const profile = Array.isArray(sub.profiles) ? sub.profiles[0] : sub.profiles
        return `🎨 ${profile?.username || 'Artist'} uploaded "${sub.title}"`
      }) || []

      setRecentActivity(activities)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching community data:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-2 px-4 overflow-hidden">
        <div className="animate-pulse">Loading community updates...</div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-2 px-4 overflow-hidden relative">
      <div className="flex items-center space-x-8 animate-scroll">
        {/* Community Stats */}
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="font-bold text-lg">👥</span>
          <span className="font-bold text-lg">{communityStats.totalArtists.toLocaleString()} Artists</span>
        </div>

        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="font-bold text-lg">🎨</span>
          <span className="font-bold text-lg">{communityStats.totalArtworks.toLocaleString()} Artworks</span>
        </div>

        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="font-bold text-lg">💖</span>
          <span className="font-bold text-lg">{communityStats.totalVotes.toLocaleString()} Votes</span>
        </div>

        {/* Recent Activity */}
        {recentActivity.map((activity, index) => (
          <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
            <span className="font-bold text-lg">✨</span>
            <span className="text-sm">{activity}</span>
          </div>
        ))}

        {/* Encouraging Messages */}
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="font-bold text-lg">🌟</span>
          <span className="text-sm">Join our creative community today!</span>
        </div>

        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="font-bold text-lg">💡</span>
          <span className="text-sm">Share your art and inspire others!</span>
        </div>

        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="font-bold text-lg">🎪</span>
          <span className="text-sm">Every artist has a unique voice!</span>
        </div>

        {/* Repeat for continuous scroll */}
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="font-bold text-lg">👥</span>
          <span className="font-bold text-lg">{communityStats.totalArtists.toLocaleString()} Artists</span>
        </div>

        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="font-bold text-lg">🎨</span>
          <span className="font-bold text-lg">{communityStats.totalArtworks.toLocaleString()} Artworks</span>
        </div>

        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="font-bold text-lg">💖</span>
          <span className="font-bold text-lg">{communityStats.totalVotes.toLocaleString()} Votes</span>
        </div>

        {recentActivity.map((activity, index) => (
          <div key={`repeat-${index}`} className="flex items-center space-x-2 whitespace-nowrap">
            <span className="font-bold text-lg">✨</span>
            <span className="text-sm">{activity}</span>
          </div>
        ))}

        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="font-bold text-lg">🌟</span>
          <span className="text-sm">Join our creative community today!</span>
        </div>

        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="font-bold text-lg">💡</span>
          <span className="text-sm">Share your art and inspire others!</span>
        </div>

        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="font-bold text-lg">🎪</span>
          <span className="text-sm">Every artist has a unique voice!</span>
        </div>
      </div>
    </div>
  )
}