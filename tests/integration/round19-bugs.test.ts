/**
 * Round 19 — final dogfooding sweep (no new bugs found)
 *
 * Modules probed and verified clean:
 *   lib/errorHandling/errorLogging.ts      — withErrorLogging, safeExecute, withAsyncErrorLogging, safeAsyncExecute
 *   lib/errorHandling/advancedWrappers.ts  — createDatabaseErrorWrapper, createApiErrorWrapper,
 *                                            createBatchErrorWrapper, createTimeoutErrorWrapper
 *   lib/waitForCondition.ts               — waitForCondition
 *   lib/memoryPressure.ts                 — MemoryPressureMonitor
 *   lib/logging/coreWrapper.ts + advancedWrappers.ts — withLogging, wrapObject
 *   lib/mockSystem.ts                     — mockRegistry, mockAPI, registerDefaultMocks
 *   lib/dataUtils.ts                      — mockModels, sendEmail
 *   lib/envUtils.ts                       — testEnv, offlineMode, testHelpers shim
 *   lib/loggingDecorators.ts              — re-export shim (verified loads)
 *   lib/streamingValidatorModern.ts       — re-export shim (verified loads)
 *
 * No bugs required fixes. All tests are regression / green-path coverage.
 */

import {
  withErrorLogging,
  safeExecute,
  withAsyncErrorLogging,
  safeAsyncExecute,
} from '../../dist/lib/errorHandling/errorLogging.js';

import {
  createDatabaseErrorWrapper,
  createApiErrorWrapper,
  createBatchErrorWrapper,
  createTimeoutErrorWrapper,
} from '../../dist/lib/errorHandling/advancedWrappers.js';

import { waitForCondition } from '../../dist/lib/waitForCondition.js';
import { MemoryPressureMonitor } from '../../dist/lib/memoryPressure.js';

import { withLogging } from '../../dist/lib/logging/coreWrapper.js';
import { wrapObject } from '../../dist/lib/logging/advancedWrappers.js';

import { mockRegistry, mockAPI, registerDefaultMocks } from '../../dist/lib/mockSystem.js';

import { mockModels, sendEmail } from '../../dist/lib/dataUtils.js';

// ---------------------------------------------------------------------------
// errorHandling/errorLogging — withErrorLogging
// ---------------------------------------------------------------------------

describe('errorHandling/errorLogging — withErrorLogging', () => {
  it('returns the function result on success', () => {
    expect(withErrorLogging(() => 42, 'ctx')).toBe(42);
  });

  it('re-throws the error on failure', () => {
    expect(() =>
      withErrorLogging(() => { throw new Error('boom'); }, 'ctx')
    ).toThrow('boom');
  });

  it('works with string return values', () => {
    expect(withErrorLogging(() => 'hello', 'ctx')).toBe('hello');
  });
});

// ---------------------------------------------------------------------------
// errorHandling/errorLogging — safeExecute
// ---------------------------------------------------------------------------

