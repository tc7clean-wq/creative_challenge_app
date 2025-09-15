// Progressive Web App functionality
interface PWAConfig {
  name: string
  shortName: string
  description: string
  themeColor: string
  backgroundColor: string
  display: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser'
  orientation: 'portrait' | 'landscape' | 'any'
  startUrl: string
  scope: string
  icons: Array<{
    src: string
    sizes: string
    type: string
    purpose?: 'any' | 'maskable' | 'monochrome'
  }>
}

class PWAManager {
  private config: PWAConfig
  private deferredPrompt: unknown | null = null
  private isInstalled = false

  constructor(config: PWAConfig) {
    this.config = config
    this.setupEventListeners()
    this.checkInstallStatus()
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.deferredPrompt = e as BeforeInstallPromptEvent
    })

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true
      this.deferredPrompt = null
      console.log('PWA was installed')
    })

    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
    }
  }

  private checkInstallStatus(): void {
    if (typeof window === 'undefined') return

    // Check if app is running in standalone mode
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone === true
  }

  async install(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('PWA install prompt not available')
      return false
    }

    try {
      this.deferredPrompt.prompt()
      const { outcome } = await this.deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('PWA install accepted')
        return true
      } else {
        console.log('PWA install dismissed')
        return false
      }
    } catch (error) {
      console.error('PWA install failed:', error)
      return false
    }
  }

  canInstall(): boolean {
    return this.deferredPrompt !== null && !this.isInstalled
  }

  isAppInstalled(): boolean {
    return this.isInstalled
  }

  async registerServiceWorker(): Promise<boolean> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
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

  async updateServiceWorker(): Promise<boolean> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return false
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        return true
      }
      return false
    } catch (error) {
      console.error('Service Worker update failed:', error)
      return false
    }
  }

  async unregisterServiceWorker(): Promise<boolean> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return false
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(registrations.map(registration => registration.unregister()))
      console.log('Service Workers unregistered')
      return true
    } catch (error) {
      console.error('Service Worker unregistration failed:', error)
      return false
    }
  }

  getManifest(): PWAConfig {
    return this.config
  }

  generateManifest(): string {
    return JSON.stringify({
      name: this.config.name,
      short_name: this.config.shortName,
      description: this.config.description,
      theme_color: this.config.themeColor,
      background_color: this.config.backgroundColor,
      display: this.config.display,
      orientation: this.config.orientation,
      start_url: this.config.startUrl,
      scope: this.config.scope,
      icons: this.config.icons
    }, null, 2)
  }
}

// Default PWA configuration
const defaultConfig: PWAConfig = {
  name: 'AI ArtVerse',
  shortName: 'ArtVerse',
  description: 'Where artificial intelligence meets creative expression',
  themeColor: '#00f7ff',
  backgroundColor: '#0a0a0a',
  display: 'standalone',
  orientation: 'any',
  startUrl: '/',
  scope: '/',
  icons: [
    {
      src: '/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/icon-maskable.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable'
    }
  ]
}

// Global PWA manager instance
export const pwaManager = new PWAManager(defaultConfig)

// React hook for PWA functionality (requires React import in component)
export function createUsePWAHook(React: unknown) {
  return function usePWA() {
    const [canInstall, setCanInstall] = React.useState(false)
    const [isInstalled, setIsInstalled] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    React.useEffect(() => {
      setCanInstall(pwaManager.canInstall())
      setIsInstalled(pwaManager.isAppInstalled())

      const checkInstallStatus = () => {
        setCanInstall(pwaManager.canInstall())
        setIsInstalled(pwaManager.isAppInstalled())
      }

      window.addEventListener('beforeinstallprompt', checkInstallStatus)
      window.addEventListener('appinstalled', checkInstallStatus)

      return () => {
        window.removeEventListener('beforeinstallprompt', checkInstallStatus)
        window.removeEventListener('appinstalled', checkInstallStatus)
      }
    }, [])

    const install = async () => {
      setIsLoading(true)
      try {
        const success = await pwaManager.install()
        if (success) {
          setCanInstall(false)
          setIsInstalled(true)
        }
        return success
      } finally {
        setIsLoading(false)
      }
    }

    const registerServiceWorker = async () => {
      setIsLoading(true)
      try {
        return await pwaManager.registerServiceWorker()
      } finally {
        setIsLoading(false)
      }
    }

    return {
      canInstall,
      isInstalled,
      isLoading,
      install,
      registerServiceWorker
    }
  }
}

// Utility functions
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true
}

export function isOnline(): boolean {
  if (typeof window === 'undefined') return true
  return navigator.onLine
}

export function getConnectionType(): string {
  if (typeof window === 'undefined') return 'unknown'
  const connection = (navigator as unknown as { connection?: { effectiveType?: string } }).connection
  return connection?.effectiveType || 'unknown'
}

// Type definitions
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type { PWAConfig, BeforeInstallPromptEvent }