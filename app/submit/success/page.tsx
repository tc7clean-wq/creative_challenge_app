'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SubmitSuccessPage() {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = '/gallery'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-6xl animate-bounce">
            🎉
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-5xl font-bold text-white mb-6" style={{
          fontFamily: 'var(--font-bebas-neue), "Arial Black", "Impact", sans-serif',
          background: 'linear-gradient(45deg, #00FF88, #00D4AA, #00BFFF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          ARTWORK SUBMITTED!
          </h1>

        <p className="text-xl text-white/80 mb-8 leading-relaxed">
          Your amazing AI artwork has been submitted successfully! 
          Our team will review it and it should appear in the gallery within 24 hours.
        </p>

        {/* What's Next */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">What happens next?</h2>
          <div className="space-y-3 text-white/80 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">1</div>
              <span>Our team reviews your submission (usually within 24 hours)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">2</div>
              <span>Once approved, your artwork appears in the gallery</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">3</div>
              <span>Users can vote for your artwork and share it on social media</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">4</div>
              <span>Compete for prizes and grow your following!</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/gallery"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105"
          >
            🎨 View Gallery
          </Link>
          <Link
            href="/submit"
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl text-lg border border-white/30 transition-all duration-300"
          >
            📤 Submit Another
          </Link>
        </div>

        {/* Auto Redirect */}
        <div className="text-white/60 text-sm">
          Redirecting to gallery in {countdown} seconds...
        </div>

        {/* Social Sharing */}
        <div className="mt-8">
          <p className="text-white/80 mb-4">Share the good news!</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                const text = "I just submitted my AI artwork to Creative Challenge! 🎨✨"
                const url = window.location.origin
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
                window.open(twitterUrl, '_blank')
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              🐦 Twitter
            </button>
            <button
              onClick={() => {
                const text = "I just submitted my AI artwork to Creative Challenge! 🎨✨"
                const url = window.location.origin
                const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
                window.open(facebookUrl, '_blank')
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              📘 Facebook
            </button>
            <button
              onClick={() => {
                const text = "I just submitted my AI artwork to Creative Challenge! 🎨✨"
                navigator.clipboard.writeText(text + ' ' + window.location.origin)
                alert('Copied to clipboard!')
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              📋 Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}