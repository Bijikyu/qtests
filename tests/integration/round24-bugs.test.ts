/**
 * Round 24 Regression Tests — Console Mocking Layer
 *
 * Bug 1: withAllMockedConsole — mocks were already restored before fn(spies) ran
 *   because withMockConsole restores in its own finally block.
 *   Fix: rewrite to manage lifecycle directly (install all, call fn, restore all).
 *
 * Bug 2: createFallbackMock — debug console.log fired AFTER replacing console[method],
 *   so mocking 'log' captured the init message as first call in calls[].
 *   Fix: move log before the replacement.
 */

import { withAllMockedConsole, withMockConsole } from '../../utils/console/consoleUtils.js';
import { createFallbackMock } from '../../utils/console/fallbackMocker.js';

describe('Round 24 — console mocking bugs', () => {

  // ─── Bug 1: withAllMockedConsole lifecycle ───────────────────────────────

  describe('withAllMockedConsole', () => {
    test('mocks are active when fn(spies) runs — calls are captured', () => {
      withAllMockedConsole((spies) => {
        // All five console methods should be mocked at this point
        console.log('hello log');
        console.error('hello error');
        console.warn('hello warn');
        console.info('hello info');
        console.debug('hello debug');

        expect(spies.log.mock.calls.length).toBe(1);
        expect(spies.log.mock.calls[0]).toEqual(['hello log']);

        expect(spies.error.mock.calls.length).toBe(1);
        expect(spies.error.mock.calls[0]).toEqual(['hello error']);

        expect(spies.warn.mock.calls.length).toBe(1);
        expect(spies.warn.mock.calls[0]).toEqual(['hello warn']);

        expect(spies.info.mock.calls.length).toBe(1);
        expect(spies.info.mock.calls[0]).toEqual(['hello info']);

        expect(spies.debug.mock.calls.length).toBe(1);
        expect(spies.debug.mock.calls[0]).toEqual(['hello debug']);
      });
    });

    test('originals are restored after fn returns', () => {
      const originalLog = console.log;
      withAllMockedConsole(() => {});
      expect(console.log).toBe(originalLog);
    });

    test('originals are restored even when fn throws', () => {
      const originalLog = console.log;
      expect(() => {
        withAllMockedConsole(() => { throw new Error('boom'); });
      }).toThrow('boom');
      expect(console.log).toBe(originalLog);
    });

    test('multiple calls inside fn are all captured', () => {
      withAllMockedConsole((spies) => {
        console.log('a');
        console.log('b');
        console.log('c');
        expect(spies.log.mock.calls.length).toBe(3);
        expect(spies.log.mock.calls[2]).toEqual(['c']);
      });
    });

    test('mockClear resets call count mid-flight', () => {
      withAllMockedConsole((spies) => {
        console.log('before clear');
        spies.log.mockClear();
        expect(spies.log.mock.calls.length).toBe(0);
        console.log('after clear');
        expect(spies.log.mock.calls.length).toBe(1);
      });
    });

    test('returns the value produced by fn', () => {
      const result = withAllMockedConsole(() => 42);
      expect(result).toBe(42);
    });

    test('independent of withMockConsole — still active after outer withMockConsole call', () => {
      // Regression guard: withMockConsole used to be nested inside withAllMockedConsole,
      // causing premature restoration. Verify they still compose correctly.
      withMockConsole('log', (outer) => {
        withAllMockedConsole((inner) => {
          console.log('inside inner');
          expect(inner.log.mock.calls.length).toBe(1);
        });
        // outer spy should still be active
        console.log('inside outer');
        expect(outer.mock.calls.length).toBe(1);
      });
    });
  });

  // ─── Bug 2: createFallbackMock init-log pollution ────────────────────────

  describe('createFallbackMock — no phantom init call', () => {
    afterEach(() => {
      // Safety restore in case test fails mid-way
    });

    test('mocking console.log produces zero calls immediately after creation', () => {
      const mock = createFallbackMock('log', true, true);
      try {
        expect(mock.mock.calls).not.toBeNull();
        expect((mock.mock.calls as any[]).length).toBe(0);
      } finally {
        mock.mockRestore();
      }
    });

    test('mocking console.error produces zero calls immediately after creation', () => {
      const mock = createFallbackMock('error', true, true);
      try {
        expect((mock.mock.calls as any[]).length).toBe(0);
      } finally {
        mock.mockRestore();
      }
    });

    test('calls through the mock after creation are captured correctly', () => {
      const mock = createFallbackMock('warn', true, true);
      try {
        console.warn('test warning');
        expect((mock.mock.calls as any[]).length).toBe(1);
        expect((mock.mock.calls as any[])[0]).toEqual(['test warning']);
      } finally {
        mock.mockRestore();
      }
    });

    test('mockRestore nulls out calls and restores original', () => {
      const original = console.log;
      const mock = createFallbackMock('log', true, true);
      mock.mockRestore();
      expect(console.log).toBe(original);
      expect(mock.mock.calls).toBeNull();
    });
  });
});
