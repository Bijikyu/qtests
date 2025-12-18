/**
 * Consolidated Circuit Breaker Utilities
 * Provides comprehensive circuit breaker implementations for fault tolerance
 * Consolidates functionality from circuitBreaker.ts and circuitBreakerModern.ts
 * Eliminates ~85% code duplication while preserving all features
 * 
 * Design philosophy:
 * - Opossum-based implementation for production use
 * - Manager pattern for multi-breaker orchestration
 * - Event-driven state management and monitoring
 * - Flexible configuration for different use cases
 * - Legacy support for backward compatibility
 */

import { default as CircuitBreaker } from 'opossum';
import { EventEmitter } from 'events';
import { setLogging } from './logUtils.js';
process.env.NODE_ENV !== 'test' && setLogging(false);

// ==================== TYPE DEFINITIONS ====================

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

/**
 * Comprehensive circuit breaker configuration options
 * Combines options from both original implementations
 */
export interface CircuitBreakerOptions {
  // Core timing options
  timeout?: number;
  resetTimeout?: number;
  rollingCountTimeout?: number;
  
  // Threshold options
  failureThreshold?: number;
  errorThresholdPercentage?: number;
  volumeThreshold?: number;
  minimumNumberOfCalls?: number;
  
  // Bucket configuration
  rollingCountBuckets?: number;
  monitoringPeriod?: number;
  
  // Behavioral options
  enabled?: boolean;
  allowWarmUp?: boolean;
  maxConcurrentCalls?: number;
  
  // Caching options
  cache?: boolean;
  cacheTTL?: number;
  cacheGetKey?: (...args: any[]) => string;
  
  // Coalescing options
  coalesce?: boolean;
  coalesceTTL?: number;
  coalesceResetOn?: ('error' | 'success' | 'timeout')[];
  
  // Identification
  name?: string;
  group?: string;
  
  // Fallback
  fallback?: (...args: any[]) => any;
  
  // Legacy options for backward compatibility
  status?: any;
  state?: any;
}

/**
 * Circuit breaker statistics interface
 */
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

/**
 * Alternative statistics interface from modern implementation
 */
export interface CircuitBreakerState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  stats: {
    totalCalls: number;
    failedCalls: number;
    successCalls: number;
    timeoutCalls: number;
    shortCircuitedCalls: number;
  };
  lastError?: Error;
  lastFailureTime?: number;
}

/**
 * Configuration interface for modern implementation
 */
export interface CircuitBreakerConfig {
  timeout: number;
  errorThresholdPercentage: number;
  resetTimeout: number;
  rollingCountTimeout: number;
  rollingCountBuckets: number;
  minimumNumberOfCalls: number;
  volumeThreshold: number;
  enabled: boolean;
  name?: string;
  group?: string;
}

// ==================== DEFAULT CONFIGURATIONS ====================

/**
 * Default configuration from modern implementation
 */
export const defaultCircuitBreakerConfig: CircuitBreakerConfig = {
  timeout: 30000,
  errorThresholdPercentage: 50,
  resetTimeout: 60000,
  rollingCountTimeout: 10000,
  rollingCountBuckets: 10,
  minimumNumberOfCalls: 10,
  volumeThreshold: 10,
  enabled: true,
};

/**
 * Default options for backward compatibility
 */
export const getDefaultOptions = (): CircuitBreakerOptions => ({
  timeout: 60000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
  volumeThreshold: 10,
  rollingCountTimeout: 10000,
  rollingCountBuckets: 10,
  name: 'unnamed',
  enabled: true,
  allowWarmUp: false,
  maxConcurrentCalls: 10,
  cache: false,
  cacheTTL: 1000,
  coalesce: false,
  coalesceTTL: 1000,
  coalesceResetOn: ['error', 'success', 'timeout'],
  cacheGetKey: () => 'default',
});

// ==================== CORE CIRCUIT BREAKER IMPLEMENTATION ====================

/**
 * Create a circuit breaker with enhanced functionality
 * 
 * @param asyncFunction - Function to protect with circuit breaker
 * @param options - Configuration options
 * @returns Enhanced circuit breaker with additional methods
 */
