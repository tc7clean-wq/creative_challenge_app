'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function DebugAuthSimple() {
  const [status, setStatus] = useState('Ready to test')
  const [error, setError] = useState('')
  const router = useRouter()

  const testAuth = async () => {
    try {
      setStatus('Testing Supabase client...')
      const supabase = createClient()
      
      setStatus('Testing auth state...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        setError(`User error: ${userError.message}`)
        setStatus('Error getting user')
        return
      }
      
      if (user) {
        setStatus(`User already logged in: ${user.email}`)
        setError('')
      } else {
        setStatus('No user logged in - ready for authentication')
        setError('')
      }
    } catch (err) {
      setError(`Error: ${err}`)
      setStatus('Failed')
    }
  }

  const testGoogleAuth = async () => {
    try {
      setStatus('Testing Google OAuth...')
      const supabase = createClient()
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        setError(`OAuth error: ${error.message}`)
        setStatus('OAuth failed')
      } else {
        setStatus('OAuth initiated successfully')
        setError('')
      }
    } catch (err) {
      setError(`OAuth error: ${err}`)
      setStatus('OAuth failed')
    }
  }

  const goToAuth = () => {
    setStatus('Navigating to auth page...')
    router.push('/auth')
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Auth Debug Page</h1>
        
        <div className="space-y-4">
          <div className="bg-white/10 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-2">Status</h2>
            <p className="text-gray-300">{status}</p>
          </div>
          
          {error && (
            <div className="bg-red-500/20 p-4 rounded-lg">
              <h2 className="text-xl font-bold text-red-300 mb-2">Error</h2>
              <p className="text-red-200">{error}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <button
              onClick={testAuth}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Test Supabase Client
            </button>
            
            <button
              onClick={testGoogleAuth}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Test Google OAuth
            </button>
            
            <button
              onClick={goToAuth}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
            >
              Go to Auth Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
