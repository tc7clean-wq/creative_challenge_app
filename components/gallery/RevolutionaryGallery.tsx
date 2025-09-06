'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'

interface Artwork {
  id: string
  title: string
  description: string
  image_url: string
  created_at: string
  profiles: {
    username: string
    full_name: string
  }
  votes_count: number
  is_featured: boolean
}

export default function RevolutionaryGallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [filter, setFilter] = useState<'all' | 'trending' | 'recent' | 'featured'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredArtwork, setHoveredArtwork] = useState<string | null>(null)

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
          created_at,
          votes_count,
          is_featured,
          profiles!inner(username, full_name)
        `)
        .order('created_at', { ascending: false })

      if (filter === 'trending') {
        query = query.order('votes_count', { ascending: false })
      } else if (filter === 'featured') {
        query = query.eq('is_featured', true)
      }

      const { data, error } = await query.limit(20)

      if (error) throw error
      
      // Transform the data to match our interface
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedData = (data || []).map((item: any) => ({
        ...item,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
      }))
      
      setArtworks(transformedData)
    } catch (error) {
      console.error('Error fetching artworks:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchArtworks()
  }, [fetchArtworks])

  const filteredArtworks = artworks.filter(artwork => {
    if (searchQuery) {
      return artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             artwork.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
             artwork.profiles.username.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return true
  })

  const handleVote = async (artworkId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('votes')
        .insert([{ submission_id: artworkId }])

      if (!error) {
        setArtworks(prev => prev.map(artwork => 
          artwork.id === artworkId 
            ? { ...artwork, votes_count: artwork.votes_count + 1 }
            : artwork
        ))
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-quantum-entanglement w-16 h-16 mx-auto mb-4">
            <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
          </div>
          <p className="text-white/80 text-xl">Loading quantum gallery...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text-holographic">
            Quantum Gallery
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Explore the most innovative AI-generated artworks from our global community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search artworks, artists, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All', icon: '🌟' },
                { key: 'trending', label: 'Trending', icon: '🔥' },
                { key: 'recent', label: 'Recent', icon: '✨' },
                { key: 'featured', label: 'Featured', icon: '⭐' }
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as 'all' | 'trending' | 'recent' | 'featured')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === key
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className="mr-2">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Artwork Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className="group glass-card p-4 interactive-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredArtwork(artwork.id)}
              onMouseLeave={() => setHoveredArtwork(null)}
            >
              {/* Artwork Image */}
              <div className="relative aspect-square mb-4 rounded-xl overflow-hidden">
                <Image
                  src={artwork.image_url}
                  alt={artwork.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Vote Button */}
                <button
                  onClick={() => handleVote(artwork.id)}
                  className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  ❤️
                </button>

                {/* Featured Badge */}
                {artwork.is_featured && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold rounded-full">
                    ⭐ Featured
                  </div>
                )}
              </div>

              {/* Artwork Info */}
              <div className="space-y-2">
                <h3 className="font-bold text-white text-lg line-clamp-1 group-hover:gradient-text-cyber transition-all duration-300">
                  {artwork.title}
                </h3>
                
                <p className="text-gray-400 text-sm line-clamp-2">
                  {artwork.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">
                      {artwork.profiles.username}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-pink-400">
                    <span>❤️</span>
                    <span className="text-sm font-medium">{artwork.votes_count}</span>
                  </div>
                </div>
              </div>

              {/* Hover Effects */}
              {hoveredArtwork === artwork.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-xl pointer-events-none animate-neural-pulse"></div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredArtworks.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-white mb-4">No artworks found</h3>
            <p className="text-gray-400 mb-8">
              {searchQuery ? 'Try adjusting your search terms' : 'Be the first to upload an artwork!'}
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300">
              Upload Artwork
            </button>
          </div>
        )}
      </div>

      {/* Artwork Modal */}
      {selectedArtwork && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold gradient-text-holographic">
                  {selectedArtwork.title}
                </h2>
                <button
                  onClick={() => setSelectedArtwork(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <Image
                    src={selectedArtwork.image_url}
                    alt={selectedArtwork.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    {selectedArtwork.description}
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
                      <span className="text-white font-medium">
                        {selectedArtwork.profiles.username}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-pink-400">
                      <span>❤️</span>
                      <span className="font-medium">{selectedArtwork.votes_count} votes</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleVote(selectedArtwork.id)}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                  >
                    ❤️ Vote for this artwork
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
