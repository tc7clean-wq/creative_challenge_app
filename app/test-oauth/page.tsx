'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import type { SupabaseClient } from '@/types/supabase'
import Link from 'next/link'

export default function TestOAuthPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    // Initialize Supabase client
    const client = createClient()
    setSupabase(client)
  }, [])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    
    if (!supabase) return

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        setError(`OAuth Error: ${error.message}`)
        console.error('OAuth error:', error)
      } else {
        console.log('OAuth data:', data)
      }
    } catch (err) {
      setError(`Unexpected error: ${err}`)
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            OAuth Debug Test
          </h2>
          <p className="text-gray-600 mb-6">
            This page helps debug the Google OAuth 400 error
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-600">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Google OAuth'}
        </button>

        <div className="text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-gray-50 p-4 rounded-md text-xs text-gray-600">
          <strong>Debug Info:</strong><br/>
          Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}<br/>
          Current URL: {typeof window !== 'undefined' ? window.location.origin : 'N/A'}
        </div>
      </div>
    </div>
  )
}
