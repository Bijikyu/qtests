// Lightweight unit test for envManager.js - no complex operations
describe('envManager.js basic exports', () => {
  test('module loads without errors', () => {
    expect(() => require('./envManager.js')).not.toThrow();
    const mod = require('./envManager.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});
