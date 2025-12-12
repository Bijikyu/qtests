/**
 * Modern Circuit Breaker with Opossum Integration - TypeScript Implementation
 * 
 * This module provides circuit breaker functionality using Opossum, a
 * production-ready circuit breaker implementation with monitoring and
 * Prometheus integration capabilities.
 * 
 * Design philosophy:
 * - Production-ready circuit breaker patterns
 * - Comprehensive monitoring and metrics
 * - Configurable thresholds and timeouts
 * - Event-driven state management
 * - Integration with monitoring systems
 * 
 * Key benefits over custom circuit breaker:
 * 1. Production Testing - Battle-tested in production environments
 * 2. Monitoring Support - Built-in metrics and Prometheus integration
 * 3. Event System - Rich event lifecycle for monitoring
 * 4. Configuration Flexibility - Advanced configuration options
 * 5. Community Support - Active maintenance and documentation
 * 
 * Migration from custom circuit breaker:
 * - Better production reliability
 * - Enhanced monitoring capabilities
 * - More configuration options
 * - Industry-standard implementation
 */

import CircuitBreaker from 'opossum';
import { EventEmitter } from 'events';

// Import logging control utility for consistent framework behavior
import { setLogging } from './logUtils.js';
if (process.env.NODE_ENV !== 'test') setLogging(false);

/**
 * Circuit breaker configuration interface
 */
export interface CircuitBreakerConfig {
  timeout: number; // Time in milliseconds before timeout
  errorThresholdPercentage: number; // Error percentage threshold
  resetTimeout: number; // Time in milliseconds before attempting reset
  rollingCountTimeout: number; // Duration of statistical rolling window
  rollingCountBuckets: number; // Number of buckets in rolling window
  minimumNumberOfCalls: number; // Minimum calls before calculating error percentage
  volumeThreshold: number; // Minimum volume of calls before tripping
  enabled: boolean; // Whether circuit breaker is enabled
  name?: string; // Circuit breaker name for monitoring
  group?: string; // Circuit breaker group for organization
}

/**
 * Circuit breaker state interface
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
 * Default circuit breaker configuration
 */
export const defaultCircuitBreakerConfig: CircuitBreakerConfig = {
  timeout: 30000, // 30 seconds
  errorThresholdPercentage: 50, // 50% error threshold
  resetTimeout: 60000, // 1 minute
  rollingCountTimeout: 10000, // 10 seconds
  rollingCountBuckets: 10,
  minimumNumberOfCalls: 10,
  volumeThreshold: 10,
  enabled: true,
};

/**
 * Create a circuit breaker using Opossum
 */
export function createCircuitBreaker<T extends (...args: any[]) => Promise<any>>(
  action: T,
  config: CircuitBreakerConfig = defaultCircuitBreakerConfig
): CircuitBreaker {
  const options = {
    timeout: config.timeout,
    errorThresholdPercentage: config.errorThresholdPercentage,
    resetTimeout: config.resetTimeout,
    rollingCountTimeout: config.rollingCountTimeout,
    rollingCountBuckets: config.rollingCountBuckets,
    minimumNumberOfCalls: config.minimumNumberOfCalls,
    volumeThreshold: config.volumeThreshold,
    enabled: config.enabled,
    name: config.name,
    group: config.group,
  };

  const breaker = new CircuitBreaker(action, options);

  // Add event listeners for monitoring
  breaker.on('open', () => {
    console.log(`[CircuitBreaker] Circuit ${config.name || 'unnamed'} opened`);
  });

  breaker.on('halfOpen', () => {
    console.log(`[CircuitBreaker] Circuit ${config.name || 'unnamed'} half-open`);
  });

  breaker.on('close', () => {
    console.log(`[CircuitBreaker] Circuit ${config.name || 'unnamed'} closed`);
  });

  breaker.on('fallback', (result) => {
    console.log(`[CircuitBreaker] Fallback executed for ${config.name || 'unnamed'}:`, result);
  });

  breaker.on('reject', () => {
    console.log(`[CircuitBreaker] Call rejected for ${config.name || 'unnamed'} - circuit is open`);
  });

  breaker.on('timeout', () => {
    console.log(`[CircuitBreaker] Call timed out for ${config.name || 'unnamed'}`);
  });

  breaker.on('success', (result) => {
    console.log(`[CircuitBreaker] Call succeeded for ${config.name || 'unnamed'}`);
  });

  breaker.on('failure', (error) => {
    console.log(`[CircuitBreaker] Call failed for ${config.name || 'unnamed'}:`, error.message);
  });

  return breaker;
}

/**
 * Get circuit breaker state and statistics
 */
export function getCircuitBreakerState(breaker: CircuitBreaker): CircuitBreakerState {
  const stats = breaker.stats;
  
  return {
    state: breaker.opened ? 'OPEN' : breaker.halfOpen ? 'HALF_OPEN' : 'CLOSED',
    stats: {
      totalCalls: stats.fires || 0,
      failedCalls: stats.failures || 0,
      successCalls: stats.successes || 0,
      timeoutCalls: stats.timeouts || 0,
      shortCircuitedCalls: stats.rejects || 0,
    },
    lastError: undefined, // Opossum doesn't expose last error directly
    lastFailureTime: undefined, // Opossum doesn't expose last failure time directly
  };
}

/**
 * Create a circuit breaker with fallback function
 */
export function createCircuitBreakerWithFallback<T extends (...args: any[]) => Promise<any>>(
  action: T,
  fallback: (...args: Parameters<T>) => Promise<ReturnType<T>>,
  config: CircuitBreakerConfig = defaultCircuitBreakerConfig
): CircuitBreaker {
  const breaker = createCircuitBreaker(action, config);
  
  breaker.fallback(fallback);
  
  return breaker;
}

/**
 * Create a circuit breaker manager for multiple breakers
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
   */
  register<T extends (...args: any[]) => Promise<any>>(
    name: string,
    action: T,
    config?: Partial<CircuitBreakerConfig>
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
   * Get a registered circuit breaker
   */
  get(name: string): CircuitBreaker | undefined {
    return this.breakers.get(name);
  }

  /**
   * Get all circuit breaker states
   */
  getAllStates(): Record<string, CircuitBreakerState> {
    const states: Record<string, CircuitBreakerState> = {};
    
    for (const [name, breaker] of this.breakers) {
      states[name] = getCircuitBreakerState(breaker);
    }
    
    return states;
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.open(); // Force open
      setTimeout(() => breaker.close(), 100); // Then close after brief delay
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
 * Legacy circuit breaker for backward compatibility
 * 
 * @deprecated Use createCircuitBreaker with Opossum instead
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

// Export the modern Opossum-based implementation as default
export default {
  createCircuitBreaker,
  createCircuitBreakerWithFallback,
  getCircuitBreakerState,
  CircuitBreakerManager,
  defaultCircuitBreakerConfig,
  // Legacy support
  LegacyCircuitBreaker,
};