/**
 * Unified Circuit Breaker Factory
 * Consolidates circuit breaker implementations from circuitBreaker.ts and circuitBreakerModern.ts
 * Provides factory pattern for different circuit breaker strategies
 */

import { default as CircuitBreaker } from 'opossum';
import { EventEmitter } from 'events';
import { setLogging } from './logUtils.js';
process.env.NODE_ENV !== 'test' && setLogging(false);

/**
 * Circuit breaker strategy types
 */
export type CircuitBreakerStrategy = 'opossum' | 'legacy' | 'managed';

/**
 * Circuit state enumeration
 */
export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

/**
 * Unified circuit breaker configuration interface
 */
export interface CircuitBreakerConfig {
  // Core timing settings
  timeout: number;
  resetTimeout: number;
  rollingCountTimeout: number;
  
  // Threshold settings
  errorThresholdPercentage: number;
  volumeThreshold: number;
  minimumNumberOfCalls: number;
  rollingCountBuckets: number;
  
  // Behavior settings
  enabled: boolean;
  allowWarmUp?: boolean;
  maxConcurrentCalls?: number;
  
  // Caching settings
  cache?: boolean;
  cacheTTL?: number;
  
  // Coalescing settings
  coalesce?: boolean;
  coalesceTTL?: number;
  coalesceResetOn?: ('error' | 'success' | 'timeout')[];
  
  // Identification
  name?: string;
  group?: string;
  
  // Fallback function
  fallback?: (...args: any[]) => any;
  
  // Custom cache key function
  cacheGetKey?: (...args: any[]) => string;
}

/**
 * Circuit breaker statistics interface
 */
export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  totalRequests: number;
  fires: number;
  timeouts: number;
  rejects: number;
  cacheHits: number;
  cacheMisses: number;
  percentiles?: Record<string, number>;
  latencyMean?: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
}

/**
 * Enhanced circuit breaker interface with additional methods
 */
export interface EnhancedCircuitBreaker extends CircuitBreaker {
  getStats: () => CircuitBreakerStats;
  getState: () => CircuitState;
  getDetailedState?: () => CircuitBreakerState;
}

/**
 * Detailed circuit breaker state interface
 */
export interface CircuitBreakerState {
  state: CircuitState;
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
 * Default configurations for common use cases
 */
export const defaultConfigs = {
  /**
   * Standard configuration for general use
   */
  standard: {
    timeout: 60000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
    rollingCountTimeout: 10000,
    rollingCountBuckets: 10,
    minimumNumberOfCalls: 10,
    volumeThreshold: 10,
    enabled: true,
    allowWarmUp: false,
    maxConcurrentCalls: 10,
  } as CircuitBreakerConfig,

  /**
   * Fast configuration for latency-sensitive operations
   */
  fast: {
    timeout: 30000,
    errorThresholdPercentage: 30,
    resetTimeout: 60000,
    rollingCountTimeout: 5000,
    rollingCountBuckets: 10,
    minimumNumberOfCalls: 5,
    volumeThreshold: 5,
    enabled: true,
    allowWarmUp: false,
    maxConcurrentCalls: 20,
  } as CircuitBreakerConfig,

  /**
   * Slow configuration for batch operations or external APIs
   */
  slow: {
    timeout: 120000,
    errorThresholdPercentage: 70,
    resetTimeout: 300000,
    rollingCountTimeout: 30000,
    rollingCountBuckets: 10,
    minimumNumberOfCalls: 20,
    volumeThreshold: 20,
    enabled: true,
    allowWarmUp: true,
    maxConcurrentCalls: 5,
  } as CircuitBreakerConfig,
};

/**
 * Circuit breaker manager for handling multiple breakers
 */
export class CircuitBreakerManager extends EventEmitter {
  private breakers: Map<string, EnhancedCircuitBreaker> = new Map();
  private config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig = defaultConfigs.standard) {
    super();
    this.config = config;
  }

  /**
   * Register a new circuit breaker
   */
  register<T extends (...args: any[]) => Promise<any>>(
    name: string,
    action: T,
    config?: Partial<CircuitBreakerConfig>
  ): EnhancedCircuitBreaker {
    const breakerConfig = { ...this.config, ...config, name };
    const breaker = circuitBreakerFactory.create(action, {
      ...breakerConfig,
      strategy: 'opossum'
    }) as EnhancedCircuitBreaker;
    
    this.breakers.set(name, breaker);
    
    // Set up event forwarding
    breaker.on('open', () => this.emit('breakerOpen', name));
    breaker.on('close', () => this.emit('breakerClose', name));
    breaker.on('halfOpen', () => this.emit('breakerHalfOpen', name));
    
    return breaker;
  }

