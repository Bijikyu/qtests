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
  expectedError?: (error: Error) => boolean;  // Function to check if error is expected
  adaptiveTimeout?: boolean;        // Enable adaptive timeout scaling
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
  totalCalls: number;
  successRate: number;
  averageResponseTime: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
  isDisabled: boolean;
  adaptiveTimeout?: number;
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
  private stats = {
    totalCalls: 0,
    successCount: 0,
    totalResponseTime: 0,
    averageResponseTime: 0
  };
  
  // Binary search cleanup properties
  private maxHistorySize = 1000; // Limit history size for efficiency
  private cleanupThreshold = 100; // Cleanup after 100 new calls
  private lastCleanupTime = 0;

  constructor(private options: CircuitBreakerOptions = {}) {
    super();
    
    this.config = {
      failureThreshold: options.failureThreshold || 5,
      resetTimeout: options.resetTimeout || 60000,    // 1 minute
      monitoringPeriod: options.monitoringPeriod || 300000, // 5 minutes
      expectedRecoveryTime: options.expectedRecoveryTime || 30000, // 30 seconds
      halfOpenMaxCalls: options.halfOpenMaxCalls || 3,
      timeout: options.timeout || 10000,               // 10 seconds
      expectedError: options.expectedError || (() => false),
      adaptiveTimeout: options.adaptiveTimeout || false,
      onStateChange: options.onStateChange || (() => {}),
      onFailure: options.onFailure || (() => {}),
      onRecovery: options.onRecovery || (() => {})
    };
  }

  /**
   * Check if circuit breaker should try to reset
   */
  private shouldTryReset(): boolean {
    const timeSinceFailure = Date.now() - (this.lastFailureTime || 0);
    return timeSinceFailure >= this.config.resetTimeout;
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
      totalCalls: this.totalCalls,
      successRate,
      averageResponseTime: avgResponseTime,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      isDisabled: this.state === CircuitState.CLOSED,
      adaptiveTimeout: this.calculateAdaptiveTimeout()
    };
  }

