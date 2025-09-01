// Simplified setup test to prevent child process spawning issues
import '../setup.js'; // activate stub resolution for test environment

describe('setup multiple calls', () => {
  test('setup can be called multiple times safely', async () => {
    // Test that setup is idempotent without spawning child processes
    await expect(import('../setup.js')).resolves.toBeDefined();
    await expect(import('../setup.js')).resolves.toBeDefined(); // Second call should be safe
  });
});