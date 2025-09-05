'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DebugButtonsExtensive() {
  const router = useRouter()
  const [testResults, setTestResults] = useState<{name: string, status: 'pending' | 'pass' | 'fail', message: string}[]>([])

  const addTestResult = (name: string, status: 'pending' | 'pass' | 'fail', message: string) => {
    setTestResults(prev => [...prev, { name, status, message }])
  }

  const testButtonClick = (buttonName: string) => {
    addTestResult(buttonName, 'pass', 'Button click registered successfully')
  }

  const testNavigation = (route: string, buttonName: string) => {
    try {
      addTestResult(buttonName, 'pending', `Testing navigation to ${route}...`)
      router.push(route)
      addTestResult(buttonName, 'pass', `Navigation to ${route} initiated`)
    } catch (error) {
      addTestResult(buttonName, 'fail', `Navigation error: ${error}`)
    }
  }

  const testAlert = () => {
    try {
      alert('Alert test successful!')
      addTestResult('Alert Test', 'pass', 'Alert displayed successfully')
    } catch (error) {
      addTestResult('Alert Test', 'fail', `Alert error: ${error}`)
    }
  }

  const testConsoleLog = () => {
    try {
      console.log('Console log test successful!')
      addTestResult('Console Log Test', 'pass', 'Console log executed successfully')
    } catch (error) {
      addTestResult('Console Log Test', 'fail', `Console log error: ${error}`)
    }
  }

  const testLocalStorage = () => {
    try {
      localStorage.setItem('test-key', 'test-value')
      const retrieved = localStorage.getItem('test-key')
      localStorage.removeItem('test-key')
      
      if (retrieved === 'test-value') {
        addTestResult('Local Storage Test', 'pass', 'Local storage working correctly')
      } else {
        addTestResult('Local Storage Test', 'fail', 'Local storage test failed')
      }
    } catch (error) {
      addTestResult('Local Storage Test', 'fail', `Local storage error: ${error}`)
    }
  }

  const testFetch = async () => {
    try {
      addTestResult('Fetch Test', 'pending', 'Testing fetch API...')
      const response = await fetch('/api/test', { method: 'GET' })
      addTestResult('Fetch Test', 'pass', `Fetch test completed - Status: ${response.status}`)
    } catch (error) {
      addTestResult('Fetch Test', 'fail', `Fetch error: ${error}`)
    }
  }

  const testAsyncOperation = async () => {
    try {
      addTestResult('Async Test', 'pending', 'Testing async operations...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      addTestResult('Async Test', 'pass', 'Async operation completed successfully')
    } catch (error) {
      addTestResult('Async Test', 'fail', `Async error: ${error}`)
    }
  }

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
      <h1 className="text-4xl font-bold mb-8">Extensive Button & Functionality Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Button Tests</h2>
          <div className="space-y-4">
            <button
              onClick={() => testButtonClick('Basic Click Test')}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Test Basic Click
            </button>
            
            <button
              onClick={testAlert}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Test Alert
            </button>
            
            <button
              onClick={testConsoleLog}
              className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Test Console Log
            </button>
            
            <button
              onClick={testLocalStorage}
              className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Test Local Storage
            </button>
            
            <button
              onClick={testFetch}
              className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Test Fetch API
            </button>
            
            <button
              onClick={testAsyncOperation}
              className="w-full px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Test Async Operation
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Navigation Tests</h2>
          <div className="space-y-4">
            <button
              onClick={() => testNavigation('/', 'Home Navigation')}
              className="w-full px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Navigate to Home
            </button>
            
            <button
              onClick={() => testNavigation('/auth', 'Auth Navigation')}
              className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Navigate to Auth
            </button>
            
            <button
              onClick={() => testNavigation('/gallery', 'Gallery Navigation')}
              className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Navigate to Gallery
            </button>
            
            <button
              onClick={() => testNavigation('/competitions', 'Competitions Navigation')}
              className="w-full px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Navigate to Competitions
            </button>
            
            <button
              onClick={() => testNavigation('/submit', 'Submit Navigation')}
              className="w-full px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              Navigate to Submit
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Test Results</h2>
        {testResults.length === 0 ? (
          <div className="p-4 bg-gray-500/20 rounded-lg text-gray-300">
            No tests run yet. Click the buttons above to start testing.
          </div>
        ) : (
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <span className="text-2xl">{getStatusIcon(result.status)}</span>
                <div>
                  <div className="font-semibold">{result.name}</div>
                  <div className="text-sm text-gray-300">{result.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
