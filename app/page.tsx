'use client'

import dynamic from 'next/dynamic'

// Dynamically import the AI Social Feed to avoid SSR issues
const AISocialFeed = dynamic(() => import('@/components/ai-social/AISocialFeed'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-cyan-400">Loading AI Social Platform...</p>
      </div>
    </div>
  )
})

export default function HomePage() {
  return <AISocialFeed />
}