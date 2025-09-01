// Lightweight unit test for mockModels functionality
describe('mockModels basic functionality', () => {
  test('mockModels module loads correctly', async () => {
    const mod = await import('../utils/mockModels.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});