
const { logStart, logReturn } = require('../lib/logUtils'); //functions under test
const { mockConsole } = require('../utils/mockConsole'); //capture console output

test('logStart logs correct start message', () => { //jest test for logStart
  const spy = mockConsole('log'); //replace console.log
  logStart('fn', 1, 2); //trigger log
  const last = spy.mock.calls.length - 1; //index of log entry
  expect(spy.mock.calls[last][0]).toBe('[START] fn(1, 2)'); //check output
  spy.mockRestore(); //restore console.log
});

test('logReturn logs correct return message', () => { //jest test for logReturn
  const spy = mockConsole('log'); //replace console.log
  logReturn('fn', 'value'); //trigger log
  const last = spy.mock.calls.length - 1; //index of log entry
  expect(spy.mock.calls[last][0]).toBe('[RETURN] fn -> "value"'); //check output
  spy.mockRestore(); //restore console.log
});

