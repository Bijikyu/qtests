// Lightweight unit test for offlineMode.ts - no complex operations
describe('offlineMode.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./offlineMode.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});