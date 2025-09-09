'use client'

import { useState, useEffect, useCallback } from 'react'
// import { createClient } from '@/utils/supabase/client' // Not used in mock data
import SocialNavbar from '@/components/layout/SocialNavbar'
// import Link from 'next/link' // Not used in this simplified version

interface UserSettings {
  username: string
  full_name: string
  bio: string
  email: string
  email_notifications: boolean
  contest_notifications: boolean
  like_notifications: boolean
  comment_notifications: boolean
  privacy_public: boolean
  show_email: boolean
}

export default function SettingsPage() {
  const [, setUser] = useState<unknown>(null) // eslint-disable-line @typescript-eslint/no-unused-vars
  const [settings, setSettings] = useState<UserSettings>({
    username: '',
    full_name: '',
    bio: '',
    email: '',
    email_notifications: true,
    contest_notifications: true,
    like_notifications: true,
    comment_notifications: true,
    privacy_public: true,
    show_email: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const fetchUserAndSettings = useCallback(async () => {
    try {
      // const supabase = createClient() // Not used in mock data
      // const { data: { user } } = await supabase.auth.getUser()
      // setUser(user)

      // Mock settings - replace with actual profile fetch
      setSettings({
        username: 'user123',
        full_name: 'User Name',
        bio: 'Digital artist exploring the intersection of technology and creativity.',
        email: 'user@example.com',
        email_notifications: true,
        contest_notifications: true,
        like_notifications: true,
        comment_notifications: true,
        privacy_public: true,
        show_email: false
      })
    } catch (error) {
      console.error('Error fetching user settings:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserAndSettings()
  }, [fetchUserAndSettings])

  const handleInputChange = (field: keyof UserSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // const supabase = createClient() // Not used in mock data
      
      // Mock save - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage('Settings saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="cyber-bg min-h-screen">
        <SocialNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-2xl text-cyan-300">Loading settings...</div>
          </div>
        </div>
      </div>
    )
  }

  // User authentication check removed for mock data

  return (
    <div className="cyber-bg min-h-screen">
      <SocialNavbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold cyber-text glitch mb-2" data-text="[SETTINGS]" style={{ fontFamily: 'var(--font-header)' }}>
            [SETTINGS]
          </h1>
          <p className="text-lg text-cyan-300 mb-6">{'// Customize your creative experience'}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="cyber-card p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('Error') 
                  ? 'bg-red-500/20 border border-red-500/50 text-red-300' 
                  : 'bg-green-500/20 border border-green-500/50 text-green-300'
              }`}>
                {message}
              </div>
            )}

            <div className="space-y-8">
              {/* Profile Settings */}
              <div>
                <h2 className="text-2xl font-bold cyber-text mb-6" style={{ fontFamily: 'var(--font-header)' }}>
                  Profile Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cyan-300 text-sm font-medium mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={settings.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cyan-500 focus:outline-none transition-colors"
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-300 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={settings.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cyan-500 focus:outline-none transition-colors"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-cyan-300 text-sm font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    value={settings.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h2 className="text-2xl font-bold cyber-text mb-6" style={{ fontFamily: 'var(--font-header)' }}>
                  Notifications
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Email Notifications</h3>
                      <p className="text-white/60 text-sm">Receive updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.email_notifications}
                        onChange={(e) => handleInputChange('email_notifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Contest Updates</h3>
                      <p className="text-white/60 text-sm">Get notified about new contests and results</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.contest_notifications}
                        onChange={(e) => handleInputChange('contest_notifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Like Notifications</h3>
                      <p className="text-white/60 text-sm">Get notified when someone likes your art</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.like_notifications}
                        onChange={(e) => handleInputChange('like_notifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Comment Notifications</h3>
                      <p className="text-white/60 text-sm">Get notified when someone comments on your art</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.comment_notifications}
                        onChange={(e) => handleInputChange('comment_notifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <h2 className="text-2xl font-bold cyber-text mb-6" style={{ fontFamily: 'var(--font-header)' }}>
                  Privacy
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Public Profile</h3>
                      <p className="text-white/60 text-sm">Make your profile visible to other users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy_public}
                        onChange={(e) => handleInputChange('privacy_public', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Show Email</h3>
                      <p className="text-white/60 text-sm">Display your email on your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.show_email}
                        onChange={(e) => handleInputChange('show_email', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-white/10">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="cyber-btn px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
