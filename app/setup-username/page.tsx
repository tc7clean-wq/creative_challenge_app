'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import UsernameSelector from '@/components/auth/UsernameSelector'

export default function SetupUsernamePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [needsUsername, setNeedsUsername] = useState(false)
  const [, setUser] = useState<{ id: string; email?: string } | null>(null)
  const router = useRouter()

  const checkUserProfile = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push('/login')
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
        // If profile doesn't exist (PGRST116), that's expected for new users
        if (error.code === 'PGRST116') {
          setNeedsUsername(true)
          return
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching profile:', error)
        }
        router.push('/login')
        return
      }

      if (!profile?.username) {
        setNeedsUsername(true)
      } else {
        // User already has a username, redirect to home
        router.push('/authenticated-home-simple')
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error checking user profile:', error)
      }
      router.push('/login')
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
    // User cancelled, redirect to login
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white/80">Loading...</p>
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
