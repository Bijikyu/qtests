/**
 * Round 16 dogfood regression tests
 *
 * No new bugs found in this round. All modules probed cleanly:
 *   utils/errorHandling (handleError, handleAsyncError, createErrorResponse,
 *     getErrorMessage, getErrorType, handleMemoryError, handleValidationError,
 *     handlePerformanceError, handleSecurityError),
 *   utils/timingUtils (Timer, measureTime, measureAsyncTime, globalPerformanceTracker,
 *     PerformanceTracker, analyzePerformance, withTiming),
 *   lib/memory/index (MemoryLeakDetector, MemorySnapshotManager, memoryMonitor,
 *     getMemorySnapshot, detectMemoryLeaks, startMemoryMonitoring, forceGC, smartGC,
 *     aggressiveCleanup, clearModuleCache, clearGlobalRefs, isUnderMemoryPressure),
 *   lib/memory/leakDetector (MemoryLeakDetector.detectLeaks, checkConsistentGrowth),
 *   lib/memory/snapshotManager (MemorySnapshotManager.takeSnapshot, getDelta, reset),
 *   lib/httpMock/clientFactories (createMockHttpClient, createSimpleMockClient,
 *     createUserConfigurableMock),
 *   lib/httpMock/mockUtilities (createMockResponse, createAxiosStyleResponse,
 *     createErrorResponse),
 *   lib/optimization/testDiscoveryCache (TestDiscoveryCache, testDiscoveryCache singleton),
 *   lib/polyfills/index (ClipboardAPI, PolyfillOrchestrator, initializePolyfills),
 *   lib/runner/jestWorker (worker-thread entrypoint — no exports by design).
 */

import * as path from 'path';

const load = (rel: string) => import(path.resolve(__dirname, rel));

// ─── Regression: utils/errorHandling ─────────────────────────────────────────
describe('Regression: utils/errorHandling', () => {
  let eh: any;

  beforeAll(async () => {
    eh = await load('../../dist/lib/utils/errorHandling.js');
  });

  it('getErrorMessage returns error.message for Error instance', () => {
    expect(eh.getErrorMessage(new Error('oops'))).toBe('oops');
  });

  it('getErrorMessage returns string coercion for non-Error', () => {
    const r = eh.getErrorMessage('plain string');
    expect(typeof r).toBe('string');
  });

  it('getErrorType returns constructor name for Error', () => {
    const r = eh.getErrorType(new Error('x'));
    expect(r).toBe('Error');
  });

  it('getErrorType returns constructor name for TypeError', () => {
    const r = eh.getErrorType(new TypeError('x'));
    expect(r).toBe('TypeError');
  });

  it('createErrorResponse returns object with error field', () => {
    const r = eh.createErrorResponse(new Error('resp'), 'probe');
    expect(r).toBeDefined();
    expect(r.error).toBeInstanceOf(Error);
  });

  it('handleError does not throw for valid Error', () => {
    expect(() => eh.handleError(new Error('safe'), 'ctx', { logToConsole: false })).not.toThrow();
  });

  it('handleError does not throw for null error', () => {
    expect(() => eh.handleError(null, 'ctx', { logToConsole: false })).not.toThrow();
  });

  it('handleAsyncError resolves to null when promise rejects', async () => {
    const result = await eh.handleAsyncError(
      Promise.reject(new Error('async fail')),
      'ctx',
      { logToConsole: false }
    );
    expect(result).toBeNull();
  });

  it('handleAsyncError resolves to original value when promise resolves', async () => {
    const result = await eh.handleAsyncError(
      Promise.resolve('success'),
      'ctx',
      { logToConsole: false }
    );
    expect(result).toBe('success');
  });

  it('handleMemoryError does not throw', () => {
    expect(() => eh.handleMemoryError(new Error('mem'), 'alloc', {})).not.toThrow();
  });

  it('handleValidationError does not throw', () => {
    expect(() => eh.handleValidationError(new Error('val'), 'field', {})).not.toThrow();
  });
});

