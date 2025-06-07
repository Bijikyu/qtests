const stubMethod = require('./utils/stubMethod');
const { mockConsole } = require('./utils/mockConsole');
const testEnv = require('./utils/testEnv');

module.exports = {
  stubMethod,
  mockConsole,
  testEnv,
  setup: require('./setup'),
  stubs: {
    axios: require('./stubs/axios'),
    winston: require('./stubs/winston')
  }
};