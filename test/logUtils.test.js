require('..').setup(); //ensure stubs active

const { logStart, logReturn } = require('../lib/logUtils'); //functions under test
const { withMockConsole } = require('../utils/testHelpers'); //(helper for console spies)

test('logStart logs correct start message', () => withMockConsole('log', spy => { //jest test for logStart with helper
  logStart('fn', 1, 2); //trigger log
  const last = spy.mock.calls.length - 1; //index of log entry
  expect(spy.mock.calls[last][0]).toBe('[START] fn(1, 2)'); //check output
}));

test('logReturn logs correct return message', () => withMockConsole('log', spy => { //jest test for logReturn with helper
  logReturn('fn', 'value'); //trigger log
  const last = spy.mock.calls.length - 1; //index of log entry
  expect(spy.mock.calls[last][0]).toBe('[RETURN] fn -> "value"'); //check output
}));

