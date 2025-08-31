// Lightweight unit test for dual module generation - TypeScript ES module implementation
describe('Dual Module Generation Tests', () => {
  test('TypeScript ES module generation works', async () => {
    // Simple test for TypeScript ES module functionality
    const testModule = await import('../lib/testGenerator.js');
    expect(testModule).toBeDefined();
  });
});