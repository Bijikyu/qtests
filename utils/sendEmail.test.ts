// Lightweight unit test for sendEmail.ts - no complex operations
describe('sendEmail.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./sendEmail.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});