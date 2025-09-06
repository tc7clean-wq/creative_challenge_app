'use client'

import { useState } from 'react'

interface ArtworkSharingProps {
  submissionId: string
  title: string
  imageUrl: string
  artistName: string
}

export default function ArtworkSharing({ submissionId, title, imageUrl, artistName }: ArtworkSharingProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = `${window.location.origin}/gallery/${submissionId}`
  const shareText = `Check out "${title}" by ${artistName} on Creative Challenge!`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  const shareToInstagram = () => {
    // Instagram doesn't support direct URL sharing, so we'll copy the image URL
    navigator.clipboard.writeText(imageUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToReddit = () => {
    const redditUrl = `https://reddit.com/submit?title=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(redditUrl, '_blank', 'width=600,height=400')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="flex items-center space-x-2 px-3 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105"
      >
        <span className="text-lg">📤</span>
        <span className="text-sm font-medium">Share</span>
      </button>

      {showShareMenu && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-4 z-10">
          <div className="space-y-3">
            <h4 className="text-white font-medium text-sm">Share this artwork</h4>
            
            {/* Copy Link */}
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center space-x-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <span className="text-lg">🔗</span>
              <span className="text-gray-200 text-sm">
                {copied ? 'Copied!' : 'Copy Link'}
              </span>
            </button>

            {/* Social Media Options */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={shareToTwitter}
                className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <span className="text-lg">🐦</span>
                <span className="text-gray-200 text-sm">Twitter</span>
              </button>

              <button
                onClick={shareToFacebook}
                className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <span className="text-lg">📘</span>
                <span className="text-gray-200 text-sm">Facebook</span>
              </button>

              <button
                onClick={shareToReddit}
                className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <span className="text-lg">🔴</span>
                <span className="text-gray-200 text-sm">Reddit</span>
              </button>

              <button
                onClick={shareToInstagram}
                className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <span className="text-lg">📷</span>
                <span className="text-gray-200 text-sm">Instagram</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowShareMenu(false)}
              className="w-full text-gray-400 text-sm hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
