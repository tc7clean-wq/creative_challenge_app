// Advanced caching system with Redis-like functionality
interface CacheEntry<T = unknown> {
  value: T
  expiresAt: number
  tags: string[]
  metadata: {
    createdAt: number
    accessCount: number
    lastAccessed: number
  }
}

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  tags?: string[] // Tags for cache invalidation
  maxSize?: number // Maximum cache size
}

class CacheManager {
  private cache = new Map<string, CacheEntry>()
  private maxSize: number
  private defaultTTL: number

  constructor(maxSize = 1000, defaultTTL = 300000) { // 5 minutes default
    this.maxSize = maxSize
    this.defaultTTL = defaultTTL
    this.startCleanupInterval()
  }

  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    const ttl = options.ttl || this.defaultTTL
    const expiresAt = Date.now() + ttl
    const tags = options.tags || []
    
    const entry: CacheEntry<T> = {
      value,
      expiresAt,
      tags,
      metadata: {
        createdAt: Date.now(),
        accessCount: 0,
        lastAccessed: Date.now()
      }
    }

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }

    this.cache.set(key, entry)
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    // Update access metadata
    entry.metadata.accessCount++
    entry.metadata.lastAccessed = Date.now()

    return entry.value as T
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  invalidateByTag(tag: string): void {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key)
      }
    }
  }

  invalidateByTags(tags: string[]): void {
    for (const [key, entry] of this.cache.entries()) {
      if (tags.some(tag => entry.tags.includes(tag))) {
        this.cache.delete(key)
      }
    }
  }

  getStats(): {
    size: number
    maxSize: number
    hitRate: number
    totalAccesses: number
    oldestEntry: number
    newestEntry: number
  } {
    let totalAccesses = 0
    let oldestEntry = Date.now()
    let newestEntry = 0

    for (const entry of this.cache.values()) {
      totalAccesses += entry.metadata.accessCount
      oldestEntry = Math.min(oldestEntry, entry.metadata.createdAt)
      newestEntry = Math.max(newestEntry, entry.metadata.createdAt)
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: totalAccesses > 0 ? totalAccesses / (totalAccesses + this.cache.size) : 0,
      totalAccesses,
      oldestEntry,
      newestEntry
    }
  }

  private evictOldest(): void {
    let oldestKey = ''
    let oldestTime = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.metadata.lastAccessed < oldestTime) {
        oldestTime = entry.metadata.lastAccessed
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanup()
    }, 60000) // Cleanup every minute
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }
}

// Global cache instance
export const cache = new CacheManager()

// React hook for caching (requires React import in component)
export function createUseCacheHook(React: unknown) {
  return function useCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): {
    data: T | null
    loading: boolean
    error: Error | null
    refetch: () => Promise<void>
  } {
    const [data, setData] = React.useState<T | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<Error | null>(null)

    const fetchData = React.useCallback(async () => {
      // Check cache first
      const cached = cache.get<T>(key)
      if (cached) {
        setData(cached)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const result = await fetcher()
        setData(result)
        cache.set(key, result, options)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }, [key, fetcher, options])

    React.useEffect(() => {
      fetchData()
    }, [fetchData])

    return {
      data,
      loading,
      error,
      refetch: fetchData
    }
  }
}

// Utility functions
export function createCacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.join(':')}`
}

export function withCache<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  keyGenerator: (...args: T) => string,
  options: CacheOptions = {}
) {
  return async (...args: T): Promise<R> => {
    const key = keyGenerator(...args)
    
    // Check cache first
    const cached = cache.get<R>(key)
    if (cached) {
      return cached
    }

    // Execute function and cache result
    const result = await fn(...args)
    cache.set(key, result, options)
    return result
  }
}

export type { CacheEntry, CacheOptions }