// Performance tests for TypeScript ES modules
describe('Performance Tests', () => {
  test('performance is acceptable', async () => {
    const start = Date.now();
    const mod = await import('../index.js');
    const duration = Date.now() - start;
    expect(mod).toBeDefined();
    expect(duration).toBeLessThan(1000); // Should load quickly
  });
});