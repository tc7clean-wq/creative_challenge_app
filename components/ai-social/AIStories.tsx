'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus } from 'react-icons/fi'
import { BsRobot, BsStars } from 'react-icons/bs'

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
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl 
                    rounded-2xl border border-cyan-500/20 p-4">
        <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
          {stories.map((story) => (
            <motion.button
              key={story.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedStory(story.id)}
              className="flex-shrink-0 flex flex-col items-center space-y-2"
            >
              <div className="relative">
                {story.isCreate ? (
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 
                                rounded-full flex items-center justify-center">
                    <FiPlus className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <>
                    <div className={`w-16 h-16 rounded-full p-[2px] ${
                      story.hasStory && !story.isViewed
                        ? 'bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500'
                        : story.hasStory && story.isViewed
                        ? 'bg-gray-700'
                        : 'bg-gray-800'
                    }`}>
                      <div className="w-full h-full rounded-full bg-gray-900 p-[2px]">
                        <img
                          src={story.avatar!}
                          alt={story.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                    {story.isAI && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r 
                                    from-cyan-500 to-blue-600 rounded-full flex items-center 
                                    justify-center border-2 border-gray-900">
                        <BsRobot className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </>
                )}
              </div>
              <span className="text-xs text-gray-400 truncate max-w-[64px]">
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