  /**
   * Get a registered circuit breaker
   */
  get(name: string): EnhancedCircuitBreaker | undefined {
    return this.breakers.get(name);
  }

  /**
   * Get all circuit breaker states
   */
  getAllStates(): Record<string, CircuitBreakerState> {
    const states: Record<string, CircuitBreakerState> = {};
    for (const [name, breaker] of this.breakers) {
      if (breaker.getDetailedState) {
        states[name] = breaker.getDetailedState();
      } else {
        states[name] = {
          state: breaker.getState(),
          stats: {
            totalCalls: 0,
            failedCalls: 0,
            successCalls: 0,
            timeoutCalls: 0,
            shortCircuitedCalls: 0,
          },
        };
      }
    }
    return states;
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.close();
    }
  }

  /**
   * Shutdown all circuit breakers
   */
  shutdown(): void {
    for (const breaker of this.breakers.values()) {
      breaker.removeAllListeners();
    }
    this.breakers.clear();
  }
}

/**
 * Legacy circuit breaker implementation for backward compatibility
 */
class LegacyCircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;
  private config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig) {
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

  getState(): CircuitState {
    return this.state;
  }

  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failureCount,
      successes: 0,
      totalRequests: this.failureCount,
      fires: this.failureCount,
      timeouts: 0,
      rejects: this.state === 'OPEN' ? 1 : 0,
      cacheHits: 0,
      cacheMisses: 0,
    };
  }
}

/**
 * Main circuit breaker factory
 */
