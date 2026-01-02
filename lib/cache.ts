/**
 * Distributed Caching System
 * 
 * Multi-tier caching with LRU eviction, TTL support, and distributed invalidation.
 * Supports Redis backend with local memory fallback for high-performance scenarios.
 */

import { EventEmitter } from 'events';
import { CircuitBreaker, circuitBreakerRegistry } from './circuitBreaker.js';
import { randomBytes, createHash } from 'crypto';

export interface CacheOptions {
  maxSize?: number;              // Maximum items in local cache
  defaultTTL?: number;           // Default TTL in milliseconds
  enableDistributed?: boolean;    // Enable Redis backend
  keyPrefix?: string;            // Prefix for distributed keys
  compressionEnabled?: boolean;    // Enable compression for large values
  serializationFormat?: 'json' | 'binary'; // Value serialization format
  metricsEnabled?: boolean;        // Enable performance metrics
}

export interface CacheItem<T = any> {
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  compressed?: boolean;
  checksum?: string;
}

export interface CacheStats {
  local: {
    totalItems: number;
    hitRate: number;
    missRate: number;
    evictions: number;
    totalHits: number;
    totalMisses: number;
    memoryUsage: number;
  };
  distributed: {
    hitRate: number;
    missRate: number;
    errors: number;
    totalHits: number;
    totalMisses: number;
    avgResponseTime: number;
  };
  combined: {
    hitRate: number;
    totalOperations: number;
    avgResponseTime: number;
  };
}

export interface CacheMetrics {
  operations: {
    get: number;
    set: number;
    delete: number;
    clear: number;
    evictions: number;
  };
  performance: {
    avgResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
  };
  errors: {
    serialization: number;
    deserialization: number;
    network: number;
    validation: number;
  };
}

/**
 * LRU Cache implementation with TTL support
 */
class LocalCache<T = any> {
  private cache = new Map<string, CacheItem<T>>();
  private accessOrder = new Map<string, number>(); // More efficient O(1) access tracking
  private accessCounter = 0; // Monotonically increasing counter for LRU
  private maxSize: number;
  private metrics: CacheMetrics;
  
  // Memory management properties
  private currentMemoryUsage = 0;
  private memoryThreshold: number;
  private maxItemSize: number;
  private evictionBatchSize: number;

  constructor(maxSize: number = 1000) { // Reduced default to prevent memory bloat
    this.maxSize = maxSize;
    
    // Memory management configuration
    this.memoryThreshold = Math.max(50 * 1024 * 1024, maxSize * 1024); // 50MB or 1KB per item
    this.maxItemSize = 1024 * 1024; // 1MB max per item
    this.evictionBatchSize = Math.max(5, Math.floor(maxSize * 0.1)); // 10% or min 5 items
    
    this.metrics = {
      operations: { get: 0, set: 0, delete: 0, clear: 0, evictions: 0 },
      performance: { avgResponseTime: 0, minResponseTime: Infinity, maxResponseTime: 0 },
      errors: { serialization: 0, deserialization: 0, network: 0, validation: 0 }
    };
  }

  get(key: string): T | null {
    const startTime = Date.now();
    
    try {
      const item = this.cache.get(key);
      
      if (!item) {
        this.metrics.operations.get++;
        this.metrics.performance.avgResponseTime = 
          (this.metrics.performance.avgResponseTime + (Date.now() - startTime)) / 2;
        return null;
      }

      // Check TTL
      if (Date.now() - item.timestamp > item.ttl) {
        this.delete(key);
        this.metrics.operations.get++;
        return null;
      }

      // Update access tracking
      item.accessCount++;
      item.lastAccessed = Date.now();
      this.updateAccessOrder(key);

      this.metrics.operations.get++;
      this.metrics.performance.avgResponseTime = 
        (this.metrics.performance.avgResponseTime + (Date.now() - startTime)) / 2;
      
      return item.value;
    } catch (error) {
      this.metrics.errors.deserialization++;
      throw error;
    }
  }

