'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import PayoutAccountSetup from '@/components/payout/PayoutAccountSetup'
import NavigationHeader from '@/components/navigation/NavigationHeader'
import type { SupabaseClient } from '@/types/supabase'

interface UserPayout {
  id: string
  contest_id: string
  submission_id: string
  position: number
  prize_amount: number
  net_amount: number
  payout_status: 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled'
  payout_method: 'chime' | 'paypal' | 'stripe' | 'manual'
  payout_date?: string
  failure_reason?: string
  created_at: string
  contest_title?: string
}

interface PayoutNotification {
  id: string
  contest_id: string
  payout_id: string
  notification_type: string
  title: string
  message: string
  read_at?: string
  created_at: string
}

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<UserPayout[]>([])
  const [notifications, setNotifications] = useState<PayoutNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'payouts' | 'accounts' | 'notifications'>('payouts')
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  const fetchPayouts = useCallback(async (userId: string) => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('contest_payouts')
        .select(`
          *,
          contests(title)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedPayouts = data?.map(payout => ({
        ...payout,
        contest_title: payout.contests?.title
      })) || []

      setPayouts(formattedPayouts)
    } catch (err) {
      console.error('Error fetching payouts:', err)
    }
  }, [supabase])

  const fetchNotifications = useCallback(async (userId: string) => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('payout_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotifications(data || [])
    } catch (err) {
      console.error('Error fetching notifications:', err)
    }
  }, [supabase])

  useEffect(() => {
    // Initialize Supabase client
    const client = createClient()
    setSupabase(client)
  }, [])

  useEffect(() => {
    if (!supabase) return

    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        await Promise.all([
          fetchPayouts(user.id),
          fetchNotifications(user.id)
        ])
      }
      setLoading(false)
    }
    
    fetchData()
  }, [supabase, fetchPayouts, fetchNotifications])

  const markNotificationAsRead = async (notificationId: string) => {
    if (!supabase) return
    try {
      const { error } = await supabase
        .from('payout_notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId)

      if (error) throw error
      fetchNotifications(user?.id || '')
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400'
      case 'processing': return 'text-blue-400'
      case 'paid': return 'text-green-400'
      case 'failed': return 'text-red-400'
      default: return 'text-white/60'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'processing': return '🔄'
      case 'paid': return '✅'
      case 'failed': return '❌'
      default: return '❓'
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'chime': return '🏦'
      case 'paypal': return '💙'
      case 'stripe': return '💳'
      default: return '💰'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
          <p className="text-white/70">You need to be signed in to view your payouts.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <NavigationHeader />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            💰 My Payouts
          </h1>
          <p className="text-white/70">
            Track your contest winnings and manage payout accounts
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-2xl font-bold text-green-400 mb-1">
              ${payouts.filter(p => p.payout_status === 'paid').reduce((sum, p) => sum + p.net_amount, 0).toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">Total Earned</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              ${payouts.filter(p => p.payout_status === 'pending').reduce((sum, p) => sum + p.net_amount, 0).toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">Pending</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {payouts.filter(p => p.payout_status === 'processing').length}
            </div>
            <div className="text-white/60 text-sm">Processing</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {notifications.filter(n => !n.read_at).length}
            </div>
            <div className="text-white/60 text-sm">Unread Notifications</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex gap-4 mb-6">
            {[
              { id: 'payouts', label: 'Payout History', icon: '💰' },
              { id: 'accounts', label: 'Payout Accounts', icon: '💳' },
              { id: 'notifications', label: 'Notifications', icon: '🔔' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'payouts' | 'accounts' | 'notifications')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Payout History Tab */}
          {activeTab === 'payouts' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Payout History</h2>
              
              {payouts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-xl font-bold text-white mb-2">No Payouts Yet</h3>
                  <p className="text-white/70">Win a contest to see your payouts here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payouts.map((payout) => (
                    <div key={payout.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{payout.contest_title}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-2xl">
                              {payout.position === 1 ? '🥇' : payout.position === 2 ? '🥈' : '🥉'}
                            </span>
                            <span className="text-white/60">
                              {payout.position === 1 ? '1st Place' : 
                               payout.position === 2 ? '2nd Place' : '3rd Place'}
                            </span>
                            <span className="text-white/60">•</span>
                            <span className="text-white/60">
                              {new Date(payout.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">
                            ${payout.net_amount.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span>{getStatusIcon(payout.payout_status)}</span>
                            <span className={`text-sm font-medium ${getStatusColor(payout.payout_status)}`}>
                              {payout.payout_status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getMethodIcon(payout.payout_method)}</span>
                          <span className="text-white/70 capitalize">{payout.payout_method}</span>
                        </div>
                        
                        {payout.payout_date && (
                          <div className="text-white/60 text-sm">
                            Paid: {new Date(payout.payout_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      {payout.failure_reason && (
                        <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                          <p className="text-red-300 text-sm">
                            <strong>Failure Reason:</strong> {payout.failure_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Payout Accounts Tab */}
          {activeTab === 'accounts' && (
            <div>
              <PayoutAccountSetup userId={user.id} onAccountAdded={() => fetchPayouts(user.id)} />
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Payout Notifications</h2>
              
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔔</div>
                  <h3 className="text-xl font-bold text-white mb-2">No Notifications</h3>
                  <p className="text-white/70">You&apos;ll receive notifications about your payouts here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`bg-white/5 rounded-lg p-4 border border-white/10 cursor-pointer transition-all ${
                        !notification.read_at ? 'bg-blue-500/10 border-blue-500/30' : ''
                      }`}
                      onClick={() => !notification.read_at && markNotificationAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{notification.title}</h3>
                          <p className="text-white/70 text-sm mb-2">{notification.message}</p>
                          <div className="text-white/50 text-xs">
                            {new Date(notification.created_at).toLocaleString()}
                          </div>
                        </div>
                        {!notification.read_at && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full ml-4 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
