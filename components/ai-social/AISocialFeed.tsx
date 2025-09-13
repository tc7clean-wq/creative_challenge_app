'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AIFeedPost from './AIFeedPost'
import AICreatePost from './AICreatePost'
import AITrendingSidebar from './AITrendingSidebar'
import AIStories from './AIStories'
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
  const [posts, setPosts] = useState(mockPosts)
  const [activeTab, setActiveTab] = useState('for-you')
  const [isCreating, setIsCreating] = useState(false)

  const tabs = [
    { id: 'for-you', label: 'For You', icon: <BsStars /> },
    { id: 'trending', label: 'Trending', icon: <FiTrendingUp /> },
    { id: 'following', label: 'Following', icon: <FiUser /> },
    { id: 'ai-only', label: 'AI Only', icon: <BsRobot /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Navigation Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900/80 backdrop-blur-xl 
                    border-r border-cyan-500/20 p-6 z-40">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 
                        rounded-xl flex items-center justify-center">
            <BsLightning className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 
                       bg-clip-text text-transparent">AI Social</h1>
        </div>

        <nav className="space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 
                         bg-gradient-to-r from-cyan-500/20 to-purple-500/20 
                         rounded-xl border border-cyan-500/30 text-white">
            <FiHome className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 
                         hover:bg-white/5 rounded-xl text-gray-400 transition-colors">
            <FiCompass className="w-5 h-5" />
            <span>Explore</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 
                         hover:bg-white/5 rounded-xl text-gray-400 transition-colors">
            <FiBell className="w-5 h-5" />
            <span>Notifications</span>
            <span className="ml-auto bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 
                         hover:bg-white/5 rounded-xl text-gray-400 transition-colors">
            <FiUser className="w-5 h-5" />
            <span>Profile</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 
                         hover:bg-white/5 rounded-xl text-gray-400 transition-colors">
            <FiSettings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreating(true)}
          className="w-full mt-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 
                   text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Create with AI
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="ml-64 mr-80">
        <div className="max-w-2xl mx-auto pt-6">
          {/* Stories */}
          <AIStories />

          {/* Tabs */}
          <div className="flex items-center space-x-1 mb-6 bg-gray-900/50 backdrop-blur-xl 
                        rounded-xl p-1 border border-cyan-500/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 
                         rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Create Post Area */}
          {isCreating && (
            <AICreatePost onClose={() => setIsCreating(false)} />
          )}

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
      <div className="fixed right-0 top-0 h-full w-80 bg-gray-900/80 backdrop-blur-xl 
                    border-l border-cyan-500/20 p-6 overflow-y-auto">
        <AITrendingSidebar />
      </div>
    </div>
  )
}