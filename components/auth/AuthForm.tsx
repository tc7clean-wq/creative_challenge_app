'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'

interface AuthFormProps {
  view?: 'sign_in' | 'sign_up'
}

export default function AuthForm({ view = 'sign_in' }: AuthFormProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create supabase client directly - no need for useState
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const {
      data: { subscription },
    } =     supabase.auth.onAuthStateChange((event, session: Session | null) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth state changed:', event, session?.user?.email)
      }
      
      if (event === 'SIGNED_IN' && session) {
        // Clear any previous errors
        setError(null)
        
        // Get redirect URL from URL params or default to authenticated home
        const urlParams = new URLSearchParams(window.location.search)
        const redirectTo = urlParams.get('redirectTo') || '/authenticated-home'
        
        router.push(redirectTo)
        router.refresh()
      } else if (event === 'SIGNED_OUT') {
        // Clear any errors when signing out
        setError(null)
        router.push('/')
        router.refresh()
      } else if (event === 'TOKEN_REFRESHED') {
        // Token refreshed successfully
        if (process.env.NODE_ENV === 'development') {
          console.log('Token refreshed successfully')
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase.auth, mounted])

  // Handle auth errors (currently unused but available for future use)
  // const handleAuthError = (error: Error) => {
  //   console.error('Auth error:', error)
  //   setError(error.message)
  // }

  if (!mounted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#3b82f6',
                brandAccent: '#1d4ed8',
              },
            },
          },
        }}
        providers={['google']}
        view={view}
        showLinks={true}
        redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
      />
    </div>
  )
}
  