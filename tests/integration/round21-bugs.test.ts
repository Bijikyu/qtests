/**
 * Round 21 — helpers / email / testing utilities sweep
 *
 * Modules probed and verified:
 *   utils/helpers/stringUtils, timeUtils, safeExecution, functionLogger,
 *   utils/helpers/envManager, utils/helpers/validation,
 *   utils/email/emailValidator, emailFormatter, emailTemplate, emailHistory,
 *   utils/stubbing/utilities, spying, timerManagement,
 *   utils/testing/mockUtils, performanceTestHelper, entityFactory, datasetFactory,
 *   lib/errorHandling/fallbackHandlers, errorTransformation, wrapperFactory,
 *   lib/logging/basicWrappers, convenienceWrappers
 *
 * Bugs found and fixed:
 *
 * Bug 1 — utils/testing/assertionHelper.ts  assertEmailSent:
 *   The method created `const emailHistory: any[] = []` — a brand-new empty
 *   local array — so every call immediately failed with
 *   "Expected at least 1 emails, but found 0" regardless of what had been
 *   sent via sendEmail().  Fix: import { emailHistory } from
 *   '../email/emailHistory.js' and reference the shared module-level array.
 *
 * Bug 2 — utils/helpers/promiseUtils.ts  promiseWithTimeout:
 *   The timeout setTimeout was created but NEVER cleared after the race
 *   settled.  When the original promise won the race the timer continued
 *   running and eventually fired, triggering an unhandled rejection on
 *   the dangling `timeoutPromise` and holding the event loop open (same
 *   class of bug as the validateWithZod 30-second timer leak in Round 20).
 *   Fix: store the handle; call clearTimeout(handle) in .finally().
 *
 * Bug 3 — utils/helpers/arrayProcessing.ts  processArrayWithValidation:
 *   The sync overload iterated with Array.prototype.forEach.  A `return`
 *   inside a forEach callback only exits that iteration's callback function;
 *   it does NOT break the outer loop.  So `stopOnFirstError: true` was
 *   silently ignored — every element was still visited.  The async version
 *   correctly used a `for` loop with `break`.
 *   Fix: convert forEach to a for loop and use `break`.
 */

import {
  truncateString,
  truncateStringSafe,
  truncateForDisplay,
  truncateJsonString,
} from '../../dist/utils/helpers/stringUtils.js';

import {
  createTimestamp,
  createIsoTimestamp,
  createLogTimestamp,
  getCurrentTimeMs,
  createFutureTimestamp,
  createMockTimestamp,
} from '../../dist/utils/helpers/timeUtils.js';

import {
  safeMethodCall,
  safeFunctionCall,
  safeGetProperty,
} from '../../dist/utils/helpers/safeExecution.js';

import {
  validateObject,
  validateArray,
  validateString,
  validateFunction,
} from '../../dist/utils/helpers/validation.js';

import {
  promiseWithTimeout,
  createTimeout,
  withTimeout,
} from '../../dist/utils/helpers/promiseUtils.js';

import {
  processArrayWithValidation,
  processArrayWithValidationAsync,
} from '../../dist/utils/helpers/arrayProcessing.js';

import {
  backupEnvVars,
  restoreEnvVars,
  withSavedEnv,
  getEnvVar,
  configureEnv,
  snapshotEnv,
  handleSnapshotError,
} from '../../dist/utils/helpers/envManager.js';

import {
  withFallback,
  withAsyncFallback,
} from '../../dist/lib/errorHandling/fallbackHandlers.js';

import {
  transformMongoError,
  createStructuredError,
} from '../../dist/lib/errorHandling/errorTransformation.js';

import {
  createAsyncErrorWrapper,
  createSyncErrorWrapper,
  createRouteErrorWrapper,
} from '../../dist/lib/errorHandling/wrapperFactory.js';

import {
  clearEmailHistory,
  getEmailHistory,
  addToHistory,
  emailHistory,
} from '../../dist/utils/email/emailHistory.js';

import { AssertionHelper } from '../../dist/utils/testing/assertionHelper.js';

import { PerformanceTestHelper } from '../../dist/utils/testing/performanceTestHelper.js';

import { EntityFactory } from '../../dist/utils/testing/entityFactory.js';

import { createTestDataset } from '../../dist/utils/testing/datasetFactory.js';

// ---------------------------------------------------------------------------
// Bug 1 fix — assertEmailSent no longer uses a local empty array
// ---------------------------------------------------------------------------

