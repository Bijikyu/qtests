/**
 * Scalable Caching Utilities
 * Multi-layer caching with LRU, TTL, and memory management for optimal performance
 */

import { EventEmitter } from 'events';

export interface CacheEntry<T = any> {
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
}

export interface CacheConfig {
  maxSize: number;
  defaultTtl: number;
  cleanupIntervalMs: number;
  enableStats: boolean;
  enableCompression: boolean;
  compressionThreshold: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions: number;
  size: number;
  hitRate: number;
  averageAccessTime: number;
  memoryUsage: number;
}

export interface CacheLayer {
  name: string;
  get: (key: string) => Promise<any>;
  set: (key: string, value: any, ttl?: number) => Promise<void>;
  delete: (key: string) => Promise<boolean>;
  clear: () => Promise<void>;
  has: (key: string) => Promise<boolean>;
}

/**
 * Advanced LRU Cache with TTL and memory management
 */
export class AdvancedCache<T = any> extends EventEmitter {
  private cache = new Map<string, CacheEntry<T>>();
  private accessOrder = new Map<string, number>();
  private config: Required<CacheConfig>;
  private stats: CacheStats;
  private cleanupInterval?: NodeJS.Timeout;
  private accessCounter = 0;
  private totalAccessTime = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    super();
    
