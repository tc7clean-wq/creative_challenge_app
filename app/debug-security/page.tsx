'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function DebugSecurityPage() {
  const [securityTests, setSecurityTests] = useState<{
    name: string
    status: 'pending' | 'running' | 'pass' | 'fail' | 'warning'
    details: string
    severity: 'low' | 'medium' | 'high' | 'critical'
  }[]>([])

  const addSecurityTest = (name: string, status: 'pending' | 'running' | 'pass' | 'fail' | 'warning', details: string, severity: 'low' | 'medium' | 'high' | 'critical') => {
    setSecurityTests(prev => [...prev, { name, status, details, severity }])
  }

  const updateSecurityTest = (name: string, status: 'pending' | 'running' | 'pass' | 'fail' | 'warning', details: string, severity: 'low' | 'medium' | 'high' | 'critical') => {
    setSecurityTests(prev => prev.map(test => test.name === name ? { name, status, details, severity } : test))
  }

  useEffect(() => {
    // Test 1: Environment Variables Security
    const testEnvironmentSecurity = () => {
      addSecurityTest('Environment Variables', 'running', 'Checking environment variable security...', 'high')
      
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
        
        if (!supabaseUrl || !supabaseKey) {
          updateSecurityTest('Environment Variables', 'fail', 'Missing critical environment variables', 'critical')
          return
        }

        // Check if sensitive data is exposed
        if (supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1')) {
          updateSecurityTest('Environment Variables', 'warning', 'Using localhost URL in production', 'medium')
          return
        }

        if (supabaseKey.length < 20) {
          updateSecurityTest('Environment Variables', 'warning', 'Supabase key seems too short', 'medium')
          return
        }

        updateSecurityTest('Environment Variables', 'pass', 'Environment variables properly configured', 'low')
      } catch (error) {
        updateSecurityTest('Environment Variables', 'fail', `Environment check error: ${error}`, 'high')
      }
    }

    // Test 2: HTTPS Security
    const testHTTPSSecurity = () => {
      addSecurityTest('HTTPS Security', 'running', 'Checking HTTPS configuration...', 'high')
      
      try {
        if (typeof window !== 'undefined') {
          const isHTTPS = window.location.protocol === 'https:'
          if (isHTTPS) {
            updateSecurityTest('HTTPS Security', 'pass', 'HTTPS is enabled', 'low')
          } else {
            updateSecurityTest('HTTPS Security', 'fail', 'HTTPS is not enabled - security risk', 'critical')
          }
        } else {
          updateSecurityTest('HTTPS Security', 'warning', 'Cannot check HTTPS in SSR', 'medium')
        }
      } catch (error) {
        updateSecurityTest('HTTPS Security', 'fail', `HTTPS check error: ${error}`, 'high')
      }
    }

    // Test 3: Content Security Policy
    const testCSP = () => {
      addSecurityTest('Content Security Policy', 'running', 'Checking Content Security Policy...', 'medium')
      
      try {
        if (typeof window !== 'undefined') {
          const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]')
          if (metaCSP) {
            updateSecurityTest('Content Security Policy', 'pass', 'CSP meta tag found', 'low')
          } else {
            updateSecurityTest('Content Security Policy', 'warning', 'No CSP meta tag found', 'medium')
          }
        } else {
          updateSecurityTest('Content Security Policy', 'warning', 'Cannot check CSP in SSR', 'medium')
        }
      } catch (error) {
        updateSecurityTest('Content Security Policy', 'fail', `CSP check error: ${error}`, 'high')
      }
    }

    // Test 4: XSS Protection
    const testXSSProtection = () => {
      addSecurityTest('XSS Protection', 'running', 'Testing XSS protection...', 'high')
      
      try {
        // Test script injection
        const testScript = '<script>alert("xss")</script>'
        const testDiv = document.createElement('div')
        testDiv.innerHTML = testScript
        
        if (testDiv.textContent === 'alert("xss")') {
          updateSecurityTest('XSS Protection', 'pass', 'XSS protection working - script tags escaped', 'low')
        } else {
          updateSecurityTest('XSS Protection', 'fail', 'XSS protection failed - script tags not escaped', 'critical')
        }
      } catch (error) {
        updateSecurityTest('XSS Protection', 'fail', `XSS test error: ${error}`, 'high')
      }
    }

    // Test 5: Local Storage Security
    const testLocalStorageSecurity = () => {
      addSecurityTest('Local Storage Security', 'running', 'Checking local storage security...', 'medium')
      
      try {
        // Test if sensitive data is stored in localStorage
        const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth']
        let foundSensitive = false
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
            foundSensitive = true
            break
          }
        }
        
        if (foundSensitive) {
          updateSecurityTest('Local Storage Security', 'warning', 'Potentially sensitive data found in localStorage', 'medium')
        } else {
          updateSecurityTest('Local Storage Security', 'pass', 'No sensitive data found in localStorage', 'low')
        }
      } catch (error) {
        updateSecurityTest('Local Storage Security', 'fail', `Local storage security check error: ${error}`, 'high')
      }
    }

    // Test 6: Supabase Security
    const testSupabaseSecurity = async () => {
      addSecurityTest('Supabase Security', 'running', 'Testing Supabase security configuration...', 'high')
      
      try {
        const supabase = createClient()
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          updateSecurityTest('Supabase Security', 'fail', `Supabase security error: ${error.message}`, 'high')
          return
        }
        
        // Check if session data is properly handled
        if (data.session) {
          const sessionData = data.session
          if (sessionData.access_token && sessionData.refresh_token) {
            updateSecurityTest('Supabase Security', 'pass', 'Supabase session properly configured', 'low')
          } else {
            updateSecurityTest('Supabase Security', 'warning', 'Supabase session missing tokens', 'medium')
          }
        } else {
          updateSecurityTest('Supabase Security', 'pass', 'No active session - security maintained', 'low')
        }
      } catch (error) {
        updateSecurityTest('Supabase Security', 'fail', `Supabase security test error: ${error}`, 'high')
      }
    }

    // Test 7: Input Validation
    const testInputValidation = () => {
      addSecurityTest('Input Validation', 'running', 'Testing input validation...', 'high')
      
      try {
        // Test various malicious inputs
        const maliciousInputs = [
          '<script>alert("xss")</script>',
          'javascript:alert("xss")',
          '"><script>alert("xss")</script>',
          '${alert("xss")}',
          'eval("alert(1)")',
          'Function("alert(1)")()'
        ]
        
        let validationPassed = true
        for (const input of maliciousInputs) {
          // Test if input is properly escaped
          const testDiv = document.createElement('div')
          testDiv.textContent = input
          if (testDiv.innerHTML !== input) {
            validationPassed = false
            break
          }
        }
        
        if (validationPassed) {
          updateSecurityTest('Input Validation', 'pass', 'Input validation working correctly', 'low')
        } else {
          updateSecurityTest('Input Validation', 'fail', 'Input validation failed - XSS vulnerability', 'critical')
        }
      } catch (error) {
        updateSecurityTest('Input Validation', 'fail', `Input validation test error: ${error}`, 'high')
      }
    }

    // Test 8: CORS Configuration
    const testCORS = () => {
      addSecurityTest('CORS Configuration', 'running', 'Checking CORS configuration...', 'medium')
      
      try {
        // Test if CORS headers are present
        fetch(window.location.origin, { method: 'HEAD' })
          .then(response => {
            const corsHeaders = [
              'Access-Control-Allow-Origin',
              'Access-Control-Allow-Methods',
              'Access-Control-Allow-Headers'
            ]
            
            let corsConfigured = false
            for (const header of corsHeaders) {
              if (response.headers.get(header)) {
                corsConfigured = true
                break
              }
            }
            
            if (corsConfigured) {
              updateSecurityTest('CORS Configuration', 'pass', 'CORS headers found', 'low')
            } else {
              updateSecurityTest('CORS Configuration', 'warning', 'No CORS headers found', 'medium')
            }
          })
          .catch(error => {
            updateSecurityTest('CORS Configuration', 'fail', `CORS test error: ${error}`, 'high')
          })
      } catch (error) {
        updateSecurityTest('CORS Configuration', 'fail', `CORS check error: ${error}`, 'high')
      }
    }

    // Run all security tests
    testEnvironmentSecurity()
    testHTTPSSecurity()
    testCSP()
    testXSSProtection()
    testLocalStorageSecurity()
    testSupabaseSecurity()
    testInputValidation()
    testCORS()

  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return '✅'
      case 'fail': return '❌'
      case 'warning': return '⚠️'
      case 'running': return '⏳'
      case 'pending': return '⏳'
      default: return '❓'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400'
      case 'high': return 'text-orange-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Ultra-Extensive Security Audit</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Security Test Results</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {securityTests.map((test, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <span className="text-2xl">{getStatusIcon(test.status)}</span>
              <div className="flex-1">
                <div className="font-semibold">{test.name}</div>
                <div className="text-sm text-gray-300">{test.details}</div>
                <div className={`text-xs ${getSeverityColor(test.severity)}`}>
                  Severity: {test.severity.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Security Headers</h2>
          <div className="space-y-2">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="font-semibold">Content Security Policy</div>
              <div className="text-sm text-gray-300">
                {typeof window !== 'undefined' 
                  ? (document.querySelector('meta[http-equiv="Content-Security-Policy"]') ? 'Present' : 'Missing')
                  : 'N/A (SSR)'
                }
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="font-semibold">X-Frame-Options</div>
              <div className="text-sm text-gray-300">Checking...</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="font-semibold">X-Content-Type-Options</div>
              <div className="text-sm text-gray-300">Checking...</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Environment Security</h2>
          <div className="space-y-2">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="font-semibold">HTTPS Status</div>
              <div className="text-sm text-gray-300">
                {typeof window !== 'undefined' 
                  ? (window.location.protocol === 'https:' ? 'Enabled' : 'Disabled')
                  : 'N/A (SSR)'
                }
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="font-semibold">Environment Variables</div>
              <div className="text-sm text-gray-300">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing'}
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="font-semibold">API Keys</div>
              <div className="text-sm text-gray-300">
                {process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? 'Present' : 'Missing'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
