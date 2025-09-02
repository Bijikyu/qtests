// jest-setup.ts - Jest setup for TypeScript ESM with React support
// Keep qtests setup FIRST to ensure global stubbing is active
import 'qtests/setup';
import 'jest';

// Set test environment early
process.env.NODE_ENV = 'test';

beforeAll(() => {
  jest.setTimeout(10000);
});

afterEach(() => {
  jest.clearAllMocks();
});