// Lightweight unit test for consoleMocker.js - no complex operations
describe('consoleMocker.js basic exports', () => {
  test('module loads without errors', () => {
    expect(() => require('./consoleMocker.js')).not.toThrow();
    const mod = require('./consoleMocker.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});
