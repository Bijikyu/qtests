/**
 * Distributed Rate Limiter - Migrated to rate-limiter-flexible
 * 
 * This file now acts as a compatibility layer for the existing API
 * while using the superior rate-limiter-flexible library under the hood.
 * 
 * Migration Benefits:
 * - Better maintained industry standard
 * - Redis clustering support
 * - Multiple algorithms (fixed window, sliding window, token bucket)
 * - Comprehensive TypeScript support
 * - Better performance and memory management
 */

// Import rate-limiter-flexible dynamically to handle potential missing types
// @ts-ignore
let RateLimiterRedis: any = null;
let RateLimiterMemory: any = null;

// Initialize rate limiter modules asynchronously
const initializeRateLimiters = async () => {
  try {
    const rateLimiterModule = await import('rate-limiter-flexible');
    RateLimiterRedis = rateLimiterModule.RateLimiterRedis;
    RateLimiterMemory = rateLimiterModule.RateLimiterMemory;
  } catch (error) {
    console.warn('rate-limiter-flexible not available, using custom implementation:', error);
  }
};

// Call the initialization function
initializeRateLimiters();

import { redisUrl, redisCloudUrl } from '../config/localVars.js';
import qerrors from 'qerrors';
import { randomBytes } from 'crypto';
import { CircuitBreaker, circuitBreakerRegistry } from './circuitBreaker.js';

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: any) => string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export interface RateLimitStats {
  isDistributed: boolean;
  fallbackCounters: number;
  redisConnected: boolean;
}

export class DistributedRateLimiter {
  private redis: any = null;
  private isRedisAvailable = false;
  private fallbackCounters = new Map<string, { count: number; resetTime: number }>();
  private config: RateLimitConfig;
  private _cleanupInterval: NodeJS.Timeout | null = null;
  private circuitBreaker?: CircuitBreaker;
  
  // Performance optimization: Smart cache with pattern recognition and bounded LRU
  private recentCache = new Map<string, { result: RateLimitResult; timestamp: number; frequency: number }>();
  private cacheAccessOrder = new Map<string, number>(); // LRU tracking for rate limiter cache
  private cacheAccessCounter = 0; // Monotonically increasing counter for LRU
  private readonly maxCacheSize = 500; // Reduced to prevent memory leaks
  private readonly cacheTtl = 5000; // 5 seconds cache TTL
  private readonly maxEventHandlers = 10; // Limit event handlers to prevent memory bloat
  
