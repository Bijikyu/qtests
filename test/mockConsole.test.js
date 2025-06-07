require('../setup'); //load qtests setup for stub resolution

const { mockConsole } = require('../utils/mockConsole'); //import mockConsole utility for testing
const assert = require('assert'); //core assertion library used for test verification

function verifySpyCaptures(){ //function tests call capture and output suppression
 console.log(`verifySpyCaptures is running with none`); //log function start per convention
 let realLog; //declare variable for original console method
 try{ //start error handling block
  const recorded = []; //store real console output for detection
  realLog = console.log; //save original console.log to restore later
  console.log = (...args)=>recorded.push(args); //override console.log before spying
  const spy = mockConsole('log'); //create console spy for log method
  console.log('first'); //call mocked console method
  assert.strictEqual(spy.mock.calls.length,2); //ensure spy recorded creation log and test call
  assert.strictEqual(spy.mock.calls[1][0],'first'); //ensure captured argument matches
  assert.strictEqual(recorded.length,1); //confirm only setup log reached real console
  spy.mockRestore(); //restore console.log using spy method
  console.log('second'); //call console.log after restore
  assert.strictEqual(recorded.length,2); //verify real console now captured restore call
  console.log(`verifySpyCaptures is returning true`); //log successful return
  console.log = realLog; //restore original console.log
  return true; //indicate test passed
 }catch(error){ //handle potential errors
  console.error(error); //log error for debugging
  if(realLog){ //ensure variable defined before use
   console.log = realLog; //restore original console.log on failure
  }
  return false; //indicate test failed
 }
} //end verifySpyCaptures

function verifyMockImplementation(){ //function tests mockImplementation override
 console.log(`verifyMockImplementation is running with none`); //log function start per convention
 let realLog; //declare variable for original console method
 try{ //start error handling block
  const customOut = []; //store output from custom implementation
  realLog = console.log; //save original console.log for restoration
  console.log = ()=>{}; //suppress real console output during test
  const spy = mockConsole('log'); //create console spy for log method
  spy.mockImplementation(msg=>customOut.push(msg)); //override console method with custom function
  console.log('override'); //call overridden console method
  assert.deepStrictEqual(customOut,['override']); //verify custom function captured call
  assert.strictEqual(spy.mock.calls.length,1); //spy only recorded creation log before override
  spy.mockRestore(); //restore console.log using spy method
  console.log = realLog; //restore original console.log
  console.log(`verifyMockImplementation is returning true`); //log successful return
  return true; //indicate test passed
 }catch(error){ //handle potential errors
  console.error(error); //log error for debugging
  if(realLog){ //ensure variable defined before use
   console.log = realLog; //restore original console.log on failure
  }
  return false; //indicate test failed
 }
} //end verifyMockImplementation

test('mockConsole captures calls', () => { //jest test verifying capture utility
  expect(verifySpyCaptures()).toBe(true); //expect helper to indicate success
});

test('mockImplementation override works', () => { //jest test verifying implementation override
  expect(verifyMockImplementation()).toBe(true); //expect helper to indicate success
});
