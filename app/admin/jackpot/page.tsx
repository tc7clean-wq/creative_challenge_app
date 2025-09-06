'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import AdminNavbar from '@/components/layout/AdminNavbar'
import AdminGuard from '@/components/auth/AdminGuard'

interface JackpotDraw {
  draw_id: string
  draw_name: string
  prize_amount: number
  start_date: string
  end_date: string
  winner_user_id: string | null
  is_active: boolean
  draw_date: string | null
}

export default function JackpotControlPage() {
  const [draws, setDraws] = useState<JackpotDraw[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDraws = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('jackpot_draws')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching draws:', error)
        setError('Failed to fetch jackpot draws')
        return
      }

      setDraws(data || [])
    } catch (err) {
      console.error('Error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const selectWinner = async (drawId: string) => {
    try {
      const response = await fetch('/api/admin/jackpot/draw-winner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ drawId })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Error selecting winner:', data.error)
        setError(data.error || 'Failed to select winner')
        return
      }

      // Refresh draws
      fetchDraws()
      alert(`Winner selected: ${data.winner?.username || 'Unknown'}`)
    } catch (err) {
      console.error('Error:', err)
      setError('An unexpected error occurred')
    }
  }

  useEffect(() => {
    fetchDraws()
  }, [fetchDraws])

  const isDrawActive = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    return now >= start && now <= end
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading jackpot controls...</div>
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
            Jackpot Control Center
          </h1>
          <p className="text-lg text-white/80 mb-6">Manage jackpot draws and select winners</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Jackpot Draws */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Active Jackpot Draws</h2>
            </div>

            <div className="divide-y divide-white/10">
              {draws.map((draw) => (
                <div key={draw.draw_id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-xl font-bold text-white">{draw.draw_name}</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isDrawActive(draw.start_date, draw.end_date)
                            ? 'bg-green-500/20 text-green-300'
                            : draw.winner_user_id
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-gray-500/20 text-gray-300'
                        }`}>
                          {isDrawActive(draw.start_date, draw.end_date)
                            ? 'Active'
                            : draw.winner_user_id
                            ? 'Completed'
                            : 'Ended'}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-white/60 text-sm">Prize Amount</span>
                          <div className="text-yellow-400 font-bold text-xl">
                            ${draw.prize_amount.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-white/60 text-sm">Start Date</span>
                          <div className="text-white font-medium">
                            {new Date(draw.start_date).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-white/60 text-sm">End Date</span>
                          <div className="text-white font-medium">
                            {new Date(draw.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {draw.winner_user_id && (
                        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
                          <div className="text-green-300 font-medium">Winner Selected!</div>
                          <div className="text-white text-sm">
                            Winner ID: {draw.winner_user_id}
                          </div>
                          {draw.draw_date && (
                            <div className="text-white/60 text-xs">
                              Selected on: {new Date(draw.draw_date).toLocaleString()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="ml-6">
                      {!draw.winner_user_id && !isDrawActive(draw.start_date, draw.end_date) && (
                        <button
                          onClick={() => selectWinner(draw.draw_id)}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-3 rounded-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105"
                        >
                          🎰 Select Winner
                        </button>
                      )}
                      {isDrawActive(draw.start_date, draw.end_date) && (
                        <div className="text-center">
                          <div className="text-white/60 text-sm mb-2">Draw Active</div>
                          <div className="text-green-400 font-medium">
                            {Math.ceil((new Date(draw.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {draws.length === 0 && (
              <div className="p-12 text-center">
                <div className="text-gray-400 text-lg">No jackpot draws found</div>
                <div className="text-gray-500 text-sm mt-2">Create a new draw to get started</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </AdminGuard>
  )
}