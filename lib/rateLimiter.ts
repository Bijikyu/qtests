/**
 * Distributed Rate Limiter
 * 
 * Redis-based distributed rate limiting for multi-instance deployments.
 * Provides consistent rate limiting across multiple server instances using
 * sliding window algorithm. Includes graceful fallback to in-memory rate
 * limiting when Redis is unavailable.
 * 
 * Features:
 * - Sliding window algorithm for accurate rate limiting
 * - Graceful degradation to in-memory when Redis fails
 * - Express middleware for drop-in replacement
 * - Comprehensive statistics and monitoring
 * - Automatic cleanup of expired counters
 */

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
  
  // Performance optimization: Smart cache with pattern recognition
  private recentCache = new Map<string, { result: RateLimitResult; timestamp: number; frequency: number }>();
  private readonly maxCacheSize = 500; // Reduced to prevent memory leaks
  private readonly cacheTtl = 5000; // 5 seconds cache TTL
  
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
 * Cache rate limit result with adaptive eviction based on memory pressure
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
  } else {
    this.recentCache.set(key, {
      result,
      timestamp: Date.now(),
      frequency: 1
    });
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
 * Perform adaptive eviction with intelligent prioritization
 */
private performAdaptiveEviction(memoryPressure: number, effectiveMaxSize: number): void {
  const entries = Array.from(this.recentCache.entries());
  
  // Score entries for eviction (higher score = more likely to evict)
  const scoredEntries = entries.map(([key, cached]) => {
    let score = 0;
    
    // Age factor (older = higher score)
    const age = Date.now() - cached.timestamp;
    score += Math.min(30, (age / 60000) * 10); // Max 30 points for age
    
    // Result type factor (allowed requests = higher score, blocked = lower)
    if (cached.result.allowed) {
      score += 20; // Allowed requests are less critical
    } else {
      score -= 10; // Blocked requests are more important to keep
    }
    
    // Frequency factor (low frequency = higher score)
    score += Math.max(0, 20 - cached.frequency * 2); // Max 20 points for low frequency
    
    // Memory pressure adjustment
    if (memoryPressure > 0.8) {
      score += 10; // Extra incentive to evict under high pressure
    }
    
    return { key, cached, score };
  });
  
  // Sort by score (highest first) and evict
  scoredEntries.sort((a, b) => b.score - a.score);
  
  // Calculate how many to evict
  const toEvict = Math.max(1, Math.floor(entries.length * 0.2)); // Evict 20% or minimum 1
  
  for (let i = 0; i < Math.min(toEvict, scoredEntries.length); i++) {
    const { key } = scoredEntries[i];
    this.recentCache.delete(key);
  }
  
  // Log significant evictions
  if (toEvict > 5 || memoryPressure > 0.8) {
    console.debug(`Rate limiter cache eviction: removed ${toEvict} entries, memory pressure: ${(memoryPressure * 100).toFixed(1)}%`);
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
  }, 60000);

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
  private maxHistorySize = 1000;
  private patternAnalysisIntervalMs = 60000; // 1 minute

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.startPatternAnalysis();
  }

  isAllowed(key: string): RateLimitResult {
    const now = Date.now();
    const counter = this.counters.get(key);

    if (!counter || now > counter.resetTime) {
      this.counters.set(key, {
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
    this.patternAnalysisInterval = setInterval(() => {
      this.analyzeRequestPatterns();
      this.cleanupOldHistory();
    }, this.patternAnalysisIntervalMs);
  }

  /**
   * Analyze request patterns to predict usage
   */
  private analyzeRequestPatterns(): void {
    const now = Date.now();
    
    for (const [key, timestamps] of this.requestHistory.entries()) {
      if (timestamps.length < 5) continue; // Need sufficient data
      
      // Calculate request rate pattern
      const recentTimestamps = timestamps.filter((t: number) => now - t < 300000); // Last 5 minutes
      if (recentTimestamps.length < 3) continue;
      
      // Sort timestamps to calculate intervals
      recentTimestamps.sort((a: number, b: number) => a - b);
      const intervals: number[] = [];
      for (let i = 1; i < recentTimestamps.length; i++) {
        intervals.push(recentTimestamps[i] - recentTimestamps[i - 1]);
      }
      
      // Calculate average interval
      const avgInterval = intervals.reduce((sum: number, interval: number) => sum + interval, 0) / intervals.length;
      const avgRequestsPerSecond = 1000 / avgInterval;
      
      // Store pattern for predictive limiting
      this.patternCache.set(key, {
        avgRequests: avgRequestsPerSecond,
        pattern: this.classifyPattern(avgRequestsPerSecond)
      });
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
    if (!this.requestHistory.has(key)) {
      this.requestHistory.set(key, []);
    }
    
    const history = this.requestHistory.get(key)!;
    history.push(Date.now());
    
    // Limit history size
    if (history.length > this.maxHistorySize) {
      history.splice(0, history.length - this.maxHistorySize);
    }
  }

  /**
   * Clean up old history data
   */
  private cleanupOldHistory(): void {
    const now = Date.now();
    const cutoff = now - (24 * 60 * 60 * 1000); // Keep last 24 hours
    
    for (const [key, timestamps] of this.requestHistory.entries()) {
      const filteredTimestamps = timestamps.filter((t: number) => t > cutoff);
      if (filteredTimestamps.length === 0) {
        this.requestHistory.delete(key);
      } else {
        this.requestHistory.set(key, filteredTimestamps);
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
