require('../setup'); // (initialize stub resolution before requiring modules)

const assert = require('assert'); // (node assert for validation)
const { stubMethod, mockConsole, testEnv, stubs } = require('..'); // (import qtests utilities)
const { initSearchTest, resetMocks } = testEnv; // (extract env helpers)

async function searchTask(url){ // (test module performing http and logging)
  console.log(`searchTask is running with ${url}`); // (debug start log)
  try{ // (attempt api call)
    const axios = stubs.axios; // (directly use axios stub)
    const winston = stubs.winston; // (directly use winston stub)
    const logger = winston.createLogger(); // (create stubbed logger)
    await axios.post(url, {}); // (perform HTTP request)
    logger.info('request finished'); // (log completion)
    console.log(`searchTask is returning true`); // (debug return log)
    return true; // (return result)
  }catch(error){ // (handle error)
    console.log(`searchTask encountered ${error.message}`); // (error log)
    throw error; // (rethrow failure)
  }
}

test('integration scenario completes', async () => { //wrap IIFE in jest test
  const mocks = initSearchTest(); // (setup env and create mocks)
  let axiosCalled = false; // (track axios usage)
  const restorePost = stubMethod(stubs.axios, 'post', async () => { // (stub axios.post)
    axiosCalled = true; // (mark call)
    return {}; // (fake response)
  });
  let infoCalled = false; // (track logger info)
  const restoreLogger = stubMethod(stubs.winston, 'createLogger', () => ({ // (stub winston logger)
    info: () => { // (info method)
      infoCalled = true; // (mark log call)
    }
  }));

  const logSpy = mockConsole('log'); // (capture console.log output)
  const result = await searchTask('https://example.com'); // (execute module)
  assert.strictEqual(result, true); // (check result)
  assert(axiosCalled); // (verify axios used)
  assert(infoCalled); // (verify logger used)
  logSpy.mockRestore(); // (restore console.log)
  restorePost(); // (restore axios.post)
  restoreLogger(); // (restore winston.createLogger)
  resetMocks(mocks.mock, mocks.scheduleMock, mocks.qerrorsMock); // (clean mocks)
  console.log('integration test complete'); // (final log)
});
