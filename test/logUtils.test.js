require('../setup'); //ensure stubs active

const assert = require('assert'); //built-in assertion library
const { logStart, logReturn } = require('../lib/logUtils'); //functions under test
const { mockConsole } = require('../utils/mockConsole'); //capture console output

describe('logUtils', () => { // (group log utility tests)
  let spy; // (console spy holder)

  afterEach(() => { // (restore console after each test)
    spy.mockRestore(); // (restore console.log)
  });

  test('logStart logs correct start message', () => { // (verify logStart output)
    spy = mockConsole('log'); // (replace console.log)
    logStart('fn', 1, 2); // (trigger log)
    const last = spy.mock.calls.length - 1; // (index of our log entry)
    assert.strictEqual(spy.mock.calls[last][0], '[START] fn(1, 2)'); // (check output)
  });

  test('logReturn logs correct return message', () => { // (verify logReturn output)
    spy = mockConsole('log'); // (replace console.log)
    logReturn('fn', 'value'); // (trigger log)
    const last = spy.mock.calls.length - 1; // (index of our log entry)
    assert.strictEqual(spy.mock.calls[last][0], '[RETURN] fn -> "value"'); // (check output)
  });
});
