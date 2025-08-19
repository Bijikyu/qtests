// Lightweight unit test for logUtils.js - no complex operations
describe('logUtils.js basic exports', () => {
  test('module loads without errors', () => {
    expect(() => require('./logUtils.js')).not.toThrow();
    const mod = require('./logUtils.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});
