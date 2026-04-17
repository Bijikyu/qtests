/**
 * Regression tests for lib/connectionPool.ts and lib/loadTest.ts
 *
 * Bugs fixed in connectionPool.ts:
 *
 * Bug 1 — connectionsCreated / connectionsDestroyed never incremented.
 *   The factory was passed raw to generic-pool.createPool() with no wrapping.
 *   generic-pool calls factory.create() / factory.destroy() internally, but
 *   AdvancedConnectionPool had no hook to count those calls.
 *   getStats() therefore always returned connectionsCreated: 0 and
 *   connectionsDestroyed: 0, making activeConnections always 0 as well.
 *   Fix: wrap the factory in initializePool() to intercept create/destroy.
 *
 * Bug 2 — pool options (maxConnections, acquireTimeout) never passed to generic-pool.
 *   createPool(wrappedFactory) was called with no options, so generic-pool
 *   used its own defaults (max: 1). This meant you could only ever hold ONE
 *   connection at a time regardless of maxConnections setting — any second
 *   concurrent acquire would block forever (no acquireTimeout applied either).
 *   Fix: pass { max: config.maxConnections, acquireTimeoutMillis: config.acquireTimeout }
 *   to createPool().
 *
 * Bug fixed in loadTest.ts:
 *
 * Bug 3 — importing loadTest.js starts a background setInterval that prevents
 *   the process from exiting.
 *   loadTest.ts imported monitoringSystem from ./monitoring.js. That module
 *   creates a module-level singleton (new MonitoringSystem(...)) in its body,
 *   which calls setInterval in its constructor. Any process that imports
 *   loadTest.js (including test runners) immediately acquires an unreferenced
 *   live interval tied to no variable the caller holds. The process cannot exit
 *   cleanly, causing timeouts in CI and Jest worker process warnings.
 *   Fix: removed the monitoringSystem import and the two monitoringSystem.recordRequest()
 *   calls that were the only usage site.
 */

let poolMod;

beforeAll(async () => {
  poolMod = await import('../../dist/lib/connectionPool.js');
});

const makePool = (opts = {}) => {
  let id = 0;
  return poolMod.createConnectionPool(
    {
      create: async () => ({ id: ++id }),
      destroy: async () => {}
    },
    { maxConnections: 5, acquireTimeout: 3000, healthCheckInterval: 60000, ...opts }
  );
};

describe('AdvancedConnectionPool — stats tracking (bug fix)', () => {
  test('connectionsCreated increments with each acquired connection', async () => {
    const pool = makePool();
    const c1 = await pool.acquire();
    expect(pool.getStats().connectionsCreated).toBe(1);
    const c2 = await pool.acquire();
    expect(pool.getStats().connectionsCreated).toBe(2);
    await pool.release(c1);
    await pool.release(c2);
    await pool.shutdown();
  });

  test('connectionsDestroyed increments after pool shutdown drains connections', async () => {
    const pool = makePool();
    const c = await pool.acquire();
    await pool.release(c);
    await pool.shutdown();
    expect(pool.getStats().connectionsDestroyed).toBe(1);
  });

  test('activeConnections = connectionsCreated - connectionsDestroyed', async () => {
    const pool = makePool();
    const c1 = await pool.acquire();
    const c2 = await pool.acquire();
    const stats = pool.getStats();
    expect(stats.activeConnections).toBe(stats.connectionsCreated - stats.connectionsDestroyed);
    await pool.release(c1);
    await pool.release(c2);
    await pool.shutdown();
  });

  test('totalAcquisitions counts both successful and failed acquires', async () => {
    const pool = makePool({ acquireTimeout: 100 });
    const c = await pool.acquire();
    expect(pool.getStats().totalAcquisitions).toBe(1);
    expect(pool.getStats().successfulAcquisitions).toBe(1);
    await pool.release(c);
    await pool.shutdown();
  });
});

