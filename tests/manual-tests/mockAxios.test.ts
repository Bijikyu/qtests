// Lightweight unit test for mockAxios functionality
describe('mockAxios basic functionality', () => {
  test('mockAxios module loads correctly', async () => {
    const mod = await import('../utils/mockAxios.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});