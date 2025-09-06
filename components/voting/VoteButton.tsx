'use client'

import { useState } from 'react'
// import { createClient } from '@/utils/supabase/client' // Not used in this component

interface VoteButtonProps {
  submissionId: string
  category: string
  currentVotes: number
  hasVoted: boolean
  onVoteChange?: (newVoteCount: number) => void
  className?: string
}

export default function VoteButton({ 
  submissionId, 
  category, 
  currentVotes, 
  hasVoted, 
  onVoteChange,
  className = ''
}: VoteButtonProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [voteCount, setVoteCount] = useState(currentVotes)
  const [userHasVoted, setUserHasVoted] = useState(hasVoted)
  // const supabase = createClient() // Not used in this component

  const handleVote = async () => {
    if (userHasVoted || isVoting) return

    setIsVoting(true)

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId,
          category
        })
      })

      const data = await response.json()

      if (data.success) {
        setVoteCount(prev => prev + 1)
        setUserHasVoted(true)
        onVoteChange?.(voteCount + 1)
      } else {
        console.error('Vote failed:', data.error)
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(false)
    }
  }

  const handleUnvote = async () => {
    if (!userHasVoted || isVoting) return

    setIsVoting(true)

    try {
      const response = await fetch('/api/votes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId,
          category
        })
      })

      const data = await response.json()

      if (data.success) {
        setVoteCount(prev => Math.max(0, prev - 1))
        setUserHasVoted(false)
        onVoteChange?.(voteCount - 1)
      } else {
        console.error('Unvote failed:', data.error)
      }
    } catch (error) {
      console.error('Error unvoting:', error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <button
      onClick={userHasVoted ? handleUnvote : handleVote}
      disabled={isVoting}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${userHasVoted 
          ? 'bg-green-500 hover:bg-green-600 text-white' 
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
        }
        ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {isVoting ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <span className="text-lg">
          {userHasVoted ? '❤️' : '🤍'}
        </span>
      )}
      <span>{voteCount}</span>
      <span className="text-sm">
        {userHasVoted ? 'Voted' : 'Vote'}
      </span>
    </button>
  )
}
