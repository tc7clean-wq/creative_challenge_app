'use client'

import Link from 'next/link'
import Image from 'next/image'
import SprayPaintMarks from '@/components/ui/SprayPaintMarks'

export default function HomePage() {

  const handleGetStarted = () => {
    // Require login first before submitting artwork
    window.location.href = '/auth'
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <SprayPaintMarks />

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