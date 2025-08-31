// Lightweight unit test for envManager.ts - no complex operations
describe('envManager.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./envManager.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});