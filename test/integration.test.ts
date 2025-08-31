// Integration tests for TypeScript ES modules
describe('Integration Tests', () => {
  test('core modules integrate correctly', async () => {
    const index = await import('../index.js');
    const setup = await import('../setup.js');
    expect(index).toBeDefined();
    expect(setup).toBeDefined();
  });
});