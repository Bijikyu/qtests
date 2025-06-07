require('../setup'); //ensure stubs active

const { logStart, logReturn } = require('../lib/logUtils'); //functions under test
const { mockConsole } = require('../utils/mockConsole'); //capture console output

describe('logUtils', () => { //replace custom runTest with jest describe block
  let spy; //store console spy for each test

  afterEach(() => { //ensure spy restoration after each test
    if (spy) spy.mockRestore(); //restore console.log safely
  });

  test('logStart logs correct start message', () => { //jest test block for logStart
    spy = mockConsole('log'); //replace console.log
    logStart('fn', 1, 2); //trigger log
    const last = spy.mock.calls.length - 1; //index of our log entry
    expect(spy.mock.calls[last][0]).toBe('[START] fn(1, 2)'); //assert with jest expect
  });

  test('logReturn logs correct return message', () => { //jest test block for logReturn
    spy = mockConsole('log'); //replace console.log
    logReturn('fn', 'value'); //trigger log
    const last = spy.mock.calls.length - 1; //index of our log entry
    expect(spy.mock.calls[last][0]).toBe('[RETURN] fn -> "value"'); //assert with jest expect
  });
});
