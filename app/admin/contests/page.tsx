'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Contest {
  id: string
  title: string
  description: string
  prize_amount: number
  start_date: string
  end_date: string
  status: 'draft' | 'active' | 'finished' | 'archived'
  created_at: string
  submissions_count: number
}

export default function ContestManagementPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingContest, setEditingContest] = useState<Contest | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prize_amount: 1000,
    start_date: '',
    end_date: ''
  })

  useEffect(() => {
    fetchContests()
  }, [])

  const fetchContests = async () => {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          submissions(count)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching contests:', error)
        }
        return
      }

      const transformedData = data?.map(contest => ({
        ...contest,
        submissions_count: contest.submissions?.[0]?.count || 0
      })) || []

      setContests(transformedData)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching contests:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateContest = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('contests')
        .insert({
          title: formData.title,
          description: formData.description,
          prize_amount: formData.prize_amount,
          start_date: formData.start_date,
          end_date: formData.end_date,
          status: 'draft'
        })

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error creating contest:', error)
        }
        alert('Failed to create contest')
        return
      }

      setFormData({ title: '', description: '', prize_amount: 1000, start_date: '', end_date: '' })
      setShowCreateForm(false)
      fetchContests()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error creating contest:', error)
      }
      alert('Failed to create contest')
    }
  }

  const handleUpdateContest = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingContest) return

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('contests')
        .update({
          title: formData.title,
          description: formData.description,
          prize_amount: formData.prize_amount,
          start_date: formData.start_date,
          end_date: formData.end_date
        })
        .eq('id', editingContest.id)

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error updating contest:', error)
        }
        alert('Failed to update contest')
        return
      }

      setEditingContest(null)
      setFormData({ title: '', description: '', prize_amount: 1000, start_date: '', end_date: '' })
      fetchContests()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating contest:', error)
      }
      alert('Failed to update contest')
    }
  }

  const handleStatusChange = async (contestId: string, newStatus: string) => {
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('contests')
        .update({ status: newStatus })
        .eq('id', contestId)

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error updating contest status:', error)
        }
        alert('Failed to update contest status')
        return
      }

      fetchContests()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating contest status:', error)
      }
      alert('Failed to update contest status')
    }
  }

  const startEdit = (contest: Contest) => {
    setEditingContest(contest)
    setFormData({
      title: contest.title,
      description: contest.description,
      prize_amount: contest.prize_amount,
      start_date: contest.start_date,
      end_date: contest.end_date
    })
    setShowCreateForm(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500'
      case 'active': return 'bg-green-500'
      case 'finished': return 'bg-blue-500'
      case 'archived': return 'bg-gray-700'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading contests...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4" style={{
              fontFamily: 'var(--font-bebas-neue), "Arial Black", "Impact", sans-serif',
              background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF8C00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              CONTEST MANAGEMENT
            </h1>
            <p className="text-xl text-white/80">Create, manage, and archive contests</p>
          </div>
          <button
            onClick={() => {
              setShowCreateForm(true)
              setEditingContest(null)
              setFormData({ title: '', description: '', prize_amount: 1000, start_date: '', end_date: '' })
            }}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            ➕ New Contest
          </button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingContest ? 'Edit Contest' : 'Create New Contest'}
            </h2>
            
            <form onSubmit={editingContest ? handleUpdateContest : handleCreateContest} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-yellow-500"
                    placeholder="Contest title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Prize Amount ($) *</label>
                  <input
                    type="number"
                    value={formData.prize_amount}
                    onChange={(e) => setFormData({ ...formData, prize_amount: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-yellow-500"
                    min="100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-yellow-500 h-32 resize-none"
                  placeholder="Contest description and rules"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Start Date *</label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-yellow-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">End Date *</label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-yellow-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  {editingContest ? 'Update Contest' : 'Create Contest'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingContest(null)
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Contests List */}
        <div className="space-y-4">
          {contests.length === 0 ? (
            <div className="text-center text-white/60 text-xl py-12">
              No contests yet. Create your first contest!
            </div>
          ) : (
            contests.map((contest) => (
              <div key={contest.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-2xl font-bold text-white">{contest.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getStatusColor(contest.status)}`}>
                        {contest.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-white/80 mb-4">{contest.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Prize:</span>
                        <span className="text-yellow-400 font-bold ml-2">${contest.prize_amount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-white/60">Submissions:</span>
                        <span className="text-white font-bold ml-2">{contest.submissions_count}</span>
                      </div>
                      <div>
                        <span className="text-white/60">Start:</span>
                        <span className="text-white ml-2">{new Date(contest.start_date).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-white/60">End:</span>
                        <span className="text-white ml-2">{new Date(contest.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-6">
                    <button
                      onClick={() => startEdit(contest)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    
                    {contest.status === 'draft' && (
                      <button
                        onClick={() => handleStatusChange(contest.id, 'active')}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                      >
                        ▶️ Start
                      </button>
                    )}
                    
                    {contest.status === 'active' && (
                      <button
                        onClick={() => handleStatusChange(contest.id, 'finished')}
                        className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                      >
                        ⏹️ Finish
                      </button>
                    )}
                    
                    {contest.status === 'finished' && (
                      <button
                        onClick={() => handleStatusChange(contest.id, 'archived')}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                      >
                        📦 Archive
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
