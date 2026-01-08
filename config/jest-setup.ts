// Simplified jest-setup.ts with proper error handling
// Import qerrors for basic error handling
import 'qtests/setup';
import qerrors from 'qerrors';
import { jest as jestFromGlobals } from '@jest/globals';
import { configureJestGlobals, clearJestMocks, getJestRef } from '../utils/testing/jestSetupHelper';

// Set test environment early - NODE_ENV is managed in localVars.ts
import { 
  nodeEnv,
  testMode,
  debugMode,
  qtestsSilent,
  qtestsFileWorkers,
  qtestsConcurrency,
  qtestsPattern,
  qtestsSuppressDebug,
  qtestsNoDebugFile,
  qtestsDebugFile
} from './localVars.js';

// Resolve jest reference safely and expose globally for tests
const globalJest = (globalThis as any).jest;
const J = getJestRef(globalJest, jestFromGlobals);

// Ensure jest is globally available for tests
if (!(globalThis as any).jest && J) {
  (globalThis as any).jest = J;
}

beforeAll(() => {
  const j = (globalThis as any).jest || J;
  configureJestGlobals(j, 10000);
});

afterEach(() => {
  const j = (globalThis as any).jest || J;
  clearJestMocks(j);
});

// Export setup completion indicator
export const setupComplete = true;
