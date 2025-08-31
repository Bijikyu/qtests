// Lightweight unit test for modelFactory.ts - no complex operations
describe('modelFactory.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./modelFactory.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});