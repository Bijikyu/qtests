# qtests

**qtests** is a comprehensive Node.js testing framework that provides zero-dependency utilities for fast, isolated unit testing. It includes advanced method stubbing, console mocking, environment management, and drop-in replacements for popular modules like `axios` and `winston` so you can run tests without external dependencies, network calls, or log pollution.

---

## Installation

```bash
npm install qtests --save-dev
```

or

```bash
yarn add qtests --dev
```

---

## Features

* **Method Stubbing**: Temporarily replace object methods with automatic restoration
* **Console Mocking**: Jest-compatible console spies with fallback for vanilla Node.js
* **Environment Management**: Safe backup and restore of environment variables
* **Module Stubs**: Drop-in replacements for axios, winston, and other common dependencies
* **Offline Mode**: Automatic stub resolution when external services are unavailable
* **Zero Dependencies**: No production dependencies to bloat your project
* **Thread Safe**: Concurrent test execution support with race condition prevention
* **Framework Agnostic**: Works with Jest, Mocha, and vanilla Node.js testing

---

## Quick Start

### Basic Setup

```js
// At the top of your test files
require('qtests/setup');

// Your tests now use stubs automatically
const axios = require('axios'); // Uses qtests axios stub
const winston = require('winston'); // Uses qtests winston stub
```

### Method Stubbing

```js
const { stubMethod } = require('qtests');

const myObj = { greet: name => `Hello, ${name}!` };

// Stub the method
const restore = stubMethod(myObj, 'greet', () => 'Hi!');
console.log(myObj.greet('Brian')); // 'Hi!'

// Restore original
restore();
console.log(myObj.greet('Brian')); // 'Hello, Brian!'
```

### Console Mocking

```js
const { mockConsole } = require('qtests');

const spy = mockConsole('log');
console.log('test message');

console.log(spy.mock.calls); // [['test message']]
spy.mockRestore(); // Restore original console.log
```

### Environment Management

```js
const { testEnv } = require('qtests');

// Set test environment
testEnv.setTestEnv(); // Sets NODE_ENV=test, DEBUG=qtests:*

// Save and restore environment using helpers
const saved = testEnv.saveEnv();
process.env.TEST_VAR = 'modified';
testEnv.restoreEnv(saved); // TEST_VAR removed, original state restored
```

---

## Advanced Usage

### Offline Mode

```js
const { offlineMode } = require('qtests');

// Enable offline mode
offlineMode.setOfflineMode(true); // caches cleared automatically on toggle

// Get stubbed axios automatically
const axios = offlineMode.getAxios(); // Returns stub when offline
await axios.get('/api/data'); // Returns {} instead of real request
```

### Test Environment Helpers

```js
const { testEnv } = require('qtests');

// Create specialized mocks
const axiosMock = testEnv.createAxiosMock();
axiosMock.onGet('/users').reply(200, { users: [] });

const scheduleMock = testEnv.createScheduleMock();
await scheduleMock(() => console.log('Executed immediately'));
```

### Integration with Jest

```js
// qtests automatically detects Jest and enhances functionality
const { testHelpers } = require('qtests');

test('console output', async () => {
  await testHelpers.withMockConsole('log', (spy) => {
    console.log('test');
    expect(spy.mock.calls[0][0]).toBe('test');
  });
});
```

---

## API Reference

### Core Utilities

#### `stubMethod(obj, methodName, replacement)`
- **obj**: Object containing the method to stub
- **methodName**: String name of the method to replace
- **replacement**: Function to use as replacement
- **Returns**: Function to restore original method

#### `mockConsole(method)`
- **method**: Console method to mock ('log', 'error', 'warn', 'info')
- **Returns**: Spy object with `mock.calls` array and `mockRestore()` function
  (`mockRestore()` resets the console method and clears call history)

#### `testEnv.setTestEnv()`
Sets standard test environment variables (NODE_ENV=test, DEBUG=qtests:*)

#### `testHelpers.backupEnvVars()` / `testHelpers.restoreEnvVars(backup)`
Safe environment variable backup and restoration

#### `testEnv.saveEnv()`
Captures current environment variables

#### `testEnv.restoreEnv(savedEnv)`
Restores an environment snapshot

### Offline Mode

#### `offlineMode.setOfflineMode(enabled)`
- **enabled**: Boolean to enable/disable offline mode

