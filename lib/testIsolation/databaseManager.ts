/**
 * Database Connection Management for Test Isolation
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