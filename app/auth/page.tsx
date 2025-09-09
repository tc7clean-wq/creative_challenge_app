'use client'

import { useState } from 'react'
import SocialNavbar from '@/components/layout/SocialNavbar'
import AuthForm from '@/components/auth/AuthForm'

export default function AuthPage() {
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in')

  return (
    <div className="min-h-screen cyber-bg">
      <SocialNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="cyber-card p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold cyber-text mb-4" style={{ fontFamily: 'var(--font-header)' }}>
                {view === 'sign_in' ? 'Welcome Back' : 'Join Creative Challenge'}
              </h1>
              <p className="text-cyan-300 text-lg">
                {view === 'sign_in' 
                  ? 'Sign in to your account' 
                  : 'Create your account to start creating and voting'
                }
              </p>
            </div>

            <AuthForm view={view} />

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setView(view === 'sign_in' ? 'sign_up' : 'sign_in')
                }}
                className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg font-bold"
              >
                {view === 'sign_in' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}