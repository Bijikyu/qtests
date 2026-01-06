/**
 * Distributed Rate Limiter - Replaced with rate-limiter-flexible
 * 
 * Migration Guide:
 * - DistributedRateLimiter -> RateLimiterRedis
 * - InMemoryRateLimiter -> RateLimiterMemory
 * - Use standard rate-limiter-flexible API
 * 
 * Features retained:
 * - Distributed rate limiting with Redis
 * - Graceful fallback to in-memory
 * - Sliding window algorithm
 * - Express middleware support
 */

import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible';
import { redisUrl, redisCloudUrl } from '../config/localVars.js';
import qerrors from 'qerrors';

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

/**
 * Distributed Rate Limiter using rate-limiter-flexible
 */
export class DistributedRateLimiter {
  private redisLimiter: RateLimiterRedis | null = null;
  private memoryLimiter: RateLimiterMemory;
  private config: RateLimitConfig;
  private isRedisAvailable = false;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.memoryLimiter = new RateLimiterMemory({
      points: config.maxRequests,
      duration: Math.ceil(config.windowMs / 1000),
      blockDuration: 0, // Do not block, just return false
    });
    
    this.setupRedisLimiter();
  }

  private async setupRedisLimiter(): Promise<void> {
    const redisUrlToUse = redisUrl || redisCloudUrl;
    if (!redisUrlToUse) {
      console.log('Redis not configured for rate limiting, using memory fallback');
      return;
    }

    try {
      const { createClient } = await import('redis');
      const redis = createClient({ url: redisUrlToUse });
      
      await redis.connect();
      
      this.redisLimiter = new RateLimiterRedis({
        storeClient: redis,
        points: this.config.maxRequests,
        duration: Math.ceil(this.config.windowMs / 1000),
        blockDuration: 0,
        keyPrefix: 'rlf',
      });
      
      this.isRedisAvailable = true;
      console.log('Redis rate limiter connected');
    } catch (error) {
      qerrors(error as Error, 'rateLimiter.setupRedisLimiter: Redis setup failed', {
        redisUrl: redisUrlToUse,
        errorType: (error as Error).constructor?.name || 'unknown'
      });
      this.isRedisAvailable = false;
    }
  }

  async isAllowed(req: any): Promise<RateLimitResult> {
    const key = this.config.keyGenerator ?
      this.config.keyGenerator(req) :
      `rate_limit:${req.ip}:${req.path}`;

    try {
      // Try Redis limiter first
      if (this.isRedisAvailable && this.redisLimiter) {
        const result = await this.redisLimiter.consume(key, 1);
        return {
          allowed: true,
          remaining: result.remainingPoints || 0,
          resetTime: Date.now() + (result.msBeforeNext || 0)
        };
      }

      // Fallback to memory limiter
      const memoryResult = await this.memoryLimiter.consume(key, 1);
      return {
        allowed: true,
        remaining: memoryResult.remainingPoints || 0,
        resetTime: Date.now() + (memoryResult.msBeforeNext || 0)
      };
    } catch (rejRes: any) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + (rejRes.msBeforeNext || 0),
        retryAfter: Math.ceil((rejRes.msBeforeNext || 0) / 1000)
      };
    }
  }

  async resetKey(key: string): Promise<boolean> {
    try {
      if (this.isRedisAvailable && this.redisLimiter) {
        await this.redisLimiter.delete(key);
      }
      await this.memoryLimiter.delete(key);
      return true;
    } catch (error) {
      console.warn('Failed to reset rate limit key:', error);
      return false;
    }
  }

  async getStats(): Promise<RateLimitStats> {
    return {
      isDistributed: this.isRedisAvailable,
      fallbackCounters: this.isRedisAvailable ? 0 : 1,
      redisConnected: this.isRedisAvailable
    };
  }

  async shutdown(): Promise<void> {
    try {
      // Redis limiter cleanup is handled automatically
      this.redisLimiter = null;
      this.isRedisAvailable = false;
    } catch (error) {
      console.warn('Redis rate limiter shutdown error:', error);
    }
  }
}

/**
 * In-memory Rate Limiter using rate-limiter-flexible
 */
export class InMemoryRateLimiter {
  private limiter: RateLimiterMemory;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.limiter = new RateLimiterMemory({
      points: config.maxRequests,
      duration: Math.ceil(config.windowMs / 1000),
      blockDuration: 0,
    });
  }

  async isAllowed(key: string): Promise<RateLimitResult> {
    try {
      const result = await this.limiter.consume(key, 1);
      return {
        allowed: true,
        remaining: result.remainingPoints || 0,
        resetTime: Date.now() + (result.msBeforeNext || 0)
      };
    } catch (rejRes: any) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + (rejRes.msBeforeNext || 0),
        retryAfter: Math.ceil((rejRes.msBeforeNext || 0) / 1000)
      };
    }
  }

  reset(key: string): void {
    this.limiter.delete(key);
  }
}

/**
 * Create distributed rate limiter
 */
export function createDistributedRateLimiter(config: RateLimitConfig): DistributedRateLimiter {
  return new DistributedRateLimiter(config);
}

/**
 * Express middleware for distributed rate limiting
 */
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

export default DistributedRateLimiter;