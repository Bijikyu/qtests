// Module system integration tests for TypeScript ES modules
describe('Module System Integration Tests', () => {
  test('ES module integration works', async () => {
    const mod = await import('../index.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});