describe('AdvancedConnectionPool — maxConnections option respected (bug fix)', () => {
  test('concurrent acquires up to maxConnections all succeed', async () => {
    const pool = makePool({ maxConnections: 3 });
    const [c1, c2, c3] = await Promise.all([
      pool.acquire(),
      pool.acquire(),
      pool.acquire()
    ]);
    expect(pool.getStats().connectionsCreated).toBe(3);
    await pool.release(c1);
    await pool.release(c2);
    await pool.release(c3);
    await pool.shutdown();
  });

  test('acquire beyond maxConnections times out instead of hanging forever', async () => {
    const pool = makePool({ maxConnections: 1, acquireTimeout: 300 });
    const c = await pool.acquire();
    await expect(pool.acquire()).rejects.toThrow();
    await pool.release(c);
    await pool.shutdown();
  });
});

describe('AdvancedConnectionPool — lifecycle', () => {
  test('acquire returns the connection object from factory.create', async () => {
    const pool = makePool();
    const conn = await pool.acquire();
    expect(conn).toBeDefined();
    expect(typeof conn.id).toBe('number');
    await pool.release(conn);
    await pool.shutdown();
  });

  test('release returns connection to pool', async () => {
    const pool = makePool({ maxConnections: 1 });
    const c1 = await pool.acquire();
    await pool.release(c1);
    const c2 = await pool.acquire();
    expect(c2).toBeDefined();
    await pool.release(c2);
    await pool.shutdown();
  });

  test('acquire throws after shutdown', async () => {
    const pool = makePool();
    await pool.shutdown();
    await expect(pool.acquire()).rejects.toThrow();
  });

  test('circuit breaker starts CLOSED', () => {
    const pool = makePool();
    expect(pool.getCircuitState()).toBe(poolMod.CircuitState.CLOSED);
    pool.shutdown();
  });

  test('resetCircuitBreaker returns to CLOSED', async () => {
    const pool = makePool();
    pool.resetCircuitBreaker();
    expect(pool.getCircuitState()).toBe(poolMod.CircuitState.CLOSED);
    await pool.shutdown();
  });
});

describe('loadTest module — clean import (bug fix)', () => {
  test('loadTest module loads without hanging the process', async () => {
    const lt = await import('../../dist/lib/loadTest.js');
    expect(typeof lt.LoadTestRunner).toBe('function');
    expect(typeof lt.LoadTestScenarios).toBe('object');
  });

  test('LoadTestRunner can be instantiated', async () => {
    const { LoadTestRunner } = await import('../../dist/lib/loadTest.js');
    const runner = new LoadTestRunner();
    expect(runner).toBeDefined();
    runner.stopTest();
  });

  test('LoadTestScenarios.smokeTest returns a config object', async () => {
    const { LoadTestScenarios } = await import('../../dist/lib/loadTest.js');
    const config = LoadTestScenarios.smokeTest('myapp', 'http://localhost:3000');
    expect(config.name).toBe('myapp_smoke');
    expect(config.concurrentUsers).toBe(5);
    expect(config.duration).toBe(30);
  });

  test('LoadTestScenarios.loadTest returns a config object', async () => {
    const { LoadTestScenarios } = await import('../../dist/lib/loadTest.js');
    const config = LoadTestScenarios.loadTest('myapp', 'http://localhost:3000');
    expect(config.name).toBe('myapp_load');
    expect(config.concurrentUsers).toBe(50);
  });

  test('LoadTestRunner.getResults returns empty array initially', async () => {
    const { LoadTestRunner } = await import('../../dist/lib/loadTest.js');
    const runner = new LoadTestRunner();
    expect(runner.getResults()).toEqual([]);
    runner.stopTest();
  });

  test('LoadTestRunner.clearResults empties the results array', async () => {
    const { LoadTestRunner } = await import('../../dist/lib/loadTest.js');
    const runner = new LoadTestRunner();
    runner.clearResults();
    expect(runner.getResults()).toEqual([]);
    runner.stopTest();
  });
});
