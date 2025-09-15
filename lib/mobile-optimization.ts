// Mobile and PWA Optimization System
interface MobileConfig {
  enableTouchGestures: boolean
  enableHapticFeedback: boolean
  enableOfflineMode: boolean
  enablePushNotifications: boolean
  enableBackgroundSync: boolean
  enableInstallPrompt: boolean
}

interface TouchGesture {
  type: 'swipe' | 'pinch' | 'tap' | 'longpress' | 'doubletap'
  direction?: 'left' | 'right' | 'up' | 'down'
  threshold: number
  callback: () => void
}

interface OfflineData {
  key: string
  data: unknown
  timestamp: number
  expiresAt?: number
}

class MobileOptimizer {
  private config: MobileConfig
  private touchGestures: Map<string, TouchGesture> = new Map()
  private offlineData = new Map<string, OfflineData>()
  private serviceWorker: ServiceWorker | null = null
  private isOnline = navigator.onLine

  constructor() {
    this.config = {
      enableTouchGestures: true,
      enableHapticFeedback: true,
      enableOfflineMode: true,
      enablePushNotifications: true,
      enableBackgroundSync: true,
      enableInstallPrompt: true
    }

    this.setupMobileFeatures()
    this.setupOfflineMode()
    this.setupPushNotifications()
  }

