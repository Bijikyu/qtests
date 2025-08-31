/**
 * Console Mocking Utilities - TypeScript Implementation
 *
 * Provides console output capture for tests without polluting output.
 */

// Type alias for supported console method names
type ConsoleMethod = 'log' | 'error' | 'warn' | 'info' | 'debug';

// Minimal Jest spy interface subset we rely on
interface JestSpy<TArgs extends any[] = any[]> {
  mock: { calls: TArgs[] };
  mockRestore: () => void;
}

// Fallback mock object interface when Jest is not available
interface FallbackMock<TArgs extends any[] = any[]> {
  mock: { calls: TArgs[] | null };
  mockRestore: () => void;
}

/**
 * Create a mock console method that captures calls without output.
 */
export function mockConsole(method: ConsoleMethod): JestSpy | FallbackMock {
  console.log(`mockConsole is running with ${method}`);

  try {
    // Prefer Jest spies when available for richer assertions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const j: any = (globalThis as unknown as { jest?: any }).jest;
    if (j && typeof j.fn === 'function' && typeof j.spyOn === 'function') {
      const jestSpy = j.spyOn(console, method).mockImplementation(() => {});
      console.log(`mockConsole is returning ${jestSpy}`);
      return jestSpy as JestSpy;
    }

    // Fallback: manual capture without output
    let originalMethod: (...args: any[]) => void = console[method] as never;
    let calls: any[][] = [];

    // Replace method with capturing stub
    console[method] = function (...args: any[]) {
      calls.push(args);
    } as never;

    const mockObject: FallbackMock = {
      mock: { calls },
      mockRestore: function () {
        console[method] = originalMethod as never;
        if (calls) calls.length = 0;
        this.mock.calls = null;
        // Drop references to help GC
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        originalMethod = null as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        calls = null as any;
      }
    };

    console.log(`mockConsole is returning ${mockObject}`);
    return mockObject;
  } catch (error: any) {
    console.log(`mockConsole error: ${error.message}`);
    throw error;
  }
}

export default mockConsole;

