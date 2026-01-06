/**
 * Cache Implementation using node-cache and ioredis
 * Direct use of industry-standard caching libraries with simplified interfaces
 * 
 * This module provides simplified interfaces to node-cache and ioredis
 * while maintaining the same API for backward compatibility.
 */

import NodeCache from 'node-cache';
import IORedis, { Redis as RedisClient } from 'ioredis';
import { EventEmitter } from 'events';
import { redisUrl, redisCloudUrl } from '../config/localVars.js';
import qerrors from 'qerrors';
import { parse as secureParse } from 'secure-json-parse';

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
 * Create a local cache using node-cache
 * @param options - Cache options
 * @returns NodeCache instance
 */
export function createLocalCache(options: CacheOptions = {}): NodeCache {
  const cache = new NodeCache({
    stdTTL: options.defaultTTL || 600, // 10 minutes default
    checkperiod: options.checkperiod || 120, // 2 minutes
    useClones: false, // Better performance
    deleteOnExpire: true, // Auto cleanup
    enableLegacyCallbacks: false,
    maxKeys: options.maxSize || 1000
  });

  return cache;
}

/**
 * Create a distributed cache using Redis
 * @param options - Cache options
 * @returns Promise resolving to Redis client and local cache
 */
export async function createDistributedCache(options: CacheOptions = {}): Promise<{
  redis: RedisClient | null;
  localCache: NodeCache;
  isConnected: boolean;
}> {
  const localCache = createLocalCache({
    maxSize: 100, // Smaller local cache for distributed mode
    defaultTTL: 60, // Shorter TTL for local cache
    checkperiod: 30
  });

  let redis: RedisClient | null = null;
  let isConnected = false;

  if (!options.enableDistributed) {
    console.log('Distributed caching disabled, using local cache only');
    return { redis: null, localCache, isConnected: false };
  }

  try {
    const redisUrlToUse = redisUrl || redisCloudUrl;
    if (!redisUrlToUse) {
      console.warn('Redis not configured for distributed caching, using local cache only');
      return { redis: null, localCache, isConnected: false };
    }

    redis = new IORedis(redisUrlToUse, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000
    });

    redis.on('connect', () => {
      isConnected = true;
      console.log('Distributed cache connected to Redis');
    });

    redis.on('error', (error: Error) => {
      isConnected = false;
      qerrors(error, 'DistributedCache: Redis error', { operation: 'connection' });
    });

    redis.on('close', () => {
      isConnected = false;
      console.log('Distributed cache disconnected from Redis');
    });

    await redis.connect();
  } catch (error) {
    qerrors(error as Error, 'DistributedCache: initialization failed', {
      redisUrl: redisUrl || redisCloudUrl
    });
    return { redis: null, localCache, isConnected: false };
  }

  return { redis, localCache, isConnected };
}

/**
 * Get value from cache with distributed fallback
 * @param key - Cache key
 * @param distributedCache - Distributed cache components
 * @param options - Cache options
 * @returns Promise resolving to cached value or null
 */
export async function getFromCache<T>(
  key: string,
  distributedCache: { redis: RedisClient | null; localCache: NodeCache; isConnected: boolean },
  options: CacheOptions = {}
): Promise<T | null> {
  const startTime = Date.now();
  
  try {
    // Try distributed cache first if connected
    if (distributedCache.isConnected && distributedCache.redis) {
      const fullKey = (options.keyPrefix || 'cache:') + key;
      const value = await distributedCache.redis.get(fullKey);
      
      if (value !== null) {
        // Use secure-json-parse for protection against prototype pollution
        const parsed = secureParse(value, undefined, {
          protoAction: 'remove',
          constructorAction: 'remove'
        }) as T;
        
        // Cache in local cache for faster subsequent access
        distributedCache.localCache.set(key, parsed, 60);
        
        return parsed;
      }
    }

    // Fallback to local cache
    const localValue = distributedCache.localCache.get<T>(key);
    if (localValue !== undefined) {
      return localValue;
    }

    return null;
  } catch (error) {
    qerrors(error as Error, 'getFromCache: operation failed', { key });
    return null;
  }
}

/**
 * Set value in cache with distributed support
 * @param key - Cache key
 * @param value - Value to cache
 * @param ttl - TTL in seconds (optional)
 * @param distributedCache - Distributed cache components
 * @param options - Cache options
 * @returns Promise resolving to success boolean
 */
export async function setInCache<T>(
  key: string,
  value: T,
  ttl: number | undefined,
  distributedCache: { redis: RedisClient | null; localCache: NodeCache; isConnected: boolean },
  options: CacheOptions = {}
): Promise<boolean> {
  try {
    const effectiveTTL = ttl || options.defaultTTL || 600;
    // Use secure-json-parse for consistent serialization
    const serialized = JSON.stringify(value);
    const fullKey = (options.keyPrefix || 'cache:') + key;

    // Set in distributed cache if connected
    if (distributedCache.isConnected && distributedCache.redis) {
      await distributedCache.redis.setex(fullKey, effectiveTTL, serialized);
    }

    // Always set in local cache for performance
    distributedCache.localCache.set(key, value, Math.min(effectiveTTL, 300)); // Max 5 min local
    
    return true;
  } catch (error) {
    qerrors(error as Error, 'setInCache: operation failed', { key, ttl });
    return false;
  }
}

