'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen cyber-bg flex flex-col items-center justify-center">
      {/* Main Content */}
      <div className="text-center max-w-4xl mx-auto px-4">
        {/* Logo/Title */}
        <h1 className="text-7xl font-bold cyber-text glitch mb-8" data-text="CREATIVE CHALLENGE">
          CREATIVE CHALLENGE
        </h1>
        
        {/* Subtitle */}
        <p className="text-2xl text-cyan-300 mb-12" style={{ fontFamily: 'var(--font-header)' }}>
          Submit Art • Vote • Win Prizes
        </p>
        
        {/* Main Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Link 
            href="/auth" 
            className="cyber-btn text-2xl px-12 py-6 transform hover:scale-105 transition-all duration-300"
          >
            🎨 SIGN UP / LOGIN
          </Link>
          <Link 
            href="/gallery" 
            className="cyber-card text-2xl px-12 py-6 inline-block hover:bg-white/20 transition-all"
          >
            👀 VIEW GALLERY
          </Link>
        </div>
        
        {/* Quick Info */}
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="cyber-card p-6">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-bold cyber-text mb-2">Submit Art</h3>
            <p className="text-white/80 text-sm">Upload your digital artwork and enter contests</p>
          </div>
          
          <div className="cyber-card p-6">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-lg font-bold cyber-text mb-2">Win Contests</h3>
            <p className="text-white/80 text-sm">Vote on submissions and win prizes</p>
          </div>
          
          <div className="cyber-card p-6">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-bold cyber-text mb-2">Earn Money</h3>
            <p className="text-white/80 text-sm">Contest wins = entries into money draw</p>
          </div>
        </div>
      </div>
      
      {/* Simple Footer */}
      <div className="mt-16 text-center">
        <p className="text-white/60 text-sm">
          Ready to start? Click &quot;SIGN UP / LOGIN&quot; above!
        </p>
      </div>
    </div>
  )
}