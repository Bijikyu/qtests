// Lightweight unit test for emailTemplate.ts - no complex operations
describe('emailTemplate.ts basic exports', () => {
  test('module loads without errors', async () => {
    const mod = await import('./emailTemplate.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});