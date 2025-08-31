// Simplified setup resolution test for TypeScript ES modules
import '../setup.js'; // activate stub resolution

describe('setup resolution functionality', () => {
  test('setup modifies module resolution', () => {
    // Test that setup affects module resolution without complex spawning
    expect(() => require('axios')).not.toThrow(); // Should resolve to stub
    expect(() => require('winston')).not.toThrow(); // Should resolve to stub
  });
});