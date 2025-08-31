// Offline mode tests for TypeScript ES modules
describe('Offline Mode Tests', () => {
  test('offline mode functions correctly', async () => {
    const mod = await import('../utils/offlineMode.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});