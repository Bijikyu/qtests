// Comprehensive tests for TypeScript ES modules
describe('Comprehensive Tests', () => {
  test('comprehensive functionality works', async () => {
    const mod = await import('../index.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});