'use client'

import { useState, useEffect } from 'react'
import QuantumButton from '@/components/quantum/QuantumButton'
import HolographicCard from '@/components/quantum/HolographicCard'
import ParticleSystem from '@/components/quantum/ParticleSystem'

interface Artwork {
  id: string
  title: string
  description: string
  image_url: string
  artist: string
  votes: number
  tags: string[]
  created_at: string
  isLive?: boolean
}

export default function RevolutionaryGallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [filter, setFilter] = useState<'all' | 'trending' | 'live' | 'recent'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    const mockArtworks: Artwork[] = [
      {
        id: '1',
        title: 'Neural Dreams',
        description: 'A surreal exploration of AI consciousness through digital art',
        image_url: '/api/placeholder/400/400',
        artist: 'Alex Quantum',
        votes: 1247,
        tags: ['AI Art', 'Surreal', 'Digital'],
        created_at: '2024-01-15',
        isLive: true
      },
      {
        id: '2',
        title: 'Cyber Cityscape',
        description: 'Futuristic urban landscape generated with advanced AI',
        image_url: '/api/placeholder/400/400',
        artist: 'Maya Cyber',
        votes: 892,
        tags: ['Cyberpunk', 'City', 'Futuristic'],
        created_at: '2024-01-14'
      },
      {
        id: '3',
        title: 'Quantum Portraits',
        description: 'Abstract human faces created through quantum algorithms',
        image_url: '/api/placeholder/400/400',
        artist: 'Sam Neural',
        votes: 1563,
        tags: ['Portrait', 'Abstract', 'Quantum'],
        created_at: '2024-01-13',
        isLive: true
      },
      {
        id: '4',
        title: 'Digital Nature',
        description: 'AI-generated natural landscapes with impossible beauty',
        image_url: '/api/placeholder/400/400',
        artist: 'River Digital',
        votes: 743,
        tags: ['Nature', 'Landscape', 'Digital'],
        created_at: '2024-01-12'
      },
      {
        id: '5',
        title: 'Holographic Emotions',
        description: 'Visual representation of human emotions through AI',
        image_url: '/api/placeholder/400/400',
        artist: 'Luna Hologram',
        votes: 2105,
        tags: ['Emotion', 'Holographic', 'Abstract'],
        created_at: '2024-01-11'
      },
      {
        id: '6',
        title: 'Plasma Architecture',
        description: 'Impossible buildings designed by AI imagination',
        image_url: '/api/placeholder/400/400',
        artist: 'Zara Plasma',
        votes: 987,
        tags: ['Architecture', 'Plasma', 'Impossible'],
        created_at: '2024-01-10',
        isLive: true
      }
    ]

    setTimeout(() => {
      setArtworks(mockArtworks)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredArtworks = artworks.filter((artwork: Artwork) => {
    if (searchQuery) {
      return artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             artwork.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
             artwork.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
             artwork.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    switch (filter) {
      case 'trending':
        return artwork.votes > 1000
      case 'live':
        return artwork.isLive
      case 'recent':
        return new Date(artwork.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      default:
        return true
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading quantum gallery...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Quantum Background */}
      <div className="absolute inset-0">
        <div className="quantum-grid absolute inset-0"></div>
        <ParticleSystem particleCount={30} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="quantum-glass-ultra mx-4 mt-4 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-holographic-text mb-2">
                Quantum Gallery
              </h1>
              <p className="text-gray-300">
                Discover extraordinary AI-generated artwork from our community
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search artwork..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="quantum-glass px-4 py-2 pr-10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
              
              <QuantumButton href="/create" variant="primary">
                Create Art
              </QuantumButton>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="quantum-glass mx-4 mt-4 rounded-2xl p-2">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Artwork', icon: '🎨' },
              { key: 'trending', label: 'Trending', icon: '🔥' },
              { key: 'live', label: 'Live Creation', icon: '⚡' },
              { key: 'recent', label: 'Recent', icon: '✨' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key as 'all' | 'trending' | 'live' | 'recent')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  filter === key
                    ? 'quantum-button'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Artwork Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtworks.map((artwork) => (
              <HolographicCard
                key={artwork.id}
                glowColor="cyan"
                className="group cursor-pointer"
                onClick={() => setSelectedArtwork(artwork)}
              >
                <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-white text-2xl font-bold">
                    {artwork.title.charAt(0)}
                  </div>
                  
                  {/* Live indicator */}
                  {artwork.isLive && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      LIVE
                    </div>
                  )}
                  
                  {/* Vote count */}
                  <div className="absolute top-4 right-4 quantum-glass px-3 py-1 rounded-full text-white text-sm font-semibold">
                    ❤️ {artwork.votes}
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white">
                      <div className="text-sm font-semibold">{artwork.artist}</div>
                      <div className="text-xs text-gray-300">{artwork.created_at}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {artwork.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {artwork.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {artwork.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <QuantumButton size="sm" className="flex-1">
                      ❤️ Vote
                    </QuantumButton>
                    <QuantumButton size="sm" variant="secondary" className="flex-1">
                      💬 Comment
                    </QuantumButton>
                  </div>
                </div>
              </HolographicCard>
            ))}
          </div>
        </div>

        {/* Artwork Modal */}
        {selectedArtwork && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="quantum-glass-ultra max-w-4xl w-full rounded-3xl overflow-hidden">
                              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-square">
                  <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-white text-6xl font-bold">
                    {selectedArtwork.title.charAt(0)}
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {selectedArtwork.title}
                      </h2>
                      <div className="text-gray-300 mb-4">
                        by <span className="text-cyan-400 font-semibold">{selectedArtwork.artist}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedArtwork(null)}
                      className="text-white/70 hover:text-white text-2xl"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {selectedArtwork.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedArtwork.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-4">
                    <QuantumButton className="flex-1">
                      ❤️ Vote ({selectedArtwork.votes})
                    </QuantumButton>
                    <QuantumButton variant="secondary" className="flex-1">
                      💬 Comment
                    </QuantumButton>
                    <QuantumButton variant="secondary" className="flex-1">
                      📤 Share
                    </QuantumButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
