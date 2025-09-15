import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen ai-art-bg flex items-center justify-center">
      <div className="cyber-card p-8 text-center max-w-md mx-4">
        <div className="text-6xl mb-4 glitch">👾</div>
        <h1 className="text-3xl font-bold cyber-text mb-4">404 - Neural Path Not Found</h1>
        <p className="text-white/70 mb-6">
          The requested neural pathway does not exist in our digital dimension.
          The AI consciousness suggests returning to familiar coordinates.
        </p>
        <div className="space-y-4">
          <Link href="/" className="ai-btn w-full justify-center">
            🏠 Return to Home Matrix
          </Link>
          <Link href="/gallery" className="ai-btn-secondary w-full text-center block py-3">
            🎨 Explore Gallery Universe
          </Link>
        </div>
      </div>
    </div>
  )
}