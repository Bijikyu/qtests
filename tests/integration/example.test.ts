// Integration test for example - TypeScript ES module implementation
describe('Example Integration Tests', () => {
  test('example integration works', async () => {
    // Simple integration test
    const mod = await import('../../index.js');
    expect(mod).toBeDefined();
  });
});