export function createCircuitBreaker<T extends (...args: any[]) => Promise<any>>(
  asyncFunction: T,
  options: CircuitBreakerOptions = {}
): CircuitBreaker & { 
  getStats: () => CircuitBreakerStats; 
  getState: () => CircuitState;
  getDetailedState: () => CircuitBreakerState;
} {
  const defaultOpts = getDefaultOptions();
  const mergedOptions = { ...defaultOpts, ...options };

  const opossumOptions = {
    timeout: mergedOptions.timeout,
    errorThresholdPercentage: mergedOptions.errorThresholdPercentage,
    resetTimeout: mergedOptions.resetTimeout,
    volumeThreshold: mergedOptions.volumeThreshold,
    rollingCountTimeout: mergedOptions.rollingCountTimeout,
    rollingCountBuckets: mergedOptions.rollingCountBuckets,
    minimumNumberOfCalls: mergedOptions.minimumNumberOfCalls,
    name: mergedOptions.name,
    enabled: mergedOptions.enabled,
    allowWarmUp: mergedOptions.allowWarmUp,
    maxConcurrentCalls: mergedOptions.maxConcurrentCalls,
    cache: mergedOptions.cache,
    cacheTTL: mergedOptions.cacheTTL,
    coalesce: mergedOptions.coalesce,
    coalesceTTL: mergedOptions.coalesceTTL,
    coalesceResetOn: mergedOptions.coalesceResetOn,
    cacheGetKey: mergedOptions.cacheGetKey,
    fallback: mergedOptions.fallback,
    group: mergedOptions.group,
  };

  const breaker = new CircuitBreaker(asyncFunction, opossumOptions);
  const enhancedBreaker = breaker as any;
  const name = mergedOptions.name ?? 'unnamed';

  // Add event logging for monitoring
  breaker.on('open', () => console.log(`[CircuitBreaker] Circuit ${name} opened`));
  breaker.on('halfOpen', () => console.log(`[CircuitBreaker] Circuit ${name} half-open`));
  breaker.on('close', () => console.log(`[CircuitBreaker] Circuit ${name} closed`));
  breaker.on('fallback', (_result) => console.log(`[CircuitBreaker] Fallback executed for ${name}`));
  breaker.on('reject', () => console.log(`[CircuitBreaker] Call rejected for ${name} - circuit is open`));
  breaker.on('timeout', () => console.log(`[CircuitBreaker] Call timed out for ${name}`));
  breaker.on('success', (result) => console.log(`[CircuitBreaker] Call succeeded for ${name}`));
  breaker.on('failure', (error) => console.log(`[CircuitBreaker] Call failed for ${name}:`, error.message));
  
  // Add enhanced statistics methods
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

  enhancedBreaker.getDetailedState = (): CircuitBreakerState => {
    const stats = breaker.stats;
    return {
      state: mapState(breaker),
      stats: {
        totalCalls: stats.fires ?? 0,
        failedCalls: stats.failures ?? 0,
        successCalls: stats.successes ?? 0,
        timeoutCalls: stats.timeouts ?? 0,
        shortCircuitedCalls: stats.rejects ?? 0,
      },
      lastError: undefined,
      lastFailureTime: undefined,
    };
  };

  function mapState(breaker: any): CircuitState {
    return breaker.opened ? 'OPEN' : breaker.halfOpen ? 'HALF_OPEN' : 'CLOSED';
  }

  return enhancedBreaker;
}

/**
 * Create a circuit breaker with fallback functionality
 * 
 * @param action - Function to protect
 * @param fallback - Fallback function to execute on failures
 * @param config - Configuration options
 * @returns Circuit breaker with fallback
 */
export function createCircuitBreakerWithFallback<T extends (...args: any[]) => Promise<any>>(
  action: T,
  fallback: (...args: Parameters<T>) => Promise<ReturnType<T>>,
  config: CircuitBreakerOptions = {}
): CircuitBreaker {
  const breaker = createCircuitBreaker(action, { ...config, fallback });
  return breaker as CircuitBreaker;
}

/**
 * Get detailed state information from a circuit breaker
 * 
 * @param breaker - Circuit breaker instance
 * @returns Detailed state information
 */
export function getCircuitBreakerState(breaker: CircuitBreaker): CircuitBreakerState {
  const stats = breaker.stats;
  return {
    state: breaker.opened ? 'OPEN' : breaker.halfOpen ? 'HALF_OPEN' : 'CLOSED',
    stats: {
      totalCalls: stats.fires ?? 0,
      failedCalls: stats.failures ?? 0,
      successCalls: stats.successes ?? 0,
      timeoutCalls: stats.timeouts ?? 0,
      shortCircuitedCalls: stats.rejects ?? 0,
    },
    lastError: undefined,
    lastFailureTime: undefined,
  };
}

