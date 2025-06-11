
const { withMockConsole } = require('../utils/testHelpers'); //import helper handling console spies


test('mockConsole captures calls and restores', async () => { //verify helper restores console
  const recorded = []; //array for captured logs
  await withMockConsole('log', spy => { //use helper to manage spy lifecycle
    spy.mockImplementation((...args) => recorded.push(args)); //capture log calls
    console.log('first'); //invoke mocked console
    expect(spy.mock.calls.length).toBe(3); //spy tracks creation and call
    expect(spy.mock.calls[2][0]).toBe('first'); //argument captured correctly
  });
  console.log('second'); //original console after helper cleanup
  expect(recorded.length).toBe(2); //new expectation includes helper log
});

test('mockConsole mockImplementation works', () => withMockConsole('log', spy => { //helper handles spy cleanup
  const customOut = []; //capture overridden output
  spy.mockImplementation(msg => customOut.push(msg)); //replace console.log
  console.log('override'); //trigger custom output
  expect(customOut).toEqual(['override']); //custom function captured call
  expect(spy.mock.calls.length).toBe(3); //spy tracked creation and call
  expect(spy.mock.calls[2][0]).toBe('override'); //argument stored correctly
}));

test('mockConsole tracks calls after reimplementation', () => withMockConsole('log', spy => { //helper manages spy between implementations
  const firstOut = []; //capture first custom output
  const secondOut = []; //capture second custom output
  spy.mockImplementation(msg => firstOut.push(msg)); //initial implementation
  console.log('one'); //call using first implementation
  spy.mockImplementation(msg => secondOut.push(msg)); //change implementation
  console.log('two'); //call using second implementation
  expect(firstOut).toEqual(['one']); //first output captured
  expect(secondOut).toEqual(['two']); //second output captured
  expect(spy.mock.calls.length).toBe(4); //spy logged creation and two calls
  expect(spy.mock.calls[2][0]).toBe('one'); //first call argument tracked
  expect(spy.mock.calls[3][0]).toBe('two'); //second call argument tracked
}));

test('mockRestore clears calls and resets method', () => { //verify fallback clean up
  const saved = global.jest; //save jest reference for restoration
  global.jest = undefined; //force fallback path by removing jest
  delete require.cache[require.resolve('../utils/mockConsole')]; //ensure fallback load
  const { mockConsole } = require('../utils/mockConsole'); //direct import after change
  const orig = console.log; //store original method for comparison
  const spy = mockConsole('log'); //create manual spy using fallback
  console.log('first'); //trigger captured call
  expect(spy.mock.calls.length).toBe(2); //call history includes creation log
  spy.mockRestore(); //run cleanup to restore and clear
  console.log('second'); //ensure restored method runs without capturing
  expect(console.log).toBe(orig); //method restored to original
  const cleared = spy.mock.calls === null || spy.mock.calls.length === 0; //verify cleared history
  expect(cleared).toBe(true); //array cleared or reference removed
  global.jest = saved; //restore jest global for remaining tests
  delete require.cache[require.resolve('../utils/mockConsole')]; //clear fallback cache
  require('../utils/mockConsole'); //reload module with jest available
});

