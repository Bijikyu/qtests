// Lightweight unit test for responseMocker.ts - no complex operations
describe('responseMocker.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./responseMocker.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});