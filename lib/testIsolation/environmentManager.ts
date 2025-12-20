/**
 * Environment Management for Test Isolation
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

export const backupEnvironment = (): void => {
  const state = getIsolationState();
  state.originalEnv = { ...process.env };
};

export const restoreEnvironment = (): void => {
  const state = getIsolationState();
  if (Object.keys(state.originalEnv).length > 0) {
    Object.keys(process.env).forEach(key => {
      if (!state.originalEnv.hasOwnProperty(key)) {
        delete process.env[key];
      }
    });

    Object.assign(process.env, state.originalEnv);
  }
};