'use client'

import { useState, useEffect } from 'react'
import HolographicCard from '@/components/quantum/HolographicCard'
import QuantumButton from '@/components/quantum/QuantumButton'

interface ViralJackpotExplainerProps {
  className?: string
}

export default function ViralJackpotExplainer({ className = '' }: ViralJackpotExplainerProps) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])

  const steps = [
    {
      icon: '🎨',
      title: 'Create & Submit',
      description: 'Submit your artwork to any competition',
      reward: '+1 Entry',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: '🏆',
      title: 'Win Competitions',
      description: 'Place 1st, 2nd, or 3rd in contests',
      reward: '+100, +50, +25 Entries',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: '👍',
      title: 'Get Community Votes',
      description: 'Receive votes from other artists',
      reward: '+1 Entry per Vote',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🎰',
      title: 'Win the Jackpot',
      description: 'Monthly draw with massive prizes',
      reward: 'Up to $10,000+',
      gradient: 'from-emerald-500 to-cyan-500'
    }
  ]

  const features = [
    {
      icon: '⚡',
      title: 'Instant Entries',
      description: 'Get entries immediately for every action'
    },
    {
      icon: '🔄',
      title: 'Monthly Draws',
      description: 'Fresh jackpots every month'
    },
    {
      icon: '🎯',
      title: 'Weighted Fairness',
      description: 'More entries = better chances'
    },
    {
      icon: '🔒',
      title: 'Secure & Transparent',
      description: 'Blockchain-verified draws'
    }
  ]

  return (
    <section className={`py-20 px-4 ${className}`}>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-6">
            <span className="text-2xl">🎰</span>
            <span className="text-cyan-400 font-semibold">Viral Jackpot System</span>
          </div>
          
          <h2 className="text-5xl font-bold gradient-holographic-text mb-6">
            How the Jackpot Works
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Every action you take earns you entries into our monthly jackpot draws. 
            The more you participate, the better your chances of winning massive prizes!
          </p>
        </div>

        {/* Interactive Steps */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <HolographicCard
                key={index}
                className={`p-6 text-center transition-all duration-500 ${
                  activeStep === index 
                    ? 'scale-105 shadow-2xl' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                glowColor={index === 0 ? 'cyan' : index === 1 ? 'yellow' : index === 2 ? 'purple' : 'cyan'}
                interactive={true}
              >
                <div className={`text-6xl mb-4 transition-transform duration-300 ${
                  activeStep === index ? 'scale-110' : ''
                }`}>
                  {step.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">
                  {step.title}
                </h3>
                
                <p className="text-gray-300 mb-4 text-sm">
                  {step.description}
                </p>
                
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${step.gradient} text-white`}>
                  {step.reward}
                </div>
              </HolographicCard>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center gradient-holographic-text mb-12">
            Why It&apos;s Revolutionary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <HolographicCard
                key={index}
                className="p-6 text-center"
                glowColor="cyan"
                interactive={true}
              >
                <div className="text-4xl mb-4">
                  {feature.icon}
                </div>
                
                <h4 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h4>
                
                <p className="text-gray-300 text-sm">
                  {feature.description}
                </p>
              </HolographicCard>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <HolographicCard className="p-8 max-w-4xl mx-auto" glowColor="cyan">
            <div className="text-center">
              <h3 className="text-3xl font-bold gradient-holographic-text mb-4">
                Ready to Start Earning Entries?
              </h3>
              
              <p className="text-gray-300 mb-8 text-lg">
                Join thousands of artists already earning jackpot entries. 
                The more you create and participate, the better your chances!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <QuantumButton
                  href="/submit"
                  variant="primary"
                  size="lg"
                  className="px-8 py-4"
                >
                  Submit Artwork Now
                </QuantumButton>
                
                <QuantumButton
                  href="/competitions"
                  variant="secondary"
                  size="lg"
                  className="px-8 py-4"
                >
                  View Competitions
                </QuantumButton>
              </div>
              
              <div className="mt-6 text-sm text-gray-400">
                <p>🎯 New jackpot draws every month</p>
                <p>⚡ Entries are awarded instantly</p>
                <p>🔒 Secure, transparent, and fair</p>
              </div>
            </div>
          </HolographicCard>
        </div>
      </div>
    </section>
  )
}
