const {
  stubQerrors,
  reload,
  createJsonRes,
  createRes,
  generateKey,
  backupEnvVars,
  restoreEnvVars,
  withMockConsole,
  withSavedEnv
} = require('../utils/testHelpers'); //import utilities under test

jest.mock('qerrors', () => ({ qerrors: jest.fn(() => 'orig') }), { virtual: true }); //mock qerrors module for stub test

test('stubQerrors reloads offlineMode and stubs method', () => withMockConsole('log', () => { //wrap logs to avoid output
  const offlineBefore = require('../utils/offlineMode'); //require module before stubbing
  const qerrors = require('qerrors'); //get mocked qerrors module
  const origFn = qerrors.qerrors; //save original implementation
  stubQerrors(); //invoke stub to replace function and reload module
  const offlineAfter = require('../utils/offlineMode'); //require again for fresh module
  expect(qerrors.qerrors).not.toBe(origFn); //function should be replaced
  expect(offlineAfter.getQerrors().qerrors).toBe(qerrors.qerrors); //offline module uses stubbed function
}));

test('reload returns fresh module instance', () => withMockConsole('log', () => { //suppress logs
  const { execFileSync } = require('child_process'); //use child process for clean require cache
  const path = require('path'); //resolve helper
  const script = path.join(__dirname, 'reloadCheck.js'); //child script path
  const out = execFileSync(process.execPath, [script]).toString(); //run child script
  const line = out.trim().split('\n').pop(); //take last line for data
  const { val1, val2 } = JSON.parse(line); //parse values from child
  expect(val2).toBe(val1 + 1); //reload should increment value
}));

test('createJsonRes returns object with tracking json', () => withMockConsole('log', () => { //hide logs
  const res = createJsonRes(); //create response object
  res.json({ ok: true }); //invoke json
  expect(res.json.mock.calls[0][0]).toEqual({ ok: true }); //spy captured argument
  expect(res.json.mock.calls.length).toBe(1); //spy recorded call count
}));

test('createRes tracks methods and chains', () => withMockConsole('log', () => { //mute console
  const res = createRes(); //create comprehensive response mock
  const chain = res.status(201).json({ done: true }).end(); //call methods in chain
  expect(chain).toBe(res); //methods chain to original object
  expect(res.status.mock.calls[0][0]).toBe(201); //status argument tracked
  expect(res.json.mock.calls[0][0]).toEqual({ done: true }); //json argument tracked
  expect(res.end.mock.calls.length).toBe(1); //end recorded
}));

test('generateKey creates predictable keys', () => withMockConsole('log', () => { //suppress log output
  jest.spyOn(Date, 'now').mockReturnValue(1000); //freeze timestamp
  expect(generateKey()).toBe('test-api-key-1000'); //timestamp key
  expect(generateKey('user')).toBe('test-api-key-user'); //suffix key
  Date.now.mockRestore(); //restore original function
}));

test('backupEnvVars and restoreEnvVars round trip', () => withMockConsole('log', () => withSavedEnv(() => { //wrap env lifecycle
  process.env.TEMP_VAR = 'first'; //set initial value
  const backup = backupEnvVars(); //snapshot environment
  process.env.TEMP_VAR = 'second'; //modify value
  process.env.EXTRA_VAR = 'add'; //add new variable
  restoreEnvVars(backup); //restore snapshot
  expect(process.env.TEMP_VAR).toBe('first'); //original value restored
  expect(process.env.EXTRA_VAR).toBeUndefined(); //added variable removed
})));

test('withMockConsole returns callback result', async () => { //verify helper passes result back
  const result = await withMockConsole('log', () => 'ok'); //use helper with simple callback
  expect(result).toBe('ok'); //returned value should match
});

test('withMockConsole restores console method', async () => { //ensure console restored after helper
  const original = console.log; //save current console.log reference
  await withMockConsole('log', () => console.log('run')); //invoke helper using log
  expect(console.log).toBe(original); //console.log should be restored
});

test('reload skips when lock present', () => withMockConsole('log', () => { //verify lock prevents duplicate reload
  const path = require('path'); //path for resolving
  const full = path.resolve(__dirname, 'fixtures/reloadTarget'); //path used by reload
  const { moduleReloadLock } = require('../utils/testHelpers'); //import lock set
  moduleReloadLock.add(full); //simulate concurrent reload in progress
  const before = require('./fixtures/reloadTarget'); //cached module
  const after = reload('../test/fixtures/reloadTarget'); //attempt reload while locked
  expect(after).toBe(before); //module should be same when skipped
  moduleReloadLock.delete(full); //cleanup lock after test
}));
