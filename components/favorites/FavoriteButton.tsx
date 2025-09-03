'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { SupabaseClient } from '@/types/supabase'

interface FavoriteButtonProps {
  userId: string
  submissionId?: string
  portfolioItemId?: string
  className?: string
  showText?: boolean
}

export default function FavoriteButton({ 
  userId, 
  submissionId, 
  portfolioItemId, 
  className = '',
  showText = true 
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  const checkFavoriteStatus = useCallback(async () => {
    if (!supabase || !userId) return

    try {
      let query = supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', userId)

      if (submissionId) {
        query = query.eq('submission_id', submissionId)
      } else if (portfolioItemId) {
        query = query.eq('portfolio_item_id', portfolioItemId)
      } else {
        return
      }

      const { data, error } = await query.single()

      if (error && error.code !== 'PGRST116') throw error
      setIsFavorited(!!data)
    } catch (err) {
      console.error('Error checking favorite status:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, userId, submissionId, portfolioItemId])

  useEffect(() => {
    // Initialize Supabase client
    const client = createClient()
    setSupabase(client)
  }, [])

  useEffect(() => {
    if (supabase) {
      checkFavoriteStatus()
    }
  }, [supabase, checkFavoriteStatus])

  const handleToggleFavorite = async () => {
    if (!supabase || !userId || saving) return

    setSaving(true)

    try {
      if (isFavorited) {
        // Remove from favorites
        let query = supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', userId)

        if (submissionId) {
          query = query.eq('submission_id', submissionId)
        } else if (portfolioItemId) {
          query = query.eq('portfolio_item_id', portfolioItemId)
        }

        const { error } = await query

        if (error) throw error
        setIsFavorited(false)
      } else {
        // Add to favorites
        const favoriteData: { user_id: string; submission_id?: string; portfolio_item_id?: string } = {
          user_id: userId
        }

        if (submissionId) {
          favoriteData.submission_id = submissionId
        } else if (portfolioItemId) {
          favoriteData.portfolio_item_id = portfolioItemId
        }

        const { error } = await supabase
          .from('user_favorites')
          .insert([favoriteData])

        if (error) throw error
        setIsFavorited(true)
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <button
        disabled
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 text-white/50 ${className}`}
      >
        <div className="w-4 h-4 bg-white/20 rounded animate-pulse"></div>
        {showText && <span className="text-sm">Loading...</span>}
      </button>
    )
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={saving}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
        isFavorited
          ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
      } ${className}`}
    >
      <span className="text-lg">
        {isFavorited ? '❤️' : '🤍'}
      </span>
      {showText && (
        <span className="text-sm font-medium">
          {saving 
            ? (isFavorited ? 'Removing...' : 'Saving...') 
            : (isFavorited ? 'Favorited' : 'Add to Favorites')
          }
        </span>
      )}
    </button>
  )
}
