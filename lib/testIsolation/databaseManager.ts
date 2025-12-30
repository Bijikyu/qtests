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
        // Add timeout to prevent hanging connections
        await Promise.race([
          conn.close(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('DB connection close timeout')), 5000)
          )
        ]);
      }
    } catch (error: any) {
      qerrors(error, 'databaseManager.closeAllDbConnections: DB connection close failed', {
        connectionIndex: index,
        hasCloseMethod: typeof conn?.close === 'function',
        errorMessage: error.message,
        errorType: error.constructor.name
      });
      console.warn('DB connection close warning:', error.message);
      // Re-throw to ensure connection failures are not silently ignored
      throw error;
    }
  });

  // Use Promise.all instead of allSettled to ensure all connections close properly
  try {
    await Promise.all(closePromises);
  } catch (error) {
    qerrors(error as Error, 'databaseManager.closeAllDbConnections: some connections failed to close', {
      totalConnections: state.dbConnections.length
    });
    // Still clear the array to prevent memory leaks, even if some connections failed
    state.dbConnections = [];
    throw error;
  }
  
  state.dbConnections = [];
};