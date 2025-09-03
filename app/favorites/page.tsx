'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { SupabaseClient } from '@/types/supabase'
import NavigationHeader from '@/components/navigation/NavigationHeader'
import Link from 'next/link'
import Image from 'next/image'

interface FavoriteItem {
  id: string
  submission_id?: string
  portfolio_item_id?: string
  created_at: string
  submission?: {
    id: string
    title: string
    description?: string
    image_url: string
    user_id: string
    contest_id: string
    profiles: {
      username: string
      full_name?: string
      avatar_url?: string
    }
    contests: {
      title: string
    }
  } | null
  portfolio_item?: {
    id: string
    title: string
    description?: string
    image_url: string
    category?: string
    artist_id: string
    profiles: {
      username: string
      full_name?: string
      avatar_url?: string
    }
  } | null
}

interface Collection {
  id: string
  name: string
  description?: string
  is_public: boolean
  created_at: string
  item_count: number
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'favorites' | 'collections'>('favorites')
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const fetchFavorites = useCallback(async () => {
    if (!supabase || !userId) return

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          submission_id,
          portfolio_item_id,
          created_at,
          submission:submissions!submission_id(
            id,
            title,
            description,
            image_url,
            user_id,
            contest_id,
            profiles:user_id(
              username,
              full_name,
              avatar_url
            ),
            contests:contest_id(
              title
            )
          ),
          portfolio_item:artist_portfolio!portfolio_item_id(
            id,
            title,
            description,
            image_url,
            category,
            artist_id,
            profiles:artist_id(
              username,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFavorites((data as unknown as FavoriteItem[]) || [])
    } catch (err) {
      console.error('Error fetching favorites:', err)
    }
  }, [supabase, userId])

  const fetchCollections = useCallback(async () => {
    if (!supabase || !userId) return

    try {
      const { data, error } = await supabase
        .from('user_collections')
        .select(`
          id,
          name,
          description,
          is_public,
          created_at,
          collection_items(count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      const collectionsWithCount = (data || []).map(collection => ({
        ...collection,
        item_count: collection.collection_items?.[0]?.count || 0
      }))

      setCollections(collectionsWithCount)
    } catch (err) {
      console.error('Error fetching collections:', err)
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
      fetchFavorites()
      fetchCollections()
      setLoading(false)
    }
  }, [supabase, userId, fetchFavorites, fetchCollections])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            ❤️ My Favorites
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Your personal collection of amazing artwork. Save pieces you love and organize them into collections.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                activeTab === 'favorites'
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              All Favorites ({favorites.length})
            </button>
            <button
              onClick={() => setActiveTab('collections')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                activeTab === 'collections'
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Collections ({collections.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'favorites' ? (
          <div>
            {favorites.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">🤍</div>
                <h3 className="text-2xl font-semibold text-white mb-4">No Favorites Yet</h3>
                <p className="text-white/60 mb-6">
                  Start exploring amazing artwork and save your favorites by clicking the heart icon!
                </p>
                <div className="space-x-4">
                  <Link
                    href="/"
                    className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                  >
                    Explore Artwork
                  </Link>
                  <Link
                    href="/artists"
                    className="inline-block bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300"
                  >
                    Discover Artists
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite) => {
                  const item = favorite.submission || favorite.portfolio_item
                  const artist = favorite.submission?.profiles || favorite.portfolio_item?.profiles
                  
                  if (!item || !artist) return null

                  return (
                    <div key={favorite.id} className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 group">
                      <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full">
                            ❤️ Favorited
                          </span>
                        </div>
                        {favorite.submission && (
                          <div className="absolute bottom-2 left-2">
                            <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                              Contest Entry
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-1 line-clamp-1">{item.title}</h3>
                        {favorite.submission?.contests && (
                          <p className="text-blue-400 text-sm mb-2">{favorite.submission.contests.title}</p>
                        )}
                        {favorite.portfolio_item?.category && (
                          <p className="text-blue-400 text-sm mb-2">{favorite.portfolio_item.category}</p>
                        )}
                        <div className="flex items-center space-x-2 mb-2">
                          {artist.avatar_url ? (
                            <Image
                              src={artist.avatar_url}
                              alt={artist.full_name || artist.username}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {(artist.full_name || artist.username).charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="text-white/70 text-sm">
                            by {artist.full_name || artist.username}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-white/60 text-sm line-clamp-2">{item.description}</p>
                        )}
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-white/50 text-xs">
                            {new Date(favorite.created_at).toLocaleDateString()}
                          </span>
                          <div className="flex space-x-2">
                            {favorite.submission ? (
                              <Link
                                href={`/contests/${favorite.submission.contest_id}`}
                                className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                              >
                                View Contest →
                              </Link>
                            ) : (
                              <Link
                                href={`/artists/${favorite.portfolio_item?.artist_id}`}
                                className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                              >
                                View Artist →
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            {collections.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">📁</div>
                <h3 className="text-2xl font-semibold text-white mb-4">No Collections Yet</h3>
                <p className="text-white/60 mb-6">
                  Create collections to organize your favorite artwork into themed groups.
                </p>
                <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300">
                  Create Your First Collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <div key={collection.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{collection.name}</h3>
                      {collection.is_public && (
                        <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                          Public
                        </span>
                      )}
                    </div>
                    {collection.description && (
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">{collection.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">
                        {collection.item_count} item{collection.item_count !== 1 ? 's' : ''}
                      </span>
                      <span className="text-white/50 text-xs">
                        {new Date(collection.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-4">
                      <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                        View Collection
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
