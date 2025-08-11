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
* **Test Generation**: Automatic test scaffolding from source code analysis
* **Lightweight Test Runner**: Zero-dependency test execution engine
* **HTTP Testing**: Integration testing utilities (supertest alternative)
* **Email Mocking**: Email testing without external mail services
* **Advanced Test Suites**: Comprehensive test suite management and utilities
* **Zero Dependencies**: No production dependencies to bloat your project
* **Thread Safe**: Concurrent test execution support with race condition prevention
* **Framework Agnostic**: Works with Jest, Mocha, and vanilla Node.js testing

---

## Quick Start

### Basic Setup

```js
// At the top of your test files
require('qtests/setup');

// Or call the exported setup function if you prefer
const { setup } = require('qtests');
setup();

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
```js
const custom = () => {};
testEnv.attachMockSpies(custom);
custom.mockClear(); // works even without Jest

const logged = testEnv.makeLoggedMock('db', () => ({ query: () => [] }));
logged.query();

console.log(testEnv.defaultEnv.OPENAI_TOKEN); // 'token'
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

### Test Generation

```js
const { TestGenerator } = require('qtests');

// Generate tests for your source code
const generator = new TestGenerator({
  sourceDir: 'src',
  testDir: 'tests',
  extensions: ['.js', '.ts', '.jsx', '.tsx']
});

await generator.generateAllTests();

// Or use the CLI tool
// npx qtests-generate --source src --test tests
```

### Lightweight Test Runner

```js
const { runTestSuite, createAssertions } = require('qtests');

// Create assertions
const assert = createAssertions();

// Define and run test suite
const tests = {
  'basic test': () => {
    assert.equals(1 + 1, 2);
    assert.isTrue(true);
  },
  'async test': async () => {
    const result = await Promise.resolve('done');
    assert.equals(result, 'done');
  }
};

runTestSuite('My Tests', tests);
```

### HTTP Testing

```js
const { httpTest } = require('qtests/lib/envUtils');
const { supertest, createMockApp } = httpTest;

// Create a mock Express-style app
const app = createMockApp();
app.get('/users', (req, res) => {
  res.statusCode = 200;
  res.end(JSON.stringify({ users: [] }));
});

// Test the app
const response = await supertest(app)
  .get('/users')
  .expect(200)
  .end();

console.log(response.body); // { users: [] }
```

### Email Mocking

```js
const { sendEmail } = require('qtests/lib/envUtils');

// Mock email sending
const result = await sendEmail.send({
  to: 'user@example.com',
  subject: 'Welcome',
  text: 'Welcome to our app!'
});

console.log(result.success); // true
console.log(sendEmail.getHistory()); // Array of sent emails
```

### Advanced Test Suites

