/**
 * Round 18 bug regression tests
 *
 * Modules probed:
 *   lib/utils/commonPatterns.ts
 *   lib/utils/validationSchemas.ts
 *   lib/utils/importExportUtils.ts
 *   lib/utils/structuredLogger.ts
 *   lib/utils/testIsolationFramework.ts
 *   lib/testIsolation/databaseManager.ts
 *   lib/testIsolation/environmentManager.ts
 *   lib/testIsolation/mockManager.ts
 *   lib/testIsolation/serverManager.ts
 *   lib/testIsolation/isolationOrchestrator.ts
 *   lib/testIsolation.ts (compat shim)
 *
 * Bugs fixed (2):
 *   Bug-1: strings.kebabCase prepended a leading hyphen to PascalCase strings
 *          ("HelloWorld" → "-hello-world"). The regex /[A-Z]/g replaced every
 *          uppercase letter with `-${lower}` regardless of position, so the
 *          leading character always got a prepended hyphen.
 *          Fix: pass offset to the replacer and omit the hyphen when offset===0.
 *
 *   Bug-2: basicSchemas.positiveInt was z.number().int().min(0), which accepts 0.
 *          Zero is not a positive integer, so page=0 / limit=0 / maxStringLength=0
 *          all passed where they should not. Cascading issue: testConfig.retries
 *          used positiveInt with .default(0) — with the corrected min(1) schema,
 *          retries:0 would have FAILED its own schema. Fixed both: positiveInt →
 *          min(1); testConfig.retries → nonNegativeInt (allows 0).
 */

import {
  strings,
  validation,
  arrays,
  objects,
  asyncCommon,
  types,
  conditionals,
  environment,
} from '../../dist/lib/utils/commonPatterns.js';

import {
  basicSchemas,
  objectSchemas,
  securitySchemas,
  schemaUtils,
  validationHelpers,
} from '../../dist/lib/utils/validationSchemas.js';

import {
  createReExport,
  mergeExports,
  createConditionalExports,
  createNamespace,
  commonReExports,
  barrelExports,
} from '../../dist/lib/utils/importExportUtils.js';

import {
  logger,
  log,
  LogLevel,
} from '../../dist/lib/utils/structuredLogger.js';

import {
  TestIsolationManager,
  testIsolation,
  withIsolation,
  SessionCleaner,
  createTestIsolation,
} from '../../dist/lib/utils/testIsolationFramework.js';

import {
  setupTestIsolation,
  teardownTestIsolation,
  backupEnvironment,
  restoreEnvironment,
  registerMockRestore,
  restoreAllMocks,
  trackServer,
  closeAllServers,
  trackDbConnection,
  closeAllDbConnections,
} from '../../dist/lib/testIsolation.js';

// ---------------------------------------------------------------------------
// Bug-1 regression: strings.kebabCase leading-hyphen fix
// ---------------------------------------------------------------------------

