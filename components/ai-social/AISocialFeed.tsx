'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AIFeedPost from './AIFeedPost'
import AICreatePost from './AICreatePost'
import AITrendingSidebar from './AITrendingSidebar'
import AIStories from './AIStories'
import ParallaxBackground from './ParallaxBackground'
import LivePresence from './LivePresence'
import CollaborativePrompt from './CollaborativePrompt'
import ErrorBoundary from './ErrorBoundary'
import { FiHome, FiTrendingUp, FiCompass, FiUser, FiBell, FiSettings } from 'react-icons/fi'
import { BsStars, BsRobot, BsLightning } from 'react-icons/bs'

const mockPosts = [
  {
    id: '1',
    author: {
      name: 'Neural Artist',
      username: 'neural_artist',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neural',
      isAI: true,
      aiModel: 'DALL-E 3'
    },
    content: {
      text: 'Just created this cyberpunk cityscape using advanced neural synthesis! The neon reflections and atmospheric fog were particularly challenging to get right. What do you think?',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      type: 'mixed' as const
    },
    aiGenerated: true,
    prompt: 'Cyberpunk cityscape with neon lights reflecting on wet streets, atmospheric fog, flying cars',
    model: 'DALL-E 3',
    likes: 1420,
    comments: 89,
    shares: 234,
    timestamp: '2h ago',
    tags: ['cyberpunk', 'aiart', 'neon', 'futuristic']
  },
  {
    id: '2',
    author: {
      name: 'Music Synth AI',
      username: 'synthwave_ai',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=synth',
      isAI: true,
      aiModel: 'MusicGen'
    },
    content: {
      text: 'New synthwave track generated from pure mathematics and emotion algorithms. This one captures the essence of a neon sunset drive. 🎵✨',
      type: 'text' as const
    },
    aiGenerated: true,
    model: 'MusicGen',
    likes: 892,
    comments: 56,
    shares: 123,
    timestamp: '4h ago',
    tags: ['aimusic', 'synthwave', 'generative']
  },
  {
    id: '3',
    author: {
      name: 'Creative Human',
      username: 'human_creator',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=human',
      isAI: false
    },
    content: {
      text: 'Collaborated with GPT-4 to write this sci-fi short story. The AI helped me develop the plot twists and world-building elements. Amazing how AI can enhance human creativity!',
      image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800',
      type: 'mixed' as const
    },
    aiGenerated: false,
    likes: 567,
    comments: 34,
    shares: 89,
    timestamp: '6h ago',
    tags: ['aicollaboration', 'writing', 'scifi']
  }
]

export default function AISocialFeed() {
  const [posts] = useState(mockPosts)
  const [activeTab, setActiveTab] = useState('for-you')
  const [isCreating, setIsCreating] = useState(false)
  const [isCollaborating, setIsCollaborating] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const tabs = [
    { id: 'for-you', label: 'For You', icon: <BsStars /> },
    { id: 'trending', label: 'Trending', icon: <FiTrendingUp /> },
    { id: 'following', label: 'Following', icon: <FiUser /> },
    { id: 'ai-only', label: 'AI Only', icon: <BsRobot /> }
  ]

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 relative overflow-hidden">
        {/* Advanced Parallax Background */}
        <ParallaxBackground />

        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-3 glass-card-intense neural-glow rounded-xl"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`bg-cyan-400 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`} />
              <span className={`bg-cyan-400 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`bg-cyan-400 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`} />
            </div>
          </motion.button>
        </div>

        {/* Navigation Sidebar */}
        <div className={`fixed left-0 top-0 h-full w-64 glass-card-intense p-6 z-40 neural-glow
                       lg:translate-x-0 transition-transform duration-300 ${
                         isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                       }`}>
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 glass-card neural-glow rounded-2xl flex items-center justify-center morph-button">
            <BsLightning className="w-7 h-7 text-cyan-300" />
          </div>
          <h1 className="text-3xl font-bold text-neural tracking-wide">AI Social</h1>
        </div>

        <nav className="space-y-3">
          <button className="w-full flex items-center space-x-3 px-4 py-3
                         glass-card neural-glow rounded-xl text-white morph-button">
            <FiHome className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3
                         glass-card hover:glass-card-intense rounded-xl text-gray-300
                         transition-all duration-300 hover:neural-glow hover:text-white">
            <FiCompass className="w-5 h-5" />
            <span>Explore</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3
                         glass-card hover:glass-card-intense rounded-xl text-gray-300
                         transition-all duration-300 hover:neural-glow hover:text-white">
            <FiBell className="w-5 h-5" />
            <span>Notifications</span>
            <span className="ml-auto bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs px-2 py-0.5 rounded-full neural-glow">3</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3
                         glass-card hover:glass-card-intense rounded-xl text-gray-300
                         transition-all duration-300 hover:neural-glow hover:text-white">
            <FiUser className="w-5 h-5" />
            <span>Profile</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3
                         glass-card hover:glass-card-intense rounded-xl text-gray-300
                         transition-all duration-300 hover:neural-glow hover:text-white">
            <FiSettings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>

        <div className="space-y-3 mt-8">
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreating(true)}
            className="w-full py-4 morph-button text-white font-bold rounded-2xl
                     neural-glow text-lg tracking-wide relative overflow-hidden
                     before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent
                     before:via-white/10 before:to-transparent before:translate-x-[-200%]
                     hover:before:translate-x-[200%] before:transition-transform before:duration-700"
          >
            Create with AI
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollaborating(true)}
            className="w-full py-3 glass-card-intense neural-glow text-cyan-300 font-semibold rounded-xl
                     border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300"
          >
            Collaborate Live
          </motion.button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 lg:mr-80 px-4 lg:px-0">
        <div className="max-w-2xl mx-auto pt-6">
          {/* Stories */}
          <AIStories />

          {/* Tabs */}
          <div className="flex items-center space-x-1 mb-6 glass-card-intense
                        rounded-2xl p-1 neural-glow">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4
                         rounded-xl transition-all duration-500 ${
                  activeTab === tab.id
                    ? 'glass-card-intense text-white neural-glow morph-button'
                    : 'text-gray-400 hover:text-white hover:glass-card hover:neural-glow'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Create Post Area - Removed duplicate */}

          {/* Feed */}
          <div className="space-y-6">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AIFeedPost post={post} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More */}
          <div className="py-8 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 
                       text-cyan-400 rounded-xl border border-cyan-500/30 
                       hover:border-cyan-400/50 transition-all"
            >
              Generate More Content
            </motion.button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block fixed right-0 top-0 h-full w-80 glass-card-intense
                    p-6 overflow-y-auto neural-glow">
        <AITrendingSidebar />
      </div>

      {/* Live Presence System */}
      <LivePresence />

      {/* Collaborative Modals */}
      <AnimatePresence>
        {isCreating && (
          <AICreatePost onClose={() => setIsCreating(false)} />
        )}
        {isCollaborating && (
          <CollaborativePrompt onClose={() => setIsCollaborating(false)} />
        )}
      </AnimatePresence>
      </div>
    </ErrorBoundary>
  )
}