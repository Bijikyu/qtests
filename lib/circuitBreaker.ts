/**
 * Circuit Breaker Implementation
 * 
 * Provides fault tolerance by wrapping function calls with circuit breaker
 * patterns to prevent cascading failures and improve system resilience.
 */

import { EventEmitter } from 'events';

export interface CircuitBreakerOptions {
  failureThreshold?: number;        // Number of failures before opening
  resetTimeout?: number;           // Time to wait before trying again
  monitoringPeriod?: number;        // Time window for monitoring
  expectedRecoveryTime?: number;    // Expected time for service recovery
  halfOpenMaxCalls?: number;        // Max calls in half-open state
  timeout?: number;                // Timeout for individual calls
  onStateChange?: (state: CircuitState) => void;
  onFailure?: (error: Error) => void;
  onRecovery?: () => void;
}

export enum CircuitState {
  CLOSED = 'closed',      // Normal operation
  OPEN = 'open',          // Circuit is open, blocking calls
  HALF_OPEN = 'half-open'  // Testing if service has recovered
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
  averageResponseTime: number;
  totalCalls: number;
  successRate: number;
}

interface CallRecord {
  success: boolean;
  responseTime: number;
  timestamp: number;
}

/**
 * Advanced Circuit Breaker with sliding window monitoring
 */
export class CircuitBreaker extends EventEmitter {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private lastSuccessTime = 0;
  private halfOpenCalls = 0;
  private callHistory: CallRecord[] = [];
  private totalResponseTime = 0;
  private totalCalls = 0;

  private config: Required<CircuitBreakerOptions>;
  private resetTimer?: NodeJS.Timeout;

  constructor(private options: CircuitBreakerOptions = {}) {
    super();
    
    this.config = {
      failureThreshold: options.failureThreshold || 5,
      resetTimeout: options.resetTimeout || 60000,    // 1 minute
      monitoringPeriod: options.monitoringPeriod || 300000, // 5 minutes
      expectedRecoveryTime: options.expectedRecoveryTime || 30000, // 30 seconds
      halfOpenMaxCalls: options.halfOpenMaxCalls || 3,
      timeout: options.timeout || 10000,               // 10 seconds
      onStateChange: options.onStateChange || (() => {}),
      onFailure: options.onFailure || (() => {}),
      onRecovery: options.onRecovery || (() => {})
    };
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.shouldTryReset()) {
        this.transitionToHalfOpen();
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    const startTime = Date.now();
    
    try {
      // Add timeout wrapper
      const result = await this.withTimeout(fn());
      
      // Record success
      const responseTime = Date.now() - startTime;
      this.recordSuccess(responseTime);
      
      return result;
    } catch (error) {
      // Record failure
      const responseTime = Date.now() - startTime;
      this.recordFailure(error as Error, responseTime);
      
      throw error;
    }
  }

  /**
   * Get current circuit breaker state and statistics
   */
  getStats(): CircuitBreakerStats {
    const successRate = this.totalCalls > 0 ? (this.successCount / this.totalCalls) * 100 : 0;
    const avgResponseTime = this.totalCalls > 0 ? this.totalResponseTime / this.totalCalls : 0;

    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime || undefined,
      lastSuccessTime: this.lastSuccessTime || undefined,
      averageResponseTime: avgResponseTime,
      totalCalls: this.totalCalls,
      successRate
    };
  }

  /**
   * Force circuit breaker to a specific state (for testing)
   */
  forceState(state: CircuitState): void {
    this.transitionTo(state);
  }

  /**
   * Reset circuit breaker to closed state
   */
  reset(): void {
    this.transitionTo(CircuitState.CLOSED);
    this.clearStats();
  }

  private async withTimeout<T>(promise: Promise<T>): Promise<T> {
    // Create timeout promise first to avoid race conditions
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Operation timed out after ${this.config.timeout}ms`));
      }, this.config.timeout);
      
      // Store timeout ID for potential cleanup
      (timeoutPromise as any)._timeoutId = timeoutId;
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      // Clean up timeout if it exists
      const timeoutId = (timeoutPromise as any)._timeoutId;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  private shouldTryReset(): boolean {
    const timeSinceFailure = Date.now() - this.lastFailureTime;
    return timeSinceFailure >= this.config.resetTimeout;
  }

  private recordSuccess(responseTime: number): void {
    this.totalCalls++;
    this.successCount++;
    this.totalResponseTime += responseTime;
    this.lastSuccessTime = Date.now();

    // Add to call history
    this.addToCallHistory(true, responseTime);

    // Handle state transitions
    if (this.state === CircuitState.HALF_OPEN) {
      this.halfOpenCalls++;
      if (this.halfOpenCalls >= this.config.halfOpenMaxCalls) {
        this.transitionToClosed();
      }
    } else if (this.state === CircuitState.CLOSED) {
      // Check if we should reduce failure count based on recent success
      this.updateFailureCount();
    }

    this.emit('success', { responseTime, state: this.state });
  }

  private recordFailure(error: Error, responseTime: number): void {
    this.totalCalls++;
    this.totalResponseTime += responseTime;
    this.lastFailureTime = Date.now();

    // Add to call history
    this.addToCallHistory(false, responseTime);

    // Handle state transitions
    if (this.state === CircuitState.HALF_OPEN) {
      this.transitionToOpen();
    } else if (this.state === CircuitState.CLOSED) {
      this.failureCount++;
      if (this.failureCount >= this.config.failureThreshold) {
        this.transitionToOpen();
      }
    }

    this.config.onFailure(error);
    this.emit('failure', { error, responseTime, state: this.state });
  }

  private addToCallHistory(success: boolean, responseTime: number): void {
    const now = Date.now();
    this.callHistory.push({ success, responseTime, timestamp: now });

    // Remove old records outside monitoring period
    const cutoff = now - this.config.monitoringPeriod;
    this.callHistory = this.callHistory.filter(record => record.timestamp > cutoff);
  }

  private updateFailureCount(): void {
    // Adjust failure count based on recent success rate
    const recentCalls = this.callHistory.slice(-this.config.failureThreshold);
    const recentFailures = recentCalls.filter(call => !call.success).length;
    
    if (recentFailures < this.failureCount) {
      this.failureCount = recentFailures;
    }
  }

  private transitionToClosed(): void {
    this.transitionTo(CircuitState.CLOSED);
    this.config.onRecovery();
  }

  private transitionToOpen(): void {
    this.transitionTo(CircuitState.OPEN);
    
    // Set timer for half-open attempt
    this.resetTimer = setTimeout(() => {
      if (this.state === CircuitState.OPEN) {
        this.transitionToHalfOpen();
      }
    }, this.config.resetTimeout);
  }

  private transitionToHalfOpen(): void {
    this.transitionTo(CircuitState.HALF_OPEN);
    this.halfOpenCalls = 0;
  }

  private transitionTo(newState: CircuitState): void {
    const oldState = this.state;
    this.state = newState;

    // Clear reset timer when leaving open state
    if (oldState === CircuitState.OPEN && this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = undefined;
    }

    this.config.onStateChange(newState);
    this.emit('state-change', { from: oldState, to: newState });
  }

  private clearStats(): void {
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
    this.lastSuccessTime = 0;
    this.halfOpenCalls = 0;
    this.callHistory = [];
    this.totalResponseTime = 0;
    this.totalCalls = 0;
  }
}

/**
 * Circuit breaker factory for common patterns
 */
export function createCircuitBreaker(options: CircuitBreakerOptions = {}): CircuitBreaker {
  return new CircuitBreaker(options);
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
    const breaker = new CircuitBreaker(options);
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

export default CircuitBreaker;