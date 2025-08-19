// Lightweight unit test for index.js - no complex module loading
describe('index.js basic exports', () => {
  test('module exports exist', () => {
    // Simple existence check without loading complex dependencies
    expect(() => require('./index.js')).not.toThrow();
    const mod = require('./index.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});
