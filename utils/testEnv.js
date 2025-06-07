
const { logStart, logReturn } = require('../lib/logUtils');

function setTestEnv() {
  logStart('setTestEnv', 'default values');
  process.env.GOOGLE_API_KEY = 'key';
  process.env.GOOGLE_CX = 'cx';
  process.env.OPENAI_TOKEN = 'token';
  logReturn('setTestEnv', true);
  return true;
}

function saveEnv() {
  logStart('saveEnv', 'none');
  const savedEnv = { ...process.env };
  logReturn('saveEnv', 'env stored');
  return savedEnv;
}

function restoreEnv(savedEnv) {
  logStart('restoreEnv', 'env restore');
  Object.keys(process.env).forEach(k => delete process.env[k]);
  Object.assign(process.env, savedEnv);
  logReturn('restoreEnv', true);
  return true;
}

function createScheduleMock() {
  logStart('createScheduleMock', 'none');
  
  // Create a simple mock function for non-Jest environments
  const scheduleMock = function(fn) {
    return Promise.resolve(fn());
  };
  
  // Add Jest-like methods if available
  if (typeof jest !== 'undefined') {
    scheduleMock.mockClear = jest.fn();
    scheduleMock.mockReset = jest.fn();
  } else {
    // Fallback implementations
    scheduleMock.mockClear = () => {};
    scheduleMock.mockReset = () => {};
  }
  
  logReturn('createScheduleMock', 'mock');
  return scheduleMock;
}

function createQerrorsMock() {
  logStart('createQerrorsMock', 'none');
  
  // Create a mock function
  const qerrorsMock = function(...args) {
    return args;
  };
  
  // Add Jest-like methods
  if (typeof jest !== 'undefined') {
    qerrorsMock.mockReset = jest.fn();
    qerrorsMock.mockClear = jest.fn();
  } else {
    // Fallback implementations
    qerrorsMock.mockReset = () => {};
    qerrorsMock.mockClear = () => {};
  }
  
  logReturn('createQerrorsMock', 'mock');
  return qerrorsMock;
}

function createAxiosMock() {
  logStart('createAxiosMock', 'none');
  
  // Simple axios mock without external dependencies
  const mock = {
    onGet: function(url) {
      return {
        reply: function(status, data) {
          this._replies = this._replies || {};
          this._replies[url] = { status, data };
          return this;
        }
      };
    },
    onPost: function(url) {
      return {
        reply: function(status, data) {
          this._replies = this._replies || {};
          this._replies[url] = { status, data };
          return this;
        }
      };
    },
    reset: function() {
      this._replies = {};
    }
  };
  
  logReturn('createAxiosMock', 'adapter');
  return mock;
}

function resetMocks(mock, scheduleMock, qerrorsMock) {
  logStart('resetMocks', 'mocks');
  
  if (mock && mock.reset) {
    mock.reset();
  }
  
  if (scheduleMock && scheduleMock.mockClear) {
    scheduleMock.mockClear();
  }
  
  if (qerrorsMock && qerrorsMock.mockClear) {
    qerrorsMock.mockClear();
  }
  
  logReturn('resetMocks', true);
  return true;
}

function initSearchTest() {
  logStart('initSearchTest', 'none');
  
  // Reset modules if in Jest environment
  if (typeof jest !== 'undefined' && jest.resetModules) {
    jest.resetModules();
  }
  
  setTestEnv();
  const scheduleMock = createScheduleMock();
  const qerrorsMock = createQerrorsMock();
  const mock = createAxiosMock();
  
  logReturn('initSearchTest', 'mocks');
  return { mock, scheduleMock, qerrorsMock };
}

module.exports = {
  setTestEnv,
  saveEnv,
  restoreEnv,
  createScheduleMock,
  createQerrorsMock,
  createAxiosMock,
  resetMocks,
  initSearchTest
};
