// Lightweight unit test for sendEmail.js - no complex operations
describe('sendEmail.js basic exports', () => {
  test('module loads without errors', () => {
    expect(() => require('../utils/sendEmail.js')).not.toThrow();
    const mod = require('../utils/sendEmail.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});