/**
 * Cache Implementation using node-cache and ioredis
 * Replaced with industry-standard caching libraries for better maintainability
 * 
 * Migration Guide:
 * - Use node-cache directly for in-memory caching
 * - Use ioredis for distributed caching
 * - Better performance and maintenance
 */

import NodeCache from 'node-cache';
import IORedis, { Redis as RedisClient } from 'ioredis';
import { EventEmitter } from 'events';
import { redisUrl, redisCloudUrl } from '../config/localVars.js';
import qerrors from 'qerrors';

export interface CacheOptions {
  maxSize?: number;              // Maximum items in local cache
  defaultTTL?: number;           // Default TTL in seconds
  enableDistributed?: boolean;    // Enable Redis backend
  keyPrefix?: string;            // Prefix for distributed keys
  compressionEnabled?: boolean;    // Enable compression for large values
  metricsEnabled?: boolean;        // Enable performance metrics
  checkperiod?: number;            // Check period for expired keys in seconds
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
    connected: boolean;
  };
}

/**
 * Local Cache using node-cache
 */
class LocalCacheImpl {
  private cache: NodeCache;
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0
  };

  constructor(options: CacheOptions = {}) {
    this.cache = new NodeCache({
      stdTTL: options.defaultTTL || 600, // 10 minutes default
      checkperiod: options.checkperiod || 120, // 2 minutes
      useClones: false, // Better performance
      deleteOnExpire: true, // Auto cleanup
      enableLegacyCallbacks: false,
      maxKeys: options.maxSize || 1000
    });

    // Track cache events for statistics
    this.cache.on('set', (key: string, value: any) => {
      this.trackOperation('set', key, value);
    });

    this.cache.on('del', (key: string, value: any) => {
      this.trackOperation('del', key, value);
    });

    this.cache.on('expired', (key: string, value: any) => {
      this.trackOperation('expired', key, value);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = this.cache.get<T>(key);
      if (value !== undefined) {
        this.stats.hits++;
        return value;
      } else {
        this.stats.misses++;
        return null;
      }
    } catch (error) {
      qerrors(error as Error, 'LocalCache.get: operation failed', { key });
      this.stats.misses++;
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      return this.cache.set(key, value, ttl || 0);
    } catch (error) {
      qerrors(error as Error, 'LocalCache.set: operation failed', { key, ttl });
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      return this.cache.del(key) > 0;
    } catch (error) {
      qerrors(error as Error, 'LocalCache.delete: operation failed', { key });
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      this.cache.keys().forEach((key) => this.cache.del(key));
    } catch (error) {
      qerrors(error as Error, 'LocalCache.clear: operation failed');
    }
  }

  getStats(): CacheStats['local'] {
    const keys = this.cache.keys();
    const totalItems = keys.length;
    const totalOperations = this.stats.hits + this.stats.misses;
    const hitRate = totalOperations > 0 ? (this.stats.hits / totalOperations) * 100 : 0;
    const missRate = totalOperations > 0 ? (this.stats.misses / totalOperations) * 100 : 0;

    return {
      totalItems,
      hitRate,
      missRate,
      evictions: this.stats.evictions,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      memoryUsage: this.getMemoryUsage()
    };
  }

  private trackOperation(operation: string, key: string, value: any): void {
    // Track operations for advanced metrics if needed
    if (operation === 'expired') {
      this.stats.evictions++;
    }
  }

  private getMemoryUsage(): number {
    // Rough estimation based on cache size
    const keys = this.cache.keys();
    let totalSize = 0;
    
    for (const key of keys) {
      const value = this.cache.get(key);
      if (value !== undefined) {
        totalSize += Buffer.byteLength(JSON.stringify(value));
      }
    }
    
    return totalSize;
  }

  // Access to underlying node-cache for advanced operations
  get nodeCache(): NodeCache {
    return this.cache;
  }
}

/**
 * Distributed Cache using Redis (ioredis)
 */
class DistributedCacheImpl extends EventEmitter {
  private redis: RedisClient | null = null;
  private localCache: LocalCacheImpl;
  private isConnected = false;
  private options: CacheOptions;
  private stats = {
    hits: 0,
    misses: 0,
    errors: 0,
    responseTimes: [] as number[]
  };

  constructor(options: CacheOptions = {}) {
    super();
    this.options = {
      defaultTTL: 600,
      enableDistributed: true,
      keyPrefix: 'cache:',
      ...options
    };
    
    // Local cache for fallback and performance
    this.localCache = new LocalCacheImpl({
      maxSize: 100, // Smaller local cache for distributed mode
      defaultTTL: 60, // Shorter TTL for local cache
      checkperiod: 30
    });
    
    this.initializeRedis();
  }

