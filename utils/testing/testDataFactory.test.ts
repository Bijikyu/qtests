// Lightweight unit test for testDataFactory.ts - no complex operations
describe('testDataFactory.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./testDataFactory.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});