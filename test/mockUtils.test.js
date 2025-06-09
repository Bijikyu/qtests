const { attachMockSpies, makeLoggedMock } = require('../utils/testEnv'); // (import spy helpers)
const vm = require('vm'); // (node vm for isolated context)
const { withMockConsole } = require('../utils/testHelpers'); // (helper for log spies)

// Ensure attachMockSpies provides jest.fn helpers when jest is present
test('attachMockSpies uses jest spies when available', () => {
  const mock = function(){}; // (simple mock target)
  attachMockSpies(mock); // (enhance mock)
  expect(typeof mock.mockClear).toBe('function'); // (mockClear present)
  expect(typeof mock.mockReset).toBe('function'); // (mockReset present)
  expect(mock.mockClear.mock).toBeDefined(); // (jest.fn applied)
  expect(mock.mockReset.mock).toBeDefined(); // (jest.fn applied)
});

// Ensure attachMockSpies falls back to plain functions when jest is missing
test('attachMockSpies adds noops without jest', () => {
  const saved = global.jest; // (backup jest global)
  delete global.jest; // (simulate non-jest env)
  const attachIsolated = vm.runInNewContext(`(${attachMockSpies.toString()})`, { jest: undefined, logStart: () => {}, logReturn: () => {} }); // (recreate helper without jest)
  const mock = function(){}; // (mock to enhance)
  attachIsolated(mock); // (apply helper in vm context)
  expect(typeof mock.mockClear).toBe('function'); // (mockClear created)
  expect(typeof mock.mockReset).toBe('function'); // (mockReset created)
  expect(mock.mockClear.mock).toBeUndefined(); // (not a jest.fn)
  expect(mock.mockReset.mock).toBeUndefined(); // (not a jest.fn)
  global.jest = saved; // (restore jest global)
});

// Verify makeLoggedMock logs execution and returns enhanced mock
test('makeLoggedMock logs and returns mock with spies', () => withMockConsole('log', spy => {
  const mock = makeLoggedMock('sample', () => ({})); // (create logged mock)
  const logs = spy.mock.calls.map(c => c[0]); // (capture log lines)
  expect(logs).toContain('sample is running with "none"'); // (start log present)
  expect(logs).toContain('sample is returning {}'); // (end log present)
  expect(typeof mock.mockClear).toBe('function'); // (mockClear exists)
  expect(typeof mock.mockReset).toBe('function'); // (mockReset exists)
}));
