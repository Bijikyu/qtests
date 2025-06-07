require('..').setup(); //load qtests setup for stub resolution

const { mockConsole } = require('../utils/mockConsole'); //import mockConsole utility for testing

function withTempConsole(fn){ //helper ensures console restored
  console.log(`withTempConsole is running with ${fn.name || 'anon'}`); //log start of helper
  const realLog = console.log; //store original console.log
  try{ //attempt to run wrapped function
    const res = fn(realLog); //execute callback with backup
    console.log(`withTempConsole is returning ${res}`); //log return value
    return res; //return result to caller
  }
  catch(err){ //propagate error while logging
    console.log(`withTempConsole error ${err}`); //log error
    throw err; //rethrow to fail test
  }
  finally{ //ensure restoration even on failure
    console.log = realLog; //restore original console.log
  }
} //end helper

test('mockConsole captures calls and restores', () => withTempConsole(realLog => { //jest test verifying spy
  const recorded = []; //store real console output
  console.log = (...args) => recorded.push(args); //override console.log
  const spy = mockConsole('log'); //create console spy for log method
  console.log('first'); //call mocked console method
  expect(spy.mock.calls.length).toBe(2); //spy recorded creation and call
  expect(spy.mock.calls[1][0]).toBe('first'); //captured argument matches
  expect(recorded.length).toBe(1); //only setup log reached real console
  spy.mockRestore(); //restore console.log via spy
  console.log('second'); //call console.log after restore
  expect(recorded.length).toBe(2); //real console captured restore call
}));

test('mockConsole mockImplementation works', () => withTempConsole(() => { //jest test verifying mockImplementation
  const customOut = []; //array to capture custom output
  console.log = () => {}; //silence console during test
  const spy = mockConsole('log'); //create console spy for log method
  spy.mockImplementation(msg => customOut.push(msg)); //override console.log
  console.log('override'); //call overridden console method
  expect(customOut).toEqual(['override']); //custom function captured call
  expect(spy.mock.calls.length).toBe(2); //tracks override call as well
  expect(spy.mock.calls[1][0]).toBe('override'); //second call stores argument
  spy.mockRestore(); //restore console.log via spy
}));

test('mockConsole tracks calls after reimplementation', () => withTempConsole(() => { //verify multiple overrides
  const firstOut = []; //array for first implementation
  const secondOut = []; //array for second implementation
  console.log = () => {}; //silence console during test
  const spy = mockConsole('log'); //create console spy for log method
  spy.mockImplementation(msg => firstOut.push(msg)); //first custom behavior
  console.log('one'); //call with first implementation
  spy.mockImplementation(msg => secondOut.push(msg)); //second custom behavior
  console.log('two'); //call with second implementation
  expect(firstOut).toEqual(['one']); //first custom function captured call
  expect(secondOut).toEqual(['two']); //second custom function captured call
  expect(spy.mock.calls.length).toBe(3); //tracks creation and both calls
  expect(spy.mock.calls[1][0]).toBe('one'); //first tracked arg correct
  expect(spy.mock.calls[2][0]).toBe('two'); //second tracked arg correct
  spy.mockRestore(); //restore console.log via spy
}));

