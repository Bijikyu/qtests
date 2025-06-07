require('../setup'); //load qtests setup for stub resolution

const { mockConsole } = require('../utils/mockConsole'); //import mockConsole utility for testing

describe('mockConsole', () => { //use describe to group related tests
  let originalLog; //store original console.log for restoration
  let spy; //reference to active console spy

  afterEach(() => { //restore console after each test
    if (spy) spy.mockRestore(); //restore console.log if spy created
    if (originalLog) console.log = originalLog; //return original console.log
    spy = null; //reset spy reference
    originalLog = null; //reset stored method
  });

  test('captures console output and restores method', () => { //verify spy capture workflow
    const recorded = []; //array records real console output
    originalLog = console.log; //keep original console.log
    console.log = (...args) => recorded.push(args); //override before spy creation
    spy = mockConsole('log'); //create spy for console.log
    console.log('first'); //call mocked method
    expect(spy.mock.calls.length).toBe(2); //first call logs spy setup
    expect(spy.mock.calls[1][0]).toBe('first'); //confirm argument captured
    expect(recorded.length).toBe(1); //verify override captured setup log
    spy.mockRestore(); //restore console.log
    console.log('second'); //call restored method
    expect(recorded.length).toBe(2); //ensure real console used again
  });

  test('mockImplementation overrides console behavior', () => { //verify custom implementation
    const customOut = []; //store custom output
    originalLog = console.log; //keep original console.log
    console.log = () => {}; //suppress console during test
    spy = mockConsole('log'); //create spy for console.log
    spy.mockImplementation(msg => customOut.push(msg)); //provide custom behavior
    console.log('override'); //call mocked method
    expect(customOut).toEqual(['override']); //confirm custom implementation used
    expect(spy.mock.calls.length).toBe(1); //spy recorded only call after override
  });
});