describe('Bug-1 regression: strings.kebabCase leading hyphen', () => {
  it('PascalCase "HelloWorld" converts to "hello-world" (not "-hello-world")', () => {
    expect(strings.kebabCase('HelloWorld')).toBe('hello-world');
  });

  it('all-uppercase "ABC" converts to "a-b-c" (not "-a-b-c")', () => {
    expect(strings.kebabCase('ABC')).toBe('a-b-c');
  });

  it('single uppercase letter "A" converts to "a" (no leading hyphen)', () => {
    expect(strings.kebabCase('A')).toBe('a');
  });

  it('camelCase "myVariable" still converts to "my-variable"', () => {
    expect(strings.kebabCase('myVariable')).toBe('my-variable');
  });

  it('already lowercase string is unchanged', () => {
    expect(strings.kebabCase('alreadylower')).toBe('alreadylower');
  });

  it('empty string returns empty string', () => {
    expect(strings.kebabCase('')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// Bug-2 regression: basicSchemas.positiveInt now rejects 0
// ---------------------------------------------------------------------------

describe('Bug-2 regression: basicSchemas.positiveInt rejects 0', () => {
  it('positiveInt rejects 0 (was incorrectly accepted before fix)', () => {
    expect(basicSchemas.positiveInt.safeParse(0).success).toBe(false);
  });

  it('positiveInt accepts 1', () => {
    expect(basicSchemas.positiveInt.safeParse(1).success).toBe(true);
  });

  it('positiveInt rejects negative numbers', () => {
    expect(basicSchemas.positiveInt.safeParse(-1).success).toBe(false);
  });

  it('nonNegativeInt still accepts 0', () => {
    expect(basicSchemas.nonNegativeInt.safeParse(0).success).toBe(true);
  });

  it('pagination rejects page=0 after fix (was accepted before)', () => {
    const result = objectSchemas.pagination.safeParse({ page: 0, limit: 10 });
    expect(result.success).toBe(false);
  });

  it('pagination accepts page=1', () => {
    const result = objectSchemas.pagination.safeParse({ page: 1, limit: 10 });
    expect(result.success).toBe(true);
  });

  it('testConfig retries=0 still accepted (uses nonNegativeInt after cascading fix)', () => {
    const result = objectSchemas.testConfig.safeParse({
      testName: 'my-test',
      timeout: 5000,
      retries: 0,
    });
    expect(result.success).toBe(true);
  });

  it('testConfig retries=3 accepted', () => {
    const result = objectSchemas.testConfig.safeParse({
      testName: 'my-test',
      timeout: 5000,
      retries: 3,
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// commonPatterns — additional coverage
// ---------------------------------------------------------------------------

describe('commonPatterns.strings', () => {
  it('camelCase converts snake_case', () => {
    expect(strings.camelCase('hello_world')).toBe('helloWorld');
  });

  it('capitalize uppercases first letter', () => {
    expect(strings.capitalize('hello')).toBe('Hello');
  });

  it('truncate shortens long strings', () => {
    expect(strings.truncate('abcdefghij', 6)).toBe('abc...');
  });

  it('truncate leaves short strings unchanged', () => {
    expect(strings.truncate('ab', 10)).toBe('ab');
  });
});

describe('commonPatterns.validation', () => {
  it('isDefined returns false for null', () => {
    expect(validation.isDefined(null)).toBe(false);
  });

  it('isDefined returns false for undefined', () => {
    expect(validation.isDefined(undefined)).toBe(false);
  });

  it('isDefined returns true for 0', () => {
    expect(validation.isDefined(0)).toBe(true);
  });

  it('nonEmpty returns false for whitespace-only string', () => {
    expect(validation.nonEmpty('   ')).toBe(false);
  });

  it('hasElements returns true for non-empty array', () => {
    expect(validation.hasElements([1])).toBe(true);
  });

  it('hasElements returns false for empty array', () => {
    expect(validation.hasElements([])).toBe(false);
  });

  it('inRange returns true when in range', () => {
    expect(validation.inRange(5, 1, 10)).toBe(true);
  });

  it('inRange returns false when out of range', () => {
    expect(validation.inRange(11, 1, 10)).toBe(false);
  });
});

describe('commonPatterns.arrays', () => {
  it('unique removes duplicates', () => {
    expect(arrays.unique([1, 2, 2, 3])).toEqual([1, 2, 3]);
  });

  it('groupBy groups by key', () => {
    const input = [{ type: 'a' }, { type: 'b' }, { type: 'a' }];
    const grouped = arrays.groupBy(input, 'type');
    expect(grouped['a'].length).toBe(2);
    expect(grouped['b'].length).toBe(1);
  });
});

describe('commonPatterns.objects', () => {
  it('clone creates deep copy', () => {
    const orig = { a: { b: 1 } };
    const cloned = objects.clone(orig);
    cloned.a.b = 99;
    expect(orig.a.b).toBe(1);
  });

  it('pick selects specified keys', () => {
    expect(objects.pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('omit removes specified keys', () => {
    expect(objects.omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 });
  });
});

// ---------------------------------------------------------------------------
// validationSchemas — additional coverage
// ---------------------------------------------------------------------------

describe('validationSchemas.basicSchemas', () => {
  it('safeString sanitizes input', () => {
    const r = basicSchemas.safeString.safeParse('hello');
    expect(r.success).toBe(true);
    expect(r.data).toBe('hello');
  });

  it('port rejects out-of-range', () => {
    expect(basicSchemas.port.safeParse(99999).success).toBe(false);
  });

  it('port accepts valid port', () => {
    expect(basicSchemas.port.safeParse(3000).success).toBe(true);
  });

  it('timeout rejects < 1000', () => {
    expect(basicSchemas.timeout.safeParse(999).success).toBe(false);
  });

  it('securityLevel accepts valid values', () => {
    expect(basicSchemas.securityLevel.safeParse('high').success).toBe(true);
  });
});

describe('validationSchemas.validationHelpers', () => {
  it('validateWithErrors returns success for valid data', () => {
    const r = validationHelpers.validateWithErrors(basicSchemas.safeString, 'hello');
    expect(r.success).toBe(true);
    expect(r.data).toBe('hello');
  });

  it('validateWithErrors returns errors for invalid data', () => {
    const r = validationHelpers.validateWithErrors(basicSchemas.port, 99999);
    expect(r.success).toBe(false);
    expect(r.errors).toBeDefined();
  });

  it('createValidator throws on invalid input', () => {
    const validate = validationHelpers.createValidator(basicSchemas.port);
    expect(() => validate(99999)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// importExportUtils
// ---------------------------------------------------------------------------

describe('importExportUtils', () => {
  it('createReExport returns the same exports object', () => {
    const exp = { a: 1, b: 2 };
    expect(createReExport(exp, 'mod')).toBe(exp);
  });

  it('mergeExports combines multiple objects', () => {
    expect(mergeExports({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('createConditionalExports returns exports when condition true', () => {
    expect(createConditionalExports({ x: 1 }, true)).toEqual({ x: 1 });
  });

  it('createConditionalExports returns empty object when condition false', () => {
    expect(createConditionalExports({ x: 1 }, false)).toEqual({});
  });

  it('createNamespace prefixes all keys', () => {
    const ns = createNamespace('pfx', { a: 1 });
    expect(ns['pfx.a']).toBe(1);
  });

  it('commonReExports.reExportAll extracts only functions', () => {
    const mod = { fn: () => {}, num: 42 };
    const out = commonReExports.reExportAll(mod);
    expect(typeof out.fn).toBe('function');
    expect('num' in out).toBe(false);
  });

  it('commonReExports.reExportNamed picks named exports', () => {
    const mod = { a: 1, b: 2, c: 3 };
    const out = commonReExports.reExportNamed(mod, ['a', 'c']);
    expect(out).toEqual({ a: 1, c: 3 });
  });

  it('barrelExports.categorized flattens categories', () => {
    const out = barrelExports.categorized({ cat1: { x: 1 }, cat2: { y: 2 } });
    expect(out).toEqual({ x: 1, y: 2 });
  });
});

// ---------------------------------------------------------------------------
// structuredLogger
// ---------------------------------------------------------------------------

describe('structuredLogger', () => {
  beforeEach(() => {
    log.setLevel(LogLevel.SILENT);
    log.clearLogs();
  });

  afterAll(() => {
    log.setLevel(LogLevel.SILENT);
    log.clearLogs();
  });

  it('logs are captured when level matches', () => {
    log.setLevel(LogLevel.DEBUG);
    logger.debug('test', {}, 'mod');
    log.setLevel(LogLevel.SILENT);
    expect(log.getLogs().length).toBeGreaterThan(0);
  });

  it('logs are NOT captured when level is SILENT', () => {
    log.setLevel(LogLevel.SILENT);
    logger.info('ignored');
    expect(log.getLogs().length).toBe(0);
  });

  it('clearLogs empties the buffer', () => {
    log.setLevel(LogLevel.DEBUG);
    logger.info('msg');
    log.setLevel(LogLevel.SILENT);
    log.clearLogs();
    expect(log.getLogs().length).toBe(0);
  });

  it('getLogs filters by module', () => {
    log.setLevel(LogLevel.DEBUG);
    logger.debug('msg1', {}, 'modA');
    logger.debug('msg2', {}, 'modB');
    log.setLevel(LogLevel.SILENT);
    const modA = log.getLogs(undefined, 'modA');
    expect(modA.every((l: any) => l.module === 'modA')).toBe(true);
  });

  it('getStats counts by level', () => {
    log.setLevel(LogLevel.DEBUG);
    logger.debug('d');
    logger.warn('w');
    log.setLevel(LogLevel.SILENT);
    const stats = log.getStats();
    expect(stats.total).toBeGreaterThanOrEqual(2);
    expect('DEBUG' in stats.byLevel || 'WARN' in stats.byLevel).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// testIsolationFramework
// ---------------------------------------------------------------------------

describe('TestIsolationManager', () => {
  it('addCleanup + reset runs cleanup function', () => {
    const mgr = new TestIsolationManager();
    let ran = false;
    mgr.addCleanup(() => { ran = true; });
    mgr.reset();
    expect(ran).toBe(true);
  });

  it('startMemoryTracking sets currentTest', () => {
    const mgr = new TestIsolationManager();
    mgr.startMemoryTracking('my-test');
    expect(mgr.getCurrentTest()?.testName).toBe('my-test');
    mgr.endMemoryTracking();
  });

  it('endMemoryTracking returns metrics and clears currentTest', () => {
    const mgr = new TestIsolationManager();
    mgr.startMemoryTracking('t');
    const metrics = mgr.endMemoryTracking();
    expect(metrics).not.toBeNull();
    expect(typeof metrics?.duration).toBe('number');
    expect(mgr.getCurrentTest()).toBeNull();
  });

  it('endMemoryTracking returns null when not tracking', () => {
    const mgr = new TestIsolationManager();
    expect(mgr.endMemoryTracking()).toBeNull();
  });

  it('trackResource increments resource count', () => {
    const mgr = new TestIsolationManager();
    mgr.startMemoryTracking('t');
    mgr.trackResource('server', 'srv1', async () => {});
    expect(mgr.getResourceCount()).toBe(1);
    mgr.endMemoryTracking();
  });

  it('untrackResource removes resource', () => {
    const mgr = new TestIsolationManager();
    mgr.trackResource('db', 'db1', async () => {});
    expect(mgr.untrackResource('db', 'db1')).toBe(true);
    expect(mgr.getResourceCount()).toBe(0);
  });

  it('addCleanupTask runs on runCleanup', async () => {
    const mgr = new TestIsolationManager();
    let cleaned = false;
    mgr.addCleanupTask(async () => { cleaned = true; });
    await mgr.runCleanup();
    expect(cleaned).toBe(true);
  });

  it('getTestHistory records completed tests', () => {
    const mgr = new TestIsolationManager();
    mgr.startMemoryTracking('hist-test');
    mgr.endMemoryTracking();
    expect(mgr.getTestHistory().length).toBe(1);
    expect(mgr.getTestHistory()[0].testName).toBe('hist-test');
  });

  it('clearHistory empties history', () => {
    const mgr = new TestIsolationManager();
    mgr.startMemoryTracking('x');
    mgr.endMemoryTracking();
    mgr.clearHistory();
    expect(mgr.getTestHistory().length).toBe(0);
  });
});

describe('withIsolation', () => {
  it('returns the value produced by the callback', async () => {
    const result = await withIsolation(async (_mgr) => 'hello');
    expect(result).toBe('hello');
  });

  it('runs cleanup tasks registered during execution', async () => {
    let cleaned = false;
    await withIsolation(async (mgr) => {
      mgr.addCleanupTask(async () => { cleaned = true; });
    });
    expect(cleaned).toBe(true);
  });
});

describe('SessionCleaner', () => {
  it('cleanupSessions deletes all sessions in store', async () => {
    const deleted: string[] = [];
    const store = {
      sessions: new Set(['s1', 's2']),
      delete: async (id: string) => { deleted.push(id); },
    };
    const cleaner = new SessionCleaner(store);
    await cleaner.cleanupSessions();
    expect(deleted.sort()).toEqual(['s1', 's2']);
  });

  it('cleanupSessions accepts explicit list', async () => {
    const deleted: string[] = [];
    const store = {
      sessions: new Set(['s1', 's2', 's3']),
      delete: async (id: string) => { deleted.push(id); },
    };
    const cleaner = new SessionCleaner(store);
    await cleaner.cleanupSessions(['s1']);
    expect(deleted).toEqual(['s1']);
  });
});

// ---------------------------------------------------------------------------
// testIsolation compat shim
// ---------------------------------------------------------------------------

describe('testIsolation shim — environment', () => {
  it('backupEnvironment + restoreEnvironment round-trips env var', () => {
    process.env.__ROUND18_TEST__ = 'before';
    backupEnvironment();
    process.env.__ROUND18_TEST__ = 'after';
    restoreEnvironment();
    expect(process.env.__ROUND18_TEST__).toBe('before');
    delete process.env.__ROUND18_TEST__;
  });
});

describe('testIsolation shim — mock restore', () => {
  it('registerMockRestore + restoreAllMocks calls the restore function', () => {
    let called = false;
    registerMockRestore(() => { called = true; });
    restoreAllMocks();
    expect(called).toBe(true);
  });
});

describe('testIsolation shim — servers', () => {
  it('trackServer + closeAllServers closes tracked servers', async () => {
    let closed = false;
    const mockServer = {
      close: (cb: (err?: Error) => void) => { closed = true; cb(); },
    };
    setupTestIsolation();
    trackServer(mockServer);
    await closeAllServers();
    expect(closed).toBe(true);
  });
});

describe('testIsolation shim — db connections', () => {
  it('trackDbConnection + closeAllDbConnections calls close()', async () => {
    let closed = false;
    const mockDb = { close: async () => { closed = true; } };
    setupTestIsolation();
    trackDbConnection(mockDb);
    await closeAllDbConnections();
    expect(closed).toBe(true);
  });

  it('closeAllDbConnections skips connections without close()', async () => {
    setupTestIsolation();
    trackDbConnection({ noClose: true });
    await expect(closeAllDbConnections()).resolves.toBeUndefined();
  });
});

describe('testIsolation shim — teardown', () => {
  it('teardownTestIsolation runs without throwing', async () => {
    setupTestIsolation();
    await expect(teardownTestIsolation()).resolves.toBeUndefined();
  });
});
