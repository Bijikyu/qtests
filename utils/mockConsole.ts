type ConsoleMethod = 'log' | 'error' | 'warn' | 'info' | 'debug';

interface JestSpy<TArgs extends any[] = any[]> {
  mock: { calls: TArgs[] };
  mockRestore: () => void;
}

interface FallbackMock<TArgs extends any[] = any[]> {
  mock: { calls: TArgs[] | null };
  mockRestore: () => void;
}

export function mockConsole(method: ConsoleMethod): JestSpy | FallbackMock {
  console.log(`mockConsole is running with ${method}`);

  try {
    const j: any = (globalThis as unknown as { jest?: any }).jest;
    if (j && typeof j.fn === 'function' && typeof j.spyOn === 'function') {
      const jestSpy = j.spyOn(console, method).mockImplementation(() => {});
      console.log(`mockConsole is returning ${jestSpy}`);
      return jestSpy as JestSpy;
    }

    let originalMethod: (...args: any[]) => void = console[method] as never;
    let calls: any[][] = [];

    console[method] = function (...args: any[]) {
      calls.push(args);
    } as never;

    const mockObject: FallbackMock = {
      mock: { calls },
      mockRestore: function () {
        console[method] = originalMethod as never;
        if (calls) calls.length = 0;
        this.mock.calls = null;
        originalMethod = null as any;
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

