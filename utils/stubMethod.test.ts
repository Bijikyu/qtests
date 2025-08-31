// Lightweight unit test for stubMethod.ts - no complex operations
describe('stubMethod.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./stubMethod.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});