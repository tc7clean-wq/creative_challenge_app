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
      {/* DRAMATIC Spray Paint Drip Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large DRAMATIC paint drips */}
        <div className="absolute top-10 left-5 w-52 h-80 bg-gradient-to-b from-pink-400 via-pink-300 to-pink-200 opacity-90 transform rotate-12 animate-drip" 
             style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)' }}></div>
        <div className="absolute top-20 right-10 w-44 h-68 bg-gradient-to-b from-cyan-400 via-cyan-300 to-cyan-200 opacity-85 transform -rotate-8 animate-drip" 
             style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)' }}></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-64 bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-200 opacity-80 transform rotate-5 animate-drip" 
             style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}></div>
        <div className="absolute bottom-10 right-1/3 w-40 h-56 bg-gradient-to-b from-orange-400 via-orange-300 to-orange-200 opacity-90 transform -rotate-15 animate-drip" 
             style={{ clipPath: 'polygon(0 0, 100% 0, 75% 100%, 25% 100%)' }}></div>
        
        {/* Medium DRAMATIC drips */}
        <div className="absolute top-32 left-1/3 w-36 h-48 bg-gradient-to-b from-red-400 via-red-300 to-red-200 opacity-85 transform rotate-20 animate-drip" 
             style={{ clipPath: 'polygon(0 0, 100% 0, 70% 100%, 30% 100%)' }}></div>
        <div className="absolute top-60 right-1/4 w-32 h-42 bg-gradient-to-b from-green-400 via-green-300 to-green-200 opacity-80 transform -rotate-10 animate-drip" 
             style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)' }}></div>
        
        {/* Small DRAMATIC drips */}
        <div className="absolute top-80 left-1/2 w-28 h-38 bg-gradient-to-b from-purple-400 via-purple-300 to-purple-200 opacity-90 transform rotate-8 animate-drip" 
             style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}></div>
        <div className="absolute bottom-40 right-1/5 w-30 h-40 bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200 opacity-85 transform -rotate-5 animate-drip" 
             style={{ clipPath: 'polygon(0 0, 100% 0, 75% 100%, 25% 100%)' }}></div>
        
        {/* DRAMATIC Paint splatter effects */}
        <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-pink-400 rounded-full opacity-80 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/5 w-14 h-14 bg-cyan-400 rounded-full opacity-85 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/5 w-20 h-20 bg-yellow-400 rounded-full opacity-75 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-18 h-18 bg-orange-400 rounded-full opacity-90 animate-pulse"></div>
        
        {/* Additional DRAMATIC drips for more impact */}
        <div className="absolute top-1/2 left-1/5 w-24 h-34 bg-gradient-to-b from-red-300 via-red-200 to-red-100 opacity-80 transform rotate-25 animate-drip" 
             style={{ clipPath: 'polygon(0 0, 100% 0, 60% 100%, 40% 100%)' }}></div>
        <div className="absolute bottom-1/2 right-1/4 w-26 h-36 bg-gradient-to-b from-green-300 via-green-200 to-green-100 opacity-85 transform -rotate-20 animate-drip" 
             style={{ clipPath: 'polygon(0 0, 100% 0, 65% 100%, 35% 100%)' }}></div>
        
        {/* Extra dramatic drips */}
        <div className="absolute top-1/6 right-1/6 w-20 h-32 bg-gradient-to-b from-violet-400 via-violet-300 to-violet-200 opacity-90 transform rotate-30 animate-drip" 
             style={{ clipPath: 'polygon(0 0, 100% 0, 55% 100%, 45% 100%)' }}></div>
        <div className="absolute bottom-1/6 left-1/6 w-22 h-34 bg-gradient-to-b from-teal-400 via-teal-300 to-teal-200 opacity-85 transform -rotate-25 animate-drip" 
             style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%, 50% 100%)' }}></div>
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