/**
 * Mock Management for Test Isolation
 */

declare const global: any;

interface IsolationState {
  originalEnv: Record<string, string | undefined>;
  mockRestoreStack: (() => void)[];
  serverInstances: any[];
  dbConnections: any[];
}

const getIsolationState = (): IsolationState => {
  if (!global.__ISOLATION_STATE__) {
    global.__ISOLATION_STATE__ = {
      originalEnv: {} as Record<string, string | undefined>,
      mockRestoreStack: [] as (() => void)[],
      serverInstances: [] as any[],
      dbConnections: [] as any[]
    };
  }
  return global.__ISOLATION_STATE__;
};

export const registerMockRestore = (restoreFn: () => void): void => {
  const state = getIsolationState();
  state.mockRestoreStack.push(restoreFn);
};

export const restoreAllMocks = (): void => {
  const state = getIsolationState();
  while (state.mockRestoreStack.length > 0) {
    const restoreFn = state.mockRestoreStack.pop();
    try {
      if (typeof restoreFn === 'function') {
        restoreFn();
      }
    } catch (error: any) {
      console.warn('Mock restore warning:', error.message);
    }
  }
};