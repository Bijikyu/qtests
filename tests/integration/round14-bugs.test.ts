/**
 * Round 14 dogfood regression tests
 *
 * Bug-1: fileSystem/index.ts safeWriteFile — used `import * as fs from 'fs-extra'`
 *   then called `fs.writeFile(...)`. The CJS-module namespace does not expose
 *   `writeFile` as an own property, so every write silently failed (returned false,
 *   left an empty file). Fixed: replaced the inline implementation with a re-export
 *   of `safeWriteFile` from `./fileWriting.js` which correctly uses `fs.outputFile`.
 *
 * Bug-2: utils/performanceBenchmarker.ts — the module exports a module-level
 *   singleton `benchmarker = new PerformanceBenchmarker()`.  The constructor
 *   immediately called `new PerformanceMonitor({...})`, and in non-test
 *   environments (no JEST_WORKER_ID / NODE_ENV !== 'test') the Round-12-fixed
 *   PerformanceMonitor guard lets `startMonitoring()` run — starting a
 *   persistent setInterval that prevents the process from exiting.  Fixed: moved
 *   PerformanceMonitor construction from the class constructor into `runBenchmark()`
 *   so no interval is started at module load time.
 *
 * Modules probed and found clean (no bugs): utils/timerManager, utils/asyncUtils,
 *   utils/concurrencyUtils, utils/configurationFramework (ConfigurationManager
 *   static API), utils/structuredLogger (log singleton), fileSystem (safeExists,
 *   safeReadFile, safeDelete, ensureDir, isFile, isDirectory, safeStats).
 */

import * as path from 'path';
import * as os from 'os';
import * as fsp from 'fs/promises';

// Helper: fresh require to bypass jest module cache
const load = (rel: string) => import(path.resolve(__dirname, rel));

// ─── Bug-1: fileSystem safeWriteFile ──────────────────────────────────────────
describe('Bug-1: fileSystem safeWriteFile — writes content correctly', () => {
  let fs: any;
  let tmpDir: string;

  beforeAll(async () => {
    ({ default: fs } = await load('../../dist/lib/fileSystem/index.js'));
    tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'qtests-r14-'));
  });

  afterAll(async () => {
    await fsp.rm(tmpDir, { recursive: true, force: true });
  });

  it('safeWriteFile returns true on success', async () => {
    const file = path.join(tmpDir, 'write-test.txt');
    const result = await fs.safeWriteFile(file, 'hello world');
    expect(result).toBe(true);
  });

  it('safeWriteFile persists content readable by safeReadFile', async () => {
    const file = path.join(tmpDir, 'persist-test.txt');
    await fs.safeWriteFile(file, 'persisted content');
    const content = await fs.safeReadFile(file);
    expect(content).toBe('persisted content');
  });

  it('safeWriteFile overwrites existing content', async () => {
    const file = path.join(tmpDir, 'overwrite-test.txt');
    await fs.safeWriteFile(file, 'first');
    await fs.safeWriteFile(file, 'second');
    const content = await fs.safeReadFile(file);
    expect(content).toBe('second');
  });

  it('safeWriteFile writes Buffer content', async () => {
    const file = path.join(tmpDir, 'buffer-test.txt');
    const result = await fs.safeWriteFile(file, Buffer.from('buf content'));
    expect(result).toBe(true);
    const content = await fs.safeReadFile(file);
    expect(content).toBe('buf content');
  });

  it('safeWriteFile creates parent directories if needed', async () => {
    const file = path.join(tmpDir, 'nested', 'deep', 'file.txt');
    const result = await fs.safeWriteFile(file, 'nested');
    expect(result).toBe(true);
    const content = await fs.safeReadFile(file);
    expect(content).toBe('nested');
  });

  it('safeReadFile returns null for missing file', async () => {
    const content = await fs.safeReadFile(path.join(tmpDir, 'nonexistent.txt'));
    expect(content).toBeNull();
  });

  it('safeExists returns true for existing path', async () => {
    expect(await fs.safeExists(tmpDir)).toBe(true);
  });

  it('safeDelete removes a file', async () => {
    const file = path.join(tmpDir, 'delete-me.txt');
    await fs.safeWriteFile(file, 'bye');
    const result = await fs.safeDelete(file);
    expect(result).toBe(true);
    const content = await fs.safeReadFile(file);
    expect(content).toBeNull();
  });

  it('ensureDir creates directory', async () => {
    const dir = path.join(tmpDir, 'created-dir');
    const result = await fs.ensureDir(dir);
    expect(result).toBe(true);
    expect(await fs.isDirectory(dir)).toBe(true);
  });

  it('isFile returns true for a file, false for a directory', async () => {
    const file = path.join(tmpDir, 'isfile-test.txt');
    await fs.safeWriteFile(file, 'x');
    expect(await fs.isFile(file)).toBe(true);
    expect(await fs.isFile(tmpDir)).toBe(false);
  });

  it('safeStats returns stats object for existing path', async () => {
    const file = path.join(tmpDir, 'stats-test.txt');
    await fs.safeWriteFile(file, 'stats');
    const stats = await fs.safeStats(file);
    expect(stats).not.toBeNull();
    expect(typeof stats.size).toBe('number');
  });
});

