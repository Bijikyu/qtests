// Lightweight unit test for performanceTestHelper.ts - no complex operations
describe('performanceTestHelper.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./performanceTestHelper.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});