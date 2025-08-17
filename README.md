# qtests

A comprehensive Node.js testing framework with zero dependencies. Provides intelligent test generation, method stubbing, console mocking, and drop-in replacements for popular modules.

## 🚀 Quick Start

```bash
npm install qtests --save-dev
```

```js
// Enable automatic stubbing
require('qtests/setup');

// Your modules now use qtests stubs automatically
const axios = require('axios'); // Uses qtests stub
const winston = require('winston'); // Uses qtests stub

// Basic utilities
const { stubMethod, mockConsole, testEnv } = require('qtests');
```

## ✨ Key Features

- **🤖 Intelligent Test Generation** - Automatically discovers and generates missing tests
- **🎭 Method Stubbing** - Temporarily replace object methods with automatic restoration
- **📺 Console Mocking** - Jest-compatible console spies with fallback for vanilla Node.js
- **🌍 Environment Management** - Safe backup and restore of environment variables
- **📦 Module Stubs** - Drop-in replacements for axios, winston, and other dependencies
- **🔌 Offline Mode** - Automatic stub resolution when external services are unavailable
- **🏃 Lightweight Test Runner** - Zero-dependency test execution engine
- **🌐 HTTP Testing** - Integration testing utilities (supertest alternative)
- **📧 Email Mocking** - Email testing without external mail services
- **⚡ Zero Dependencies** - No production dependencies to bloat your project

## 📖 Core Usage

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

// Save and restore environment
const saved = testEnv.saveEnv();
process.env.TEST_VAR = 'modified';
testEnv.restoreEnv(saved); // TEST_VAR removed, original state restored
```

## 🤖 Automatic Test Generation

### CLI Usage

```bash
# Generate tests for entire project
npx qtests-generate

# Custom source directory
npx qtests-generate --src lib

# Custom source and test directories
npx qtests-generate --src app --test-dir tests
```

### Programmatic Usage

```js
const { TestGenerator } = require('qtests');

const generator = new TestGenerator({
  SRC_DIR: 'src',
  TEST_DIR: 'tests/integration',
  VALID_EXTS: ['.js', '.ts', '.jsx', '.tsx']
});

const results = generator.generate();
console.log(`Generated ${results.length} test files`);
```

**Smart Discovery Features:**
- Walks entire project directory structure
- Supports feature-first projects (tests alongside source files)
- Detects existing tests to avoid duplicates
- Handles multiple project structures (traditional, monorepo, mixed)

## 🔌 Module Stubs

### Axios Stub

```js
// Automatic when using qtests/setup
const axios = require('axios');

const response = await axios.get('/api');
// Returns: { data: {}, status: 200, statusText: 'OK', headers: {}, config: {} }

await axios.post('/api', data); // Enhanced response format
```

### Winston Stub

```js
// Automatic when using qtests/setup
const winston = require('winston');

const logger = winston.createLogger();
logger.info('This produces no output'); // Silent
```

## 🏃 Lightweight Test Runner

```js
const { runTestSuite, createAssertions } = require('qtests');

const assert = createAssertions();

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

## 🌐 HTTP Testing

```js
const { httpTest } = require('qtests/lib/envUtils');

// Create mock Express app
const app = httpTest.createMockApp();
app.get('/users', (req, res) => {
  res.statusCode = 200;
  res.end(JSON.stringify({ users: [] }));
});

// Test the app
const response = await httpTest.supertest(app)
  .get('/users')
  .expect(200)
  .end();
```

## 📧 Email Testing

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

## 🛠️ Advanced Features

### Offline Mode

```js
const { offlineMode } = require('qtests');

// Enable offline mode
offlineMode.setOfflineMode(true);

// Get stubbed axios automatically
const axios = offlineMode.getAxios();
await axios.get('/api/data'); // Returns {} instead of real request
```

### Integration with Jest

```js
const { testHelpers } = require('qtests');

test('console output', async () => {
  await testHelpers.withMockConsole('log', (spy) => {
    console.log('test');
    expect(spy.mock.calls[0][0]).toBe('test');
  });
});
```

## 📚 API Reference

### Core Methods

| Method | Description |
|--------|-------------|
| `stubMethod(obj, methodName, replacement)` | Replace object method with stub |
| `mockConsole(method)` | Mock console methods with spy |
| `testEnv.setTestEnv()` | Set standard test environment |
| `testEnv.saveEnv()` / `restoreEnv()` | Backup/restore environment |
| `offlineMode.setOfflineMode(enabled)` | Toggle offline mode |

### Test Generation

| Method | Description |
|--------|-------------|
| `new TestGenerator(options)` | Create test generator instance |
| `generator.generate()` | Generate missing tests |
| CLI: `npx qtests-generate` | Command-line test generation |

### Test Runner

| Method | Description |
|--------|-------------|
| `runTestSuite(name, tests)` | Execute test suite |
| `createAssertions()` | Get assertion methods |

### Import Patterns

```js
// Core utilities
const { stubMethod, mockConsole, testEnv, TestGenerator } = require('qtests');

// Advanced utilities
const { httpTest, sendEmail, testSuite } = require('qtests/lib/envUtils');

// Module stubs
const { stubs } = require('qtests');
await stubs.axios.get('https://example.com');
```

## 🎯 Best Practices

### 1. Always Load Setup First
```js
// ✅ Correct
require('qtests/setup');
const myModule = require('./myModule');

// ❌ Wrong
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
    // Environment automatically restored
  });
});
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Stubs not working | Ensure `require('qtests/setup')` is called first |
| Console pollution | Use `mockConsole()` to capture output |
| Environment leaks | Use `testHelpers.withSavedEnv()` for isolation |
| Module not found | Import advanced utilities from `qtests/lib/envUtils` |
| CLI not found | Use `npx qtests-generate` or install globally |

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions welcome! Please see our contributing guidelines and feel free to submit issues and pull requests.