'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function DebugAuthPage() {
  const [status, setStatus] = useState('Loading...')
  const [envVars, setEnvVars] = useState<Record<string, string | number>>({})
  const [supabaseTest, setSupabaseTest] = useState<Record<string, string | boolean>>({})

  useEffect(() => {
    const debugAuth = async () => {
      try {
        // Test 1: Environment Variables
        setStatus('Checking environment variables...')
        setEnvVars({
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? 'SET' : 'MISSING',
          urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined',
          keyLength: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.length || 0
        })

        // Test 2: Supabase Client
        setStatus('Testing Supabase client...')
        const supabase = createClient()
        
        // Test session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        setSupabaseTest({
          clientCreated: true,
          sessionError: sessionError?.message || 'None',
          hasSession: !!session,
          userEmail: session?.user?.email || 'No user'
        })

        // Test 3: OAuth Test
        setStatus('Testing OAuth configuration...')
        const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        })

        setSupabaseTest(prev => ({
          ...prev,
          oauthError: oauthError?.message || 'None',
          oauthData: oauthData ? 'OAuth initiated' : 'No OAuth data'
        }))

        setStatus('Debug complete!')

      } catch (error) {
        setStatus(`Error: ${error}`)
        console.error('Debug error:', error)
      }
    }
    
    debugAuth()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Status:</h2>
          <p className="text-yellow-400">{status}</p>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Environment Variables:</h2>
          <div className="bg-gray-800 p-4 rounded text-sm">
            <pre>{JSON.stringify(envVars, null, 2)}</pre>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Supabase Test:</h2>
          <div className="bg-gray-800 p-4 rounded text-sm">
            <pre>{JSON.stringify(supabaseTest, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}