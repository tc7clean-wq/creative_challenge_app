'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import NavigationHeader from '@/components/navigation/NavigationHeader'
import type { SupabaseClient } from '@/types/supabase'

interface ContestPayout {
  id: string
  contest_id: string
  user_id: string
  submission_id: string
  position: number
  prize_amount: number
  platform_fee: number
  net_amount: number
  payout_status: 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled'
  payout_method: 'chime' | 'paypal' | 'stripe' | 'manual'
  payout_date?: string
  failure_reason?: string
  created_at: string
  contest_title?: string
  user_email?: string
  chime_username?: string
  paypal_email?: string
  stripe_account_id?: string
}

interface PayoutBatch {
  id: string
  contest_id: string
  batch_name: string
  total_amount: number
  total_payouts: number
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'partial'
  processed_at?: string
  created_at: string
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<ContestPayout[]>([])
  const [batches, setBatches] = useState<PayoutBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([])
  const [processing, setProcessing] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'paid' | 'failed'>('all')
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

  const fetchPayouts = useCallback(async () => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('contest_payouts')
        .select(`
          *,
          contests(title),
          profiles(email),
          artist_accounts(chime_username, paypal_email, stripe_account_id)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedPayouts = data?.map(payout => ({
        ...payout,
        contest_title: payout.contests?.title,
        user_email: payout.profiles?.email,
        chime_username: payout.artist_accounts?.chime_username,
        paypal_email: payout.artist_accounts?.paypal_email,
        stripe_account_id: payout.artist_accounts?.stripe_account_id
      })) || []

      setPayouts(formattedPayouts)
    } catch (err) {
      console.error('Error fetching payouts:', err)
    }
  }, [supabase])

  const fetchBatches = useCallback(async () => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('payout_batches')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBatches(data || [])
    } catch (err) {
      console.error('Error fetching batches:', err)
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
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()
        
        // Controlled admin access - only authorized users can manage payouts
        const canCreateContests = true
        const canManagePayouts = profile?.is_admin || (user.email && user.email.endsWith('@creativechallenge.app'))
        const canManagePlatform = profile?.is_admin || (user.email && user.email.endsWith('@creativechallenge.app'))
        
        setIsAdmin({
          canCreateContests,
          canManagePayouts,
          canManagePlatform
        })

        if (canManagePayouts) {
          await fetchPayouts()
          await fetchBatches()
        }
      }
      setLoading(false)
    }
    
    fetchData()
  }, [supabase, fetchPayouts, fetchBatches])

  const handlePayoutStatusUpdate = async (payoutId: string, newStatus: string, failureReason?: string) => {
    if (!supabase) return
    try {
      const { error } = await supabase
        .from('contest_payouts')
        .update({
          payout_status: newStatus,
          payout_date: newStatus === 'paid' ? new Date().toISOString() : null,
          failure_reason: failureReason || null
        })
        .eq('id', payoutId)

      if (error) throw error
      fetchPayouts()
    } catch (err) {
      console.error('Error updating payout status:', err)
    }
  }

  const createPayoutBatch = async () => {
    if (selectedPayouts.length === 0 || !supabase) return

    setProcessing(true)
    try {
      const selectedPayoutData = payouts.filter(p => selectedPayouts.includes(p.id))
      const totalAmount = selectedPayoutData.reduce((sum, p) => sum + p.net_amount, 0)
      
      const { error: batchError } = await supabase
        .from('payout_batches')
        .insert([{
          contest_id: selectedPayoutData[0]?.contest_id,
          batch_name: `Batch ${new Date().toISOString().split('T')[0]}`,
          total_amount: totalAmount,
          total_payouts: selectedPayouts.length,
          status: 'pending',
          created_by: user?.id
        }])
        .select()
        .single()

      if (batchError) throw batchError

      // Update selected payouts to processing
      const { error: updateError } = await supabase
        .from('contest_payouts')
        .update({ payout_status: 'processing' })
        .in('id', selectedPayouts)

      if (updateError) throw updateError

      setSelectedPayouts([])
      fetchPayouts()
      fetchBatches()
    } catch (err) {
      console.error('Error creating batch:', err)
    } finally {
      setProcessing(false)
    }
  }

  const filteredPayouts = payouts.filter(payout => {
    if (filter === 'all') return true
    return payout.payout_status === filter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!isAdmin.canManagePayouts) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/70">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <NavigationHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            💰 Payout Management
          </h1>
          <p className="text-white/70">
            Manage contest payouts and track payment status
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              ${payouts.filter(p => p.payout_status === 'pending').reduce((sum, p) => sum + p.net_amount, 0).toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">Pending Payouts</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              ${payouts.filter(p => p.payout_status === 'paid').reduce((sum, p) => sum + p.net_amount, 0).toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">Paid Out</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {payouts.filter(p => p.payout_status === 'pending').length}
            </div>
            <div className="text-white/60 text-sm">Pending Count</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {batches.length}
            </div>
            <div className="text-white/60 text-sm">Total Batches</div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              {(['all', 'pending', 'processing', 'paid', 'failed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === status
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            
            {selectedPayouts.length > 0 && (
              <button
                onClick={createPayoutBatch}
                disabled={processing}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
              >
                {processing ? 'Creating...' : `Create Batch (${selectedPayouts.length})`}
              </button>
            )}
          </div>
        </div>

        {/* Payouts Table */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Contest Payouts</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPayouts(filteredPayouts.filter(p => p.payout_status === 'pending').map(p => p.id))
                        } else {
                          setSelectedPayouts([])
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left py-3">Contest</th>
                  <th className="text-left py-3">Winner</th>
                  <th className="text-left py-3">Position</th>
                  <th className="text-left py-3">Amount</th>
                  <th className="text-left py-3">Method</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-white/10">
                    <td className="py-3">
                      {payout.payout_status === 'pending' && (
                        <input
                          type="checkbox"
                          checked={selectedPayouts.includes(payout.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPayouts([...selectedPayouts, payout.id])
                            } else {
                              setSelectedPayouts(selectedPayouts.filter(id => id !== payout.id))
                            }
                          }}
                          className="rounded"
                        />
                      )}
                    </td>
                    <td className="py-3">{payout.contest_title}</td>
                    <td className="py-3">{payout.user_email}</td>
                    <td className="py-3">
                      <span className="text-lg">
                        {payout.position === 1 ? '🥇' : payout.position === 2 ? '🥈' : '🥉'}
                      </span>
                      {payout.position}
                    </td>
                    <td className="py-3 font-bold text-green-400">
                      ${payout.net_amount.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {payout.payout_method === 'chime' ? '🏦' : 
                           payout.payout_method === 'paypal' ? '💙' : '💳'}
                        </span>
                        <span className="capitalize">{payout.payout_method}</span>
                      </div>
                      <div className="text-xs text-white/60">
                        {payout.payout_method === 'chime' && payout.chime_username && `@${payout.chime_username}`}
                        {payout.payout_method === 'paypal' && payout.paypal_email}
                        {payout.payout_method === 'stripe' && payout.stripe_account_id}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        payout.payout_status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                        payout.payout_status === 'processing' ? 'bg-blue-500/20 text-blue-300' :
                        payout.payout_status === 'paid' ? 'bg-green-500/20 text-green-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {payout.payout_status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        {payout.payout_status === 'pending' && (
                          <>
                            <button
                              onClick={() => handlePayoutStatusUpdate(payout.id, 'processing')}
                              className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                              Process
                            </button>
                            <button
                              onClick={() => handlePayoutStatusUpdate(payout.id, 'paid')}
                              className="text-green-400 hover:text-green-300 text-sm"
                            >
                              Mark Paid
                            </button>
                          </>
                        )}
                        {payout.payout_status === 'processing' && (
                          <button
                            onClick={() => handlePayoutStatusUpdate(payout.id, 'paid')}
                            className="text-green-400 hover:text-green-300 text-sm"
                          >
                            Mark Paid
                          </button>
                        )}
                        {payout.payout_status === 'failed' && (
                          <button
                            onClick={() => handlePayoutStatusUpdate(payout.id, 'pending')}
                            className="text-yellow-400 hover:text-yellow-300 text-sm"
                          >
                            Retry
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Batches */}
        {batches.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Payout Batches</h2>
            
            <div className="space-y-4">
              {batches.slice(0, 5).map((batch) => (
                <div key={batch.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-white">{batch.batch_name}</h3>
                      <p className="text-white/60 text-sm">
                        {batch.total_payouts} payouts • ${batch.total_amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        batch.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                        batch.status === 'processing' ? 'bg-blue-500/20 text-blue-300' :
                        batch.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {batch.status}
                      </span>
                      <div className="text-white/60 text-xs mt-1">
                        {new Date(batch.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
