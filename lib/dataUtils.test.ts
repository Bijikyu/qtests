// Lightweight unit test for dataUtils.ts - no complex operations
describe('dataUtils.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./dataUtils.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});