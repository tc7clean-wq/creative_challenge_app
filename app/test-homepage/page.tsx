'use client'

import { useRouter } from 'next/navigation'

export default function TestHomepage() {
  const router = useRouter()

  const handleGetStarted = () => {
    console.log('Get Started clicked!')
    router.push('/auth')
  }

  const handleExploreGallery = () => {
    console.log('Explore Gallery clicked!')
    router.push('/gallery')
  }

  const handleJoinCompetitions = () => {
    console.log('Join Competitions clicked!')
    router.push('/competitions')
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-6xl font-bold mb-8 text-center">SHOWCASE YOUR AI ART</h1>
      
      <p className="text-xl text-center mb-12 max-w-4xl mx-auto">
        The ultimate platform for AI artists to showcase, compete, and win amazing rewards
      </p>

      <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
        <button
          onClick={handleGetStarted}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl text-white font-bold text-lg hover:scale-105 transition-all duration-300"
        >
          🎨 SHOWCASE YOUR ART
        </button>
        
        <button
          onClick={handleJoinCompetitions}
          className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl text-white font-bold text-lg hover:scale-105 transition-all duration-300"
        >
          🏆 JOIN COMPETITIONS
        </button>
        
        <button
          onClick={handleExploreGallery}
          className="px-8 py-4 bg-transparent border-2 border-cyan-400/50 rounded-2xl text-cyan-400 font-bold text-lg hover:scale-105 hover:bg-cyan-400/10 transition-all duration-300"
        >
          ✨ DISCOVER ART
        </button>
      </div>

      <div className="text-center">
        <p className="text-lg mb-4">Test the buttons above - they should work!</p>
        <p className="text-sm text-gray-400">Check the browser console for click logs</p>
      </div>
    </div>
  )
}