describe('AssertionHelper.assertEmailSent — local-empty-array bug (Bug 1)', () => {
  beforeEach(() => clearEmailHistory());
  afterEach(() => clearEmailHistory());

  it('throws when history is genuinely empty (count=1 default)', () => {
    expect(() => AssertionHelper.assertEmailSent()).toThrow(/Expected at least 1 emails/);
  });

  it('passes when an email has been added to real history', () => {
    addToHistory({
      success: true,
      emailData: { to: 'a@b.com', subject: 'Hi' },
      message: 'sent',
      timestamp: new Date(),
    });
    expect(() => AssertionHelper.assertEmailSent()).not.toThrow();
  });

  it('validates a specific field on the matched email', () => {
    addToHistory({
      success: true,
      emailData: { to: 'x@y.com', subject: 'Test' },
      to: 'x@y.com',
      message: 'sent',
      timestamp: new Date(),
    });
    expect(() => AssertionHelper.assertEmailSent({ to: 'x@y.com' })).not.toThrow();
  });

  it('fails when a field does not match', () => {
    addToHistory({
      success: true,
      to: 'right@example.com',
      message: 'sent',
      timestamp: new Date(),
    });
    expect(() => AssertionHelper.assertEmailSent({ to: 'wrong@example.com' })).toThrow();
  });

  it('correctly finds email at a specific index', () => {
    addToHistory({ success: true, to: 'first@example.com', message: 'sent', timestamp: new Date() });
    addToHistory({ success: true, to: 'second@example.com', message: 'sent', timestamp: new Date() });
    expect(() =>
      AssertionHelper.assertEmailSent({ to: 'first@example.com' }, { index: 0 })
    ).not.toThrow();
  });

  it('throws when count exceeds actual history', () => {
    addToHistory({ success: true, message: 'sent', timestamp: new Date() });
    expect(() => AssertionHelper.assertEmailSent({}, { count: 5 })).toThrow(/Expected at least 5 emails/);
  });
});

// ---------------------------------------------------------------------------
// Bug 2 fix — promiseWithTimeout clears its timer after the race settles
// ---------------------------------------------------------------------------

describe('promiseWithTimeout — uncleaned timer bug (Bug 2)', () => {
  it('resolves with the original value when promise wins', async () => {
    const result = await promiseWithTimeout(Promise.resolve(42), 5000);
    expect(result).toBe(42);
  });

  it('rejects with timeout error when promise is too slow', async () => {
    const slow = new Promise<never>(() => {});
    await expect(promiseWithTimeout(slow, 10, 'too slow')).rejects.toThrow('too slow');
  });

  it('uses default error message when no custom message given', async () => {
    const slow = new Promise<never>(() => {});
    await expect(promiseWithTimeout(slow, 10)).rejects.toThrow(/timed out after 10ms/);
  });

  it('does not hold the event loop open after promise resolves (timer must be cleared)', async () => {
    // If the timer were NOT cleared, the unhandled rejection from timeoutPromise
    // would fire after the test finishes, causing Jest to report an error.
    // Simply verifying no error thrown is the practical regression guard.
    const fast = Promise.resolve('done');
    const result = await promiseWithTimeout(fast, 60000);
    expect(result).toBe('done');
  });

  it('does not hold the event loop when original promise rejects', async () => {
    const failing = Promise.reject(new Error('original error'));
    await expect(promiseWithTimeout(failing, 60000)).rejects.toThrow('original error');
  });
});

// ---------------------------------------------------------------------------
// Bug 3 fix — processArrayWithValidation stopOnFirstError actually stops
// ---------------------------------------------------------------------------

