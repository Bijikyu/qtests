// Lightweight unit test for mockConsole.ts - no complex operations
describe('mockConsole.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./mockConsole.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});