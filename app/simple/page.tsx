import Image from 'next/image'

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/creative-challenge-logo.png"
              alt="Creative Challenge Logo"
              width={120}
              height={120}
              className="mx-auto mb-6"
              priority
            />
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Creative
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Showcase
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl leading-relaxed">
            The premier platform for AI artists to showcase their work, connect with a global community, and gain recognition for their creative achievements.
            <span className="text-cyan-400"> Join thousands of artists</span> who are already building their creative legacy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 mb-16 justify-center">
            <a
              href="/auth-simple"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Your Journey
            </a>

            <a
              href="/gallery"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              Browse Gallery
            </a>

            <a
              href="/competitions"
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              View Competitions
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
              <div className="text-3xl font-bold text-cyan-400 mb-2">1,247</div>
              <div className="text-gray-300 font-medium">Registered Artists</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
              <div className="text-3xl font-bold text-purple-400 mb-2">8,934</div>
              <div className="text-gray-300 font-medium">Artworks Showcased</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
              <div className="text-3xl font-bold text-pink-400 mb-2">45,678</div>
              <div className="text-gray-300 font-medium">Community Votes</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
              <div className="text-3xl font-bold text-cyan-400 mb-2">3</div>
              <div className="text-gray-300 font-medium">Active Competitions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
