'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiHeart, FiMessageCircle, FiShare2, FiBookmark, 
  FiMoreHorizontal, FiZap, FiCpu, FiTrendingUp,
  FiRefreshCw, FiSend, FiImage, FiMusic, FiVideo
} from 'react-icons/fi'
import { BsStars, BsRobot } from 'react-icons/bs'

interface AIFeedPostProps {
  post: {
    id: string
    author: {
      name: string
      username: string
      avatar: string
      isAI?: boolean
      aiModel?: string
    }
    content: {
      text?: string
      image?: string
      video?: string
      audio?: string
      type: 'text' | 'image' | 'video' | 'audio' | 'mixed'
    }
    aiGenerated: boolean
    prompt?: string
    model?: string
    likes: number
    comments: number
    shares: number
    timestamp: string
    tags?: string[]
  }
}

export default function AIFeedPost({ post }: AIFeedPostProps) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [comment, setComment] = useState('')

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRegenerating(false)
  }

  const getContentIcon = () => {
    switch (post.content.type) {
      case 'image': return <FiImage className="w-4 h-4" />
      case 'video': return <FiVideo className="w-4 h-4" />
      case 'audio': return <FiMusic className="w-4 h-4" />
      default: return <BsStars className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-card-intense rounded-3xl overflow-hidden neural-glow
                 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500
                 transform-gpu perspective-1000 relative group"
    >
      {/* Header */}
      <div className="p-6 flex items-start justify-between relative
                    before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[1px]
                    before:bg-gradient-to-r before:from-transparent before:via-cyan-500/30 before:to-transparent">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-[3px] neural-glow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {post.author.isAI && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-1 -right-1 glass-card neural-glow
                          rounded-full p-1.5 border border-cyan-400/50">
                <BsRobot className="w-4 h-4 text-cyan-300" />
              </motion.div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-white">{post.author.name}</h3>
              {post.aiGenerated && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="flex items-center space-x-1 px-3 py-1
                            glass-card neural-glow rounded-full">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                    <FiCpu className="w-3 h-3 text-cyan-400" />
                  </motion.div>
                  <span className="text-xs text-neural font-medium">AI Generated</span>
                </motion.div>
              )}
            </div>
            <p className="text-sm text-gray-400">@{post.author.username} · {post.timestamp}</p>
            {post.model && (
              <p className="text-xs text-purple-400 mt-1 flex items-center space-x-1">
                {getContentIcon()}
                <span>Created with {post.model}</span>
              </p>
            )}
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 glass-card hover:neural-glow rounded-xl transition-all duration-300">
          <FiMoreHorizontal className="w-5 h-5 text-gray-300" />
        </motion.button>
      </div>

      {/* AI Prompt (if shown) */}
      {post.prompt && (
        <div className="mx-4 mb-3 p-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 
                      rounded-lg border border-purple-500/20">
          <p className="text-xs text-purple-300 mb-1 flex items-center space-x-1">
            <FiZap className="w-3 h-3" />
            <span>AI Prompt</span>
          </p>
          <p className="text-sm text-gray-300 italic">&quot;{post.prompt}&quot;</p>
        </div>
      )}

      {/* Content */}
      <div className="relative">
        {post.content.text && (
          <div className="px-4 pb-3">
            <p className="text-gray-100 whitespace-pre-wrap">{post.content.text}</p>
          </div>
        )}
        
        {post.content.image && (
          <div className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.content.image}
              alt="AI generated content"
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent 
                          to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Regenerate button */}
            {post.aiGenerated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRegenerate}
                className="absolute bottom-4 right-4 px-4 py-2 
                         bg-gradient-to-r from-cyan-500 to-purple-600 
                         text-white rounded-lg opacity-0 group-hover:opacity-100 
                         transition-opacity flex items-center space-x-2"
                disabled={isRegenerating}
              >
                <FiRefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span className="text-sm">Regenerate</span>
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gradient-to-r from-cyan-500/10 to-purple-500/10 
                       text-cyan-300 rounded-full border border-cyan-500/20
                       hover:border-cyan-400/40 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gradient-to-r from-transparent via-cyan-500/20 to-transparent
                    bg-gradient-to-r from-gray-900/20 via-gray-800/30 to-gray-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLiked(!liked)}
              className={`p-3 glass-card rounded-xl transition-all duration-300 flex items-center space-x-2
                        ${liked ? 'text-pink-400 neural-glow' : 'text-gray-400 hover:text-pink-400 hover:neural-glow'}`}
            >
              <motion.div
                animate={{ scale: liked ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <FiHeart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </motion.div>
              <span className="text-sm">{post.likes + (liked ? 1 : 0)}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowComments(!showComments)}
              className="p-3 glass-card rounded-xl text-gray-400 hover:text-cyan-400
                       hover:neural-glow transition-all duration-300 flex items-center space-x-2"
            >
              <FiMessageCircle className="w-5 h-5" />
              <span className="text-sm">{post.comments}</span>
            </motion.button>

            <button className="p-2 rounded-lg text-gray-400 hover:text-green-400 
                             transition-colors flex items-center space-x-2">
              <FiShare2 className="w-5 h-5" />
              <span className="text-sm">{post.shares}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg text-gray-400 hover:text-orange-400 transition-colors">
              <FiTrendingUp className="w-5 h-5" />
            </button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSaved(!saved)}
              className={`p-2 rounded-lg transition-colors
                        ${saved ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'}`}
            >
              <FiBookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-700/50 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600" />
                <div className="flex-1 flex items-center space-x-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add an AI-powered comment..."
                    className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 
                             text-sm text-white placeholder-gray-500 focus:outline-none 
                             focus:border-cyan-500/50"
                  />
                  <button className="p-2 bg-gradient-to-r from-cyan-500 to-purple-600 
                                   text-white rounded-lg hover:opacity-90 transition-opacity">
                    <FiSend className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-purple-500/20 text-purple-400 rounded-lg 
                                   hover:bg-purple-500/30 transition-colors">
                    <BsStars className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}