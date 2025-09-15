// Advanced Performance Optimization System
interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
  tti: number // Time to Interactive
}

interface OptimizationConfig {
  enableImageOptimization: boolean
  enableCodeSplitting: boolean
  enablePrefetching: boolean
  enableServiceWorker: boolean
  enableCompression: boolean
  enableCaching: boolean
}

class PerformanceOptimizer {
  private metrics: PerformanceMetrics = {
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    tti: 0
  }

  private config: OptimizationConfig = {
    enableImageOptimization: true,
    enableCodeSplitting: true,
    enablePrefetching: true,
    enableServiceWorker: true,
    enableCompression: true,
    enableCaching: true
  }

  // Image optimization with WebP/AVIF support
  optimizeImage(src: string, options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'jpeg' | 'png'
  } = {}): string {
    if (!this.config.enableImageOptimization) return src

    const { width, height, quality = 80, format = 'webp' } = options
    const params = new URLSearchParams()
    
    if (width) params.append('w', width.toString())
    if (height) params.append('h', height.toString())
    params.append('q', quality.toString())
    params.append('f', format)

    return `${src}?${params.toString()}`
  }

  // Lazy loading with intersection observer
  createLazyLoader(): IntersectionObserver {
    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
            img.classList.add('loaded')
          }
        }
      })
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    })
  }

  // Prefetch critical resources
  prefetchCriticalResources(urls: string[]): void {
    if (!this.config.enablePrefetching) return

    urls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = url
      document.head.appendChild(link)
    })
  }

  // Preload critical resources
  preloadCriticalResources(resources: Array<{ href: string; as: string; type?: string }>): void {
    resources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.href
      link.as = resource.as
      if (resource.type) link.type = resource.type
      document.head.appendChild(link)
    })
  }

  // Bundle splitting for code optimization
  createCodeSplitter() {
    return {
      // Dynamic imports for route-based splitting
      loadRoute: (route: string) => import(`../app/${route}/page`),
      
      // Component-based splitting
      loadComponent: (component: string) => import(`../components/${component}`),
      
      // Library splitting
      loadLibrary: (library: string) => import(library)
    }
  }

  // Service Worker for caching
  async registerServiceWorker(): Promise<boolean> {
    if (!this.config.enableServiceWorker || !('serviceWorker' in navigator)) {
      return false
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', registration)
      return true
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return false
    }
  }

  // Performance monitoring
  measurePerformance(): PerformanceMetrics {
    if (typeof window === 'undefined') return this.metrics

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime
            }
            break
          case 'largest-contentful-paint':
            this.metrics.lcp = entry.startTime
            break
          case 'first-input':
            this.metrics.fid = (entry as any).processingStart - entry.startTime
            break
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              this.metrics.cls += (entry as any).value
            }
            break
        }
      }
    })

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] })

    return this.metrics
  }

  // Resource hints for faster loading
  addResourceHints(): void {
    const hints = [
      { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      { rel: 'dns-prefetch', href: 'https://yrbbqxdimyqdfmezxmgp.supabase.co' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'preconnect', href: 'https://yrbbqxdimyqdfmezxmgp.supabase.co' }
    ]

    hints.forEach(hint => {
      const link = document.createElement('link')
      link.rel = hint.rel
      link.href = hint.href
      document.head.appendChild(link)
    })
  }

  // Critical CSS inlining
  inlineCriticalCSS(css: string): void {
    const style = document.createElement('style')
    style.textContent = css
    style.setAttribute('data-critical', 'true')
    document.head.insertBefore(style, document.head.firstChild)
  }

  // Bundle analyzer for optimization insights
  analyzeBundle(): {
    totalSize: number
    chunkSizes: Record<string, number>
    recommendations: string[]
  } {
    const recommendations: string[] = []
    
    // Analyze bundle size
    const scripts = Array.from(document.querySelectorAll('script[src]'))
    const totalSize = scripts.reduce((size, script) => {
      const src = script.getAttribute('src')
      if (src && src.includes('_next/static')) {
        // Estimate size based on URL patterns
        return size + 50000 // Rough estimate
      }
      return size
    }, 0)

    if (totalSize > 500000) {
      recommendations.push('Consider code splitting to reduce initial bundle size')
    }

    if (scripts.length > 10) {
      recommendations.push('Too many script tags - consider bundling')
    }

    return {
      totalSize,
      chunkSizes: {},
      recommendations
    }
  }
}

// Global performance optimizer
export const performanceOptimizer = new PerformanceOptimizer()

// React hook for performance optimization
export function usePerformanceOptimization() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null)

  React.useEffect(() => {
    const measure = () => {
      const newMetrics = performanceOptimizer.measurePerformance()
      setMetrics(newMetrics)
    }

    // Measure after page load
    if (document.readyState === 'complete') {
      measure()
    } else {
      window.addEventListener('load', measure)
    }

    return () => {
      window.removeEventListener('load', measure)
    }
  }, [])

  return {
    metrics,
    optimizeImage: performanceOptimizer.optimizeImage.bind(performanceOptimizer),
    prefetchResources: performanceOptimizer.prefetchCriticalResources.bind(performanceOptimizer),
    preloadResources: performanceOptimizer.preloadCriticalResources.bind(performanceOptimizer)
  }
}

export type { PerformanceMetrics, OptimizationConfig }
