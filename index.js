const stubMethod = require('./utils/stubMethod');

module.exports = {
  stubMethod,
  setup: require('./setup'),
  stubs: {
    axios: require('./stubs/axios'),
    winston: require('./stubs/winston')
  }
};