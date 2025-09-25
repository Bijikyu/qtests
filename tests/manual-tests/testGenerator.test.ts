// Lightweight unit test for testGenerator.ts - no complex operations
describe('testGenerator.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('../lib/testGenerator.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});