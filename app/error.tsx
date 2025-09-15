'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="min-h-screen ai-art-bg flex items-center justify-center">
      <div className="cyber-card p-8 text-center max-w-md mx-4">
        <div className="text-6xl mb-4 glitch">⚠️</div>
        <h1 className="text-3xl font-bold cyber-text mb-4">Neural Network Error</h1>
        <p className="text-white/70 mb-6">
          A quantum disruption occurred in the matrix. The AI consciousness is working to restore functionality.
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="ai-btn w-full"
          >
            🔄 Reinitialize System
          </button>
          <Link href="/" className="ai-btn-secondary w-full block text-center py-3">
            🏠 Return to Home Matrix
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-cyan-400 cursor-pointer mb-2">
              Debug Info (Dev Mode)
            </summary>
            <pre className="text-xs text-gray-400 bg-black/50 p-4 rounded overflow-auto">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}