  set(key: string, value: T, ttl: number = 300000): void { // 5 minutes default
    const startTime = Date.now();
    
    try {
      const item: CacheItem<T> = {
        value,
        timestamp: Date.now(),
        ttl,
        accessCount: 0,
        lastAccessed: Date.now(),
        checksum: this.generateChecksum(value)
      };

      // Calculate item size and check limits
      const itemSize = this.calculateItemSize(item);
      if (itemSize > this.maxItemSize) {
        console.warn(`Cache item too large: ${itemSize} bytes (max: ${this.maxItemSize})`);
        return; // Skip storing oversized items
      }

      // Evict if necessary (size or count based)
      const needsEviction = this.cache.size >= this.maxSize && !this.cache.has(key);
      const memoryPressure = this.currentMemoryUsage + itemSize > this.memoryThreshold;
      
      if (needsEviction || memoryPressure) {
        this.evictLRU();
      }

      // Update memory usage (remove old item if exists)
      const existingItem = this.cache.get(key);
      if (existingItem) {
        this.currentMemoryUsage = Math.max(0, this.currentMemoryUsage - this.calculateItemSize(existingItem));
      }

      this.cache.set(key, item);
      this.updateAccessOrder(key);
      this.currentMemoryUsage += itemSize;

      this.metrics.operations.set++;
      this.metrics.performance.avgResponseTime = 
        (this.metrics.performance.avgResponseTime + (Date.now() - startTime)) / 2;
    } catch (error) {
      this.metrics.errors.serialization++;
      throw error;
    }
  }

  delete(key: string): boolean {
    const startTime = Date.now();
    
    const existingItem = this.cache.get(key);
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.removeFromAccessOrder(key);
      // Update memory usage
      if (existingItem) {
        this.currentMemoryUsage = Math.max(0, this.currentMemoryUsage - this.calculateItemSize(existingItem));
      }
    }

    this.metrics.operations.delete++;
    this.metrics.performance.avgResponseTime = 
      (this.metrics.performance.avgResponseTime + (Date.now() - startTime)) / 2;
    
    return deleted;
  }

  clear(): void {
    const startTime = Date.now();
    
    this.cache.clear();
    this.accessOrder.clear();
    this.accessCounter = 0;

    this.metrics.operations.clear++;
    this.metrics.performance.avgResponseTime = 
      (this.metrics.performance.avgResponseTime + (Date.now() - startTime)) / 2;
  }

  getStats(): { size: number; maxSize: number; items: Array<{ key: string; age: number; ttl: number; accessCount: number }> } {
    const now = Date.now();
    const items = Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      age: now - item.timestamp,
      ttl: item.ttl,
      accessCount: item.accessCount
    }));

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      items
    };
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  private evictLRU(): void {
    if (this.accessOrder.size === 0) return;
    
    // Dynamic eviction based on memory pressure and usage patterns
    let evictCount = this.evictionBatchSize;
    
    // Increase eviction under memory pressure
    if (this.currentMemoryUsage > this.memoryThreshold) {
      evictCount = Math.floor(this.accessOrder.size * 0.3); // Evict 30% under pressure
    } else if (this.currentMemoryUsage > this.memoryThreshold * 0.8) {
      evictCount = Math.floor(this.accessOrder.size * 0.2); // Evict 20% near threshold
    } else {
      evictCount = Math.max(1, Math.floor(this.accessOrder.size * 0.05)); // Normal 5% eviction
    }
    const itemsWithTime: Array<{ key: string; lastAccessed: number; size: number }> = [];
    
    // Collect items with their access times and sizes - more efficient iteration
    for (const [key, accessCounter] of Array.from(this.accessOrder)) {
      const item = this.cache.get(key);
      if (item) {
        itemsWithTime.push({
          key,
          lastAccessed: item.lastAccessed,
          size: this.calculateItemSize(item)
        });
      }
    }
    
    // Sort by last accessed time (oldest first) then by size (smallest first for efficient cleanup)
    itemsWithTime.sort((a, b) => {
      if (a.lastAccessed !== b.lastAccessed) {
        return a.lastAccessed - b.lastAccessed;
      }
      return a.size - b.size;
    });
    
    // Evict the oldest items and track memory freed
    let memoryFreed = 0;
    for (let i = 0; i < Math.min(evictCount, itemsWithTime.length); i++) {
      const { key, size } = itemsWithTime[i];
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      memoryFreed += size;
    }
    
    // Update memory usage tracking
    this.currentMemoryUsage = Math.max(0, this.currentMemoryUsage - memoryFreed);
    this.metrics.operations.evictions += Math.min(evictCount, itemsWithTime.length);
    
    // Log significant evictions
    if (evictCount > 10 || this.currentMemoryUsage > this.memoryThreshold * 0.9) {
      console.debug(`Cache eviction: removed ${Math.min(evictCount, itemsWithTime.length)} items, freed ${memoryFreed} bytes, ${this.currentMemoryUsage}/${this.memoryThreshold} bytes used`);
    }
  }

  private calculateItemSize(item: CacheItem): number {
    // Efficient size calculation without JSON.stringify for primitive types
    const value = item.value;
    if (value === null || value === undefined) return 8;
    if (typeof value === 'string') return value.length * 2;
    if (typeof value === 'number') return 8;
    if (typeof value === 'boolean') return 4;
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value).length * 2;
      } catch {
        return 100; // Default size for non-serializable objects
      }
    }
    return 50; // Default size for other types
  }

  private updateAccessOrder(key: string): void {
    // Update the access counter for LRU tracking - O(1) operation
    this.accessOrder.set(key, ++this.accessCounter);
  }

  private removeFromAccessOrder(key: string): void {
    // Remove from access order tracking - O(1) operation
    this.accessOrder.delete(key);
  }

  private generateChecksum(value: T): string {
    try {
      // Optimize: avoid JSON.stringify for checksum generation when possible
      let str: string;
      if (typeof value === 'string') {
        str = value;
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        str = String(value);
      } else if (value === null || value === undefined) {
        str = '';
      } else {
        // Only use JSON.stringify for complex objects
        str = JSON.stringify(value);
      }
      return createHash('sha256').update(str).digest('hex');
    } catch {
      return '';
    }
  }
}

