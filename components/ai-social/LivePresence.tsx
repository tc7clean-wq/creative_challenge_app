'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { BsRobot, BsEye, BsPen, BsHeart } from 'react-icons/bs'
import { FiUsers, FiActivity } from 'react-icons/fi'

interface User {
  id: string
  name: string
  avatar: string
  activity: 'viewing' | 'creating' | 'commenting' | 'liking'
  isAI: boolean
  location?: { x: number; y: number }
  lastSeen: Date
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Neural Artist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neural1',
    activity: 'viewing',
    isAI: true,
    location: { x: 20, y: 30 },
    lastSeen: new Date()
  },
  {
    id: '2',
    name: 'Human Creator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=human1',
    activity: 'creating',
    isAI: false,
    location: { x: 60, y: 45 },
    lastSeen: new Date()
  },
  {
    id: '3',
    name: 'GPT Collaborator',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gpt',
    activity: 'commenting',
    isAI: true,
    location: { x: 80, y: 20 },
    lastSeen: new Date()
  }
]

export default function LivePresence() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [showDetails, setShowDetails] = useState(false)

  // Simulate real-time user movement and activity
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prev => prev.map(user => ({
        ...user,
        location: {
          x: Math.max(0, Math.min(100, user.location!.x + (Math.random() - 0.5) * 10)),
          y: Math.max(0, Math.min(100, user.location!.y + (Math.random() - 0.5) * 10))
        },
        activity: (['viewing', 'creating', 'commenting', 'liking'] as const)[Math.floor(Math.random() * 4)]
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'viewing': return <BsEye className="w-3 h-3" />
      case 'creating': return <BsPen className="w-3 h-3" />
      case 'commenting': return <FiActivity className="w-3 h-3" />
      case 'liking': return <BsHeart className="w-3 h-3" />
      default: return <BsEye className="w-3 h-3" />
    }
  }

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'viewing': return 'from-blue-500 to-cyan-500'
      case 'creating': return 'from-purple-500 to-pink-500'
      case 'commenting': return 'from-green-500 to-emerald-500'
      case 'liking': return 'from-red-500 to-rose-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <>
      {/* Floating User Avatars */}
      <div className="fixed inset-0 pointer-events-none z-30">
        <AnimatePresence>
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: `${user.location!.x}vw`,
                y: `${user.location!.y}vh`
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="relative group cursor-pointer"
              >
                {/* Avatar with AI Badge */}
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full p-[2px] bg-gradient-to-r ${getActivityColor(user.activity)}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover border-2 border-gray-900"
                    />
                  </div>

                  {/* AI Badge */}
                  {user.isAI && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-cyan-500 to-blue-600
                               rounded-full flex items-center justify-center border-2 border-gray-900"
                    >
                      <BsRobot className="w-2.5 h-2.5 text-white" />
                    </motion.div>
                  )}

                  {/* Activity Indicator */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute -bottom-1 -left-1 w-5 h-5 bg-gradient-to-r ${getActivityColor(user.activity)}
                             rounded-full flex items-center justify-center border-2 border-gray-900`}
                  >
                    {getActivityIcon(user.activity)}
                  </motion.div>
                </div>

                {/* Hover Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                           bg-gray-900/90 backdrop-blur-xl rounded-lg px-3 py-2 text-xs text-white
                           border border-cyan-500/30 whitespace-nowrap"
                >
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-gray-400 capitalize">{user.activity}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2
                                bg-gray-900 rotate-45 border-r border-b border-cyan-500/30" />
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Live Activity Panel */}
      <motion.div
        initial={{ x: 300 }}
        animate={{ x: showDetails ? 0 : 240 }}
        className="fixed top-1/2 right-0 transform -translate-y-1/2 z-40"
      >
        <div className="glass-card-intense rounded-l-2xl p-4 border-l border-t border-b border-cyan-500/30
                      min-w-[280px] neural-glow">
          {/* Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDetails(!showDetails)}
            className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2
                     glass-card neural-glow rounded-l-lg p-3 border border-r-0 border-cyan-500/30"
          >
            <FiUsers className="w-5 h-5 text-cyan-300" />
          </motion.button>

          {/* Content */}
          <motion.div
            animate={{ opacity: showDetails ? 1 : 0 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-white">Live Activity</span>
              <span className="text-xs text-gray-400">({users.length} online)</span>
            </div>

            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3 p-2 glass-card rounded-lg"
              >
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getActivityColor(user.activity)} p-[1px]`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  {user.isAI && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{user.name}</div>
                  <div className="text-xs text-gray-400 capitalize flex items-center space-x-1">
                    {getActivityIcon(user.activity)}
                    <span>{user.activity}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}