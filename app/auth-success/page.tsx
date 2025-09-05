'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import UsernameSelector from '@/components/auth/UsernameSelector'

export default function AuthSuccessPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [needsUsername, setNeedsUsername] = useState(false)
  const [, setUser] = useState<{ id: string; email?: string } | null>(null)
  const router = useRouter()

  const checkUserProfile = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push('/auth')
        return
      }

      setUser(authUser)

      // Check if user has a username set
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', authUser.id)
        .single()

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching profile:', error)
        }
        // If there's an error, assume they need to set up username
        setNeedsUsername(true)
      } else if (!profile?.username) {
        setNeedsUsername(true)
      } else {
        // User already has a username, redirect to home
        router.push('/authenticated-home-simple')
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error checking user profile:', error)
      }
      // On error, assume they need to set up username
      setNeedsUsername(true)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    checkUserProfile()
  }, [checkUserProfile])

  const handleUsernameSelected = () => {
    // Username has been set, redirect to home
    router.push('/authenticated-home-simple')
  }

  const handleCancel = () => {
    // User cancelled, redirect to auth
    router.push('/auth')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white/80">Setting up your account...</p>
        </div>
      </div>
    )
  }

  if (!needsUsername) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <UsernameSelector 
        onUsernameSelected={handleUsernameSelected}
        onCancel={handleCancel}
      />
    </div>
  )
}
