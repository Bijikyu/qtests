/**
 * Circuit Breaker Implementation using Opossum
 * Direct use of industry-standard circuit breaker with simplified interfaces
 * 
 * This module provides simplified interfaces to opossum
 * while maintaining the same API for backward compatibility.
 */

import CircuitBreakerLib, { Options } from 'opossum';
import { EventEmitter } from 'events';

// Extract constructor and types
const OpossumBreaker = CircuitBreakerLib;
type OpossumOptions = Options;

export enum CircuitState {
  CLOSED = 'closed',
  OPEN = 'open',
  HALF_OPEN = 'half-open'
}

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeout?: number;
  monitoringPeriod?: number;
  expectedRecoveryTime?: number;
  halfOpenMaxCalls?: number;
  timeout?: number;
  expectedError?: (error: Error) => boolean;
  adaptiveTimeout?: boolean;
  onStateChange?: (state: CircuitState) => void;
  onFailure?: (error: Error) => void;
  onRecovery?: () => void;
  name?: string;
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  totalCalls: number;
  successRate: number;
  averageResponseTime: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
  isDisabled: boolean;
  adaptiveTimeout?: number;
}

/**
 * Create a circuit breaker using opossum
 * @param options - Circuit breaker options
 * @returns Opossum breaker instance
 */
export function createCircuitBreaker(options: CircuitBreakerOptions = {}): any {
  // Convert to opossum options
  const opossumOptions: OpossumOptions = {
    timeout: options.timeout || 10000,
    resetTimeout: options.resetTimeout || 60000,
    name: options.name || 'circuit-breaker'
  };

  const breaker = new OpossumBreaker(() => Promise.resolve(), opossumOptions);

  // Setup event handlers
  breaker.on('open', () => {
    options.onStateChange?.(CircuitState.OPEN);
  });

  breaker.on('halfOpen', () => {
    options.onStateChange?.(CircuitState.HALF_OPEN);
  });

  breaker.on('close', () => {
    options.onRecovery?.();
    options.onStateChange?.(CircuitState.CLOSED);
  });

  breaker.on('failure', (error: any) => {
    options.onFailure?.(error);
  });

  return breaker;
}

/**
 * Execute a function with circuit breaker protection
 * @param fn - Function to execute
 * @param options - Circuit breaker options
 * @returns Promise resolving to function result
 */
export async function executeWithCircuitBreaker<T>(
  fn: () => Promise<T>,
  options: CircuitBreakerOptions = {}
): Promise<T> {
  const breaker = createCircuitBreaker(options);
  
  // Replace the internal action with our function
  (breaker as any).action = fn;
  
  try {
    return await breaker.fire() as Promise<T>;
  } finally {
    // Cleanup the breaker
    (breaker as any).removeAllListeners();
  }
}

/**
 * Get circuit breaker statistics
 * @param breaker - Opossum breaker instance
 * @returns CircuitBreakerStats
 */
export function getCircuitBreakerStats(breaker: any): CircuitBreakerStats {
  const stats = breaker.stats;
  const currentState = getCurrentState(breaker);
  
  return {
    state: currentState,
    failureCount: stats.failures || 0,
    successCount: stats.successes || 0,
    totalCalls: stats.fires || 0,
    successRate: (stats.fires || 0) > 0 ? ((stats.successes || 0) / (stats.fires || 0)) * 100 : 0,
    averageResponseTime: 0, // opossum doesn't track this
    lastFailureTime: undefined,
    lastSuccessTime: undefined,
    isDisabled: currentState === CircuitState.CLOSED,
    adaptiveTimeout: undefined
  };
}

/**
 * Get current circuit breaker state from opossum
 * @param breaker - Opossum breaker instance
 * @returns Current circuit state
 */
function getCurrentState(breaker: any): CircuitState {
  const stats = breaker.stats;
  if (stats.state === 'open') {
    return CircuitState.OPEN;
  } else if (stats.state === 'half-open') {
    return CircuitState.HALF_OPEN;
  } else {
    return CircuitState.CLOSED;
  }
}

/**
 * Reset circuit breaker to closed state
 * @param breaker - Opossum breaker instance
 */
export function resetCircuitBreaker(breaker: any): void {
  breaker.close();
}

/**
 * Wrap a function with circuit breaker protection
 * @param fn - Function to wrap
 * @param options - Circuit breaker options
 * @returns Wrapped function with circuit breaker protection
 */
