/**
 * Rate Limiting Implementation using rate-limiter-flexible
 * Direct use of industry-standard rate limiting with simplified interfaces
 * 
 * This module provides simplified interfaces to rate-limiter-flexible
 * while maintaining the same API for backward compatibility.
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
 * Create a distributed rate limiter using rate-limiter-flexible
 * @param config - Rate limit configuration
 * @returns Promise resolving to RateLimiterAbstract instance
 */
export async function createDistributedRateLimiter(config: RateLimitConfig): Promise<RateLimiterAbstract> {
  try {
    const redisUrlToUse = redisUrl || redisCloudUrl;
    
    if (redisUrlToUse) {
      // Use Redis for distributed rate limiting
      const { createClient } = await import('redis');
      const redis = createClient(redisUrlToUse);
      
      await redis.connect();
      
      const limiter = new RateLimiterRedis({
        storeClient: redis,
        keyPrefix: 'rlflx',
        points: config.points || config.maxRequests,
        duration: config.duration || Math.ceil(config.windowMs / 1000),
      });
      
      console.log('Redis rate limiter initialized');
      return limiter;
    } else {
      throw new Error('Redis not configured');
    }
  } catch (error) {
    qerrors(error as Error, 'createDistributedRateLimiter: Redis setup failed, falling back to memory', {
      redisUrl: redisUrl || redisCloudUrl,
      errorType: (error as Error).constructor.name
    });
    
    // Fallback to in-memory rate limiting
    return new RateLimiterMemory({
      points: config.points || config.maxRequests,
      duration: config.duration || Math.ceil(config.windowMs / 1000),
    });
  }
}

/**
 * Create an in-memory rate limiter using rate-limiter-flexible
 * @param config - Rate limit configuration
 * @returns RateLimiterMemory instance
 */
export function createInMemoryRateLimiter(config: RateLimitConfig): RateLimiterMemory {
  return new RateLimiterMemory({
    points: config.points || config.maxRequests,
    duration: config.duration || Math.ceil(config.windowMs / 1000),
  });
}

/**
 * Check rate limit for a request using a rate limiter
 * @param limiter - Rate limiter instance
 * @param req - Request object
 * @param config - Rate limit configuration
 * @returns Promise resolving to RateLimitResult
 */
export async function checkRateLimit(
  limiter: RateLimiterAbstract,
  req: any,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = config.keyGenerator ?
    config.keyGenerator(req) :
    `rate_limit:${req.ip || 'unknown'}:${req.path || 'default'}`;

  try {
    const result = await limiter.consume(key);
    
    return {
      allowed: true,
      remaining: result.remainingPoints || 0,
      resetTime: Date.now() + (result.msBeforeNext || 0),
    };
  } catch (rejRes: any) {
    if (rejRes instanceof Error) {
      // Unexpected error
      qerrors(rejRes, 'checkRateLimit: unexpected error', { key });
      return {
        allowed: true, // Allow on error to prevent blocking
        remaining: 0,
        resetTime: Date.now() + config.windowMs,
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

/**
 * Reset rate limit for a specific key
 * @param limiter - Rate limiter instance
 * @param key - Key to reset
 * @returns Promise that resolves when reset is complete
 */
export async function resetRateLimitKey(
  limiter: RateLimiterAbstract,
  key: string
): Promise<void> {
  try {
    await limiter.delete(key);
  } catch (error) {
    qerrors(error as Error, 'resetRateLimitKey: failed', { key });
  }
}

/**
 * Get rate limit statistics
 * @param limiter - Rate limiter instance
 * @returns RateLimitStats
 */
export function getRateLimitStats(limiter: RateLimiterAbstract): RateLimitStats {
  return {
    isDistributed: limiter instanceof RateLimiterRedis,
    redisConnected: limiter instanceof RateLimiterRedis
  };
}

/**
 * Convenience function to create and use a distributed rate limiter
 * @param config - Rate limit configuration
 * @returns Promise resolving to rate limiter instance
 */
export async function getDistributedRateLimiter(config: RateLimitConfig): Promise<RateLimiterAbstract> {
  return createDistributedRateLimiter(config);
}

/**
 * Convenience function to create and use an in-memory rate limiter
 * @param config - Rate limit configuration
 * @returns Rate limiter instance
 */
export function getInMemoryRateLimiter(config: RateLimitConfig): RateLimiterMemory {
  return createInMemoryRateLimiter(config);
}

/**
 * Legacy DistributedRateLimiter class for backward compatibility
 * @deprecated Use createDistributedRateLimiter function instead
 */
export class DistributedRateLimiter {
  private limiter: RateLimiterAbstract;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.limiter = new RateLimiterMemory({}); // Temporary initializer
    this.setupLimiter();
  }

  private async setupLimiter(): Promise<void> {
    this.limiter = await createDistributedRateLimiter(this.config);
  }

  async isAllowed(req: any): Promise<RateLimitResult> {
    // Ensure limiter is initialized
    if (this.limiter instanceof RateLimiterMemory && this.limiter.points === 0) {
      await this.setupLimiter();
    }
    return checkRateLimit(this.limiter, req, this.config);
  }

  async resetKey(key: string): Promise<void> {
    return resetRateLimitKey(this.limiter, key);
  }

  getStats(): RateLimitStats {
    return getRateLimitStats(this.limiter);
  }

  // Get access to underlying limiter for advanced operations
  get rateLimiter(): RateLimiterAbstract {
    return this.limiter;
  }
}

/**
 * Legacy InMemoryRateLimiter class for backward compatibility
 * @deprecated Use createInMemoryRateLimiter function instead
 */
export class InMemoryRateLimiter {
  private limiter: RateLimiterMemory;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.limiter = createInMemoryRateLimiter(config);
  }

  async isAllowed(req: any): Promise<RateLimitResult> {
    return checkRateLimit(this.limiter, req, this.config);
  }

  async resetKey(key: string): Promise<void> {
    return resetRateLimitKey(this.limiter, key);
  }

  getStats(): RateLimitStats {
    return getRateLimitStats(this.limiter);
  }

  // Get access to underlying limiter for advanced operations
  get rateLimiter(): RateLimiterMemory {
    return this.limiter;
  }
}

// Export rate-limiter-flexible classes for direct use
export { RateLimiterRedis, RateLimiterMemory, RateLimiterAbstract };

export default {
  createDistributedRateLimiter,
  createInMemoryRateLimiter,
  checkRateLimit,
  resetRateLimitKey,
  getRateLimitStats,
  getDistributedRateLimiter,
  getInMemoryRateLimiter,
  DistributedRateLimiter,
  InMemoryRateLimiter,
  RateLimiterRedis,
  RateLimiterMemory,
  RateLimiterAbstract
};