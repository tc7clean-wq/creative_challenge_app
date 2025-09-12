'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    particlesJS?: (id: string, config: object) => void
    pJSDom?: Array<{ pJS: { fn: { vendors: { destroy: () => void } } } }>
  }
}

export default function ParticleBackground() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let script: HTMLScriptElement | null = null
    let timeoutId: NodeJS.Timeout

    const loadParticles = async () => {
      try {
        // Check if particles.js is already loaded
        if (window.particlesJS) {
          initializeParticles()
          return
        }

        // Load particles.js with timeout
        script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js'
        script.async = true
        
        const loadPromise = new Promise<void>((resolve, reject) => {
          if (!script) return reject(new Error('Script not created'))
          
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load particles.js'))
          
          // Add timeout
          timeoutId = setTimeout(() => {
            reject(new Error('Particles.js loading timeout'))
          }, 10000) // 10 second timeout
        })

        document.head.appendChild(script)
        await loadPromise
        clearTimeout(timeoutId)
        
        initializeParticles()
      } catch (error) {
        console.warn('Failed to load particles.js:', error)
        setHasError(true)
        setIsLoaded(true) // Still mark as loaded to prevent retries
      }
    }

    const initializeParticles = () => {
      if (window.particlesJS && !hasError) {
        try {
          window.particlesJS("particles-js", {
            "particles": {
              "number": { "value": 60, "density": { "enable": true, "value_area": 1000 } },
              "color": { "value": ["#00f7ff", "#ff6b6b", "#4ecdc4"] },
              "shape": { 
                "type": "circle",
                "stroke": { "width": 0, "color": "#000000" }
              },
              "opacity": { 
                "value": 0.4, 
                "random": true, 
                "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } 
              },
              "size": { 
                "value": 2, 
                "random": true, 
                "anim": { "enable": true, "speed": 2, "size_min": 0.5, "sync": false } 
              },
              "line_linked": { 
                "enable": true, 
                "distance": 120, 
                "color": "#00f7ff", 
                "opacity": 0.15, 
                "width": 1 
              },
              "move": { 
                "enable": true, 
                "speed": 1.5, 
                "direction": "none", 
                "random": true, 
                "straight": false, 
                "out_mode": "out", 
                "bounce": false 
              }
            },
            "interactivity": {
              "detect_on": "canvas",
              "events": { 
                "onhover": { "enable": true, "mode": "grab" }, 
                "onclick": { "enable": true, "mode": "push" }, 
                "resize": true 
              },
              "modes": { 
                "grab": { "distance": 100, "line_linked": { "opacity": 0.3 } }, 
                "push": { "particles_nb": 3 } 
              }
            },
            "retina_detect": true
          })
          setIsLoaded(true)
        } catch (error) {
          console.warn('Failed to initialize particles:', error)
          setHasError(true)
          setIsLoaded(true)
        }
      }
    }

    loadParticles()

    return () => {
      // Cleanup particles
      try {
        if (window.pJSDom && window.pJSDom[0]) {
          window.pJSDom[0].pJS.fn.vendors.destroy()
        }
      } catch (error) {
        console.warn('Error cleaning up particles:', error)
      }

      // Cleanup script and timeout
      if (timeoutId) clearTimeout(timeoutId)
      if (script?.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [hasError])

  if (hasError) {
    // Fallback CSS animation when particles.js fails
    return (
      <div className="particles-background">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    )
  }

  return (
    <div 
      id="particles-js" 
      className="particles-background"
      style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease-in-out' }}
    />
  )
}
