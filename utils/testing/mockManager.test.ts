// Lightweight unit test for mockManager.ts - no complex operations
describe('mockManager.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./mockManager.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});