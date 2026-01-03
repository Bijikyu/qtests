/**
 * Rate Limiter Implementation using rate-limiter-flexible
 * Simplified wrapper around rate-limiter-flexible for better maintainability
 * 
 * Direct use of rate-limiter-flexible recommended for new code:
 * 
 * import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible';
 * const limiter = new RateLimiterRedis(options);
 * await limiter.consume(key);
 */

import { RateLimiterRedis, RateLimiterMemory, RateLimiterAbstract } from 'rate-limiter-flexible';
import { redisUrl, redisCloudUrl } from '../config/localVars.js';
import qerrors from 'qerrors';

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: any) => string;
  points?: number; // rate-limiter-flexible uses points instead of maxRequests
  duration?: number; // rate-limiter-flexible uses duration instead of windowMs
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export interface RateLimitStats {
  isDistributed: boolean;
  redisConnected: boolean;
}

/**
 * Simplified Distributed Rate Limiter using rate-limiter-flexible
 */
export class DistributedRateLimiter {
  private limiter: RateLimiterAbstract;
  private isRedisAvailable = false;
  private config: RateLimitConfig;
  private initialized = false;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.limiter = new RateLimiterMemory({}); // Temporary initializer
    this.setupLimiter();
  }

  private async setupLimiter(): Promise<void> {
    try {
      const redisUrlToUse = redisUrl || redisCloudUrl;
      
      if (redisUrlToUse) {
        // Use Redis for distributed rate limiting
        const { createClient } = await import('redis');
        const redis = createClient({ url: redisUrlToUse });
        
        await redis.connect();
        
        this.limiter = new RateLimiterRedis({
          storeClient: redis,
          keyPrefix: 'rlflx',
          points: this.config.points || this.config.maxRequests,
          duration: this.config.duration || Math.ceil(this.config.windowMs / 1000),
        });
        
        this.isRedisAvailable = true;
        console.log('Redis rate limiter initialized');
        
      } else {
        // Use in-memory rate limiting as fallback
        this.limiter = new RateLimiterMemory({
          points: this.config.points || this.config.maxRequests,
          duration: this.config.duration || Math.ceil(this.config.windowMs / 1000),
        });
        
        this.isRedisAvailable = false;
        console.log('In-memory rate limiter initialized');
      }
    } catch (error) {
      qerrors(error as Error, 'rateLimiter.setup: initialization failed', {
        redisUrl: redisUrl || redisCloudUrl,
        errorType: (error as Error).constructor.name,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      
      // Fallback to in-memory rate limiting
      this.limiter = new RateLimiterMemory({
        points: this.config.points || this.config.maxRequests,
        duration: this.config.duration || Math.ceil(this.config.windowMs / 1000),
      });
      
      this.isRedisAvailable = false;
      console.warn('Rate limiter failed to initialize, using in-memory fallback');
    }
  }

  async isAllowed(req: any): Promise<RateLimitResult> {
    const key = this.config.keyGenerator ?
      this.config.keyGenerator(req) :
      `rate_limit:${req.ip || 'unknown'}:${req.path || 'default'}`;

    try {
      const result = await this.limiter.consume(key);
      
      return {
        allowed: true,
        remaining: result.remainingPoints || 0,
        resetTime: Date.now() + (result.msBeforeNext || 0),
      };
    } catch (rejRes: any) {
      if (rejRes instanceof Error) {
        // Unexpected error
        qerrors(rejRes, 'rateLimiter.isAllowed: unexpected error', { key });
        return {
          allowed: true, // Allow on error to prevent blocking
          remaining: 0,
          resetTime: Date.now() + this.config.windowMs,
        };
      }
      
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + (rejRes.msBeforeNext || 0),
        retryAfter: Math.ceil((rejRes.msBeforeNext || 0) / 1000),
      };
    }
  }

  async resetKey(key: string): Promise<void> {
    try {
      await this.limiter.delete(key);
    } catch (error) {
      qerrors(error as Error, 'rateLimiter.resetKey: failed', { key });
    }
  }

  getStats(): RateLimitStats {
    return {
      isDistributed: this.isRedisAvailable,
      redisConnected: this.isRedisAvailable,
    };
  }

  // Get access to underlying limiter for advanced operations
  get rateLimiter(): RateLimiterAbstract {
    return this.limiter;
  }
}

/**
 * In-Memory Rate Limiter using rate-limiter-flexible
 */
export class InMemoryRateLimiter {
  private limiter: RateLimiterMemory;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.limiter = new RateLimiterMemory({
      points: this.config.points || this.config.maxRequests,
      duration: this.config.duration || Math.ceil(this.config.windowMs / 1000),
    });
  }

  async isAllowed(req: any): Promise<RateLimitResult> {
    const key = this.config.keyGenerator ?
      this.config.keyGenerator(req) :
      `rate_limit:${req.ip || 'unknown'}:${req.path || 'default'}`;

    try {
      const result = await this.limiter.consume(key);
      
      return {
        allowed: true,
        remaining: result.remainingPoints || 0,
        resetTime: Date.now() + (result.msBeforeNext || 0),
      };
    } catch (rejRes: any) {
      if (rejRes instanceof Error) {
        // Unexpected error
        qerrors(rejRes, 'rateLimiter.isAllowed: unexpected error', { key });
        return {
          allowed: true, // Allow on error to prevent blocking
          remaining: 0,
          resetTime: Date.now() + this.config.windowMs,
        };
      }
      
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + (rejRes.msBeforeNext || 0),
        retryAfter: Math.ceil((rejRes.msBeforeNext || 0) / 1000),
      };
    }
  }

  async resetKey(key: string): Promise<void> {
    try {
      await this.limiter.delete(key);
    } catch (error) {
      qerrors(error as Error, 'rateLimiter.resetKey: failed', { key });
    }
  }

  getStats(): RateLimitStats {
    return {
      isDistributed: false,
      redisConnected: false,
    };
  }

  // Get access to underlying limiter for advanced operations
  get rateLimiter(): RateLimiterMemory {
    return this.limiter;
  }
}

// Export rate-limiter-flexible classes for direct use
export { RateLimiterRedis, RateLimiterMemory, RateLimiterAbstract };

export default {
  DistributedRateLimiter,
  InMemoryRateLimiter,
};