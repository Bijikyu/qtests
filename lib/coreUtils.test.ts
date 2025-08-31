// Lightweight unit test for coreUtils.ts - no complex operations
describe('coreUtils.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./coreUtils.js');
    expect(mod).toBeDefined();
  });
});