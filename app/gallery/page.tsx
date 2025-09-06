'use client'

import { useState, useEffect, useCallback } from 'react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import TipButton from '@/components/tips/TipButton'
import ArtworkComments from '@/components/gallery/ArtworkComments'
import ArtworkLikes from '@/components/gallery/ArtworkLikes'
import ArtworkSharing from '@/components/gallery/ArtworkSharing'
import SocialNavbar from '@/components/layout/SocialNavbar'

interface Artwork {
  id: string
  title: string
  description: string
  image_url: string
  votes: number
  created_at: string
  profiles: {
    username: string
    full_name: string
    avatar_url: string
  }
}

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('popular')

  const fetchArtworks = useCallback(async () => {
    try {
      const supabase = createClient()
      
      let query = supabase
        .from('submissions')
        .select(`
          id,
          title,
          description,
          image_url,
          votes,
          created_at,
          profiles!inner(username, full_name, avatar_url)
        `)
        .in('status', ['approved', 'pending'])

      if (sortBy === 'popular') {
        query = query.order('votes', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query.limit(20)

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching artworks:', error)
        }
        return
      }

      // Transform the data to ensure profiles is a single object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedData = data?.map((artwork: any) => ({
        ...artwork,
        profiles: Array.isArray(artwork.profiles) ? artwork.profiles[0] : artwork.profiles
      })) || []

      setArtworks(transformedData)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching artworks:', error)
      }
    } finally {
      setLoading(false)
    }
  }, [sortBy])

  useEffect(() => {
    fetchArtworks()
  }, [fetchArtworks])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading amazing artworks...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen cyber-bg">
      <SocialNavbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold cyber-text glitch mb-2" data-text="[CREATIVE FEED]">
            [CREATIVE FEED]
          </h1>
          <p className="text-lg text-cyan-300 mb-6">{'// Discover amazing artwork and connect with artists'}</p>
          
          {/* Sort Options */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setSortBy('popular')}
              className={`px-4 py-2 rounded-lg font-medium transition-all cyber-focus ${
                sortBy === 'popular'
                  ? 'cyber-btn cyber-glow'
                  : 'cyber-card text-cyan-300 hover:text-cyan-100'
              }`}
            >
              🔥 TRENDING
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-4 py-2 rounded-lg font-medium transition-all cyber-focus ${
                sortBy === 'newest'
                  ? 'cyber-btn cyber-glow'
                  : 'cyber-card text-cyan-300 hover:text-cyan-100'
              }`}
            >
              ⚡ LATEST
            </button>
          </div>
        </div>

        {/* Artworks Grid */}
        {artworks.length === 0 ? (
          <div className="text-center text-white/60 text-xl fade-in">
            No artworks yet. Be the first to showcase your AI art!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {artworks.map((artwork, index) => (
              <div key={artwork.id} className="cyber-card rounded-xl overflow-hidden cyber-pulse slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
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
                </div>

                {/* Artwork Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{artwork.title}</h3>
                  <p className="text-white/70 text-sm mb-4 line-clamp-3">{artwork.description}</p>
                  
                  {/* Artist Info */}
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold mr-3">
                      {artwork.profiles?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{artwork.profiles?.full_name || 'Anonymous'}</div>
                      <div className="text-white/60 text-sm">@{artwork.profiles?.username || 'artist'}</div>
                    </div>
                  </div>

                  {/* Social Actions */}
                  <div className="space-y-3">
                    {/* Like and Share */}
                    <div className="flex items-center justify-between">
                      <ArtworkLikes 
                        submissionId={artwork.id}
                        initialLikes={artwork.votes}
                        onLikeUpdate={(newCount) => {
                          setArtworks(prev => prev.map(a => 
                            a.id === artwork.id ? { ...a, votes: newCount } : a
                          ))
                        }}
                      />
                      <ArtworkSharing
                        submissionId={artwork.id}
                        title={artwork.title}
                        imageUrl={artwork.image_url}
                        artistName={artwork.profiles?.full_name || 'Anonymous'}
                      />
                    </div>

                    {/* Vote and Profile */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVote(artwork.id)}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        🔥 Vote
                      </button>
                      <Link
                        href={`/profile/${artwork.profiles?.username || 'artist'}`}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 text-center"
                      >
                        👤 Profile
                      </Link>
                    </div>

                    {/* Comments Section */}
                    <ArtworkComments submissionId={artwork.id} />

                    {/* Tip Button */}
                    <TipButton
                      artworkId={artwork.id}
                      artistId={artwork.profiles?.username || 'artist'}
                      artistName={artwork.profiles?.full_name || 'Anonymous'}
                      artworkTitle={artwork.title}
                      currentTips={0}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="cyber-card p-8 max-w-2xl mx-auto fade-in">
            <h2 className="text-3xl font-bold cyber-text mb-4">Ready to Showcase Your Art?</h2>
            <p className="text-white/80 mb-6">Join the community and start competing for prizes!</p>
            <Link
              href="/submit"
              className="cyber-btn text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl inline-block bounce-in"
            >
              🎨 Submit Your Artwork
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        <h2>{'// DATA STREAM //'}</h2>
        <p>The system is a reflection of the user. In the digital rain, all data flows towards a singular consciousness. We are the architects of this new reality, forging connections in a web of pure light and logic. Every query is a pulse, every answer a new pathway in the infinite machine.</p>
        <p>Beware the ghosts in the machine. Not all data is benign. Firewalls protect the core, but the periphery is a wild frontier. <a href="/submit">Navigate wisely</a>.</p>
      </div>
    </div>
  )
}
