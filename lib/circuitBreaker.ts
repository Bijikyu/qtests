/**
 * Circuit Breaker Pattern Implementation for Scalability
 * 
 * This module provides a robust circuit breaker implementation that protects
 * applications from cascading failures when external services become unavailable.
 * It implements standard circuit breaker states (CLOSED, OPEN, HALF_OPEN) with
 * configurable failure thresholds, timeouts, and monitoring periods.
 * 
 * The circuit breaker wraps external operations with automatic failure detection,
 * tracks success/failure rates, and provides detailed statistics for monitoring.
 * It includes pre-configured breakers for common use cases and supports
 * domain-specific configurations for different service types.
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  timeout?: number;
  resetTimeout?: number;
  monitoringPeriod?: number;
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
  totalRequests: number;
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failures = 0;
  private successes = 0;
  private lastFailureTime?: number;
  private lastSuccessTime?: number;
  private totalRequests = 0;
  private failureWindow: number[] = [];
  private readonly failureThreshold: number;
  private readonly timeout: number;
  private readonly resetTimeout: number;
  private readonly monitoringPeriod: number;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 5;
    this.timeout = options.timeout ?? 60000;
    this.resetTimeout = options.resetTimeout ?? 120000;
    this.monitoringPeriod = options.monitoringPeriod ?? 300000;
  }

  async execute<T>(operation: () => Promise<T>, context?: string): Promise<T> {
    this.totalRequests++;

    if (this.state === 'CLOSED' && this.shouldTripOpen()) {
      this.tripOpen();
    }

    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN';
        this.failures = 0;
      } else {
        throw new Error(`Circuit breaker is OPEN for ${context || 'operation'}. Last failure: ${this.getTimeSinceLastFailure()}ms ago`);
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.successes++;
    this.lastSuccessTime = Date.now();

    if (this.state === 'HALF_OPEN') {
      this.reset();
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    this.failureWindow.push(Date.now());

    const cutoff = Date.now() - this.monitoringPeriod;
    this.failureWindow = this.failureWindow.filter(time => time > cutoff);
  }

  private shouldTripOpen(): boolean {
    return this.failures >= this.failureThreshold ||
           this.failureWindow.length >= this.failureThreshold;
  }

  private shouldAttemptReset(): boolean {
    return this.lastFailureTime ?
           Date.now() - this.lastFailureTime >= this.timeout : false;
  }

  private tripOpen(): void {
    this.state = 'OPEN';
    console.warn(`Circuit breaker TRIPPED to OPEN for operation. ${this.failures} failures detected`);
  }

  private reset(): void {
    this.state = 'CLOSED';
    this.failures = 0;
    this.failureWindow = [];
    console.info(`Circuit breaker RESET to CLOSED for operation`);
  }

  private getTimeSinceLastFailure(): number {
    return this.lastFailureTime ? Date.now() - this.lastFailureTime : 0;
  }

  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      totalRequests: this.totalRequests
    };
  }

  manualReset(): void {
    this.reset();
  }

  getSuccessRate(): number {
    if (this.totalRequests === 0) return 100;
    return Math.round((this.successes / this.totalRequests) * 100);
  }

  getState(): CircuitState {
    return this.state;
  }
}

export const createCircuitBreaker = (options?: CircuitBreakerOptions): CircuitBreaker => {
  return new CircuitBreaker(options);
};

export const defaultCircuitBreaker = createCircuitBreaker({
  failureThreshold: 5,
  timeout: 60000,
  resetTimeout: 120000,
  monitoringPeriod: 300000
});

export const fastCircuitBreaker = createCircuitBreaker({
  failureThreshold: 3,
  timeout: 30000,
  resetTimeout: 60000,
  monitoringPeriod: 120000
});

export const slowCircuitBreaker = createCircuitBreaker({
  failureThreshold: 10,
  timeout: 120000,
  resetTimeout: 300000,
  monitoringPeriod: 600000
});

export default CircuitBreaker;
