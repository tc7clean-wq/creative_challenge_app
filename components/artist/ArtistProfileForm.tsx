'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { SupabaseClient } from '@/types/supabase'

interface ArtistProfile {
  id: string
  artist_bio?: string
  artist_website?: string
  artist_instagram?: string
  artist_twitter?: string
  artist_location?: string
  artist_specialties?: string[]
  artist_experience_years?: number
  is_artist: boolean
  portfolio_public: boolean
  accepts_commissions: boolean
  commission_rates?: {
    portrait?: number
    landscape?: number
    digital_art?: number
    custom?: number
  }
}

interface ArtistProfileFormProps {
  userId: string
  onProfileUpdated?: () => void
  className?: string
}

export default function ArtistProfileForm({ userId, onProfileUpdated, className = '' }: ArtistProfileFormProps) {
  const [, setProfileData] = useState<ArtistProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  const [formData, setFormData] = useState({
    artist_bio: '',
    artist_website: '',
    artist_instagram: '',
    artist_twitter: '',
    artist_location: '',
    artist_specialties: [] as string[],
    artist_experience_years: 0,
    is_artist: false,
    portfolio_public: true,
    accepts_commissions: false,
    commission_rates: {
      portrait: 0,
      landscape: 0,
      digital_art: 0,
      custom: 0
    }
  })

  const availableSpecialties = [
    'Digital Art', 'Photography', 'Illustration', '3D Art', 'Concept Art',
    'Portrait Art', 'Landscape Art', 'Abstract Art', 'Fantasy Art', 'Sci-Fi Art',
    'Character Design', 'Environment Design', 'UI/UX Design', 'Graphic Design',
    'Traditional Art', 'Mixed Media', 'Animation', 'Motion Graphics'
  ]

  const fetchProfile = useCallback(async () => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      if (data) {
        setProfileData(data)
        setFormData({
          artist_bio: data.artist_bio || '',
          artist_website: data.artist_website || '',
          artist_instagram: data.artist_instagram || '',
          artist_twitter: data.artist_twitter || '',
          artist_location: data.artist_location || '',
          artist_specialties: data.artist_specialties || [],
          artist_experience_years: data.artist_experience_years || 0,
          is_artist: data.is_artist || false,
          portfolio_public: data.portfolio_public !== false,
          accepts_commissions: data.accepts_commissions || false,
          commission_rates: data.commission_rates || {
            portrait: 0,
            landscape: 0,
            digital_art: 0,
            custom: 0
          }
        })
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Failed to load profile')
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
      fetchProfile()
    }
  }, [supabase, fetchProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (!supabase) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          artist_bio: formData.artist_bio || null,
          artist_website: formData.artist_website || null,
          artist_instagram: formData.artist_instagram || null,
          artist_twitter: formData.artist_twitter || null,
          artist_location: formData.artist_location || null,
          artist_specialties: formData.artist_specialties.length > 0 ? formData.artist_specialties : null,
          artist_experience_years: formData.artist_experience_years || 0,
          is_artist: formData.is_artist,
          portfolio_public: formData.portfolio_public,
          accepts_commissions: formData.accepts_commissions,
          commission_rates: formData.accepts_commissions ? formData.commission_rates : null
        })
        .eq('id', userId)

      if (error) throw error

      onProfileUpdated?.()
      alert('Profile updated successfully!')
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      artist_specialties: prev.artist_specialties.includes(specialty)
        ? prev.artist_specialties.filter(s => s !== specialty)
        : [...prev.artist_specialties, specialty]
    }))
  }

  if (loading) {
    return (
      <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="h-32 bg-white/20 rounded mb-4"></div>
          <div className="h-10 bg-white/20 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 ${className}`}>
      <h3 className="text-2xl font-bold text-white mb-6">
        🎨 Artist Profile Setup
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Artist Status */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_artist}
              onChange={(e) => setFormData(prev => ({ ...prev, is_artist: e.target.checked }))}
              className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
            />
            <span className="text-white font-medium">I am an artist and want to showcase my work</span>
          </label>
        </div>

        {formData.is_artist && (
          <>
            {/* Bio */}
            <div>
              <label className="block text-white font-medium mb-2">
                Artist Bio *
              </label>
              <textarea
                value={formData.artist_bio}
                onChange={(e) => setFormData(prev => ({ ...prev, artist_bio: e.target.value }))}
                placeholder="Tell us about yourself, your artistic journey, and what inspires your work..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-white font-medium mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                value={formData.artist_experience_years}
                onChange={(e) => setFormData(prev => ({ ...prev, artist_experience_years: parseInt(e.target.value) || 0 }))}
                min="0"
                max="50"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-white font-medium mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.artist_location}
                onChange={(e) => setFormData(prev => ({ ...prev, artist_location: e.target.value }))}
                placeholder="City, Country"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Specialties */}
            <div>
              <label className="block text-white font-medium mb-3">
                Art Specialties
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableSpecialties.map((specialty) => (
                  <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.artist_specialties.includes(specialty)}
                      onChange={() => handleSpecialtyToggle(specialty)}
                      className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                    />
                    <span className="text-white/80 text-sm">{specialty}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.artist_website}
                  onChange={(e) => setFormData(prev => ({ ...prev, artist_website: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  value={formData.artist_instagram}
                  onChange={(e) => setFormData(prev => ({ ...prev, artist_instagram: e.target.value }))}
                  placeholder="@yourusername"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  Twitter
                </label>
                <input
                  type="text"
                  value={formData.artist_twitter}
                  onChange={(e) => setFormData(prev => ({ ...prev, artist_twitter: e.target.value }))}
                  placeholder="@yourusername"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Portfolio Settings */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Portfolio Settings</h4>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.portfolio_public}
                  onChange={(e) => setFormData(prev => ({ ...prev, portfolio_public: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                />
                <span className="text-white">Make my portfolio public</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.accepts_commissions}
                  onChange={(e) => setFormData(prev => ({ ...prev, accepts_commissions: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                />
                <span className="text-white">I accept commissions</span>
              </label>
            </div>

            {/* Commission Rates */}
            {formData.accepts_commissions && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Commission Rates (USD)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Portrait</label>
                    <input
                      type="number"
                      value={formData.commission_rates.portrait}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        commission_rates: {
                          ...prev.commission_rates,
                          portrait: parseFloat(e.target.value) || 0
                        }
                      }))}
                      min="0"
                      step="0.01"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Landscape</label>
                    <input
                      type="number"
                      value={formData.commission_rates.landscape}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        commission_rates: {
                          ...prev.commission_rates,
                          landscape: parseFloat(e.target.value) || 0
                        }
                      }))}
                      min="0"
                      step="0.01"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Digital Art</label>
                    <input
                      type="number"
                      value={formData.commission_rates.digital_art}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        commission_rates: {
                          ...prev.commission_rates,
                          digital_art: parseFloat(e.target.value) || 0
                        }
                      }))}
                      min="0"
                      step="0.01"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Custom</label>
                    <input
                      type="number"
                      value={formData.commission_rates.custom}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        commission_rates: {
                          ...prev.commission_rates,
                          custom: parseFloat(e.target.value) || 0
                        }
                      }))}
                      min="0"
                      step="0.01"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