export function withCircuitBreaker<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: CircuitBreakerOptions = {}
): (...args: T) => Promise<R> {
  const breaker = createCircuitBreaker(options);
  
  return async (...args: T): Promise<R> => {
    (breaker as any).action = () => fn(...args);
    return breaker.fire() as Promise<R>;
  };
}

/**
 * Utility class for managing multiple circuit breakers
 */
export class CircuitBreakerRegistry {
  private breakers = new Map<string, any>();

  register(name: string, options: CircuitBreakerOptions = {}): any {
    const breaker = createCircuitBreaker({ ...options, name });
    this.breakers.set(name, breaker);
    return breaker;
  }

  get(name: string): any | undefined {
    return this.breakers.get(name);
  }

  getAllStats(): Record<string, CircuitBreakerStats> {
    const stats: Record<string, CircuitBreakerStats> = {};
    
    for (const [name, breaker] of this.breakers) {
      stats[name] = getCircuitBreakerStats(breaker);
    }
    
    return stats;
  }

  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      resetCircuitBreaker(breaker);
    }
  }

  shutdown(): void {
    this.breakers.clear();
  }
}

/**
 * Legacy CircuitBreaker class for backward compatibility
 * @deprecated Use createCircuitBreaker function instead
 */
export class CircuitBreaker extends EventEmitter {
  private opossumBreaker: any; // OpossumBreaker instance
  private legacyOptions: CircuitBreakerOptions;

  constructor(options: CircuitBreakerOptions = {}) {
    super();
    
    this.legacyOptions = {
      failureThreshold: options.failureThreshold || 5,
      resetTimeout: options.resetTimeout || 60000,
      monitoringPeriod: options.monitoringPeriod || 300000,
      expectedRecoveryTime: options.expectedRecoveryTime || 30000,
      halfOpenMaxCalls: options.halfOpenMaxCalls || 3,
      timeout: options.timeout || 10000,
      expectedError: options.expectedError || (() => false),
      adaptiveTimeout: options.adaptiveTimeout || false,
      onStateChange: options.onStateChange || (() => {}),
      onFailure: options.onFailure || (() => {}),
      onRecovery: options.onRecovery || (() => {}),
      ...options
    };

    // Create opossum breaker
    this.opossumBreaker = createCircuitBreaker(this.legacyOptions);

    // Forward events for backward compatibility
    this.opossumBreaker.on('open', () => {
      this.emit('state-change', { from: CircuitState.CLOSED, to: CircuitState.OPEN });
    });

    this.opossumBreaker.on('halfOpen', () => {
      this.emit('state-change', { from: CircuitState.OPEN, to: CircuitState.HALF_OPEN });
    });

    this.opossumBreaker.on('close', () => {
      this.emit('state-change', { from: CircuitState.HALF_OPEN, to: CircuitState.CLOSED });
    });

    this.opossumBreaker.on('success', (result: any) => {
      this.emit('success', { 
        result, 
        state: this.getCurrentState(),
        responseTime: 0
      });
    });

    this.opossumBreaker.on('failure', (error: any) => {
      this.emit('failure', { 
        error, 
        state: this.getCurrentState(),
        responseTime: 0
      });
    });
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Replace the internal action with our function
    (this.opossumBreaker as any).action = fn;
    return this.opossumBreaker.fire() as Promise<T>;
  }

  /**
   * Get current circuit breaker state and statistics
   */
  getStats(): CircuitBreakerStats {
    return getCircuitBreakerStats(this.opossumBreaker);
  }

  /**
   * Reset circuit breaker to closed state
   */
  reset(): void {
    resetCircuitBreaker(this.opossumBreaker);
  }

  /**
   * Get current state from opossum
   */
  private getCurrentState(): CircuitState {
    return getCurrentState(this.opossumBreaker);
  }

  // Access to underlying opossum breaker
  get opossum(): any {
    return this.opossumBreaker;
  }
}

// Global registry instance
export const circuitBreakerRegistry = new CircuitBreakerRegistry();

// Export opossum for direct use
export type { Options } from 'opossum';

export default {
  createCircuitBreaker,
  executeWithCircuitBreaker,
  getCircuitBreakerStats,
  resetCircuitBreaker,
  withCircuitBreaker,
  CircuitBreakerRegistry,
  circuitBreakerRegistry,
  CircuitBreaker,
  CircuitBreakerLib
};