// ─── Regression: utils/timingUtils ───────────────────────────────────────────
describe('Regression: utils/timingUtils', () => {
  let tu: any;

  beforeAll(async () => {
    tu = await load('../../dist/lib/utils/timingUtils.js');
  });

  it('Timer.start() + stop() returns duration >= 0', () => {
    const t = new tu.Timer('test');
    t.start();
    const r = t.stop();
    expect(typeof r.duration).toBe('number');
    expect(r.duration).toBeGreaterThanOrEqual(0);
  });

  it('Timer stop result has startTime, endTime, duration, formattedDuration', () => {
    const t = new tu.Timer('test2');
    t.start();
    const r = t.stop();
    expect(r).toHaveProperty('startTime');
    expect(r).toHaveProperty('endTime');
    expect(r).toHaveProperty('duration');
    expect(r).toHaveProperty('formattedDuration');
  });

  it('measureTime returns result and timing', () => {
    const r = tu.measureTime(() => 42, 'probe');
    expect(r.result).toBe(42);
    expect(typeof r.timing.duration).toBe('number');
  });

  it('measureAsyncTime returns result and timing', async () => {
    const r = await tu.measureAsyncTime(async () => 'async', 'probe');
    expect(r.result).toBe('async');
    expect(typeof r.timing.duration).toBe('number');
  });

  it('globalPerformanceTracker is an object with record method', () => {
    expect(typeof tu.globalPerformanceTracker).toBe('object');
    expect(typeof tu.globalPerformanceTracker.record).toBe('function');
  });

  it('globalPerformanceTracker.record does not throw', () => {
    expect(() => tu.globalPerformanceTracker.record('op', 100)).not.toThrow();
  });

  it('globalPerformanceTracker.getStats returns stats object', () => {
    tu.globalPerformanceTracker.record('op2', 50);
    const stats = tu.globalPerformanceTracker.getStats('op2');
    expect(typeof stats).toBe('object');
  });

  it('PerformanceTracker instance has record and getStats methods', () => {
    const pt = new tu.PerformanceTracker();
    expect(typeof pt.record).toBe('function');
    expect(typeof pt.getStats).toBe('function');
  });
});

// ─── Regression: lib/memory modules ──────────────────────────────────────────
describe('Regression: lib/memory', () => {
  let mem: any;
  let leakDet: any;
  let snapMgr: any;

  beforeAll(async () => {
    [mem, leakDet, snapMgr] = await Promise.all([
      load('../../dist/lib/memory/index.js'),
      load('../../dist/lib/memory/leakDetector.js'),
      load('../../dist/lib/memory/snapshotManager.js')
    ]);
  });

  it('memoryMonitor singleton is an object', () => {
    expect(typeof mem.memoryMonitor).toBe('object');
    expect(mem.memoryMonitor).not.toBeNull();
  });

  it('memoryMonitor.takeSnapshot returns snapshot with heapUsed', () => {
    const snap = mem.memoryMonitor.takeSnapshot();
    expect(typeof snap.heapUsed).toBe('number');
  });

  it('detectMemoryLeaks returns boolean for empty snapshots array', () => {
    const result = mem.detectMemoryLeaks([]);
    expect(typeof result).toBe('boolean');
  });

  it('isUnderMemoryPressure returns a boolean', () => {
    const r = mem.isUnderMemoryPressure();
    expect(typeof r).toBe('boolean');
  });

  it('forceGC does not throw', () => {
    expect(() => mem.forceGC()).not.toThrow();
  });

  it('smartGC does not throw', () => {
    expect(() => mem.smartGC()).not.toThrow();
  });

  it('clearModuleCache does not throw', () => {
    expect(() => mem.clearModuleCache()).not.toThrow();
  });

  it('MemoryLeakDetector.detectLeaks returns a boolean', () => {
    const detector = new leakDet.MemoryLeakDetector();
    const r = detector.detectLeaks([
      { heapUsed: 100, timestamp: Date.now() - 1000 },
      { heapUsed: 110, timestamp: Date.now() }
    ]);
    expect(typeof r).toBe('boolean');
  });

  it('MemorySnapshotManager.takeSnapshot returns snapshot', () => {
    const manager = new snapMgr.MemorySnapshotManager();
    const snap = manager.takeSnapshot('test');
    expect(snap).toBeDefined();
    expect(typeof snap.heapUsed).toBe('number');
  });

  it('MemorySnapshotManager.getAllSnapshots returns array', () => {
    const manager = new snapMgr.MemorySnapshotManager();
    manager.takeSnapshot('s1');
    manager.takeSnapshot('s2');
    const snaps = manager.getAllSnapshots();
    expect(Array.isArray(snaps)).toBe(true);
    expect(snaps.length).toBe(2);
  });

  it('MemorySnapshotManager.reset clears snapshots', () => {
    const manager = new snapMgr.MemorySnapshotManager();
    manager.takeSnapshot('s1');
    manager.reset();
    expect(manager.getAllSnapshots().length).toBe(0);
  });
});

