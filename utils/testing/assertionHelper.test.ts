// Lightweight unit test for assertionHelper.ts - no complex operations
describe('assertionHelper.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./assertionHelper.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});