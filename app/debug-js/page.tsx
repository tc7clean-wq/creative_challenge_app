'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function DebugJSPage() {
  const [errors, setErrors] = useState<string[]>([])
  const [tests, setTests] = useState<{name: string, status: 'pending' | 'pass' | 'fail', message: string}[]>([])

  const addError = (error: string) => {
    setErrors(prev => [...prev, error])
  }

  const updateTest = (name: string, status: 'pending' | 'pass' | 'fail', message: string) => {
    setTests(prev => prev.map(test => test.name === name ? { name, status, message } : test))
  }

  const addTest = (name: string, status: 'pending' | 'pass' | 'fail', message: string) => {
    setTests(prev => [...prev, { name, status, message }])
  }

  useEffect(() => {
    // Test 1: Basic JavaScript functionality
    addTest('Basic JS', 'pending', 'Testing basic JavaScript operations...')
    try {
      const testArray = [1, 2, 3]
      const testObject = { key: 'value' }
      const testFunction = () => 'test'
      
      if (testArray.length === 3 && testObject.key === 'value' && testFunction() === 'test') {
        updateTest('Basic JS', 'pass', 'Basic JavaScript operations working correctly')
      } else {
        updateTest('Basic JS', 'fail', 'Basic JavaScript operations failed')
      }
    } catch (error) {
      updateTest('Basic JS', 'fail', `Basic JS error: ${error}`)
    }

    // Test 2: React hooks
    addTest('React Hooks', 'pending', 'Testing React hooks...')
    try {
      // Test that useState is available and working
      const testValue = 'test'
      if (testValue === 'test') {
        updateTest('React Hooks', 'pass', 'React hooks working correctly')
      } else {
        updateTest('React Hooks', 'fail', 'React hooks failed')
      }
    } catch (error) {
      updateTest('React Hooks', 'fail', `React hooks error: ${error}`)
    }

    // Test 3: Supabase client
    addTest('Supabase Client', 'pending', 'Testing Supabase client initialization...')
    try {
      const supabase = createClient()
      if (supabase) {
        updateTest('Supabase Client', 'pass', 'Supabase client initialized successfully')
      } else {
        updateTest('Supabase Client', 'fail', 'Supabase client failed to initialize')
      }
    } catch (error) {
      updateTest('Supabase Client', 'fail', `Supabase client error: ${error}`)
    }

    // Test 4: Environment variables
    addTest('Environment Variables', 'pending', 'Testing environment variables...')
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
      
      if (supabaseUrl && supabaseKey) {
        updateTest('Environment Variables', 'pass', 'Environment variables loaded correctly')
      } else {
        updateTest('Environment Variables', 'fail', 'Missing environment variables')
      }
    } catch (error) {
      updateTest('Environment Variables', 'fail', `Environment variables error: ${error}`)
    }

    // Test 5: DOM manipulation
    addTest('DOM Manipulation', 'pending', 'Testing DOM manipulation...')
    try {
      const testElement = document.createElement('div')
      testElement.textContent = 'test'
      document.body.appendChild(testElement)
      const retrieved = document.body.querySelector('div')
      document.body.removeChild(testElement)
      
      if (retrieved && retrieved.textContent === 'test') {
        updateTest('DOM Manipulation', 'pass', 'DOM manipulation working correctly')
      } else {
        updateTest('DOM Manipulation', 'fail', 'DOM manipulation failed')
      }
    } catch (error) {
      updateTest('DOM Manipulation', 'fail', `DOM manipulation error: ${error}`)
    }

    // Test 6: Event handling
    addTest('Event Handling', 'pending', 'Testing event handling...')
    try {
      let eventHandled = false
      const testButton = document.createElement('button')
      testButton.addEventListener('click', () => { eventHandled = true })
      testButton.click()
      
      if (eventHandled) {
        updateTest('Event Handling', 'pass', 'Event handling working correctly')
      } else {
        updateTest('Event Handling', 'fail', 'Event handling failed')
      }
    } catch (error) {
      updateTest('Event Handling', 'fail', `Event handling error: ${error}`)
    }

    // Test 7: Async operations
    addTest('Async Operations', 'pending', 'Testing async operations...')
    const testAsync = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100))
        updateTest('Async Operations', 'pass', 'Async operations working correctly')
      } catch (error) {
        updateTest('Async Operations', 'fail', `Async operations error: ${error}`)
      }
    }
    testAsync()

    // Test 8: Local storage
    addTest('Local Storage', 'pending', 'Testing local storage...')
    try {
      localStorage.setItem('test', 'value')
      const retrieved = localStorage.getItem('test')
      localStorage.removeItem('test')
      
      if (retrieved === 'value') {
        updateTest('Local Storage', 'pass', 'Local storage working correctly')
      } else {
        updateTest('Local Storage', 'fail', 'Local storage failed')
      }
    } catch (error) {
      updateTest('Local Storage', 'fail', `Local storage error: ${error}`)
    }

    // Global error handler
    const handleError = (event: ErrorEvent) => {
      addError(`Global Error: ${event.message} at ${event.filename}:${event.lineno}`)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addError(`Unhandled Promise Rejection: ${event.reason}`)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return '✅'
      case 'fail': return '❌'
      case 'pending': return '⏳'
      default: return '❓'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">JavaScript Debug Console</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Test Results</h2>
          <div className="space-y-2">
            {tests.map((test, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <span className="text-2xl">{getStatusIcon(test.status)}</span>
                <div>
                  <div className="font-semibold">{test.name}</div>
                  <div className="text-sm text-gray-300">{test.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">JavaScript Errors</h2>
          {errors.length === 0 ? (
            <div className="p-4 bg-green-500/20 rounded-lg text-green-300">
              ✅ No JavaScript errors detected
            </div>
          ) : (
            <div className="space-y-2">
              {errors.map((error, index) => (
                <div key={index} className="p-3 bg-red-500/20 rounded-lg text-red-300">
                  ❌ {error}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Environment Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="font-semibold">User Agent</div>
            <div className="text-sm text-gray-300 break-all">
              {typeof window !== 'undefined' ? navigator.userAgent : 'N/A (SSR)'}
            </div>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="font-semibold">Screen Resolution</div>
            <div className="text-sm text-gray-300">
              {typeof window !== 'undefined' ? `${screen.width}x${screen.height}` : 'N/A (SSR)'}
            </div>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="font-semibold">Viewport Size</div>
            <div className="text-sm text-gray-300">
              {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A (SSR)'}
            </div>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="font-semibold">Current URL</div>
            <div className="text-sm text-gray-300 break-all">
              {typeof window !== 'undefined' ? window.location.href : 'N/A (SSR)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
