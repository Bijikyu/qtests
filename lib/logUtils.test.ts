// Lightweight unit test for logUtils.ts - no complex operations
describe('logUtils.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./logUtils.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});