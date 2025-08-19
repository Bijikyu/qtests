// Lightweight resolveStubPaths test - no child process spawning
describe('resolveStubPaths basic tests', () => {
  test('setup module loads without errors', () => {
    expect(() => require('../setup')).not.toThrow();
    const Module = require('module');
    expect(Module._resolveFilename).toBeDefined();
  });
});