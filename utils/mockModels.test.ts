// Lightweight unit test for mockModels.ts - no complex operations
describe('mockModels.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./mockModels.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});