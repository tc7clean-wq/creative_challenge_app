'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { BsRobot, BsPeople, BsLightning } from 'react-icons/bs'
import { FiPlus, FiEdit3, FiUsers, FiZap, FiSend } from 'react-icons/fi'

interface Contributor {
  id: string
  name: string
  avatar: string
  isAI: boolean
  contribution: string
  timestamp: Date
  color: string
}

interface CollaborativePromptProps {
  onClose: () => void
}

const mockContributors: Contributor[] = [
  {
    id: '1',
    name: 'You',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    isAI: false,
    contribution: 'A futuristic cyberpunk cityscape',
    timestamp: new Date(),
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: '2',
    name: 'Neural Assistant',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=neural',
    isAI: true,
    contribution: 'with neon lights reflecting on wet streets',
    timestamp: new Date(Date.now() - 30000),
    color: 'from-purple-500 to-pink-600'
  }
]

export default function CollaborativePrompt({ onClose }: CollaborativePromptProps) {
  const [contributors, setContributors] = useState<Contributor[]>(mockContributors)
  const [newContribution, setNewContribution] = useState('')
  const [isTyping, setIsTyping] = useState<string[]>([])
  const [finalPrompt, setFinalPrompt] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Build the collaborative prompt
  useEffect(() => {
    const prompt = contributors.map(c => c.contribution).join(' ')
    setFinalPrompt(prompt)
  }, [contributors])

  // Simulate AI suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const suggestions = [
          'with atmospheric fog',
          'during golden hour',
          'with flying vehicles',
          'in 8K ultra detail',
          'with dramatic lighting'
        ]

        setIsTyping(['Neural Assistant'])

        setTimeout(() => {
          const newContribution: Contributor = {
            id: Date.now().toString(),
            name: 'Neural Assistant',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=neural',
            isAI: true,
            contribution: suggestions[Math.floor(Math.random() * suggestions.length)],
            timestamp: new Date(),
            color: 'from-emerald-500 to-teal-600'
          }

          setContributors(prev => [...prev, newContribution])
          setIsTyping([])
        }, 2000)
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const addContribution = () => {
    if (!newContribution.trim()) return

    const contribution: Contributor = {
      id: Date.now().toString(),
      name: 'You',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
      isAI: false,
      contribution: newContribution.trim(),
      timestamp: new Date(),
      color: 'from-cyan-500 to-blue-600'
    }

    setContributors(prev => [...prev, contribution])
    setNewContribution('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addContribution()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotateY: 30 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="glass-card-intense rounded-3xl neural-glow w-full max-w-4xl h-[80vh] overflow-hidden
                 shadow-2xl shadow-cyan-500/20 border-2 border-cyan-400/30"
      >
        {/* Header */}
        <div className="p-6 border-b border-gradient-to-r from-transparent via-cyan-500/30 to-transparent
                      bg-gradient-to-r from-gray-900/20 via-gray-800/30 to-gray-900/20
                      flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/10 to-pink-500/5" />

          <div className="flex items-center space-x-4 relative z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 glass-card-intense neural-glow rounded-2xl
                        flex items-center justify-center relative overflow-hidden"
            >
              <BsPeople className="w-6 h-6 text-cyan-300" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-neural tracking-wide">Collaborative Prompting</h2>
              <p className="text-sm text-gray-400">
                {contributors.length} contributors • Building together
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-3 glass-card hover:neural-glow rounded-xl transition-all duration-300 relative z-10"
          >
            <FiPlus className="w-6 h-6 text-gray-300 rotate-45" />
          </motion.button>
        </div>

        <div className="flex h-[calc(80vh-100px)]">
          {/* Left Panel - Contributions */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-neural mb-4">Prompt Building</h3>

            {/* Contribution Timeline */}
            <div className="space-y-4 mb-6">
              <AnimatePresence>
                {contributors.map((contributor, index) => (
                  <motion.div
                    key={contributor.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${contributor.color} p-[2px]`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={contributor.avatar}
                          alt={contributor.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      {contributor.isAI && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-500 to-blue-600
                                     rounded-full flex items-center justify-center">
                          <BsRobot className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-white">{contributor.name}</span>
                        <span className="text-xs text-gray-500">
                          {contributor.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-3 rounded-lg"
                      >
                        <p className="text-sm text-gray-200">{contributor.contribution}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping.map(name => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 p-[2px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=neural"
                        alt={name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="glass-card p-3 rounded-lg">
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            className="w-2 h-2 bg-cyan-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 bg-cyan-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 bg-cyan-400 rounded-full"
                          />
                        </div>
                        <span className="text-xs text-gray-400 ml-2">{name} is typing...</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Add Contribution */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <FiEdit3 className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-white">Add your contribution</span>
              </div>
              <div className="flex items-center space-x-3">
                <textarea
                  ref={textareaRef}
                  value={newContribution}
                  onChange={(e) => setNewContribution(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add details, style, or mood..."
                  className="flex-1 glass-card border border-cyan-500/30 rounded-xl px-4 py-3
                           text-white placeholder-gray-500 resize-none focus:outline-none
                           focus:border-cyan-400/50 focus:neural-glow transition-all duration-300"
                  rows={2}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addContribution}
                  disabled={!newContribution.trim()}
                  className="p-3 morph-button neural-glow rounded-xl disabled:opacity-50"
                >
                  <FiSend className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right Panel - Final Prompt & Preview */}
          <div className="w-1/2 p-6 glass-card border-l border-cyan-500/20">
            <h3 className="text-lg font-semibold text-neural mb-4">Final Prompt</h3>

            <div className="glass-card-intense neural-glow rounded-xl p-4 mb-6">
              <p className="text-white leading-relaxed">{finalPrompt}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 morph-button text-white font-bold rounded-2xl
                       neural-glow text-lg tracking-wide relative overflow-hidden
                       before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent
                       before:via-white/10 before:to-transparent before:translate-x-[-200%]
                       hover:before:translate-x-[200%] before:transition-transform before:duration-700"
            >
              <div className="flex items-center justify-center space-x-3">
                <FiZap className="w-6 h-6" />
                <span>Generate Collaboratively</span>
                <BsLightning className="w-5 h-5" />
              </div>
            </motion.button>

            {/* Live Collaborators */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Live Collaborators</h4>
              <div className="flex -space-x-2">
                {contributors.slice(-5).map((contributor, index) => (
                  <motion.div
                    key={contributor.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${contributor.color} p-[1px] border-2 border-gray-900`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={contributor.avatar}
                      alt={contributor.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </motion.div>
                ))}
                <div className="w-8 h-8 rounded-full glass-card border-2 border-gray-600 flex items-center justify-center">
                  <FiUsers className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}