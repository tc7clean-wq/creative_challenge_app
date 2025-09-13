'use client'

import { motion } from 'framer-motion'
import { FiTrendingUp, FiHash, FiUsers, FiAward, FiZap } from 'react-icons/fi'
import { BsRobot, BsStars, BsLightning } from 'react-icons/bs'

export default function AITrendingSidebar() {
  const trendingTags = [
    { tag: 'AIArt', posts: '42.3K', trend: '+15%' },
    { tag: 'NeuralBeats', posts: '28.1K', trend: '+23%' },
    { tag: 'CyberpunkAI', posts: '19.7K', trend: '+8%' },
    { tag: 'GenerativeDesign', posts: '15.2K', trend: '+42%' },
    { tag: 'AICollaboration', posts: '12.8K', trend: '+18%' }
  ]

  const topCreators = [
    {
      name: 'Neural Nexus',
      username: '@neuralnexus',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=nexus',
      followers: '125K',
      isAI: true,
      specialty: 'Visual Arts'
    },
    {
      name: 'Synth Master',
      username: '@synthmaster',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=synth',
      followers: '98K',
      isAI: true,
      specialty: 'Music'
    },
    {
      name: 'Creative Human',
      username: '@creativehuman',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creative',
      followers: '67K',
      isAI: false,
      specialty: 'Mixed Media'
    }
  ]

  const aiModels = [
    { name: 'DALL-E 3', status: 'online', usage: '89%' },
    { name: 'GPT-4 Vision', status: 'online', usage: '76%' },
    { name: 'MidJourney v6', status: 'busy', usage: '95%' },
    { name: 'Stable Diffusion XL', status: 'online', usage: '62%' }
  ]

  return (
    <div className="space-y-6">
      {/* AI Models Status */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 
                    border border-cyan-500/20">
        <div className="flex items-center space-x-2 mb-4">
          <BsLightning className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-white">AI Models Status</h3>
        </div>
        <div className="space-y-3">
          {aiModels.map((model) => (
            <div key={model.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  model.status === 'online' ? 'bg-green-500' :
                  model.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-300">{model.name}</span>
              </div>
              <span className="text-xs text-gray-500">{model.usage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Tags */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 
                    border border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FiTrendingUp className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-white">Trending Now</h3>
          </div>
          <button className="text-xs text-cyan-400 hover:text-cyan-300">See all</button>
        </div>
        <div className="space-y-3">
          {trendingTags.map((item, index) => (
            <motion.div
              key={item.tag}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between hover:bg-white/5 p-2 
                       rounded-lg transition-colors cursor-pointer"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <FiHash className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-white">{item.tag}</span>
                </div>
                <span className="text-xs text-gray-500">{item.posts} posts</span>
              </div>
              <span className="text-xs text-green-400">{item.trend}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top AI Creators */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 
                    border border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FiAward className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold text-white">Top Creators</h3>
          </div>
          <button className="text-xs text-cyan-400 hover:text-cyan-300">View all</button>
        </div>
        <div className="space-y-3">
          {topCreators.map((creator) => (
            <div key={creator.username} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {creator.isAI && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r 
                                  from-cyan-500 to-blue-600 rounded-full flex items-center 
                                  justify-center">
                      <BsRobot className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{creator.name}</p>
                  <p className="text-xs text-gray-500">{creator.specialty}</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 
                             text-cyan-400 text-xs rounded-lg border border-cyan-500/30 
                             hover:border-cyan-400/50 transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Challenge */}
      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-4 
                    border border-purple-500/30">
        <div className="flex items-center space-x-2 mb-3">
          <FiZap className="w-5 h-5 text-yellow-400" />
          <h3 className="font-semibold text-white">Daily AI Challenge</h3>
        </div>
        <p className="text-sm text-gray-300 mb-3">
          Create a surreal landscape combining nature and technology
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">Prize Pool</span>
          <span className="text-sm font-bold text-yellow-400">500 Credits</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 
                   text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Join Challenge
        </motion.button>
      </div>
    </div>
  )
}