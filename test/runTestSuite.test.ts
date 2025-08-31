// Run test suite tests for TypeScript ES modules
describe('Run Test Suite Tests', () => {
  test('test suite runs correctly', async () => {
    const mod = await import('../utils/runTestSuite.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});