'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import SocialNavbar from '@/components/layout/SocialNavbar'
import Link from 'next/link'
import Image from 'next/image'

interface FavoriteArtwork {
  id: string
  title: string
  description: string
  image_url: string
  artist_name: string
  artist_username: string
  created_at: string
  likes_count: number
  comments_count: number
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteArtwork[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<unknown>(null)

  useEffect(() => {
    fetchUserAndFavorites()
  }, [])

  const fetchUserAndFavorites = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Mock data for now - replace with actual query
        const mockFavorites: FavoriteArtwork[] = [
          {
            id: '1',
            title: 'Neon Dreams',
            description: 'A cyberpunk cityscape with glowing neon lights',
            image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
            artist_name: 'Alex Chen',
            artist_username: 'cyber_artist_1',
            created_at: '2024-01-15T10:30:00Z',
            likes_count: 234,
            comments_count: 18
          },
          {
            id: '2',
            title: 'Digital Forest',
            description: 'An AI-generated forest with holographic trees',
            image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
            artist_name: 'Maya Rodriguez',
            artist_username: 'neon_creator',
            created_at: '2024-01-14T15:45:00Z',
            likes_count: 189,
            comments_count: 12
          },
          {
            id: '3',
            title: 'Quantum Waves',
            description: 'Abstract representation of quantum mechanics',
            image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop',
            artist_name: 'Jordan Kim',
            artist_username: 'digital_dreamer',
            created_at: '2024-01-13T09:20:00Z',
            likes_count: 156,
            comments_count: 8
          }
        ]

        setFavorites(mockFavorites)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (artworkId: string) => {
    try {
      // Mock removal - replace with actual API call
      setFavorites(prev => prev.filter(fav => fav.id !== artworkId))
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  if (loading) {
    return (
      <div className="cyber-bg min-h-screen">
        <SocialNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-2xl text-cyan-300">Loading your favorites...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="cyber-bg min-h-screen">
        <SocialNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold cyber-text mb-4" style={{ fontFamily: 'var(--font-header)' }}>
              Access Required
            </h1>
            <p className="text-lg text-cyan-300 mb-6">Please log in to view your favorites</p>
            <Link href="/auth" className="cyber-btn">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cyber-bg min-h-screen">
      <SocialNavbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold cyber-text glitch mb-2" data-text="[FAVORITES]" style={{ fontFamily: 'var(--font-header)' }}>
            [FAVORITES]
          </h1>
          <p className="text-lg text-cyan-300 mb-6">{'// Your collection of beloved artworks'}</p>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="cyber-card p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">💔</div>
              <h2 className="text-2xl font-bold cyber-text mb-4" style={{ fontFamily: 'var(--font-header)' }}>
                No Favorites Yet
              </h2>
              <p className="text-white/80 mb-6">
                Start exploring the gallery and heart the artworks you love!
              </p>
              <Link
                href="/gallery"
                className="cyber-btn transform hover:scale-105 transition-all duration-300"
              >
                🎨 Browse Gallery
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((artwork) => (
                <div key={artwork.id} className="cyber-card group hover:border-cyan-500/50 transition-all duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={artwork.image_url}
                      alt={artwork.title}
                      width={400}
                      height={400}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => removeFavorite(artwork.id)}
                        className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full transition-all duration-200"
                        title="Remove from favorites"
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {artwork.title}
                    </h3>
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">
                      {artwork.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-white/60 mb-3">
                      <span>by @{artwork.artist_username}</span>
                      <span>{new Date(artwork.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-white/60">
                        <span>❤️ {artwork.likes_count}</span>
                        <span>💬 {artwork.comments_count}</span>
                      </div>
                      <Link
                        href={`/gallery/${artwork.id}`}
                        className="text-cyan-300 hover:text-cyan-100 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="cyber-card p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold cyber-text mb-4" style={{ fontFamily: 'var(--font-header)' }}>
              Discover More Art
            </h2>
            <p className="text-white/80 mb-6">Explore the gallery to find your next favorite piece!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/gallery"
                className="cyber-btn text-lg transform hover:scale-105 transition-all duration-300"
              >
                🎨 Browse Gallery
              </Link>
              <Link
                href="/submit"
                className="cyber-card text-lg hover:bg-white/20 transition-all"
              >
                ✨ Submit Your Art
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}