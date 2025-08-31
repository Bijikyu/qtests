// Lightweight unit test for emailFormatter.ts - no complex operations
describe('emailFormatter.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./emailFormatter.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});