export default function MinimalPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-white mb-8">
          Creative Showcase
        </h1>
        
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          The premier platform for AI artists to showcase their work, connect with a global community, and gain recognition for their creative achievements.
        </p>
        
        <div className="space-y-4">
          <a
            href="/auth-simple"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Your Journey
          </a>
          
          <div className="mt-4">
            <a
              href="/gallery"
              className="inline-block px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 mr-4"
            >
              Browse Gallery
            </a>
            
            <a
              href="/competitions"
              className="inline-block px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              View Competitions
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