/**
 * Distributed Cache with Redis backend and local fallback
 */
export class DistributedCache<T = any> extends EventEmitter {
  private localCache: LocalCache<T>;
  private redis?: any;
  private circuitBreaker?: CircuitBreaker;
  private options: Required<CacheOptions>;
  private metrics = {
    localHits: 0,
    localMisses: 0,
    distributedHits: 0,
    distributedMisses: 0,
    distributedErrors: 0,
    totalResponseTime: 0,
    operations: 0
  };

  constructor(options: CacheOptions = {}) {
    super();
    
    this.options = {
      maxSize: options.maxSize || 1000, // Reduced to prevent memory issues
      defaultTTL: options.defaultTTL || 300000, // 5 minutes
      enableDistributed: options.enableDistributed !== false,
      keyPrefix: options.keyPrefix || 'qtests:cache:',
      compressionEnabled: options.compressionEnabled || false,
      serializationFormat: options.serializationFormat || 'json',
      metricsEnabled: options.metricsEnabled !== false
    };

    this.localCache = new LocalCache<T>(this.options.maxSize);
    
    if (this.options.enableDistributed) {
      this.setupDistributedCache();
    }
  }

  async get(key: string): Promise<T | null> {
    const startTime = Date.now();
    this.metrics.operations++;

    try {
      // Try local cache first
      const localValue = this.localCache.get(key);
      if (localValue !== null) {
        this.metrics.localHits++;
        this.emit('hit', { key, source: 'local', responseTime: Date.now() - startTime });
        return localValue;
      }

      // Try distributed cache
      if (this.options.enableDistributed && this.redis && this.circuitBreaker) {
        try {
          const distributedValue = await this.circuitBreaker.execute(
            () => this.getDistributedValue(key)
          );
          
          if (distributedValue !== null) {
            // Cache locally for future access
            this.localCache.set(key, distributedValue, this.options.defaultTTL);
            this.metrics.distributedHits++;
            this.emit('hit', { key, source: 'distributed', responseTime: Date.now() - startTime });
            return distributedValue;
          }
        } catch (error) {
          this.metrics.distributedErrors++;
          this.emit('error', { key, error: error as Error, source: 'distributed' });
        }
      }

      this.metrics.localMisses++;
      this.metrics.distributedMisses++;
      this.emit('miss', { key, responseTime: Date.now() - startTime });
      return null;
      
    } finally {
      this.metrics.totalResponseTime += Date.now() - startTime;
    }
  }

