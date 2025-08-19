// Lightweight unit test for keyGenerator.js - no complex operations
describe('keyGenerator.js basic exports', () => {
  test('module loads without errors', () => {
    expect(() => require('./keyGenerator.js')).not.toThrow();
    const mod = require('./keyGenerator.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});
