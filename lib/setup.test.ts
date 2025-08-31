// Lightweight unit test for setup.ts - no complex operations
describe('setup.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./setup.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});