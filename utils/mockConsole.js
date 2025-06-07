
const { logStart, logReturn } = require('../lib/logUtils');

function mockConsole(method) {
  logStart('mockConsole', method);
  
  // Store original method
  const originalMethod = console[method];
  
  // Create mock implementation
  const calls = [];
  const mockImpl = (...args) => {
    calls.push(args);
  };
  
  // Replace console method
  console[method] = mockImpl;
  
  // Create spy object similar to Jest spy
  const spy = {
    mockImplementation: (fn) => {
      console[method] = fn || (() => {});
      return spy;
    },
    mockRestore: () => {
      console[method] = originalMethod;
    },
    mock: {
      calls: calls
    }
  };
  
  logReturn('mockConsole', 'spy');
  return spy;
}

module.exports = { mockConsole };
