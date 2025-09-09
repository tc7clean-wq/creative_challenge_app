'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import SocialNavbar from '@/components/layout/SocialNavbar'
import Link from 'next/link'
import Image from 'next/image'

interface Submission {
  id: string
  title: string
  description: string
  image_url: string
  user_id: string
  created_at: string
  votes_count: number
  profiles: {
    username: string
    full_name: string
  }
}

interface Contest {
  id: string
  title: string
  description: string
  status: string
  end_date: string
}

export default function ContestVotePage({ params }: { params: Promise<{ id: string }> }) {
  const [contest, setContest] = useState<Contest | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<unknown>(null)
  const [votedFor, setVotedFor] = useState<string | null>(null)
  const [voting, setVoting] = useState(false)

  const fetchContestData = useCallback(async (contestId: string) => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      // Fetch contest details
      const { data: contestData, error: contestError } = await supabase
        .from('contests')
        .select('*')
        .eq('id', contestId)
        .single()

      if (contestError) {
        console.error('Error fetching contest:', contestError)
        return
      }

      setContest(contestData)

      // Fetch submissions with votes and user info
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles(username, full_name),
          votes(count)
        `)
        .eq('contest_id', contestId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (submissionsError) {
        console.error('Error fetching submissions:', submissionsError)
        return
      }

      // For demo purposes, add some mock submissions if none exist
      let transformedSubmissions: Submission[] = submissionsData?.map((submission: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
        id: submission.id,
        title: submission.title,
        description: submission.description,
        image_url: submission.image_url,
        user_id: submission.user_id,
        created_at: submission.created_at,
        votes_count: (submission.votes as any)?.[0]?.count || 0, // eslint-disable-line @typescript-eslint/no-explicit-any
        profiles: submission.profiles
      })) || []

      // Add mock submissions for demo if no real submissions exist
      if (transformedSubmissions.length === 0) {
        transformedSubmissions = [
          {
            id: 'mock-1',
            title: 'Cyberpunk Cityscape',
            description: 'A stunning digital artwork showcasing futuristic cityscapes with neon lights and towering buildings.',
            image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop',
            user_id: 'user-1',
            created_at: new Date().toISOString(),
            votes_count: 45,
            profiles: {
              username: 'alexchen',
              full_name: 'Alex Chen'
            }
          },
          {
            id: 'mock-2',
            title: 'Neon Dreams',
            description: 'Vibrant neon-lit artwork capturing the essence of digital nightlife and urban energy.',
            image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop',
            user_id: 'user-2',
            created_at: new Date().toISOString(),
            votes_count: 32,
            profiles: {
              username: 'mayar',
              full_name: 'Maya Rodriguez'
            }
          },
          {
            id: 'mock-3',
            title: 'Abstract Universe',
            description: 'An abstract representation of cosmic energy and movement in digital form.',
            image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop',
            user_id: 'user-3',
            created_at: new Date().toISOString(),
            votes_count: 28,
            profiles: {
              username: 'jordank',
              full_name: 'Jordan Kim'
            }
          },
          {
            id: 'mock-4',
            title: 'Steampunk Machinery',
            description: 'Intricate steampunk-inspired mechanical artwork with brass and copper tones.',
            image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop',
            user_id: 'user-4',
            created_at: new Date().toISOString(),
            votes_count: 19,
            profiles: {
              username: 'samw',
              full_name: 'Sam Wilson'
            }
          },
          {
            id: 'mock-5',
            title: 'Fantasy Forest',
            description: 'Magical forest scene with glowing creatures and mystical atmosphere.',
            image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop',
            user_id: 'user-5',
            created_at: new Date().toISOString(),
            votes_count: 67,
            profiles: {
              username: 'lunap',
              full_name: 'Luna Park'
            }
          },
          {
            id: 'mock-6',
            title: 'Minimalist Geometry',
            description: 'Clean geometric patterns with perfect symmetry and balance.',
            image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop',
            user_id: 'user-6',
            created_at: new Date().toISOString(),
            votes_count: 23,
            profiles: {
              username: 'maxc',
              full_name: 'Max Chen'
            }
          }
        ] as Submission[]
      }

      setSubmissions(transformedSubmissions)

      // Check if user has already voted
      if (user) {
        const { data: userVote } = await supabase
          .from('votes')
          .select('submission_id')
          .eq('user_id', (user as any).id) // eslint-disable-line @typescript-eslint/no-explicit-any
          .eq('contest_id', contestId)
          .single()

        if (userVote) {
          setVotedFor(userVote.submission_id)
        }
      }
    } catch (error) {
      console.error('Error fetching contest data:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    const loadData = async () => {
      const resolvedParams = await params
      getUser()
      fetchContestData(resolvedParams.id)
    }

    loadData()
  }, [params, fetchContestData])


  const handleVote = async (submissionId: string) => {
    if (!user) {
      alert('Please sign in to vote')
      return
    }

    if (votedFor) {
      alert('You have already voted in this contest')
      return
    }

    try {
      setVoting(true)
      const supabase = createClient()
      const resolvedParams = await params
      
      const { error } = await supabase
        .from('votes')
        .insert({
          contest_id: resolvedParams.id,
          submission_id: submissionId,
          user_id: (user as any).id // eslint-disable-line @typescript-eslint/no-explicit-any
        })

      if (error) throw error

      setVotedFor(submissionId)
      
      // Refresh submissions to update vote counts
      fetchContestData(resolvedParams.id)
      
      alert('Vote submitted successfully!')
    } catch (error) {
      console.error('Error voting:', error)
      alert('Failed to submit vote. Please try again.')
    } finally {
      setVoting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isContestActive = (endDate: string) => {
    return new Date(endDate) > new Date()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading contest...</div>
      </div>
    )
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Contest Not Found</h1>
          <Link href="/contests" className="text-blue-400 hover:text-blue-300">Back to Contests</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <SocialNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Contest Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">{contest.title}</h1>
            <p className="text-lg text-white/80 mb-4">{contest.description}</p>
            <div className="flex justify-center items-center space-x-4">
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                isContestActive(contest.end_date)
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {isContestActive(contest.end_date) ? 'Voting Open' : 'Voting Closed'}
              </div>
              <div className="text-white/60 text-sm">
                {isContestActive(contest.end_date) 
                  ? `Ends ${formatDate(contest.end_date)}`
                  : `Ended ${formatDate(contest.end_date)}`
                }
              </div>
            </div>
          </div>

          {/* Voting Instructions */}
          {!votedFor && isContestActive(contest.end_date) && (
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-8">
              <p className="text-blue-200 text-center">
                <strong>How to Vote:</strong> Browse through all the submissions below and click &quot;Vote&quot; on your favorite image. You can only vote once per contest!
              </p>
            </div>
          )}

          {/* Already Voted Message */}
          {votedFor && (
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 mb-8">
              <p className="text-green-200 text-center">
                ✅ You have already voted in this contest! Thank you for participating.
              </p>
            </div>
          )}

          {/* Submissions Grid */}
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">No Submissions Yet</h2>
                <p className="text-white/80 mb-6">Be the first to submit artwork to this contest!</p>
                <Link
                  href="/submit"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all inline-block"
                >
                  Submit Artwork
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submissions.map((submission) => (
                <div key={submission.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={submission.image_url}
                      alt={submission.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{submission.title}</h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{submission.description}</p>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-white/60 text-sm">By</span>
                      <p className="text-white font-medium">
                        {submission.profiles?.full_name || submission.profiles?.username || 'Anonymous'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-white/60 text-sm">Votes</span>
                      <p className="text-yellow-400 font-bold text-lg">{submission.votes_count}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {!user ? (
                      <Link
                        href="/auth"
                        className="w-full bg-gray-500/20 text-gray-300 py-2 px-4 rounded-lg font-medium text-center block"
                      >
                        Sign In to Vote
                      </Link>
                    ) : votedFor ? (
                      <div className={`w-full py-2 px-4 rounded-lg font-medium text-center ${
                        votedFor === submission.id
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {votedFor === submission.id ? '✓ Your Vote' : 'Voted'}
                      </div>
                    ) : !isContestActive(contest.end_date) ? (
                      <div className="w-full bg-gray-500/20 text-gray-300 py-2 px-4 rounded-lg font-medium text-center">
                        Voting Closed
                      </div>
                    ) : (
                      <button
                        onClick={() => handleVote(submission.id)}
                        disabled={voting}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 px-4 rounded-lg font-medium transition-all disabled:opacity-50"
                      >
                        {voting ? 'Voting...' : 'Vote for this'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back to Contests */}
          <div className="text-center mt-12">
            <Link
              href="/contests"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all inline-block"
            >
              Back to All Contests
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
