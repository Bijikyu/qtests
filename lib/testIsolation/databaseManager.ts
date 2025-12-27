/**
 * Database Connection Management for Test Isolation
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

export const trackDbConnection = (connection: any): void => {
  const state = getIsolationState();
  state.dbConnections.push(connection);
};

export const closeAllDbConnections = async (): Promise<void> => {
  const state = getIsolationState();
  const closePromises = state.dbConnections.map(async (conn, index) => {
    try {
      if (conn && typeof conn.close === 'function') {
        await conn.close();
      }
    } catch (error: any) {
      qerrors(error, 'databaseManager.closeAllDbConnections: DB connection close failed', {
        connectionIndex: index,
        hasCloseMethod: typeof conn?.close === 'function',
        errorMessage: error.message,
        errorType: error.constructor.name
      });
      console.warn('DB connection close warning:', error.message);
    }
  });

  await Promise.allSettled(closePromises);
  state.dbConnections = [];
};