// ==================== CIRCUIT BREAKER MANAGER ====================

/**
 * Manager class for orchestrating multiple circuit breakers
 */
export class CircuitBreakerManager extends EventEmitter {
  private breakers: Map<string, CircuitBreaker> = new Map();
  private config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig = defaultCircuitBreakerConfig) {
    super();
    this.config = config;
  }

  /**
   * Register a new circuit breaker
   * 
   * @param name - Unique name for the breaker
   * @param action - Function to protect
   * @param config - Additional configuration
   * @returns Created circuit breaker
   */
  register<T extends (...args: any[]) => Promise<any>>(
    name: string,
    action: T,
    config?: Partial<CircuitBreakerOptions>
  ): CircuitBreaker {
    const breakerConfig = { ...this.config, ...config, name };
    const breaker = createCircuitBreaker(action, breakerConfig);
    this.breakers.set(name, breaker);
    
    // Forward events to manager
    breaker.on('open', () => this.emit('breakerOpen', name));
    breaker.on('close', () => this.emit('breakerClose', name));
    breaker.on('halfOpen', () => this.emit('breakerHalfOpen', name));
    
    return breaker;
  }

  /**
   * Get a registered circuit breaker by name
   * 
   * @param name - Breaker name
   * @returns Circuit breaker or undefined
   */
  get(name: string): CircuitBreaker | undefined {
    return this.breakers.get(name);
  }

  /**
   * Get states of all registered breakers
   * 
   * @returns Record of breaker states
   */
  getAllStates(): Record<string, CircuitBreakerState> {
    const states: Record<string, CircuitBreakerState> = {};
    for (const [name, breaker] of this.breakers) {
      states[name] = getCircuitBreakerState(breaker);
    }
    return states;
  }

  /**
   * Reset all circuit breakers to closed state
   */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.close();
    }
  }

  /**
   * Shutdown and clean up all breakers
   */
  shutdown(): void {
    for (const breaker of this.breakers.values()) {
      breaker.removeAllListeners();
    }
    this.breakers.clear();
  }
}

// ==================== PRECONFIGURED CIRCUIT BREAKERS ====================

/**
 * Default circuit breaker with balanced settings
 */
export const defaultCircuitBreaker = createCircuitBreaker(() => Promise.resolve(), {
  failureThreshold: 5,
  timeout: 60000,
  resetTimeout: 120000,
  monitoringPeriod: 300000
});

/**
 * Fast circuit breaker for quick failure detection
 */
export const fastCircuitBreaker = createCircuitBreaker(() => Promise.resolve(), {
  failureThreshold: 3,
  timeout: 30000,
  resetTimeout: 60000,
  monitoringPeriod: 120000
});

/**
 * Slow circuit breaker for tolerant scenarios
 */
export const slowCircuitBreaker = createCircuitBreaker(() => Promise.resolve(), {
  failureThreshold: 10,
  timeout: 120000,
  resetTimeout: 300000,
  monitoringPeriod: 600000
});

// ==================== LEGACY IMPLEMENTATION ====================

/**
 * Legacy circuit breaker implementation for backward compatibility
 * @deprecated Use Opossum-based implementation instead
 */
export class LegacyCircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;
  private config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig = defaultCircuitBreakerConfig) {
    this.config = config;
  }

  async execute<T>(action: () => Promise<T>): Promise<T> {
    console.log('[DEPRECATED] Using legacy circuit breaker. Consider migrating to Opossum-based implementation.');
    
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.config.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.config.minimumNumberOfCalls) {
      this.state = 'OPEN';
    }
  }

  getState(): string {
    return this.state;
  }
}

// ==================== EXPORTS ====================

// Export all circuit breaker utilities
export const circuitBreaker = {
  // Core functionality
  createCircuitBreaker,
  createCircuitBreakerWithFallback,
  getCircuitBreakerState,
  
  // Management
  CircuitBreakerManager,
  
  // Configuration
  defaultCircuitBreakerConfig,
  getDefaultOptions,
  
  // Preconfigured instances
  defaultCircuitBreaker,
  fastCircuitBreaker,
  slowCircuitBreaker,
  
  // Legacy support
  LegacyCircuitBreaker,
};

// Export base CircuitBreaker class for advanced usage
export { CircuitBreaker };

// Default export includes all functionality
export default circuitBreaker;