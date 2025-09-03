'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { SupabaseClient } from '@/types/supabase'
import Image from 'next/image'

interface PortfolioItem {
  id: string
  title: string
  description?: string
  image_url: string
  category?: string
  tags?: string[]
  is_featured: boolean
  is_public: boolean
  created_at: string
}

interface ArtistPortfolioManagerProps {
  userId: string
  onPortfolioUpdated?: () => void
  className?: string
}

export default function ArtistPortfolioManager({ userId, onPortfolioUpdated, className = '' }: ArtistPortfolioManagerProps) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: '',
    tags: [] as string[],
    is_featured: false,
    is_public: true,
    image: null as File | null
  })

  const availableCategories = [
    'Digital Art', 'Photography', 'Illustration', '3D Art', 'Concept Art',
    'Portrait Art', 'Landscape Art', 'Abstract Art', 'Fantasy Art', 'Sci-Fi Art',
    'Character Design', 'Environment Design', 'UI/UX Design', 'Graphic Design',
    'Traditional Art', 'Mixed Media', 'Animation', 'Motion Graphics'
  ]

  const fetchPortfolio = useCallback(async () => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('artist_portfolio')
        .select('*')
        .eq('artist_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPortfolioItems(data || [])
    } catch (err) {
      console.error('Error fetching portfolio:', err)
      setError('Failed to load portfolio')
    } finally {
      setLoading(false)
    }
  }, [supabase, userId])

  useEffect(() => {
    // Initialize Supabase client
    const client = createClient()
    setSupabase(client)
  }, [])

  useEffect(() => {
    if (supabase) {
      fetchPortfolio()
    }
  }, [supabase, fetchPortfolio])

  const handleImageUpload = async (file: File): Promise<string> => {
    if (!supabase) throw new Error('Supabase client not initialized')

    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    const filePath = `portfolio/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('artwork')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('artwork')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.image || !supabase) return

    setUploading(true)
    setError('')

    try {
      // Upload image
      const imageUrl = await handleImageUpload(newItem.image)

      // Add portfolio item
      const { error } = await supabase
        .from('artist_portfolio')
        .insert([{
          artist_id: userId,
          title: newItem.title,
          description: newItem.description || null,
          image_url: imageUrl,
          category: newItem.category || null,
          tags: newItem.tags.length > 0 ? newItem.tags : null,
          is_featured: newItem.is_featured,
          is_public: newItem.is_public
        }])

      if (error) throw error

      // Reset form
      setNewItem({
        title: '',
        description: '',
        category: '',
        tags: [],
        is_featured: false,
        is_public: true,
        image: null
      })
      setShowAddForm(false)
      fetchPortfolio()
      onPortfolioUpdated?.()
    } catch (err) {
      console.error('Error adding portfolio item:', err)
      setError('Failed to add portfolio item')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!supabase) return
    if (!confirm('Are you sure you want to delete this portfolio item?')) return

    try {
      const { error } = await supabase
        .from('artist_portfolio')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      fetchPortfolio()
      onPortfolioUpdated?.()
    } catch (err) {
      console.error('Error deleting portfolio item:', err)
      setError('Failed to delete portfolio item')
    }
  }

  const handleToggleFeatured = async (itemId: string, currentFeatured: boolean) => {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('artist_portfolio')
        .update({ is_featured: !currentFeatured })
        .eq('id', itemId)

      if (error) throw error

      fetchPortfolio()
      onPortfolioUpdated?.()
    } catch (err) {
      console.error('Error updating portfolio item:', err)
      setError('Failed to update portfolio item')
    }
  }

  const handleTogglePublic = async (itemId: string, currentPublic: boolean) => {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('artist_portfolio')
        .update({ is_public: !currentPublic })
        .eq('id', itemId)

      if (error) throw error

      fetchPortfolio()
      onPortfolioUpdated?.()
    } catch (err) {
      console.error('Error updating portfolio item:', err)
      setError('Failed to update portfolio item')
    }
  }

  if (loading) {
    return (
      <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white/20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">
          🖼️ Portfolio Management
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300"
        >
          {showAddForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {/* Add New Item Form */}
      {showAddForm && (
        <form onSubmit={handleAddItem} className="mb-8 p-6 bg-white/5 rounded-lg border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-4">Add New Portfolio Item</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-white font-medium mb-2">Title *</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Description</label>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewItem(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newItem.is_featured}
                onChange={(e) => setNewItem(prev => ({ ...prev, is_featured: e.target.checked }))}
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
              />
              <span className="text-white">Featured</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newItem.is_public}
                onChange={(e) => setNewItem(prev => ({ ...prev, is_public: e.target.checked }))}
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
              />
              <span className="text-white">Public</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={uploading || !newItem.image}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Add to Portfolio'}
          </button>
        </form>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Portfolio Grid */}
      {portfolioItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h4 className="text-xl font-semibold text-white mb-2">No portfolio items yet</h4>
          <p className="text-white/60 mb-4">Start building your portfolio by adding your best artwork!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Add Your First Piece
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <div key={item.id} className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 relative">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  {item.is_featured && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                  {!item.is_public && (
                    <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                      🔒 Private
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                {item.category && (
                  <p className="text-blue-400 text-sm mb-2">{item.category}</p>
                )}
                {item.description && (
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{item.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-xs">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleFeatured(item.id, item.is_featured)}
                      className={`text-xs px-2 py-1 rounded ${
                        item.is_featured 
                          ? 'bg-yellow-500 text-white' 
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      ⭐
                    </button>
                    <button
                      onClick={() => handleTogglePublic(item.id, item.is_public)}
                      className={`text-xs px-2 py-1 rounded ${
                        item.is_public 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {item.is_public ? '🌐' : '🔒'}
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
