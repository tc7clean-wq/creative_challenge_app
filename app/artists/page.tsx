'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { SupabaseClient } from '@/types/supabase'
import NavigationHeader from '@/components/navigation/NavigationHeader'
import Link from 'next/link'
import Image from 'next/image'

interface ArtistProfile {
  id: string
  username: string
  full_name: string
  avatar_url?: string
  artist_bio?: string
  artist_location?: string
  artist_specialties?: string[]
  artist_experience_years?: number
  accepts_commissions: boolean
}

interface ArtistStats {
  total_followers: number
  total_portfolio_items: number
  total_contest_wins: number
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Array<ArtistProfile & { stats?: ArtistStats }>>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [sortBy, setSortBy] = useState<'followers' | 'portfolio' | 'wins' | 'experience'>('followers')
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  const availableSpecialties = [
    'Digital Art', 'Photography', 'Illustration', '3D Art', 'Concept Art',
    'Portrait Art', 'Landscape Art', 'Abstract Art', 'Fantasy Art', 'Sci-Fi Art',
    'Character Design', 'Environment Design', 'UI/UX Design', 'Graphic Design',
    'Traditional Art', 'Mixed Media', 'Animation', 'Motion Graphics'
  ]

  const fetchArtists = useCallback(async () => {
    if (!supabase) return
    try {
      // Fetch all artist profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_artist', true)
        .eq('portfolio_public', true)

      if (profilesError) throw profilesError

      // Fetch stats for each artist
      const artistsWithStats = await Promise.all(
        profiles.map(async (profile) => {
          const { data: stats } = await supabase
            .from('artist_stats')
            .select('total_followers, total_portfolio_items, total_contest_wins')
            .eq('artist_id', profile.id)
            .single()

          return {
            ...profile,
            stats: stats || {
              total_followers: 0,
              total_portfolio_items: 0,
              total_contest_wins: 0
            }
          }
        })
      )

      setArtists(artistsWithStats)
    } catch (err) {
      console.error('Error fetching artists:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    // Initialize Supabase client
    const client = createClient()
    setSupabase(client)
  }, [])

  useEffect(() => {
    if (supabase) {
      fetchArtists()
    }
  }, [supabase, fetchArtists])

  // Filter and sort artists
  const filteredAndSortedArtists = artists
    .filter(artist => {
      const matchesSearch = 
        artist.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.artist_bio?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesSpecialty = !selectedSpecialty || 
        artist.artist_specialties?.includes(selectedSpecialty)

      return matchesSearch && matchesSpecialty
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'followers':
          return (b.stats?.total_followers || 0) - (a.stats?.total_followers || 0)
        case 'portfolio':
          return (b.stats?.total_portfolio_items || 0) - (a.stats?.total_portfolio_items || 0)
        case 'wins':
          return (b.stats?.total_contest_wins || 0) - (a.stats?.total_contest_wins || 0)
        case 'experience':
          return (b.artist_experience_years || 0) - (a.artist_experience_years || 0)
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen cyber-bg">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-white/20 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen cyber-bg">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎨 Discover Amazing Artists
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explore talented creators, discover unique styles, and connect with artists 
            who inspire you. Follow your favorites and support their creative journey.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-white font-medium mb-2">Search Artists</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, bio, or specialty..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Specialty Filter */}
            <div>
              <label className="block text-white font-medium mb-2">Art Specialty</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Specialties</option>
                {availableSpecialties.map((specialty) => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-white font-medium mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'followers' | 'portfolio' | 'wins' | 'experience')}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="followers">Most Followers</option>
                <option value="portfolio">Most Portfolio Items</option>
                <option value="wins">Most Contest Wins</option>
                <option value="experience">Most Experience</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-white/70">
            Found {filteredAndSortedArtists.length} artist{filteredAndSortedArtists.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Artists Grid */}
        {filteredAndSortedArtists.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🎨</div>
            <h3 className="text-2xl font-semibold text-white mb-4">No Artists Found</h3>
            <p className="text-white/60 mb-6">
              {searchTerm || selectedSpecialty 
                ? 'Try adjusting your search criteria or filters.'
                : 'Be the first artist to join our platform!'
              }
            </p>
            {!searchTerm && !selectedSpecialty && (
              <Link
                href="/authenticated-home"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Become an Artist
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedArtists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.id}`}
                className="group block"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:bg-white/15">
                  {/* Artist Avatar */}
                  <div className="text-center mb-4">
                    {artist.avatar_url ? (
                      <Image
                        src={artist.avatar_url}
                        alt={artist.full_name || artist.username}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white/20 mx-auto group-hover:border-white/40 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white/20 mx-auto group-hover:border-white/40 transition-all duration-300">
                        <span className="text-white text-2xl font-bold">
                          {(artist.full_name || artist.username).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Artist Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                      {artist.full_name || artist.username}
                    </h3>
                    {artist.artist_location && (
                      <p className="text-white/70 text-sm mb-2">📍 {artist.artist_location}</p>
                    )}
                    {artist.artist_experience_years && artist.artist_experience_years > 0 && (
                      <p className="text-white/70 text-sm">
                        🎨 {artist.artist_experience_years} year{artist.artist_experience_years !== 1 ? 's' : ''} of experience
                      </p>
                    )}
                  </div>

                  {/* Bio Preview */}
                  {artist.artist_bio && (
                    <p className="text-white/80 text-sm text-center mb-4 line-clamp-2">
                      {artist.artist_bio}
                    </p>
                  )}

                  {/* Specialties */}
                  {artist.artist_specialties && artist.artist_specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {artist.artist_specialties.slice(0, 3).map((specialty) => (
                        <span
                          key={specialty}
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                      {artist.artist_specialties.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 text-white/60 rounded-full text-xs">
                          +{artist.artist_specialties.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-white/5 rounded">
                      <div className="text-white font-bold text-sm">{artist.stats?.total_followers || 0}</div>
                      <div className="text-white/60 text-xs">Followers</div>
                    </div>
                    <div className="p-2 bg-white/5 rounded">
                      <div className="text-white font-bold text-sm">{artist.stats?.total_portfolio_items || 0}</div>
                      <div className="text-white/60 text-xs">Portfolio</div>
                    </div>
                    <div className="p-2 bg-white/5 rounded">
                      <div className="text-white font-bold text-sm">{artist.stats?.total_contest_wins || 0}</div>
                      <div className="text-white/60 text-xs">Wins</div>
                    </div>
                  </div>

                  {/* Commission Badge */}
                  {artist.accepts_commissions && (
                    <div className="mt-4 text-center">
                      <span className="inline-block px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                        💰 Accepts Commissions
                      </span>
                    </div>
                  )}

                  {/* View Profile Button */}
                  <div className="mt-4 text-center">
                    <span className="text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                      View Profile →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {filteredAndSortedArtists.length > 0 && (
          <div className="text-center mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Showcase Your Art?
              </h3>
              <p className="text-white/80 mb-6 max-w-lg mx-auto">
                Join our community of talented artists and start building your portfolio. 
                Connect with art lovers, participate in contests, and grow your following.
              </p>
              <Link
                href="/authenticated-home"
                className="inline-block bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300"
              >
                Become an Artist
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
