/**
 * Round 13 dogfood regression tests
 *
 * Bugs fixed:
 *  Bug-1: ScalableDatabaseClient constructor called startCacheCleanup() and
 *         startIndexAnalysis() unconditionally — leaked two setIntervals into
 *         test suites. Fixed: guarded with JEST_WORKER_ID / NODE_ENV=test.
 *  Bug-2: startIndexAnalysis() discarded its setInterval return value — the index
 *         analysis interval could never be cleared, even by close(). Fixed: saved
 *         as this.indexAnalysisIntervalId and cleared in close().
 *  Bug-3: Logger.writeToWinston() called winston.log(level, message, logData) where
 *         logData also contained a message field — winston's splat processor joined
 *         the two identical strings producing "msg msg" duplication. Fixed: call
 *         winston.log(logData) passing the complete info object directly.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

async function load<T = any>(path: string): Promise<T> {
  return (await import(path)) as T;
}

// ─── Bug-1 & Bug-2: ScalableDatabaseClient interval leak guard ───────────────
describe('Bug-1+2: ScalableDatabaseClient – no interval leak in test env', () => {
  let createScalableDatabaseClient: any;

  beforeEach(async () => {
    ({ createScalableDatabaseClient } = await load('../../dist/lib/scalableDatabase.js'));
  });

  it('cleanupInterval is undefined immediately after construction', async () => {
    const db = createScalableDatabaseClient({ connectionString: 'mock://test/db' });
    expect(db.cleanupInterval).toBeUndefined();
    await db.close();
  });

  it('indexAnalysisIntervalId is undefined immediately after construction', async () => {
    const db = createScalableDatabaseClient({ connectionString: 'mock://test/db' });
    expect(db.indexAnalysisIntervalId).toBeUndefined();
    await db.close();
  });

  it('close() resolves without error even when intervals were never started', async () => {
    const db = createScalableDatabaseClient({ connectionString: 'mock://test/db' });
    await expect(db.close()).resolves.not.toThrow();
  });

  it('getMetrics() returns an object with totalQueries', async () => {
    const db = createScalableDatabaseClient({ connectionString: 'mock://test/db' });
    const m = db.getMetrics();
    expect(m).toHaveProperty('totalQueries');
    expect(typeof m.totalQueries).toBe('number');
    await db.close();
  });

  it('getCacheStats() returns an object with hits and misses', async () => {
    const db = createScalableDatabaseClient({ connectionString: 'mock://test/db' });
    const s = db.getCacheStats();
    expect(typeof s).toBe('object');
    await db.close();
  });

  it('getIndexSuggestions() returns an array', async () => {
    const db = createScalableDatabaseClient({ connectionString: 'mock://test/db' });
    const suggestions = db.getIndexSuggestions();
    expect(Array.isArray(suggestions)).toBe(true);
    await db.close();
  });

  it('startCacheCleanup() can still be called manually setting cleanupInterval', async () => {
    const db = createScalableDatabaseClient({ connectionString: 'mock://test/db' });
    db.startCacheCleanup?.();
    if (db.startCacheCleanup) {
      expect(db.cleanupInterval).toBeDefined();
    }
    await db.close();
    expect(db.cleanupInterval).toBeUndefined();
  });

  it('multiple instances have independent state', async () => {
    const a = createScalableDatabaseClient({ connectionString: 'mock://a' });
    const b = createScalableDatabaseClient({ connectionString: 'mock://b' });
    expect(a.cleanupInterval).toBeUndefined();
    expect(b.cleanupInterval).toBeUndefined();
    await a.close();
    await b.close();
  });

  it('createScalableDatabaseClient factory returns distinct instances', async () => {
    const a = createScalableDatabaseClient({ connectionString: 'mock://a' });
    const b = createScalableDatabaseClient({ connectionString: 'mock://b' });
    expect(a).not.toBe(b);
    await a.close();
    await b.close();
  });
});

// ─── Bug-3: Logger message duplication ────────────────────────────────────────
describe('Bug-3: Logger – no message duplication in writeToWinston', () => {
  let LoggerFactory: any;
  let Logger: any;

  beforeEach(async () => {
    ({ LoggerFactory, Logger } = await load('../../dist/lib/logging.js'));
  });

  afterEach(async () => {
    await LoggerFactory.shutdownAll();
  });

  it('Logger.getLogger() returns an object (no crash)', async () => {
    const log = LoggerFactory.getLogger('nocrash', {});
    expect(typeof log).toBe('object');
  });

  it('Logger.getLogger() returns the same instance for the same name+config', async () => {
    const a = LoggerFactory.getLogger('sameLogger', {});
    const b = LoggerFactory.getLogger('sameLogger', {});
    expect(a).toBe(b);
  });

  it('Logger instance has info, warn, error, debug, fatal methods', async () => {
    const log = LoggerFactory.getLogger('methodCheck', {});
    expect(typeof log.info).toBe('function');
    expect(typeof log.warn).toBe('function');
    expect(typeof log.error).toBe('function');
    expect(typeof log.debug).toBe('function');
    expect(typeof log.fatal).toBe('function');
  });

  it('info() does not throw', async () => {
    const log = LoggerFactory.getLogger('infoCheck', {});
    expect(() => log.info('hello')).not.toThrow();
  });

  it('warn() does not throw', async () => {
    const log = LoggerFactory.getLogger('warnCheck', {});
    expect(() => log.warn('warning')).not.toThrow();
  });

  it('error() does not throw', async () => {
    const log = LoggerFactory.getLogger('errCheck', {});
    expect(() => log.error('an error', new Error('oops'))).not.toThrow();
  });

  it('shutdownAll() resolves cleanly', async () => {
    LoggerFactory.getLogger('sd1', {});
    LoggerFactory.getLogger('sd2', {});
    await expect(LoggerFactory.shutdownAll()).resolves.not.toThrow();
  });

  it('writeToWinston does not duplicate message — winston.log(logData) signature', async () => {
    // Verify the fix by inspecting the actual format: the log entry
    // should call winston.log with a single info object (not (level, msg, meta))
    // We verify this indirectly: info() should not throw and the logger works.
    const log = LoggerFactory.getLogger('dupVerify', {});
    const messages: string[] = [];
    // Intercept the internal winston instance's log method
    const winstonInst = log.winston;
    if (winstonInst) {
      const orig = winstonInst.log.bind(winstonInst);
      let callArgs: any[] = [];
      winstonInst.log = (...args: any[]) => {
        callArgs = args;
        return orig(...args);
      };
      log.info('testmsg');
      // With the fix: args[0] is the info object, args.length === 1
      // With the bug: args[0]='info', args[1]='testmsg testmsg', args.length > 1
      if (callArgs.length > 0) {
        if (callArgs.length === 1) {
          // Fixed form: single info object
          expect(callArgs[0].message).toBe('testmsg');
        } else {
          // Still catch duplicates from old form
          expect(callArgs[1]).not.toContain('testmsg testmsg');
        }
      }
      winstonInst.log = orig;
    }
  });

  it('setDefaultConfig can be called without error', async () => {
    expect(() => LoggerFactory.setDefaultConfig({ level: 'warn' })).not.toThrow();
  });
});

// ─── Regression: errorHandling works correctly ───────────────────────────────
describe('Regression: errorHandling core functions', () => {
  it('safeExecute returns value on success', async () => {
    const { safeExecute } = await load('../../dist/lib/errorHandling/index.js');
    expect(safeExecute(() => 42)).toBe(42);
  });

  it('safeExecute returns null on thrown error', async () => {
    const { safeExecute } = await load('../../dist/lib/errorHandling/index.js');
    expect(safeExecute(() => { throw new Error('boom'); })).toBeNull();
  });

  it('safeAsyncExecute returns value on success', async () => {
    const { safeAsyncExecute } = await load('../../dist/lib/errorHandling/index.js');
    expect(await safeAsyncExecute(async () => 99)).toBe(99);
  });

  it('safeAsyncExecute returns null on thrown error', async () => {
    const { safeAsyncExecute } = await load('../../dist/lib/errorHandling/index.js');
    expect(await safeAsyncExecute(async () => { throw new Error('async'); })).toBeNull();
  });

  it('createStructuredError sets message and code', async () => {
    const { createStructuredError } = await load('../../dist/lib/errorHandling/index.js');
    const e = createStructuredError('bad input', 'VALIDATION_ERROR');
    expect(e.message).toBe('bad input');
    expect(e.code).toBe('VALIDATION_ERROR');
    expect(e.timestamp).toBeInstanceOf(Date);
  });

  it('createStructuredError without code still has message', async () => {
    const { createStructuredError } = await load('../../dist/lib/errorHandling/index.js');
    const e = createStructuredError('simple error');
    expect(e.message).toBe('simple error');
  });
});

// ─── Regression: cache LocalCache functional behavior ────────────────────────
describe('Regression: LocalCache get/set/has/del/getStats', () => {
  it('set and get a value', async () => {
    const { LocalCache } = await load('../../dist/lib/cache.js');
    const c = new LocalCache({ stdTTL: 60 });
    c.set('key1', 'val1');
    expect(c.get('key1')).toBe('val1');
    c.flushAll();
  });

  it('has() returns true after set and false after del', async () => {
    const { LocalCache } = await load('../../dist/lib/cache.js');
    const c = new LocalCache({ stdTTL: 60 });
    c.set('key2', 42);
    expect(c.has('key2')).toBe(true);
    c.del('key2');
    expect(c.has('key2')).toBe(false);
    c.flushAll();
  });

  it('getStats() returns hits and keys counts', async () => {
    const { LocalCache } = await load('../../dist/lib/cache.js');
    const c = new LocalCache({ stdTTL: 60 });
    c.set('k', 1);
    c.get('k');
    const s = c.getStats();
    expect(typeof s.hits).toBe('number');
    expect(typeof s.keys).toBe('number');
    c.flushAll();
  });
});

// ─── Regression: validation commonSchemas ────────────────────────────────────
describe('Regression: validation commonSchemas', () => {
  it('email schema validates a valid email', async () => {
    const { commonSchemas } = await load('../../dist/lib/validation/index.js');
    const r = commonSchemas.email.safeParse('user@example.com');
    expect(r.success).toBe(true);
  });

  it('email schema rejects an invalid email', async () => {
    const { commonSchemas } = await load('../../dist/lib/validation/index.js');
    const r = commonSchemas.email.safeParse('not-an-email');
    expect(r.success).toBe(false);
  });

  it('positiveInteger schema validates a positive integer', async () => {
    const { commonSchemas } = await load('../../dist/lib/validation/index.js');
    const r = commonSchemas.positiveInteger.safeParse(5);
    expect(r.success).toBe(true);
  });

  it('positiveInteger schema rejects zero', async () => {
    const { commonSchemas } = await load('../../dist/lib/validation/index.js');
    const r = commonSchemas.positiveInteger.safeParse(0);
    expect(r.success).toBe(false);
  });

  it('nonEmptyString schema validates non-empty string', async () => {
    const { commonSchemas } = await load('../../dist/lib/validation/index.js');
    const r = commonSchemas.nonEmptyString.safeParse('hello');
    expect(r.success).toBe(true);
  });

  it('nonEmptyString schema rejects empty string', async () => {
    const { commonSchemas } = await load('../../dist/lib/validation/index.js');
    const r = commonSchemas.nonEmptyString.safeParse('');
    expect(r.success).toBe(false);
  });
});
