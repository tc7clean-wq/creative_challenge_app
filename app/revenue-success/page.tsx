'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function RevenueSuccessContent() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [transactionType, setTransactionType] = useState<string | null>(null)
  const [details, setDetails] = useState<Record<string, string>>({})

  useEffect(() => {
    const type = searchParams.get('type')
    const submissionId = searchParams.get('submissionId')
    const multiplier = searchParams.get('multiplier')
    const duration = searchParams.get('duration')

    setTransactionType(type)
    setDetails({
      submissionId: submissionId || '',
      multiplier: multiplier || '',
      duration: duration || ''
    })
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  const getSuccessContent = () => {
    switch (transactionType) {
      case 'pin':
        return {
          icon: '📌',
          title: 'Submission Pinned Successfully!',
          message: 'Your submission has been pinned to the top of the gallery for 6 hours!',
          details: 'Maximum visibility achieved - your artwork will be seen by everyone first!',
          buttonText: 'View Gallery',
          buttonLink: '/authenticated-home'
        }
      case 'multiplier':
        return {
          icon: '⚡',
          title: 'Super Vote Activated!',
          message: `Your vote now counts as ${details.multiplier}x votes!`,
          details: 'Your enhanced voting power is ready to use on any submission.',
          buttonText: 'Start Voting',
          buttonLink: '/authenticated-home'
        }
      case 'boost':
        return {
          icon: '🌟',
          title: 'Profile Boosted!',
          message: `Your profile is now featured for ${details.duration} hours!`,
          details: 'Enhanced visibility in the artist directory and priority placement.',
          buttonText: 'View Profile',
          buttonLink: '/authenticated-home'
        }
      default:
        return {
          icon: '🎉',
          title: 'Payment Successful!',
          message: 'Your transaction has been processed successfully!',
          details: 'Thank you for supporting the creative community!',
          buttonText: 'Continue',
          buttonLink: '/authenticated-home'
        }
    }
  }

  const content = getSuccessContent()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
          <div className="text-6xl mb-6">{content.icon}</div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            {content.title}
          </h1>
          
          <p className="text-white/80 mb-6 text-lg">
            {content.message}
          </p>
          
          <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
            <p className="text-white/60 text-sm">
              {content.details}
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 mb-6 border border-green-500/30">
            <p className="text-green-200 text-sm">
              <strong>💰 Prize Pool Impact:</strong><br/>
              Your purchase has contributed to the growing prize pool, helping artists win more money!
            </p>
          </div>

          <Link
            href={content.buttonLink}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            {content.buttonText}
          </Link>

          <div className="mt-6 text-center">
            <Link
              href="/admin/dashboard"
              className="text-white/60 hover:text-white text-sm underline"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RevenueSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    }>
      <RevenueSuccessContent />
    </Suspense>
  )
}
