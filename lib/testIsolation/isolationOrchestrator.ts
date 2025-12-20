/**
 * Test Isolation Orchestration
 * Coordinates all isolation components and provides high-level setup/teardown
 */

import { aggressiveCleanup } from '../memory/index.js';
import { backupEnvironment, restoreEnvironment } from './environmentManager.js';
import { registerMockRestore, restoreAllMocks } from './mockManager.js';
import { trackServer, closeAllServers } from './serverManager.js';
import { trackDbConnection, closeAllDbConnections } from './databaseManager.js';

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