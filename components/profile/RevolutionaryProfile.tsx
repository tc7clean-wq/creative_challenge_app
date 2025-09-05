'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'

interface Profile {
  id: string
  username: string
  full_name: string
  bio: string
  avatar_url: string
  created_at: string
  is_verified: boolean
  stats: {
    artworks_count: number
    total_votes: number
    contests_won: number
    followers_count: number
  }
}

interface Artwork {
  id: string
  title: string
  image_url: string
  votes_count: number
  created_at: string
  is_featured: boolean
}

export default function RevolutionaryProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'artworks' | 'achievements' | 'activity'>('artworks')
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    fetchProfile()
    fetchArtworks()
  }, [])

  const fetchProfile = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          bio,
          avatar_url,
          created_at,
          is_verified
        `)
        .eq('id', user.id)
        .single()

      if (error) throw error

      // Mock stats for now
      const stats = {
        artworks_count: 24,
        total_votes: 1247,
        contests_won: 3,
        followers_count: 89
      }

      setProfile({ ...data, stats })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchArtworks = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data, error } = await supabase
        .from('submissions')
        .select(`
          id,
          title,
          image_url,
          votes_count,
          created_at,
          is_featured
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setArtworks(data || [])
    } catch (error) {
      console.error('Error fetching artworks:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-quantum-entanglement w-16 h-16 mx-auto mb-4">
            <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
          </div>
          <p className="text-white/80 text-xl">Loading quantum profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-white mb-4">Profile Not Found</h2>
          <p className="text-gray-400">Please sign in to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden glass-card p-1">
                <Image
                  src={profile.avatar_url || '/default-avatar.png'}
                  alt={profile.username}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              {profile.is_verified && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-black text-sm font-bold">
                  ✓
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                <h1 className="text-3xl font-bold gradient-text-holographic">
                  {profile.full_name}
                </h1>
                {profile.is_verified && (
                  <div className="text-yellow-400 text-xl">⭐</div>
                )}
              </div>
              
              <p className="text-cyan-400 text-lg mb-4">@{profile.username}</p>
              
              <p className="text-gray-300 mb-6 max-w-2xl">
                {profile.bio || "Passionate AI artist creating the future of digital art. Join me on this creative journey!"}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl neu-button interactive-hover interactive-press">
                  ✏️ Edit Profile
                </button>
                
                <button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-6 py-3 font-bold rounded-xl neu-button interactive-hover interactive-press ${
                    isFollowing 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                      : 'bg-white/5 text-white border border-white/20'
                  }`}
                >
                  {isFollowing ? '✓ Following' : '+ Follow'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-6 text-center interactive-hover">
            <div className="text-3xl font-bold gradient-text-cyber mb-2">
              {profile.stats.artworks_count}
            </div>
            <div className="text-gray-400">Artworks</div>
          </div>
          
          <div className="glass-card p-6 text-center interactive-hover">
            <div className="text-3xl font-bold gradient-text-holographic mb-2">
              {profile.stats.total_votes}
            </div>
            <div className="text-gray-400">Total Votes</div>
          </div>
          
          <div className="glass-card p-6 text-center interactive-hover">
            <div className="text-3xl font-bold gradient-text-neural mb-2">
              {profile.stats.contests_won}
            </div>
            <div className="text-gray-400">Contests Won</div>
          </div>
          
          <div className="glass-card p-6 text-center interactive-hover">
            <div className="text-3xl font-bold gradient-text-cyber mb-2">
              {profile.stats.followers_count}
            </div>
            <div className="text-gray-400">Followers</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-card p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { key: 'artworks', label: 'Artworks', icon: '🎨' },
              { key: 'achievements', label: 'Achievements', icon: '🏆' },
              { key: 'activity', label: 'Activity', icon: '📈' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as 'artworks' | 'achievements' | 'activity')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === key
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="mr-2">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="glass-card p-6">
          {activeTab === 'artworks' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">My Artworks</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {artworks.map((artwork, index) => (
                  <div
                    key={artwork.id}
                    className="group relative aspect-square rounded-xl overflow-hidden interactive-hover"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Image
                      src={artwork.image_url}
                      alt={artwork.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-white font-bold text-sm mb-1 line-clamp-1">
                          {artwork.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-300">
                          <span>❤️ {artwork.votes_count}</span>
                          {artwork.is_featured && <span>⭐ Featured</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {artworks.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎨</div>
                  <h4 className="text-xl font-bold text-white mb-2">No artworks yet</h4>
                  <p className="text-gray-400 mb-6">Start creating and sharing your AI art!</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl neu-button interactive-hover interactive-press">
                    Upload Artwork
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Achievements</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'First Artwork', description: 'Uploaded your first AI artwork', icon: '🎨', earned: true },
                  { title: 'Community Favorite', description: 'Received 100+ votes on an artwork', icon: '❤️', earned: true },
                  { title: 'Contest Winner', description: 'Won your first art contest', icon: '🏆', earned: true },
                  { title: 'Featured Artist', description: 'Had artwork featured on homepage', icon: '⭐', earned: false },
                  { title: 'Viral Creator', description: 'Artwork got 1000+ votes', icon: '🔥', earned: false },
                  { title: 'Master Artist', description: 'Uploaded 50+ artworks', icon: '👑', earned: false }
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all ${
                      achievement.earned
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-gray-500/10 border-gray-500/20 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <h4 className="font-bold">{achievement.title}</h4>
                        <p className="text-sm opacity-80">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'uploaded', artwork: 'Digital Dreams', time: '2 hours ago', icon: '🎨' },
                  { action: 'received', artwork: '50 votes on "Cosmic Journey"', time: '5 hours ago', icon: '❤️' },
                  { action: 'won', artwork: 'Portrait Contest', time: '1 day ago', icon: '🏆' },
                  { action: 'featured', artwork: 'Abstract Harmony', time: '3 days ago', icon: '⭐' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 glass-card rounded-xl">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-white">
                        You {activity.action} <span className="gradient-text-cyber">{activity.artwork}</span>
                      </p>
                      <p className="text-gray-400 text-sm">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
