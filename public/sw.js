// Advanced Service Worker with intelligent caching and offline support
const CACHE_NAME = 'ai-artverse-v2'
const STATIC_CACHE = 'ai-artverse-static-v2'
const DYNAMIC_CACHE = 'ai-artverse-dynamic-v2'
const IMAGE_CACHE = 'ai-artverse-images-v2'

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/gallery',
  '/contests',
  '/auth',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// Cache strategies for different content types
const CACHE_STRATEGIES = {
  // Cache first, then network
  CACHE_FIRST: 'cache-first',
  // Network first, then cache
  NETWORK_FIRST: 'network-first',
  // Cache only
  CACHE_ONLY: 'cache-only',
  // Network only
  NETWORK_ONLY: 'network-only',
  // Stale while revalidate
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting()
      })
  )
})

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        const deletePromises = cacheNames
          .filter(cacheName =>
            cacheName !== CACHE_NAME &&
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE &&
            cacheName !== IMAGE_CACHE
          )
          .map(cacheName => caches.delete(cacheName))

        return Promise.all(deletePromises)
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim()
      })
  )
})

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return
  }

  // Skip requests to external domains (except images)
  if (url.origin !== self.location.origin && !isImageRequest(request)) {
    return
  }

  event.respondWith(handleRequest(request))
})

// Background sync for offline submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-submissions') {
    event.waitUntil(syncSubmissions())
  }

  if (event.tag === 'background-sync-votes') {
    event.waitUntil(syncVotes())
  }
})

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New activity in AI ArtVerse!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Gallery',
        icon: '/icons/gallery-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close-96x96.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('AI ArtVerse', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/gallery')
    )
  } else if (event.action === 'close') {
    // Just close the notification
    return
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Handle requests with intelligent caching
async function handleRequest(request) {
  const url = new URL(request.url)

  try {
    // API requests - network first with cache fallback
    if (url.pathname.startsWith('/api/')) {
      return await networkFirstStrategy(request, DYNAMIC_CACHE)
    }

    // Images - cache first with network fallback
    if (isImageRequest(request)) {
      return await cacheFirstStrategy(request, IMAGE_CACHE)
    }

    // Static assets - cache first
    if (isStaticAsset(url.pathname)) {
      return await cacheFirstStrategy(request, STATIC_CACHE)
    }

    // HTML pages - stale while revalidate
    if (request.headers.get('accept')?.includes('text/html')) {
      return await staleWhileRevalidateStrategy(request, DYNAMIC_CACHE)
    }

    // Everything else - network first
    return await networkFirstStrategy(request, DYNAMIC_CACHE)

  } catch (error) {
    console.error('Service Worker: Request failed', error)

    // Return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return await caches.match('/offline')
    }

    // Return cached version if available
    return await caches.match(request)
  }
}

// Cache first strategy
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    // Update cache in background if stale
    updateCacheInBackground(request, cache)
    return cachedResponse
  }

  const networkResponse = await fetch(request)

  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone())
  }

  return networkResponse
}

// Network first strategy
async function networkFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName)

  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok && request.method === 'GET') {
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    throw error
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)

  // Always try to fetch fresh content
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  }).catch(() => {
    // Network failed, but we might have cache
    return cachedResponse
  })

  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse
  }

  // Wait for network if no cache
  return fetchPromise
}

// Update cache in background
async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
  } catch (error) {
    // Silently fail background updates
    console.log('Background cache update failed:', error)
  }
}

// Utility functions
function isImageRequest(request) {
  return request.headers.get('accept')?.includes('image/') ||
         /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|$)/i.test(request.url)
}

function isStaticAsset(pathname) {
  return /\.(js|css|woff|woff2|ttf|ico)$/.test(pathname) ||
         pathname.startsWith('/_next/static/') ||
         pathname === '/manifest.json'
}

// Background sync for offline submissions
async function syncSubmissions() {
  try {
    const submissions = await getStoredSubmissions()

    for (const submission of submissions) {
      try {
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submission.data)
        })

        if (response.ok) {
          await removeStoredSubmission(submission.id)
          await showSuccessNotification('Submission uploaded successfully!')
        }
      } catch (error) {
        console.error('Failed to sync submission:', error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Background sync for offline votes
async function syncVotes() {
  try {
    const votes = await getStoredVotes()

    for (const vote of votes) {
      try {
        const response = await fetch('/api/votes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vote.data)
        })

        if (response.ok) {
          await removeStoredVote(vote.id)
        }
      } catch (error) {
        console.error('Failed to sync vote:', error)
      }
    }
  } catch (error) {
    console.error('Vote sync failed:', error)
  }
}

// IndexedDB helpers for offline storage
async function getStoredSubmissions() {
  // This would interface with IndexedDB to get pending submissions
  return []
}

async function removeStoredSubmission(id) {
  // Remove synced submission from IndexedDB
}

async function getStoredVotes() {
  // Get pending votes from IndexedDB
  return []
}

async function removeStoredVote(id) {
  // Remove synced vote from IndexedDB
}

async function showSuccessNotification(message) {
  await self.registration.showNotification('AI ArtVerse', {
    body: message,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png'
  })
}

// Cleanup old caches periodically
setInterval(async () => {
  const cacheNames = await caches.keys()
  const oldCaches = cacheNames.filter(name =>
    name.includes('ai-artverse') &&
    !name.includes('v2')
  )

  await Promise.all(
    oldCaches.map(cacheName => caches.delete(cacheName))
  )
}, 24 * 60 * 60 * 1000) // Once per day