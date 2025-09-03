'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { SupabaseClient } from '@/types/supabase'
import Image from 'next/image'
import FavoriteButton from '@/components/favorites/FavoriteButton'

interface ArtistProfile {
  id: string
  username: string
  full_name: string
  avatar_url?: string
  artist_bio?: string
  artist_website?: string
  artist_instagram?: string
  artist_twitter?: string
  artist_location?: string
  artist_specialties?: string[]
  artist_experience_years?: number
  is_artist: boolean
  portfolio_public: boolean
  accepts_commissions: boolean
  commission_rates?: {
    portrait?: number
    landscape?: number
    digital_art?: number
    custom?: number
  }
}

interface PortfolioItem {
  id: string
  title: string
  description?: string
  image_url: string
  category?: string
  tags?: string[]
  is_featured: boolean
  created_at: string
}

interface ArtistStats {
  total_followers: number
  total_portfolio_items: number
  total_contest_wins: number
  total_contest_entries: number
  total_support_received: number
  total_commissions_completed: number
}

interface ArtistProfileDisplayProps {
  artistId: string
  currentUserId?: string
  className?: string
}

export default function ArtistProfileDisplay({ artistId, currentUserId, className = '' }: ArtistProfileDisplayProps) {
  const [profile, setProfile] = useState<ArtistProfile | null>(null)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [stats, setStats] = useState<ArtistStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  const fetchArtistData = useCallback(async () => {
    if (!supabase) return
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', artistId)
        .single()

      if (profileError) throw profileError
      setProfile(profileData)

      // Fetch portfolio (only public items)
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('artist_portfolio')
        .select('*')
        .eq('artist_id', artistId)
        .eq('is_public', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (portfolioError) throw portfolioError
      setPortfolio(portfolioData || [])

      // Fetch stats
      const { data: statsData, error: statsError } = await supabase
        .from('artist_stats')
        .select('*')
        .eq('artist_id', artistId)
        .single()

      if (statsError && statsError.code !== 'PGRST116') throw statsError
      setStats(statsData)

      // Check if current user is following this artist
      if (currentUserId && currentUserId !== artistId) {
        const { data: followData } = await supabase
          .from('artist_follows')
          .select('id')
          .eq('follower_id', currentUserId)
          .eq('artist_id', artistId)
          .single()

        setFollowing(!!followData)
      }
    } catch (err) {
      console.error('Error fetching artist data:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, artistId, currentUserId])

  useEffect(() => {
    // Initialize Supabase client
    const client = createClient()
    setSupabase(client)
  }, [])

  useEffect(() => {
    if (supabase) {
      fetchArtistData()
    }
  }, [supabase, fetchArtistData])

  const handleFollow = async () => {
    if (!supabase || !currentUserId || currentUserId === artistId) return

    try {
      if (following) {
        // Unfollow
        const { error } = await supabase
          .from('artist_follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('artist_id', artistId)

        if (error) throw error
        setFollowing(false)
      } else {
        // Follow
        const { error } = await supabase
          .from('artist_follows')
          .insert([{
            follower_id: currentUserId,
            artist_id: artistId
          }])

        if (error) throw error
        setFollowing(true)
      }
    } catch (err) {
      console.error('Error updating follow status:', err)
    }
  }

  const handleSupport = () => {
    // TODO: Implement support/tipping functionality
    alert('Support functionality coming soon!')
  }

  if (loading) {
    return (
      <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-white/20 rounded w-48"></div>
              <div className="h-4 bg-white/20 rounded w-32"></div>
            </div>
          </div>
          <div className="h-32 bg-white/20 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white/20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!profile || !profile.is_artist) {
    return (
      <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 ${className}`}>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-white mb-2">Artist Profile Not Found</h3>
          <p className="text-white/60">This user hasn&apos;t set up their artist profile yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 ${className}`}>
      {/* Artist Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
        <div className="flex-shrink-0">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name || profile.username}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white/20">
              <span className="text-white text-2xl font-bold">
                {(profile.full_name || profile.username).charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">
            {profile.full_name || profile.username}
          </h1>
          {profile.artist_location && (
            <p className="text-white/70 mb-2">📍 {profile.artist_location}</p>
          )}
          {profile.artist_experience_years && profile.artist_experience_years > 0 && (
            <p className="text-white/70 mb-2">
              🎨 {profile.artist_experience_years} year{profile.artist_experience_years !== 1 ? 's' : ''} of experience
            </p>
          )}
          
          {/* Social Links */}
          <div className="flex space-x-4 mb-4">
            {profile.artist_website && (
              <a
                href={profile.artist_website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                🌐 Website
              </a>
            )}
            {profile.artist_instagram && (
              <a
                href={`https://instagram.com/${profile.artist_instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 transition-colors"
              >
                📷 Instagram
              </a>
            )}
            {profile.artist_twitter && (
              <a
                href={`https://twitter.com/${profile.artist_twitter.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                🐦 Twitter
              </a>
            )}
          </div>

          {/* Action Buttons */}
          {currentUserId && currentUserId !== artistId && (
            <div className="flex space-x-3">
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  following
                    ? 'bg-white/20 text-white hover:bg-white/30'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                }`}
              >
                {following ? '✓ Following' : '+ Follow'}
              </button>
              {profile.accepts_commissions && (
                <button
                  onClick={handleSupport}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-300"
                >
                  💰 Support
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Artist Bio */}
      {profile.artist_bio && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">About the Artist</h2>
          <p className="text-white/80 leading-relaxed">{profile.artist_bio}</p>
        </div>
      )}

      {/* Specialties */}
      {profile.artist_specialties && profile.artist_specialties.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">Specialties</h2>
          <div className="flex flex-wrap gap-2">
            {profile.artist_specialties.map((specialty) => (
              <span
                key={specialty}
                className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-white">{stats.total_followers}</div>
            <div className="text-white/60 text-sm">Followers</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-white">{stats.total_portfolio_items}</div>
            <div className="text-white/60 text-sm">Portfolio Items</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-white">{stats.total_contest_wins}</div>
            <div className="text-white/60 text-sm">Contest Wins</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-white">${stats.total_support_received}</div>
            <div className="text-white/60 text-sm">Support Received</div>
          </div>
        </div>
      )}

      {/* Commission Rates */}
      {profile.accepts_commissions && profile.commission_rates && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">Commission Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(profile.commission_rates).map(([type, rate]) => {
              if (!rate || rate <= 0) return null
              return (
                <div key={type} className="p-4 bg-white/5 rounded-lg">
                  <div className="text-white font-medium capitalize">{type.replace('_', ' ')}</div>
                  <div className="text-green-400 font-bold">${rate}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Portfolio */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Portfolio</h2>
        {portfolio.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-white/60">No public portfolio items yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item) => (
              <div key={item.id} className="bg-white/5 rounded-lg overflow-hidden border border-white/10 group hover:border-white/30 transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.is_featured && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                  {/* Favorite Button Overlay */}
                  {currentUserId && currentUserId !== artistId && (
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FavoriteButton
                        userId={currentUserId}
                        portfolioItemId={item.id}
                        className="bg-black/50 backdrop-blur-sm"
                        showText={false}
                      />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  {item.category && (
                    <p className="text-blue-400 text-sm mb-2">{item.category}</p>
                  )}
                  {item.description && (
                    <p className="text-white/70 text-sm line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
