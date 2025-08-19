// Lightweight unit test for envUtils.js - no complex operations
describe('envUtils.js basic exports', () => {
  test('module loads without errors', () => {
    expect(() => require('./envUtils.js')).not.toThrow();
    const mod = require('./envUtils.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});