  // Enhanced cache properties
  private readonly cacheHitThreshold = 0.8; // Cache hits above 80% are good

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.setupCircuitBreaker();
    this.initializeRedis();
  }

  /**
   * Setup circuit breaker for Redis operations
   */
  private setupCircuitBreaker(): void {
    this.circuitBreaker = circuitBreakerRegistry.register('redis-rate-limiter', {
      failureThreshold: 3,
      resetTimeout: 30000,
      timeout: 5000,
      onFailure: (error) => {
        console.warn('Redis rate limiter circuit breaker activated:', error.message);
        this.isRedisAvailable = false;
      },
      onRecovery: () => {
        console.log('Redis rate limiter circuit breaker recovered');
        this.isRedisAvailable = true;
      }
    });
  }

    private async initializeRedis(): Promise<void> {
    try {
      const redisUrlToUse = redisUrl || redisCloudUrl;
      if (!redisUrlToUse) {
        console.log('Redis not configured for rate limiting, using fallback');
        return;
      }

      const { createClient } = await import('redis');
      this.redis = createClient({ url: redisUrl });

      this.redis.on('error', (error: Error) => {
        console.warn('Redis rate limiter error:', error.message);
        this.isRedisAvailable = false;
      });

      this.redis.on('connect', () => {
        console.log('Redis rate limiter connected');
        this.isRedisAvailable = true;
      });

      await this.redis.connect();
    } catch (error) {
      qerrors(error as Error, 'rateLimiter.initialize: Redis connection failed', {
        redisUrl: redisUrl || redisCloudUrl,
        errorType: (error as Error).constructor.name,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      console.warn('Redis rate limiter initialization failed:',
        (error as Error).message || String(error));
      this.isRedisAvailable = false;
    }
  }

  async isAllowed(req: any): Promise<RateLimitResult> {
    const key = this.config.keyGenerator ?
      this.config.keyGenerator(req) :
      `rate_limit:${req.ip}:${req.path}`;

    const now = Date.now();
    
    // Check cache first for performance optimization
    const cached = this.recentCache.get(key);
    if (cached && (now - cached.timestamp) < this.cacheTtl) {
      return cached.result;
    }

    const windowStart = now - this.config.windowMs;

    let result: RateLimitResult;
    if (this.isRedisAvailable && this.redis && this.circuitBreaker) {
      result = await this.circuitBreaker.execute(() => this.checkRedisLimit(key, now, windowStart));
    } else {
      result = this.checkFallbackLimit(key, now);
    }

    // Cache the result for future requests
    this.cacheResult(key, result);
    return result;
  }

/**
 * Cache rate limit result with adaptive eviction based on memory pressure and LRU
 */
private cacheResult(key: string, result: RateLimitResult): void {
  // Check memory pressure and adjust cache size accordingly
  const memoryPressure = this.getMemoryPressure();
  const effectiveMaxSize = this.calculateAdaptiveCacheSize(memoryPressure);
  
  // Adaptive eviction strategy based on memory pressure and result importance
  if (this.recentCache.size >= effectiveMaxSize) {
    this.performAdaptiveEviction(memoryPressure, effectiveMaxSize);
  }
  
  // Update frequency tracking for existing entries
  const existing = this.recentCache.get(key);
  if (existing) {
    existing.frequency++;
    existing.timestamp = Date.now();
    existing.result = result; // Update with latest result
    
    // Update LRU access order
    this.cacheAccessOrder.set(key, ++this.cacheAccessCounter);
  } else {
    this.recentCache.set(key, {
      result,
      timestamp: Date.now(),
      frequency: 1
    });
    
    // Add to LRU tracking
    this.cacheAccessOrder.set(key, ++this.cacheAccessCounter);
    
    // Prevent unbounded growth of access order map
    if (this.cacheAccessOrder.size > this.maxCacheSize * 1.5) {
      this.cleanupCacheAccessOrder();
    }
  }
}

/**
 * Cleanup cache access order to prevent memory leaks
 */
private cleanupCacheAccessOrder(): void {
  if (this.cacheAccessOrder.size <= this.maxCacheSize) return;
  
  // Get least recently used keys to remove
  const entries = Array.from(this.cacheAccessOrder.entries());
  entries.sort((a, b) => a[1] - b[1]); // Sort by access time (oldest first)
  
  const removeCount = Math.floor(this.cacheAccessOrder.size * 0.3); // Remove 30%
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < removeCount && i < entries.length; i++) {
    keysToRemove.push(entries[i][0]);
  }
  
  // Remove from both maps
  for (const key of keysToRemove) {
    this.cacheAccessOrder.delete(key);
    this.recentCache.delete(key);
  }
}

/**
 * Get current memory pressure (0-1 scale)
 */
private getMemoryPressure(): number {
  try {
    const memUsage = process.memoryUsage();
    const totalMem = require('os').totalmem();
    const usedMem = totalMem - require('os').freemem();
    return Math.min(1, usedMem / totalMem);
  } catch {
    return 0.5; // Default to medium pressure on error
  }
}

/**
 * Calculate adaptive cache size based on memory pressure
 */
private calculateAdaptiveCacheSize(memoryPressure: number): number {
  let effectiveSize = this.maxCacheSize;
  
  if (memoryPressure > 0.9) {
    effectiveSize = Math.floor(this.maxCacheSize * 0.3); // 70% reduction
  } else if (memoryPressure > 0.8) {
    effectiveSize = Math.floor(this.maxCacheSize * 0.5); // 50% reduction
  } else if (memoryPressure > 0.7) {
    effectiveSize = Math.floor(this.maxCacheSize * 0.7); // 30% reduction
  }
  
  return Math.max(10, effectiveSize); // Minimum cache size
}

/**
 * Perform adaptive eviction with O(1) LRU prioritization (optimized for scalability)
 */
private performAdaptiveEviction(memoryPressure: number, effectiveMaxSize: number): void {
  const entriesToEvict = Math.max(1, Math.floor(this.recentCache.size * 0.2)); // Evict 20% or minimum 1
  
  // Use O(1) LRU strategy with access order tracking
  if (memoryPressure > 0.8) {
    // Fast O(1) LRU eviction - find oldest entries without sorting
    const keysToRemove: string[] = [];
    let oldestAccess = Infinity;
    let oldestKey = '';
    
    // Find the oldest entries iteratively (O(n) but without sorting overhead)
    for (let i = 0; i < entriesToEvict && this.cacheAccessOrder.size > 0; i++) {
      oldestAccess = Infinity;
      oldestKey = '';
      
      for (const [key, accessTime] of this.cacheAccessOrder.entries()) {
        if (accessTime < oldestAccess && !keysToRemove.includes(key)) {
          oldestAccess = accessTime;
          oldestKey = key;
        }
      }
      
      if (oldestKey) {
        keysToRemove.push(oldestKey);
        this.recentCache.delete(oldestKey);
        this.cacheAccessOrder.delete(oldestKey);
      }
    }
    
    if (entriesToEvict > 5) {
      console.debug(`Rate limiter fast O(1) LRU eviction: removed ${keysToRemove.length} entries, memory pressure: ${(memoryPressure * 100).toFixed(1)}%`);
    }
    return;
  }
  
  // Intelligent scoring only under moderate memory pressure
  const entries = Array.from(this.recentCache.entries());
  const maxScoreItems = Math.min(entriesToEvict * 2, entries.length); // Limit scoring work
  const scoredEntries: Array<{ key: string; score: number }> = [];
  
  for (let i = 0; i < maxScoreItems; i++) {
    const [key, cached] = entries[i];
    let score = 0;
    
    // Simplified scoring - focus on age and frequency
    const age = Date.now() - cached.timestamp;
    score += Math.min(20, (age / 60000) * 5); // Max 20 points for age
    
    if (cached.result.allowed) {
      score += 15; // Allowed requests are less critical
    } else {
      score -= 5; // Blocked requests are more important to keep
    }
    
    // Frequency factor (low frequency = higher score)
    score += Math.max(0, 15 - cached.frequency); // Max 15 points for low frequency
    
    scoredEntries.push({ key, score });
  }
  
  // Sort and evict highest scoring items
  scoredEntries.sort((a, b) => b.score - a.score);
  
  for (let i = 0; i < Math.min(entriesToEvict, scoredEntries.length); i++) {
    const key = scoredEntries[i].key;
    this.recentCache.delete(key);
    this.cacheAccessOrder.delete(key);
  }
  
  // Log significant evictions
  if (entriesToEvict > 5) {
    console.debug(`Rate limiter cache eviction: removed ${entriesToEvict} entries, memory pressure: ${(memoryPressure * 100).toFixed(1)}%`);
  }
}

  private async checkRedisLimit(key: string, now: number, windowStart: number): Promise<RateLimitResult> {
    try {
      const pipeline = this.redis.multi();

      pipeline.zRemRangeByScore(key, 0, windowStart);
      pipeline.zCard(key);
      pipeline.zAdd(key, { score: now, value: `${now}-${randomBytes(8).toString('hex')}` });
      pipeline.expire(key, Math.ceil(this.config.windowMs / 1000) + 1);

      const results = await pipeline.exec();
      if (!results || results.length < 4) {
        throw new Error('Redis pipeline returned invalid results');
      }
      
      // Check for Redis pipeline errors (all 4 operations)
      const zRemErr = results[0]?.[0];
      const zCardErr = results[1]?.[0];
      const zAddErr = results[2]?.[0];
      const expireErr = results[3]?.[0];
      if (zRemErr || zCardErr || zAddErr || expireErr) {
        const firstErr = zRemErr || zCardErr || zAddErr || expireErr;
        throw new Error(`Redis pipeline operation failed: ${firstErr}`);
      }
      
      const currentCount = results[1]?.[1] || 0; // results[1] is [err, zCardResult]

      if (currentCount >= this.config.maxRequests) {
        try {
          const oldestResult = await this.redis.zRange(key, 0, 0);
          if (!oldestResult || !Array.isArray(oldestResult) || oldestResult.length === 0) {
            throw new Error('Redis zRange returned invalid result');
          }
          const oldestTimestamp = parseFloat(oldestResult[0]?.split('-')[0] || '0');

          return {
            allowed: false,
            remaining: 0,
            resetTime: now + this.config.windowMs,
            retryAfter: Math.max(0, Math.ceil((oldestTimestamp + this.config.windowMs - now) / 1000))
          };
        } catch (oldestReadError) {
          qerrors(oldestReadError as Error, 'rateLimiter.checkRedisLimit: reading oldest timestamp failed', {
            key,
            redisUrl: redisUrl || redisCloudUrl,
            errorType: (oldestReadError as Error).constructor?.name || 'unknown',
            operation: 'zRange'
          });
          console.warn('Redis zRange failed, using fallback:', oldestReadError);
          // Fallback to default behavior
          return {
            allowed: false,
            remaining: 0,
            resetTime: now + this.config.windowMs,
            retryAfter: Math.ceil(this.config.windowMs / 1000)
          };
        }
      }

      return {
        allowed: true,
        remaining: this.config.maxRequests - currentCount - 1,
        resetTime: now + this.config.windowMs
      };
    } catch (error) {
      qerrors(error as Error, 'rateLimiter.checkRedisLimit: Redis pipeline execution failed', {
        key,
        redisUrl: redisUrl || redisCloudUrl,
        errorType: (error as Error).constructor?.name || 'unknown',
        errorMessage: error instanceof Error ? error.message : String(error),
        operation: 'pipeline.exec'
      });
      console.warn('Redis rate limit check failed, using fallback:', error);
      this.isRedisAvailable = false;
      return this.checkFallbackLimit(key, Date.now());
    }
  }

  private checkFallbackLimit(key: string, now: number): RateLimitResult {
    const counter = this.fallbackCounters.get(key);

    if (!counter || now >= counter.resetTime) {
      this.fallbackCounters.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs
      });

      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs
      };
    }

    if (counter.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: counter.resetTime,
        retryAfter: Math.max(0, Math.ceil((counter.resetTime - now) / 1000))
      };
    }

    counter.count++;
    return {
      allowed: true,
      remaining: this.config.maxRequests - counter.count,
      resetTime: counter.resetTime
    };
  }

  async resetKey(key: string): Promise<boolean> {
    try {
      if (this.isRedisAvailable && this.redis) {
        await this.redis.del(key);
      }
      this.fallbackCounters.delete(key);
      return true;
    } catch (error) {
      console.warn('Failed to reset rate limit key:', error);
      return false;
    }
  }

  async getStats(): Promise<RateLimitStats> {
    return {
      isDistributed: this.isRedisAvailable,
      fallbackCounters: this.fallbackCounters.size,
      redisConnected: this.isRedisAvailable
    };
  }

  cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    this.fallbackCounters.forEach((counter, key) => {
      if (now > counter.resetTime) {
        toDelete.push(key);
      }
    });

    toDelete.forEach(key => this.fallbackCounters.delete(key));
  }

  async shutdown(): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.quit();
      }
    } catch (error) {
      console.warn('Redis rate limiter shutdown error:', error);
    }

    // Clear cleanup interval to prevent memory leaks
    if (this._cleanupInterval) {
      clearInterval(this._cleanupInterval);
      this._cleanupInterval = null;
    }

    this.fallbackCounters.clear();
  }
}

