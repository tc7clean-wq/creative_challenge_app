'use client'

import { useState } from 'react'

interface SocialShareProps {
  url?: string
  title?: string
  description?: string
  className?: string
}

export default function SocialShare({ 
  url = 'https://creative-challenge-dkqfvx5ce-tc7cleans-projects.vercel.app',
  title = 'Creative Challenge App - Showcase Your AI Art!',
  description = 'Join the ultimate creative competition platform where artists showcase their AI-generated art, compete for prizes, and build their portfolio.',
  className = ''
}: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const shareToTwitter = () => {
    const text = `🎨 Check out Creative Challenge App! Showcase your AI-generated art and compete for prizes! ${url}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
  }

  const shareToInstagram = () => {
    // Instagram doesn't support direct sharing, so we'll copy the link
    handleCopyLink()
  }

  const shareToReddit = () => {
    const text = `${title} - ${description}`
    window.open(`https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank')
  }

  const shareToDiscord = () => {
    handleCopyLink()
  }

  const shareToTikTok = () => {
    handleCopyLink()
  }

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
  }

  const shareToPinterest = () => {
    window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(description)}`, '_blank')
  }

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 ${className}`}>
      <h3 className="text-xl font-bold text-white mb-4">
        📢 Share Creative Challenge
      </h3>
      
      <p className="text-white/70 mb-6">
        Help us grow the community! Share with your friends and fellow artists.
      </p>

      {/* Social Media Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <button
          onClick={shareToTwitter}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          <span className="text-lg">🐦</span>
          <span className="hidden sm:inline">Twitter</span>
        </button>

        <button
          onClick={shareToFacebook}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          <span className="text-lg">📘</span>
          <span className="hidden sm:inline">Facebook</span>
        </button>

        <button
          onClick={shareToInstagram}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          <span className="text-lg">📷</span>
          <span className="hidden sm:inline">Instagram</span>
        </button>

        <button
          onClick={shareToReddit}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          <span className="text-lg">🤖</span>
          <span className="hidden sm:inline">Reddit</span>
        </button>

        <button
          onClick={shareToDiscord}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          <span className="text-lg">💬</span>
          <span className="hidden sm:inline">Discord</span>
        </button>

        <button
          onClick={shareToTikTok}
          className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          <span className="text-lg">🎵</span>
          <span className="hidden sm:inline">TikTok</span>
        </button>

        <button
          onClick={shareToLinkedIn}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          <span className="text-lg">💼</span>
          <span className="hidden sm:inline">LinkedIn</span>
        </button>

        <button
          onClick={shareToPinterest}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          <span className="text-lg">📌</span>
          <span className="hidden sm:inline">Pinterest</span>
        </button>
      </div>

      {/* Copy Link */}
      <div className="flex gap-3">
        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm"
        />
        <button
          onClick={handleCopyLink}
          className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
            copied 
              ? 'bg-green-500 text-white' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-white/60 text-sm">
          💡 <strong>Pro Tip:</strong> Share your contest entries on social media to get more votes!
        </p>
      </div>
    </div>
  )
}
