// Lightweight unit test for moduleReloader.ts - no complex operations
describe('moduleReloader.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./moduleReloader.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});