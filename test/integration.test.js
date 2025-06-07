require('..').setup(); //initialize stub resolution before requiring modules

const { stubMethod, mockConsole, testEnv, stubs } = require('..'); //import qtests utilities
const { initSearchTest, resetMocks } = testEnv; //extract env helpers
const { executeWithLogs } = require('../lib/logUtils'); //(import executeWithLogs)

async function searchTask(url){ //test module performing http and logging
  return executeWithLogs('searchTask', async target => { //(delegate to executeWithLogs)
    const axios = stubs.axios; //directly use axios stub
    const winston = stubs.winston; //directly use winston stub
    const logger = winston.createLogger(); //create stubbed logger
    await axios.post(target, {}); //perform HTTP request
    logger.info('request finished'); //log completion
    return true; //return result
  }, url);
}

test('integration flow using stubs', async () => { //jest test executing searchTask
  const mocks = initSearchTest(); //setup env and create mocks
  let axiosCalled = false; //track axios usage
  const restorePost = stubMethod(stubs.axios, 'post', async () => { //stub axios.post
    axiosCalled = true; //mark call
    return {}; //fake response
  });
  let infoCalled = false; //track logger info
  const restoreLogger = stubMethod(stubs.winston, 'createLogger', () => ({ //stub winston logger
    info: () => { //info method
      infoCalled = true; //mark log call
    }
  }));

  const logSpy = mockConsole('log'); //capture console.log output
  const result = await searchTask('https://example.com'); //execute module
  expect(result).toBe(true); //check result
  expect(axiosCalled).toBe(true); //verify axios used
  expect(infoCalled).toBe(true); //verify logger used
  logSpy.mockRestore(); //restore console.log
  restorePost(); //restore axios.post
  restoreLogger(); //restore winston.createLogger
  resetMocks(mocks.mock, mocks.scheduleMock, mocks.qerrorsMock); //clean mocks
});

