// jest-setup.ts - Jest setup for TypeScript ESM with React support
// Keep qtests setup FIRST to ensure global stubbing is active
import '../setup';
import { jest as jestFromGlobals } from '@jest/globals';
import { NODE_ENV } from './localVars.js';

// Import qerrors for proper error logging with fallback
let qerrors;
try {
  qerrors = require('../dist/lib/qerrorsFallback.js');
} catch {
  // Fallback to console if qerrors import fails
  qerrors = (error: Error, message?: string, context?: any) => {
    console.error('[JEST-SETUP-ERROR]', message || error.message, context || {});
  };
}

// Set test environment early - NODE_ENV is managed in localVars.ts

// Resolve jest reference safely and expose globally for tests using jest.*
const globalJest = (globalThis as any).jest;
const J = (typeof jestFromGlobals !== 'undefined' && jestFromGlobals)
  ? jestFromGlobals
  : globalJest;

// Ensure jest is globally available for tests
if (!globalJest && J) {
  (globalThis as any).jest = J as any;
}

// Provide CommonJS-like require for ESM tests that call require()
// Avoid top-level await to satisfy stricter Jest transform pipelines.
try {
  if (!(globalThis as any).require && typeof require === 'function') {
    (globalThis as any).require = require as any;
  }
} catch (error) {
  qerrors(error as Error, 'Jest setup: Failed to polyfill require()', {
    setupPhase: 'require-polyfill',
    errorType: error?.constructor?.name || 'unknown'
  });
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