'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/auth')
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Futuristic Background */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid-pattern"></div>
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-500/20 rounded-full blur-xl animate-float-slow"></div>
        
        {/* Neon Lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          {/* Logo with Glow Effect */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 blur-3xl rounded-full"></div>
            <Image 
              src="/creative-challenge-logo.png" 
              alt="Creative Challenge Logo" 
              width={140} 
              height={140}
              className="relative mx-auto rounded-2xl shadow-2xl border border-cyan-400/30"
              priority
            />
          </div>

          {/* Main Heading with Neon Effect */}
          <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-wider transform hover:scale-105 transition-all duration-500" 
              style={{
                fontFamily: 'var(--font-bebas-neue), "Arial Black", "Impact", sans-serif',
                textTransform: 'uppercase',
                fontWeight: 900,
                fontStyle: 'normal',
                filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.5))',
                letterSpacing: '0.15em',
                background: 'linear-gradient(45deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'neonPulse 3s ease-in-out infinite, gradientShift 4s ease-in-out infinite'
              }}>
            SHOWCASE
            <br />
            YOUR AI ART
          </h1>

          {/* Subtitle with Gradient */}
          <p className="text-2xl md:text-3xl text-white/90 mb-12 max-w-4xl leading-relaxed font-light">
            The ultimate platform for <span className="text-cyan-400 font-semibold">AI artists</span> to 
            <span className="text-purple-400 font-semibold"> showcase, compete, and win</span> amazing rewards
          </p>

          {/* CTA Buttons with Modern Design */}
          <div className="flex flex-col sm:flex-row gap-6 mb-16">
            <button
              onClick={handleGetStarted}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl text-white font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-3">
                <span className="text-2xl">🎨</span>
                SHOWCASE YOUR ART
              </span>
            </button>
            <Link
              href="/competitions"
              className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl text-white font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                JOIN COMPETITIONS
              </span>
            </Link>
            <Link
              href="/gallery"
              className="group relative px-8 py-4 bg-transparent border-2 border-cyan-400/50 rounded-2xl text-cyan-400 font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-cyan-400/10"
            >
              <span className="relative flex items-center gap-3">
                <span className="text-2xl">✨</span>
                DISCOVER ART
              </span>
            </Link>
          </div>

          {/* Stats with Neon Effects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="group relative bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl p-8 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent mb-3">500+</div>
                <div className="text-white/80 text-lg font-medium">AI Artists</div>
              </div>
            </div>
            <div className="group relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent mb-3">2K+</div>
                <div className="text-white/80 text-lg font-medium">Artworks Shared</div>
              </div>
            </div>
            <div className="group relative bg-gradient-to-br from-pink-500/10 to-cyan-500/10 backdrop-blur-xl rounded-3xl p-8 border border-pink-400/30 hover:border-pink-400/60 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-cyan-300 bg-clip-text text-transparent mb-3">10K+</div>
                <div className="text-white/80 text-lg font-medium">Views Daily</div>
              </div>
            </div>
          </div>

          {/* Current Competition Banner */}
          <div className="mb-20">
            <div className="relative bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-2xl rounded-3xl p-8 border border-yellow-400/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-3xl"></div>
              <div className="relative text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-4xl font-bold text-white mb-4">Weekly AI Art Challenge</h2>
                <p className="text-xl text-white/90 mb-6">Theme: &quot;Cyberpunk Dreams&quot; - Win exclusive badges & features!</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <span className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold">
                    🎯 3 Days Left
                  </span>
                  <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
                    👥 47 Submissions
                  </span>
                  <span className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-semibold">
                    🏅 Free to Enter
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Features with Glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 max-w-6xl">
            <div className="group relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-5xl mb-6">🎨</div>
                <h3 className="text-2xl font-bold text-white mb-4">Showcase Art</h3>
                <p className="text-white/70 text-lg leading-relaxed">Upload and display your AI-generated masterpieces in a stunning gallery</p>
              </div>
            </div>
            
            <div className="group relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-5xl mb-6">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-4">Win Rewards</h3>
                <p className="text-white/70 text-lg leading-relaxed">Compete in free challenges and win exclusive badges & platform features</p>
              </div>
            </div>
            
            <div className="group relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-pink-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-5xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-4">Discover</h3>
                <p className="text-white/70 text-lg leading-relaxed">Explore amazing AI art from talented creators worldwide</p>
              </div>
            </div>
          </div>

          {/* Final CTA with Neon Effect */}
          <div className="text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full"></div>
            <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl p-12 border border-white/10">
              <h2 className="text-5xl font-bold text-white mb-6">Ready to Showcase?</h2>
              <p className="text-2xl text-white/80 mb-10">Join the AI art community and share your creations</p>
              <button
                onClick={handleGetStarted}
                className="group relative px-12 py-6 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 rounded-2xl text-white font-bold text-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-4">
                  <span className="text-3xl">🎨</span>
                  START SHOWCASING
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}