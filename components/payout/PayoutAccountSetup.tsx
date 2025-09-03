'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { SupabaseClient } from '@/types/supabase'

interface PayoutAccount {
  id: string
  payout_method: 'chime' | 'paypal' | 'stripe'
  chime_username?: string
  paypal_email?: string
  stripe_account_id?: string
  account_verified: boolean
  preferred_method: 'chime' | 'paypal' | 'stripe'
}

interface PayoutAccountSetupProps {
  userId: string
  onAccountAdded?: () => void
}

export default function PayoutAccountSetup({ userId, onAccountAdded }: PayoutAccountSetupProps) {
  const [accounts, setAccounts] = useState<PayoutAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    payout_method: 'chime' as 'chime' | 'paypal' | 'stripe',
    chime_username: '',
    paypal_email: '',
    stripe_account_id: '',
    preferred_method: 'chime' as 'chime' | 'paypal' | 'stripe'
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  const fetchAccounts = useCallback(async () => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('artist_accounts')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error
      setAccounts(data || [])
    } catch (err) {
      console.error('Error fetching accounts:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, userId])

  useEffect(() => {
    // Initialize Supabase client
    const client = createClient()
    setSupabase(client)
  }, [])

  useEffect(() => {
    if (supabase) {
      fetchAccounts()
    }
  }, [supabase, fetchAccounts])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!supabase) return

    try {
      // Validate form data
      if (formData.payout_method === 'chime' && !formData.chime_username.trim()) {
        throw new Error('Chime username is required')
      }
      if (formData.payout_method === 'paypal' && !formData.paypal_email.trim()) {
        throw new Error('PayPal email is required')
      }
      if (formData.payout_method === 'stripe' && !formData.stripe_account_id.trim()) {
        throw new Error('Stripe account ID is required')
      }

      const { error } = await supabase
        .from('artist_accounts')
        .upsert([{
          user_id: userId,
          payout_method: formData.payout_method,
          chime_username: formData.payout_method === 'chime' ? formData.chime_username : null,
          paypal_email: formData.payout_method === 'paypal' ? formData.paypal_email : null,
          stripe_account_id: formData.payout_method === 'stripe' ? formData.stripe_account_id : null,
          preferred_method: formData.preferred_method,
          account_verified: false
        }])

      if (error) throw error

      // Reset form
      setFormData({
        payout_method: 'chime',
        chime_username: '',
        paypal_email: '',
        stripe_account_id: '',
        preferred_method: 'chime'
      })
      setShowForm(false)
      fetchAccounts()
      onAccountAdded?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add payout account')
    } finally {
      setSubmitting(false)
    }
  }

  const removeAccount = async (accountId: string) => {
    if (!supabase) return
    try {
      const { error } = await supabase
        .from('artist_accounts')
        .delete()
        .eq('id', accountId)

      if (error) throw error
      fetchAccounts()
    } catch (err) {
      console.error('Error removing account:', err)
    }
  }

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="h-4 bg-white/20 rounded mb-2"></div>
          <div className="h-4 bg-white/20 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">
        💳 Payout Accounts
      </h3>
      
      <p className="text-white/70 mb-6">
        Set up your payout accounts to receive contest winnings quickly and securely.
      </p>

      {/* Existing Accounts */}
      {accounts.length > 0 && (
        <div className="space-y-3 mb-6">
          {accounts.map((account) => (
            <div key={account.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {account.payout_method === 'chime' ? '🏦' : 
                       account.payout_method === 'paypal' ? '💙' : '💳'}
                    </span>
                    <span className="font-semibold text-white capitalize">
                      {account.payout_method}
                    </span>
                    {account.preferred_method === account.payout_method && (
                      <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                        Preferred
                      </span>
                    )}
                  </div>
                  <div className="text-white/60 text-sm mt-1">
                    {account.payout_method === 'chime' 
                      ? `@${account.chime_username}`
                      : account.payout_method === 'paypal'
                      ? account.paypal_email
                      : account.stripe_account_id
                    }
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    Status: {account.account_verified ? '✅ Verified' : '⏳ Pending Verification'}
                  </div>
                </div>
                <button
                  onClick={() => removeAccount(account.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Account Form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300"
        >
          + Add Payout Account
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Payout Method
            </label>
            <select
              value={formData.payout_method}
              onChange={(e) => setFormData({ ...formData, payout_method: e.target.value as 'chime' | 'paypal' | 'stripe' })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40"
            >
              <option value="chime">🏦 Chime</option>
              <option value="paypal">💙 PayPal</option>
              <option value="stripe">💳 Stripe</option>
            </select>
          </div>

          {formData.payout_method === 'chime' ? (
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Chime Username
              </label>
              <input
                type="text"
                value={formData.chime_username}
                onChange={(e) => setFormData({ ...formData, chime_username: e.target.value })}
                placeholder="@your_chime_username"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                required
              />
              <p className="text-white/60 text-xs mt-1">
                Enter your Chime username (without the @ symbol)
              </p>
            </div>
          ) : formData.payout_method === 'paypal' ? (
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                PayPal Email
              </label>
              <input
                type="email"
                value={formData.paypal_email}
                onChange={(e) => setFormData({ ...formData, paypal_email: e.target.value })}
                placeholder="your-email@example.com"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Stripe Account ID
              </label>
              <input
                type="text"
                value={formData.stripe_account_id}
                onChange={(e) => setFormData({ ...formData, stripe_account_id: e.target.value })}
                placeholder="acct_1234567890abcdef"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                required
              />
              <p className="text-white/60 text-xs mt-1">
                Your Stripe account ID (starts with &quot;acct_&quot;)
              </p>
            </div>
          )}

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Preferred Method
            </label>
            <select
              value={formData.preferred_method}
              onChange={(e) => setFormData({ ...formData, preferred_method: e.target.value as 'chime' | 'paypal' | 'stripe' })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40"
            >
              <option value="chime">🏦 Chime (Faster)</option>
              <option value="paypal">💙 PayPal</option>
              <option value="stripe">💳 Stripe</option>
            </select>
            <p className="text-white/60 text-xs mt-1">
              We&apos;ll use this method first for payouts
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Account'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-300 font-semibold mb-2">💡 Payout Information</h4>
        <ul className="text-blue-200 text-sm space-y-1">
          <li>• <strong>Chime:</strong> Instant transfers, no fees</li>
          <li>• <strong>PayPal:</strong> 1-3 business days, small fee</li>
          <li>• <strong>Stripe:</strong> 2-7 business days, small fee</li>
          <li>• Payouts processed within 24 hours of contest completion</li>
          <li>• Minimum payout: $5.00</li>
        </ul>
      </div>
    </div>
  )
}
