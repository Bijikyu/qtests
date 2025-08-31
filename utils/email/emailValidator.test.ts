// Lightweight unit test for emailValidator.ts - no complex operations
describe('emailValidator.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./emailValidator.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});