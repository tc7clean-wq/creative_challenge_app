import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SocialShare from '@/components/sharing/SocialShare'
import AIArtTutorial from '@/components/tutorial/AIArtTutorial'

export default async function Home() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect authenticated users to the simplified homepage
  if (user) {
    redirect('/authenticated-home-simple')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent font-serif tracking-wide">
            🎨 Creative Art Gallery
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Share your AI-generated artwork, get community feedback, and discover amazing creations from artists worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/login" 
              className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 border border-purple-400/30 shadow-lg shadow-purple-500/25"
            >
              🎨 Start Creating
            </a>
            <a 
              href="/signup" 
              className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 border border-indigo-400/30 shadow-lg shadow-indigo-500/25"
            >
              ✨ Sign Up
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-white mb-3">AI Art Creation</h3>
            <p className="text-white/70">
              Use any AI art generator to create stunning artwork. DALL-E, Midjourney, Stable Diffusion - all welcome!
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-white mb-3">Win Prizes</h3>
            <p className="text-white/70">
              Compete in themed contests and win real money prizes. Fast payouts via Chime, PayPal, or Stripe!
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-white mb-3">Community</h3>
            <p className="text-white/70">
              Join a vibrant community of AI artists, get feedback, and grow your creative skills together.
            </p>
          </div>
        </div>

        {/* Tutorial Section */}
        <div className="mb-16">
          <AIArtTutorial />
        </div>

        {/* Social Sharing Section */}
        <div className="mb-16">
          <SocialShare />
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Showcase Your AI Art?
          </h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Join thousands of artists who are already creating, competing, and winning on our platform!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              🎨 Start Creating Now
            </a>
            <a 
              href="/login" 
              className="bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
            >
              🔑 Sign In
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}