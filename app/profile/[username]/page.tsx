'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import TipButton from '@/components/tips/TipButton'

interface Artwork {
  id: string
  title: string
  description: string
  image_url: string
  votes: number
  created_at: string
  status: string
}

interface Profile {
  username: string
  full_name: string
  avatar_url: string
  bio: string
  created_at: string
}

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  
  const [profile, setProfile] = useState<Profile | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalArtworks: 0,
    totalVotes: 0,
    averageVotes: 0
  })

  const fetchProfile = useCallback(async () => {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching profile:', error)
        }
        return
      }

      setProfile(data)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching profile:', error)
      }
    }
  }, [username])

  const fetchArtworks = useCallback(async () => {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('profiles.username', username)
        .order('created_at', { ascending: false })

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching artworks:', error)
        }
        return
      }

      setArtworks(data || [])
      
      // Calculate stats
      const totalVotes = data?.reduce((sum, artwork) => sum + (artwork.votes || 0), 0) || 0
      const totalArtworks = data?.length || 0
      const averageVotes = totalArtworks > 0 ? Math.round(totalVotes / totalArtworks) : 0
      
      setStats({
        totalArtworks,
        totalVotes,
        averageVotes
      })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching artworks:', error)
      }
    } finally {
      setLoading(false)
    }
  }, [username])

  useEffect(() => {
    if (username) {
      fetchProfile()
      fetchArtworks()
    }
  }, [username, fetchProfile, fetchArtworks])

  const handleVote = async (artworkId: string) => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        window.location.href = '/auth'
        return
      }

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('submission_id', artworkId)
        .eq('user_id', user.id)
        .single()

      if (existingVote) {
        alert('You have already voted for this artwork!')
        return
      }

      // Add vote
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          submission_id: artworkId,
          user_id: user.id
        })

      if (voteError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error voting:', voteError)
        }
        return
      }

      // Get current vote count and increment it
      const { data: currentSubmission, error: fetchError } = await supabase
        .from('submissions')
        .select('votes')
        .eq('id', artworkId)
        .single()

      if (fetchError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching current votes:', fetchError)
        }
        return
      }

      const { error: updateError } = await supabase
        .from('submissions')
        .update({ votes: (currentSubmission.votes || 0) + 1 })
        .eq('id', artworkId)

      if (updateError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error updating votes:', updateError)
        }
        return
      }

      // Refresh artworks
      fetchArtworks()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error voting:', error)
      }
    }
  }

  const shareProfile = () => {
    const url = window.location.href
    const text = `Check out ${profile?.full_name}'s amazing AI art on Creative Challenge!`
    
    if (navigator.share) {
      navigator.share({
        title: `${profile?.full_name} - Creative Challenge`,
        text: text,
        url: url
      })
    } else {
      navigator.clipboard.writeText(url)
      alert('Profile link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-xl mb-8">The artist you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/gallery"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Back to Gallery
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2" style={{
                fontFamily: 'var(--font-bebas-neue), "Arial Black", "Impact", sans-serif'
              }}>
                {profile.full_name}
              </h1>
              <p className="text-xl text-white/80 mb-4">@{profile.username}</p>
              {profile.bio && (
                <p className="text-white/70 mb-6 max-w-2xl">{profile.bio}</p>
              )}
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stats.totalArtworks}</div>
                  <div className="text-white/60 text-sm">Artworks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stats.totalVotes}</div>
                  <div className="text-white/60 text-sm">Total Votes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stats.averageVotes}</div>
                  <div className="text-white/60 text-sm">Avg Votes</div>
                </div>
              </div>
              
              {/* Share Button */}
              <button
                onClick={shareProfile}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                📤 Share Profile
              </button>
            </div>
          </div>
        </div>

        {/* Artworks Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6" style={{
            fontFamily: 'var(--font-bebas-neue), "Arial Black", "Impact", sans-serif'
          }}>
            ARTWORKS
          </h2>
          
          {artworks.length === 0 ? (
            <div className="text-center text-white/60 text-xl py-12">
              No artworks yet. This artist hasn&apos;t submitted any pieces.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map((artwork) => (
                <div key={artwork.id} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105">
                  {/* Artwork Image */}
                  <div className="relative aspect-square">
                    <Image
                      src={artwork.image_url}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-semibold">
                      🔥 {artwork.votes}
                    </div>
                    {artwork.status === 'pending' && (
                      <div className="absolute top-4 left-4 bg-yellow-500/80 backdrop-blur-sm rounded-full px-3 py-1 text-black text-sm font-semibold">
                        ⏳ Pending
                      </div>
                    )}
                  </div>

                  {/* Artwork Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{artwork.title}</h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-3">{artwork.description}</p>
                    
                    {/* Actions */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVote(artwork.id)}
                          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                          🔥 Vote
                        </button>
                        <button
                          onClick={() => {
                            const url = `${window.location.origin}/gallery#${artwork.id}`
                            navigator.clipboard.writeText(url)
                            alert('Artwork link copied to clipboard!')
                          }}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300"
                        >
                          📤 Share
                        </button>
                      </div>
                      <TipButton
                        artworkId={artwork.id}
                        artistId={profile?.username || 'artist'}
                        artistName={profile?.full_name || 'Anonymous'}
                        artworkTitle={artwork.title}
                        currentTips={0}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to Gallery */}
        <div className="text-center">
          <Link
            href="/gallery"
            className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 border border-white/30"
          >
            ← Back to Gallery
          </Link>
        </div>
      </div>
    </div>
  )
}
