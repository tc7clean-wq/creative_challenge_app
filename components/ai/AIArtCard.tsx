'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HeartIcon, ChatBubbleLeftIcon, EyeIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface AIArtCardProps {
  artwork: {
    id: string
    title: string
    description?: string
    image_url: string
    ai_model: string
    prompt: string
    author: {
      id: string
      username: string
      avatar_url?: string
    }
    likes_count: number
    comments_count: number
    views_count: number
    created_at: string
    tags?: string[]
    is_liked?: boolean
    contest?: {
      id: string
      title: string
      theme: string
    }
  }
  onLike?: (id: string) => void
  onShare?: (id: string) => void
  showFullPrompt?: boolean
  className?: string
}

export default function AIArtCard({ 
  artwork, 
  onLike, 
  onShare, 
  showFullPrompt = false,
  className = ''
}: AIArtCardProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [showPrompt, setShowPrompt] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onLike?.(artwork.id)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onShare?.(artwork.id)
  }

  const truncatePrompt = (prompt: string, maxLength: number = 100) => {
    return prompt.length > maxLength ? `${prompt.substring(0, maxLength)}...` : prompt
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`ai-card group overflow-hidden ${className}`}
    >
      {/* Contest Badge */}
      {artwork.contest && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
            <SparklesIcon className="w-3 h-3" />
            {artwork.contest.title}
          </div>
        </div>
      )}

      {/* Image */}
      <Link href={`/artwork/${artwork.id}`} className="block relative">
        <div className="relative aspect-square overflow-hidden bg-gray-900 rounded-lg mb-4">
          {imageLoading && (
            <div className="absolute inset-0 ai-spinner-container flex items-center justify-center">
              <div className="ai-spinner"></div>
            </div>
          )}
          <Image
            src={artwork.image_url}
            alt={artwork.title}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-center text-white">
              <EyeIcon className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-semibold">View Details</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="space-y-3">
        {/* Title and AI Model */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link href={`/artwork/${artwork.id}`}>
              <h3 className="font-semibold text-lg text-white group-hover:text-cyan-400 transition-colors truncate">
                {artwork.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-full px-2 py-1">
                <span className="text-xs font-medium text-cyan-300">{artwork.ai_model}</span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(artwork.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Author */}
        <Link href={`/profile/${artwork.author.username}`} className="flex items-center gap-2 group/author">
          {artwork.author.avatar_url ? (
            <Image
              src={artwork.author.avatar_url}
              alt={artwork.author.username}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {artwork.author.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-sm text-gray-400 group-hover/author:text-cyan-400 transition-colors">
            {artwork.author.username}
          </span>
        </Link>

        {/* Prompt */}
        <div className="space-y-2">
          <div className="text-sm text-gray-300">
            <span className="font-medium">Prompt: </span>
            {showFullPrompt || showPrompt ? (
              <span className="break-words">{artwork.prompt}</span>
            ) : (
              <span>{truncatePrompt(artwork.prompt)}</span>
            )}
            {!showFullPrompt && artwork.prompt.length > 100 && (
              <button
                onClick={() => setShowPrompt(!showPrompt)}
                className="text-cyan-400 hover:text-cyan-300 ml-1 text-xs"
              >
                {showPrompt ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </div>

        {/* Tags */}
        {artwork.tags && artwork.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {artwork.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded-full hover:bg-gray-700 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
            {artwork.tags.length > 3 && (
              <span className="text-xs px-2 py-1 text-gray-500">
                +{artwork.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${
                artwork.is_liked
                  ? 'text-red-500 hover:text-red-400'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              {artwork.is_liked ? (
                <HeartSolidIcon className="w-5 h-5" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
              <span className="text-sm">{artwork.likes_count}</span>
            </button>

            {/* Comments */}
            <Link
              href={`/artwork/${artwork.id}#comments`}
              className="flex items-center gap-1 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span className="text-sm">{artwork.comments_count}</span>
            </Link>

            {/* Views */}
            <div className="flex items-center gap-1 text-gray-400">
              <EyeIcon className="w-5 h-5" />
              <span className="text-sm">{artwork.views_count}</span>
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}