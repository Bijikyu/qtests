// Lightweight unit test for baseMockModel.ts - no complex operations
describe('baseMockModel.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./baseMockModel.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});