// jest-setup.ts - Jest-specific setup file

// Global test configuration for TypeScript ES modules
beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = 'test';
});

// Cleanup after each test to prevent interference
afterEach(() => {
  // Clear all mocks - use global functions available in Jest environment
  if (typeof jest !== 'undefined') {
    jest.clearAllMocks();
  }
});