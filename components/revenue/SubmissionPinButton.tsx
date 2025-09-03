'use client'

// import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

interface SubmissionPinButtonProps {
  submissionId: string
  contestId: string
  isPinned?: boolean
}

export default function SubmissionPinButton({ 
  submissionId, 
  contestId, 
  isPinned = false
}: SubmissionPinButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  // const supabase = createClient()

  const handlePinSubmission = async () => {
    setLoading(true)
    try {
      // Create Stripe checkout session for pin
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'submission_pin',
          submissionId,
          contestId,
          amount: 300, // $3.00 in cents
          successUrl: `${window.location.origin}/submit/success?type=pin&submissionId=${submissionId}`,
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating pin payment:', error)
      alert('Failed to process pin payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (isPinned) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg">
        <span className="text-sm">📌</span>
        <span className="text-sm font-medium">Pinned to Top</span>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={loading}
        className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
      >
        <span className="text-sm">📌</span>
        <span className="text-sm font-medium">
          {loading ? 'Processing...' : 'Pin to Top'}
        </span>
      </button>

      {/* Pin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">📌</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pin Your Submission</h3>
              <p className="text-gray-600 mb-6">
                Pin your submission to the top of the gallery for 6 hours to get maximum visibility!
              </p>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6 border border-yellow-200">
                <div className="text-3xl font-bold text-yellow-600 mb-1">$3.00</div>
                <div className="text-sm text-yellow-700">
                  • 6 hours at the top<br/>
                  • Maximum visibility<br/>
                  • $2.40 goes to prize pool
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
                  onClick={handlePinSubmission}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Pin for $3'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
