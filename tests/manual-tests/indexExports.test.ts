// Index exports tests for TypeScript ES modules
describe('Index Exports Tests', () => {
  test('index exports are available', async () => {
    const mod = await import('../index.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});