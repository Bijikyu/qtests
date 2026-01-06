/**
 * Distributed Rate Limiter - DEPRECATED
 * 
 * This module is deprecated. Use lib/rateLimiter.ts instead.
 * The modern implementation provides cleaner functional interfaces
 * while maintaining full backward compatibility.
 * 
 * Migration Guide:
 * - Import from lib/rateLimiter.ts instead
 * - Use createDistributedRateLimiter() and createInMemoryRateLimiter() functions
 * - All existing APIs are preserved in the new module
 */

// Re-export from the consolidated rate limiter module
export {
  createDistributedRateLimiter,
  createInMemoryRateLimiter,
  checkRateLimit,
  resetRateLimitKey,
  getRateLimitStats,
  getDistributedRateLimiter,
  getInMemoryRateLimiter,
  DistributedRateLimiter as LegacyDistributedRateLimiter,
  InMemoryRateLimiter as LegacyInMemoryRateLimiter,
  RateLimiterRedis,
  RateLimiterMemory,
  RateLimiterAbstract,
  type RateLimitConfig,
  type RateLimitResult,
  type RateLimitStats
} from './rateLimiter.js';

// Note: RateLimiterRedis and RateLimiterMemory are already exported above from rateLimiter.js