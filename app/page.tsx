'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Neural Network Background */}
      <svg className="neural-network">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <line className="neural-line" x1="0" y1="20%" x2="100%" y2="80%" filter="url(#glow)" style={{animationDelay: '0s'}}/>
        <line className="neural-line" x1="100%" y1="10%" x2="0%" y2="70%" filter="url(#glow)" style={{animationDelay: '1s'}}/>
        <line className="neural-line" x1="20%" y1="0" x2="80%" y2="100%" filter="url(#glow)" style={{animationDelay: '2s'}}/>
        <line className="neural-line" x1="60%" y1="0" x2="40%" y2="100%" filter="url(#glow)" style={{animationDelay: '0.5s'}}/>
      </svg>

      {/* Particle System */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 holographic-bg">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob morphing-shape"></div>
          <div className="absolute top-1/3 -right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 morphing-shape"></div>
          <div className="absolute -bottom-1/4 left-1/3 w-[600px] h-[600px] bg-pink-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 morphing-shape"></div>
        </div>
      </div>

      {/* Quantum Grid Overlay */}
      <div className="fixed inset-0 quantum-grid opacity-30"></div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative text-center max-w-7xl mx-auto px-4 pt-32 pb-20 z-10"
      >
        {/* Enhanced Floating badge with data stream */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 backdrop-blur-sm mb-8 neon-glow data-stream"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-sm font-medium text-gray-300">Neural Network Active</span>
        </motion.div>

        {/* Main Title with better animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
        >
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter">
            <span className="block bg-gradient-to-br from-white via-white to-gray-300 bg-clip-text text-transparent pb-2 neon-text">
              AI ArtVerse
            </span>
            <span className="block text-3xl md:text-4xl lg:text-5xl font-light bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mt-2 data-stream">
              Create. Compete. Conquer.
            </span>
          </h1>
        </motion.div>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-xl lg:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Join the revolution where artificial intelligence transforms imagination into stunning visual art. 
          Compete globally, showcase masterpieces, and win amazing prizes.
        </motion.p>

        {/* Feature Tags */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {[
            { icon: '✨', text: 'AI-Powered' },
            { icon: '🌍', text: 'Global Community' },
            { icon: '🏆', text: 'Weekly Prizes' },
            { icon: '🎨', text: 'All Skill Levels' }
          ].map((tag, index) => (
            <motion.span 
              key={tag.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm 
                         border border-white/10 rounded-full text-sm font-medium text-gray-300 
                         hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
            >
              <span className="text-lg">{tag.icon}</span>
              {tag.text}
            </motion.span>
          ))}
        </motion.div>
        
        {/* Main Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-32"
        >
          <Link 
            href="/auth" 
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 overflow-hidden future-card neon-glow"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
              <span>Start Creating</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          <Link 
            href="/gallery" 
            className="group px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 hover:border-white/20 transform hover:-translate-y-1 transition-all duration-200 future-card"
          >
            <span className="flex items-center justify-center gap-2 text-lg">
              <span>Explore Gallery</span>
              <span className="text-xl">🎨</span>
            </span>
          </Link>
          <Link 
            href="/contests" 
            className="group px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 hover:border-white/20 transform hover:-translate-y-1 transition-all duration-200 future-card"
          >
            <span className="flex items-center justify-center gap-2 text-lg">
              <span>View Contests</span>
              <span className="text-xl">🏆</span>
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="relative w-full max-w-7xl mx-auto px-4 pb-32"
      >
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
        >
          Why Choose AI ArtVerse?
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: '🤖',
              title: 'AI-Powered Creation',
              description: 'Generate stunning artwork using cutting-edge AI models like DALL-E, Midjourney, and Stable Diffusion',
              gradient: 'from-purple-500 to-pink-500'
            },
            {
              icon: '🏁',
              title: 'Themed Contests',
              description: 'Participate in weekly themed competitions and showcase your creativity to a global audience',
              gradient: 'from-cyan-500 to-blue-500'
            },
            {
              icon: '👥',
              title: 'Community Driven',
              description: 'Vote on submissions, provide feedback, and connect with fellow AI artists from around the world',
              gradient: 'from-green-500 to-teal-500'
            },
            {
              icon: '💎',
              title: 'Earn Rewards',
              description: 'Win prizes, gain recognition, and build your reputation as an AI art creator',
              gradient: 'from-yellow-500 to-orange-500'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative"
            >
              <div className="relative h-full p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden future-card">
                {/* Gradient accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Icon with animated background */}
                <div className="relative mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-300`}></div>
                  <div className="relative text-5xl transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative w-full py-24 overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20"></div>
        
        <div className="relative max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
          >
            Join Thousands of AI Artists
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'AI Artworks', icon: '🎨' },
              { number: '2.5K+', label: 'Active Artists', icon: '👨‍🎨' },
              { number: '150+', label: 'Contests Held', icon: '🏆' },
              { number: '$25K+', label: 'Prizes Awarded', icon: '💰' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div className="relative inline-block mb-4">
                  <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-5xl font-black bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                </div>
                <div className="text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative w-full py-24"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="relative p-12 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-cyan-900/20 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden"
          >
            {/* Animated border gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-20 blur-xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to Create Your Masterpiece?
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join our community today and start creating AI-powered art that captivates the world.
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <span>Get Started Free</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}