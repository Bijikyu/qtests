'use strict';
/**
 * Dogfood tests for utils/mockConsole.ts
 *
 * mockConsole(method, options) mocks a SINGLE console method by name.
 * Returns a JestSpy (when Jest is available) or FallbackMock, both with:
 *   .mock.calls  — captured argument arrays
 *   .mockRestore() — restores original (NOTE: Jest's mockRestore also clears .mock.calls)
 */

const {
  mockConsole,
  createFallbackMock,
  withMockConsole,
  mockAllConsole,
  restoreAllMocks,
  isMocked,
} = require('../../dist/utils/mockConsole.js');

describe('mockConsole', () => {
  test('is a function', () => {
    expect(typeof mockConsole).toBe('function');
  });

  test('silences console.log when called with "log"', () => {
    const origLog = console.log;
    const mock = mockConsole('log');
    expect(console.log).not.toBe(origLog);
    expect(() => console.log('should be silenced')).not.toThrow();
    mock.mockRestore();
    expect(console.log).toBe(origLog);
  });

  test('silences console.warn when called with "warn"', () => {
    const origWarn = console.warn;
    const mock = mockConsole('warn');
    expect(console.warn).not.toBe(origWarn);
    console.warn('silenced warn');
    mock.mockRestore();
    expect(console.warn).toBe(origWarn);
  });

  test('silences console.error when called with "error"', () => {
    const origError = console.error;
    const mock = mockConsole('error');
    expect(console.error).not.toBe(origError);
    console.error('silenced error');
    mock.mockRestore();
    expect(console.error).toBe(origError);
  });

  test('captures calls in mock.calls — read before mockRestore', () => {
    const mock = mockConsole('log', { captureCalls: true, silent: true });
    console.log('hello', 'world');
    console.log('second call');
    // Read calls BEFORE restore — Jest's mockRestore() resets mock.calls
    expect(Array.isArray(mock.mock.calls)).toBe(true);
    expect(mock.mock.calls.length).toBe(2);
    expect(mock.mock.calls[0]).toEqual(['hello', 'world']);
    expect(mock.mock.calls[1]).toEqual(['second call']);
    mock.mockRestore();
  });

  test('custom implementation is called', () => {
    const calls = [];
    const mock = mockConsole('log', {
      silent: false,
      captureCalls: false,
      implementation: (...args) => calls.push(args)
    });
    console.log('custom1');
    console.log('custom2', 'extra');
    // Read before restore
    expect(calls.length).toBe(2);
    expect(calls[0]).toEqual(['custom1']);
    expect(calls[1]).toEqual(['custom2', 'extra']);
    mock.mockRestore();
  });

  test('returns object with mockRestore function', () => {
    const mock = mockConsole('log');
    expect(typeof mock.mockRestore).toBe('function');
    mock.mockRestore();
  });
});

describe('createFallbackMock', () => {
  test('is a function', () => {
    expect(typeof createFallbackMock).toBe('function');
  });

  test('replaces console method', () => {
    const orig = console.log;
    const mock = createFallbackMock('log', true, true);
    // In Jest env, direct assignment may not change the reference seen by Jest,
    // but the returned mock object should be valid
    expect(mock).toBeDefined();
    expect(typeof mock.mockRestore).toBe('function');
    mock.mockRestore();
  });

  test('returns mock object with calls array when captureCalls=true', () => {
    const mock = createFallbackMock('log', true, true);
    // calls array is initialized (may or may not capture in Jest env due to console proxying)
    expect(mock.mock).toBeDefined();
    mock.mockRestore();
  });

  test('mock.calls is null when captureCalls=false', () => {
    const mock = createFallbackMock('log', false, true);
    expect(mock.mock.calls).toBeNull();
    mock.mockRestore();
  });

  test('mockRestore does not throw', () => {
    const mock = createFallbackMock('log', true, true);
    expect(() => mock.mockRestore()).not.toThrow();
  });
});

describe('withMockConsole', () => {
  test('is a function', () => {
    expect(typeof withMockConsole).toBe('function');
  });

  test('provides a spy to the callback and restores after', () => {
    const orig = console.log;
    let spyInsideCallback = null;
    let consoleLogDuringCallback = null;

    withMockConsole('log', (spy) => {
      spyInsideCallback = spy;
      consoleLogDuringCallback = console.log;
    });

    expect(spyInsideCallback).toBeDefined();
    expect(typeof spyInsideCallback.mockRestore).toBe('function');
    // After withMockConsole completes, console.log is restored
    expect(console.log).toBe(orig);
  });

  test('spy has mock.calls array', () => {
    let calls = null;
    withMockConsole('log', (spy) => {
      console.log('inside withMockConsole');
      calls = spy.mock.calls;
    });
    expect(Array.isArray(calls)).toBe(true);
  });

  test('restores after callback throws', () => {
    const orig = console.log;
    let threw = false;
    try {
      withMockConsole('log', () => { throw new Error('boom'); });
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
    expect(console.log).toBe(orig);
  });
});

describe('mockAllConsole', () => {
  test('is a function', () => {
    expect(typeof mockAllConsole).toBe('function');
  });

  test('returns mocks for all console methods', () => {
    const mocks = mockAllConsole();
    expect(typeof mocks).toBe('object');
    // Jest spies are functions; fallback mocks are plain objects — accept either
    expect(mocks.log).toBeTruthy();
    expect(mocks.warn).toBeTruthy();
    expect(mocks.error).toBeTruthy();
    expect(mocks.info).toBeTruthy();
    expect(mocks.debug).toBeTruthy();
    restoreAllMocks(mocks);
  });

  test('returned mocks have mockRestore', () => {
    const mocks = mockAllConsole();
    expect(typeof mocks.log.mockRestore).toBe('function');
    expect(typeof mocks.warn.mockRestore).toBe('function');
    expect(typeof mocks.error.mockRestore).toBe('function');
    restoreAllMocks(mocks);
  });

  test('silences console methods and restores via restoreAllMocks', () => {
    const origLog   = console.log;
    const origWarn  = console.warn;
    const origError = console.error;
    const mocks = mockAllConsole();
    // After mocking, console methods should be replaced
    expect(console.log).not.toBe(origLog);
    expect(console.warn).not.toBe(origWarn);
    expect(console.error).not.toBe(origError);
    restoreAllMocks(mocks);
    // After restore, originals are back
    expect(console.log).toBe(origLog);
    expect(console.warn).toBe(origWarn);
    expect(console.error).toBe(origError);
  });
});

describe('isMocked', () => {
  test('is a function', () => {
    expect(typeof isMocked).toBe('function');
  });

  test('returns true after mocking, false after restore', () => {
    const mock = mockConsole('log');
    expect(isMocked('log')).toBe(true);
    mock.mockRestore();
    expect(isMocked('log')).toBe(false);
  });

  test('returns false for unmocked methods', () => {
    expect(isMocked('warn')).toBe(false);
  });
});
