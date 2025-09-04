'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'

export default function CheckOAuthConfig() {
  const [config, setConfig] = useState<{
    supabaseUrl: string
    supabaseKey: string
    redirectUrl: string
    currentUrl: string
  } | null>(null)
  const [testResult, setTestResult] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    setConfig({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? 'Set' : 'Not set',
      redirectUrl: `${window.location.origin}/auth/callback`,
      currentUrl: window.location.origin
    })
  }, [])

  const testOAuthConfig = async () => {
    setTestResult('Testing OAuth configuration...')
    
    try {
      // Test if we can create an OAuth URL
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) {
        setTestResult(`❌ OAuth Error: ${error.message}`)
      } else if (data?.url) {
        setTestResult(`✅ OAuth URL Generated Successfully!
        
Generated URL: ${data.url}

This means your Supabase configuration is working. The issue might be:
1. Redirect URLs not added to Supabase project
2. Google OAuth app not configured properly
3. Domain not authorized in Google Console`)
      } else {
        setTestResult('⚠️ No URL generated - this might indicate a configuration issue')
      }
    } catch (err) {
      setTestResult(`❌ Exception: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">OAuth Configuration Check</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Configuration Display */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Current Configuration</h2>
            {config ? (
              <div className="space-y-3 text-sm">
                <div className="text-gray-300">
                  <span className="font-semibold">Supabase URL:</span>
                  <div className="text-green-400 break-all">{config.supabaseUrl}</div>
                </div>
                <div className="text-gray-300">
                  <span className="font-semibold">Supabase Key:</span>
                  <span className="ml-2 text-green-400">{config.supabaseKey}</span>
                </div>
                <div className="text-gray-300">
                  <span className="font-semibold">Current URL:</span>
                  <div className="text-blue-400">{config.currentUrl}</div>
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

          {/* Test Results */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Test Results</h2>
            {testResult ? (
              <div className="text-sm whitespace-pre-line text-gray-300">
                {testResult}
              </div>
            ) : (
              <div className="text-gray-400">Click &quot;Test OAuth Config&quot; to see results</div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={testOAuthConfig}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Test OAuth Config
            </button>
            <a
              href="/test-oauth-simple"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Try Simple OAuth Test
            </a>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-yellow-500/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">Required Supabase Settings</h2>
          <div className="text-yellow-300 text-sm space-y-2">
            <p><strong>1. Go to Supabase Dashboard → Authentication → URL Configuration</strong></p>
            <p><strong>2. Add these URLs to &quot;Redirect URLs&quot;:</strong></p>
            <div className="bg-black/20 p-3 rounded mt-2 font-mono text-xs">
              {config?.redirectUrl}<br/>
              https://creative-challenge-app.vercel.app/auth/callback
            </div>
            <p><strong>3. Make sure Google provider is enabled in Authentication → Providers</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}
