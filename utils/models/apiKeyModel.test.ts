// Lightweight unit test for apiKeyModel.ts - no complex operations
describe('apiKeyModel.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./apiKeyModel.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});