#### `offlineMode.getAxios()` / `offlineMode.getQerrors()`
Returns appropriate stub when offline mode is enabled
#### `offlineMode.clearOfflineCache()`
  Manually reset cached axios and qerrors instances when needed; `setOfflineMode` now clears caches automatically

### Test Helpers

#### `testHelpers.withMockConsole(method, callback)`
- **method**: Console method to mock
- **callback**: Function to execute with mocked console
- **Returns**: Promise resolving to callback result

#### `testEnv.createAxiosMock()` / `testEnv.createScheduleMock()` / `testEnv.createQerrorsMock()`
Factory functions for creating specialized test mocks
#### `testEnv.resetMocks()` / `testEnv.initSearchTest()`
Utilities for cleaning up multiple mocks or bootstrapping a full search test environment

---

## Module Stubs

### Axios Stub

```js
const axios = require('axios'); // When qtests/setup is loaded

// All HTTP methods return empty objects
await axios.get('/api'); // {}
await axios.post('/api', data); // {}
await axios.put('/api', data); // {}
await axios.delete('/api'); // {}
```

### Winston Stub

```js
const winston = require('winston'); // When qtests/setup is loaded

const logger = winston.createLogger();
logger.info('This produces no output'); // Silent
logger.error('This also produces no output'); // Silent
```

---

## Testing Patterns

### Isolated Unit Tests

```js
require('qtests/setup');
const { stubMethod, mockConsole } = require('qtests');

// Your module under test
const myModule = require('./myModule');

test('isolated functionality', async () => {
  // Stub external dependencies
  const restore = stubMethod(myModule.deps, 'externalCall', () => 'mocked');
  
  // Mock console output
  const spy = mockConsole('log');
  
  // Test your function
  const result = await myModule.doSomething();
  
  // Verify behavior
  expect(result).toBe('expected');
  expect(spy.mock.calls.length).toBe(1);
  
  // Cleanup
  restore();
  spy.mockRestore();
});
```

### Integration Testing

```js
require('qtests/setup');
const { testEnv, testHelpers } = require('qtests');

beforeEach(() => {
  testEnv.setTestEnv(); // Consistent test environment
});

test('full workflow', async () => {
  await testHelpers.withMockConsole('log', async (spy) => {
    // Test complete workflow with mocked external calls
    const result = await fullWorkflow();
    
    expect(result.success).toBe(true);
    expect(spy.mock.calls.some(call => 
      call[0].includes('workflow completed')
    )).toBe(true);
  });
});
```

---

## Best Practices

### 1. Always Use Setup
```js
// ✅ Correct - at the very top of test files
require('qtests/setup');
const myModule = require('./myModule');

// ❌ Wrong - setup after module requires
const myModule = require('./myModule');
require('qtests/setup');
```

### 2. Clean Up After Tests
```js
test('example', () => {
  const restore = stubMethod(obj, 'method', stub);
  const spy = mockConsole('log');
  
  // ... test code ...
  
  // Always restore
  restore();
  spy.mockRestore();
});
```

### 3. Use Environment Helpers
```js
const { testHelpers } = require('qtests');

test('environment test', async () => {
  await testHelpers.withSavedEnv(async () => {
    process.env.TEST_VAR = 'value';
    // Test code here
    // Environment automatically restored
  });
});
```

---

## Troubleshooting

### Common Issues

**Stubs not working**: Ensure `require('qtests/setup')` is called before requiring modules that should be stubbed.

**Console pollution**: Use `mockConsole()` to capture and verify console output instead of letting it pollute test output.

**Environment leaks**: Use `testHelpers.backupEnvVars()` and `testHelpers.restoreEnvVars()` or `testHelpers.withSavedEnv()` to prevent environment variable pollution between tests.

**Race conditions**: qtests is thread-safe, but ensure proper cleanup in concurrent test scenarios.

### Performance Tips

- Use qtests stubs instead of full mocking libraries for better performance
- Enable offline mode for tests that don't need real external services
- Use environment helpers to avoid repeated setup/teardown

---

## Contributing

qtests uses a zero-dependency philosophy for production code. All utilities are implemented with vanilla Node.js to ensure minimal impact on consumer projects.

### Development Setup

```bash
git clone https://github.com/your-repo/qtests
cd qtests
npm install # Installs dev dependencies only
npm test # Run the test suite
```

---

## License

MIT

---

**qtests** enables fast, reliable, side-effect-free testing with minimal configuration. Perfect for unit testing Node.js applications that interact with external services, databases, or logging systems.

**Happy testing!**