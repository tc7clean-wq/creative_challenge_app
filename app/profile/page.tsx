'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { SupabaseClient } from '@/types/supabase'
import NavigationHeader from '@/components/navigation/NavigationHeader'
import Image from 'next/image'
import ArtistProfileForm from '@/components/artist/ArtistProfileForm'
import ArtistPortfolioManager from '@/components/artist/ArtistPortfolioManager'

interface UserProfile {
  id: string
  username: string
  full_name?: string
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
  commission_rates?: Record<string, number>
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'portfolio'>('profile')
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!supabase || !userId) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, userId])

  useEffect(() => {
    // Initialize Supabase client
    const client = createClient()
    setSupabase(client)

    // Get current user
    client.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id)
      } else {
        // Redirect to login if not authenticated
        window.location.href = '/'
      }
    })
  }, [])

  useEffect(() => {
    if (supabase && userId) {
      fetchProfile()
    }
  }, [supabase, userId, fetchProfile])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded mb-8"></div>
            <div className="h-64 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
            <p className="text-white/60">Unable to load your profile.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            👤 My Profile
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Manage your profile information and showcase your artistic journey.
          </p>
        </div>

        {/* Profile Info Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
          <div className="flex items-center space-x-6 mb-6">
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
                <span className="text-white text-3xl font-bold">
                  {(profile.full_name || profile.username).charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-3xl font-bold text-white">{profile.full_name || profile.username}</h2>
              <p className="text-white/70 text-lg">@{profile.username}</p>
              {profile.is_artist && (
                <div className="flex items-center space-x-2 mt-2">
                  <span className="bg-green-500/20 text-green-300 text-sm px-3 py-1 rounded-full">
                    🎨 Artist
                  </span>
                  {profile.accepts_commissions && (
                    <span className="bg-blue-500/20 text-blue-300 text-sm px-3 py-1 rounded-full">
                      💼 Accepts Commissions
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {profile.artist_bio && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">Bio</h3>
              <p className="text-white/80">{profile.artist_bio}</p>
            </div>
          )}

          {profile.artist_specialties && profile.artist_specialties.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">Specialties</h3>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.artist_location && (
              <div>
                <h4 className="text-white/60 text-sm">Location</h4>
                <p className="text-white">{profile.artist_location}</p>
              </div>
            )}
            {profile.artist_experience_years && (
              <div>
                <h4 className="text-white/60 text-sm">Experience</h4>
                <p className="text-white">{profile.artist_experience_years} years</p>
              </div>
            )}
            {profile.artist_website && (
              <div>
                <h4 className="text-white/60 text-sm">Website</h4>
                <a
                  href={profile.artist_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                activeTab === 'profile'
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Edit Profile
            </button>
            {profile.is_artist && (
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === 'portfolio'
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Manage Portfolio
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'profile' ? (
          <ArtistProfileForm
            userId={userId!}
            onProfileUpdated={fetchProfile}
          />
        ) : (
          profile.is_artist && (
            <ArtistPortfolioManager
              userId={userId!}
              onPortfolioUpdated={fetchProfile}
            />
          )
        )}
      </div>
    </div>
  )
}
