/**
 * Circuit Breaker Implementation using Opossum
 * Replaced with opossum for better maintainability and industry-standard implementation
 * 
 * Direct use of opossum recommended for new code:
 * 
 * import CircuitBreaker from 'opossum';
 * const breaker = new CircuitBreaker(options);
 * breaker.fire(() => someAsyncFunction());
 */

import * as OpossumModule from 'opossum';
import { EventEmitter } from 'events';

// Extract constructor and types
const OpossumBreaker = OpossumModule.default;
type OpossumOptions = OpossumModule.Options;

// Legacy interfaces for backward compatibility
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

export enum CircuitState {
  CLOSED = 'closed',
  OPEN = 'open',
  HALF_OPEN = 'half-open'
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
 * Circuit Breaker wrapper around opossum for backward compatibility
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

    // Convert to opossum options
    const opossumOptions: OpossumOptions = {
      timeout: this.legacyOptions.timeout,
      resetTimeout: this.legacyOptions.resetTimeout,
      name: this.legacyOptions.name || 'circuit-breaker'
    };

    this.opossumBreaker = new OpossumBreaker(() => Promise.resolve(), opossumOptions);

    // Forward events
    this.opossumBreaker.on('open', () => {
      this.emit('state-change', { from: CircuitState.CLOSED, to: CircuitState.OPEN });
      this.legacyOptions.onStateChange?.(CircuitState.OPEN);
    });

    this.opossumBreaker.on('halfOpen', () => {
      this.emit('state-change', { from: CircuitState.OPEN, to: CircuitState.HALF_OPEN });
      this.legacyOptions.onStateChange?.(CircuitState.HALF_OPEN);
    });

    this.opossumBreaker.on('close', () => {
      this.emit('state-change', { from: CircuitState.HALF_OPEN, to: CircuitState.CLOSED });
      this.legacyOptions.onRecovery?.();
      this.legacyOptions.onStateChange?.(CircuitState.CLOSED);
    });

    this.opossumBreaker.on('success', (result: any) => {
      this.emit('success', { 
        result, 
        state: this.getCurrentState(),
        responseTime: 0
      });
    });

    this.opossumBreaker.on('failure', (error: any) => {
      this.legacyOptions.onFailure?.(error);
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
    const stats = this.opossumBreaker.stats;
    const currentState = this.getCurrentState();
    
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
      adaptiveTimeout: this.legacyOptions.adaptiveTimeout ? this.legacyOptions.timeout : undefined
    };
  }

  /**
   * Reset circuit breaker to closed state
   */
  reset(): void {
    this.opossumBreaker.close();
  }

  /**
   * Get current state from opossum
   */
  private getCurrentState(): CircuitState {
    const stats = this.opossumBreaker.stats;
    if (stats.state === 'open') {
      return CircuitState.OPEN;
    } else if (stats.state === 'half-open') {
      return CircuitState.HALF_OPEN;
    } else {
      return CircuitState.CLOSED;
    }
  }

  // Access to underlying opossum breaker
  get opossum(): any {
    return this.opossumBreaker;
  }
}

/**
 * Wrap an existing function with circuit breaker protection
 */
export function withCircuitBreaker<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: CircuitBreakerOptions = {}
): (...args: T) => Promise<R> {
  const breaker = new CircuitBreaker(options);
  
  return async (...args: T): Promise<R> => {
    return breaker.execute(() => fn(...args));
  };
}

/**
 * Utility class for managing multiple circuit breakers
 */
export class CircuitBreakerRegistry {
  private breakers = new Map<string, CircuitBreaker>();

  register(name: string, options: CircuitBreakerOptions = {}): CircuitBreaker {
    const breaker = new CircuitBreaker({ ...options, name });
    this.breakers.set(name, breaker);
    return breaker;
  }

  get(name: string): CircuitBreaker | undefined {
    return this.breakers.get(name);
  }

  getAllStats(): Record<string, CircuitBreakerStats> {
    const stats: Record<string, CircuitBreakerStats> = {};
    
    for (const [name, breaker] of this.breakers) {
      stats[name] = breaker.getStats();
    }
    
    return stats;
  }

  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset();
    }
  }

  shutdown(): void {
    this.breakers.clear();
  }
}

// Global registry instance
export const circuitBreakerRegistry = new CircuitBreakerRegistry();

// Export opossum for direct use
export { OpossumModule, OpossumOptions };

export default CircuitBreaker;