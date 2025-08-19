// Lightweight unit test for coreUtils.js - no complex operations
describe('coreUtils.js basic exports', () => {
  test('module loads without errors', () => {
    expect(() => require('./coreUtils.js')).not.toThrow();
    const mod = require('./coreUtils.js');
    expect(mod).toBeDefined();
  });
});
