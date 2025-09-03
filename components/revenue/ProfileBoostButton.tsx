'use client'

// import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

interface ProfileBoostButtonProps {
  userId: string
  isBoosted?: boolean
}

export default function ProfileBoostButton({ 
  userId, 
  isBoosted = false
}: ProfileBoostButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(24)
  // const supabase = createClient()

  const boostOptions = [
    { hours: 12, price: 2.00, label: '12 Hours', description: 'Quick boost for immediate visibility' },
    { hours: 24, price: 3.00, label: '24 Hours', description: 'Full day of featured placement' },
    { hours: 48, price: 5.00, label: '48 Hours', description: 'Extended visibility for maximum impact' }
  ]

  const handleProfileBoost = async () => {
    setLoading(true)
    try {
      const selectedOption = boostOptions.find(opt => opt.hours === selectedDuration)
      if (!selectedOption) return

      // Create Stripe checkout session for profile boost
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'profile_boost',
          userId,
          duration: selectedDuration,
          amount: selectedOption.price * 100, // Convert to cents
          successUrl: `${window.location.origin}/authenticated-home?boosted=true`,
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating boost payment:', error)
      alert('Failed to process boost payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (isBoosted) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
        <span className="text-sm">🌟</span>
        <span className="text-sm font-medium">Profile Boosted</span>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={loading}
        className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50"
      >
        <span className="text-sm">🌟</span>
        <span className="text-sm font-medium">
          {loading ? 'Processing...' : 'Boost Profile'}
        </span>
      </button>

      {/* Boost Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Boost Your Profile</h3>
              <p className="text-gray-600 mb-6">
                Get featured placement in the artist directory and increase your visibility!
              </p>
              
              <div className="space-y-3 mb-6">
                {boostOptions.map((option) => (
                  <div
                    key={option.hours}
                    onClick={() => setSelectedDuration(option.hours)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedDuration === option.hours
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-left">
                        <div className="font-bold text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-purple-600">${option.price.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                          ${(option.price * 0.8).toFixed(2)} to prize pool
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6 border border-purple-200">
                <div className="text-sm text-purple-700">
                  <strong>Boost Benefits:</strong><br/>
                  • Featured in artist directory<br/>
                  • Priority placement in galleries<br/>
                  • &quot;Boosted&quot; badge on profile<br/>
                  • Increased visibility to voters
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfileBoost}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : `Boost $${boostOptions.find(opt => opt.hours === selectedDuration)?.price.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
