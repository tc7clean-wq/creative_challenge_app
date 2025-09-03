'use client'

// import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

interface VoteMultiplierButtonProps {
  submissionId: string
  contestId: string
}

export default function VoteMultiplierButton({ 
  submissionId, 
  contestId
}: VoteMultiplierButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedMultiplier, setSelectedMultiplier] = useState(2)
  // const supabase = createClient()

  const multiplierOptions = [
    { value: 2, price: 1.00, label: '2x Vote', description: 'Your vote counts as 2 votes' },
    { value: 3, price: 2.00, label: '3x Vote', description: 'Your vote counts as 3 votes' },
    { value: 5, price: 5.00, label: '5x Vote', description: 'Your vote counts as 5 votes' }
  ]

  const handleMultiplierVote = async () => {
    setLoading(true)
    try {
      const selectedOption = multiplierOptions.find(opt => opt.value === selectedMultiplier)
      if (!selectedOption) return

      // Create Stripe checkout session for vote multiplier
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'vote_multiplier',
          submissionId,
          contestId,
          multiplier: selectedMultiplier,
          amount: selectedOption.price * 100, // Convert to cents
          successUrl: `${window.location.origin}/submit/success?type=multiplier&submissionId=${submissionId}&multiplier=${selectedMultiplier}`,
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating multiplier payment:', error)
      alert('Failed to process multiplier payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={loading}
        className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50"
      >
        <span className="text-sm">⚡</span>
        <span className="text-sm font-medium">
          {loading ? 'Processing...' : 'Super Vote'}
        </span>
      </button>

      {/* Multiplier Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Super Vote</h3>
              <p className="text-gray-600 mb-6">
                Make your vote count more! Choose a multiplier to boost your voting power.
              </p>
              
              <div className="space-y-3 mb-6">
                {multiplierOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => setSelectedMultiplier(option.value)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedMultiplier === option.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-left">
                        <div className="font-bold text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">${option.price.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                          ${(option.price * 0.8).toFixed(2)} to prize pool
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMultiplierVote}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : `Super Vote $${multiplierOptions.find(opt => opt.value === selectedMultiplier)?.price.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
