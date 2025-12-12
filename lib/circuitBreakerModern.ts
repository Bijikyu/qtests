import { default as CircuitBreaker } from 'opossum';
import { EventEmitter } from 'events';
import { setLogging } from './logUtils.js';
process.env.NODE_ENV !== 'test' && setLogging(false);

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
  const name = config.name ?? 'unnamed';

  breaker.on('open', () => console.log(`[CircuitBreaker] Circuit ${name} opened`));
  breaker.on('halfOpen', () => console.log(`[CircuitBreaker] Circuit ${name} half-open`));
  breaker.on('close', () => console.log(`[CircuitBreaker] Circuit ${name} closed`));
  breaker.on('fallback', (result) => console.log(`[CircuitBreaker] Fallback executed for ${name}:`, result));
  breaker.on('reject', () => console.log(`[CircuitBreaker] Call rejected for ${name} - circuit is open`));
  breaker.on('timeout', () => console.log(`[CircuitBreaker] Call timed out for ${name}`));
  breaker.on('success', (result) => console.log(`[CircuitBreaker] Call succeeded for ${name}`));
  breaker.on('failure', (error) => console.log(`[CircuitBreaker] Call failed for ${name}:`, error.message));

  return breaker;
}

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

export function createCircuitBreakerWithFallback<T extends (...args: any[]) => Promise<any>>(
  action: T,
  fallback: (...args: Parameters<T>) => Promise<ReturnType<T>>,
  config: CircuitBreakerConfig = defaultCircuitBreakerConfig
): CircuitBreaker {
  const breaker = createCircuitBreaker(action, config);
  breaker.fallback(fallback);
  return breaker;
}

export class CircuitBreakerManager extends EventEmitter {
  private breakers: Map<string, CircuitBreaker> = new Map();
  private config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig = defaultCircuitBreakerConfig) {
    super();
    this.config = config;
  }

  register<T extends (...args: any[]) => Promise<any>>(
    name: string,
    action: T,
    config?: Partial<CircuitBreakerConfig>
  ): CircuitBreaker {
    const breakerConfig = { ...this.config, ...config, name };
    const breaker = createCircuitBreaker(action, breakerConfig);
    this.breakers.set(name, breaker);
    breaker.on('open', () => this.emit('breakerOpen', name));
    breaker.on('close', () => this.emit('breakerClose', name));
    breaker.on('halfOpen', () => this.emit('breakerHalfOpen', name));
    return breaker;
  }

  get(name: string): CircuitBreaker | undefined {
    return this.breakers.get(name);
  }

  getAllStates(): Record<string, CircuitBreakerState> {
    const states: Record<string, CircuitBreakerState> = {};
    for (const [name, breaker] of this.breakers) {
      states[name] = getCircuitBreakerState(breaker);
    }
    return states;
  }

  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.close();
    }
  }

  shutdown(): void {
    for (const breaker of this.breakers.values()) {
      breaker.removeAllListeners();
    }
    this.breakers.clear();
  }
}

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

export default {
  createCircuitBreaker,
  createCircuitBreakerWithFallback,
  getCircuitBreakerState,
  CircuitBreakerManager,
  defaultCircuitBreakerConfig,
  LegacyCircuitBreaker,
};