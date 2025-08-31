// Lightweight unit test for emailSender.ts - no complex operations
describe('emailSender.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./emailSender.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});