```js
const { testSuite } = require('qtests/lib/envUtils');

// Create comprehensive test suite
const suite = testSuite.TestSuiteBuilder()
  .withDatabase(['User', 'Product'])
  .withMocks(['axios', 'fs'])
  .withPerformance({ maxTime: 1000 })
  .build();

await suite.runTests({
  'database test': async () => {
    const user = await suite.models.User.create({ name: 'John' });
    suite.assert.equals(user.name, 'John');
  }
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
#### `testEnv.defaultEnv`
Default values used by `setTestEnv()`

### Offline Mode

#### `offlineMode.setOfflineMode(enabled)`
- **enabled**: Boolean to enable/disable offline mode
- Use `offlineMode.isOfflineMode()` to read the current state

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
#### `testEnv.attachMockSpies(mock)`
Adds mockClear and mockReset helpers using Jest if available
#### `testEnv.makeLoggedMock(name, creator)`
Creates a mock with logging and attached spies
#### `stubQerrors()`
Silences qerrors for tests
#### `reload(relPath)`
Reloads a module from cache
#### `createJsonRes()` / `createRes()`
Response object mocks
#### `generateKey(suffix)`
Generates predictable keys for tests
#### `withSavedEnv(fn)`
Runs a callback with env saved and restored
#### `moduleReloadLock`
Lock set used by `reload`

### Test Generation

#### `TestGenerator(options)`
- **options.sourceDir**: Directory to scan for source files (default: 'src')
- **options.testDir**: Directory to generate tests in (default: 'tests')
- **options.extensions**: File extensions to process (default: ['.js', '.ts'])
- **options.knownMocks**: Libraries to auto-mock (default: ['axios', 'node-fetch', 'pg', 'mongoose'])

#### `generator.generateAllTests()`
Scans source directory and generates missing test files

#### CLI: `npx qtests-generate`
- `--source <dir>`: Source directory to scan
- `--test <dir>`: Test directory for output
- `--help`: Show usage information

### Lightweight Test Runner

#### `runTestSuite(name, tests)`
- **name**: String name for the test suite
- **tests**: Object with test names as keys and test functions as values

#### `runTestSuites(suites)`
- **suites**: Array of {name, tests} objects to run sequentially

#### `createAssertions()`
Returns object with assertion methods:
- `equals(actual, expected)`: Deep equality check
- `isTrue(value)`: Truthiness assertion
- `isFalse(value)`: Falsiness assertion
- `throws(fn, expectedError)`: Error throwing assertion
- `isArray(value)`: Array type check
- `isObject(value)`: Object type check

### HTTP Testing

#### `httpTest.supertest(app)`
- **app**: Express-style application function
- **Returns**: Request builder for chaining HTTP calls

#### `httpTest.createMockApp()`
Creates Express-compatible application for testing

#### Request builder methods:
- `get(path)`, `post(path)`, `put(path)`, `delete(path)`
- `set(header, value)`: Set request headers
- `send(data)`: Set request body
- `expect(status)`: Assert response status
- `end()`: Execute request and return response

### Email Mocking

#### `sendEmail.send(options)`
- **options.to**: Recipient email address
- **options.subject**: Email subject
- **options.text**: Plain text content
- **options.html**: HTML content (optional)
- **Returns**: Promise resolving to {success: true, id: string}

#### `sendEmail.getHistory()`
Returns array of all sent emails for verification

#### `sendEmail.clearHistory()`
Clears email history for test isolation

### Advanced Test Suites

#### `testSuite.TestSuiteBuilder()`
Returns fluent builder for comprehensive test suites:
- `withDatabase(models)`: Setup in-memory database models
- `withMocks(libraries)`: Auto-mock specified libraries
- `withPerformance(options)`: Enable performance constraints
- `build()`: Create configured test suite instance

---

## Module Stubs

### Axios Stub

```js
const axios = require('axios'); // When qtests/setup is loaded

// All HTTP methods return enhanced response objects
const response = await axios.get('/api');
// Returns: { data: {}, status: 200, statusText: 'OK', headers: {}, config: {} }

await axios.post('/api', data); // Same enhanced format
await axios.put('/api', data); // Same enhanced format  
await axios.delete('/api'); // Same enhanced format
```

### Winston Stub

```js
const winston = require('winston'); // When qtests/setup is loaded

const logger = winston.createLogger();
logger.info('This produces no output'); // Silent
logger.error('This also produces no output'); // Silent
```

### Using the `stubs` Object

If you need to call the stubbed modules directly, `require('qtests')` exposes a
`stubs` object:

```js
const { stubs } = require('qtests');

const response = await stubs.axios.get('https://example.com');
// Returns: { data: {}, status: 200, statusText: 'OK', headers: {}, config: {} }
await stubs.axios.post('https://example.com', {}); // Same enhanced format
```

Most projects should still load `qtests/setup` so that common modules resolve to
stubs automatically, making manual calls unnecessary.

### Import Patterns

qtests provides multiple import patterns for different use cases:

```js
// Core utilities (always available from main index)
const { stubMethod, mockConsole, testEnv, TestGenerator, runTestSuite } = require('qtests');

// Advanced utilities (available from envUtils)
const { httpTest, sendEmail, testSuite } = require('qtests/lib/envUtils');

// Category-based imports for organized access
const { http, data, test } = require('qtests/lib/envUtils');
const { supertest } = http.httpTest;
const { send } = data.sendEmail;
const { TestSuiteBuilder } = test.testSuite;
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

// Or programmatically
const { setup } = require('qtests');
setup();

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

**Module not found errors**: Some advanced utilities require importing from `qtests/lib/envUtils` rather than the main `qtests` package. See Import Patterns section above.

**CLI command not found**: For `qtests-generate`, ensure you're using `npx qtests-generate` or install qtests globally with `npm install -g qtests`.

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