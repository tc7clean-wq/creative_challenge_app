'use client'

import { useState, useEffect } from 'react'

export default function TestLoadingPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clientTime, setClientTime] = useState<string>('')

  useEffect(() => {
    // Test basic functionality
    try {
      setClientTime(new Date().toISOString())
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    }
  }, [])

  const testButtonClick = () => {
    alert('Button click working!')
  }

  const testRouter = () => {
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading test page...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Loading Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Client-Side Info</h2>
            <div className="space-y-2">
              <p><strong>Client Time:</strong> {clientTime}</p>
              <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}</p>
              <p><strong>Screen Size:</strong> {typeof window !== 'undefined' ? `${screen.width}x${screen.height}` : 'N/A'}</p>
              <p><strong>Window Size:</strong> {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A'}</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Functionality Tests</h2>
            <div className="space-y-4">
              <button 
                onClick={testButtonClick}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded transition-colors"
              >
                Test Button Click
              </button>
              
              <button 
                onClick={testRouter}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Test Navigation
              </button>
              
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/5 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Console Test</h2>
          <p className="text-gray-300 mb-4">Check the browser console for any errors.</p>
          <button 
            onClick={() => console.log('Console test successful!', new Date())}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition-colors"
          >
            Log to Console
          </button>
        </div>
      </div>
    </div>
  )
}
