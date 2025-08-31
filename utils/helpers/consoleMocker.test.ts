// Lightweight unit test for consoleMocker.ts - no complex operations
describe('consoleMocker.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./consoleMocker.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});