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
  
  // Performance optimization: LRU cache for recent rate limit checks
  private recentChecks = new Map<string, { result: RateLimitResult; timestamp: number }>();
  private readonly cacheMaxSize = 1000;
  private readonly cacheTtlMs = 1000; // 1 second cache TTL

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
    const cached = this.recentChecks.get(key);
    if (cached && (now - cached.timestamp) < this.cacheTtlMs) {
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
   * Cache rate limit result with LRU eviction
   */
  private cacheResult(key: string, result: RateLimitResult): void {
    // Evict oldest entry if cache is full
    if (this.recentChecks.size >= this.cacheMaxSize) {
      const oldestKey = this.recentChecks.keys().next().value;
      if (oldestKey) {
        this.recentChecks.delete(oldestKey);
      }
    }
    
    this.recentChecks.set(key, {
      result,
      timestamp: Date.now()
    });
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

  constructor(config: RateLimitConfig) {
    this.config = config;
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
}

export default DistributedRateLimiter;
