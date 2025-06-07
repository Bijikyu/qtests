require('..').setup(); //load qtests setup for stub resolution

const { mockConsole } = require('../utils/mockConsole'); //import mockConsole utility for testing

test('mockConsole captures calls and restores', () => { //jest test verifying spy
  const recorded = []; //store real console output
  const realLog = console.log; //save original console.log
  console.log = (...args) => recorded.push(args); //override console.log
  const spy = mockConsole('log'); //create console spy for log method
  console.log('first'); //call mocked console method
  expect(spy.mock.calls.length).toBe(2); //spy recorded creation and call
  expect(spy.mock.calls[1][0]).toBe('first'); //captured argument matches
  expect(recorded.length).toBe(1); //only setup log reached real console
  spy.mockRestore(); //restore console.log via spy
  console.log('second'); //call console.log after restore
  expect(recorded.length).toBe(2); //real console captured restore call
  console.log = realLog; //restore original console.log
});

test('mockConsole mockImplementation works', () => { //jest test verifying mockImplementation
  const customOut = []; //array to capture custom output
  const realLog = console.log; //save original console.log
  console.log = () => {}; //silence console during test
  const spy = mockConsole('log'); //create console spy for log method
  spy.mockImplementation(msg => customOut.push(msg)); //override console.log
  console.log('override'); //call overridden console method
  expect(customOut).toEqual(['override']); //custom function captured call
  expect(spy.mock.calls.length).toBe(2); //tracks override call as well
  expect(spy.mock.calls[1][0]).toBe('override'); //second call stores argument
  spy.mockRestore(); //restore console.log via spy
  console.log = realLog; //restore original console.log
});

test('mockConsole tracks calls after reimplementation', () => { //verify multiple overrides
  const firstOut = []; //array for first implementation
  const secondOut = []; //array for second implementation
  const realLog = console.log; //save original console.log
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
  console.log = realLog; //restore original console.log
});

