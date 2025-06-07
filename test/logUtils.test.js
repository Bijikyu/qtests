require('..').setup(); //ensure stubs active

const { logStart, logReturn, executeWithLogs } = require('../lib/logUtils'); //functions under test
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

test('executeWithLogs wraps sync function', () => { //jest test for executeWithLogs sync
  const spy = mockConsole('log'); //replace console.log
  function add(a, b){ //simple addition
    return a + b; //return sum
  }
  const res = executeWithLogs('add', add, 1, 2); //execute with logging
  expect(res).toBe(3); //verify result
  expect(spy.mock.calls[1][0]).toBe('add is running with 1, 2'); //check start log
  const last = spy.mock.calls.length - 1; //index of last log
  expect(spy.mock.calls[last][0]).toBe('add is returning 3'); //check return log
  spy.mockRestore(); //restore console.log
});

test('executeWithLogs wraps async function', async () => { //jest test for executeWithLogs async
  const spy = mockConsole('log'); //replace console.log
  async function fetchVal(){ //dummy async
    return 'ok'; //return value
  }
  const res = await executeWithLogs('fetchVal', fetchVal); //execute with logging
  expect(res).toBe('ok'); //verify result
  expect(spy.mock.calls[1][0]).toBe('fetchVal is running with none'); //check start log
  const last = spy.mock.calls.length - 1; //index of last log
  expect(spy.mock.calls[last][0]).toBe('fetchVal is returning "ok"'); //check return log
  spy.mockRestore(); //restore console.log
});

