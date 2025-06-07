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

describe('integration', () => { // (group integration tests)
  let mocks; // (store initialized mocks)
  let restorePost; // (function to restore axios)
  let restoreLogger; // (function to restore winston)
  let logSpy; // (console spy)
  let axiosCalled; // (flag for axios use)
  let infoCalled; // (flag for winston use)

  beforeEach(() => { // (setup fresh environment for each test)
    mocks = initSearchTest(); // (initialize stubs and env)
    axiosCalled = false; // (reset axios flag)
    restorePost = stubMethod(stubs.axios, 'post', async () => { // (stub axios.post)
      axiosCalled = true; // (mark axios call)
      return {}; // (fake response)
    });
    infoCalled = false; // (reset winston flag)
    restoreLogger = stubMethod(stubs.winston, 'createLogger', () => ({ // (stub winston logger)
      info: () => { // (info method)
        infoCalled = true; // (mark log call)
      }
    }));
    logSpy = mockConsole('log'); // (capture console.log output)
  });

  afterEach(() => { // (clean up stubs after each test)
    logSpy.mockRestore(); // (restore console.log)
    restorePost(); // (restore axios.post)
    restoreLogger(); // (restore winston.createLogger)
    resetMocks(mocks.mock, mocks.scheduleMock, mocks.qerrorsMock); // (reset dependency mocks)
  });

  test('searchTask posts to axios and logs info', async () => { // (verify searchTask behaviour)
    const result = await searchTask('https://example.com'); // (execute module)
    assert.strictEqual(result, true); // (check result)
    assert(axiosCalled); // (verify axios used)
    assert(infoCalled); // (verify logger used)
  });
});
