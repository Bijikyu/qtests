/**
 * CircuitBreaker + runTestSuite Regression Tests
 *
 * Bugs found and fixed by dogfooding:
 *
 * 1. getCurrentState() read breaker.stats.state which is always undefined in
 *    opossum — so state was always reported as CLOSED regardless of actual state.
 *    Fix: use breaker.opened / breaker.halfOpen boolean properties instead.
 *
 * 2. isDisabled in getCircuitBreakerStats was inverted:
 *    `isDisabled: currentState === CircuitState.CLOSED` — a closed (operational)
 *    circuit was reported as disabled. Fix: `isDisabled: currentState === CircuitState.OPEN`.
 *
 * 3. runTestSuite / runTestSuites did not await async test functions.
 *    An async test that threw would silently record as PASS, then crash the
 *    process with an unhandled rejection. Fix: made both functions async and
 *    added await before each testFn() call.
 */

const {
  createCircuitBreaker,
  getCircuitBreakerStats,
  CircuitBreaker,
  CircuitState,
  circuitBreakerRegistry,
  withCircuitBreaker,
  executeWithCircuitBreaker,
} = require('../../dist/lib/circuitBreaker.js');

const {
  runTestSuite,
  runTestSuites,
  createAssertions,
} = require('../../dist/utils/runTestSuite.js');

// ─── Fix 1+2: getCurrentState and isDisabled ──────────────────────────────────

describe('Fix — getCircuitBreakerStats reflects actual opossum state', () => {
  test('reports closed when untouched', () => {
    const b = createCircuitBreaker();
    const s = getCircuitBreakerStats(b);
    expect(s.state).toBe('closed');
  });

  test('reports open after breaker.open()', () => {
    const b = createCircuitBreaker();
    b.open();
    const s = getCircuitBreakerStats(b);
    expect(s.state).toBe('open');
  });

  test('isDisabled is false when circuit is closed (operational)', () => {
    const b = createCircuitBreaker();
    expect(getCircuitBreakerStats(b).isDisabled).toBe(false);
  });

  test('isDisabled is true when circuit is open (tripped)', () => {
    const b = createCircuitBreaker();
    b.open();
    expect(getCircuitBreakerStats(b).isDisabled).toBe(true);
  });

  test('reports closed again after reset', () => {
    const b = createCircuitBreaker();
    b.open();
    b.close();
    expect(getCircuitBreakerStats(b).state).toBe('closed');
  });

  test('stats shape is complete', () => {
    const b = createCircuitBreaker();
    const s = getCircuitBreakerStats(b);
    expect(typeof s.failureCount).toBe('number');
    expect(typeof s.successCount).toBe('number');
    expect(typeof s.totalCalls).toBe('number');
    expect(typeof s.successRate).toBe('number');
    expect(typeof s.isDisabled).toBe('boolean');
  });
});

// ─── executeWithCircuitBreaker / withCircuitBreaker ───────────────────────────

describe('executeWithCircuitBreaker', () => {
  test('executes the provided function and returns its value', async () => {
    const result = await executeWithCircuitBreaker(async () => 42);
    expect(result).toBe(42);
  });

  test('propagates errors from the wrapped function', async () => {
    await expect(executeWithCircuitBreaker(async () => { throw new Error('boom'); }))
      .rejects.toThrow('boom');
  });
});

describe('withCircuitBreaker', () => {
  test('passes arguments through to the wrapped function', async () => {
    const wrapped = withCircuitBreaker(async (a, b) => a + b);
    expect(await wrapped(3, 4)).toBe(7);
  });

  test('wrapped function is reusable across calls', async () => {
    const wrapped = withCircuitBreaker(async (x) => x * 2);
    expect(await wrapped(5)).toBe(10);
    expect(await wrapped(6)).toBe(12);
  });
});

// ─── CircuitBreaker class ─────────────────────────────────────────────────────

describe('CircuitBreaker class', () => {
  test('execute runs the provided function', async () => {
    const cb = new CircuitBreaker();
    const result = await cb.execute(async () => 'hello');
    expect(result).toBe('hello');
  });

  test('getStats returns correct shape', () => {
    const cb = new CircuitBreaker();
    const s = cb.getStats();
    expect(s).toHaveProperty('state');
    expect(s).toHaveProperty('isDisabled');
    expect(s).toHaveProperty('failureCount');
  });

  test('onFailure callback fires when execute throws', async () => {
    let fired = false;
    const cb = new CircuitBreaker({ onFailure: () => { fired = true; } });
    try { await cb.execute(async () => { throw new Error('fail'); }); } catch {}
    expect(fired).toBe(true);
  });
});

