/**
 * Mock Management for Test Isolation
 */

declare const global: any;

interface IsolationState {
  originalEnv: Record<string, string | undefined>;
  mockRestoreStack: (() => void)[];
  serverInstances: any[];
  dbConnections: any[];
  maxStackItems: number;
}

const getIsolationState = (): IsolationState => {
  if (!global.__ISOLATION_STATE__) {
    global.__ISOLATION_STATE__ = {
      originalEnv: {} as Record<string, string | undefined>,
      mockRestoreStack: [] as (() => void)[],
      serverInstances: [] as any[],
      dbConnections: [] as any[],
      maxStackItems: 1000 // Prevent unlimited memory growth
    };
  }
  return global.__ISOLATION_STATE__;
};

export const registerMockRestore = (restoreFn: () => void): void => {
  const state = getIsolationState();
  
  // Prevent memory leaks by limiting stack size
  if (state.mockRestoreStack.length >= state.maxStackItems) {
    console.warn('Mock restore stack approaching limit, forcing cleanup');
    // Remove oldest items (first half)
    state.mockRestoreStack.splice(0, Math.floor(state.maxStackItems / 2));
  }
  
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
  
  // Also cleanup other resources
  cleanupIsolationState();
};

/**
 * Complete cleanup of isolation state to prevent memory leaks
 */
export const cleanupIsolationState = (): void => {
  const state = getIsolationState();
  
  // Close server instances
  for (const server of state.serverInstances) {
    try {
      if (server && typeof server.close === 'function') {
        server.close();
      }
    } catch (error: any) {
      console.warn('Server close warning:', error.message);
    }
  }
  state.serverInstances.length = 0;
  
  // Close database connections
  for (const db of state.dbConnections) {
    try {
      if (db && typeof db.close === 'function') {
        db.close();
      } else if (db && typeof db.end === 'function') {
        db.end();
      }
    } catch (error: any) {
      console.warn('DB close warning:', error.message);
    }
  }
  state.dbConnections.length = 0;
  
  // Clear environment variables
  for (const key in state.originalEnv) {
    if (state.originalEnv[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = state.originalEnv[key];
    }
  }
  state.originalEnv = {};
};