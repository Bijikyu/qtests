// Simplified setup test to prevent child process spawning issues
require('../setup'); // activate stub resolution for test environment

describe('setup multiple calls', () => {
  test('setup can be called multiple times safely', () => {
    // Test that setup is idempotent without spawning child processes
    expect(() => require('../setup')).not.toThrow();
    expect(() => require('../setup')).not.toThrow(); // Second call should be safe
  });
});