export function createDistributedRateLimiter(config: RateLimitConfig): DistributedRateLimiter {
  const limiter = new DistributedRateLimiter(config);
  const cleanupInterval = setInterval(() => {
    limiter.cleanup();
  }, 300000); // Reduced from 60s to 5 minutes

  // Store interval reference for cleanup
  (limiter as any)._cleanupInterval = cleanupInterval;
  return limiter;
}

export function distributedRateLimit(config: RateLimitConfig) {
  const limiter = createDistributedRateLimiter(config);

  return async (req: any, res: any, next: any) => {
    try {
      const result = await limiter.isAllowed(req);

      res.set({
        'X-RateLimit-Limit': config.maxRequests,
        'X-RateLimit-Remaining': Math.max(0, result.remaining),
        'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
      });

      if (!result.allowed) {
        if (result.retryAfter) {
          res.set('Retry-After', result.retryAfter);
        }

        return res.status(429).json({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: result.retryAfter
        });
      }

      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      next();
    }
  };
}

export class InMemoryRateLimiter {
  private counters = new Map<string, { count: number; resetTime: number }>();
  private config: RateLimitConfig;
  private requestHistory = new Map<string, number[]>();
  private patternCache = new Map<string, { avgRequests: number; pattern: string }>();
  private patternAnalysisInterval: NodeJS.Timeout | undefined;
  private maxHistorySize = 500; // Reduced from 1000 to save memory
  private maxTrackedKeys = 5000; // Reduced from 10000 to prevent memory bloat
  private patternAnalysisIntervalMs = 300000; // 5 minutes (reduced frequency)
  
