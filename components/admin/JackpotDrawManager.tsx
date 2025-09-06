'use client'

import { useState, useEffect } from 'react'

interface JackpotDraw {
  draw_id: string
  draw_name: string
  prize_amount: number
  start_date: string
  end_date: string
  is_active: boolean
  winner_user_id?: string
  draw_date?: string
  profiles?: {
    username: string
    display_name: string
  }
}

export default function JackpotDrawManager() {
  const [draws, setDraws] = useState<JackpotDraw[]>([])
  const [loading, setLoading] = useState(true)
  const [drawing, setDrawing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  // const supabase = createClient() // Not used in this component

  useEffect(() => {
    fetchDraws()
  }, [])

  const fetchDraws = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/jackpot/draw-winner')
      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setDraws(data.draws || [])
      }
    } catch (error) {
      console.error('Error fetching draws:', error)
      setError('Failed to fetch draws')
    } finally {
      setLoading(false)
    }
  }

  const drawWinner = async (drawId: string) => {
    if (!confirm('Are you sure you want to draw the winner for this jackpot? This action cannot be undone.')) {
      return
    }

    try {
      setDrawing(drawId)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/admin/jackpot/draw-winner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ drawId })
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setSuccess(`Winner selected: ${data.data.winner.display_name || data.data.winner.username}`)
        fetchDraws() // Refresh the list
      }
    } catch (error) {
      console.error('Error drawing winner:', error)
      setError('Failed to draw winner')
    } finally {
      setDrawing(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
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

  const canDraw = (draw: JackpotDraw) => {
    const now = new Date()
    const endDate = new Date(draw.end_date)
    return draw.is_active && endDate <= now && !draw.winner_user_id
  }

  if (loading) {
    return (
      <div className="quantum-glass p-6 rounded-2xl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="quantum-glass p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">🎰 Jackpot Draw Management</h2>
        <p className="text-gray-300">Manage jackpot draws and select winners</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
          <p className="text-green-300">{success}</p>
        </div>
      )}

      {/* Draws List */}
      <div className="space-y-4">
        {draws.length === 0 ? (
          <div className="quantum-glass p-8 rounded-2xl text-center">
            <div className="text-6xl mb-4">🎰</div>
            <h3 className="text-xl font-bold text-white mb-2">No Jackpot Draws</h3>
            <p className="text-gray-300">Create a jackpot draw to get started</p>
          </div>
        ) : (
          draws.map((draw) => (
            <div key={draw.draw_id} className="quantum-glass p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {draw.draw_name}
                  </h3>
                  <div className="text-2xl font-bold text-cyan-400 mb-2">
                    {formatCurrency(draw.prize_amount)}
                  </div>
                  <div className="text-sm text-gray-300">
                    {formatDate(draw.start_date)} - {formatDate(draw.end_date)}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    draw.is_active 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-gray-500/20 text-gray-300'
                  }`}>
                    {draw.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>

              {/* Winner Info */}
              {draw.winner_user_id ? (
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🏆</span>
                    <span className="text-lg font-bold text-yellow-300">Winner Selected!</span>
                  </div>
                  <div className="text-white">
                    <strong>Winner:</strong> {draw.profiles?.display_name || draw.profiles?.username || 'Unknown'}
                  </div>
                  {draw.draw_date && (
                    <div className="text-gray-300 text-sm">
                      <strong>Drawn on:</strong> {formatDate(draw.draw_date)}
                    </div>
                  )}
                </div>
              ) : null}

              {/* Action Button */}
              <div className="flex gap-4">
                {canDraw(draw) ? (
                  <button
                    onClick={() => drawWinner(draw.draw_id)}
                    disabled={drawing === draw.draw_id}
                    className="quantum-button px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {drawing === draw.draw_id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>Drawing...</span>
                      </div>
                    ) : (
                      'Draw Winner'
                    )}
                  </button>
                ) : (
                  <div className="text-gray-400 text-sm">
                    {draw.winner_user_id 
                      ? 'Winner already selected'
                      : draw.is_active 
                        ? 'Draw not yet ended'
                        : 'Draw inactive'
                    }
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
