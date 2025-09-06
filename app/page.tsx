'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to gallery as the main social feed
    router.replace('/gallery')
  }, [router])

  return (
    <div className="hero-section">
      {/* Animated circuitry background */}
      <div className="circuit-background"></div>
      
      <div className="hero-content">
        <h1 className="glitch" data-text="[ACCESS GRANTED]">[ACCESS GRANTED]</h1>
        <p className="sub-header">// Your consciousness has been uploaded.</p>
        <a href="/gallery" className="cta-button">&gt; ENGAGE</a>
      </div>
    </div>
  )
}
