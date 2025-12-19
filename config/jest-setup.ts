// jest-setup.ts - Jest setup for TypeScript ESM with React support
// Keep qtests setup FIRST to ensure global stubbing is active
import '../setup';
import { jest as jestFromGlobals } from '@jest/globals';

// Set test environment early
process.env.NODE_ENV = 'test';

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
  console.warn('Jest setup: Failed to polyfill require():', error);
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