class CircuitBreakerFactory {
  /**
   * Create a circuit breaker with specified strategy
   */
  create<T extends (...args: any[]) => Promise<any>>(
    action: T,
    config: Partial<CircuitBreakerConfig & { strategy?: CircuitBreakerStrategy }> = {}
  ): EnhancedCircuitBreaker {
    const strategy = config.strategy || 'opossum';
    const fullConfig = { ...defaultConfigs.standard, ...config };
    
    console.log(`Creating circuit breaker with strategy: ${strategy}`);
    
    try {
      switch (strategy) {
        case 'legacy':
          return this.createLegacyBreaker(fullConfig);
        
        case 'managed':
          return this.createManagedBreaker(action, fullConfig);
        
        case 'opossum':
        default:
          return this.createOpossumBreaker(action, fullConfig);
      }
    } catch (error: any) {
      console.log(`circuitBreakerFactory error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create Opossum-based circuit breaker
   */
  private createOpossumBreaker<T extends (...args: any[]) => Promise<any>>(
    action: T,
    config: CircuitBreakerConfig
  ): EnhancedCircuitBreaker {
    const opossumOptions = {
      timeout: config.timeout,
      errorThresholdPercentage: config.errorThresholdPercentage,
      resetTimeout: config.resetTimeout,
      rollingCountTimeout: config.rollingCountTimeout,
      rollingCountBuckets: config.rollingCountBuckets,
      name: config.name ?? action.name ?? 'unnamed',
      enabled: config.enabled,
      allowWarmUp: config.allowWarmUp ?? false,
      maxConcurrentCalls: config.maxConcurrentCalls ?? 10,
      cache: config.cache ?? false,
      cacheTTL: config.cacheTTL ?? 1000,
      coalesce: config.coalesce ?? false,
      coalesceTTL: config.coalesceTTL ?? 1000,
      coalesceResetOn: config.coalesceResetOn ?? ['error', 'success', 'timeout'],
      cacheGetKey: config.cacheGetKey ?? (() => 'default'),
      fallback: config.fallback
    };

    const breaker = new CircuitBreaker(action, opossumOptions);
    const enhancedBreaker = breaker as EnhancedCircuitBreaker;
    
    // Add enhanced methods
    enhancedBreaker.getStats = (): CircuitBreakerStats => {
      const stats = breaker.stats;
      return {
        state: this.mapOpossumState(breaker),
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

    enhancedBreaker.getState = (): CircuitState => this.mapOpossumState(breaker);

    enhancedBreaker.getDetailedState = (): CircuitBreakerState => {
      const stats = breaker.stats;
      return {
        state: this.mapOpossumState(breaker),
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

    // Set up logging
    const name = config.name ?? 'unnamed';
    breaker.on('open', () => console.log(`[CircuitBreaker] Circuit ${name} opened`));
    breaker.on('halfOpen', () => console.log(`[CircuitBreaker] Circuit ${name} half-open`));
    breaker.on('close', () => console.log(`[CircuitBreaker] Circuit ${name} closed`));
    breaker.on('fallback', (result) => console.log(`[CircuitBreaker] Fallback executed for ${name}:`, result));
    breaker.on('reject', () => console.log(`[CircuitBreaker] Call rejected for ${name} - circuit is open`));
    breaker.on('timeout', () => console.log(`[CircuitBreaker] Call timed out for ${name}`));
    breaker.on('success', () => console.log(`[CircuitBreaker] Call succeeded for ${name}`));
    breaker.on('failure', (error: any) => console.log(`[CircuitBreaker] Call failed for ${name}:`, error.message));

    return enhancedBreaker;
  }

  /**
   * Create legacy circuit breaker
   */
  private createLegacyBreaker(config: CircuitBreakerConfig): EnhancedCircuitBreaker {
    const legacy = new LegacyCircuitBreaker(config);
    
    // Create wrapper that implements EnhancedCircuitBreaker interface
    const wrapper = {
      // Legacy circuit breaker methods
      execute: legacy.execute.bind(legacy),
      getState: legacy.getState.bind(legacy),
      getStats: legacy.getStats.bind(legacy),
      
      // Mock Opossum interface for compatibility
      name: config.name || 'legacy-breaker',
      group: config.group || 'default',
      enabled: config.enabled,
      pendingClose: false,
      opened: false,
      halfOpen: false,
      
      // Mock essential Opossum methods
      fire: legacy.execute,
      close: () => { /* No-op for legacy */ },
      open: () => { /* No-op for legacy */ },
      
      // Mock event emitter methods
      on: () => wrapper,
      off: () => wrapper,
      once: () => wrapper,
      emit: () => false,
      removeAllListeners: () => wrapper,
      
      // Mock stats
      stats: {
        fires: 0,
        failures: 0,
        successes: 0,
        timeouts: 0,
        rejects: 0,
        cacheHits: 0,
        cacheMisses: 0,
        percentiles: {},
        latencyMean: 0
      },
      
      // Mock fallback
      fallback: () => wrapper,
      
      // Mock other methods
      then: () => wrapper,
      catch: () => wrapper
    } as unknown as EnhancedCircuitBreaker;
    
    return wrapper;
  }

  /**
   * Create managed circuit breaker
   */
  private createManagedBreaker<T extends (...args: any[]) => Promise<any>>(
    action: T,
    config: CircuitBreakerConfig
  ): EnhancedCircuitBreaker {
    const breaker = this.createOpossumBreaker(action, config);
    
    // Add management features
    const managedBreaker = breaker as EnhancedCircuitBreaker;
    
    // Add periodic health checks
    if (config.name) {
      setInterval(() => {
        const state = breaker.getState();
        if (state === 'OPEN') {
          console.log(`[CircuitBreaker] Managed breaker ${config.name} is still OPEN after reset timeout`);
        }
      }, config.resetTimeout);
    }
    
    return managedBreaker;
  }

  /**
   * Map Opossum state to our state enum
   */
  private mapOpossumState(breaker: any): CircuitState {
    return breaker.opened ? 'OPEN' : breaker.halfOpen ? 'HALF_OPEN' : 'CLOSED';
  }

  /**
   * Create a circuit breaker with fallback
   */
  createWithFallback<T extends (...args: any[]) => Promise<any>>(
    action: T,
    fallback: (...args: Parameters<T>) => Promise<ReturnType<T>>,
    config: Partial<CircuitBreakerConfig> = {}
  ): EnhancedCircuitBreaker {
    const fullConfig = { ...defaultConfigs.standard, ...config, fallback };
    return this.create(action, fullConfig);
  }
}

// Export the factory instance
export const circuitBreakerFactory = new CircuitBreakerFactory();

// Convenience functions
export function createCircuitBreaker<T extends (...args: any[]) => Promise<any>>(
  action: T,
  config: Partial<CircuitBreakerConfig> = {}
): EnhancedCircuitBreaker {
  return circuitBreakerFactory.create(action, config);
}

export function createCircuitBreakerWithFallback<T extends (...args: any[]) => Promise<any>>(
  action: T,
  fallback: (...args: Parameters<T>) => Promise<ReturnType<T>>,
  config: Partial<CircuitBreakerConfig> = {}
): EnhancedCircuitBreaker {
  return circuitBreakerFactory.createWithFallback(action, fallback, config);
}

export function createCircuitBreakerManager(config?: CircuitBreakerConfig): CircuitBreakerManager {
  return new CircuitBreakerManager(config);
}

// Export default factory
export default circuitBreakerFactory;