'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { BsStars, BsEye, BsCpu } from 'react-icons/bs'
import { FiUser, FiZap } from 'react-icons/fi'

interface Recommendation {
  id: string
  type: 'user' | 'post' | 'prompt' | 'collaboration'
  title: string
  description: string
  confidence: number
  reason: string
  avatar?: string
  preview?: string
  tags: string[]
}

interface AIRecommendationEngineProps {
  userInterests?: string[]
}

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    type: 'user',
    title: 'Neural Architect',
    description: 'Specializes in cyberpunk cityscapes like your recent likes',
    confidence: 0.95,
    reason: 'Similar aesthetic preferences',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=neural-architect',
    tags: ['cyberpunk', 'architecture', 'ai-art']
  },
  {
    id: '2',
    type: 'post',
    title: 'Neon Dreamscape',
    description: 'AI-generated artwork trending in your network',
    confidence: 0.88,
    reason: 'Your network is engaging heavily',
    preview: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    tags: ['neon', 'digital-art', 'trending']
  },
  {
    id: '3',
    type: 'prompt',
    title: 'Collaborative Space Scene',
    description: 'Join 3 creators building an epic space odyssey',
    confidence: 0.82,
    reason: 'Based on your space-themed interactions',
    tags: ['space', 'collaboration', 'epic']
  },
  {
    id: '4',
    type: 'collaboration',
    title: 'AI Music Video Project',
    description: 'Visual artists needed for AI-generated synthwave album',
    confidence: 0.76,
    reason: 'Matches your music + visual interests',
    tags: ['music', 'synthwave', 'collaborative']
  }
]

export default function AIRecommendationEngine({ userInterests }: AIRecommendationEngineProps) {
  // Use userInterests for future personalization features
  console.log('User interests:', userInterests || ['cyberpunk', 'ai-art', 'collaboration'])
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations)
  const [isLearning, setIsLearning] = useState(false)
  const [selectedRec, setSelectedRec] = useState<string | null>(null)

  // Simulate AI learning process
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLearning(true)

      setTimeout(() => {
        // Update confidence scores and add new recommendations
        setRecommendations(prev => prev.map(rec => ({
          ...rec,
          confidence: Math.min(0.99, rec.confidence + (Math.random() - 0.5) * 0.05)
        })))
        setIsLearning(false)
      }, 2000)
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <FiUser className="w-4 h-4" />
      case 'post': return <BsStars className="w-4 h-4" />
      case 'prompt': return <FiZap className="w-4 h-4" />
      case 'collaboration': return <BsCpu className="w-4 h-4" />
      default: return <BsStars className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user': return 'from-blue-500 to-cyan-500'
      case 'post': return 'from-purple-500 to-pink-500'
      case 'prompt': return 'from-yellow-500 to-orange-500'
      case 'collaboration': return 'from-green-500 to-emerald-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400'
    if (confidence >= 0.8) return 'text-yellow-400'
    return 'text-orange-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-intense rounded-3xl p-6 neural-glow border border-cyan-400/30
               relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={isLearning ? { rotate: 360 } : {}}
            transition={{ duration: 2, ease: "linear" }}
            className="w-10 h-10 glass-card neural-glow rounded-xl flex items-center justify-center"
          >
            <BsCpu className={`w-5 h-5 ${isLearning ? 'text-yellow-400' : 'text-cyan-400'}`} />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-neural">AI Recommendations</h3>
            <p className="text-xs text-gray-400">
              {isLearning ? 'Learning from your behavior...' : 'Personalized for you'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isLearning ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
          <span className="text-xs text-gray-400">
            {isLearning ? 'Learning' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            onClick={() => setSelectedRec(selectedRec === rec.id ? null : rec.id)}
            className="glass-card hover:glass-card-intense rounded-2xl p-4 cursor-pointer
                     transition-all duration-300 hover:neural-glow group"
          >
            <div className="flex items-start space-x-4">
              {/* Type Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getTypeColor(rec.type)}
                           flex items-center justify-center flex-shrink-0`}>
                {rec.avatar ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rec.avatar}
                      alt={rec.title}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  </>
                ) : (
                  getTypeIcon(rec.type)
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white group-hover:text-neural transition-colors">
                    {rec.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium ${getConfidenceColor(rec.confidence)}`}>
                      {Math.round(rec.confidence * 100)}%
                    </span>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-2 h-2 rounded-full ${getConfidenceColor(rec.confidence).replace('text-', 'bg-')}`}
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-2">{rec.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BsEye className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">{rec.reason}</span>
                  </div>
                  <div className="flex space-x-1">
                    {rec.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs glass-card rounded-full text-cyan-300
                               border border-cyan-500/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Image */}
            {rec.preview && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={selectedRec === rec.id ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rec.preview}
                    alt={rec.title}
                    className="w-full h-32 object-cover"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Learning Indicator */}
      {isLearning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 right-4"
        >
          <div className="flex items-center space-x-2 glass-card px-3 py-2 rounded-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"
            />
            <span className="text-xs text-yellow-400">Learning...</span>
          </div>
        </motion.div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-cyan-500 to-transparent rounded-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-radial from-purple-500 to-transparent rounded-full" />
      </div>
    </motion.div>
  )
}