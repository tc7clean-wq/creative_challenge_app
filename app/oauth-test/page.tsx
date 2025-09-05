'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect, useCallback } from 'react'

export default function OAuthTest() {
  const [status, setStatus] = useState('Initializing...')
  const [config, setConfig] = useState<{
    supabaseUrl: string
    supabaseKey: string
    currentOrigin: string
    redirectUrl: string
  } | null>(null)
  const [testResults, setTestResults] = useState<string[]>([])
  const supabase = createClient()

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result])
  }

  const runDiagnostics = useCallback(async () => {
    setStatus('Running diagnostics...')
    setTestResults([])

    // Test 1: Environment Variables
    addResult('🔍 Testing environment variables...')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
    
    if (!supabaseUrl) {
      addResult('❌ NEXT_PUBLIC_SUPABASE_URL is missing')
      setStatus('Configuration Error')
      return
    }
    if (!supabaseKey) {
      addResult('❌ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY is missing')
      setStatus('Configuration Error')
      return
    }
    addResult('✅ Environment variables are set')

    // Test 2: Supabase Client
    addResult('🔍 Testing Supabase client...')
    try {
      const { error } = await supabase.auth.getSession()
      if (error) {
        addResult(`❌ Supabase client error: ${error.message}`)
        setStatus('Supabase Error')
        return
      }
      addResult('✅ Supabase client working')
    } catch (err) {
      addResult(`❌ Supabase client exception: ${err}`)
      setStatus('Supabase Error')
      return
    }

    // Test 3: OAuth URL Generation
    addResult('🔍 Testing OAuth URL generation...')
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        addResult(`❌ OAuth URL generation failed: ${error.message}`)
        if (error.message.includes('redirect_uri_mismatch')) {
          addResult('🔧 FIX NEEDED: Add redirect URLs to Supabase project')
          addResult(`   Add this URL: ${window.location.origin}/auth/callback`)
        }
        setStatus('OAuth Configuration Error')
        return
      }
      
      if (data?.url) {
        addResult('✅ OAuth URL generated successfully')
        addResult(`🔗 Generated URL: ${data.url.substring(0, 100)}...`)
      } else {
        addResult('⚠️ No OAuth URL returned')
        setStatus('OAuth Error')
        return
      }
    } catch (err) {
      addResult(`❌ OAuth URL generation exception: ${err}`)
      setStatus('OAuth Error')
      return
    }

    // Test 4: Current Configuration
    setConfig({
      supabaseUrl: supabaseUrl.substring(0, 50) + '...',
      supabaseKey: 'Set',
      currentOrigin: window.location.origin,
      redirectUrl: `${window.location.origin}/auth/callback`
    })

    addResult('✅ All tests passed! OAuth should be working.')
    setStatus('Ready to Test')
  }, [supabase.auth])

  useEffect(() => {
    runDiagnostics()
  }, [runDiagnostics])

  const testOAuthFlow = async () => {
    setStatus('Testing OAuth flow...')
    addResult('🚀 Initiating OAuth flow...')
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        addResult(`❌ OAuth flow failed: ${error.message}`)
        setStatus('OAuth Failed')
      } else {
        addResult('✅ OAuth flow initiated - redirecting to Google...')
        setStatus('Redirecting to Google...')
        // The redirect will happen automatically
      }
    } catch (err) {
      addResult(`❌ OAuth flow exception: ${err}`)
      setStatus('OAuth Failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">OAuth Diagnostic & Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Status */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Status</h2>
            <div className="text-lg font-semibold text-yellow-400">{status}</div>
          </div>

          {/* Configuration */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Configuration</h2>
            {config ? (
              <div className="space-y-2 text-sm">
                <div className="text-gray-300">
                  <span className="font-semibold">Supabase URL:</span>
                  <div className="text-green-400">{config.supabaseUrl}</div>
                </div>
                <div className="text-gray-300">
                  <span className="font-semibold">Supabase Key:</span>
                  <span className="ml-2 text-green-400">{config.supabaseKey}</span>
                </div>
                <div className="text-gray-300">
                  <span className="font-semibold">Current Origin:</span>
                  <div className="text-blue-400">{config.currentOrigin}</div>
                </div>
                <div className="text-gray-300">
                  <span className="font-semibold">Redirect URL:</span>
                  <div className="text-yellow-400">{config.redirectUrl}</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400">Loading...</div>
            )}
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Test Results</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm text-gray-300 font-mono">
                {result}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={runDiagnostics}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Run Diagnostics
            </button>
            <button
              onClick={testOAuthFlow}
              disabled={status !== 'Ready to Test'}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Test OAuth Flow
            </button>
          </div>
        </div>

        {/* Instructions */}
        {status === 'OAuth Configuration Error' && (
          <div className="mt-8 bg-red-500/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30">
            <h2 className="text-xl font-bold text-red-400 mb-4">Fix Required</h2>
            <div className="text-red-300 text-sm space-y-2">
              <p><strong>1. Go to Supabase Dashboard → Authentication → URL Configuration</strong></p>
              <p><strong>2. Add these URLs to Redirect URLs:</strong></p>
              <div className="bg-black/20 p-3 rounded mt-2 font-mono text-xs">
                {config?.redirectUrl}<br/>
                https://creative-challenge-app.vercel.app/auth/callback
              </div>
              <p><strong>3. Save the configuration</strong></p>
              <p><strong>4. Run diagnostics again</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
