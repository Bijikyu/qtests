/** Console Mocking Utilities */
import { withErrorLogging } from '../../lib/errorHandling/index.js';
import { logStart } from '../../lib/logUtils.js';
import { ConsoleMethod, ConsoleMockOptions, JestSpy, tryCreateJestSpy } from './jestMocker.js';
import { FallbackMock, createFallbackMock } from './fallbackMocker.js';
import { safeRestoreMock } from '../testing/mockUtils.js';

export interface MockSpy {
  mock: { calls: any[][] };
  mockImplementation: (fn: (...args: any[]) => any) => void;
  mockRestore: () => void;
  mockClear: () => void;
  mockReset: () => void;
}

const CONSOLE_METHODS: ConsoleMethod[] = ['log', 'error', 'warn', 'info', 'debug'];

const _mockedByUs = new Set<ConsoleMethod>();

export function registerMocked(method: ConsoleMethod): void {
  _mockedByUs.add(method);
}

export function unregisterMocked(method: ConsoleMethod): void {
  _mockedByUs.delete(method);
}

export const withMockConsole = <T>(method: ConsoleMethod, fn: (spy: MockSpy) => T, options: ConsoleMockOptions = {}): T => {
  logStart('withMockConsole', method);
  return withErrorLogging(() => {
    const { silent = true, implementation } = options;
    const originalMethod = (console as any)[method];
    const calls: any[][] = [];

    const spy: MockSpy = {
      mock: { calls },
      mockImplementation: (impl: (...args: any[]) => any) => {
        (console as any)[method] = (...args: any[]) => {
          calls.push(args);
          return impl(...args);
        };
      },
      mockRestore: () => {
        (console as any)[method] = originalMethod;
        calls.length = 0;
        unregisterMocked(method);
      },
      mockClear: () => { calls.length = 0; },
      mockReset: () => {
        calls.length = 0;
        (console as any)[method] = implementation || (silent ? () => {} : originalMethod);
      }
    };

    (console as any)[method] = (...args: any[]) => {
      calls.push(args);
      if (implementation) return implementation(...args);
      else if (!silent && originalMethod) return originalMethod.apply(console, args);
    };

    registerMocked(method);
    try {
      return fn(spy);
    } finally {
      spy.mockRestore();
      (console as any)[method] = originalMethod;
    }
  }, 'withMockConsole');
};

export const mockAllConsole = (options: ConsoleMockOptions = {}): Record<ConsoleMethod, JestSpy | FallbackMock> => {
  const { silent = true, implementation, preferJest = true } = options;
  const mocks = {} as Record<ConsoleMethod, JestSpy | FallbackMock>;
  for (const method of CONSOLE_METHODS) {
    if (preferJest) {
      const jestSpy = tryCreateJestSpy(method, silent, implementation);
      if (jestSpy) { mocks[method] = jestSpy; continue; }
    }
    mocks[method] = createFallbackMock(method, true, silent, implementation);
  }
  return mocks;
};

export const withAllMockedConsole = <T>(fn: (spies: Record<ConsoleMethod, MockSpy>) => T, _options: ConsoleMockOptions = {}): T => {
  const spies = {} as Record<ConsoleMethod, MockSpy>;
  const restores: Array<() => void> = [];
  try {
    for (const method of CONSOLE_METHODS) {
      let currentSpy: MockSpy | null = null;
      withMockConsole(method, (mockSpy) => {
        spies[method] = mockSpy;
        currentSpy = mockSpy;
        return null as any;
      });
      if (currentSpy) restores.push(() => (currentSpy as MockSpy).mockRestore());
    }
    return fn(spies);
  } finally {
    restores.forEach(restore => restore());
  }
};

export const isMocked = (method: ConsoleMethod): boolean => {
  return _mockedByUs.has(method);
};

export const restoreMock = (mock: JestSpy | FallbackMock): void => {
  safeRestoreMock(mock, 'restoreMock');
};

export const restoreAllMocks = (mocks: Record<ConsoleMethod, JestSpy | FallbackMock>): void => {
  for (const mock of Object.values(mocks)) restoreMock(mock);
};
