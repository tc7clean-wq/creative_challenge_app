'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="min-h-screen ai-art-bg flex flex-col items-center justify-center relative overflow-hidden">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-6xl mx-auto px-4 z-10"
      >
        {/* Main Title */}
        <motion.h1 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-8xl lg:text-9xl font-black mb-6 tracking-tight"
          style={{ fontFamily: 'var(--font-header)' }}
        >
          <span className="ai-text">AI</span>{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            ArtVerse
          </span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-2xl lg:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto"
        >
          Where artificial intelligence meets creative expression. Compete in AI art challenges, 
          showcase your digital masterpieces, and join the future of art.
        </motion.p>

        {/* Feature Tags */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {['AI-Generated Art', 'Global Competitions', 'Community Voting', 'Prizes & Recognition'].map((tag) => (
            <span 
              key={tag}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 
                         border border-cyan-400/30 rounded-full text-sm font-medium text-cyan-200"
            >
              {tag}
            </span>
          ))}
        </motion.div>
        
        {/* Main Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
        >
          <Link 
            href="/auth" 
            className="ai-btn text-lg px-10 py-4 font-semibold tracking-wide"
          >
            🚀 Start Creating
          </Link>
          <Link 
            href="/gallery" 
            className="ai-btn-secondary text-lg px-10 py-4 font-semibold tracking-wide"
          >
            🎨 Explore Gallery
          </Link>
          <Link 
            href="/contests" 
            className="ai-btn-secondary text-lg px-10 py-4 font-semibold tracking-wide"
          >
            🏆 View Contests
          </Link>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="w-full max-w-7xl mx-auto px-4 pb-20"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: '🤖',
              title: 'AI-Powered Creation',
              description: 'Generate stunning artwork using cutting-edge AI models like DALL-E, Midjourney, and Stable Diffusion'
            },
            {
              icon: '🏁',
              title: 'Themed Contests',
              description: 'Participate in weekly themed competitions and showcase your creativity to a global audience'
            },
            {
              icon: '👥',
              title: 'Community Driven',
              description: 'Vote on submissions, provide feedback, and connect with fellow AI artists from around the world'
            },
            {
              icon: '💎',
              title: 'Earn Rewards',
              description: 'Win prizes, gain recognition, and build your reputation as an AI art creator'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
              className="ai-card group cursor-pointer h-full"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="w-full border-t border-gray-800 py-16"
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10K+', label: 'AI Artworks' },
              { number: '2.5K+', label: 'Artists' },
              { number: '150+', label: 'Contests' },
              { number: '$25K+', label: 'Prizes Awarded' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2 + index * 0.1, duration: 0.5 }}
                className="ai-pulse"
              >
                <div className="text-3xl font-black text-cyan-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}