'use client'

import { useRouter } from 'next/navigation'

export default function DebugButtonsPage() {
  const router = useRouter()

  const handleTestClick = () => {
    console.log('Button clicked!')
    alert('Button is working!')
  }

  const handleNavigateToAuth = () => {
    console.log('Navigating to auth...')
    router.push('/auth')
  }

  const handleNavigateToGallery = () => {
    console.log('Navigating to gallery...')
    router.push('/gallery')
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Debug Buttons Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={handleTestClick}
          className="block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Test Button (Should show alert)
        </button>
        
        <button
          onClick={handleNavigateToAuth}
          className="block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Navigate to Auth
        </button>
        
        <button
          onClick={handleNavigateToGallery}
          className="block px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          Navigate to Gallery
        </button>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Environment Check:</h2>
        <div className="space-y-2">
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? '✅ Set' : '❌ Missing'}</p>
        </div>
      </div>
    </div>
  )
}