/**
 * Delete value from cache
 * @param key - Cache key
 * @param distributedCache - Distributed cache components
 * @param options - Cache options
 * @returns Promise resolving to success boolean
 */
export async function deleteFromCache(
  key: string,
  distributedCache: { redis: RedisClient | null; localCache: NodeCache; isConnected: boolean },
  options: CacheOptions = {}
): Promise<boolean> {
  try {
    const fullKey = (options.keyPrefix || 'cache:') + key;
    let deleted = false;

    // Delete from distributed cache if connected
    if (distributedCache.isConnected && distributedCache.redis) {
      const result = await distributedCache.redis.del(fullKey);
      deleted = result > 0;
    }

    // Always delete from local cache
    const localDeleted = distributedCache.localCache.del(key) > 0;
    
    return deleted || localDeleted;
  } catch (error) {
    qerrors(error as Error, 'deleteFromCache: operation failed', { key });
    return false;
  }
}

/**
 * Clear all cache entries
 * @param distributedCache - Distributed cache components
 * @param options - Cache options
 * @returns Promise that resolves when clear is complete
 */
export async function clearCache(
  distributedCache: { redis: RedisClient | null; localCache: NodeCache; isConnected: boolean },
  options: CacheOptions = {}
): Promise<void> {
  try {
    // Clear distributed cache if connected
    if (distributedCache.isConnected && distributedCache.redis) {
      const pattern = (options.keyPrefix || 'cache:') + '*';
      const keys = await distributedCache.redis.keys(pattern);
      
      if (keys.length > 0) {
        await distributedCache.redis.del(...keys);
      }
    }

    // Always clear local cache
    distributedCache.localCache.keys().forEach((key) => distributedCache.localCache.del(key));
  } catch (error) {
    qerrors(error as Error, 'clearCache: operation failed');
  }
}

/**
 * Get cache statistics
 * @param distributedCache - Distributed cache components
 * @param stats - Internal stats tracking
 * @returns CacheStats
 */
export function getCacheStats(
  distributedCache: { redis: RedisClient | null; localCache: NodeCache; isConnected: boolean },
  stats: {
    hits: number;
    misses: number;
    errors: number;
    responseTimes: number[];
  }
): CacheStats {
  const keys = distributedCache.localCache.keys();
  const totalItems = keys.length;
  const totalOperations = stats.hits + stats.misses;
  const hitRate = totalOperations > 0 ? (stats.hits / totalOperations) * 100 : 0;
  const missRate = totalOperations > 0 ? (stats.misses / totalOperations) * 100 : 0;
  
  const avgResponseTime = stats.responseTimes.length > 0
    ? stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length
    : 0;

  return {
    local: {
      totalItems,
      hitRate,
      missRate,
      evictions: 0, // node-cache doesn't expose this easily
      totalHits: stats.hits,
      totalMisses: stats.misses,
      memoryUsage: 0 // Estimated if needed
    },
    distributed: {
      hitRate,
      missRate,
      errors: stats.errors,
      totalHits: stats.hits,
      totalMisses: stats.misses,
      avgResponseTime,
      connected: distributedCache.isConnected
    }
  };
}

/**
 * Legacy CacheManager class for backward compatibility
 * @deprecated Use the functional API instead
 */
export class CacheManager {
  private distributedCache!: {
    redis: RedisClient | null;
    localCache: NodeCache;
    isConnected: boolean;
  };
  private options: CacheOptions;
  private stats = {
    hits: 0,
    misses: 0,
    errors: 0,
    responseTimes: [] as number[]
  };

  constructor(options: CacheOptions = {}) {
    this.options = {
      defaultTTL: 600,
      enableDistributed: true,
      keyPrefix: 'cache:',
      ...options
    };
    
    this.initializeCache();
  }

  private async initializeCache(): Promise<void> {
    this.distributedCache = await createDistributedCache(this.options);
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await getFromCache<T>(key, this.distributedCache, this.options);
      if (result !== null) {
        this.stats.hits++;
      } else {
        this.stats.misses++;
      }
      return result;
    } catch (error) {
      this.stats.errors++;
      this.stats.misses++;
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const result = await setInCache(key, value, ttl, this.distributedCache, this.options);
      return result;
    } catch (error) {
      this.stats.errors++;
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const result = await deleteFromCache(key, this.distributedCache, this.options);
      return result;
    } catch (error) {
      this.stats.errors++;
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      await clearCache(this.distributedCache, this.options);
    } catch (error) {
      this.stats.errors++;
    }
  }

  getStats(): CacheStats {
    return getCacheStats(this.distributedCache, this.stats);
  }

  async shutdown(): Promise<void> {
    if (this.distributedCache.redis) {
      await this.distributedCache.redis.quit();
    }
  }
}

// Export with correct names to avoid conflicts
export const LocalCache = NodeCache;
export const DistributedCache = CacheManager;

export default {
  createLocalCache,
  createDistributedCache,
  getFromCache,
  setInCache,
  deleteFromCache,
  clearCache,
  getCacheStats,
  CacheManager,
  LocalCache,
  DistributedCache
};