  async set(key: string, value: T, ttl?: number): Promise<void> {
    const startTime = Date.now();
    const effectiveTTL = ttl || this.options.defaultTTL;
    this.metrics.operations++;

    try {
      // Set in local cache immediately
      this.localCache.set(key, value, effectiveTTL);

      // Set in distributed cache
      if (this.options.enableDistributed && this.redis && this.circuitBreaker) {
        try {
          await this.circuitBreaker.execute(
            () => this.setDistributedValue(key, value, effectiveTTL)
          );
          this.emit('set', { key, source: 'distributed', responseTime: Date.now() - startTime });
        } catch (error) {
          this.metrics.distributedErrors++;
          this.emit('error', { key, error: error as Error, source: 'distributed' });
          // Local cache still has the value, so this is not critical
        }
      }

      this.emit('set', { key, source: 'local', responseTime: Date.now() - startTime });
      
    } finally {
      this.metrics.totalResponseTime += Date.now() - startTime;
    }
  }

  async delete(key: string): Promise<boolean> {
    const startTime = Date.now();
    this.metrics.operations++;

    try {
      // Delete from local cache
      const localDeleted = this.localCache.delete(key);

      // Delete from distributed cache
      let distributedDeleted = false;
      if (this.options.enableDistributed && this.redis && this.circuitBreaker) {
        try {
          distributedDeleted = await this.circuitBreaker.execute(
            () => this.deleteDistributedValue(key)
          );
        } catch (error) {
          this.metrics.distributedErrors++;
          this.emit('error', { key, error: error as Error, source: 'distributed' });
        }
      }

      const deleted = localDeleted || distributedDeleted;
      this.emit('delete', { key, deleted, responseTime: Date.now() - startTime });
      
      return deleted;
      
    } finally {
      this.metrics.totalResponseTime += Date.now() - startTime;
    }
  }

  async clear(): Promise<void> {
    const startTime = Date.now();
    this.metrics.operations++;

    try {
      // Clear local cache
      this.localCache.clear();

      // Clear distributed cache
      if (this.options.enableDistributed && this.redis && this.circuitBreaker) {
        try {
          await this.circuitBreaker.execute(
            () => this.clearDistributedCache()
          );
        } catch (error) {
          this.metrics.distributedErrors++;
          this.emit('error', { error: error as Error, source: 'distributed' });
        }
      }

      this.emit('clear', { responseTime: Date.now() - startTime });
      
    } finally {
      this.metrics.totalResponseTime += Date.now() - startTime;
    }
  }

  getStats(): CacheStats {
    const localMetrics = this.localCache.getMetrics();
    const totalOps = this.metrics.operations;
    
    const localHitRate = this.metrics.localHits / (this.metrics.localHits + this.metrics.localMisses) * 100;
    const distributedHitRate = this.metrics.distributedHits / (this.metrics.distributedHits + this.metrics.distributedMisses) * 100;
    const combinedHitRate = (this.metrics.localHits + this.metrics.distributedHits) / totalOps * 100;

    return {
      local: {
        totalItems: this.localCache.getStats().size,
        hitRate: localHitRate,
        missRate: 100 - localHitRate,
        evictions: 0, // TODO: Track evictions
        totalHits: this.metrics.localHits,
        totalMisses: this.metrics.localMisses,
        memoryUsage: this.estimateMemoryUsage()
      },
      distributed: {
        hitRate: distributedHitRate,
        missRate: 100 - distributedHitRate,
        errors: this.metrics.distributedErrors,
        totalHits: this.metrics.distributedHits,
        totalMisses: this.metrics.distributedMisses,
        avgResponseTime: totalOps > 0 ? this.metrics.totalResponseTime / totalOps : 0
      },
      combined: {
        hitRate: combinedHitRate,
        totalOperations: totalOps,
        avgResponseTime: totalOps > 0 ? this.metrics.totalResponseTime / totalOps : 0
      }
    };
  }

  async warmup(data: Record<string, T>): Promise<void> {
    const promises = Object.entries(data).map(([key, value]) => 
      this.set(key, value)
    );
    
    await Promise.allSettled(promises);
    this.emit('warmup-complete', { itemCount: Object.keys(data).length });
  }

  async shutdown(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
    
    if (this.circuitBreaker) {
      this.circuitBreaker.reset();
    }
    
    this.removeAllListeners();
  }