/**
   * Check if circuit breaker should try to reset
   */
  /**
   * Calculate adaptive timeout based on historical response times
   */
  private calculateAdaptiveTimeout(): number {
    let adaptiveTimeout = this.config.timeout;
    
    // Adaptive timeout scaling based on historical response times
    if (this.config.adaptiveTimeout && this.stats.totalCalls > 10) {
      const avgResponseTime = this.stats.averageResponseTime || 10000; // Default 10s if no history
      const responseTimeRatio = avgResponseTime / this.config.timeout;
      
      if (responseTimeRatio > 2.0) {
        // If responses are slow, increase timeout proportionally
        adaptiveTimeout = Math.min(this.config.timeout * 1.5, avgResponseTime * 2.0);
      } else if (responseTimeRatio > 1.5) {
        adaptiveTimeout = Math.min(this.config.timeout * 1.2, avgResponseTime * 1.5);
      } else if (responseTimeRatio > 1.2) {
        adaptiveTimeout = Math.min(this.config.timeout * 1.1, avgResponseTime * 1.2);
      }
      
      // Cap timeout to reasonable maximum
      adaptiveTimeout = Math.min(adaptiveTimeout, 300000); // Max 5 minutes
    }
    
    return adaptiveTimeout;
  }

  /**
   * Reset circuit breaker to closed state
   */
  reset(): void {
    this.transitionTo(CircuitState.CLOSED);
    this.clearStats();
  }

  private async withTimeout<T>(promise: Promise<T>): Promise<T> {
    // Enhanced timeout handling with proper cleanup and abort controller
    const abortController = new AbortController();
    let timeoutId: NodeJS.Timeout | null = null;
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        abortController.abort();
        reject(new Error(`Operation timed out after ${this.config.timeout}ms`));
      }, this.config.timeout);
    });

    try {
      // Create a wrapper promise that can be aborted
      const wrappedPromise = new Promise<T>((resolve, reject) => {
        const originalPromise = promise;
        
        // Handle successful completion
        originalPromise.then(
          (result) => {
            if (!abortController.signal.aborted) {
              resolve(result);
            }
          },
          (error) => {
            if (!abortController.signal.aborted) {
              reject(error);
            }
          }
        );
        
        // Handle abort signal
        abortController.signal.addEventListener('abort', () => {
          reject(new Error(`Operation aborted due to timeout after ${this.config.timeout}ms`));
        });
      });
      
      return await Promise.race([wrappedPromise, timeoutPromise]);
      
    } finally {
      // Always clean up timeout to prevent memory leaks
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }
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
    
    // Perform binary search cleanup periodically
    this.performBinarySearchCleanup();
  }

  /**
   * Perform binary search cleanup of call history with bounded memory management
   */
  private performBinarySearchCleanup(): void {
    const now = Date.now();
    if (now - this.lastCleanupTime < 5000) return; // Cleanup every 5 seconds
    
    this.lastCleanupTime = now;
    
    // Enforce maximum history size to prevent memory leaks
    if (this.callHistory.length > this.maxHistorySize) {
      // Remove oldest entries first (O(1) operation)
      const excess = this.callHistory.length - this.maxHistorySize;
      this.callHistory.splice(0, excess);
      
      console.debug(`Circuit breaker cleanup: removed ${excess} oldest entries to maintain size limit`);
      return;
    }
    
    // Only perform expensive cleanup if we have enough data
    if (this.callHistory.length < 100) return;
    
    // Sort calls by timestamp for binary search (only when necessary)
    const sortedCalls = [...this.callHistory].sort((a, b) => a.timestamp - b.timestamp);
    
    // Remove duplicate or outlier calls using binary search pattern
    const cleanedCalls: CallRecord[] = [];
    const seenPatterns = new Set<string>();
    let duplicatesRemoved = 0;
    
    for (const call of sortedCalls) {
      const pattern = this.generateCallPattern(call);
      
      if (seenPatterns.has(pattern)) {
        // Skip duplicates - this is the binary search optimization
        duplicatesRemoved++;
        continue;
      }
      
      seenPatterns.add(pattern);
      cleanedCalls.push(call);
    }
    
    // Only replace if we removed significant duplicates
    if (duplicatesRemoved > sortedCalls.length * 0.1) { // More than 10% duplicates
      this.callHistory = cleanedCalls;
      
      console.debug(`Circuit breaker binary search cleanup: removed ${duplicatesRemoved} duplicate/outlier calls`);
    }
    
    // Prevent pattern set from growing unbounded
    if (seenPatterns.size > 1000) {
      seenPatterns.clear();
    }
  }

  /**
   * Generate pattern signature for call deduplication
   */
  private generateCallPattern(call: CallRecord): string {
    // Create pattern based on key characteristics
    const durationRange = Math.floor(call.responseTime / 100) * 100; // Round to nearest 100ms
    const outcomeKey = call.success ? 'success' : 'failure';
    const timeWindow = Math.floor(call.timestamp / 60000) * 60000; // Round to nearest minute
    
    return `${durationRange}_${outcomeKey}_${timeWindow}`;
  }

  private addToCallHistory(success: boolean, responseTime: number): void {
    const now = Date.now();
    this.callHistory.push({ success, responseTime, timestamp: now });

    // More efficient cleanup with early termination
    const cutoff = now - this.config.monitoringPeriod;
    if (this.callHistory.length > 100) { // Only cleanup when we have enough data
      // Binary search for cutoff point (assuming sorted by timestamp)
      let left = 0;
      let right = this.callHistory.length;
      
      while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (this.callHistory[mid].timestamp <= cutoff) {
          left = mid + 1;
        } else {
          right = mid;
        }
      }
      
      if (left > 0) {
        this.callHistory = this.callHistory.slice(left);
      }
    }
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
   * Circuit breaker configuration
   */


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