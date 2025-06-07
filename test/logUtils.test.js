require('../setup'); //ensure stubs active

const assert = require('assert'); //built-in assertion library
const { logStart, logReturn } = require('../lib/logUtils'); //functions under test
const { mockConsole } = require('../utils/mockConsole'); //capture console output

function runTest(desc, testFn) {
  try {
    testFn();
    console.log(`\u2713 ${desc}`); //success indicator
  } catch (err) {
    console.error(`\u2717 ${desc}`); //failure indicator
    console.error(err);
    process.exitCode = 1; //signal test failure
  }
}

runTest('logStart logs correct start message', () => {
  const spy = mockConsole('log'); //replace console.log
  logStart('fn', 1, 2); //trigger log
  const last = spy.mock.calls.length - 1; //index of our log entry
  assert.strictEqual(spy.mock.calls[last][0], '[START] fn(1, 2)'); //check output
  spy.mockRestore(); //restore console.log
});

runTest('logReturn logs correct return message', () => {
  const spy = mockConsole('log'); //replace console.log
  logReturn('fn', 'value'); //trigger log
  const last = spy.mock.calls.length - 1; //index of our log entry
  assert.strictEqual(spy.mock.calls[last][0], '[RETURN] fn -> "value"'); //check output
  spy.mockRestore(); //restore console.log
});
