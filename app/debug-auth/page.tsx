'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'

export default function DebugAuth() {
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  const [authState, setAuthState] = useState<{
    session: string
    user: string
    provider: string
    event?: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Get environment variables
    setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set')
    setSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? 'Set' : 'Not set')
    
    // Get current auth state
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setError(error.message)
      } else {
        setAuthState({
          session: session ? 'Active' : 'None',
          user: session?.user?.email || 'No user',
          provider: session?.user?.app_metadata?.provider || 'Unknown'
        })
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthState({
        session: session ? 'Active' : 'None',
        user: session?.user?.email || 'No user',
        provider: session?.user?.app_metadata?.provider || 'Unknown',
        event: event
      })
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const testGoogleAuth = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        setError(error.message)
      } else {
        console.log('OAuth initiated:', data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Auth Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Environment Variables */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Environment Variables</h2>
            <div className="space-y-2 text-sm">
              <div className="text-gray-300">
                <span className="font-semibold">Supabase URL:</span> 
                <span className="ml-2 text-green-400">{supabaseUrl}</span>
              </div>
              <div className="text-gray-300">
                <span className="font-semibold">Supabase Key:</span> 
                <span className="ml-2 text-green-400">{supabaseKey}</span>
              </div>
            </div>
          </div>

          {/* Auth State */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Auth State</h2>
            {authState ? (
              <div className="space-y-2 text-sm">
                <div className="text-gray-300">
                  <span className="font-semibold">Session:</span> 
                  <span className="ml-2 text-green-400">{authState.session}</span>
                </div>
                <div className="text-gray-300">
                  <span className="font-semibold">User:</span> 
                  <span className="ml-2 text-green-400">{authState.user}</span>
                </div>
                <div className="text-gray-300">
                  <span className="font-semibold">Provider:</span> 
                  <span className="ml-2 text-green-400">{authState.provider}</span>
                </div>
                {authState.event && (
                  <div className="text-gray-300">
                    <span className="font-semibold">Last Event:</span> 
                    <span className="ml-2 text-blue-400">{authState.event}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-400">Loading...</div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="md:col-span-2 bg-red-500/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30">
              <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Test Buttons */}
          <div className="md:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Test Actions</h2>
            <div className="flex gap-4">
              <button
                onClick={testGoogleAuth}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Test Google OAuth
              </button>
              <button
                onClick={() => supabase.auth.signOut()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Current URL */}
          <div className="md:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Current URL Info</h2>
            <div className="space-y-2 text-sm text-gray-300">
              <div><span className="font-semibold">Origin:</span> {typeof window !== 'undefined' ? window.location.origin : 'Server'}</div>
              <div><span className="font-semibold">Pathname:</span> {typeof window !== 'undefined' ? window.location.pathname : 'Server'}</div>
              <div><span className="font-semibold">Search:</span> {typeof window !== 'undefined' ? window.location.search : 'Server'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
