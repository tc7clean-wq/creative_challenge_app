'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import Image from 'next/image'


interface SearchResult {
  id: string
  type: 'artwork' | 'artist'
  title: string
  description?: string
  image_url?: string
  username?: string
  full_name?: string
  avatar_url?: string
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const search = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      // Search artworks
      const { data: artworks } = await supabase
        .from('submissions')
        .select(`
          id,
          title,
          description,
          image_url,
          profiles!inner(username, full_name, avatar_url)
        `)
        .or(`title.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%`)
        .limit(5)

      // Search artists
      const { data: artists } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .or(`username.ilike.%${searchQuery}%, full_name.ilike.%${searchQuery}%`)
        .limit(5)

      const searchResults: SearchResult[] = [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(artworks || []).map((artwork: any) => {
          const profile = Array.isArray(artwork.profiles) ? artwork.profiles[0] : artwork.profiles
          return {
            id: artwork.id,
            type: 'artwork' as const,
            title: artwork.title,
            description: artwork.description,
            image_url: artwork.image_url,
            username: profile.username,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url
          }
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(artists || []).map((artist: any) => ({
          id: artist.id,
          type: 'artist' as const,
          title: artist.full_name || artist.username,
          username: artist.username,
          avatar_url: artist.avatar_url
        }))
      ]

      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    search(value)
    setIsOpen(value.length > 0)
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search artworks and artists..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="w-full md:w-80 px-4 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-300"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          {loading ? (
            <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          {results.length === 0 && query.length > 1 ? (
            <div className="p-4 text-gray-500 text-center">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="py-2">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.type === 'artwork' ? `/artwork/${result.id}` : `/artist/${result.id}`}
                  onClick={handleResultClick}
                  className="flex items-center p-4 hover:bg-white/10 transition-colors duration-200"
                >
                  {result.type === 'artwork' ? (
                    <>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        {result.image_url ? (
                          <Image
                            src={result.image_url}
                            alt={result.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                            🎨
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="text-gray-900 font-semibold truncate">{result.title}</div>
                        <div className="text-sm text-gray-600 truncate">{result.description}</div>
                        <div className="text-xs text-gray-500">by {result.username}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {result.avatar_url ? (
                          <Image
                            src={result.avatar_url}
                            alt={result.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                            {result.title.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="text-gray-900 font-semibold">{result.title}</div>
                        <div className="text-sm text-gray-600">@{result.username}</div>
                        <div className="text-xs text-gray-500">Artist</div>
                      </div>
                    </>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
