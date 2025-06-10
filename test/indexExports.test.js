
const index = require('..'); // (load main exports)
const directStubMethod = require('../utils/stubMethod'); // (direct stubMethod for comparison)
const { mockConsole: directMockConsole } = require('../utils/mockConsole'); // (direct mockConsole for comparison)
const { withMockConsole } = require('../utils/testHelpers'); //(helper for console spies)

// Jest-style test verifying export presence
 test('index exports expected modules', () => {
  expect(typeof index.stubMethod).toBe('function'); // (stubMethod export must be a function)
  expect(typeof index.mockConsole).toBe('function'); // (mockConsole export must be a function)
  expect(typeof index.testEnv).toBe('object'); // (testEnv export should be an object)
  expect(typeof index.setup).toBe('function'); // (setup export is a callable helper)
  expect(typeof index.stubs).toBe('object'); // (stubs namespace object)
  expect(typeof index.stubs.axios).toBe('object'); // (axios stub object)
  expect(typeof index.stubs.winston).toBe('object'); // (winston stub object)
});

// Verify stubMethod behaves same via index
 test('stubMethod via index works like direct import', () => {
  const obj = { greet: () => 'hello' }; // (sample object with method)
  const restore = index.stubMethod(obj, 'greet', () => 'stub'); // (use index export)
  const result = obj.greet(); // (call stubbed method)
  restore(); // (restore original)
  expect(result).toBe('stub'); // (stubbed call result)
  expect(obj.greet()).toBe('hello'); // (restoration check)
  expect(index.stubMethod).toBe(directStubMethod); // (same function reference)
});

// Verify mockConsole behaves same via index
test('mockConsole via index works like direct import', () => withMockConsole('log', spy => { //(use helper for spy lifecycle)
  console.log('test'); // (emit log to be captured)
  expect(spy.mock.calls.length).toBe(3); // (expect creation log and test log)
  expect(spy.mock.calls[2][0]).toBe('test'); // (verify captured argument)
  expect(index.mockConsole).toBe(directMockConsole); // (same function reference)
}));

