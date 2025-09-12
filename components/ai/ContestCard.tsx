'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  CalendarIcon, 
  TrophyIcon, 
  UsersIcon, 
  ClockIcon,
  SparklesIcon,
  FireIcon
} from '@heroicons/react/24/outline'

interface ContestCardProps {
  contest: {
    id: string
    title: string
    description: string
    theme: string
    start_date: string
    end_date: string
    status: 'upcoming' | 'active' | 'voting' | 'completed'
    prize_pool?: number
    max_submissions?: number
    current_submissions?: number
    participants_count?: number
    featured_image?: string
    rules?: string[]
    allowed_models?: string[]
    is_featured?: boolean
    created_by?: {
      username: string
      avatar_url?: string
    }
  }
  className?: string
}

export default function ContestCard({ contest, className = '' }: ContestCardProps) {
  const [imageLoading, setImageLoading] = useState(true)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'from-blue-500 to-cyan-500'
      case 'active':
        return 'from-green-500 to-teal-500'
      case 'voting':
        return 'from-purple-500 to-pink-500'
      case 'completed':
        return 'from-gray-600 to-gray-500'
      default:
        return 'from-gray-600 to-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Coming Soon'
      case 'active':
        return 'Active Now'
      case 'voting':
        return 'Voting Phase'
      case 'completed':
        return 'Completed'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysRemaining = () => {
    const now = new Date()
    const endDate = new Date(contest.end_date)
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const getProgressPercentage = () => {
    if (!contest.max_submissions || !contest.current_submissions) return 0
    return Math.min((contest.current_submissions / contest.max_submissions) * 100, 100)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`ai-card group overflow-hidden ${className}`}
    >
      {/* Featured Badge */}
      {contest.is_featured && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
            <FireIcon className="w-3 h-3" />
            Featured
          </div>
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className={`bg-gradient-to-r ${getStatusColor(contest.status)} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
          {getStatusText(contest.status)}
        </div>
      </div>

      {/* Header Image or Gradient */}
      <div className="relative h-48 overflow-hidden rounded-lg mb-4 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
        {contest.featured_image ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="ai-spinner"></div>
              </div>
            )}
            <Image
              src={contest.featured_image}
              alt={contest.title}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setImageLoading(false)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <SparklesIcon className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <div className="text-2xl font-bold opacity-90">{contest.theme}</div>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Prize Pool */}
        {contest.prize_pool && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
            💰 ${contest.prize_pool.toLocaleString()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Title and Theme */}
        <div>
          <Link href={`/contest/${contest.id}`}>
            <h3 className="font-bold text-xl text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
              {contest.title}
            </h3>
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 font-medium">{contest.theme}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
          {contest.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 py-3">
          {/* Participants */}
          <div className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-sm font-semibold text-white">
                {contest.participants_count || 0}
              </div>
              <div className="text-xs text-gray-500">Participants</div>
            </div>
          </div>

          {/* Time Remaining */}
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-orange-400" />
            <div>
              <div className="text-sm font-semibold text-white">
                {contest.status === 'completed' ? 'Finished' : `${getDaysRemaining()}d`}
              </div>
              <div className="text-xs text-gray-500">
                {contest.status === 'completed' ? 'Contest over' : 'Remaining'}
              </div>
            </div>
          </div>
        </div>

        {/* Submission Progress */}
        {contest.max_submissions && contest.current_submissions !== undefined && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Submissions</span>
              <span className="text-white">
                {contest.current_submissions} / {contest.max_submissions}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <CalendarIcon className="w-4 h-4" />
            <span>{formatDate(contest.start_date)}</span>
          </div>
          <div className="text-gray-500">→</div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>{formatDate(contest.end_date)}</span>
            <CalendarIcon className="w-4 h-4" />
          </div>
        </div>

        {/* Allowed Models */}
        {contest.allowed_models && contest.allowed_models.length > 0 && (
          <div>
            <div className="text-xs text-gray-500 mb-2">Allowed AI Models:</div>
            <div className="flex flex-wrap gap-1">
              {contest.allowed_models.slice(0, 3).map((model) => (
                <span
                  key={model}
                  className="text-xs px-2 py-1 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 rounded-full"
                >
                  {model}
                </span>
              ))}
              {contest.allowed_models.length > 3 && (
                <span className="text-xs px-2 py-1 text-gray-500">
                  +{contest.allowed_models.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-800">
          <Link
            href={`/contest/${contest.id}`}
            className="w-full ai-btn text-center py-3 flex items-center justify-center gap-2"
          >
            {contest.status === 'upcoming' && (
              <>
                <CalendarIcon className="w-4 h-4" />
                View Details
              </>
            )}
            {contest.status === 'active' && (
              <>
                <TrophyIcon className="w-4 h-4" />
                Join Contest
              </>
            )}
            {contest.status === 'voting' && (
              <>
                <SparklesIcon className="w-4 h-4" />
                Vote Now
              </>
            )}
            {contest.status === 'completed' && (
              <>
                <TrophyIcon className="w-4 h-4" />
                View Results
              </>
            )}
          </Link>
        </div>
      </div>
    </motion.div>
  )
}