// Lightweight unit test for testHelpers.ts - no complex operations
describe('testHelpers.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./testHelpers.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});