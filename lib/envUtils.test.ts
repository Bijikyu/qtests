// Lightweight unit test for envUtils.ts - no complex operations
describe('envUtils.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./envUtils.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});