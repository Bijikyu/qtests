// jest-setup.ts - Jest setup for TypeScript ESM with React support
// Keep qtests setup FIRST to ensure global stubbing is active
import 'qtests/setup';
import { jest as jestFromGlobals } from '@jest/globals';

// Set test environment early
process.env.NODE_ENV = 'test';

// Resolve jest reference safely and expose globally for tests using jest.*
const J = (typeof jestFromGlobals !== 'undefined' && jestFromGlobals)
  ? jestFromGlobals
  : (globalThis as any).jest;
if (!(globalThis as any).jest && J) {
  (globalThis as any).jest = J as any;
}
// Local convenience binding for this module scope
const jest = (globalThis as any).jest as any;

// Provide CommonJS-like require for ESM tests that call require()
try {
  const { createRequire } = await import('module');
  const req = createRequire(import.meta.url);
  if (!(globalThis as any).require) {
    (globalThis as any).require = req;
  }
} catch {}

beforeAll(() => {
  if (jest && typeof jest.setTimeout === 'function') {
    jest.setTimeout(10000);
  }
});

afterEach(() => {
  if (jest && typeof jest.clearAllMocks === 'function') {
    jest.clearAllMocks();
  }
});