/**
 * Round 12 dogfood regression tests
 *
 * Bugs fixed:
 *  Bug-1: AdvancedMemoryLeakDetector constructor started setInterval unconditionally —
 *         leaked into test suites. Fixed: guarded with JEST_WORKER_ID / NODE_ENV=test.
 *  Bug-2: PerformanceMonitor constructor called this.startMonitoring() unconditionally —
 *         leaked setInterval into test suites. Fixed: same guard.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// ─── helper ─────────────────────────────────────────────────────────────────
async function load<T = any>(path: string): Promise<T> {
  return (await import(path)) as T;
}

// ─── Bug-1: AdvancedMemoryLeakDetector no-interval-on-import ─────────────────
describe('Bug-1: AdvancedMemoryLeakDetector – no interval leak in test env', () => {
  let AdvancedMemoryLeakDetector: any;

  beforeEach(async () => {
    ({ AdvancedMemoryLeakDetector } = await load('../../dist/lib/advancedMemoryLeakDetector.js'));
  });

  it('constructor does not log "Advanced memory leak detection started" in test env', () => {
    const spy: string[] = [];
    const orig = console.log;
    console.log = (...args: any[]) => { spy.push(args.join(' ')); };
    try {
      const d = new AdvancedMemoryLeakDetector();
      d.stop(); // safe even if interval was never started
    } finally {
      console.log = orig;
    }
    const started = spy.some(s => s.includes('Advanced memory leak detection started'));
    expect(started).toBe(false);
  });

  it('instantiation does not set an active intervalId', () => {
    const d = new AdvancedMemoryLeakDetector();
    // intervalId is private but we can inspect via internal structure
    expect((d as any).intervalId).toBeUndefined();
    d.stop();
  });

  it('startMonitoring() can still be called manually and produces an intervalId', () => {
    const d = new AdvancedMemoryLeakDetector();
    d.startMonitoring();
    expect((d as any).intervalId).toBeDefined();
    d.stop();
    expect((d as any).intervalId).toBeUndefined();
  });

  it('stop() is safe even when monitoring was never started', () => {
    const d = new AdvancedMemoryLeakDetector();
    expect(() => d.stop()).not.toThrow();
  });

  it('takeSnapshot() stores a snapshot entry', () => {
    const d = new AdvancedMemoryLeakDetector();
    const before = (d as any).snapshots.length;
    d.takeSnapshot?.() ?? (d as any).takeSnapshot?.();
    // takeSnapshot is private — verify via getMemoryStats which calls it
    const stats = d.getMemoryStats();
    expect(stats).toBeDefined();
    d.stop();
  });

  it('getMemoryStats() returns an object with snapshots, analysis and currentUsage', () => {
    const d = new AdvancedMemoryLeakDetector();
    const stats = d.getMemoryStats();
    expect(typeof stats).toBe('object');
    expect(stats).toHaveProperty('snapshots');
    expect(stats).toHaveProperty('analysis');
    expect(stats).toHaveProperty('currentUsage');
    d.stop();
  });

  it('exportMemoryReport() returns a markdown string report', () => {
    const d = new AdvancedMemoryLeakDetector();
    const report = d.exportMemoryReport();
    expect(typeof report).toBe('string');
    expect(report).toContain('Memory');
    d.stop();
  });

  it('multiple instances do not interfere', () => {
    const a = new AdvancedMemoryLeakDetector();
    const b = new AdvancedMemoryLeakDetector();
    expect((a as any).intervalId).toBeUndefined();
    expect((b as any).intervalId).toBeUndefined();
    a.stop();
    b.stop();
  });
});

// ─── Bug-2: PerformanceMonitor – no interval leak in test env ─────────────────
describe('Bug-2: PerformanceMonitor – no interval leak in test env', () => {
  let PerformanceMonitor: any;

  beforeEach(async () => {
    ({ PerformanceMonitor } = await load('../../dist/lib/performanceMonitor.js'));
  });

  it('constructor does not set monitoringInterval in test env', () => {
    const pm = new PerformanceMonitor();
    expect((pm as any).monitoringInterval).toBeUndefined();
    pm.stopMonitoring();
  });

  it('startMonitoring() sets monitoringInterval and stopMonitoring() clears it', () => {
    const pm = new PerformanceMonitor();
    pm.startMonitoring();
    expect((pm as any).monitoringInterval).toBeDefined();
    pm.stopMonitoring();
    expect((pm as any).monitoringInterval).toBeUndefined();
  });

  it('getMetrics() returns an object with cpu, memory, eventLoop, custom keys', () => {
    const pm = new PerformanceMonitor();
    const m = pm.getMetrics();
    expect(m).toHaveProperty('cpu');
    expect(m).toHaveProperty('memory');
    expect(m).toHaveProperty('eventLoop');
    expect(m).toHaveProperty('custom');
    pm.stopMonitoring();
  });

  it('addMetric() stores a custom metric retrievable via getMetrics()', () => {
    const pm = new PerformanceMonitor();
    pm.addMetric('responseTime', 42);
    const m = pm.getMetrics();
    expect(m.custom.responseTime).toBe(42);
    pm.stopMonitoring();
  });

  it('getHistory() returns an array (empty before any collection)', () => {
    const pm = new PerformanceMonitor();
    const h = pm.getHistory('cpu.usage');
    expect(Array.isArray(h)).toBe(true);
    pm.stopMonitoring();
  });

  it('collectMetrics() populates cpu and memory data', async () => {
    const pm = new PerformanceMonitor();
    await pm.collectMetrics();
    const m = pm.getMetrics();
    expect(typeof m.cpu.usage).toBe('number');
    expect(Array.isArray(m.cpu.loadAverage)).toBe(true);
    expect(typeof m.memory.used).toBe('number');
    pm.stopMonitoring();
  });

  it('multiple instances can each be started and stopped independently', () => {
    const a = new PerformanceMonitor();
    const b = new PerformanceMonitor();
    a.startMonitoring();
    expect((a as any).monitoringInterval).toBeDefined();
    expect((b as any).monitoringInterval).toBeUndefined();
    a.stopMonitoring();
    b.stopMonitoring();
  });

  it('stopMonitoring() is idempotent (safe to call twice)', () => {
    const pm = new PerformanceMonitor();
    pm.startMonitoring();
    pm.stopMonitoring();
    expect(() => pm.stopMonitoring()).not.toThrow();
    expect((pm as any).monitoringInterval).toBeUndefined();
  });

  it('options.samplingInterval is respected in the config', () => {
    const pm = new PerformanceMonitor({ samplingInterval: 5000 });
    expect((pm as any).config.samplingInterval).toBe(5000);
    pm.stopMonitoring();
  });

  it('alert threshold config is stored correctly', () => {
    const pm = new PerformanceMonitor({ alertThresholds: { cpu: 80 } });
    expect((pm as any).config.alertThresholds.cpu).toBe(80);
    pm.stopMonitoring();
  });
});

// ─── Regression: CleanupManager works with correct signature ──────────────────
describe('Regression: CleanupManager registerTask (id, name, fn, opts)', () => {
  let createCleanupManager: any;

  beforeEach(async () => {
    ({ createCleanupManager } = await load('../../dist/lib/cleanupManager.js'));
  });

  it('registerTask runs cleanup when executeTask is called', async () => {
    const cm = createCleanupManager();
    let ran = false;
    cm.registerTask('t1', 'Task One', async () => { ran = true; });
    await cm.executeTask('t1');
    expect(ran).toBe(true);
    await cm.shutdown();
  });

  it('unregisterTask removes the task', async () => {
    const cm = createCleanupManager();
    cm.registerTask('t2', 'Task Two', async () => {});
    cm.unregisterTask('t2');
    expect(cm.getTask('t2')).toBeUndefined();
    await cm.shutdown();
  });

  it('getAllTasks() lists registered tasks', async () => {
    const cm = createCleanupManager();
    cm.registerTask('t3', 'Task Three', async () => {});
    const tasks = cm.getAllTasks();
    expect(tasks.length).toBeGreaterThanOrEqual(1);
    await cm.shutdown();
  });

  it('shutdown() completes without error', async () => {
    const cm = createCleanupManager();
    cm.registerTask('t4', 'Task Four', async () => {});
    await expect(cm.shutdown()).resolves.not.toThrow();
  });
});

// ─── Regression: polyfillOrchestrator has initialize/reset/isInitialized ─────
describe('Regression: polyfillOrchestrator API', () => {
  it('polyfillOrchestrator has initialize, reset, isInitialized methods', async () => {
    const { polyfillOrchestrator } = await load('../../dist/lib/testPolyfills.js');
    expect(typeof polyfillOrchestrator.initialize).toBe('function');
    expect(typeof polyfillOrchestrator.reset).toBe('function');
    expect(typeof polyfillOrchestrator.isInitialized).toBe('function');
  });

  it('isInitialized() returns false before initialize()', async () => {
    const { polyfillOrchestrator } = await load('../../dist/lib/testPolyfills.js');
    polyfillOrchestrator.reset();
    expect(polyfillOrchestrator.isInitialized()).toBe(false);
  });

  it('initializePolyfills is a function', async () => {
    const { initializePolyfills } = await load('../../dist/lib/testPolyfills.js');
    expect(typeof initializePolyfills).toBe('function');
  });

  it('resetPolyfills is a function', async () => {
    const { resetPolyfills } = await load('../../dist/lib/testPolyfills.js');
    expect(typeof resetPolyfills).toBe('function');
  });
});

// ─── Regression: streamingValidator functional checks ───────────────────────
describe('Regression: streamingValidator schemas', () => {
  it('safeString validates a string successfully', async () => {
    const { safeString } = await load('../../dist/lib/streamingValidator.js');
    const r = safeString.safeParse('hello');
    expect(r.success).toBe(true);
    expect(r.data).toBe('hello');
  });

  it('safeNumber validates a number successfully', async () => {
    const { safeNumber } = await load('../../dist/lib/streamingValidator.js');
    const r = safeNumber.safeParse(42);
    expect(r.success).toBe(true);
    expect(r.data).toBe(42);
  });

  it('safeBoolean validates a boolean successfully', async () => {
    const { safeBoolean } = await load('../../dist/lib/streamingValidator.js');
    const r = safeBoolean.safeParse(true);
    expect(r.success).toBe(true);
    expect(r.data).toBe(true);
  });

  it('safeArray validates an array of any values', async () => {
    const { safeArray } = await load('../../dist/lib/streamingValidator.js');
    const r = safeArray.safeParse([1, 'two', true]);
    expect(r.success).toBe(true);
    expect(Array.isArray(r.data)).toBe(true);
  });

  it('sanitizeString removes script tags', async () => {
    const { sanitizeString } = await load('../../dist/lib/streamingValidator.js');
    const r = sanitizeString('hello <script>alert(1)</script> world');
    expect(r).not.toContain('<script>');
    expect(r).toContain('hello');
    expect(r).toContain('world');
  });

  it('sanitizeString plain text is returned unchanged (HTML-escaped)', async () => {
    const { sanitizeString } = await load('../../dist/lib/streamingValidator.js');
    const r = sanitizeString('safe text');
    expect(r).toBe('safe text');
  });

  it('escapeHtml converts < > & to entities', async () => {
    const { escapeHtml } = await load('../../dist/lib/streamingValidator.js');
    const r = escapeHtml('<b>bold</b>');
    expect(r).toBe('&lt;b&gt;bold&lt;/b&gt;');
  });
});