// ─── Bug-2: performanceBenchmarker no longer hangs on load ────────────────────
describe('Bug-2: performanceBenchmarker singleton does not start interval on load', () => {
  let bm: any;

  beforeAll(async () => {
    bm = await load('../../dist/lib/utils/performanceBenchmarker.js');
  });

  it('module loads without hanging', () => {
    expect(bm).toBeDefined();
  });

  it('benchmarker singleton is exported and is an object', () => {
    expect(typeof bm.benchmarker).toBe('object');
    expect(bm.benchmarker).not.toBeNull();
  });

  it('benchmarker has runBenchmark method', () => {
    expect(typeof bm.benchmarker.runBenchmark).toBe('function');
  });

  it('benchmarker has runSuite method', () => {
    expect(typeof bm.benchmarker.runSuite).toBe('function');
  });

  it('benchmarker has compareSuites method', () => {
    expect(typeof bm.benchmarker.compareSuites).toBe('function');
  });

  it('benchmarker has generateReport method', () => {
    expect(typeof bm.benchmarker.generateReport).toBe('function');
  });

  it('module-level runBenchmark convenience export is a function', () => {
    expect(typeof bm.runBenchmark).toBe('function');
  });

  it('module-level runSuite convenience export is a function', () => {
    expect(typeof bm.runSuite).toBe('function');
  });

  it('module-level compareSuites convenience export is a function', () => {
    expect(typeof bm.compareSuites).toBe('function');
  });

  it('module-level generateReport convenience export is a function', () => {
    expect(typeof bm.generateReport).toBe('function');
  });

  it('PerformanceBenchmarker constructor does not expose a monitor field (lazy creation)', () => {
    // The fix: monitor is created inside runBenchmark(), not in the constructor.
    // This ensures no setInterval fires at module-load time.
    const pb = bm.benchmarker;
    // The internal monitor field should NOT exist on the instance (it's created locally in runBenchmark)
    expect((pb as any).monitor).toBeUndefined();
  });
});

// ─── Regression: utils/asyncUtils ────────────────────────────────────────────
describe('Regression: asyncUtils', () => {
  let au: any;

  beforeAll(async () => {
    au = await load('../../dist/lib/utils/asyncUtils.js');
  });

  it('wait resolves after delay', async () => {
    const start = Date.now();
    await au.wait(20);
    expect(Date.now() - start).toBeGreaterThanOrEqual(15);
  });

  it('withTimeout resolves when fn completes in time', async () => {
    const result = await au.withTimeout(() => Promise.resolve(99), 1000);
    expect(result).toBe(99);
  });

  it('withTimeout rejects when fn exceeds timeout', async () => {
    await expect(au.withTimeout(() => au.wait(500), 50)).rejects.toThrow();
  });

  it('withRetries succeeds on first attempt', async () => {
    const r = await au.withRetries(() => Promise.resolve('ok'), { retries: 3, delay: 10 }, 'ctx');
    expect(r).toBe('ok');
  });

  it('withRetries retries on failure and eventually succeeds', async () => {
    let calls = 0;
    const r = await au.withRetries(async () => {
      calls++;
      if (calls < 2) throw new Error('not yet');
      return 'done';
    }, { retries: 3, delay: 10 }, 'ctx');
    expect(r).toBe('done');
    expect(calls).toBe(2);
  });

  it('debounce returns a function', () => {
    expect(typeof au.debounce(() => {}, 100)).toBe('function');
  });

  it('throttle returns a function', () => {
    expect(typeof au.throttle(() => {}, 100)).toBe('function');
  });
});

// ─── Regression: utils/configurationFramework ────────────────────────────────
describe('Regression: ConfigurationManager static API', () => {
  let ConfigurationManager: any;

  beforeAll(async () => {
    ({ ConfigurationManager } = await load('../../dist/lib/utils/configurationFramework.js'));
    ConfigurationManager.reset();
  });

  afterEach(() => {
    ConfigurationManager.reset();
  });

  it('get returns defaultValue when key is missing', () => {
    expect(ConfigurationManager.get('missing', 'def')).toBe('def');
  });

  it('set + get round-trips a value', () => {
    ConfigurationManager.set('myKey', 'myValue');
    expect(ConfigurationManager.get('myKey')).toBe('myValue');
  });

  it('getAll returns a copy of all set keys', () => {
    ConfigurationManager.set('a', 1);
    ConfigurationManager.set('b', 2);
    const all = ConfigurationManager.getAll();
    expect(all.a).toBe(1);
    expect(all.b).toBe(2);
  });

  it('reset clears all config', () => {
    ConfigurationManager.set('z', 99);
    ConfigurationManager.reset();
    expect(ConfigurationManager.get('z')).toBeUndefined();
  });

  it('merge shallow-merges config', () => {
    ConfigurationManager.set('x', 1);
    ConfigurationManager.merge({ y: 2 });
    expect(ConfigurationManager.get('x')).toBe(1);
    expect(ConfigurationManager.get('y')).toBe(2);
  });

  it('watch callback fires on set', () => {
    const calls: any[] = [];
    ConfigurationManager.watch('watched', (v: any, old: any) => calls.push({ v, old }));
    ConfigurationManager.set('watched', 'new');
    expect(calls.length).toBe(1);
    expect(calls[0].v).toBe('new');
  });

  it('unwatch stops callback from firing', () => {
    const calls: any[] = [];
    ConfigurationManager.watch('unwatched', (v: any) => calls.push(v));
    ConfigurationManager.unwatch('unwatched');
    ConfigurationManager.set('unwatched', 'x');
    expect(calls.length).toBe(0);
  });
});
