'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import SocialNavbar from '@/components/layout/SocialNavbar'
import Link from 'next/link'

interface Contest {
  id: string
  title: string
  description: string
  prize_pool: number
  start_date: string
  end_date: string
  status: string
  created_at: string
  submissions_count: number
}

export default function ContestManagementPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<unknown>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return

    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()

        setIsAdmin(profile?.is_admin || false)
      }
    }

    checkAdmin()
    fetchContests()
  }, [])

  const fetchContests = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          submissions(count)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching contests:', error)
        return
      }

      const transformedData: Contest[] = data?.map((contest: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
        id: contest.id as string,
        title: contest.title as string,
        description: contest.description as string,
        prize_pool: contest.prize_pool as number,
        start_date: contest.start_date as string,
        end_date: contest.end_date as string,
        status: contest.status as string,
        created_at: contest.created_at as string,
        submissions_count: (contest.submissions as any)?.[0]?.count || 0 // eslint-disable-line @typescript-eslint/no-explicit-any
      })) || []

      setContests(transformedData)
    } catch (error) {
      console.error('Error fetching contests:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateContestStatus = async (contestId: string, newStatus: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('contests')
        .update({ status: newStatus })
        .eq('id', contestId)

      if (error) throw error

      // Refresh the contests list
      fetchContests()
    } catch (error) {
      console.error('Error updating contest status:', error)
      alert('Failed to update contest status')
    }
  }

  const deleteContest = async (contestId: string) => {
    if (!confirm('Are you sure you want to delete this contest? This action cannot be undone.')) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('contests')
        .delete()
        .eq('id', contestId)

      if (error) throw error

      // Refresh the contests list
      fetchContests()
    } catch (error) {
      console.error('Error deleting contest:', error)
      alert('Failed to delete contest')
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300'
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-300'
      case 'finished':
        return 'bg-blue-500/20 text-blue-300'
      case 'archived':
        return 'bg-gray-500/20 text-gray-300'
      default:
        return 'bg-gray-500/20 text-gray-300'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please sign in to access this page</h1>
          <Link href="/auth" className="text-blue-400 hover:text-blue-300">Sign In</Link>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/60 mb-4">You don&apos;t have admin permissions.</p>
          <Link href="/gallery" className="text-blue-400 hover:text-blue-300">Return to Gallery</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <SocialNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Contest Management</h1>
              <p className="text-lg text-white/80">Manage all creative contests</p>
            </div>
            <Link
              href="/admin/create-contest"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Create New Contest
            </Link>
          </div>

          {/* Contests List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-white text-2xl">Loading contests...</div>
            </div>
          ) : contests.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">No Contests Found</h2>
                <p className="text-white/80 mb-6">Create your first contest to get started!</p>
                <Link
                  href="/admin/create-contest"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all inline-block"
                >
                  Create Contest
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {contests.map((contest) => (
                <div key={contest.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{contest.title}</h3>
                      <p className="text-white/70 text-sm mb-3 line-clamp-2">{contest.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contest.status)}`}>
                        {contest.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-white/60 text-sm">Start Date</span>
                      <p className="text-white font-medium">{formatDate(contest.start_date)}</p>
                    </div>
                    <div>
                      <span className="text-white/60 text-sm">End Date</span>
                      <p className="text-white font-medium">{formatDate(contest.end_date)}</p>
                    </div>
                    <div>
                      <span className="text-white/60 text-sm">Submissions</span>
                      <p className="text-white font-medium">{contest.submissions_count}</p>
                    </div>
                    <div>
                      <span className="text-white/60 text-sm">Prize System</span>
                      <p className="text-yellow-400 font-medium">5 Entries per Win</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateContestStatus(contest.id, contest.status === 'active' ? 'finished' : 'active')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          contest.status === 'active'
                            ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
                            : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                        }`}
                      >
                        {contest.status === 'active' ? 'Finish Contest' : 'Activate Contest'}
                      </button>
                      <button
                        onClick={() => updateContestStatus(contest.id, 'archived')}
                        className="px-4 py-2 bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 rounded-lg font-medium transition-all"
                      >
                        Archive
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/contest/${contest.id}`}
                        className="px-4 py-2 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded-lg font-medium transition-all"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => deleteContest(contest.id)}
                        className="px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg font-medium transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}