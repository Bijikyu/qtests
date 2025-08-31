// Lightweight unit test for testUtils.ts - no complex operations
describe('testUtils.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./testUtils.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});