/**
 * Comprehensive Function Tests
 * Tests each function with correct inputs, wrong inputs, faulty data, and edge cases
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import sinon from 'sinon';

describe('Validation Utilities', () => {
  let validateObject: any, validateArray: any, validateString: any, validateFunction: any;

  beforeEach(async () => {
    const validation = await import('../../utils/helpers/validation');
    validateObject = validation.validateObject;
    validateArray = validation.validateArray;
    validateString = validation.validateString;
    validateFunction = validation.validateFunction;
  });

  describe('validateObject', () => {
    it('should pass with valid object', () => {
      expect(() => validateObject({ key: 'value' }, 'testParam')).not.toThrow();
      expect(() => validateObject({}, 'emptyObj')).not.toThrow();
      expect(() => validateObject({ nested: { deep: true } }, 'nestedObj')).not.toThrow();
    });

    it('should throw for null', () => {
      expect(() => validateObject(null, 'nullParam')).toThrow('Expected nullParam to be an object but received null');
    });

    it('should throw for undefined', () => {
      expect(() => validateObject(undefined, 'undefinedParam')).toThrow(/Expected undefinedParam to be an object/);
    });

    it('should throw for string', () => {
      expect(() => validateObject('string', 'strParam')).toThrow(/Expected strParam to be an object/);
    });

    it('should throw for number', () => {
      expect(() => validateObject(123, 'numParam')).toThrow(/Expected numParam to be an object/);
    });

    it('should throw for boolean', () => {
      expect(() => validateObject(true, 'boolParam')).toThrow(/Expected boolParam to be an object/);
    });

    it('should throw for function', () => {
      expect(() => validateObject(() => {}, 'fnParam')).toThrow(/Expected fnParam to be an object/);
    });

    it('should pass for array (arrays are objects in JS)', () => {
      expect(() => validateObject([1, 2, 3], 'arrayParam')).not.toThrow();
    });
  });

  describe('validateArray', () => {
    it('should pass with valid array', () => {
      expect(() => validateArray([1, 2, 3], 'items')).not.toThrow();
      expect(() => validateArray([], 'emptyArray')).not.toThrow();
      expect(() => validateArray(['a', 'b'], 'stringArray')).not.toThrow();
    });

    it('should throw for object', () => {
      expect(() => validateArray({}, 'objParam')).toThrow('Expected objParam to be an array but got object');
    });

    it('should throw for string', () => {
      expect(() => validateArray('string', 'strParam')).toThrow('Expected strParam to be an array but got string');
    });

    it('should throw for null', () => {
      expect(() => validateArray(null, 'nullParam')).toThrow('Expected nullParam to be an array but got object');
    });

    it('should throw for undefined', () => {
      expect(() => validateArray(undefined, 'undefinedParam')).toThrow('Expected undefinedParam to be an array but got undefined');
    });

    it('should throw for number', () => {
      expect(() => validateArray(42, 'numParam')).toThrow('Expected numParam to be an array but got number');
    });
  });

  describe('validateString', () => {
    it('should pass with valid string', () => {
      expect(() => validateString('hello', 'msg')).not.toThrow();
      expect(() => validateString('', 'emptyStr')).not.toThrow();
      expect(() => validateString('   ', 'whitespace')).not.toThrow();
    });

    it('should throw for number', () => {
      expect(() => validateString(123, 'numParam')).toThrow('Expected numParam to be a string but got number');
    });

    it('should throw for null', () => {
      expect(() => validateString(null, 'nullParam')).toThrow('Expected nullParam to be a string but got object');
    });

    it('should throw for undefined', () => {
      expect(() => validateString(undefined, 'undefinedParam')).toThrow('Expected undefinedParam to be a string but got undefined');
    });

    it('should throw for object', () => {
      expect(() => validateString({}, 'objParam')).toThrow('Expected objParam to be a string but got object');
    });

    it('should throw for array', () => {
      expect(() => validateString(['a', 'b'], 'arrParam')).toThrow('Expected arrParam to be a string but got object');
    });
  });

  describe('validateFunction', () => {
    it('should pass with valid function', () => {
      expect(() => validateFunction(() => {}, 'callback')).not.toThrow();
      expect(() => validateFunction(function named() {}, 'namedFn')).not.toThrow();
      expect(() => validateFunction(async () => {}, 'asyncFn')).not.toThrow();
    });

    it('should throw for string', () => {
      expect(() => validateFunction('not function', 'strParam')).toThrow('Expected strParam to be a function but got string');
    });

    it('should throw for null', () => {
      expect(() => validateFunction(null, 'nullParam')).toThrow('Expected nullParam to be a function but got object');
    });

    it('should throw for object', () => {
      expect(() => validateFunction({}, 'objParam')).toThrow('Expected objParam to be a function but got object');
    });

    it('should throw for number', () => {
      expect(() => validateFunction(42, 'numParam')).toThrow('Expected numParam to be a function but got number');
    });
  });
});

describe('stubMethod Utilities', () => {
  let stubMethod: any, verifyCallCount: any, verifyCalledWith: any, verifyCalledOnce: any;
  let createFakeServer: any, createFakeXHR: any;

  beforeEach(async () => {
    const stubUtils = await import('../../utils/stubMethod');
    stubMethod = stubUtils.stubMethod;
    verifyCallCount = stubUtils.verifyCallCount;
    verifyCalledWith = stubUtils.verifyCalledWith;
    verifyCalledOnce = stubUtils.verifyCalledOnce;
    createFakeServer = stubUtils.createFakeServer;
    createFakeXHR = stubUtils.createFakeXHR;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('stubMethod', () => {
    it('should stub a method with correct inputs', () => {
      const obj = { myMethod: () => 'original' };
      const result = stubMethod({ obj, methodName: 'myMethod', stubFn: () => 'stubbed' });
      
      expect(obj.myMethod()).toBe('stubbed');
      expect(typeof result.restore).toBe('function');
      
      result.restore();
      expect(obj.myMethod()).toBe('original');
    });

    it('should throw when obj is not an object', () => {
      expect(() => stubMethod({ obj: null, methodName: 'test', stubFn: () => {} }))
        .toThrow(/Expected .* to be an object/);
      expect(() => stubMethod({ obj: 'string', methodName: 'test', stubFn: () => {} }))
        .toThrow(/Expected .* to be an object/);
    });

    it('should throw when methodName is not a string', () => {
      const obj = { method: () => {} };
      expect(() => stubMethod({ obj, methodName: 123 as any, stubFn: () => {} }))
        .toThrow(/Expected .* to be a string/);
    });

    it('should throw when methodName is empty string', () => {
      const obj = { method: () => {} };
      expect(() => stubMethod({ obj, methodName: '', stubFn: () => {} }))
        .toThrow(/must be a non-empty string/);
    });

    it('should throw when methodName is whitespace only', () => {
      const obj = { method: () => {} };
      expect(() => stubMethod({ obj, methodName: '   ', stubFn: () => {} }))
        .toThrow(/must be a non-empty string/);
    });

    it('should throw when method does not exist on object', () => {
      const obj = { existingMethod: () => {} };
      expect(() => stubMethod({ obj, methodName: 'nonExistent', stubFn: () => {} }))
        .toThrow(/could not find nonExistent on provided object/);
    });

    it('should throw when property is not a function', () => {
      const obj = { notAFunction: 'value' };
      expect(() => stubMethod({ obj, methodName: 'notAFunction', stubFn: () => {} }))
        .toThrow(/exists but is not a function/);
    });

    it('should throw when stubFn is not a function', () => {
      const obj = { method: () => {} };
      expect(() => stubMethod({ obj, methodName: 'method', stubFn: 'not a function' as any }))
        .toThrow(/stubFn must be a Function/);
    });
  });

  describe('verifyCallCount', () => {
    it('should pass when call count matches', () => {
      const spy = sinon.spy();
      spy(); spy(); spy();
      expect(() => verifyCallCount(spy, 3)).not.toThrow();
    });

    it('should throw when call count does not match', () => {
      const spy = sinon.spy();
      spy(); spy();
      expect(() => verifyCallCount(spy, 5)).toThrow('Expected 5 calls, but got 2');
    });

    it('should pass for zero calls', () => {
      const spy = sinon.spy();
      expect(() => verifyCallCount(spy, 0)).not.toThrow();
    });
  });

  describe('verifyCalledWith', () => {
    it('should pass when called with expected arguments', () => {
      const spy = sinon.spy();
      spy('arg1', 'arg2');
      expect(() => verifyCalledWith(spy, 'arg1', 'arg2')).not.toThrow();
    });

    it('should throw when not called with expected arguments', () => {
      const spy = sinon.spy();
      spy('arg1');
      expect(() => verifyCalledWith(spy, 'different')).toThrow(/Expected call with arguments/);
    });
  });

  describe('verifyCalledOnce', () => {
    it('should pass when called exactly once', () => {
      const spy = sinon.spy();
      spy();
      expect(() => verifyCalledOnce(spy)).not.toThrow();
    });

    it('should throw when not called', () => {
      const spy = sinon.spy();
      expect(() => verifyCalledOnce(spy)).toThrow('Expected exactly one call, but got 0');
    });

    it('should throw when called multiple times', () => {
      const spy = sinon.spy();
      spy(); spy(); spy();
      expect(() => verifyCalledOnce(spy)).toThrow('Expected exactly one call, but got 3');
    });
  });

  describe('createFakeServer', () => {
    it('should create a mock server object', () => {
      const server = createFakeServer();
      expect(server).toHaveProperty('requests');
      expect(server).toHaveProperty('respondWith');
      expect(server).toHaveProperty('restore');
      expect(Array.isArray(server.requests)).toBe(true);
    });

    it('should have callable methods', () => {
      const server = createFakeServer();
      expect(() => server.respondWith('GET', '/api', { status: 200 })).not.toThrow();
      expect(() => server.restore()).not.toThrow();
    });
  });

  describe('createFakeXHR', () => {
    it('should create a mock XHR object', () => {
      const xhr = createFakeXHR();
      expect(xhr).toHaveProperty('open');
      expect(xhr).toHaveProperty('send');
      expect(xhr).toHaveProperty('setRequestHeader');
    });

    it('should have callable methods', () => {
      const xhr = createFakeXHR();
      expect(() => xhr.open('GET', '/api')).not.toThrow();
      expect(() => xhr.send('data')).not.toThrow();
      expect(() => xhr.setRequestHeader('Content-Type', 'application/json')).not.toThrow();
    });
  });
});

describe('waitForCondition', () => {
  let waitForCondition: any;

  beforeEach(async () => {
    const module = await import('../../lib/waitForCondition');
    waitForCondition = module.waitForCondition;
  });

  it('should resolve immediately when condition is true', async () => {
    await expect(waitForCondition(() => true)).resolves.toBeUndefined();
  });

  it('should wait until condition becomes true', async () => {
    let counter = 0;
    const predicate = () => {
      counter++;
      return counter >= 3;
    };
    await expect(waitForCondition(predicate, { intervalMs: 10 })).resolves.toBeUndefined();
    expect(counter).toBeGreaterThanOrEqual(3);
  });

  it('should reject on timeout', async () => {
    await expect(waitForCondition(() => false, { timeoutMs: 100, intervalMs: 10 }))
      .rejects.toThrow(/timeout after 100ms/);
  });

  it('should work with async predicates', async () => {
    let counter = 0;
    const asyncPredicate = async () => {
      counter++;
      await new Promise(r => setTimeout(r, 5));
      return counter >= 2;
    };
    await expect(waitForCondition(asyncPredicate, { intervalMs: 10 })).resolves.toBeUndefined();
  });

  it('should continue when predicate throws error', async () => {
    let counter = 0;
    const faultyPredicate = () => {
      counter++;
      if (counter < 3) throw new Error('Simulated error');
      return true;
    };
    await expect(waitForCondition(faultyPredicate, { intervalMs: 10 })).resolves.toBeUndefined();
  });

  it('should handle very short timeout with warning', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      await expect(waitForCondition(() => false, { timeoutMs: 50, intervalMs: 10 }))
        .rejects.toThrow();
    } finally {
      consoleSpy.mockRestore();
    }
  });

  it('should use default options when none provided', async () => {
    let called = false;
    await waitForCondition(() => {
      called = true;
      return true;
    });
    expect(called).toBe(true);
  });
});

describe('Error Wrappers', () => {
  let wrapWithErrorLogging: any, wrapWithSafeExecute: any;

  beforeEach(async () => {
    const errorWrappers = await import('../../lib/errorHandling/errorWrappers');
    wrapWithErrorLogging = errorWrappers.wrapWithErrorLogging;
    wrapWithSafeExecute = errorWrappers.wrapWithSafeExecute;
  });

  describe('wrapWithErrorLogging', () => {
    it('should execute function normally when no error', () => {
      const fn = (a: number, b: number) => a + b;
      const wrapped = wrapWithErrorLogging(fn, 'addition');
      expect(wrapped(2, 3)).toBe(5);
    });

    it('should log and rethrow error', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const fn = () => { throw new Error('Test error'); };
      const wrapped = wrapWithErrorLogging(fn, 'testContext');
      
      expect(() => wrapped()).toThrow('Test error');
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('[testContext] Error: Test error'));
      
      errorSpy.mockRestore();
    });

    it('should preserve function arguments', () => {
      const fn = (x: string, y: number, z: boolean) => `${x}-${y}-${z}`;
      const wrapped = wrapWithErrorLogging(fn, 'test');
      expect(wrapped('hello', 42, true)).toBe('hello-42-true');
    });

    it('should handle non-Error thrown values', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const fn = () => { throw 'string error'; };
      const wrapped = wrapWithErrorLogging(fn, 'test');
      
      expect(() => wrapped()).toThrow();
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('string error'));
      
      errorSpy.mockRestore();
    });
  });

  describe('wrapWithSafeExecute', () => {
    it('should execute function normally when no error', () => {
      const fn = (a: number) => a * 2;
      const wrapped = wrapWithSafeExecute(fn);
      expect(wrapped(5)).toBe(10);
    });

    it('should return null on error', () => {
      const fn = () => { throw new Error('Failure'); };
      const wrapped = wrapWithSafeExecute(fn);
      expect(wrapped()).toBeNull();
    });

    it('should log error when context provided', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const fn = () => { throw new Error('Failure'); };
      const wrapped = wrapWithSafeExecute(fn, 'myContext');
      
      wrapped();
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('[myContext] Error: Failure'));
      
      errorSpy.mockRestore();
    });

    it('should not log error when no context provided', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const fn = () => { throw new Error('Failure'); };
      const wrapped = wrapWithSafeExecute(fn);
      
      wrapped();
      expect(errorSpy).not.toHaveBeenCalled();
      
      errorSpy.mockRestore();
    });
  });
});

describe('Cache Utilities', () => {
  let createLocalCache: any;

  beforeEach(async () => {
    const cache = await import('../../lib/cache');
    createLocalCache = cache.createLocalCache;
  });

  describe('createLocalCache', () => {
    it('should create a cache with default options', () => {
      const cache = createLocalCache();
      expect(cache).toBeDefined();
      expect(typeof cache.set).toBe('function');
      expect(typeof cache.get).toBe('function');
      expect(typeof cache.del).toBe('function');
    });

    it('should create cache with custom TTL', () => {
      const cache = createLocalCache({ defaultTTL: 300 });
      expect(cache).toBeDefined();
    });

    it('should create cache with custom max size', () => {
      const cache = createLocalCache({ maxSize: 100 });
      expect(cache).toBeDefined();
    });

    it('should store and retrieve values', () => {
      const cache = createLocalCache();
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('should return undefined for non-existent keys', () => {
      const cache = createLocalCache();
      expect(cache.get('nonexistent')).toBeUndefined();
    });

    it('should delete values', () => {
      const cache = createLocalCache();
      cache.set('key1', 'value1');
      cache.del('key1');
      expect(cache.get('key1')).toBeUndefined();
    });

    it('should handle various value types', () => {
      const cache = createLocalCache();
      cache.set('string', 'hello');
      cache.set('number', 42);
      cache.set('object', { a: 1 });
      cache.set('array', [1, 2, 3]);
      cache.set('boolean', true);
      
      expect(cache.get('string')).toBe('hello');
      expect(cache.get('number')).toBe(42);
      expect(cache.get('object')).toEqual({ a: 1 });
      expect(cache.get('array')).toEqual([1, 2, 3]);
      expect(cache.get('boolean')).toBe(true);
    });
  });
});

describe('Rate Limiter Utilities', () => {
  let createInMemoryRateLimiter: any, checkRateLimit: any, getRateLimitStats: any;

  beforeEach(async () => {
    const rateLimiter = await import('../../lib/rateLimiter');
    createInMemoryRateLimiter = rateLimiter.createInMemoryRateLimiter;
    checkRateLimit = rateLimiter.checkRateLimit;
    getRateLimitStats = rateLimiter.getRateLimitStats;
  });

  describe('createInMemoryRateLimiter', () => {
    it('should create limiter with valid config', () => {
      const limiter = createInMemoryRateLimiter({ windowMs: 60000, maxRequests: 100 });
      expect(limiter).toBeDefined();
    });

    it('should create limiter with points config', () => {
      const limiter = createInMemoryRateLimiter({ windowMs: 1000, maxRequests: 10, points: 5 });
      expect(limiter).toBeDefined();
    });
  });

  describe('checkRateLimit', () => {
    it('should allow requests within limit', async () => {
      const limiter = createInMemoryRateLimiter({ windowMs: 60000, maxRequests: 100 });
      const result = await checkRateLimit(limiter, { ip: '127.0.0.1', path: '/test' }, { windowMs: 60000, maxRequests: 100 });
      
      expect(result.allowed).toBe(true);
      expect(typeof result.remaining).toBe('number');
      expect(typeof result.resetTime).toBe('number');
    });

    it('should block requests exceeding limit', async () => {
      const limiter = createInMemoryRateLimiter({ windowMs: 60000, maxRequests: 2 });
      const config = { windowMs: 60000, maxRequests: 2 };
      const req = { ip: '192.168.1.1', path: '/api' };

      await checkRateLimit(limiter, req, config);
      await checkRateLimit(limiter, req, config);
      const result = await checkRateLimit(limiter, req, config);
      
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeDefined();
    });

    it('should use custom key generator', async () => {
      const limiter = createInMemoryRateLimiter({ windowMs: 60000, maxRequests: 10 });
      const config = { 
        windowMs: 60000, 
        maxRequests: 10,
        keyGenerator: (req: any) => `custom:${req.userId}`
      };
      
      const result = await checkRateLimit(limiter, { userId: 'user123' }, config);
      expect(result.allowed).toBe(true);
    });
  });

  describe('getRateLimitStats', () => {
    it('should return stats for memory limiter', () => {
      const limiter = createInMemoryRateLimiter({ windowMs: 60000, maxRequests: 100 });
      const stats = getRateLimitStats(limiter);
      
      expect(stats.isDistributed).toBe(false);
      expect(typeof stats.redisConnected).toBe('boolean');
    });
  });
});

describe('Circuit Breaker Utilities', () => {
  let createCircuitBreaker: any, CircuitBreaker: any, CircuitBreakerRegistry: any;
  let CircuitState: any;

  beforeEach(async () => {
    const cb = await import('../../lib/circuitBreaker');
    createCircuitBreaker = cb.createCircuitBreaker;
    CircuitBreaker = cb.CircuitBreaker;
    CircuitBreakerRegistry = cb.CircuitBreakerRegistry;
    CircuitState = cb.CircuitState;
  });

  describe('createCircuitBreaker', () => {
    it('should create circuit breaker with default options', () => {
      const breaker = createCircuitBreaker();
      expect(breaker).toBeDefined();
    });

    it('should create circuit breaker with custom options', () => {
      const breaker = createCircuitBreaker({
        timeout: 5000,
        resetTimeout: 30000,
        name: 'test-breaker'
      });
      expect(breaker).toBeDefined();
    });

    it('should handle state change callbacks', () => {
      let stateChanges: any[] = [];
      const breaker = createCircuitBreaker({
        onStateChange: (state: any) => stateChanges.push(state)
      });
      expect(breaker).toBeDefined();
    });
  });

  describe('CircuitBreaker class', () => {
    it('should create instance with default options', () => {
      const cb = new CircuitBreaker();
      expect(cb).toBeDefined();
      expect(typeof cb.execute).toBe('function');
      expect(typeof cb.getStats).toBe('function');
      expect(typeof cb.reset).toBe('function');
    });

    it('should create instance with custom options', () => {
      const cb = new CircuitBreaker({
        failureThreshold: 3,
        resetTimeout: 15000,
        timeout: 5000
      });
      expect(cb).toBeDefined();
    });

    it('should execute successful functions', async () => {
      const cb = new CircuitBreaker();
      const result = await cb.execute(() => Promise.resolve('success'));
      expect(result).toBe('success');
    });

    it('should get stats', () => {
      const cb = new CircuitBreaker();
      const stats = cb.getStats();
      
      expect(stats).toHaveProperty('state');
      expect(stats).toHaveProperty('failureCount');
      expect(stats).toHaveProperty('successCount');
      expect(stats).toHaveProperty('totalCalls');
    });
  });

  describe('CircuitBreakerRegistry', () => {
    it('should register and retrieve breakers', () => {
      const registry = new CircuitBreakerRegistry();
      const breaker = registry.register('test-service');
      
      expect(breaker).toBeDefined();
      expect(registry.get('test-service')).toBe(breaker);
    });

    it('should return undefined for non-existent breaker', () => {
      const registry = new CircuitBreakerRegistry();
      expect(registry.get('nonexistent')).toBeUndefined();
    });

    it('should get all stats', () => {
      const registry = new CircuitBreakerRegistry();
      registry.register('service1');
      registry.register('service2');
      
      const allStats = registry.getAllStats();
      expect(allStats).toHaveProperty('service1');
      expect(allStats).toHaveProperty('service2');
    });

    it('should reset all breakers', () => {
      const registry = new CircuitBreakerRegistry();
      registry.register('service1');
      registry.register('service2');
      
      expect(() => registry.resetAll()).not.toThrow();
    });

    it('should shutdown cleanly', () => {
      const registry = new CircuitBreakerRegistry();
      registry.register('service1');
      
      expect(() => registry.shutdown()).not.toThrow();
      expect(registry.get('service1')).toBeUndefined();
    });
  });

  describe('CircuitState enum', () => {
    it('should have correct state values', () => {
      expect(CircuitState.CLOSED).toBe('closed');
      expect(CircuitState.OPEN).toBe('open');
      expect(CircuitState.HALF_OPEN).toBe('half-open');
    });
  });
});

describe('InMemoryRateLimiter class', () => {
  let InMemoryRateLimiter: any;

  beforeEach(async () => {
    const rl = await import('../../lib/rateLimiter');
    InMemoryRateLimiter = rl.InMemoryRateLimiter;
  });

  it('should create instance with config', () => {
    const limiter = new InMemoryRateLimiter({ windowMs: 60000, maxRequests: 100 });
    expect(limiter).toBeDefined();
  });

  it('should check if request is allowed', async () => {
    const limiter = new InMemoryRateLimiter({ windowMs: 60000, maxRequests: 10 });
    const result = await limiter.isAllowed({ ip: '127.0.0.1', path: '/test' });
    
    expect(result.allowed).toBe(true);
    expect(typeof result.remaining).toBe('number');
  });

  it('should get stats', () => {
    const limiter = new InMemoryRateLimiter({ windowMs: 60000, maxRequests: 100 });
    const stats = limiter.getStats();
    
    expect(stats.isDistributed).toBe(false);
  });

  it('should provide access to underlying limiter', () => {
    const limiter = new InMemoryRateLimiter({ windowMs: 60000, maxRequests: 100 });
    expect(limiter.rateLimiter).toBeDefined();
  });
});

describe('Edge Cases and Boundary Tests', () => {
  describe('Empty and null handling', () => {
    it('should handle empty arrays', async () => {
      const { validateArray } = await import('../../utils/helpers/validation');
      expect(() => validateArray([], 'emptyArr')).not.toThrow();
    });

    it('should handle empty objects', async () => {
      const { validateObject } = await import('../../utils/helpers/validation');
      expect(() => validateObject({}, 'emptyObj')).not.toThrow();
    });

    it('should handle empty strings', async () => {
      const { validateString } = await import('../../utils/helpers/validation');
      expect(() => validateString('', 'emptyStr')).not.toThrow();
    });
  });

  describe('Large values', () => {
    it('should handle large numbers in cache', async () => {
      const { createLocalCache } = await import('../../lib/cache');
      const cache = createLocalCache();
      const largeNumber = Number.MAX_SAFE_INTEGER;
      cache.set('large', largeNumber);
      expect(cache.get('large')).toBe(largeNumber);
    });

    it('should handle large strings', async () => {
      const { createLocalCache } = await import('../../lib/cache');
      const cache = createLocalCache();
      const largeString = 'x'.repeat(10000);
      cache.set('largeStr', largeString);
      expect(cache.get('largeStr')).toBe(largeString);
    });

    it('should handle large arrays', async () => {
      const { validateArray } = await import('../../utils/helpers/validation');
      const largeArray = new Array(10000).fill(1);
      expect(() => validateArray(largeArray, 'largeArr')).not.toThrow();
    });
  });

  describe('Special characters and unicode', () => {
    it('should handle unicode in cache keys', async () => {
      const { createLocalCache } = await import('../../lib/cache');
      const cache = createLocalCache();
      cache.set('key_日本語_🎉', 'value');
      expect(cache.get('key_日本語_🎉')).toBe('value');
    });

    it('should handle unicode in cache values', async () => {
      const { createLocalCache } = await import('../../lib/cache');
      const cache = createLocalCache();
      cache.set('key', '日本語テスト🎉🚀');
      expect(cache.get('key')).toBe('日本語テスト🎉🚀');
    });
  });

  describe('Concurrent operations', () => {
    it('should handle concurrent cache operations', async () => {
      const { createLocalCache } = await import('../../lib/cache');
      const cache = createLocalCache();
      
      const operations: Promise<any>[] = [];
      for (let i = 0; i < 100; i++) {
        operations.push(
          Promise.resolve().then(() => {
            cache.set(`key${i}`, `value${i}`);
            return cache.get(`key${i}`);
          })
        );
      }
      
      const results = await Promise.all(operations);
      results.forEach((result, i) => {
        expect(result).toBe(`value${i}`);
      });
    });

    it('should handle concurrent rate limit checks', async () => {
      const { createInMemoryRateLimiter, checkRateLimit } = await import('../../lib/rateLimiter');
      const limiter = createInMemoryRateLimiter({ windowMs: 60000, maxRequests: 50 });
      const config = { windowMs: 60000, maxRequests: 50 };
      
      const checks: Promise<any>[] = [];
      for (let i = 0; i < 10; i++) {
        checks.push(checkRateLimit(limiter, { ip: `192.168.1.${i}`, path: '/api' }, config));
      }
      
      const results = await Promise.all(checks);
      results.forEach((result: any) => {
        expect(result.allowed).toBe(true);
      });
    });
  });
});
