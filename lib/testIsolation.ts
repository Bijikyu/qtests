import { aggressiveCleanup } from './memoryCleanup.js';
import localVars from '../config/localVars.js';

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
  // Use localVars pattern for environment access
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

export const trackServer = (server: any): void => {
  const state = getIsolationState();
  state.serverInstances.push(server);
};

export const closeAllServers = async (): Promise<void> => {
  const state = getIsolationState();
  const closePromises = state.serverInstances.map(async (server) => {
    try {
      if (server && typeof server.close === 'function') {
        await new Promise<void>((resolve, reject) => {
          server.close((err: any) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    } catch (error: any) {
      console.warn('Server close warning:', error.message);
    }
  });

  await Promise.allSettled(closePromises);
  state.serverInstances = [];
};

export const trackDbConnection = (connection: any): void => {
  const state = getIsolationState();
  state.dbConnections.push(connection);
};

export const closeAllDbConnections = async (): Promise<void> => {
  const state = getIsolationState();
  const closePromises = state.dbConnections.map(async (conn) => {
    try {
      if (conn && typeof conn.close === 'function') {
        await conn.close();
      }
    } catch (error: any) {
      console.warn('DB connection close warning:', error.message);
    }
  });

  await Promise.allSettled(closePromises);
  state.dbConnections = [];
};

export const setupTestIsolation = (): void => {
  const state = getIsolationState();
  backupEnvironment();
  state.mockRestoreStack = [];
  state.serverInstances = [];
  state.dbConnections = [];
};

export const teardownTestIsolation = async (): Promise<void> => {
  try {
    restoreAllMocks();
    await closeAllServers();
    await closeAllDbConnections();
    restoreEnvironment();
    aggressiveCleanup();
  } catch (error: any) {
    console.warn('Test isolation teardown warning:', error.message);
  }
};

export const setupJestIsolation = (): void => {
  beforeEach(() => {
    setupTestIsolation();
  });

  afterEach(async () => {
    await teardownTestIsolation();
  });
};

export default {
  setupTestIsolation,
  teardownTestIsolation,
  backupEnvironment,
  restoreEnvironment,
  registerMockRestore,
  restoreAllMocks,
  trackServer,
  closeAllServers,
  trackDbConnection,
  closeAllDbConnections,
  setupJestIsolation
};
