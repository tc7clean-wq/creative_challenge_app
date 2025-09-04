'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface TipButtonProps {
  artworkId: string
  artistId: string
  artistName: string
  artworkTitle: string
  currentTips?: number
}

export default function TipButton({ artworkId, artistId, artistName, artworkTitle, currentTips = 0 }: TipButtonProps) {
  const [showTipModal, setShowTipModal] = useState(false)
  const [tipAmount, setTipAmount] = useState(5)
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const tipAmounts = [1, 5, 10, 25, 50, 100]

  const handleTip = async () => {
    if (loading) return

    const amount = customAmount ? parseFloat(customAmount) : tipAmount
    if (amount < 1) {
      alert('Minimum tip amount is $1')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Please sign in to send tips')
        return
      }

      // Create tip record
      const { error: tipError } = await supabase
        .from('tips')
        .insert({
          artwork_id: artworkId,
          artist_id: artistId,
          tipper_id: user.id,
          amount: amount,
          message: message.trim() || null,
          status: 'pending'
        })

      if (tipError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error creating tip:', tipError)
        }
        alert('Failed to send tip. Please try again.')
        return
      }

      // For now, we'll simulate a successful tip
      // In production, you'd integrate with Stripe or crypto payment
      alert(`Your appreciation of $${amount} has been sent to ${artistName}! 🎉 They'll love hearing what you think of their work!`)
      
      setShowTipModal(false)
      setMessage('')
      setCustomAmount('')
      setTipAmount(5)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error sending tip:', error)
      }
      alert('Failed to send tip. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowTipModal(true)}
        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
      >
        💝 Love This Art?
        {currentTips > 0 && (
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
            ${currentTips}
          </span>
        )}
      </button>

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-2">💝 Show Your Appreciation</h3>
            <p className="text-white/80 mb-6">Love &quot;{artworkTitle}&quot; by {artistName}? Consider a tip to support the artist!</p>
            
            <div className="space-y-6">
              {/* Tip Amount Selection */}
              <div>
                <label className="block text-white font-semibold mb-3">Select Tip Amount</label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {tipAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setTipAmount(amount)
                        setCustomAmount('')
                      }}
                      className={`py-2 px-4 rounded-lg font-semibold transition-all ${
                        tipAmount === amount && !customAmount
                          ? 'bg-yellow-500 text-black'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Or enter custom amount</label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      if (e.target.value) setTipAmount(0)
                    }}
                    placeholder="Enter amount"
                    min="1"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-white font-semibold mb-2">Tell the artist what you love about their work</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="This artwork is amazing because... I love how you... The colors are..."
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-yellow-500 h-20 resize-none"
                  maxLength={200}
                />
                <p className="text-white/60 text-sm mt-1">{message.length}/200 characters</p>
              </div>

              {/* Total */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total Tip:</span>
                  <span className="text-yellow-400 font-bold text-xl">
                    ${customAmount ? parseFloat(customAmount) || 0 : tipAmount}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleTip}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : '💝 Show Appreciation'}
                </button>
                <button
                  onClick={() => {
                    setShowTipModal(false)
                    setMessage('')
                    setCustomAmount('')
                    setTipAmount(5)
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
