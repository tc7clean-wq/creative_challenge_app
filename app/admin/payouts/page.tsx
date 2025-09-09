'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import SocialNavbar from '@/components/layout/SocialNavbar'
import Link from 'next/link'

interface Payout {
  id: string
  contest_id: string
  contest_name: string
  winner_id: string
  winner_name: string
  winner_username: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  processed_at?: string
  payment_method: string
  transaction_id?: string
}

interface AdminPermissions {
  canCreateContests: boolean
  canManagePayouts: boolean
  canManagePlatform: boolean
}

export default function AdminPayoutsPage() {
  const [user, setUser] = useState<unknown>(null)
  const [isAdmin, setIsAdmin] = useState<AdminPermissions>({
    canCreateContests: false,
    canManagePayouts: false,
    canManagePlatform: false
  })
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)

  const checkAdminAndFetchPayouts = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()

        const canCreateContests = profile?.is_admin || false
        const canManagePayouts = profile?.is_admin || false
        const canManagePlatform = profile?.is_admin || false

        setIsAdmin({
          canCreateContests,
          canManagePayouts,
          canManagePlatform
        })

        if (canManagePayouts) {
          fetchPayouts()
        }
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAdminAndFetchPayouts()
  }, [checkAdminAndFetchPayouts])

  const fetchPayouts = async () => {
    try {
      // Mock data - replace with actual query
      const mockPayouts: Payout[] = [
        {
          id: '1',
          contest_id: 'contest_1',
          contest_name: 'Cyberpunk Art Challenge',
          winner_id: 'user_1',
          winner_name: 'Alex Chen',
          winner_username: 'cyber_artist_1',
          amount: 5, // 5 entries for future money draw
          status: 'completed',
          created_at: '2024-01-15T10:30:00Z',
          processed_at: '2024-01-15T11:00:00Z',
          payment_method: 'entries',
          transaction_id: 'entry_001'
        },
        {
          id: '2',
          contest_id: 'contest_2',
          contest_name: 'Digital Dreams Contest',
          winner_id: 'user_2',
          winner_name: 'Maya Rodriguez',
          winner_username: 'neon_creator',
          amount: 5,
          status: 'pending',
          created_at: '2024-01-16T14:20:00Z',
          payment_method: 'entries'
        },
        {
          id: '3',
          contest_id: 'contest_3',
          contest_name: 'AI Art Showcase',
          winner_id: 'user_3',
          winner_name: 'Jordan Kim',
          winner_username: 'digital_dreamer',
          amount: 5,
          status: 'processing',
          created_at: '2024-01-17T09:15:00Z',
          payment_method: 'entries',
          transaction_id: 'entry_003'
        }
      ]

      setPayouts(mockPayouts)
    } catch (error) {
      console.error('Error fetching payouts:', error)
    }
  }

  const processPayout = async (payoutId: string) => {
    try {
      // Mock processing - replace with actual API call
      setPayouts(prev => prev.map(payout => 
        payout.id === payoutId 
          ? { ...payout, status: 'processing' as const }
          : payout
      ))
      
      // Simulate processing delay
      setTimeout(() => {
        setPayouts(prev => prev.map(payout => 
          payout.id === payoutId 
            ? { 
                ...payout, 
                status: 'completed' as const,
                processed_at: new Date().toISOString(),
                transaction_id: `entry_${payoutId}`
              }
            : payout
        ))
      }, 2000)
    } catch (error) {
      console.error('Error processing payout:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20'
      case 'processing': return 'text-yellow-400 bg-yellow-500/20'
      case 'pending': return 'text-blue-400 bg-blue-500/20'
      case 'failed': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅'
      case 'processing': return '⏳'
      case 'pending': return '⏸️'
      case 'failed': return '❌'
      default: return '❓'
    }
  }

  if (loading) {
    return (
      <div className="cyber-bg min-h-screen">
        <SocialNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-2xl text-cyan-300">Loading payouts...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="cyber-bg min-h-screen">
        <SocialNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold cyber-text mb-4" style={{ fontFamily: 'var(--font-header)' }}>
              Access Denied
            </h1>
            <p className="text-lg text-cyan-300 mb-6">Please log in to access the admin panel</p>
            <Link href="/auth" className="cyber-btn">Go to Login</Link>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin.canManagePayouts) {
    return (
      <div className="cyber-bg min-h-screen">
        <SocialNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold cyber-text mb-4" style={{ fontFamily: 'var(--font-header)' }}>
              Access Denied
            </h1>
            <p className="text-lg text-cyan-300 mb-6">You don&apos;t have permission to manage payouts</p>
            <Link href="tc7clean@gmail.com" className="cyber-btn">Back to Admin Panel</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cyber-bg min-h-screen">
      <SocialNavbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold cyber-text glitch mb-2" data-text="[PAYOUT MANAGEMENT]" style={{ fontFamily: 'var(--font-header)' }}>
            [PAYOUT MANAGEMENT]
          </h1>
          <p className="text-lg text-cyan-300 mb-6">{'// Manage contest winnings and entries'}</p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Payout Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="cyber-card p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                {payouts.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-white/60">Completed</div>
            </div>
            <div className="cyber-card p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {payouts.filter(p => p.status === 'processing').length}
              </div>
              <div className="text-white/60">Processing</div>
            </div>
            <div className="cyber-card p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {payouts.filter(p => p.status === 'pending').length}
              </div>
              <div className="text-white/60">Pending</div>
            </div>
            <div className="cyber-card p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {payouts.length * 5}
              </div>
              <div className="text-white/60">Total Entries</div>
            </div>
          </div>

          {/* Payouts Table */}
          <div className="cyber-card p-6">
            <h2 className="text-2xl font-bold cyber-text mb-6" style={{ fontFamily: 'var(--font-header)' }}>
              Contest Winnings
            </h2>
            
            {payouts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-bold cyber-text mb-4" style={{ fontFamily: 'var(--font-header)' }}>
                  No Payouts Yet
                </h3>
                <p className="text-white/80 mb-6">Contest winners will appear here once contests are completed</p>
                <a href="mailto:tc7clean@gmail.com" className="cyber-btn">
                  Contact Admin
                </a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-cyan-300 font-medium">Contest</th>
                      <th className="text-left py-3 px-4 text-cyan-300 font-medium">Winner</th>
                      <th className="text-left py-3 px-4 text-cyan-300 font-medium">Prize</th>
                      <th className="text-left py-3 px-4 text-cyan-300 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-cyan-300 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-cyan-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-white">{payout.contest_name}</div>
                          <div className="text-sm text-white/60">ID: {payout.contest_id}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-white">{payout.winner_name}</div>
                          <div className="text-sm text-white/60">@{payout.winner_username}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-cyan-400">{payout.amount} Entries</div>
                          <div className="text-sm text-white/60">Future Money Draw</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payout.status)}`}>
                            {getStatusIcon(payout.status)} {payout.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white">{new Date(payout.created_at).toLocaleDateString()}</div>
                          {payout.processed_at && (
                            <div className="text-sm text-white/60">
                              Processed: {new Date(payout.processed_at).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {payout.status === 'pending' && (
                            <button
                              onClick={() => processPayout(payout.id)}
                              className="cyber-btn text-sm px-4 py-2"
                            >
                              Process
                            </button>
                          )}
                          {payout.status === 'completed' && (
                            <div className="text-green-400 text-sm">
                              ✅ Processed
                            </div>
                          )}
                          {payout.status === 'processing' && (
                            <div className="text-yellow-400 text-sm">
                              ⏳ Processing...
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Prize System Info */}
          <div className="mt-8 cyber-card p-6">
            <h3 className="text-xl font-bold cyber-text mb-4" style={{ fontFamily: 'var(--font-header)' }}>
              Prize System Information
            </h3>
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-200 text-sm mb-2">
                <strong>Current System:</strong> Each contest win awards 5 entries into our future money draw.
              </p>
              <p className="text-blue-200 text-sm mb-2">
                <strong>Entry Tracking:</strong> All entries are automatically tracked and stored in the system.
              </p>
              <p className="text-blue-200 text-sm">
                <strong>Future Draw:</strong> We will announce the money draw date and process all accumulated entries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}