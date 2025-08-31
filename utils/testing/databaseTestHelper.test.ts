// Lightweight unit test for databaseTestHelper.ts - no complex operations
describe('databaseTestHelper.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./databaseTestHelper.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});