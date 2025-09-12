'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useLogger } from '@/utils/logger'

interface LikeButtonProps {
  targetId: string
  targetType: 'artwork' | 'comment'
  isLiked: boolean
  likesCount: number
  isLoading?: boolean
  onLikeChange?: (targetId: string, isLiked: boolean, newCount: number) => void
  variant?: 'default' | 'compact' | 'large'
  showCount?: boolean
  className?: string
}

export default function LikeButton({
  targetId,
  targetType,
  isLiked,
  likesCount,
  isLoading = false,
  onLikeChange,
  variant = 'default',
  showCount = true,
  className = ''
}: LikeButtonProps) {
  const [localLoading, setLocalLoading] = useState(false)
  const [animationCount, setAnimationCount] = useState(0)
  const logger = useLogger('LikeButton')

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (localLoading || isLoading) return

    setLocalLoading(true)
    setAnimationCount(prev => prev + 1)
    
    try {
      const response = await fetch('/api/social/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetId,
          targetType,
          action: isLiked ? 'unlike' : 'like'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update like status')
      }

      const data = await response.json()
      
      if (data.success) {
        const newIsLiked = !isLiked
        const newCount = newIsLiked ? likesCount + 1 : likesCount - 1
        onLikeChange?.(targetId, newIsLiked, newCount)
        
        logger.trackEvent('content_like_toggle', {
          targetId,
          targetType,
          action: newIsLiked ? 'like' : 'unlike'
        })
      } else {
        throw new Error(data.error || 'Failed to update like status')
      }
    } catch (error) {
      logger.error('Like action failed', error as Error)
      // Reset animation on error
      setAnimationCount(prev => prev + 1)
    } finally {
      setLocalLoading(false)
    }
  }

  const getButtonSize = () => {
    switch (variant) {
      case 'compact':
        return 'w-4 h-4'
      case 'large':
        return 'w-8 h-8'
      default:
        return 'w-5 h-5'
    }
  }

  const getTextSize = () => {
    switch (variant) {
      case 'compact':
        return 'text-xs'
      case 'large':
        return 'text-base'
      default:
        return 'text-sm'
    }
  }

  const isDisabled = localLoading || isLoading

  return (
    <motion.button
      whileHover={{ scale: isDisabled ? 1 : 1.1 }}
      whileTap={{ scale: isDisabled ? 1 : 0.9 }}
      onClick={handleLike}
      disabled={isDisabled}
      className={`
        inline-flex items-center gap-1.5 transition-all duration-200 group
        ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Heart Icon with Animation */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {isDisabled ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`border-2 border-current border-t-transparent rounded-full animate-spin ${getButtonSize()}`}
            />
          ) : isLiked ? (
            <motion.div
              key={`liked-${animationCount}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HeartSolidIcon className={`${getButtonSize()} text-red-500`} />
            </motion.div>
          ) : (
            <motion.div
              key={`unliked-${animationCount}`}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HeartIcon className={`${getButtonSize()} group-hover:text-red-500 transition-colors`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Heart particles animation on like */}
        {isLiked && !isDisabled && (
          <motion.div
            key={`particles-${animationCount}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  scale: 0.5,
                  x: 0,
                  y: 0,
                  rotate: 0,
                }}
                animate={{
                  opacity: 0,
                  scale: 0,
                  x: (Math.cos((i * 60) * Math.PI / 180)) * 20,
                  y: (Math.sin((i * 60) * Math.PI / 180)) * 20,
                  rotate: 360,
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Count */}
      {showCount && (
        <AnimatePresence mode="wait">
          <motion.span
            key={likesCount}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`font-medium ${getTextSize()}`}
          >
            {likesCount.toLocaleString()}
          </motion.span>
        </AnimatePresence>
      )}
    </motion.button>
  )
}