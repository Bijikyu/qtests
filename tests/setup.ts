// tests/setup.ts - TypeScript ES Module setup (PARALLEL-SAFE)
import 'jest';

// Global test configuration for TypeScript ES modules
beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Configure test timeouts
  jest.setTimeout(10000);
});

// Cleanup after each test to prevent interference
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks();
});