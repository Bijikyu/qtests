// Lightweight unit test for httpUtils.ts - no complex operations
describe('httpUtils.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./httpUtils.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});