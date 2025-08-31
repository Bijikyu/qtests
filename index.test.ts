// Lightweight unit test for index.ts - no complex module loading
describe('index.ts basic exports', () => {
  test('module exports exist', async () => {
    // Simple existence check without loading complex dependencies
    const mod = await import('./index.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});