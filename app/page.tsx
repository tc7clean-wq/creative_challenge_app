'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {

  const handleGetStarted = () => {
    // Require login first before submitting artwork
    window.location.href = '/auth'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* REAL Paint Drip Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Paint drip 1 - Pink */}
        <div className="absolute top-0 left-20 w-8 h-96 bg-gradient-to-b from-pink-500 to-pink-300 opacity-90 animate-drip" 
             style={{ 
               clipPath: 'polygon(0 0, 100% 0, 90% 20%, 95% 40%, 85% 60%, 90% 80%, 80% 100%, 20% 100%, 10% 80%, 15% 60%, 5% 40%, 10% 20%)',
               transform: 'rotate(2deg)'
             }}></div>
        
        {/* Paint drip 2 - Cyan */}
        <div className="absolute top-0 right-32 w-6 h-80 bg-gradient-to-b from-cyan-500 to-cyan-300 opacity-85 animate-drip" 
             style={{ 
               clipPath: 'polygon(0 0, 100% 0, 95% 25%, 85% 50%, 90% 75%, 80% 100%, 20% 100%, 15% 75%, 10% 50%, 5% 25%)',
               transform: 'rotate(-3deg)'
             }}></div>
        
        {/* Paint drip 3 - Yellow */}
        <div className="absolute top-0 left-1/3 w-10 h-88 bg-gradient-to-b from-yellow-500 to-yellow-300 opacity-80 animate-drip" 
             style={{ 
               clipPath: 'polygon(0 0, 100% 0, 90% 15%, 95% 35%, 85% 55%, 90% 75%, 85% 100%, 15% 100%, 10% 75%, 15% 55%, 5% 35%, 10% 15%)',
               transform: 'rotate(1deg)'
             }}></div>
        
        {/* Paint drip 4 - Orange */}
        <div className="absolute top-0 right-1/4 w-7 h-72 bg-gradient-to-b from-orange-500 to-orange-300 opacity-90 animate-drip" 
             style={{ 
               clipPath: 'polygon(0 0, 100% 0, 95% 20%, 85% 45%, 90% 70%, 80% 100%, 20% 100%, 15% 70%, 10% 45%, 5% 20%)',
               transform: 'rotate(-2deg)'
             }}></div>
        
        {/* Paint drip 5 - Red */}
        <div className="absolute top-0 left-1/2 w-5 h-76 bg-gradient-to-b from-red-500 to-red-300 opacity-85 animate-drip" 
             style={{ 
               clipPath: 'polygon(0 0, 100% 0, 90% 30%, 95% 60%, 85% 100%, 15% 100%, 5% 60%, 10% 30%)',
               transform: 'rotate(4deg)'
             }}></div>
        
        {/* Paint drip 6 - Green */}
        <div className="absolute top-0 right-1/5 w-9 h-84 bg-gradient-to-b from-green-500 to-green-300 opacity-80 animate-drip" 
             style={{ 
               clipPath: 'polygon(0 0, 100% 0, 90% 10%, 95% 30%, 85% 50%, 90% 70%, 85% 100%, 15% 100%, 10% 70%, 15% 50%, 5% 30%, 10% 10%)',
               transform: 'rotate(-1deg)'
             }}></div>
        
        {/* Paint drip 7 - Purple */}
        <div className="absolute top-0 left-1/6 w-6 h-68 bg-gradient-to-b from-purple-500 to-purple-300 opacity-90 animate-drip" 
             style={{ 
               clipPath: 'polygon(0 0, 100% 0, 95% 25%, 85% 50%, 90% 75%, 80% 100%, 20% 100%, 15% 75%, 10% 50%, 5% 25%)',
               transform: 'rotate(3deg)'
             }}></div>
        
        {/* Paint drip 8 - Blue */}
        <div className="absolute top-0 right-1/6 w-8 h-92 bg-gradient-to-b from-blue-500 to-blue-300 opacity-85 animate-drip" 
             style={{ 
               clipPath: 'polygon(0 0, 100% 0, 90% 20%, 95% 40%, 85% 60%, 90% 80%, 80% 100%, 20% 100%, 10% 80%, 15% 60%, 5% 40%, 10% 20%)',
               transform: 'rotate(-2deg)'
             }}></div>
        
        {/* Paint splatters */}
        <div className="absolute top-1/4 left-1/6 w-12 h-12 bg-pink-400 rounded-full opacity-70 animate-pulse" style={{ transform: 'rotate(45deg)' }}></div>
        <div className="absolute top-1/3 right-1/5 w-10 h-10 bg-cyan-400 rounded-full opacity-75 animate-pulse" style={{ transform: 'rotate(-30deg)' }}></div>
        <div className="absolute bottom-1/3 left-1/5 w-14 h-14 bg-yellow-400 rounded-full opacity-65 animate-pulse" style={{ transform: 'rotate(60deg)' }}></div>
        <div className="absolute bottom-1/4 right-1/6 w-11 h-11 bg-orange-400 rounded-full opacity-80 animate-pulse" style={{ transform: 'rotate(-45deg)' }}></div>
        
        {/* Additional paint drips for more coverage */}
        <div className="absolute top-0 left-2/3 w-4 h-64 bg-gradient-to-b from-red-400 to-red-200 opacity-80 animate-drip" 
             style={{ 
               clipPath: 'polygon(0 0, 100% 0, 90% 40%, 85% 100%, 15% 100%, 10% 40%)',
               transform: 'rotate(-4deg)'
             }}></div>
        <div className="absolute top-0 right-2/3 w-7 h-80 bg-gradient-to-b from-green-400 to-green-200 opacity-75 animate-drip" 
             style={{ 
               clipPath: 'polygon(0 0, 100% 0, 95% 15%, 85% 35%, 90% 55%, 85% 100%, 15% 100%, 10% 55%, 15% 35%, 5% 15%)',
               transform: 'rotate(2deg)'
             }}></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image 
            src="/creative-challenge-logo.png" 
            alt="Creative Challenge Logo" 
            width={120} 
            height={120}
            className="mx-auto rounded-lg shadow-2xl"
            priority
          />
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 transform hover:scale-105 transition-all duration-300" 
            style={{
              fontFamily: 'var(--font-bebas-neue), "Arial Black", "Impact", sans-serif',
              background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF8C00, #FFD700, #FFA500)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'goldenShimmer 2s ease-in-out infinite',
              textShadow: '4px 4px 0px #8B4513, 8px 8px 0px #654321, 12px 12px 0px #2F1B14',
              filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.7))',
              position: 'relative',
              fontWeight: '900',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontStyle: 'normal'
            }}>
          LET&apos;S SPARK
          <br />
          CREATIVITY
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl leading-relaxed">
          Showcase your AI-generated artwork, compete for prizes, and discover amazing creations from artists worldwide.
        </p>

        {/* Social Proof Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-yellow-400 mb-2">500+</div>
            <div className="text-white/80">Artists</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-yellow-400 mb-2">2,000+</div>
            <div className="text-white/80">Artworks</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-yellow-400 mb-2">$50K+</div>
            <div className="text-white/80">Prize Pool</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-xl text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            🎨 Showcase Your Art
          </button>
          <Link
            href="/gallery"
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl text-lg border border-white/30 transform hover:scale-105 transition-all duration-300"
          >
            ✨ View Gallery
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-white mb-3">AI Art Creation</h3>
            <p className="text-white/70">Use any AI art generator to create stunning artwork. DALL-E, Midjourney, Stable Diffusion - all welcome!</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-white mb-3">Win Prizes</h3>
            <p className="text-white/70">Compete in themed contests and win real money prizes. Fast payouts via Stripe!</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-white mb-3">Community</h3>
            <p className="text-white/70">Join a vibrant community of AI artists, get feedback, and grow your creative skills together.</p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Showcase Your AI Art?</h2>
          <p className="text-xl text-white/80 mb-8">Join thousands of artists who are already showcasing, competing, and winning on our platform!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-xl text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              🎨 Showcase Your Art Now
            </button>
            <Link
              href="/auth"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl text-lg border border-white/30 transform hover:scale-105 transition-all duration-300"
            >
              🔑 Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}