const stubMethod = require('./utils/stubMethod');
const { mockConsole } = require('./utils/mockConsole');

module.exports = {
  stubMethod,
  mockConsole,
  setup: require('./setup'),
  stubs: {
    axios: require('./stubs/axios'),
    winston: require('./stubs/winston')
  }
};