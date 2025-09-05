'use client'

import { useState, useEffect } from 'react'

export default function DebugAPIPage() {
  const [apiTests, setApiTests] = useState<{
    name: string
    status: 'pending' | 'running' | 'pass' | 'fail'
    details: string
    duration: number
    responseCode: number
  }[]>([])

  const addApiTest = (name: string, status: 'pending' | 'running' | 'pass' | 'fail', details: string, duration: number = 0, responseCode: number = 0) => {
    setApiTests(prev => [...prev, { name, status, details, duration, responseCode }])
  }

  const updateApiTest = (name: string, status: 'pending' | 'running' | 'pass' | 'fail', details: string, duration: number = 0, responseCode: number = 0) => {
    setApiTests(prev => prev.map(test => test.name === name ? { name, status, details, duration, responseCode } : test))
  }

  useEffect(() => {
    // Test 1: API Health Check
    const testAPIHealth = async () => {
      addApiTest('API Health Check', 'running', 'Testing API health...')
      const startTime = performance.now()
      
      try {
        const response = await fetch('/api/health', { method: 'GET' })
        const endTime = performance.now()
        const duration = endTime - startTime
        
        if (response.ok) {
          updateApiTest('API Health Check', 'pass', 'API health check passed', duration, response.status)
        } else {
          updateApiTest('API Health Check', 'fail', `API health check failed: ${response.status}`, duration, response.status)
        }
      } catch (error) {
        const endTime = performance.now()
        const duration = endTime - startTime
        updateApiTest('API Health Check', 'fail', `API health check error: ${error}`, duration, 0)
      }
    }

    // Test 2: Checkout API
    const testCheckoutAPI = async () => {
      addApiTest('Checkout API', 'running', 'Testing checkout API...')
      const startTime = performance.now()
      
      try {
        const response = await fetch('/api/checkout', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 1000,
            currency: 'usd',
            description: 'Test payment'
          })
        })
        const endTime = performance.now()
        const duration = endTime - startTime
        
        if (response.status === 200 || response.status === 400) {
          updateApiTest('Checkout API', 'pass', `Checkout API responded with ${response.status}`, duration, response.status)
        } else {
          updateApiTest('Checkout API', 'fail', `Checkout API failed: ${response.status}`, duration, response.status)
        }
      } catch (error) {
        const endTime = performance.now()
        const duration = endTime - startTime
        updateApiTest('Checkout API', 'fail', `Checkout API error: ${error}`, duration, 0)
      }
    }

    // Test 3: Payouts API
    const testPayoutsAPI = async () => {
      addApiTest('Payouts API', 'running', 'Testing payouts API...')
      const startTime = performance.now()
      
      try {
        const response = await fetch('/api/payouts/process', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 1000,
            recipient: 'test@example.com'
          })
        })
        const endTime = performance.now()
        const duration = endTime - startTime
        
        if (response.status === 200 || response.status === 400 || response.status === 401) {
          updateApiTest('Payouts API', 'pass', `Payouts API responded with ${response.status}`, duration, response.status)
        } else {
          updateApiTest('Payouts API', 'fail', `Payouts API failed: ${response.status}`, duration, response.status)
        }
      } catch (error) {
        const endTime = performance.now()
        const duration = endTime - startTime
        updateApiTest('Payouts API', 'fail', `Payouts API error: ${error}`, duration, 0)
      }
    }

    // Test 4: Stripe Webhooks
    const testStripeWebhooks = async () => {
      addApiTest('Stripe Webhooks', 'running', 'Testing Stripe webhooks...')
      const startTime = performance.now()
      
      try {
        const response = await fetch('/api/webhooks/stripe', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'test.event',
            data: { object: { id: 'test' } }
          })
        })
        const endTime = performance.now()
        const duration = endTime - startTime
        
        if (response.status === 200 || response.status === 400) {
          updateApiTest('Stripe Webhooks', 'pass', `Stripe webhooks responded with ${response.status}`, duration, response.status)
        } else {
          updateApiTest('Stripe Webhooks', 'fail', `Stripe webhooks failed: ${response.status}`, duration, response.status)
        }
      } catch (error) {
        const endTime = performance.now()
        const duration = endTime - startTime
        updateApiTest('Stripe Webhooks', 'fail', `Stripe webhooks error: ${error}`, duration, 0)
      }
    }

    // Test 5: CORS Headers
    const testCORSHeaders = async () => {
      addApiTest('CORS Headers', 'running', 'Testing CORS headers...')
      const startTime = performance.now()
      
      try {
        const response = await fetch('/api/checkout', { 
          method: 'OPTIONS',
          headers: {
            'Origin': 'https://example.com',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
          }
        })
        const endTime = performance.now()
        const duration = endTime - startTime
        
        const corsHeaders = response.headers.get('Access-Control-Allow-Origin')
        if (corsHeaders) {
          updateApiTest('CORS Headers', 'pass', `CORS headers present: ${corsHeaders}`, duration, response.status)
        } else {
          updateApiTest('CORS Headers', 'fail', 'CORS headers missing', duration, response.status)
        }
      } catch (error) {
        const endTime = performance.now()
        const duration = endTime - startTime
        updateApiTest('CORS Headers', 'fail', `CORS test error: ${error}`, duration, 0)
      }
    }

    // Test 6: Error Handling
    const testErrorHandling = async () => {
      addApiTest('Error Handling', 'running', 'Testing error handling...')
      const startTime = performance.now()
      
      try {
        const response = await fetch('/api/nonexistent', { method: 'GET' })
        const endTime = performance.now()
        const duration = endTime - startTime
        
        if (response.status === 404) {
          updateApiTest('Error Handling', 'pass', '404 error handled correctly', duration, response.status)
        } else {
          updateApiTest('Error Handling', 'fail', `Unexpected response: ${response.status}`, duration, response.status)
        }
      } catch (error) {
        const endTime = performance.now()
        const duration = endTime - startTime
        updateApiTest('Error Handling', 'fail', `Error handling test error: ${error}`, duration, 0)
      }
    }

    // Test 7: Request Timeout
    const testRequestTimeout = async () => {
      addApiTest('Request Timeout', 'running', 'Testing request timeout...')
      const startTime = performance.now()
      
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        
        const response = await fetch('/api/checkout', { 
          method: 'GET',
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        const endTime = performance.now()
        const duration = endTime - startTime
        
        updateApiTest('Request Timeout', 'pass', `Request completed in ${duration.toFixed(2)}ms`, duration, response.status)
      } catch (error) {
        const endTime = performance.now()
        const duration = endTime - startTime
        if (error instanceof Error && error.name === 'AbortError') {
          updateApiTest('Request Timeout', 'fail', 'Request timed out', duration, 0)
        } else {
          updateApiTest('Request Timeout', 'fail', `Timeout test error: ${error}`, duration, 0)
        }
      }
    }

    // Test 8: Content Type Validation
    const testContentTypeValidation = async () => {
      addApiTest('Content Type Validation', 'running', 'Testing content type validation...')
      const startTime = performance.now()
      
      try {
        const response = await fetch('/api/checkout', { 
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: 'invalid json'
        })
        const endTime = performance.now()
        const duration = endTime - startTime
        
        if (response.status === 400) {
          updateApiTest('Content Type Validation', 'pass', 'Content type validation working', duration, response.status)
        } else {
          updateApiTest('Content Type Validation', 'fail', `Unexpected response: ${response.status}`, duration, response.status)
        }
      } catch (error) {
        const endTime = performance.now()
        const duration = endTime - startTime
        updateApiTest('Content Type Validation', 'fail', `Content type test error: ${error}`, duration, 0)
      }
    }

    // Run all API tests
    testAPIHealth()
    testCheckoutAPI()
    testPayoutsAPI()
    testStripeWebhooks()
    testCORSHeaders()
    testErrorHandling()
    testRequestTimeout()
    testContentTypeValidation()

  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return '✅'
      case 'fail': return '❌'
      case 'running': return '⏳'
      case 'pending': return '⏳'
      default: return '❓'
    }
  }

  const getResponseCodeColor = (code: number) => {
    if (code >= 200 && code < 300) return 'text-green-400'
    if (code >= 300 && code < 400) return 'text-yellow-400'
    if (code >= 400 && code < 500) return 'text-orange-400'
    if (code >= 500) return 'text-red-400'
    return 'text-gray-400'
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Ultra-Extensive API Testing</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">API Test Results</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {apiTests.map((test, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <span className="text-2xl">{getStatusIcon(test.status)}</span>
              <div className="flex-1">
                <div className="font-semibold">{test.name}</div>
                <div className="text-sm text-gray-300">{test.details}</div>
                <div className="flex gap-4 text-xs text-gray-400">
                  {test.duration > 0 && <span>Duration: {test.duration.toFixed(2)}ms</span>}
                  {test.responseCode > 0 && (
                    <span className={getResponseCodeColor(test.responseCode)}>
                      Status: {test.responseCode}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">API Endpoints</h2>
          <div className="space-y-2">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="font-semibold">POST /api/checkout</div>
              <div className="text-sm text-gray-300">Stripe payment processing</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="font-semibold">POST /api/payouts/process</div>
              <div className="text-sm text-gray-300">Artist payout processing</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="font-semibold">POST /api/webhooks/stripe</div>
              <div className="text-sm text-gray-300">Stripe webhook handling</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="font-semibold">GET /api/health</div>
              <div className="text-sm text-gray-300">API health check</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">API Configuration</h2>
          <div className="space-y-2">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="font-semibold">Stripe Secret Key</div>
              <div className="text-sm text-gray-300">
                {process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Missing'}
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="font-semibold">Stripe Publishable Key</div>
              <div className="text-sm text-gray-300">
                {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Configured' : 'Missing'}
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="font-semibold">Webhook Secret</div>
              <div className="text-sm text-gray-300">
                {process.env.STRIPE_WEBHOOK_SECRET ? 'Configured' : 'Missing'}
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="font-semibold">Environment</div>
              <div className="text-sm text-gray-300">
                {process.env.NODE_ENV || 'Unknown'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