    this.config = {
      maxSize: config.maxSize || 1000,
      defaultTtl: config.defaultTtl || 300000, // 5 minutes
      cleanupIntervalMs: config.cleanupIntervalMs || 60000, // 1 minute
      enableStats: config.enableStats ?? true,
      enableCompression: config.enableCompression ?? false,
      compressionThreshold: config.compressionThreshold || 1024
    };

    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0,
      size: 0,
      hitRate: 0,
      averageAccessTime: 0,
      memoryUsage: 0
    };

    this.startCleanup();
  }

  /**
   * Get value from cache
   */
  async get(key: string): Promise<T | undefined> {
    const startTime = Date.now();
    
    try {
      const entry = this.cache.get(key);
      
      if (!entry) {
        this.recordMiss();
        return undefined;
      }

      // Check TTL
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        this.accessOrder.delete(key);
        this.recordMiss();
        this.recordEviction();
        return undefined;
      }

      // Update access statistics
      entry.accessCount++;
      entry.lastAccessed = Date.now();
      this.accessOrder.set(key, ++this.accessCounter);
      
      this.recordHit();
      this.emit('cache:hit', { key, value: entry.value });
      
      return entry.value;
    } finally {
      this.recordAccessTime(Date.now() - startTime);
    }
  }

  /**
   * Set value in cache with optional TTL
   */
  async set(key: string, value: T, ttl?: number): Promise<void> {
    const actualTtl = ttl || this.config.defaultTtl;
    const size = this.calculateSize(value);
    
    // Check if we need to evict entries
    await this.ensureCapacity(size);
    
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: actualTtl,
      accessCount: 0,
      lastAccessed: Date.now(),
      size
    };

    this.cache.set(key, entry);
    this.accessOrder.set(key, ++this.accessCounter);
    
    this.recordSet();
    this.updateStats();
    this.emit('cache:set', { key, value, ttl: actualTtl });
  }

  /**
   * Delete entry from cache
   */
  async delete(key: string): Promise<boolean> {
    const deleted = this.cache.delete(key);
    this.accessOrder.delete(key);
    
    if (deleted) {
      this.recordDelete();
      this.updateStats();
      this.emit('cache:delete', { key });
    }
    
    return deleted;
  }

  /**
   * Check if key exists and is not expired
   */
  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    return entry ? !this.isExpired(entry) : false;
  }

  /**
   * Clear all entries
   */
  async clear(): Promise<void> {
    const size = this.cache.size;
    this.cache.clear();
    this.accessOrder.clear();
    
    this.stats.deletes += size;
    this.updateStats();
    this.emit('cache:clear', { clearedEntries: size });
  }

  /**
   * Get multiple values
   */
  async mget(keys: string[]): Promise<Map<string, T | undefined>> {
    const results = new Map<string, T | undefined>();
    
    // Process keys in parallel batches
    const batchSize = 50;
    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);
      const batchPromises = batch.map(async (key) => {
        const value = await this.get(key);
        return [key, value] as [string, T | undefined];
      });
      
      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(([key, value]) => results.set(key, value));
    }
    
    return results;
  }

  /**
   * Set multiple values
   */
  async mset(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
    // Process entries in parallel batches
    const batchSize = 50;
    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);
      const batchPromises = batch.map(({ key, value, ttl }) => 
        this.set(key, value, ttl)
      );
      
      await Promise.all(batchPromises);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get cache size and memory usage
   */
  getSize(): { entries: number; memoryBytes: number } {
    let totalSize = 0;
    this.cache.forEach(entry => {
      totalSize += entry.size;
    });
    
    return {
      entries: this.cache.size,
      memoryBytes: totalSize
    };
  }

  /**
   * Get all keys (for debugging/management)
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Force cleanup of expired entries
   */
  async cleanup(): Promise<number> {
    const now = Date.now();
    const toDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        toDelete.push(key);
      }
    });
    
    for (const key of toDelete) {
      this.cache.delete(key);
      this.accessOrder.delete(key);
      this.recordEviction();
    }
    
    if (toDelete.length > 0) {
      this.updateStats();
      this.emit('cache:cleanup', { cleanedEntries: toDelete.length });
    }
    
    return toDelete.length;
  }

  /**
   * Close cache and cleanup resources
   */
  close(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }
    
    this.cache.clear();
    this.accessOrder.clear();
    this.emit('cache:closed');
  }

  private async ensureCapacity(requiredSize: number): Promise<void> {
    const currentSize = this.getSize();
    const maxSizeBytes = this.config.maxSize * 1024 * 1024; // Convert MB to bytes
    
    // Check if we need to evict entries
    while ((currentSize.entries >= this.config.maxSize || 
            currentSize.memoryBytes + requiredSize > maxSizeBytes) && 
           this.cache.size > 0) {
      await this.evictLRU();
    }
  }

  private async evictLRU(): Promise<void> {
    let oldestKey: string | undefined;
    let oldestAccess = Infinity;
    
    this.accessOrder.forEach((accessTime, key) => {
      if (accessTime < oldestAccess) {
        oldestAccess = accessTime;
        oldestKey = key;
      }
    });
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.accessOrder.delete(oldestKey);
      this.recordEviction();
      this.emit('cache:evict', { key: oldestKey });
    }
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private calculateSize(value: T): number {
    // Rough estimation of memory size
    if (value === null || value === undefined) {
      return 0;
    }
    
    if (typeof value === 'string') {
      return value.length * 2; // UTF-16
    }
    
    if (typeof value === 'number') {
      return 8; // 64-bit number
    }
    
    if (typeof value === 'boolean') {
      return 4;
    }
    
    if (value instanceof ArrayBuffer) {
      return value.byteLength;
    }
    
    // For objects, use a rough estimation
    try {
      return JSON.stringify(value).length * 2;
    } catch {
      return 100; // Default size for non-serializable objects
    }
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(async () => {
      await this.cleanup();
    }, this.config.cleanupIntervalMs);
  }

  private recordHit(): void {
    if (this.config.enableStats) {
      this.stats.hits++;
      this.updateHitRate();
    }
  }

  private recordMiss(): void {
    if (this.config.enableStats) {
      this.stats.misses++;
      this.updateHitRate();
    }
  }

  private recordSet(): void {
    if (this.config.enableStats) {
      this.stats.sets++;
    }
  }

  private recordDelete(): void {
    if (this.config.enableStats) {
      this.stats.deletes++;
    }
  }

  private recordEviction(): void {
    if (this.config.enableStats) {
      this.stats.evictions++;
    }
  }

  private recordAccessTime(time: number): void {
    if (this.config.enableStats) {
      this.totalAccessTime += time;
      const totalAccesses = this.stats.hits + this.stats.misses;
      this.stats.averageAccessTime = totalAccesses > 0 ? this.totalAccessTime / totalAccesses : 0;
    }
  }

  private updateHitRate(): void {
    const totalRequests = this.stats.hits + this.stats.misses;
    this.stats.hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
  }

  private updateStats(): void {
    if (this.config.enableStats) {
      const size = this.getSize();
      this.stats.size = size.entries;
      this.stats.memoryUsage = size.memoryBytes;
    }
  }
}

/**
 * Multi-layer cache with L1 (memory) and L2 (optional persistent) caching
 */
export class MultiLayerCache<T = any> extends EventEmitter {
  private l1Cache: AdvancedCache<T>;
  private l2Cache?: CacheLayer;
  private l2HitRate = 0;

