'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import FavoriteButton from '@/components/favorites/FavoriteButton'

interface Submission {
  id: string
  title: string
  image_url: string
  user_id: string
  tier: string
  vote_count: number
  created_at: string
}

interface Contest {
  id: string
  title: string
  end_date: string
  is_active: boolean
}

export default function Gallery() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeContest, setActiveContest] = useState<Contest | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const supabase = createClient()

  // Memoized contest query for better performance
  const contestQuery = useMemo(() => {
    const now = new Date().toISOString()
    return supabase
      .from('contests')
      .select('id, title, end_date, is_active')
      .lte('start_date', now)
      .gte('end_date', now)
      .eq('is_active', true)
      .order('end_date', { ascending: true })
      .limit(1)
      .single()
  }, [supabase])

  // Memoized submissions query
  const submissionsQuery = useCallback((contestId: string) => {
    return supabase
      .from('submissions')
      .select(`
        id,
        title,
        image_url,
        user_id,
        tier,
        vote_count,
        created_at
      `)
      .eq('contest_id', contestId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(12)
  }, [supabase])

  // Fetch user data and votes
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('User auth error:', userError)
          return
        }
        
        setUser(user)
        
        if (user) {
          // Fetch user's previous votes
          const { data: votes, error: votesError } = await supabase
            .from('votes')
            .select('submission_id')
            .eq('voter_id', user.id)
          
          if (votesError) {
            console.error('Votes fetch error:', votesError)
          } else if (votes) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const votedSubmissionIds = new Set<string>(votes.map((vote: any) => vote.submission_id as string))
            setVotedItems(votedSubmissionIds)
          }
        }
      } catch (error) {
        console.error('User check error:', error)
      }
    }

    checkUser()
  }, [supabase])

  // Fetch contest and submissions with retry logic
  useEffect(() => {
    const fetchContestAndSubmissions = async () => {
      try {
        setError(null)
        
        // First, get the currently active contest
        const { data: contest, error: contestError } = await contestQuery

        if (contestError) {
          // Check if it's a "no rows returned" error (which is normal when no contests exist)
          if (contestError.code === 'PGRST116') {
            if (process.env.NODE_ENV === 'development') {
              console.log('No active contests found in database')
            }
            setIsLoading(false)
            return
          }
          
          // Handle other errors
          if (contestError.code === 'PGRST301') {
            throw new Error('Database connection failed. Please check your connection and try again.')
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching active contest:', contestError)
          }
          throw new Error('Failed to fetch contest information. Please try again.')
        }

        if (!contest) {
          if (process.env.NODE_ENV === 'development') {
            console.log('No active contest found')
          }
          setIsLoading(false)
          return
        }

        setActiveContest(contest)

        // Then fetch submissions for this specific contest
        const { data: submissionsData, error: submissionsError } = await submissionsQuery(contest.id)

        if (submissionsError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching submissions:', submissionsError)
          }
          throw new Error('Failed to fetch submissions. Please try again.')
        } else {
          setSubmissions(submissionsData || [])
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching contest and submissions:', error)
        }
        setError(error instanceof Error ? error.message : 'An unexpected error occurred')
        
        // Auto-retry logic for network errors
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 2000 * (retryCount + 1)) // Exponential backoff
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchContestAndSubmissions()
  }, [contestQuery, submissionsQuery, retryCount])

  // Optimized vote handling with debouncing
  const handleVote = useCallback(async (submissionId: string) => {
    if (!user) {
      alert('Please log in to vote for submissions.')
      return
    }

    try {
      // Check if user has already voted for this submission
      if (votedItems.has(submissionId)) {
        alert('You have already voted for this submission!')
        return
      }

      // Optimistic update for better UX
      setVotedItems(prev => new Set(prev).add(submissionId))
      setSubmissions(prev => prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, vote_count: (sub.vote_count || 0) + 1 }
          : sub
      ))

      // Insert vote into database
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          submission_id: submissionId,
          voter_id: user.id,
          score: 10 // Default score of 10
        })

      if (voteError) {
        // Revert optimistic update on error
        setVotedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(submissionId)
          return newSet
        })
        setSubmissions(prev => prev.map(sub => 
          sub.id === submissionId 
            ? { ...sub, vote_count: (sub.vote_count || 0) - 1 }
            : sub
        ))
        throw voteError
      }

      alert('Vote recorded successfully! Thank you for voting.')
            } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).code === '23505') { // Unique constraint violation
        alert('You have already voted for this submission!')
        // Update local state to reflect the existing vote
        setVotedItems(prev => new Set(prev).add(submissionId))
      } else {
        console.error('Error recording vote:', error)
        alert('Failed to record vote. Please try again.')
      }
    }
  }, [user, votedItems, supabase])

  // Memoized submission grid for better performance
  const submissionGrid = useMemo(() => {
    if (submissions.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No submissions yet for this contest</p>
          <p className="text-gray-400 mb-6">Be the first to submit your creative work!</p>
          <a
            href="/submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Submit Your Entry
          </a>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {submissions.map((submission) => (
          <div key={submission.id} className="group relative aspect-square bg-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Submission Image with Next.js Image optimization */}
            {submission.image_url ? (
              <>
                <Image
                  src={submission.image_url}
                  alt={submission.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={false}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback for failed images
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500">Image unavailable</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">No Image</p>
                </div>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-center">
                <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors mb-3">
                  View Details
                </button>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-2">
                  {/* Vote Button */}
                  <button
                    onClick={() => handleVote(submission.id)}
                    disabled={votedItems.has(submission.id)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      votedItems.has(submission.id)
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-white text-gray-900 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    {votedItems.has(submission.id) ? (
                      <>
                        <HeartIconSolid className="w-5 h-5 text-white" />
                        <span className="text-sm">Voted</span>
                      </>
                    ) : (
                      <>
                        <HeartIcon className="w-5 h-5" />
                        <span className="text-sm">Vote</span>
                      </>
                    )}
                  </button>
                  
                  {/* Favorite Button */}
                  {user && (
                    <FavoriteButton
                      userId={user.id}
                      submissionId={submission.id}
                      className="bg-white/90 text-gray-900 hover:bg-white"
                      showText={false}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Submission Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 className="text-white font-semibold text-sm truncate">
                {submission.title}
              </h3>
              <div className="flex items-center justify-between text-white/80 text-xs mt-1">
                <span className="capitalize bg-blue-600 px-2 py-1 rounded text-white">
                  {submission.tier}
                </span>
                <span className="flex items-center space-x-1">
                  <HeartIcon className="w-3 h-3" />
                  <span>{submission.vote_count || 0}</span>
                </span>
              </div>
            </div>

            {/* Submission Date Badge */}
            <div className="absolute top-2 right-2">
              <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                {new Date(submission.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }, [submissions, votedItems, handleVote, user])

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading submissions...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Content</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setRetryCount(0)
                setError(null)
                setIsLoading(true)
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (!activeContest) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Contest</h3>
            <p className="text-gray-600 mb-4">There are currently no active contests running.</p>
            <p className="text-gray-500 mb-6">This is normal for a new installation. Contests will appear here once they are created.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                <strong>Next steps:</strong> Create a contest in your Supabase database or wait for contests to be added.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {activeContest.title} - Live Submissions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover amazing creative work from talented artists competing in the current contest. 
            Vote for your favorites and help them win! Contest ends {new Date(activeContest.end_date).toLocaleDateString()}.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              🎯 Active Contest
            </span>
            <span className="ml-2">
              {submissions.length} submission{submissions.length !== 1 ? 's' : ''} so far
            </span>
          </div>
        </div>

        {submissionGrid}

        <div className="text-center mt-12">
          <a 
            href="/submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg inline-block"
          >
            Submit Your Entry
          </a>
          <p className="text-sm text-gray-500 mt-3">
            Join the competition and showcase your creative talent!
          </p>
        </div>
      </div>
    </section>
  )
}
