require('../setup'); //ensure stubs active

const assert = require('assert'); //built-in assertion library (kept for internal checks)
const { logStart, logReturn } = require('../lib/logUtils'); //functions under test
const { mockConsole } = require('../utils/mockConsole'); //capture console output

test('logStart logs correct start message', () => { //wrap in jest test to satisfy jest
  const spy = mockConsole('log'); //replace console.log
  logStart('fn', 1, 2); //trigger log
  const last = spy.mock.calls.length - 1; //index of our log entry
  expect(spy.mock.calls[last][0]).toBe('[START] fn(1, 2)'); //assert log output
  spy.mockRestore(); //restore console.log
});

test('logReturn logs correct return message', () => { //wrap second check in jest test
  const spy = mockConsole('log'); //replace console.log
  logReturn('fn', 'value'); //trigger log
  const last = spy.mock.calls.length - 1; //index of our log entry
  expect(spy.mock.calls[last][0]).toBe('[RETURN] fn -> "value"'); //assert log output
  spy.mockRestore(); //restore console.log
});
