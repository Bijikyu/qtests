// Lightweight unit test for dataUtils.js - no complex operations
describe('dataUtils.js basic exports', () => {
  test('module loads without errors', () => {
    expect(() => require('./dataUtils.js')).not.toThrow();
    const mod = require('./dataUtils.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});
