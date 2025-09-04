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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-6">⚠️</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-xl text-white/80 mb-8">
              We encountered an unexpected error. This might be due to missing environment variables or a configuration issue.
            </p>
            
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Go Home
              </Link>
              
              <div className="text-white/60 text-sm">
                <p>If this problem persists, please check:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Environment variables are properly set</li>
                  <li>• Database connection is working</li>
                  <li>• All required services are running</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
