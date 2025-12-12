import { default as CircuitBreaker } from 'opossum';

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  timeout?: number;
  resetTimeout?: number;
  monitoringPeriod?: number;
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
  fires: number;
  timeouts: number;
  rejects: number;
  cacheHits: number;
  cacheMisses: number;
  percentiles?: Record<string, number>;
  latencyMean?: number;
}

export function createCircuitBreaker<T extends (...args: any[]) => Promise<any>>(
  asyncFunction: T,
  options: CircuitBreakerOptions = {}
): CircuitBreaker & { getStats: () => CircuitBreakerStats; getState: () => CircuitState } {
  const opossumOptions = {
    timeout: options.timeout ?? 60000,
    errorThresholdPercentage: options.errorThresholdPercentage ?? 50,
    resetTimeout: options.resetTimeout ?? 30000,
    volumeThreshold: options.volumeThreshold ?? 10,
    rollingCountTimeout: options.rollingCountTimeout ?? 10000,
    rollingCountBuckets: options.rollingCountBuckets ?? 10,
    name: options.name ?? asyncFunction.name ?? 'unnamed',
    enabled: options.enabled !== false,
    allowWarmUp: options.allowWarmUp ?? false,
    maxConcurrentCalls: options.maxConcurrentCalls ?? 10,
    cache: options.cache ?? false,
    cacheTTL: options.cacheTTL ?? 1000,
    coalesce: options.coalesce ?? false,
    coalesceTTL: options.coalesceTTL ?? 1000,
    coalesceResetOn: options.coalesceResetOn ?? ['error', 'success', 'timeout'],
    cacheGetKey: options.cacheGetKey ?? (() => 'default'),
    fallback: options.fallback
  };

  const breaker = new CircuitBreaker(asyncFunction, opossumOptions);
  const enhancedBreaker = breaker as any;
  
  enhancedBreaker.getStats = (): CircuitBreakerStats => {
    const stats = breaker.stats;
    return {
      state: mapState(breaker),
      failures: stats.failures,
      successes: stats.successes,
      lastFailureTime: undefined,
      lastSuccessTime: undefined,
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

  enhancedBreaker.getState = (): CircuitState => mapState(breaker);

  function mapState(stats: any): CircuitState {
    return stats.open ? 'OPEN' : stats.halfOpen ? 'HALF_OPEN' : 'CLOSED';
  }

  return enhancedBreaker;
}

export const defaultCircuitBreaker = createCircuitBreaker(() => Promise.resolve(), {
  failureThreshold: 5,
  timeout: 60000,
  resetTimeout: 120000,
  monitoringPeriod: 300000
});

export const fastCircuitBreaker = createCircuitBreaker(() => Promise.resolve(), {
  failureThreshold: 3,
  timeout: 30000,
  resetTimeout: 60000,
  monitoringPeriod: 120000
});

export const slowCircuitBreaker = createCircuitBreaker(() => Promise.resolve(), {
  failureThreshold: 10,
  timeout: 120000,
  resetTimeout: 300000,
  monitoringPeriod: 600000
});

export { CircuitBreaker };
export default createCircuitBreaker;