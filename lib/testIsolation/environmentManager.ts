/**
 * Environment Management for Test Isolation
 */

declare const global: any;
import qerrors from 'qerrors';

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
  try {
    if (Object.keys(state.originalEnv).length > 0) {
      Object.keys(process.env).forEach(key => {
        if (!state.originalEnv.hasOwnProperty(key)) {
          delete process.env[key];
        }
      });

      Object.assign(process.env, state.originalEnv);
    }
  } catch (error: any) {
    qerrors(error, 'environmentManager.restoreEnvironment: environment restore failed', {
      originalEnvKeys: Object.keys(state.originalEnv),
      currentEnvKeys: Object.keys(process.env),
      errorMessage: error?.message || String(error),
      errorType: error?.constructor?.name || 'Unknown'
    });
  }
};