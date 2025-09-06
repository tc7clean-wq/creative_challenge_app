'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import AdminNavbar from '@/components/layout/AdminNavbar'
import AdminGuard from '@/components/auth/AdminGuard'

interface User {
  id: string
  username: string
  full_name: string
  avatar_url: string
  created_at: string
  current_jackpot_entries: number
  submissions_count: number
  total_votes: number
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'most_active' | 'most_entries'>('newest')

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          avatar_url,
          created_at,
          current_jackpot_entries,
          submissions!inner(count),
          submissions!inner(votes)
        `)

      if (error) {
        console.error('Error fetching users:', error)
        setError('Failed to fetch users')
        return
      }

      // Process the data to calculate totals
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const processedUsers = data?.map((profile: Record<string, any>) => ({
        id: profile.id,
        username: profile.username || 'anonymous',
        full_name: profile.full_name || 'Anonymous',
        avatar_url: profile.avatar_url || '',
        created_at: profile.created_at,
        current_jackpot_entries: profile.current_jackpot_entries || 0,
        submissions_count: profile.submissions?.[0]?.count || 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        total_votes: profile.submissions?.reduce((sum: number, sub: Record<string, any>) => sum + (sub.votes || 0), 0) || 0
      })) || []

      setUsers(processedUsers)
    } catch (err) {
      console.error('Error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'most_active':
        return b.submissions_count - a.submissions_count
      case 'most_entries':
        return b.current_jackpot_entries - a.current_jackpot_entries
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading users...</div>
      </div>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <AdminNavbar />
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2" style={{
            fontFamily: 'var(--font-bebas-neue), "Arial Black", "Impact", sans-serif',
            background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF8C00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            User Management
          </h1>
          <p className="text-lg text-white/80 mb-6">Manage users and monitor platform activity</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-2">
                {(['newest', 'most_active', 'most_entries'] as const).map((sort) => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      sortBy === sort
                        ? 'bg-white text-purple-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {sort === 'newest' ? 'Newest' : sort === 'most_active' ? 'Most Active' : 'Most Entries'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                Users ({sortedUsers.length})
              </h2>
            </div>

            <div className="divide-y divide-white/10">
              {sortedUsers.map((user) => (
                <div key={user.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-semibold text-lg">
                          {user.full_name}
                        </div>
                        <div className="text-gray-300 text-sm">
                          @{user.username}
                        </div>
                        <div className="text-gray-400 text-xs">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-white font-bold text-xl">
                          {user.submissions_count}
                        </div>
                        <div className="text-gray-300 text-sm">Submissions</div>
                      </div>
                      <div>
                        <div className="text-yellow-400 font-bold text-xl">
                          {user.current_jackpot_entries}
                        </div>
                        <div className="text-gray-300 text-sm">Jackpot Entries</div>
                      </div>
                      <div>
                        <div className="text-green-400 font-bold text-xl">
                          {user.total_votes}
                        </div>
                        <div className="text-gray-300 text-sm">Total Votes</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                        View Profile
                      </button>
                      <button className="bg-red-500/20 text-red-300 px-3 py-1 rounded-lg text-sm hover:bg-red-500/30 transition-colors">
                        Suspend
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedUsers.length === 0 && (
              <div className="p-12 text-center">
                <div className="text-gray-400 text-lg">No users found</div>
                <div className="text-gray-500 text-sm mt-2">Try adjusting your search terms</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </AdminGuard>
  )
}
