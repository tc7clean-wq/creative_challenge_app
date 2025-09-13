'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus } from 'react-icons/fi'
import { BsRobot } from 'react-icons/bs'

const stories = [
  {
    id: 'create',
    username: 'Create',
    avatar: null,
    isCreate: true,
    hasStory: false
  },
  {
    id: '1',
    username: 'DALL-E',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dalle',
    isAI: true,
    hasStory: true,
    isViewed: false
  },
  {
    id: '2',
    username: 'MidJourney',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=midjourney',
    isAI: true,
    hasStory: true,
    isViewed: false
  },
  {
    id: '3',
    username: 'GPT-4',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gpt4',
    isAI: true,
    hasStory: true,
    isViewed: true
  },
  {
    id: '4',
    username: 'human_art',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=human1',
    isAI: false,
    hasStory: true,
    isViewed: false
  },
  {
    id: '5',
    username: 'StableDiff',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=stable',
    isAI: true,
    hasStory: true,
    isViewed: true
  }
]

export default function AIStories() {
  const [selectedStory, setSelectedStory] = useState<string | null>(null)

  return (
    <div className="mb-6">
      <div className="glass-card-intense rounded-3xl p-6 neural-glow relative overflow-hidden
                    before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-500/5
                    before:via-purple-500/10 before:to-pink-500/5 before:pointer-events-none">
        <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
          {stories.map((story) => (
            <motion.button
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: parseInt(story.id) * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedStory(story.id)}
              className="flex-shrink-0 flex flex-col items-center space-y-3 group"
            >
              <div className="relative">
                {story.isCreate ? (
                  <div className="w-20 h-20 glass-card-intense neural-glow rounded-2xl
                                flex items-center justify-center morph-button relative overflow-hidden
                                group-hover:shadow-2xl group-hover:shadow-cyan-500/30">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <FiPlus className="w-8 h-8 text-cyan-300" />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20
                                  rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <>
                    <div className={`w-20 h-20 rounded-2xl p-[3px] glass-card neural-glow
                                    border-2 transition-all duration-300 group-hover:scale-110 ${
                      story.hasStory && !story.isViewed
                        ? 'border-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 neural-glow'
                        : story.hasStory && story.isViewed
                        ? 'border-gray-600'
                        : 'border-gray-700'
                    }`}>
                      <div className="w-full h-full rounded-2xl overflow-hidden glass-card">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={story.avatar!}
                          alt={story.username}
                          className="w-full h-full object-cover transition-transform duration-500
                                   group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>
                    </div>
                    {story.isAI && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-2 -right-2 w-8 h-8 glass-card-intense neural-glow
                                  rounded-xl flex items-center justify-center border-2 border-cyan-400/30"
                      >
                        <BsRobot className="w-4 h-4 text-cyan-300" />
                      </motion.div>
                    )}
                  </>
                )}
              </div>
              <span className="text-sm text-neural font-medium truncate max-w-[80px]
                           group-hover:scale-110 transition-transform duration-300">
                {story.username}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal (placeholder) */}
      {selectedStory && selectedStory !== 'create' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setSelectedStory(null)}
        >
          <div className="max-w-md w-full h-[80vh] bg-gradient-to-br from-cyan-900/20 to-purple-900/20 
                        rounded-2xl p-4 relative">
            <div className="absolute top-4 left-4 right-4 flex items-center space-x-2">
              <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-600"
                />
              </div>
            </div>
            <div className="h-full flex items-center justify-center">
              <p className="text-white text-center">AI Story Content</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}