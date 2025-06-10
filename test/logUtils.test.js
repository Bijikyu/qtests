

const { withMockConsole } = require('../utils/testHelpers'); //(helper for console spies)


const { logStart, logReturn, executeWithLogs } = require('../lib/logUtils'); //functions under test, includes executeWithLogs


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

test('executeWithLogs wraps sync function', () => withMockConsole('log', spy => { //jest test for executeWithLogs sync with helper
  function add(a, b){ //simple addition
    return a + b; //return sum
  }
  const res = executeWithLogs('add', add, 1, 2); //execute with logging
  expect(res).toBe(3); //verify result
  expect(spy.mock.calls[3][0]).toBe('add is running with 1, 2'); //check start log
  const last = spy.mock.calls.length - 1; //index of last log
  expect(spy.mock.calls[last][0]).toBe('add is returning 3'); //check return log
}));

test('executeWithLogs wraps async function', async () => withMockConsole('log', async spy => { //jest test for executeWithLogs async with helper
  async function fetchVal(){ //dummy async
    return 'ok'; //return value
  }
  const res = await executeWithLogs('fetchVal', fetchVal); //execute with logging
  expect(res).toBe('ok'); //verify result
  expect(spy.mock.calls[2][0]).toBe('fetchVal is running with none'); //check start log
  const last = spy.mock.calls.length - 1; //index of last log
  expect(spy.mock.calls[last][0]).toBe('fetchVal is returning "ok"'); //check return log
}));