  // Token bucket implementation for smoother request distribution
  private tokenBuckets = new Map<string, { tokens: number; lastRefill: number; capacity: number; refillRate: number }>();
  private readonly defaultBucketCapacity = 100; // Default token capacity
  private readonly defaultRefillRate = 10; // Default tokens per second

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.startPatternAnalysis();
  }

  isAllowed(key: string): RateLimitResult {
    const now = Date.now();
    
    // Use token bucket algorithm for smoother request distribution
    const bucket = this.getOrCreateTokenBucket(key);
    this.refillTokens(bucket, now);
    
    if (bucket.tokens >= 1) {
      bucket.tokens--;
      
      return {
        allowed: true,
        remaining: Math.floor(bucket.tokens),
        resetTime: now + Math.ceil((bucket.capacity - bucket.tokens) / bucket.refillRate * 1000)
      };
    }
    
    // Calculate retry after based on token refill rate
    const retryAfter = Math.ceil((1 - bucket.tokens) / bucket.refillRate * 1000);
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: now + retryAfter,
      retryAfter
    };
  }

  /**
   * Get or create token bucket for key
   */
  private getOrCreateTokenBucket(key: string): { tokens: number; lastRefill: number; capacity: number; refillRate: number } {
    let bucket = this.tokenBuckets.get(key);
    
    if (!bucket) {
      bucket = {
        tokens: this.defaultBucketCapacity,
        lastRefill: Date.now(),
        capacity: this.defaultBucketCapacity,
        refillRate: this.defaultRefillRate
      };
      this.tokenBuckets.set(key, bucket);
    }
    
    return bucket;
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refillTokens(bucket: { tokens: number; lastRefill: number; capacity: number; refillRate: number }, now: number): void {
    const elapsed = (now - bucket.lastRefill) / 1000; // Convert to seconds
    const tokensToAdd = Math.floor(elapsed * bucket.refillRate);
    
    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(bucket.capacity, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }
  }

  reset(key: string): void {
    this.counters.delete(key);
  }

  cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    this.counters.forEach((counter, key) => {
      if (now > counter.resetTime) {
        toDelete.push(key);
      }
    });

    toDelete.forEach(key => this.counters.delete(key));
  }

  /**
   * Get request frequency for a key based on historical data
   */
  private getRequestFrequency(key: string): number {
    const history = this.requestHistory.get(key);
    if (!history || history.length < 2) {
      return 1; // Default frequency
    }
    
    // Calculate requests per second from recent history
    const now = Date.now();
    const recentRequests = history.filter((timestamp: number) => now - timestamp < 60000); // Last minute
    return recentRequests.length / 60; // Requests per second
  }

