// Simplified jest-setup.ts with proper error handling
// Import qerrors for basic error handling (using fallback approach)
const qerrors = require('qerrors');

// Set test environment early - NODE_ENV is managed in localVars.ts
import { 
  NODE_ENV,
  OFFLINE_MODE,
  JEST_WORKER_ID,
  QTESTS_SILENT,
  QTESTS_FILE_WORKERS,
  QTESTS_CONCURRENCY,
  QTESTS_PATTERN,
  QTESTS_SUPPRESS_DEBUG,
  QTESTS_NO_DEBUG_FILE,
  QTESTS_DEBUG_FILE,
  INIT_CWD
} from './localVars.js';

// Resolve jest reference safely and expose globally for tests
const globalJest = (globalThis as any).jest;
const J = (typeof jestFromGlobals !== 'undefined' && jestFromGlobals)
  ? jestFromGlobals
  : (globalThis as any).jest;

// Ensure jest is globally available for tests
if (!globalJest && J) {
  (globalThis as any).jest = J as any;
}

beforeAll(() => {
  const j = (globalThis as any).jest || J;
  if (j && typeof j.setTimeout === 'function') {
    j.setTimeout(10000);
  }
});

afterEach(() => {
  const j = (globalThis as any).jest || J;
  if (j && typeof j.clearAllMocks === 'function') {
    j.clearAllMocks();
  }
});

// Export setup completion indicator
export const setupComplete = true;