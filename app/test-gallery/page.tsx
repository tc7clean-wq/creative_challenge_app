'use client'

import { useState, useEffect } from 'react'

export default function TestGallery() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading quantum gallery...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-white mb-8">Test Gallery</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-xl">
              <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
              <h3 className="text-white text-xl font-semibold mb-2">Artwork {i}</h3>
              <p className="text-gray-300">Test description for artwork {i}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