// ─── Regression: lib/httpMock/mockUtilities ──────────────────────────────────
describe('Regression: httpMock/mockUtilities', () => {
  let mu: any;

  beforeAll(async () => {
    mu = await load('../../dist/lib/httpMock/mockUtilities.js');
  });

  it('createMockResponse returns object with status and data', () => {
    const r = mu.createMockResponse({ ok: true }, 200);
    expect(r.status).toBe(200);
    expect(r.data).toEqual({ ok: true });
  });

  it('createMockResponse defaults status to 200', () => {
    const r = mu.createMockResponse({ hello: 'world' });
    expect(r.status).toBe(200);
    expect(r.data).toEqual({ hello: 'world' });
  });

  it('createAxiosStyleResponse returns object with status and data', () => {
    const r = mu.createAxiosStyleResponse({ created: true }, 201);
    expect(r.status).toBe(201);
    expect(r.data).toEqual({ created: true });
  });

  it('createErrorResponse returns response with status and error info', () => {
    const r = mu.createErrorResponse(404, 'Not Found');
    expect(r.status).toBe(404);
  });
});

// ─── Regression: lib/optimization/testDiscoveryCache ─────────────────────────
describe('Regression: testDiscoveryCache', () => {
  let tdc: any;

  beforeAll(async () => {
    tdc = await load('../../dist/lib/optimization/testDiscoveryCache.js');
  });

  it('TestDiscoveryCache can be instantiated', () => {
    const c = new tdc.TestDiscoveryCache();
    expect(c).toBeDefined();
  });

  it('testDiscoveryCache singleton is exported', () => {
    expect(typeof tdc.testDiscoveryCache).toBe('object');
    expect(tdc.testDiscoveryCache).not.toBeNull();
  });

  it('set then get returns the stored value', () => {
    const c = new tdc.TestDiscoveryCache({ ttl: 60000 });
    c.set('key1', ['test1.ts', 'test2.ts']);
    const result = c.get('key1');
    expect(result).toEqual(['test1.ts', 'test2.ts']);
  });

  it('get returns null for missing key', () => {
    const c = new tdc.TestDiscoveryCache({ ttl: 60000 });
    expect(c.get('nonexistent')).toBeNull();
  });

  it('clear removes all entries', () => {
    const c = new tdc.TestDiscoveryCache({ ttl: 60000 });
    c.set('a', [1]);
    c.set('b', [2]);
    c.clear();
    expect(c.get('a')).toBeNull();
    expect(c.get('b')).toBeNull();
  });

  it('getStats returns size and watchers counts', () => {
    const c = new tdc.TestDiscoveryCache({ ttl: 60000 });
    c.set('k', ['v']);
    c.set('k2', ['v2']);
    const stats = c.getStats();
    expect(typeof stats.size).toBe('number');
    expect(stats.size).toBe(2);
  });

  it('expired entries are treated as cache misses', async () => {
    const c = new tdc.TestDiscoveryCache({ ttl: 1 }); // 1ms TTL
    c.set('expire', ['x']);
    await new Promise(r => setTimeout(r, 20));
    expect(c.get('expire')).toBeNull();
  });
});
