// Lightweight unit test for keyGenerator.ts - no complex operations
describe('keyGenerator.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./keyGenerator.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});