  constructor(
    l1Config: Partial<CacheConfig> = {},
    l2Cache?: CacheLayer
  ) {
    super();
    
    this.l1Cache = new AdvancedCache<T>(l1Config);
    this.l2Cache = l2Cache;
    
    // Forward L1 events
    this.l1Cache.on('cache:hit', (event) => this.emit('l1:hit', event));
    this.l1Cache.on('cache:miss', (event) => this.emit('l1:miss', event));
    this.l1Cache.on('cache:set', (event) => this.emit('l1:set', event));
  }

  async get(key: string): Promise<T | undefined> {
    // Try L1 cache first
    let value = await this.l1Cache.get(key);
    
    if (value !== undefined) {
      return value;
    }
    
    // Try L2 cache if available
    if (this.l2Cache) {
      try {
        value = await this.l2Cache.get(key);
        
        if (value !== undefined) {
          // Promote to L1 cache
          await this.l1Cache.set(key, value);
          this.l2HitRate = (this.l2HitRate * 0.9) + 10; // Update moving average
          this.emit('l2:hit', { key, value });
          return value;
        }
      } catch (error) {
        console.warn('L2 cache error:', error);
      }
    }
    
    return undefined;
  }

  async set(key: string, value: T, ttl?: number): Promise<void> {
    // Set in L1 cache
    await this.l1Cache.set(key, value, ttl);
    
    // Set in L2 cache if available
    if (this.l2Cache) {
      try {
        await this.l2Cache.set(key, value, ttl);
        this.emit('l2:set', { key, value, ttl });
      } catch (error) {
        console.warn('L2 cache set error:', error);
      }
    }
  }

  async delete(key: string): Promise<boolean> {
    const l1Deleted = await this.l1Cache.delete(key);
    let l2Deleted = true;
    
    if (this.l2Cache) {
      try {
        l2Deleted = await this.l2Cache.delete(key);
      } catch (error) {
        console.warn('L2 cache delete error:', error);
      }
    }
    
    return l1Deleted || l2Deleted;
  }

  async clear(): Promise<void> {
    await this.l1Cache.clear();
    
    if (this.l2Cache) {
      try {
        await this.l2Cache.clear();
      } catch (error) {
        console.warn('L2 cache clear error:', error);
      }
    }
  }

  async has(key: string): Promise<boolean> {
    const l1Has = await this.l1Cache.has(key);
    
    if (l1Has) {
      return true;
    }
    
    if (this.l2Cache) {
      try {
        return await this.l2Cache.has(key);
      } catch (error) {
        console.warn('L2 cache has error:', error);
      }
    }
    
    return false;
  }

  getStats(): { l1: CacheStats; l2HitRate: number } {
    return {
      l1: this.l1Cache.getStats(),
      l2HitRate: this.l2HitRate
    };
  }

  close(): void {
    // Remove all event listeners to prevent memory leaks
    this.removeAllListeners();
    
    if (this.l1Cache) {
      this.l1Cache.close();
    }
    
    this.emit('cache:closed');
  }
}

/**
 * Cache factory for creating different cache types
 */
export class CacheFactory {
  /**
   * Create an in-memory LRU cache
   */
  static createLRU<T = any>(config?: Partial<CacheConfig>): AdvancedCache<T> {
    return new AdvancedCache<T>(config);
  }

  /**
   * Create a multi-layer cache
   */
  static createMultiLayer<T = any>(
    l1Config: Partial<CacheConfig> = {},
    l2Cache?: CacheLayer
  ): MultiLayerCache<T> {
    return new MultiLayerCache<T>(l1Config, l2Cache);
  }

  /**
   * Create a Redis cache layer (if Redis is available)
   */
  static createRedisCacheLayer(redisUrl?: string): CacheLayer | undefined {
    try {
      // This would require Redis client implementation
      // For now, return undefined to indicate Redis is not available
      return undefined;
    } catch {
      return undefined;
    }
  }
}

/**
 * Default cache instances for common use cases
 */
export const defaultCache = CacheFactory.createLRU({
  maxSize: 500,
  defaultTtl: 300000, // 5 minutes
  enableStats: true
});

export const sessionCache = CacheFactory.createLRU({
  maxSize: 100,
  defaultTtl: 1800000, // 30 minutes
  enableStats: true
});

export default AdvancedCache;