  // Touch gesture handling
  addTouchGesture(gesture: TouchGesture): string {
    const id = `gesture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.touchGestures.set(id, gesture)
    return id
  }

  removeTouchGesture(id: string): void {
    this.touchGestures.delete(id)
  }

  // Haptic feedback
  triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'medium'): void {
    if (!this.config.enableHapticFeedback) return

    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [50],
        heavy: [100, 50, 100]
      }
      navigator.vibrate(patterns[type])
    }
  }

  // Offline data management
  storeOfflineData(key: string, data: unknown, ttl?: number): void {
    if (!this.config.enableOfflineMode) return

    const offlineData: OfflineData = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: ttl ? Date.now() + ttl : undefined
    }

    this.offlineData.set(key, offlineData)
    localStorage.setItem(`offline_${key}`, JSON.stringify(offlineData))
  }

  getOfflineData(key: string): unknown | null {
    if (!this.config.enableOfflineMode) return null

    const cached = this.offlineData.get(key)
    if (cached) {
      if (cached.expiresAt && Date.now() > cached.expiresAt) {
        this.offlineData.delete(key)
        localStorage.removeItem(`offline_${key}`)
        return null
      }
      return cached.data
    }

    // Try to load from localStorage
    const stored = localStorage.getItem(`offline_${key}`)
    if (stored) {
      try {
        const offlineData = JSON.parse(stored) as OfflineData
        if (!offlineData.expiresAt || Date.now() <= offlineData.expiresAt) {
          this.offlineData.set(key, offlineData)
          return offlineData.data
        }
      } catch (error) {
        console.error('Failed to parse offline data:', error)
      }
    }

    return null
  }

  // Background sync
  async registerBackgroundSync(tag: string, data: unknown): Promise<void> {
    if (!this.config.enableBackgroundSync || !('serviceWorker' in navigator)) return

    try {
      const registration = await navigator.serviceWorker.ready
      await registration.sync.register(tag)
      
      // Store data for background sync
      this.storeOfflineData(`sync_${tag}`, data)
    } catch (error) {
      console.error('Background sync registration failed:', error)
    }
  }

  // Push notifications
  async requestNotificationPermission(): Promise<boolean> {
    if (!this.config.enablePushNotifications || !('Notification' in window)) {
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  async sendNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    if (!this.config.enablePushNotifications || !('Notification' in window)) return

    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options
      })
    }
  }

  // PWA installation
  async installPWA(): Promise<boolean> {
    if (!this.config.enableInstallPrompt) return false

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return false
    }

    // Check if install prompt is available
    if ('BeforeInstallPromptEvent' in window) {
      const event = (window as any).beforeInstallPromptEvent
      if (event) {
        event.prompt()
        const { outcome } = await event.userChoice
        return outcome === 'accepted'
      }
    }

    return false
  }

  // Mobile-specific optimizations
  optimizeForMobile(): void {
    // Prevent zoom on input focus
    const viewport = document.querySelector('meta[name="viewport"]')
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      )
    }

    // Add touch-friendly classes
    document.body.classList.add('touch-device')

    // Optimize images for mobile
    this.optimizeImagesForMobile()

    // Add mobile-specific CSS
    this.addMobileCSS()
  }

  // Performance optimizations for mobile
  optimizePerformance(): void {
    // Lazy load images
    this.setupLazyLoading()

    // Preload critical resources
    this.preloadCriticalResources()

    // Optimize animations for mobile
    this.optimizeAnimations()

    // Reduce memory usage
    this.optimizeMemoryUsage()
  }

  // Network optimization
  optimizeNetwork(): void {
    // Detect connection type
    const connection = (navigator as any).connection || (navigator as any).mozConnection
    if (connection) {
      const isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'
      
      if (isSlowConnection) {
        // Reduce image quality
        this.reduceImageQuality()
        
        // Disable non-essential features
        this.disableNonEssentialFeatures()
        
        // Enable aggressive caching
        this.enableAggressiveCaching()
      }
    }
  }

  // Get mobile device info
  getDeviceInfo(): {
    isMobile: boolean
    isTablet: boolean
    isTouchDevice: boolean
    platform: string
    userAgent: string
    screenSize: { width: number; height: number }
    orientation: 'portrait' | 'landscape'
  } {
    const userAgent = navigator.userAgent
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const isTablet = /iPad|Android(?=.*Mobile)/i.test(userAgent)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    return {
      isMobile,
      isTablet,
      isTouchDevice,
      platform: navigator.platform,
      userAgent,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height
      },
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
    }
  }

  private setupMobileFeatures(): void {
    // Setup touch event listeners
    if (this.config.enableTouchGestures) {
      this.setupTouchEventListeners()
    }

    // Setup orientation change handling
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange()
      }, 100)
    })

    // Setup online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true
      this.handleOnlineStatusChange(true)
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.handleOnlineStatusChange(false)
    })
  }

  private setupOfflineMode(): void {
    if (!this.config.enableOfflineMode) return

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          this.serviceWorker = registration.active
        })
        .catch(error => {
          console.error('Service worker registration failed:', error)
        })
    }
  }

  private setupPushNotifications(): void {
    if (!this.config.enablePushNotifications) return

    // Setup push event listener
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'PUSH_NOTIFICATION') {
          this.sendNotification(event.data.title, event.data.options)
        }
      })
    }
  }

  private setupTouchEventListeners(): void {
    let startX = 0
    let startY = 0
    let startTime = 0

    document.addEventListener('touchstart', (event) => {
      const touch = event.touches[0]
      startX = touch.clientX
      startY = touch.clientY
      startTime = Date.now()
    })

    document.addEventListener('touchend', (event) => {
      const touch = event.changedTouches[0]
      const endX = touch.clientX
      const endY = touch.clientY
      const endTime = Date.now()

      const deltaX = endX - startX
      const deltaY = endY - startY
      const deltaTime = endTime - startTime

      // Detect swipe gestures
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        const direction = deltaX > 0 ? 'right' : 'left'
        this.triggerGesture('swipe', direction)
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        const direction = deltaY > 0 ? 'down' : 'up'
        this.triggerGesture('swipe', direction)
      }

      // Detect tap gestures
      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        if (deltaTime < 200) {
          this.triggerGesture('tap')
        } else if (deltaTime > 500) {
          this.triggerGesture('longpress')
        }
      }
    })
  }

  private triggerGesture(type: string, direction?: string): void {
    this.touchGestures.forEach(gesture => {
      if (gesture.type === type && (!direction || gesture.direction === direction)) {
        gesture.callback()
      }
    })
  }

  private handleOrientationChange(): void {
    // Recalculate layouts and adjust UI
    this.optimizeForMobile()
  }

  private handleOnlineStatusChange(isOnline: boolean): void {
    if (isOnline) {
      // Sync offline data
      this.syncOfflineData()
    } else {
      // Show offline indicator
      this.showOfflineIndicator()
    }
  }

  private optimizeImagesForMobile(): void {
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      // Add loading="lazy" for better performance
      img.setAttribute('loading', 'lazy')
      
      // Add mobile-optimized sizes
      img.setAttribute('sizes', '(max-width: 768px) 100vw, 50vw')
    })
  }

  private addMobileCSS(): void {
    const style = document.createElement('style')
    style.textContent = `
      .touch-device * {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      .touch-device input,
      .touch-device textarea {
        -webkit-user-select: text;
        -khtml-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      
      @media (max-width: 768px) {
        .mobile-hidden { display: none !important; }
        .mobile-full-width { width: 100% !important; }
        .mobile-text-center { text-align: center !important; }
      }
    `
    document.head.appendChild(style)
  }

  private setupLazyLoading(): void {
    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src!
          img.removeAttribute('data-src')
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach(img => imageObserver.observe(img))
  }

  private preloadCriticalResources(): void {
    const criticalResources = [
      { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2' },
      { href: '/css/critical.css', as: 'style' }
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.href
      link.as = resource.as
      if (resource.type) link.type = resource.type
      document.head.appendChild(link)
    })
  }

  private optimizeAnimations(): void {
    // Use transform and opacity for better performance
    const style = document.createElement('style')
    style.textContent = `
      * {
        will-change: auto;
      }
      
      .animate {
        will-change: transform, opacity;
      }
      
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `
    document.head.appendChild(style)
  }

  private optimizeMemoryUsage(): void {
    // Clean up unused event listeners
    window.addEventListener('beforeunload', () => {
      this.touchGestures.clear()
      this.offlineData.clear()
    })
  }

  private reduceImageQuality(): void {
    // Add low-quality image class
    document.body.classList.add('low-quality-images')
  }

  private disableNonEssentialFeatures(): void {
    // Disable animations on slow connections
    document.body.classList.add('no-animations')
  }

  private enableAggressiveCaching(): void {
    // Enable aggressive caching for slow connections
    document.body.classList.add('aggressive-cache')
  }

  private syncOfflineData(): void {
    // Sync offline data when back online
    this.offlineData.forEach((data, key) => {
      if (key.startsWith('sync_')) {
        // Send to server
        this.sendToServer(key, data.data)
      }
    })
  }

  private showOfflineIndicator(): void {
    // Show offline indicator
    const indicator = document.createElement('div')
    indicator.className = 'offline-indicator'
    indicator.textContent = 'You are offline. Some features may be limited.'
    document.body.appendChild(indicator)
  }

  private async sendToServer(key: string, data: unknown): Promise<void> {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key, data })
      })
    } catch (error) {
      console.error('Failed to sync data:', error)
    }
  }
}

// Global mobile optimizer
export const mobileOptimizer = new MobileOptimizer()

// React hook for mobile optimization
export function useMobileOptimization() {
  const [deviceInfo, setDeviceInfo] = React.useState(mobileOptimizer.getDeviceInfo())
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)

  React.useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(mobileOptimizer.getDeviceInfo())
    }

    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [])

  const addTouchGesture = React.useCallback((gesture: TouchGesture) => {
    return mobileOptimizer.addTouchGesture(gesture)
  }, [])

  const triggerHaptic = React.useCallback((type: 'light' | 'medium' | 'heavy' = 'medium') => {
    mobileOptimizer.triggerHapticFeedback(type)
  }, [])

  const storeOffline = React.useCallback((key: string, data: unknown, ttl?: number) => {
    mobileOptimizer.storeOfflineData(key, data, ttl)
  }, [])

  const getOffline = React.useCallback((key: string) => {
    return mobileOptimizer.getOfflineData(key)
  }, [])

  return {
    deviceInfo,
    isOnline,
    addTouchGesture,
    triggerHaptic,
    storeOffline,
    getOffline
  }
}

export type { MobileConfig, TouchGesture, OfflineData }
