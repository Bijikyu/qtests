// Lightweight unit test for setup.js - no complex operations
describe('setup.js basic exports', () => {
  test('module loads without errors', () => {
    expect(() => require('./setup.js')).not.toThrow();
    const mod = require('./setup.js');
    expect(mod).toBeDefined();
  });
});
