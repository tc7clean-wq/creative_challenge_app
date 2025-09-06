'use client'

import { useEffect } from 'react'
import NavigationHeader from '@/components/navigation/NavigationHeader'
import Link from 'next/link'

export default function ErrorPage() {
  useEffect(() => {
    // Log the error to the console (development only)
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error occurred')
    }
  }, [])

  return (
    <div className="min-h-screen cyber-bg">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-6">⚠️</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Missing Supabase Configuration
            </p>
            
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-yellow-300 mb-4">Setup Required</h2>
              <p className="text-yellow-100 mb-4">
                The application needs Supabase environment variables to be configured.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-yellow-200 font-medium mb-2">1. Create a .env.local file in the project root:</p>
                  <div className="bg-black/50 rounded p-3 font-mono text-sm text-green-300">
                    <div>NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url</div>
                    <div>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key</div>
                  </div>
                </div>
                <div>
                  <p className="text-yellow-200 font-medium mb-2">2. Get your Supabase credentials from:</p>
                  <a 
                    href="https://supabase.com/dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 underline"
                  >
                    https://supabase.com/dashboard
                  </a>
                </div>
                <div>
                  <p className="text-yellow-200 font-medium mb-2">3. Restart the development server after adding the variables</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
