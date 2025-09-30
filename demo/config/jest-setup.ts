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

// Provide CommonJS-like require for ESM tests that call require()
// Avoid top-level await to satisfy stricter Jest transform pipelines.
try {
  if (!(globalThis as any).require && typeof require === 'function') {
    (globalThis as any).require = require as any;
  }
} catch {}

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

// DOM polyfills for React Testing Library
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ResizeObserver polyfill
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// IntersectionObserver polyfill
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Clipboard polyfill
Object.assign(global.navigator, { clipboard: { writeText: jest.fn().mockResolvedValue(undefined) } });

// URL.createObjectURL polyfill
// Note: keep deterministic
global.URL.createObjectURL = jest.fn().mockReturnValue('blob:stub');