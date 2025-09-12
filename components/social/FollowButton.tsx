'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline'
import { useLogger } from '@/utils/logger'

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
  isLoading?: boolean
  followersCount?: number
  onFollowChange?: (userId: string, isFollowing: boolean) => void
  variant?: 'default' | 'compact'
  className?: string
}

export default function FollowButton({
  userId,
  isFollowing,
  isLoading = false,
  followersCount,
  onFollowChange,
  variant = 'default',
  className = ''
}: FollowButtonProps) {
  const [localLoading, setLocalLoading] = useState(false)
  const logger = useLogger('FollowButton')

  const handleFollow = async () => {
    if (localLoading || isLoading) return

    setLocalLoading(true)
    
    try {
      const response = await fetch('/api/social/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: isFollowing ? 'unfollow' : 'follow'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update follow status')
      }

      const data = await response.json()
      
      if (data.success) {
        onFollowChange?.(userId, !isFollowing)
        logger.trackEvent('user_follow_toggle', {
          targetUserId: userId,
          action: isFollowing ? 'unfollow' : 'follow'
        })
      } else {
        throw new Error(data.error || 'Failed to update follow status')
      }
    } catch (error) {
      logger.error('Follow action failed', error as Error)
      // You could show a toast notification here
    } finally {
      setLocalLoading(false)
    }
  }

  const isDisabled = localLoading || isLoading

  if (variant === 'compact') {
    return (
      <motion.button
        whileHover={{ scale: isDisabled ? 1 : 1.05 }}
        whileTap={{ scale: isDisabled ? 1 : 0.95 }}
        onClick={handleFollow}
        disabled={isDisabled}
        className={`
          relative inline-flex items-center justify-center
          w-8 h-8 rounded-full transition-colors duration-200
          ${isFollowing 
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' 
            : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30'
          }
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
      >
        {isDisabled ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isFollowing ? (
          <UserMinusIcon className="w-4 h-4" />
        ) : (
          <UserPlusIcon className="w-4 h-4" />
        )}
      </motion.button>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      onClick={handleFollow}
      disabled={isDisabled}
      className={`
        relative inline-flex items-center justify-center gap-2
        px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
        ${isFollowing 
          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' 
          : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {isDisabled ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : isFollowing ? (
        <>
          <UserMinusIcon className="w-4 h-4" />
          <span>Unfollow</span>
          {followersCount !== undefined && (
            <span className="text-xs opacity-75">({followersCount})</span>
          )}
        </>
      ) : (
        <>
          <UserPlusIcon className="w-4 h-4" />
          <span>Follow</span>
          {followersCount !== undefined && (
            <span className="text-xs opacity-75">({followersCount})</span>
          )}
        </>
      )}
    </motion.button>
  )
}