describe('errorHandling/errorLogging — safeExecute', () => {
  it('returns the result on success', () => {
    expect(safeExecute(() => 'ok')).toBe('ok');
  });

  it('returns null when the function throws', () => {
    expect(safeExecute(() => { throw new Error('fail'); })).toBeNull();
  });

  it('returns null for errors without a context argument', () => {
    expect(safeExecute(() => { throw new Error('silent'); })).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// errorHandling/errorLogging — async variants
// ---------------------------------------------------------------------------

describe('errorHandling/errorLogging — withAsyncErrorLogging', () => {
  it('resolves with the async result', async () => {
    expect(await withAsyncErrorLogging(async () => 'async-ok', 'ctx')).toBe('async-ok');
  });

  it('re-throws the rejection', async () => {
    await expect(
      withAsyncErrorLogging(async () => { throw new Error('async-boom'); }, 'ctx')
    ).rejects.toThrow('async-boom');
  });
});

describe('errorHandling/errorLogging — safeAsyncExecute', () => {
  it('resolves with the async result on success', async () => {
    expect(await safeAsyncExecute(async () => 99)).toBe(99);
  });

  it('resolves to null when async function rejects', async () => {
    expect(
      await safeAsyncExecute(async () => { throw new Error('async-fail'); })
    ).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// errorHandling/advancedWrappers — database
// ---------------------------------------------------------------------------

describe('errorHandling/advancedWrappers — createDatabaseErrorWrapper', () => {
  it('passes through successful results', async () => {
    const fn = createDatabaseErrorWrapper(async () => 'db-result');
    expect(await fn()).toBe('db-result');
  });

  it('wraps ECONNREFUSED as CONNECTION error', async () => {
    const fn = createDatabaseErrorWrapper(async () => {
      const e: any = new Error('connect fail');
      e.code = 'ECONNREFUSED';
      throw e;
    });
    await expect(fn()).rejects.toMatchObject({ errorType: 'CONNECTION' });
  });

  it('wraps UNIQUE_VIOLATION as CONSTRAINT error', async () => {
    const fn = createDatabaseErrorWrapper(async () => {
      const e: any = new Error('duplicate');
      e.code = 'UNIQUE_VIOLATION';
      throw e;
    });
    await expect(fn()).rejects.toMatchObject({ errorType: 'CONSTRAINT' });
  });

  it('wraps ETIMEDOUT as TIMEOUT error', async () => {
    const fn = createDatabaseErrorWrapper(async () => {
      const e: any = new Error('timed out');
      e.code = 'ETIMEDOUT';
      throw e;
    });
    await expect(fn()).rejects.toMatchObject({ errorType: 'TIMEOUT' });
  });

  it('passes through unknown errors unchanged', async () => {
    const fn = createDatabaseErrorWrapper(async () => { throw new Error('unknown'); });
    await expect(fn()).rejects.toThrow('unknown');
  });
});

// ---------------------------------------------------------------------------
// errorHandling/advancedWrappers — API
// ---------------------------------------------------------------------------

describe('errorHandling/advancedWrappers — createApiErrorWrapper', () => {
  it('passes through successful results', async () => {
    const fn = createApiErrorWrapper(async () => ({ data: 42 }));
    expect(await fn()).toEqual({ data: 42 });
  });

  it('wraps errors with response object as HTTP error', async () => {
    const fn = createApiErrorWrapper(async () => {
      const e: any = new Error('not found');
      e.response = { status: 404, statusText: 'Not Found' };
      throw e;
    });
    const rejection = await fn().catch((e: any) => e);
    expect(rejection.errorType).toBe('HTTP');
    expect(rejection.statusCode).toBe(404);
  });

  it('wraps ECONNRESET as RATE_LIMIT error', async () => {
    const fn = createApiErrorWrapper(async () => {
      const e: any = new Error('rate limit exceeded');
      e.code = 'ECONNRESET';
      throw e;
    });
    await expect(fn()).rejects.toMatchObject({ errorType: 'RATE_LIMIT' });
  });

  it('wraps timeout messages as TIMEOUT error', async () => {
    const fn = createApiErrorWrapper(async () => {
      const e: any = new Error('request timeout occurred');
      e.code = 'ETIMEDOUT';
      throw e;
    });
    await expect(fn()).rejects.toMatchObject({ errorType: 'TIMEOUT' });
  });
});

// ---------------------------------------------------------------------------
// errorHandling/advancedWrappers — batch and timeout
// ---------------------------------------------------------------------------

describe('errorHandling/advancedWrappers — createBatchErrorWrapper', () => {
  it('processes all items and returns results + processedCount', async () => {
    const fn = createBatchErrorWrapper(async (items: number[]) => items.map(x => x * 2));
    const result = await fn([1, 2, 3]);
    expect(result.results).toEqual([2, 4, 6]);
    expect(result.processedCount).toBe(3);
    expect(result.errors).toEqual([]);
  });
});

describe('errorHandling/advancedWrappers — createTimeoutErrorWrapper', () => {
  it('returns result when function completes before timeout', async () => {
    const fn = createTimeoutErrorWrapper(async () => 'fast', { timeout: 500 });
    expect(await fn()).toBe('fast');
  });

  it('throws TIMEOUT error when function exceeds timeout', async () => {
    const fn = createTimeoutErrorWrapper(async () => {
      await new Promise(r => setTimeout(r, 300));
      return 'slow';
    }, { timeout: 50 });
    const err: any = await fn().catch(e => e);
    expect(err.errorType).toBe('TIMEOUT');
  });
});

// ---------------------------------------------------------------------------
// waitForCondition
// ---------------------------------------------------------------------------

describe('waitForCondition', () => {
  it('resolves immediately when predicate returns true', async () => {
    let calls = 0;
    await waitForCondition(() => { calls++; return true; });
    expect(calls).toBe(1);
  });

  it('waits until predicate becomes true', async () => {
    let count = 0;
    await waitForCondition(() => { count++; return count >= 3; }, { timeoutMs: 500, intervalMs: 10 });
    expect(count).toBeGreaterThanOrEqual(3);
  });

  it('throws when timeout is exceeded', async () => {
    await expect(
      waitForCondition(() => false, { timeoutMs: 100, intervalMs: 10 })
    ).rejects.toThrow();
  });

  it('works with async predicates', async () => {
    let n = 0;
    await waitForCondition(async () => { n++; return n >= 2; }, { timeoutMs: 300, intervalMs: 10 });
    expect(n).toBeGreaterThanOrEqual(2);
  });

  it('continues polling if predicate throws', async () => {
    let attempts = 0;
    await waitForCondition(() => {
      attempts++;
      if (attempts < 3) throw new Error('not ready');
      return true;
    }, { timeoutMs: 500, intervalMs: 10 });
    expect(attempts).toBeGreaterThanOrEqual(3);
  });
});

// ---------------------------------------------------------------------------
// MemoryPressureMonitor
// ---------------------------------------------------------------------------

describe('MemoryPressureMonitor', () => {
  it('is not active immediately after construction', () => {
    const mon = new MemoryPressureMonitor();
    expect(mon.isActive()).toBe(false);
    mon.destroy();
  });

  it('becomes active after start()', () => {
    const mon = new MemoryPressureMonitor({ checkInterval: 60000 });
    mon.start();
    expect(mon.isActive()).toBe(true);
    mon.destroy();
  });

  it('becomes inactive after stop()', () => {
    const mon = new MemoryPressureMonitor({ checkInterval: 60000 });
    mon.start();
    mon.stop();
    expect(mon.isActive()).toBe(false);
  });

  it('returns memory stats with expected shape', () => {
    const mon = new MemoryPressureMonitor();
    const stats = mon.getCurrentStats();
    expect(typeof stats.used).toBe('number');
    expect(typeof stats.total).toBe('number');
    expect(typeof stats.usage).toBe('number');
    expect(typeof stats.timestamp).toBe('number');
    expect(stats.usage).toBeGreaterThanOrEqual(0);
    mon.destroy();
  });

  it('getLastStats returns undefined before first check', () => {
    const mon = new MemoryPressureMonitor();
    expect(mon.getLastStats()).toBeUndefined();
    mon.destroy();
  });

  it('getConfig returns the configured values', () => {
    const mon = new MemoryPressureMonitor({ checkInterval: 9999 });
    expect(mon.getConfig().checkInterval).toBe(9999);
    mon.destroy();
  });

  it('start() is idempotent (calling twice does not double-start)', () => {
    const mon = new MemoryPressureMonitor({ checkInterval: 60000 });
    mon.start();
    mon.start();
    expect(mon.isActive()).toBe(true);
    mon.destroy();
  });

  it('emits "started" event on start', done => {
    const mon = new MemoryPressureMonitor({ checkInterval: 60000 });
    mon.on('started', () => { mon.destroy(); done(); });
    mon.start();
  });

  it('emits "stopped" event on stop', done => {
    const mon = new MemoryPressureMonitor({ checkInterval: 60000 });
    mon.start();
    mon.on('stopped', () => { mon.destroy(); done(); });
    mon.stop();
  });
});

// ---------------------------------------------------------------------------
// logging/coreWrapper — withLogging
// ---------------------------------------------------------------------------

describe('logging/coreWrapper — withLogging', () => {
  it('returns the same result as the original function', () => {
    const fn = withLogging((x: number, y: number) => x + y, 'add', { logEntry: false, logExit: false });
    expect(fn(3, 4)).toBe(7);
  });

  it('re-throws errors from wrapped function', () => {
    const fn = withLogging(() => { throw new Error('wrapped-fail'); }, 'errFn', { logEntry: false, logExit: false, logErrors: false });
    expect(() => fn()).toThrow('wrapped-fail');
  });

  it('works with async functions', async () => {
    const fn = withLogging(async (x: number) => x * 10, 'asyncFn', { logEntry: false, logExit: false });
    expect(await fn(5)).toBe(50);
  });
});

// ---------------------------------------------------------------------------
// logging/advancedWrappers — wrapObject
// ---------------------------------------------------------------------------

describe('logging/advancedWrappers — wrapObject', () => {
  it('wraps all functions in an object and preserves return values', () => {
    const obj = {
      double: (x: number) => x * 2,
      inc: (x: number) => x + 1,
    };
    const wrapped = wrapObject(obj, { logEntry: false, logExit: false });
    expect(wrapped.double(5)).toBe(10);
    expect(wrapped.inc(5)).toBe(6);
  });
});

// ---------------------------------------------------------------------------
// mockSystem — mockRegistry + mockAPI
// ---------------------------------------------------------------------------

describe('mockSystem — mockRegistry and mockAPI', () => {
  beforeAll(() => {
    registerDefaultMocks();
  });

  it('registerDefaultMocks registers axios, winston, mongoose', () => {
    const list = mockRegistry.list();
    expect(list).toContain('axios');
    expect(list).toContain('winston');
    expect(list).toContain('mongoose');
  });

  it('has() returns true for registered mock', () => {
    expect(mockRegistry.has('axios')).toBe(true);
  });

  it('has() returns false for unknown mock', () => {
    expect(mockRegistry.has('__nonexistent__')).toBe(false);
  });

  it('get() returns a non-null object for axios', async () => {
    const axiosMock = await mockRegistry.get('axios');
    expect(axiosMock).toBeDefined();
    expect(typeof axiosMock).toBe('object');
  });

  it('get() returns winston with createLogger function', async () => {
    const winstonMock = await mockRegistry.get('winston');
    expect(typeof winstonMock?.createLogger).toBe('function');
  });

  it('get() returns winston with transport classes', async () => {
    const winstonMock = await mockRegistry.get('winston');
    expect(winstonMock?.transports?.Console).toBeDefined();
    expect(winstonMock?.transports?.File).toBeDefined();
  });

  it('winston createLogger returns a logger with standard methods', async () => {
    const winstonMock = await mockRegistry.get('winston');
    const logger = winstonMock.createLogger({});
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
  });

  it('mockAPI.module registers a custom mock', async () => {
    mockAPI.module('__testlib19__', () => ({ version: 19 }));
    const mock = await mockRegistry.get('__testlib19__');
    expect(mock?.version).toBe(19);
  });

  it('getSync() returns cached instance', () => {
    const sync = mockRegistry.getSync('axios');
    expect(typeof sync).toBe('object');
  });
});

// ---------------------------------------------------------------------------
// dataUtils — mockModels
// ---------------------------------------------------------------------------

describe('dataUtils — mockModels', () => {
  it('exports an object', () => {
    expect(mockModels).toBeDefined();
    expect(typeof mockModels).toBe('object');
  });

  it('has createMockModel factory', () => {
    expect(typeof mockModels.createMockModel).toBe('function');
  });

  it('has resetAllCollections', () => {
    expect(typeof mockModels.resetAllCollections).toBe('function');
  });

  it('has built-in ApiKey model', () => {
    expect(mockModels.ApiKey).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// dataUtils — sendEmail (positional signature)
// ---------------------------------------------------------------------------

describe('dataUtils — sendEmail', () => {
  it('returns a response object for a valid recipient', () => {
    const result = sendEmail('test@example.com', 'Subject', 'Body');
    expect(typeof result).toBe('object');
    expect(result.success).toBe(true);
  });

  it('returns failure for an invalid email address', () => {
    const result = sendEmail('not-an-email', 'Subject', 'Body');
    expect(result.success).toBe(false);
    expect(result.error).toBe('INVALID_RECIPIENT');
  });

  it('includes timestamp in response', () => {
    const result = sendEmail('user@example.com', 'Hi', 'Body');
    expect(result.timestamp).toBeInstanceOf(Date);
  });

  it('successful response has a message id', () => {
    const result = sendEmail('user@example.com', 'Hi', 'Body');
    expect(typeof (result as any).id).toBe('string');
  });
});
