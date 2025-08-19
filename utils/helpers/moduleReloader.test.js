// Lightweight unit test for moduleReloader.js - no complex operations
describe('moduleReloader.js basic exports', () => {
  test('module loads without errors', () => {
    expect(() => require('./moduleReloader.js')).not.toThrow();
    const mod = require('./moduleReloader.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});
