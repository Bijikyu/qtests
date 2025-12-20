/**
 * Server Management for Test Isolation
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