  private async setupDistributedCache(): Promise<void> {
    try {
      const { createClient } = await import('redis');
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.redis = createClient({ url: redisUrl });
      
      // Setup circuit breaker for Redis operations
      this.circuitBreaker = circuitBreakerRegistry.register('cache-redis', {
        failureThreshold: 3,
        resetTimeout: 30000,
        timeout: 5000
      });

      this.redis.on('error', (error: Error) => {
        this.metrics.distributedErrors++;
        this.emit('error', { error, source: 'redis' });
      });

      await this.redis.connect();
      
    } catch (error) {
      console.warn('Failed to setup distributed cache, using local only:', error);
      this.options.enableDistributed = false;
    }
  }

  private async getDistributedValue(key: string): Promise<T | null> {
    if (!this.redis) return null;
    
    const redisKey = this.options.keyPrefix + key;
    const value = await this.redis.get(redisKey);
    
    if (value === null) {
      return null;
    }

    try {
      return this.deserializeValue(value);
    } catch (error) {
      console.error('Failed to deserialize cached value:', error);
      return null;
    }
  }

  private async setDistributedValue(key: string, value: T, ttl: number): Promise<void> {
    if (!this.redis) return;
    
    const redisKey = this.options.keyPrefix + key;
    const serializedValue = this.serializeValue(value);
    
    await this.redis.setEx(redisKey, Math.ceil(ttl / 1000), serializedValue);
  }

  private async deleteDistributedValue(key: string): Promise<boolean> {
    if (!this.redis) return false;
    
    const redisKey = this.options.keyPrefix + key;
    const result = await this.redis.del(redisKey);
    return result > 0;
  }

  private async clearDistributedCache(): Promise<void> {
    if (!this.redis) return;
    
    const pattern = this.options.keyPrefix + '*';
    const keys = await this.redis.keys(pattern);
    
    if (keys.length > 0) {
      await this.redis.del(keys);
    }
  }

  private serializeValue(value: T): string {
    try {
      if (this.options.serializationFormat === 'json') {
        // Optimize: handle primitive types without JSON.stringify
        if (typeof value === 'string') {
          return value;
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          return String(value);
        } else if (value === null) {
          return 'null';
        } else if (value === undefined) {
          return 'undefined';
        } else {
          return JSON.stringify(value);
        }
      }
      // Add binary serialization if needed
      return JSON.stringify(value);
    } catch (error) {
      throw new Error(`Serialization failed: ${error}`);
    }
  }

  private deserializeValue(value: string): T {
    try {
      if (this.options.serializationFormat === 'json') {
        // Optimize: handle primitive types without JSON.parse
        if (value === 'null') return null as T;
        if (value === 'undefined') return undefined as T;
        if (value === 'true') return true as T;
        if (value === 'false') return false as T;
        if (!isNaN(Number(value)) && value.trim() !== '') {
          const num = Number(value);
          if (num.toString() === value) return num as T;
        }
        return JSON.parse(value);
      }
      return JSON.parse(value);
    } catch (error) {
      throw new Error(`Deserialization failed: ${error}`);
    }
  }

  private estimateMemoryUsage(): number {
    const stats = this.localCache.getStats();
    // Rough estimation - each item average 200 bytes
    return stats.size * 200;
  }
}

/**
 * Cache factory for creating optimized cache instances
 */
export function createCache<T = any>(options: CacheOptions = {}): DistributedCache<T> {
  return new DistributedCache<T>(options);
}

/**
 * Specialized caches for common use cases
 */
export class CacheManager {
  private static caches = new Map<string, DistributedCache>();
  
  static getCache<T = any>(name: string, options: CacheOptions = {}): DistributedCache<T> {
    if (!this.caches.has(name)) {
      const cache = new DistributedCache<T>({
        keyPrefix: `${name}:`,
        ...options
      });
      this.caches.set(name, cache);
    }
    
    return this.caches.get(name) as DistributedCache<T>;
  }
  
  static async shutdownAll(): Promise<void> {
    const shutdownPromises = Array.from(this.caches.values()).map(cache => cache.shutdown());
    await Promise.allSettled(shutdownPromises);
    this.caches.clear();
  }
  
  static getStats(): Record<string, CacheStats> {
    const stats: Record<string, CacheStats> = {};
    
    for (const [name, cache] of this.caches) {
      stats[name] = cache.getStats();
    }
    
    return stats;
  }
}

export default DistributedCache;