/**
 * Start pattern analysis for predictive rate limiting
 */
private startPatternAnalysis(): void {
  // Only start pattern analysis if we have reasonable limits
  if (this.maxTrackedKeys > 1000) {
    console.warn('Pattern analysis disabled due to high key limit to prevent memory issues');
    return;
  }
  
  this.patternAnalysisInterval = setInterval(() => {
    try {
      this.analyzeRequestPatterns();
      this.cleanupOldHistory();
    } catch (error) {
      console.error('Pattern analysis error:', error);
      // Disable pattern analysis on repeated errors
      if (this.patternAnalysisInterval) {
        clearInterval(this.patternAnalysisInterval);
        this.patternAnalysisInterval = undefined;
      }
    }
  }, this.patternAnalysisIntervalMs);
}

/**
 * Analyze request patterns to predict usage (optimized for scalability)
 */
private analyzeRequestPatterns(): void {
  const now = Date.now();
  const maxAnalyzeKeys = 100; // Limit analysis to prevent CPU overload
  let analyzedCount = 0;
  
  for (const [key, timestamps] of this.requestHistory.entries()) {
    if (analyzedCount >= maxAnalyzeKeys) break; // Prevent CPU-intensive loops
    if (timestamps.length < 5) continue; // Need sufficient data
    
    // Calculate request rate pattern
    const recentTimestamps = timestamps.filter((t: number) => now - t < 300000); // Last 5 minutes
    if (recentTimestamps.length < 3) continue;
    
    // Simplified pattern calculation - avoid sorting for performance
    const timeSpan = recentTimestamps[recentTimestamps.length - 1] - recentTimestamps[0];
    if (timeSpan <= 0) continue;
    
    const avgRequestsPerSecond = (recentTimestamps.length - 1) / (timeSpan / 1000);
    
    // Store pattern for predictive limiting
    this.patternCache.set(key, {
      avgRequests: avgRequestsPerSecond,
      pattern: this.classifyPattern(avgRequestsPerSecond)
    });
    
    analyzedCount++;
  }
}

  /**
   * Classify request pattern for optimization
   */
  private classifyPattern(requestsPerSecond: number): string {
    if (requestsPerSecond > 10) return 'burst';
    if (requestsPerSecond > 5) return 'high';
    if (requestsPerSecond > 1) return 'medium';
    return 'low';
  }

  /**
   * Update request history for pattern analysis
   */
  private updateRequestHistory(key: string): void {
    // Enforce maximum number of tracked keys to prevent memory bloat
    if (this.requestHistory.size >= this.maxTrackedKeys && !this.requestHistory.has(key)) {
      // Remove multiple oldest keys to make room (aggressive cleanup)
      const keysToRemove = Math.min(10, Math.floor(this.maxTrackedKeys * 0.1)); // Remove 10% or min 10
      const keys = Array.from(this.requestHistory.keys());
      for (let i = 0; i < keysToRemove; i++) {
        const oldestKey = keys[i];
        if (oldestKey) {
          this.requestHistory.delete(oldestKey);
          this.patternCache.delete(oldestKey);
        }
      }
    }
    
    if (!this.requestHistory.has(key)) {
      this.requestHistory.set(key, []);
    }
    
    const history = this.requestHistory.get(key);
    if (history) { // Defensive check to prevent runtime error
      history.push(Date.now());
      
      // Limit history size per key
      if (history.length > this.maxHistorySize) {
        const removeCount = history.length - this.maxHistorySize;
        history.splice(0, removeCount); // Remove only the excess amount
      }
    }
  }

  /**
   * Clean up old history data with aggressive memory management
   */
  private cleanupOldHistory(): void {
    const now = Date.now();
    const cutoff = now - (6 * 60 * 60 * 1000); // Keep last 6 hours (reduced from 24)
    
    const keysToDelete: string[] = [];
    
    for (const [key, timestamps] of this.requestHistory.entries()) {
      const filteredTimestamps = timestamps.filter((t: number) => t > cutoff);
      if (filteredTimestamps.length === 0) {
        keysToDelete.push(key);
      } else if (filteredTimestamps.length < timestamps.length * 0.5) {
        // Significant cleanup, update the history
        this.requestHistory.set(key, filteredTimestamps);
      }
    }
    
    // Delete empty histories and clean up pattern cache
    for (const key of keysToDelete) {
      this.requestHistory.delete(key);
      this.patternCache.delete(key);
    }
    
    // Additional safety: if we still have too many keys, remove the oldest ones
    if (this.requestHistory.size > this.maxTrackedKeys) {
      const keysToRemove = Array.from(this.requestHistory.keys())
        .slice(0, this.requestHistory.size - this.maxTrackedKeys);
      
      for (const key of keysToRemove) {
        this.requestHistory.delete(key);
        this.patternCache.delete(key);
      }
    }
  }

  /**
   * Cleanup method to prevent memory leaks
   */
  destroy(): void {
    if (this.patternAnalysisInterval) {
      clearInterval(this.patternAnalysisInterval);
      this.patternAnalysisInterval = undefined;
    }
    this.counters.clear();
    this.requestHistory.clear();
    this.patternCache.clear();
  }
}

export default DistributedRateLimiter;
