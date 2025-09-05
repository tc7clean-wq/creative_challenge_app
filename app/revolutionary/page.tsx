'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function RevolutionaryHomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const particleContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoaded(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      title: "AI-Powered Creation",
      description: "Generate stunning artwork with our advanced AI tools",
      icon: "🤖",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      title: "Real-Time Collaboration",
      description: "Create together with artists worldwide in live sessions",
      icon: "🌐",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Smart Discovery",
      description: "AI-powered recommendations find your perfect art",
      icon: "🔍",
      gradient: "from-yellow-500 to-orange-500"
    }
  ]

  const stats = [
    { number: "50K+", label: "Active Artists", color: "text-cyan-400" },
    { number: "2M+", label: "Artworks Created", color: "text-purple-400" },
    { number: "10M+", label: "Community Votes", color: "text-pink-400" },
    { number: "500+", label: "Live Sessions", color: "text-yellow-400" }
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Quantum Background */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="quantum-grid absolute inset-0"></div>
        
        {/* Floating Particles */}
        <div ref={particleContainerRef} className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${6 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        {/* Mouse-following Glow */}
        <div
          className="absolute w-96 h-96 bg-gradient-radial from-cyan-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: 'all 0.1s ease-out'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="quantum-glass-ultra mx-4 mt-4 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/creative-challenge-logo.png"
                alt="Creative Challenge"
                width={48}
                height={48}
                className="rounded-xl"
              />
              <span className="gradient-quantum-text text-2xl font-bold">
                Creative Showcase
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/gallery" className="text-white/70 hover:text-white transition-colors">
                Gallery
              </Link>
              <Link href="/competitions" className="text-white/70 hover:text-white transition-colors">
                Competitions
              </Link>
              <Link href="/create" className="text-white/70 hover:text-white transition-colors">
                Create
              </Link>
              <Link href="/community" className="text-white/70 hover:text-white transition-colors">
                Community
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="quantum-hover px-4 py-2 text-white/70 hover:text-white transition-colors">
                Sign In
              </button>
              <Link href="/auth-simple" className="quantum-button">
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="text-center py-20 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Main Title */}
            <h1 className={`text-7xl md:text-9xl font-bold mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="gradient-holographic-text block">
                Creative
              </span>
              <span className="gradient-cyber-text block">
                Revolution
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-2xl md:text-3xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              The world&apos;s most advanced AI art platform. Create, collaborate, and discover 
              <span className="gradient-quantum-text"> the future of digital art</span> with cutting-edge technology.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-20 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Link href="/auth-simple" className="quantum-button text-lg px-8 py-4">
                Start Creating Now
              </Link>
              <Link href="/gallery" className="quantum-hover px-8 py-4 quantum-glass rounded-2xl text-white font-semibold text-lg">
                Explore Gallery
              </Link>
              <Link href="/live-sessions" className="quantum-hover px-8 py-4 quantum-glass rounded-2xl text-white font-semibold text-lg">
                Join Live Session
              </Link>
            </div>

            {/* Live Stats */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {stats.map((stat, index) => (
                <div key={index} className="holographic-card p-6 text-center">
                  <div className={`text-4xl font-bold mb-2 ${stat.color} animate-neural-pulse`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Revolutionary Features */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-holographic-text">
                Revolutionary Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the future of AI art creation with our cutting-edge platform
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`holographic-card p-8 text-center quantum-hover transition-all duration-500 ${
                    activeFeature === index ? 'scale-105' : 'scale-100'
                  }`}
                >
                  <div className={`text-6xl mb-6 animate-quantum-float`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Creation Sessions */}
        <section className="py-20 px-4 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 gradient-cyber-text">
                Live Creation Sessions
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Join real-time collaborative art sessions with artists from around the world
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="holographic-card p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Currently Live</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 quantum-glass rounded-xl">
                    <div>
                      <div className="text-white font-semibold">Abstract Expressionism</div>
                      <div className="text-gray-400 text-sm">12 artists collaborating</div>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between p-4 quantum-glass rounded-xl">
                    <div>
                      <div className="text-white font-semibold">Digital Portraits</div>
                      <div className="text-gray-400 text-sm">8 artists collaborating</div>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="holographic-card p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Upcoming Sessions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 quantum-glass rounded-xl">
                    <div>
                      <div className="text-white font-semibold">Landscape Art</div>
                      <div className="text-gray-400 text-sm">Starts in 2 hours</div>
                    </div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-4 quantum-glass rounded-xl">
                    <div>
                      <div className="text-white font-semibold">Sci-Fi Concepts</div>
                      <div className="text-gray-400 text-sm">Starts in 5 hours</div>
                    </div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI-Powered Discovery */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 gradient-quantum-text">
                AI-Powered Discovery
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our advanced AI learns your preferences and recommends perfect artwork
              </p>
            </div>

            <div className="holographic-card p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6">Smart Recommendations</h3>
                  <ul className="space-y-4 text-gray-300">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span>Personalized art suggestions based on your style</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Real-time trend analysis and popular themes</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      <span>Collaborative filtering from similar artists</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Mood-based discovery and emotional matching</span>
                    </li>
                  </ul>
                </div>
                <div className="quantum-glass p-8 rounded-2xl">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🧠</div>
                    <div className="text-white font-semibold mb-2">AI Learning</div>
                    <div className="text-gray-400 text-sm">Continuously improving recommendations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 gradient-holographic-text">
              Ready to Create the Future?
            </h2>
            <p className="text-2xl text-gray-300 mb-12">
              Join thousands of artists already revolutionizing digital art
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth-simple" className="quantum-button text-xl px-12 py-6">
                Start Your Journey
              </Link>
              <Link href="/demo" className="quantum-hover px-12 py-6 quantum-glass-ultra rounded-2xl text-white font-semibold text-xl">
                Watch Demo
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}
