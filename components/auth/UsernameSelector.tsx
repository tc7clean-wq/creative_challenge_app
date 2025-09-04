'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface UsernameSelectorProps {
  onUsernameSelected: (username: string) => void
  onCancel: () => void
}

export default function UsernameSelector({ onUsernameSelected, onCancel }: UsernameSelectorProps) {
  const [username, setUsername] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState('')

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck.trim()) {
      setIsAvailable(null)
      return
    }

    // Basic validation
    if (usernameToCheck.length < 3) {
      setError('Username must be at least 3 characters long')
      setIsAvailable(false)
      return
    }

    if (usernameToCheck.length > 20) {
      setError('Username must be less than 20 characters')
      setIsAvailable(false)
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(usernameToCheck)) {
      setError('Username can only contain letters, numbers, and underscores')
      setIsAvailable(false)
      return
    }

    setIsChecking(true)
    setError('')

    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', usernameToCheck.toLowerCase())
        .single()

      if (error && error.code === 'PGRST116') {
        // No rows found - username is available
        setIsAvailable(true)
      } else if (data) {
        // Username exists
        setIsAvailable(false)
        setError('This username is already taken')
      } else {
        setIsAvailable(false)
        setError('Error checking username availability')
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error checking username:', error)
      }
      setIsAvailable(false)
      setError('Error checking username availability')
    } finally {
      setIsChecking(false)
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    setUsername(value)
    
    // Debounce the check
    const timeoutId = setTimeout(() => {
      checkUsernameAvailability(value)
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAvailable || !username.trim()) {
      return
    }

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('You must be logged in to set a username')
        return
      }

      // Update the user's profile with the username
      const { error } = await supabase
        .from('profiles')
        .update({ username: username.toLowerCase() })
        .eq('id', user.id)

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error updating username:', error)
        }
        setError('Failed to set username. Please try again.')
        return
      }

      onUsernameSelected(username.toLowerCase())
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error setting username:', error)
      }
      setError('Failed to set username. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 max-w-md w-full">
        <h2 className="text-3xl font-bold text-white mb-2" style={{
          fontFamily: 'var(--font-bebas-neue), "Arial Black", "Impact", sans-serif'
        }}>
          CHOOSE YOUR USERNAME
        </h2>
        <p className="text-white/80 mb-6">Pick a unique username that represents you as an artist</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">Username *</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-yellow-500 pr-12"
                maxLength={20}
                required
              />
              {isChecking && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                </div>
              )}
              {!isChecking && isAvailable === true && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                  ✓
                </div>
              )}
              {!isChecking && isAvailable === false && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                  ✗
                </div>
              )}
            </div>
            
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
            
            {isAvailable === true && (
              <p className="text-green-400 text-sm mt-2">✓ Username is available!</p>
            )}
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Username Guidelines:</h3>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• 3-20 characters long</li>
              <li>• Letters, numbers, and underscores only</li>
              <li>• Must be unique (no duplicates)</li>
              <li>• Will be displayed as @username</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!isAvailable || isChecking}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? 'Checking...' : 'Set Username'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