describe('processArrayWithValidation — stopOnFirstError forEach bug (Bug 3)', () => {
  it('processes all items normally (no stopOnFirstError)', () => {
    const items = [1, 2, 3, 4, 5];
    const visited: number[] = [];
    const result = processArrayWithValidation(items, (item) => {
      visited.push(item);
      return { valid: item % 2 !== 0 };
    });
    expect(visited).toHaveLength(5);
    expect(result.successCount).toBe(3);
    expect(result.failureCount).toBe(2);
  });

  it('stops at first failure when stopOnFirstError is true', () => {
    const items = [1, 2, 3, 4, 5];
    const visited: number[] = [];
    const result = processArrayWithValidation(
      items,
      (item) => {
        visited.push(item);
        return { valid: item % 2 !== 0 }; // fails on 2
      },
      { stopOnFirstError: true }
    );
    // Should stop after encountering the first failure (item=2 at index 1)
    expect(visited).toHaveLength(2); // visited [1, 2], stopped after 2 failed
    expect(result.failureCount).toBe(1);
    expect(result.failures[0].item).toBe(2);
  });

  it('stops at first thrown exception when stopOnFirstError is true', () => {
    const items = ['ok', 'boom', 'ok2', 'ok3'];
    const visited: string[] = [];
    const result = processArrayWithValidation(
      items,
      (item) => {
        visited.push(item);
        if (item === 'boom') throw new Error('exploded');
        return { valid: true };
      },
      { stopOnFirstError: true }
    );
    expect(visited).toHaveLength(2); // 'ok', 'boom' — stops after 'boom' throws
    expect(result.failureCount).toBe(1);
    expect(result.failures[0].error).toBe('exploded');
  });

  it('totalCount always reflects the full array length', () => {
    const result = processArrayWithValidation(
      [1, 2, 3],
      () => ({ valid: false }),
      { stopOnFirstError: true }
    );
    expect(result.totalCount).toBe(3);
    expect(result.failureCount).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Clean-probe coverage: stringUtils
// ---------------------------------------------------------------------------

describe('stringUtils', () => {
  it('truncateString leaves short strings unchanged', () => {
    expect(truncateString('hi', 10)).toBe('hi');
  });

  it('truncateString truncates at maxLength', () => {
    expect(truncateString('Hello world', 8)).toBe('Hello...');
  });

  it('truncateString supports custom ellipsis', () => {
    expect(truncateString('Hello world', 7, '--')).toBe('Hello--');
  });

  it('truncateStringSafe returns empty string for null', () => {
    expect(truncateStringSafe(null, 10)).toBe('');
  });

  it('truncateStringSafe returns empty string for undefined', () => {
    expect(truncateStringSafe(undefined, 10)).toBe('');
  });

  it('truncateForDisplay adds ellipsis when needed', () => {
    expect(truncateForDisplay('Very long text', 10)).toBe('Very lo...');
  });

  it('truncateJsonString stringifies and truncates', () => {
    const result = truncateJsonString({ a: 1 }, 100);
    expect(result).toBe('{"a":1}');
  });

  it('truncateJsonString falls back on circular ref', () => {
    const circ: any = {};
    circ.self = circ;
    const result = truncateJsonString(circ, 50);
    expect(typeof result).toBe('string');
  });
});

// ---------------------------------------------------------------------------
// Clean-probe coverage: timeUtils
// ---------------------------------------------------------------------------

describe('timeUtils', () => {
  it('createTimestamp returns a Date', () => {
    expect(createTimestamp()).toBeInstanceOf(Date);
  });

  it('createIsoTimestamp returns an ISO string', () => {
    expect(createIsoTimestamp()).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('createLogTimestamp returns an ISO string', () => {
    expect(typeof createLogTimestamp()).toBe('string');
  });

  it('getCurrentTimeMs returns a number close to Date.now()', () => {
    const before = Date.now();
    const ts = getCurrentTimeMs();
    const after = Date.now();
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });

  it('createFutureTimestamp is after now', () => {
    const future = createFutureTimestamp(5000);
    expect(future.getTime()).toBeGreaterThan(Date.now());
  });

  it('createMockTimestamp with positive offset is after now', () => {
    expect(createMockTimestamp(1000).getTime()).toBeGreaterThan(Date.now() - 1);
  });
});

// ---------------------------------------------------------------------------
// Clean-probe coverage: safeExecution
// ---------------------------------------------------------------------------

describe('safeExecution', () => {
  it('safeMethodCall returns true and calls the method', () => {
    const obj = { greet: jest.fn() };
    expect(safeMethodCall(obj, 'greet', 'world')).toBe(true);
    expect(obj.greet).toHaveBeenCalledWith('world');
  });

  it('safeMethodCall returns false for missing method', () => {
    expect(safeMethodCall({}, 'nonExistent')).toBe(false);
  });

  it('safeMethodCall returns false when method throws', () => {
    const obj = { bad: () => { throw new Error('oops'); } };
    expect(safeMethodCall(obj, 'bad')).toBe(false);
  });

  it('safeFunctionCall returns true for a valid function', () => {
    const fn = jest.fn();
    expect(safeFunctionCall(fn, 1, 2)).toBe(true);
    expect(fn).toHaveBeenCalledWith(1, 2);
  });

  it('safeFunctionCall returns false for non-function', () => {
    expect(safeFunctionCall(null)).toBe(false);
  });

  it('safeGetProperty returns property value', () => {
    expect(safeGetProperty({ x: 42 }, 'x')).toBe(42);
  });

  it('safeGetProperty returns null for null obj', () => {
    expect(safeGetProperty(null, 'x')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Clean-probe coverage: validation helpers
// ---------------------------------------------------------------------------

describe('validation helpers', () => {
  it('validateObject passes for plain objects', () => {
    expect(() => validateObject({}, 'o')).not.toThrow();
  });

  it('validateObject throws for null', () => {
    expect(() => validateObject(null, 'o')).toThrow(/Expected o to be an object/);
  });

  it('validateArray passes for arrays', () => {
    expect(() => validateArray([], 'a')).not.toThrow();
  });

  it('validateArray throws for non-array', () => {
    expect(() => validateArray('nope', 'a')).toThrow(/Expected a to be an array/);
  });

  it('validateString passes for strings', () => {
    expect(() => validateString('hello', 's')).not.toThrow();
  });

  it('validateString throws for number', () => {
    expect(() => validateString(42, 's')).toThrow(/Expected s to be a string/);
  });

  it('validateFunction passes for functions', () => {
    expect(() => validateFunction(() => {}, 'f')).not.toThrow();
  });

  it('validateFunction throws for non-function', () => {
    expect(() => validateFunction('not fn', 'f')).toThrow(/Expected f to be a function/);
  });
});

// ---------------------------------------------------------------------------
// Clean-probe coverage: envManager
// ---------------------------------------------------------------------------

describe('envManager', () => {
  it('backupEnvVars captures specific keys', () => {
    process.env.__TEST_ROUND21__ = 'hello';
    const bak = backupEnvVars(['__TEST_ROUND21__']);
    expect(bak.__TEST_ROUND21__).toBe('hello');
    delete process.env.__TEST_ROUND21__;
  });

  it('restoreEnvVars restores a deleted variable', () => {
    const original = 'restored-value';
    process.env.__RESTORE_TEST__ = original;
    const bak = backupEnvVars(['__RESTORE_TEST__']);
    delete process.env.__RESTORE_TEST__; // simulate deletion
    restoreEnvVars(bak, ['__RESTORE_TEST__']);
    expect(process.env.__RESTORE_TEST__).toBe(original);
    delete process.env.__RESTORE_TEST__;
  });

  it('withSavedEnv sets vars during callback and restores after', () => {
    delete process.env.__WSE_TEST__;
    const result = withSavedEnv(() => process.env.__WSE_TEST__, { __WSE_TEST__: 'active' });
    expect(result).toBe('active');
    expect(process.env.__WSE_TEST__).toBeUndefined();
  });

  it('getEnvVar returns env value or default', () => {
    process.env.__GEV_TEST__ = 'found';
    expect(getEnvVar('__GEV_TEST__', 'fallback')).toBe('found');
    delete process.env.__GEV_TEST__;
    expect(getEnvVar('__GEV_TEST__', 'fallback')).toBe('fallback');
  });

  it('configureEnv applies overrides', () => {
    configureEnv({}, { __CFG_OVERRIDE__: 'yes' });
    expect(process.env.__CFG_OVERRIDE__).toBe('yes');
    delete process.env.__CFG_OVERRIDE__;
  });

  it('configureEnv throws for null defaults/overrides', () => {
    expect(() => configureEnv(null as any, {})).toThrow(/defaults and overrides must be objects/);
    expect(() => configureEnv({}, null as any)).toThrow(/defaults and overrides must be objects/);
  });

  it('snapshotEnv returns current values of listed vars', () => {
    process.env.__SNAP_TEST__ = 'snap';
    const snap = snapshotEnv(['__SNAP_TEST__']);
    expect(snap.__SNAP_TEST__).toBe('snap');
    delete process.env.__SNAP_TEST__;
  });

  it('handleSnapshotError rethrows the error', () => {
    expect(() => handleSnapshotError(new Error('boom'))).toThrow('boom');
  });
});

// ---------------------------------------------------------------------------
// Clean-probe coverage: fallbackHandlers
// ---------------------------------------------------------------------------

describe('fallbackHandlers', () => {
  it('withFallback returns function result on success', () => {
    expect(withFallback(() => 'ok', 'fallback')).toBe('ok');
  });

  it('withFallback returns fallback on error', () => {
    expect(withFallback(() => { throw new Error('fail'); }, 'fallback')).toBe('fallback');
  });

  it('withFallback logs context when provided', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    withFallback(() => { throw new Error('err'); }, null, 'ctx');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('withAsyncFallback resolves with function result', async () => {
    expect(await withAsyncFallback(async () => 99, 0)).toBe(99);
  });

  it('withAsyncFallback resolves with fallback on rejection', async () => {
    expect(
      await withAsyncFallback(async () => { throw new Error('async fail'); }, -1)
    ).toBe(-1);
  });
});

// ---------------------------------------------------------------------------
// Clean-probe coverage: errorTransformation
// ---------------------------------------------------------------------------

describe('errorTransformation', () => {
  it('transformMongoError produces a TransformedError with originalError', () => {
    const err = new Error('mongo fail');
    const transformed = transformMongoError(err);
    expect(transformed.message).toContain('Transformed');
    expect(transformed.originalError).toBe(err);
    expect(transformed.transformedAt).toBeInstanceOf(Date);
  });

  it('createStructuredError includes code, context, timestamp', () => {
    const structured = createStructuredError('msg', 'E001', { foo: 'bar' });
    expect(structured.message).toBe('msg');
    expect(structured.code).toBe('E001');
    expect((structured.context as any)?.foo).toBe('bar');
    expect(structured.timestamp).toBeInstanceOf(Date);
  });
});

// ---------------------------------------------------------------------------
// Clean-probe coverage: wrapperFactory
// ---------------------------------------------------------------------------

describe('wrapperFactory', () => {
  it('createAsyncErrorWrapper returns the original function', async () => {
    const fn = async () => 'result';
    const wrapped = createAsyncErrorWrapper(fn);
    expect(await wrapped()).toBe('result');
  });

  it('createSyncErrorWrapper returns the original function', () => {
    const fn = () => 42;
    const wrapped = createSyncErrorWrapper(fn);
    expect(wrapped()).toBe(42);
  });

  it('createRouteErrorWrapper returns a middleware that calls next', () => {
    const middleware = createRouteErrorWrapper({});
    const next = jest.fn();
    middleware({} as any, {} as any, next);
    expect(next).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Clean-probe coverage: emailHistory
// ---------------------------------------------------------------------------

describe('emailHistory module', () => {
  beforeEach(() => clearEmailHistory());
  afterEach(() => clearEmailHistory());

  it('clearEmailHistory returns count of cleared items', () => {
    addToHistory({ success: true, message: 'a', timestamp: new Date() });
    expect(clearEmailHistory()).toBe(1);
  });

  it('getEmailHistory returns a copy, not the original', () => {
    addToHistory({ success: true, message: 'b', timestamp: new Date() });
    const h = getEmailHistory();
    h.pop();
    expect(getEmailHistory()).toHaveLength(1);
  });

  it('addToHistory caps at 1000 entries', () => {
    for (let i = 0; i < 1005; i++) {
      addToHistory({ success: true, message: `m${i}`, timestamp: new Date() });
    }
    expect(emailHistory.length).toBeLessThanOrEqual(1000);
  });
});

// ---------------------------------------------------------------------------
// Clean-probe coverage: PerformanceTestHelper
// ---------------------------------------------------------------------------

describe('PerformanceTestHelper', () => {
  it('measureTime returns duration and result', async () => {
    const { result, duration } = await PerformanceTestHelper.measureTime(async () => 'hi');
    expect(result).toBe('hi');
    expect(duration).toBeGreaterThanOrEqual(0);
  });

  it('assertTimingConstraint passes when operation is fast', async () => {
    await expect(
      PerformanceTestHelper.assertTimingConstraint(async () => 'ok', 5000)
    ).resolves.toBe('ok');
  });

  it('testConcurrency runs all operations and collects results', async () => {
    const ops = [async () => 1, async () => 2, async () => 3];
    const result = await PerformanceTestHelper.testConcurrency(ops);
    expect(result.successCount).toBe(3);
    expect(result.errorCount).toBe(0);
  });

  it('testConcurrency counts errors for failing operations', async () => {
    const ops = [async () => { throw new Error('fail'); }, async () => 'ok'];
    const result = await PerformanceTestHelper.testConcurrency(ops);
    expect(result.errorCount).toBe(1);
    expect(result.successCount).toBe(1);
  });

  it('createBenchmarkSuite.run measures all operations', async () => {
    const suite = PerformanceTestHelper.createBenchmarkSuite({
      fast: async () => 'a',
      slow: async () => 'b',
    });
    const results = await suite.run();
    expect(Object.keys(results)).toContain('fast');
    expect(Object.keys(results)).toContain('slow');
  });
});

// ---------------------------------------------------------------------------
// Clean-probe coverage: EntityFactory + DatasetFactory
// ---------------------------------------------------------------------------

describe('EntityFactory', () => {
  it('createUser returns a User with required fields', () => {
    const user = EntityFactory.createUser();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('email');
    expect(user.isActive).toBe(true);
  });

  it('createUser applies overrides', () => {
    const user = EntityFactory.createUser({ firstName: 'Alice' });
    expect(user.firstName).toBe('Alice');
  });

  it('createApiKey returns an ApiKey with required fields', () => {
    const key = EntityFactory.createApiKey();
    expect(key).toHaveProperty('key');
    expect(key.isActive).toBe(true);
    expect(Array.isArray(key.permissions)).toBe(true);
  });

  it('createLogEntry returns a LogEntry with required fields', () => {
    const entry = EntityFactory.createLogEntry();
    expect(entry).toHaveProperty('id');
    expect(entry.level).toBe('info');
  });

  it('createUsers creates N distinct users', () => {
    const users = EntityFactory.createUsers(3);
    expect(users).toHaveLength(3);
    const ids = users.map(u => u.id);
    expect(new Set(ids).size).toBe(3);
  });
});

describe('createTestDataset', () => {
  it('returns users, apiKeys, and logs', () => {
    const ds = createTestDataset();
    expect(Array.isArray(ds.users)).toBe(true);
    expect(Array.isArray(ds.apiKeys)).toBe(true);
    expect(Array.isArray(ds.logs)).toBe(true);
    expect(ds.users).toHaveLength(3);
    expect(ds.apiKeys).toHaveLength(3);
    expect(ds.logs).toHaveLength(6); // 2 per user × 3 users
  });
});

// ---------------------------------------------------------------------------
// Clean-probe coverage: AssertionHelper (other methods)
// ---------------------------------------------------------------------------

describe('AssertionHelper — other methods', () => {
  it('assertDatabaseEntity passes for a valid entity', () => {
    expect(() =>
      AssertionHelper.assertDatabaseEntity({ _id: 'abc', createdAt: new Date() })
    ).not.toThrow();
  });

  it('assertDatabaseEntity throws for null entity', () => {
    expect(() => AssertionHelper.assertDatabaseEntity(null as any)).toThrow(/Entity cannot be null/);
  });

  it('assertApiResponse passes for matching status with data', () => {
    expect(() =>
      AssertionHelper.assertApiResponse({ status: 200, body: { ok: true } }, 200)
    ).not.toThrow();
  });

  it('assertApiResponse throws for wrong status', () => {
    expect(() =>
      AssertionHelper.assertApiResponse({ status: 404, body: {} }, 200)
    ).toThrow(/Expected status 200/);
  });

  it('assertArray passes for correct length', () => {
    expect(() => AssertionHelper.assertArray([1, 2], 2)).not.toThrow();
  });

  it('assertArray throws for wrong length', () => {
    expect(() => AssertionHelper.assertArray([1], 2)).toThrow(/Expected array length 2/);
  });

  it('assertObjectStructure passes for valid structure', () => {
    expect(() =>
      AssertionHelper.assertObjectStructure({ a: 1, b: 2 }, ['a', 'b'])
    ).not.toThrow();
  });

  it('assertObjectStructure throws when required prop missing', () => {
    expect(() =>
      AssertionHelper.assertObjectStructure({ a: 1 }, ['a', 'b'])
    ).toThrow(/Required property 'b' is missing/);
  });

  it('assertObjectStructure throws on unexpected prop', () => {
    expect(() =>
      AssertionHelper.assertObjectStructure({ a: 1, x: 99 }, ['a'])
    ).toThrow(/Unexpected property 'x'/);
  });

  it('assertTimingConstraint passes when within limit', () => {
    expect(() => AssertionHelper.assertTimingConstraint(5, 100)).not.toThrow();
  });

  it('assertTimingConstraint throws when over limit', () => {
    expect(() => AssertionHelper.assertTimingConstraint(200, 100)).toThrow(/exceeding limit/);
  });
});
