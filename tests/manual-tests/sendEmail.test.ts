// Lightweight unit test for sendEmail functionality
describe('sendEmail basic functionality', () => {
  test('sendEmail module loads correctly', async () => {
    const mod = await import('../utils/sendEmail.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});