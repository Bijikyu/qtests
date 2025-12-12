// Opossum-based Circuit Breaker Implementation
//
// This module replaces the custom circuit breaker with industry-standard Opossum
// Provides battle-tested circuit breaker functionality with extensive features
//
// Migration Benefits:
// - Production-ready reliability (1.6k stars, 8.8k projects using)
// - Event-driven architecture for better monitoring
// - AbortController support for modern async patterns
// - Prometheus metrics integration available
// - Hystrix dashboard compatibility
// - Comprehensive fallback system

import CircuitBreaker from 'opossum';

// Type definitions for backward compatibility with existing code
export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  timeout?: number;
  resetTimeout?: number;
  monitoringPeriod?: number;
  // Additional opossum-specific options
  errorThresholdPercentage?: number;
  volumeThreshold?: number;
  rollingCountTimeout?: number;
  rollingCountBuckets?: number;
  name?: string;
  enabled?: boolean;
  allowWarmUp?: boolean;
  maxConcurrentCalls?: number;
  cache?: boolean;
  cacheTTL?: number;
  coalesce?: boolean;
  coalesceTTL?: number;
  coalesceResetOn?: ('error' | 'success' | 'timeout')[];
  cacheGetKey?: (...args: any[]) => string;
  timeoutFromOptions?: number;
  status?: any;
  state?: any;
  fallback?: (...args: any[]) => any;
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
  totalRequests: number;
  // Additional opossum stats
  fires: number;
  timeouts: number;
  rejects: number;
  cacheHits: number;
  cacheMisses: number;
  percentiles?: Record<string, number>;
  latencyMean?: number;
}

/**
 * Create an Opossum circuit breaker with enhanced compatibility
 * 
 * @param asyncFunction - Function to protect with circuit breaker
 * @param options - Configuration options (extends original interface)
 * @returns Circuit breaker instance
 */
export function createCircuitBreaker<T extends (...args: any[]) => Promise<any>>(
  asyncFunction: T,
  options: CircuitBreakerOptions = {}
): CircuitBreaker & { getStats: () => CircuitBreakerStats; getState: () => CircuitState } {
  
  // Map our options to opossum options
  const opossumOptions = {
    timeout: options.timeout || 60000,
    errorThresholdPercentage: options.errorThresholdPercentage || 50,
    resetTimeout: options.resetTimeout || 30000,
    volumeThreshold: options.volumeThreshold || 10,
    rollingCountTimeout: options.rollingCountTimeout || 10000,
    rollingCountBuckets: options.rollingCountBuckets || 10,
    name: options.name || asyncFunction.name || 'unnamed',
    enabled: options.enabled !== false,
    allowWarmUp: options.allowWarmUp || false,
    maxConcurrentCalls: options.maxConcurrentCalls || 10,
    cache: options.cache || false,
    cacheTTL: options.cacheTTL || 1000,
    coalesce: options.coalesce || false,
    coalesceTTL: options.coalesceTTL || 1000,
    coalesceResetOn: options.coalesceResetOn || ['error', 'success', 'timeout'],
    cacheGetKey: options.cacheGetKey || (() => 'default'),
    fallback: options.fallback
  };

  // Create opossum circuit breaker
  const breaker = new CircuitBreaker(asyncFunction, opossumOptions);

  // Add compatibility methods
  const enhancedBreaker = breaker as any;
  
  enhancedBreaker.getStats = (): CircuitBreakerStats => {
    const stats = breaker.stats;
    return {
      state: mapState(breaker.opened),
      failures: stats.failures,
      successes: stats.successes,
      lastFailureTime: undefined, // opossum doesn't expose this
      lastSuccessTime: undefined, // opossum doesn't expose this
      totalRequests: stats.fires,
      fires: stats.fires,
      timeouts: stats.timeouts,
      rejects: stats.rejects,
      cacheHits: stats.cacheHits,
      cacheMisses: stats.cacheMisses,
      percentiles: stats.percentiles,
      latencyMean: stats.latencyMean
    };
  };

  enhancedBreaker.getState = (): CircuitState => {
    return mapState(breaker.stats);
  };

  // Map opossum state to our interface
  function mapState(stats: any): CircuitState {
    if (stats.open) return 'OPEN';
    if (stats.halfOpen) return 'HALF_OPEN';
    return 'CLOSED';
  }

  return enhancedBreaker;
}

/**
 * Default circuit breaker with sensible defaults
 */
export const defaultCircuitBreaker = createCircuitBreaker(() => Promise.resolve(), {
  failureThreshold: 5,
  timeout: 60000,
  resetTimeout: 120000,
  monitoringPeriod: 300000
});

/**
 * Fast circuit breaker for low-latency operations
 */
export const fastCircuitBreaker = createCircuitBreaker(() => Promise.resolve(), {
  failureThreshold: 3,
  timeout: 30000,
  resetTimeout: 60000,
  monitoringPeriod: 120000
});

/**
 * Slow circuit breaker for batch operations
 */
export const slowCircuitBreaker = createCircuitBreaker(() => Promise.resolve(), {
  failureThreshold: 10,
  timeout: 120000,
  resetTimeout: 300000,
  monitoringPeriod: 600000
});

// Re-export opossum for advanced usage
export { CircuitBreaker };
export default createCircuitBreaker;