'use client'

import { useState, useEffect, useCallback } from 'react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
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
        console.error('Error fetching artworks:', error)
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
      console.error('Error fetching artworks:', error)
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
        {/* Neural loading background */}
        <svg className="neural-network">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <line className="neural-line" x1="0" y1="50%" x2="100%" y2="50%" filter="url(#glow)" style={{animationDelay: '0s'}}/>
          <line className="neural-line" x1="50%" y1="0" x2="50%" y2="100%" filter="url(#glow)" style={{animationDelay: '1s'}}/>
        </svg>
        
        {/* Quantum grid background */}
        <div className="fixed inset-0 quantum-grid opacity-20"></div>
        
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-6 p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl future-card holographic-bg">
            {/* Enhanced loading spinner */}
            <div className="relative">
              <div className="w-20 h-20 border-4 border-transparent border-t-cyan-400 border-r-purple-500 border-b-pink-500 border-l-cyan-400 rounded-full animate-spin neon-glow"></div>
              <div className="absolute inset-2 w-16 h-16 border-2 border-transparent border-t-purple-400 border-r-cyan-500 border-b-purple-500 border-l-pink-400 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
              <div className="absolute inset-4 w-12 h-12 border-2 border-transparent border-t-pink-400 border-r-purple-500 border-b-cyan-500 border-l-pink-400 rounded-full animate-spin" style={{animationDuration: '2s'}}></div>
            </div>
            <div className="text-white text-lg font-medium neon-text data-stream">Loading amazing artworks...</div>
            {/* Progress indicators */}
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
      {/* Neural Network Background */}
      <svg className="neural-network">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <line className="neural-line" x1="0" y1="30%" x2="100%" y2="70%" filter="url(#glow)" style={{animationDelay: '0s'}}/>
        <line className="neural-line" x1="100%" y1="20%" x2="0%" y2="80%" filter="url(#glow)" style={{animationDelay: '1.5s'}}/>
        <line className="neural-line" x1="30%" y1="0" x2="70%" y2="100%" filter="url(#glow)" style={{animationDelay: '3s'}}/>
      </svg>

      {/* Holographic Background */}
      <div className="fixed inset-0 holographic-bg opacity-50"></div>

      {/* Quantum Grid */}
      <div className="fixed inset-0 quantum-grid opacity-20"></div>

      <SocialNavbar />
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent neon-text">
            Creative Gallery
          </h1>
          <p className="text-lg text-gray-400 data-stream">Discover and vote for stunning AI-generated masterpieces</p>
          
          {/* Sort Options */}
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => setSortBy('popular')}
              className={`px-6 py-3 rounded-xl font-medium transition-all future-card ${
                sortBy === 'popular'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg neon-glow'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
              }`}
            >
              🔥 Trending
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-6 py-3 rounded-xl font-medium transition-all future-card ${
                sortBy === 'newest'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg neon-glow'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
              }`}
            >
              ✨ Latest
            </button>
          </div>
        </div>

        {/* Artworks Grid */}
        {artworks.length === 0 ? (
          <div className="text-center text-gray-400 text-xl mt-20">
            No artworks yet. Be the first to showcase your AI art!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map((artwork, index) => (
              <div 
                key={artwork.id} 
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 future-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Artwork Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={artwork.image_url}
                    alt={artwork.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Enhanced Vote badge with neon glow */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 neon-glow">
                    <span className="text-orange-400">🔥</span>
                    <span className="text-white font-semibold text-sm">{artwork.votes}</span>
                  </div>
                </div>

                {/* Artwork Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-300 transition-colors">
                    {artwork.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {artwork.description}
                  </p>
                  
                  {/* Artist Info */}
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold mr-2.5">
                      {artwork.profiles?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {artwork.profiles?.full_name || 'Anonymous'}
                      </div>
                      <div className="text-gray-500 text-xs">@{artwork.profiles?.username || 'artist'}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVote(artwork.id)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg future-card neon-glow"
                    >
                      Vote
                    </button>
                    <Link
                      href={`/profile/${artwork.profiles?.username || 'artist'}`}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm font-medium transition-all duration-200 text-center future-card"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Call to Action */}
        <div className="text-center mt-20 mb-12">
          <div className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-cyan-900/20 backdrop-blur-sm border border-white/10 rounded-3xl future-card holographic-bg">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent neon-text">
              Ready to Showcase Your Art?
            </h2>
            <p className="text-gray-400 mb-6 data-stream">Join the community and start competing for amazing prizes!</p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 future-card neon-glow"
            >
              <span>Submit Your Artwork</span>
              <span className="text-xl">🎨</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