// ─── CircuitBreakerRegistry ───────────────────────────────────────────────────

describe('circuitBreakerRegistry', () => {
  afterEach(() => {
    circuitBreakerRegistry.shutdown();
  });

  test('register and get returns the breaker', () => {
    const b = circuitBreakerRegistry.register('my-service');
    expect(circuitBreakerRegistry.get('my-service')).toBe(b);
  });

  test('getAllStats returns entry for each registered breaker', () => {
    circuitBreakerRegistry.register('svc-a');
    circuitBreakerRegistry.register('svc-b');
    const all = circuitBreakerRegistry.getAllStats();
    expect(Object.keys(all)).toContain('svc-a');
    expect(Object.keys(all)).toContain('svc-b');
  });
});

// ─── Fix 3: runTestSuite awaits async tests ───────────────────────────────────

describe('Fix — runTestSuite correctly handles async tests', () => {
  test('async test that throws is counted as failed (not silently passed)', async () => {
    const result = await runTestSuite('dogfood', [
      ['async fail', async () => { throw new Error('async failure'); }],
    ]);
    expect(result.failed).toBe(1);
    expect(result.passed).toBe(0);
    expect(result.failures[0].error).toBe('async failure');
  });

  test('async test that resolves counts as passed', async () => {
    const result = await runTestSuite('dogfood', [
      ['async pass', async () => { /* resolves */ }],
    ]);
    expect(result.passed).toBe(1);
    expect(result.failed).toBe(0);
  });

  test('mixed sync and async tests counted correctly', async () => {
    const result = await runTestSuite('mixed', [
      ['sync pass', () => {}],
      ['async pass', async () => {}],
      ['sync fail', () => { throw new Error('sync err'); }],
      ['async fail', async () => { throw new Error('async err'); }],
    ]);
    expect(result.passed).toBe(2);
    expect(result.failed).toBe(2);
  });

  test('async test awaiting a delayed value counts as passed', async () => {
    const result = await runTestSuite('delay', [
      ['delayed async pass', async () => {
        await new Promise(r => setTimeout(r, 10));
      }],
    ]);
    expect(result.passed).toBe(1);
    expect(result.failed).toBe(0);
  });

  test('async test awaiting then throwing counts as failed', async () => {
    const result = await runTestSuite('delay-fail', [
      ['delayed async fail', async () => {
        await new Promise(r => setTimeout(r, 10));
        throw new Error('delayed error');
      }],
    ]);
    expect(result.failed).toBe(1);
    expect(result.failures[0].error).toBe('delayed error');
  });

  test('failures array contains test name and error message', async () => {
    const result = await runTestSuite('failures', [
      ['my failing test', async () => { throw new Error('oops'); }],
    ]);
    expect(result.failures[0].test).toBe('my failing test');
    expect(result.failures[0].error).toBe('oops');
  });
});

// ─── runTestSuites ────────────────────────────────────────────────────────────

describe('runTestSuites with async tests', () => {
  test('aggregates results across suites correctly', async () => {
    const result = await runTestSuites([
      ['suite-a', [
        ['pass', async () => {}],
        ['fail', async () => { throw new Error('a-fail'); }],
      ]],
      ['suite-b', [
        ['pass', () => {}],
      ]],
    ]);
    expect(result.passed).toBe(2);
    expect(result.failed).toBe(1);
  });
});

// ─── createAssertions ─────────────────────────────────────────────────────────

describe('createAssertions', () => {
  const assert = createAssertions();

  test('equal passes for identical values', () => {
    expect(() => assert.equal(1, 1)).not.toThrow();
  });

  test('equal throws for different values', () => {
    expect(() => assert.equal(1, 2)).toThrow();
  });

  test('truthy passes for truthy values', () => {
    expect(() => assert.truthy('hello')).not.toThrow();
  });

  test('falsy passes for falsy values', () => {
    expect(() => assert.falsy(null)).not.toThrow();
  });

  test('notEqual passes for different values', () => {
    expect(() => assert.notEqual(1, 2)).not.toThrow();
  });
});
