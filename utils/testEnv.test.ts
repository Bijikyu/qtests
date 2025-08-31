// Lightweight unit test for testEnv.ts - no complex operations
describe('testEnv.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./testEnv.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});