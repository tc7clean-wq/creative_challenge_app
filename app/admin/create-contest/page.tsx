'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { SupabaseClient } from '@/types/supabase'

interface ContestForm {
  title: string
  theme: string
  description: string
  start_date: string
  end_date: string
  prize_pool: number
  max_submissions: number
  rules: string
}

export default function CreateContestPage() {
  const [form, setForm] = useState<ContestForm>({
    title: '',
    theme: '',
    description: '',
    start_date: '',
    end_date: '',
    prize_pool: 1000,
    max_submissions: 100,
    rules: ''
  })
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [isAdmin, setIsAdmin] = useState<{
    canCreateContests: boolean;
    canManagePayouts: boolean;
    canManagePlatform: boolean;
  }>({
    canCreateContests: false,
    canManagePayouts: false,
    canManagePlatform: false
  })
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Initialize Supabase client
    const client = createClient()
    setSupabase(client)
  }, [])

  useEffect(() => {
    if (!supabase) return

    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        // Check if user is admin (you can modify this logic based on your admin system)
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()
        
        // Controlled admin access - anyone can create contests
        const canCreateContests = true
        const canManagePayouts = profile?.is_admin || (user.email && user.email.endsWith('@creativechallenge.app'))
        const canManagePlatform = profile?.is_admin || (user.email && user.email.endsWith('@creativechallenge.app'))
        
        setIsAdmin({
          canCreateContests,
          canManagePayouts,
          canManagePlatform
        })
      }
    }
    
    checkAdmin()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!supabase) return

    try {
      const { error } = await supabase
        .from('contests')
        .insert([{
          ...form,
          created_by: user?.id,
          status: 'active'
        }])

      if (error) throw error

      alert('Contest created successfully!')
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error creating contest:', error)
      alert('Failed to create contest. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please sign in to access this page</h1>
          <Link href="/login" className="text-blue-400 hover:text-blue-300">Sign In</Link>
        </div>
      </div>
    )
  }

  if (!isAdmin.canCreateContests) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/60 mb-4">You don&apos;t have permission to access this page.</p>
          <Link href="/authenticated-home" className="text-blue-400 hover:text-blue-300">Return to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/admin/dashboard" className="text-white/60 hover:text-white mb-4 inline-block">
            ← Back to Admin Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Create New Contest</h1>
          <p className="text-white/60">Set up a new creative competition for the community</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Contest Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Digital Art Showdown"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Theme</label>
                <input
                  type="text"
                  value={form.theme}
                  onChange={(e) => setForm({...form, theme: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Fantasy & Magic"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the contest theme, requirements, and what you're looking for..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Start Date</label>
                <input
                  type="datetime-local"
                  value={form.start_date}
                  onChange={(e) => setForm({...form, start_date: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">End Date</label>
                <input
                  type="datetime-local"
                  value={form.end_date}
                  onChange={(e) => setForm({...form, end_date: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Prize Pool ($)</label>
                <input
                  type="number"
                  value={form.prize_pool}
                  onChange={(e) => setForm({...form, prize_pool: Number(e.target.value)})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="100"
                  step="100"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Max Submissions</label>
                <input
                  type="number"
                  value={form.max_submissions}
                  onChange={(e) => setForm({...form, max_submissions: Number(e.target.value)})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="10"
                  max="1000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Contest Rules</label>
              <textarea
                value={form.rules}
                onChange={(e) => setForm({...form, rules: e.target.value})}
                rows={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List the contest rules, submission guidelines, and judging criteria..."
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/dashboard"
                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Contest'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
