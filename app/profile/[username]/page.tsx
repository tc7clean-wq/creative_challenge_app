'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import SocialNavbar from '@/components/layout/SocialNavbar'
import Link from 'next/link'
import Image from 'next/image'

interface ProfileData {
  id: string
  username: string
  full_name: string
  bio: string
  avatar_url?: string
  created_at: string
  total_submissions: number
  total_wins: number
  total_likes: number
  is_public: boolean
}

interface Artwork {
  id: string
  title: string
  description: string
  image_url: string
  created_at: string
  likes_count: number
  comments_count: number
  status: 'pending' | 'approved' | 'rejected'
}

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [, setCurrentUser] = useState<unknown>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      const resolvedParams = await params
      fetchProfile(resolvedParams.username)
    }
    loadProfile()
  }, [params])

  const fetchProfile = async (username: string) => {
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      // Mock profile data - replace with actual query
      const mockProfile: ProfileData = {
        id: '1',
        username: username,
        full_name: 'Alex Chen',
        bio: 'Digital artist exploring the intersection of technology and creativity. Passionate about AI-generated art and cyberpunk aesthetics.',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        created_at: '2024-01-01T00:00:00Z',
        total_submissions: 45,
        total_wins: 12,
        total_likes: 2340,
        is_public: true
      }

      // Mock artworks - replace with actual query
      const mockArtworks: Artwork[] = [
        {
          id: '1',
          title: 'Neon Dreams',
          description: 'A cyberpunk cityscape with glowing neon lights',
          image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
          created_at: '2024-01-15T10:30:00Z',
          likes_count: 234,
          comments_count: 18,
          status: 'approved'
        },
        {
          id: '2',
          title: 'Digital Forest',
          description: 'An AI-generated forest with holographic trees',
          image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
          created_at: '2024-01-14T15:45:00Z',
          likes_count: 189,
          comments_count: 12,
          status: 'approved'
        },
        {
          id: '3',
          title: 'Quantum Waves',
          description: 'Abstract representation of quantum mechanics',
          image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop',
          created_at: '2024-01-13T09:20:00Z',
          likes_count: 156,
          comments_count: 8,
          status: 'approved'
        },
        {
          id: '4',
          title: 'Cyber City',
          description: 'Futuristic cityscape with flying cars',
          image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
          created_at: '2024-01-12T14:15:00Z',
          likes_count: 98,
          comments_count: 5,
          status: 'pending'
        }
      ]

      setProfile(mockProfile)
      setArtworks(mockArtworks)
      setIsOwnProfile(user?.user_metadata?.username === username)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="cyber-bg min-h-screen">
        <SocialNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-2xl text-cyan-300">Loading profile...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="cyber-bg min-h-screen">
        <SocialNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold cyber-text mb-4" style={{ fontFamily: 'var(--font-header)' }}>
              Profile Not Found
            </h1>
            <p className="text-lg text-cyan-300 mb-6">This user doesn&apos;t exist or their profile is private</p>
            <Link href="/gallery" className="cyber-btn">
              Back to Gallery
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!profile.is_public && !isOwnProfile) {
    return (
      <div className="cyber-bg min-h-screen">
        <SocialNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold cyber-text mb-4" style={{ fontFamily: 'var(--font-header)' }}>
              Private Profile
            </h1>
            <p className="text-lg text-cyan-300 mb-6">This profile is private</p>
            <Link href="/gallery" className="cyber-btn">
              Back to Gallery
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
        {/* Profile Header */}
        <div className="max-w-4xl mx-auto">
          <div className="cyber-card p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-4xl">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold cyber-text mb-2" style={{ fontFamily: 'var(--font-header)' }}>
                  {profile.full_name}
                </h1>
                <p className="text-cyan-300 text-lg mb-2">@{profile.username}</p>
                <p className="text-white/80 mb-4 max-w-2xl">{profile.bio}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-white/60 mb-4">
                  <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{profile.total_submissions} submissions</span>
                  <span>•</span>
                  <span>{profile.total_wins} wins</span>
                  <span>•</span>
                  <span>{profile.total_likes} likes</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  {isOwnProfile ? (
                    <>
                      <Link href="/settings" className="cyber-btn">
                        ⚙️ Edit Profile
                      </Link>
                      <Link href="/submit" className="cyber-card hover:bg-white/20 transition-all">
                        ✨ Submit Art
                      </Link>
                    </>
                  ) : (
                    <>
                      <button className="cyber-btn">
                        👤 Follow
                      </button>
                      <button className="cyber-card hover:bg-white/20 transition-all">
                        💬 Message
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="cyber-card p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{profile.total_submissions}</div>
              <div className="text-white/60">Total Submissions</div>
            </div>
            <div className="cyber-card p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{profile.total_wins}</div>
              <div className="text-white/60">Contest Wins</div>
            </div>
            <div className="cyber-card p-6 text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">{profile.total_likes}</div>
              <div className="text-white/60">Total Likes</div>
            </div>
          </div>

          {/* Artworks Grid */}
          <div>
            <h2 className="text-2xl font-bold cyber-text mb-6" style={{ fontFamily: 'var(--font-header)' }}>
              {isOwnProfile ? 'My Artworks' : 'Artworks'}
            </h2>
            
            {artworks.length === 0 ? (
              <div className="text-center py-16">
                <div className="cyber-card p-8 max-w-md mx-auto">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-xl font-bold cyber-text mb-4" style={{ fontFamily: 'var(--font-header)' }}>
                    No Artworks Yet
                  </h3>
                  <p className="text-white/80 mb-6">
                    {isOwnProfile 
                      ? "You haven&apos;t submitted any artworks yet. Start creating!" 
                      : "This user hasn&apos;t submitted any artworks yet."
                    }
                  </p>
                  {isOwnProfile && (
                    <Link href="/submit" className="cyber-btn">
                      ✨ Submit Your First Artwork
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artworks.map((artwork) => (
                  <div key={artwork.id} className="cyber-card group hover:border-cyan-500/50 transition-all duration-300">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={artwork.image_url}
                        alt={artwork.title}
                        width={400}
                        height={400}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {artwork.status === 'pending' && (
                        <div className="absolute top-2 left-2 bg-yellow-500/80 text-black px-2 py-1 rounded text-xs font-bold">
                          PENDING
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                        {artwork.title}
                      </h3>
                      <p className="text-white/70 text-sm mb-3 line-clamp-2">
                        {artwork.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-white/60 mb-3">
                        <span>{new Date(artwork.created_at).toLocaleDateString()}</span>
                        <div className="flex items-center space-x-3">
                          <span>❤️ {artwork.likes_count}</span>
                          <span>💬 {artwork.comments_count}</span>
                        </div>
                      </div>
                      
                      <Link
                        href={`/gallery/${artwork.id}`}
                        className="text-cyan-300 hover:text-cyan-100 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}