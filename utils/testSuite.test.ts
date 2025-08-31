// Lightweight unit test for testSuite.ts - no complex operations
describe('testSuite.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./testSuite.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});