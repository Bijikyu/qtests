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
const { setTestEnv, backupEnvVars, restoreEnvVars } = require('qtests');

// Set test environment
setTestEnv(); // Sets NODE_ENV=test, DEBUG=qtests:*

// Backup and restore environment
const backup = backupEnvVars();
process.env.TEST_VAR = 'modified';
restoreEnvVars(backup); // TEST_VAR removed, original state restored
```

---

## Advanced Usage

### Offline Mode

```js
const { setOfflineMode, getAxios } = require('qtests');

// Enable offline mode
setOfflineMode(true);

// Get stubbed axios automatically
const axios = getAxios(); // Returns stub when offline
await axios.get('/api/data'); // Returns {} instead of real request
```

### Test Environment Helpers

```js
const { createAxiosMock, createScheduleMock } = require('qtests');

// Create specialized mocks
const axiosMock = createAxiosMock();
axiosMock.onGet('/users').reply(200, { users: [] });

const scheduleMock = createScheduleMock();
await scheduleMock(() => console.log('Executed immediately'));
```

### Integration with Jest

```js
// qtests automatically detects Jest and enhances functionality
const { withMockConsole } = require('qtests');

test('console output', async () => {
  await withMockConsole('log', (spy) => {
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

#### `setTestEnv()`
Sets standard test environment variables (NODE_ENV=test, DEBUG=qtests:*)

#### `backupEnvVars()` / `restoreEnvVars(backup)`
Safe environment variable backup and restoration

### Offline Mode

#### `setOfflineMode(enabled)`
- **enabled**: Boolean to enable/disable offline mode

#### `getAxios()` / `getQerrors()`
Returns appropriate stub when offline mode is enabled

### Test Helpers

#### `withMockConsole(method, callback)`
- **method**: Console method to mock
- **callback**: Function to execute with mocked console
- **Returns**: Promise resolving to callback result

#### `createAxiosMock()` / `createScheduleMock()` / `createQerrorsMock()`
Factory functions for creating specialized test mocks

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
const { setTestEnv, withMockConsole } = require('qtests');

beforeEach(() => {
  setTestEnv(); // Consistent test environment
});

test('full workflow', async () => {
  await withMockConsole('log', async (spy) => {
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
const { withSavedEnv } = require('qtests');

test('environment test', async () => {
  await withSavedEnv(async () => {
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

**Environment leaks**: Use `backupEnvVars()` and `restoreEnvVars()` or `withSavedEnv()` to prevent environment variable pollution between tests.

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