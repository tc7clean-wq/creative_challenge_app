'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function DebugPerformancePage() {
  const [metrics, setMetrics] = useState<{
    loadTime: number
    renderTime: number
    memoryUsage: number
    networkRequests: number
    errors: string[]
  }>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkRequests: 0,
    errors: []
  })

  const [performanceTests, setPerformanceTests] = useState<{
    name: string
    status: 'pending' | 'running' | 'pass' | 'fail'
    duration: number
    details: string
  }[]>([])

  const startTime = useRef<number>(0)
  const renderStartTime = useRef<number>(0)

  const addPerformanceTest = (name: string, status: 'pending' | 'running' | 'pass' | 'fail', duration: number, details: string) => {
    setPerformanceTests(prev => [...prev, { name, status, duration, details }])
  }

  const updatePerformanceTest = (name: string, status: 'pending' | 'running' | 'pass' | 'fail', duration: number, details: string) => {
    setPerformanceTests(prev => prev.map(test => test.name === name ? { name, status, duration, details } : test))
  }

  useEffect(() => {
    startTime.current = performance.now()
    renderStartTime.current = performance.now()

    // Test 1: Page Load Performance
    const testPageLoad = () => {
      addPerformanceTest('Page Load', 'running', 0, 'Testing page load performance...')
      const loadTime = performance.now() - startTime.current
      updatePerformanceTest('Page Load', 'pass', loadTime, `Page loaded in ${loadTime.toFixed(2)}ms`)
    }

    // Test 2: Memory Usage
    const testMemoryUsage = () => {
      addPerformanceTest('Memory Usage', 'running', 0, 'Testing memory usage...')
      try {
        const memory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory
        if (memory) {
          const usedMB = memory.usedJSHeapSize / 1024 / 1024
          updatePerformanceTest('Memory Usage', 'pass', usedMB, `Memory usage: ${usedMB.toFixed(2)}MB`)
        } else {
          updatePerformanceTest('Memory Usage', 'fail', 0, 'Memory API not available')
        }
      } catch (error) {
        updatePerformanceTest('Memory Usage', 'fail', 0, `Memory test error: ${error}`)
      }
    }

    // Test 3: Network Performance
    const testNetworkPerformance = async () => {
      addPerformanceTest('Network Performance', 'running', 0, 'Testing network performance...')
      const startTime = performance.now()
      
      try {
        await fetch('/api/test', { method: 'GET' })
        const endTime = performance.now()
        const duration = endTime - startTime
        
        updatePerformanceTest('Network Performance', 'pass', duration, `Network request completed in ${duration.toFixed(2)}ms`)
      } catch (error) {
        const endTime = performance.now()
        const duration = endTime - startTime
        updatePerformanceTest('Network Performance', 'fail', duration, `Network error: ${error}`)
      }
    }

    // Test 4: DOM Performance
    const testDOMPerformance = () => {
      addPerformanceTest('DOM Performance', 'running', 0, 'Testing DOM manipulation performance...')
      const startTime = performance.now()
      
      try {
        // Create 1000 DOM elements
        const container = document.createElement('div')
        for (let i = 0; i < 1000; i++) {
          const element = document.createElement('div')
          element.textContent = `Element ${i}`
          container.appendChild(element)
        }
        
        // Measure append time
        const appendStart = performance.now()
        document.body.appendChild(container)
        const appendEnd = performance.now()
        
        // Measure query time
        const queryStart = performance.now()
        document.querySelectorAll('div')
        const queryEnd = performance.now()
        
        // Cleanup
        document.body.removeChild(container)
        
        const totalTime = performance.now() - startTime
        updatePerformanceTest('DOM Performance', 'pass', totalTime, 
          `DOM test completed in ${totalTime.toFixed(2)}ms (append: ${(appendEnd - appendStart).toFixed(2)}ms, query: ${(queryEnd - queryStart).toFixed(2)}ms)`)
      } catch (error) {
        updatePerformanceTest('DOM Performance', 'fail', 0, `DOM test error: ${error}`)
      }
    }

    // Test 5: JavaScript Performance
    const testJavaScriptPerformance = () => {
      addPerformanceTest('JavaScript Performance', 'running', 0, 'Testing JavaScript execution performance...')
      const startTime = performance.now()
      
      try {
        // CPU intensive task
        let result = 0
        for (let i = 0; i < 1000000; i++) {
          result += Math.sqrt(i) * Math.sin(i)
        }
        
        // Use result to avoid unused variable warning
        console.log('JavaScript performance test result:', result)
        
        const endTime = performance.now()
        const duration = endTime - startTime
        
        updatePerformanceTest('JavaScript Performance', 'pass', duration, `JavaScript computation completed in ${duration.toFixed(2)}ms`)
      } catch (error) {
        updatePerformanceTest('JavaScript Performance', 'fail', 0, `JavaScript test error: ${error}`)
      }
    }

    // Test 6: Supabase Performance
    const testSupabasePerformance = async () => {
      addPerformanceTest('Supabase Performance', 'running', 0, 'Testing Supabase connection performance...')
      const startTime = performance.now()
      
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.getSession()
        const endTime = performance.now()
        const duration = endTime - startTime
        
        if (error) {
          updatePerformanceTest('Supabase Performance', 'fail', duration, `Supabase error: ${error.message}`)
        } else {
          updatePerformanceTest('Supabase Performance', 'pass', duration, `Supabase connection completed in ${duration.toFixed(2)}ms`)
        }
      } catch (error) {
        const endTime = performance.now()
        const duration = endTime - startTime
        updatePerformanceTest('Supabase Performance', 'fail', duration, `Supabase test error: ${error}`)
      }
    }

    // Test 7: Local Storage Performance
    const testLocalStoragePerformance = () => {
      addPerformanceTest('Local Storage Performance', 'running', 0, 'Testing local storage performance...')
      const startTime = performance.now()
      
      try {
        // Write performance
        const writeStart = performance.now()
        for (let i = 0; i < 100; i++) {
          localStorage.setItem(`test-key-${i}`, `test-value-${i}`)
        }
        const writeEnd = performance.now()
        
        // Read performance
        const readStart = performance.now()
        for (let i = 0; i < 100; i++) {
          localStorage.getItem(`test-key-${i}`)
        }
        const readEnd = performance.now()
        
        // Cleanup
        for (let i = 0; i < 100; i++) {
          localStorage.removeItem(`test-key-${i}`)
        }
        
        const totalTime = performance.now() - startTime
        updatePerformanceTest('Local Storage Performance', 'pass', totalTime, 
          `Local storage test completed in ${totalTime.toFixed(2)}ms (write: ${(writeEnd - writeStart).toFixed(2)}ms, read: ${(readEnd - readStart).toFixed(2)}ms)`)
      } catch (error) {
        updatePerformanceTest('Local Storage Performance', 'fail', 0, `Local storage test error: ${error}`)
      }
    }

    // Test 8: Animation Performance
    const testAnimationPerformance = () => {
      addPerformanceTest('Animation Performance', 'running', 0, 'Testing animation performance...')
      const startTime = performance.now()
      
      try {
        const element = document.createElement('div')
        element.style.position = 'absolute'
        element.style.width = '100px'
        element.style.height = '100px'
        element.style.backgroundColor = 'red'
        element.style.transition = 'transform 0.1s'
        document.body.appendChild(element)
        
        // Animate element
        let position = 0
        const animate = () => {
          position += 10
          element.style.transform = `translateX(${position}px)`
          if (position < 1000) {
            requestAnimationFrame(animate)
          } else {
            document.body.removeChild(element)
            const endTime = performance.now()
            const duration = endTime - startTime
            updatePerformanceTest('Animation Performance', 'pass', duration, `Animation completed in ${duration.toFixed(2)}ms`)
          }
        }
        
        requestAnimationFrame(animate)
      } catch (error) {
        updatePerformanceTest('Animation Performance', 'fail', 0, `Animation test error: ${error}`)
      }
    }

    // Run all tests
    testPageLoad()
    testMemoryUsage()
    testNetworkPerformance()
    testDOMPerformance()
    testJavaScriptPerformance()
    testSupabasePerformance()
    testLocalStoragePerformance()
    testAnimationPerformance()

    // Update render time
    const renderTime = performance.now() - renderStartTime.current
    setMetrics(prev => ({ ...prev, renderTime }))

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

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Ultra-Extensive Performance Testing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="font-semibold">Page Load Time</div>
              <div className="text-2xl text-cyan-400">{metrics.loadTime.toFixed(2)}ms</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="font-semibold">Render Time</div>
              <div className="text-2xl text-purple-400">{metrics.renderTime.toFixed(2)}ms</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="font-semibold">Memory Usage</div>
              <div className="text-2xl text-pink-400">{metrics.memoryUsage.toFixed(2)}MB</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="font-semibold">Network Requests</div>
              <div className="text-2xl text-yellow-400">{metrics.networkRequests}</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Performance Tests</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {performanceTests.map((test, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <span className="text-2xl">{getStatusIcon(test.status)}</span>
                <div className="flex-1">
                  <div className="font-semibold">{test.name}</div>
                  <div className="text-sm text-gray-300">{test.details}</div>
                  {test.duration > 0 && (
                    <div className="text-xs text-gray-400">Duration: {test.duration.toFixed(2)}ms</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Browser Performance Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="font-semibold">User Agent</div>
            <div className="text-sm text-gray-300 break-all">
              {typeof window !== 'undefined' ? navigator.userAgent : 'N/A (SSR)'}
            </div>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="font-semibold">Hardware Concurrency</div>
            <div className="text-sm text-gray-300">
              {typeof window !== 'undefined' ? navigator.hardwareConcurrency : 'N/A (SSR)'}
            </div>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="font-semibold">Connection Type</div>
            <div className="text-sm text-gray-300">
              {typeof window !== 'undefined' && (navigator as unknown as { connection?: { effectiveType: string } }).connection 
                ? (navigator as unknown as { connection: { effectiveType: string } }).connection.effectiveType 
                : 'N/A (SSR)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
