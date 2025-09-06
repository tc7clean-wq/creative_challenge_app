'use client'

import { useState } from 'react'
import SocialNavbar from '@/components/layout/SocialNavbar'
import AuthForm from '@/components/auth/AuthForm'

export default function AuthPage() {
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in')

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <SocialNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {view === 'sign_in' ? 'Welcome Back' : 'Join Creative Challenge'}
              </h1>
              <p className="text-white/70">
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
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
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
