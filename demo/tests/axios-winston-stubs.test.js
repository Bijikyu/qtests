// Ensure qtests stubs are active before importing modules that will be stubbed.
require('qtests/setup');

describe('qtests setup and basic stubs', () => {
  it('exposes setupComplete after setup', () => {
    const setupMod = require('qtests/setup');
    // Support both ESM and CJS interop.
    const setupComplete = setupMod && (setupMod.setupComplete || setupMod.default?.setupComplete);
    expect(setupComplete).toBe(true);
  });

  it('can require winston without polluting output', () => {
    const winston = require('winston');
    expect(typeof winston).toBe('object');
  });
});
