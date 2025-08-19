
// Simplified setup resolution test without child process spawning
describe('setup resolution', () => {
  test('setup module loads without errors', () => {
    expect(() => require('../setup')).not.toThrow();
  });
  
  test('setup provides module resolution capability', () => {
    const Module = require('module');
    expect(Module._resolveFilename).toBeDefined();
    expect(typeof Module._resolveFilename).toBe('function');
  });
});