  private async initializeRedis(): Promise<void> {
    if (!this.options.enableDistributed) {
      console.log('Distributed caching disabled, using local cache only');
      return;
    }

    try {
      const redisUrlToUse = redisUrl || redisCloudUrl;
      if (!redisUrlToUse) {
        console.warn('Redis not configured for distributed caching, using local cache only');
        return;
      }

      this.redis = new IORedis(redisUrlToUse, {
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        connectTimeout: 10000,
        commandTimeout: 5000
      } as any);

      this.redis.on('connect', () => {
        this.isConnected = true;
        this.emit('connected');
        console.log('Distributed cache connected to Redis');
      });

      this.redis.on('error', (error: Error) => {
        this.isConnected = false;
        this.stats.errors++;
        this.emit('error', error);
        qerrors(error, 'DistributedCache: Redis error', { operation: 'connection' });
      });

      this.redis.on('close', () => {
        this.isConnected = false;
        this.emit('disconnected');
        console.log('Distributed cache disconnected from Redis');
      });

      await this.redis.connect();
    } catch (error) {
      this.isConnected = false;
      this.stats.errors++;
      qerrors(error as Error, 'DistributedCache: initialization failed', {
        redisUrl: redisUrl || redisCloudUrl
      });
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const startTime = Date.now();
    
    try {
      // Try distributed cache first if connected
      if (this.isConnected && this.redis) {
        const fullKey = this.options.keyPrefix! + key;
        const value = await this.redis.get(fullKey);
        
        if (value !== null) {
          const parsed = JSON.parse(value) as T;
          this.stats.hits++;
          this.recordResponseTime(startTime);
          
          // Cache in local cache for faster subsequent access
          await this.localCache.set(key, parsed, 60);
          
          return parsed;
        }
      }

      // Fallback to local cache
      const localValue = await this.localCache.get<T>(key);
      if (localValue !== null) {
        this.stats.hits++;
        this.recordResponseTime(startTime);
        return localValue;
      }

      this.stats.misses++;
      this.recordResponseTime(startTime);
      return null;
    } catch (error) {
      this.stats.errors++;
      qerrors(error as Error, 'DistributedCache.get: operation failed', { key });
      this.recordResponseTime(startTime);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    const startTime = Date.now();
    
    try {
      const effectiveTTL = ttl || this.options.defaultTTL || 600;
      const serialized = JSON.stringify(value);
      const fullKey = this.options.keyPrefix! + key;

      // Set in distributed cache if connected
      if (this.isConnected && this.redis) {
        await this.redis.setex(fullKey, effectiveTTL, serialized);
      }

      // Always set in local cache for performance
      await this.localCache.set(key, value, Math.min(effectiveTTL, 300)); // Max 5 min local
      this.recordResponseTime(startTime);
      
      return true;
    } catch (error) {
      this.stats.errors++;
      qerrors(error as Error, 'DistributedCache.set: operation failed', { key, ttl });
      this.recordResponseTime(startTime);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    const startTime = Date.now();
    
    try {
      const fullKey = this.options.keyPrefix! + key;
      let deleted = false;

      // Delete from distributed cache if connected
      if (this.isConnected && this.redis) {
        const result = await this.redis.del(fullKey);
        deleted = result > 0;
      }

      // Always delete from local cache
      const localDeleted = await this.localCache.delete(key);
      
      this.recordResponseTime(startTime);
      return deleted || localDeleted;
    } catch (error) {
      this.stats.errors++;
      qerrors(error as Error, 'DistributedCache.delete: operation failed', { key });
      this.recordResponseTime(startTime);
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      // Clear distributed cache if connected
      if (this.isConnected && this.redis) {
        const pattern = this.options.keyPrefix! + '*';
        const keys = await this.redis.keys(pattern);
        
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      }

      // Always clear local cache
      await this.localCache.clear();
    } catch (error) {
      qerrors(error as Error, 'DistributedCache.clear: operation failed');
    }
  }

  getStats(): CacheStats {
    const localStats = this.localCache.getStats();
    const totalOperations = this.stats.hits + this.stats.misses;
    const hitRate = totalOperations > 0 ? (this.stats.hits / totalOperations) * 100 : 0;
    const missRate = totalOperations > 0 ? (this.stats.misses / totalOperations) * 100 : 0;
    
    const avgResponseTime = this.stats.responseTimes.length > 0
      ? this.stats.responseTimes.reduce((a, b) => a + b, 0) / this.stats.responseTimes.length
      : 0;

    return {
      local: localStats,
      distributed: {
        hitRate,
        missRate,
        errors: this.stats.errors,
        totalHits: this.stats.hits,
        totalMisses: this.stats.misses,
        avgResponseTime,
        connected: this.isConnected
      }
    };
  }

  private recordResponseTime(startTime: number): void {
    const responseTime = Date.now() - startTime;
    this.stats.responseTimes.push(responseTime);
    
    // Keep only last 100 response times to prevent memory growth
    if (this.stats.responseTimes.length > 100) {
      this.stats.responseTimes = this.stats.responseTimes.slice(-100);
    }
  }

  async shutdown(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
      this.isConnected = false;
    }
  }

  // Access to underlying Redis client for advanced operations
  get redisClient(): RedisClient | null {
    return this.redis;
  }

  get localCacheInstance(): LocalCacheImpl {
    return this.localCache;
  }
}

/**
 * Cache Manager for unified caching interface
 */
export class CacheManager {
  private distributedCache: DistributedCacheImpl;
  private options: CacheOptions;

  constructor(options: CacheOptions = {}) {
    this.options = options;
    this.distributedCache = new DistributedCacheImpl(options);
  }

  async get<T>(key: string): Promise<T | null> {
    return this.distributedCache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    return this.distributedCache.set(key, value, ttl);
  }

  async delete(key: string): Promise<boolean> {
    return this.distributedCache.delete(key);
  }

  async clear(): Promise<void> {
    return this.distributedCache.clear();
  }

  getStats(): CacheStats {
    return this.distributedCache.getStats();
  }

  async shutdown(): Promise<void> {
    return this.distributedCache.shutdown();
  }
}

// Export with correct names to avoid conflicts
export const LocalCache = LocalCacheImpl;
export const DistributedCache = DistributedCacheImpl;

export default CacheManager;