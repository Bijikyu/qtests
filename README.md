
# my-stub-utils

Testing utilities and stubs for Node.js projects. Provides lightweight tools for seamless testing without side effects like HTTP requests or log output.

## Installation

```bash
npm install my-stub-utils --save-dev
```

## Contents

- `utils/stubMethod.js`: Replace an object's method with a stub, restoring it after the test
- `setup.js`: Configures Node to resolve stub modules during tests
- `stubs/axios.js`: No-op axios stub
- `stubs/winston.js`: No-op winston logger stub
- `index.js`: Entry point with unified exports

## How to Use

### 1. Stubbing Object Methods

Use the `stubMethod` utility to temporarily replace any method on any object during a test:

```javascript
const { stubMethod } = require('my-stub-utils');

const myObj = {
  greet: name => `Hello, ${name}!`
};

// Stub the method
const restore = stubMethod(myObj, 'greet', name => 'Hi!');
console.log(myObj.greet('Brian')); // 'Hi!'

// Restore the original after test
restore();
console.log(myObj.greet('Brian')); // 'Hello, Brian!'
```

### 2. Stubbing Modules for All Tests

Use the setup script to tell Node.js to look in the stubs directory first when resolving modules:

```javascript
require('my-stub-utils/setup');
```

Or add it to your test runner:

```bash
mocha --require my-stub-utils/setup
```

Now any `require('axios')` or `require('winston')` will use the stubs automatically.

### 3. Using Provided Stubs Directly

```javascript
const { stubs } = require('my-stub-utils');

// Use axios stub
await stubs.axios.post('https://anything', {}); // Returns {}

// Use winston stub
const logger = stubs.winston.createLogger();
logger.info('This will not output anything!');
```

### 4. Example: Testing a Function That Logs and Makes HTTP Calls

Your function:
```javascript
// myFunction.js
const axios = require('axios');
const winston = require('winston');
const logger = winston.createLogger();

module.exports = async function myFunction() {
  await axios.post('https://api.example.com/test', {});
  logger.info('Posted to API');
};
```

Test:
```javascript
require('my-stub-utils/setup'); // Must be called before requiring your module

const myFunction = require('./myFunction'); // Will use stubbed axios and winston

(async () => {
  await myFunction(); // Does nothing real: no network, no logs!
})();
```

## API Reference

### `stubMethod(obj, method, replacement)`

- `obj`: The object whose method you want to stub
- `method`: The string name of the method to replace
- `replacement`: The new function to use during the test
- Returns: A function to restore the original method

### `setup.js`

When required, adds the included stubs/ directory to Node's module resolution path.

### Stubs

- `stubs.axios.post`: Async function that returns an empty object
- `stubs.winston.createLogger()`: Returns an object with no-op logging methods

## FAQ

**Q: Will this module interfere with my production code?**
A: No! Only include it in your test setup. Your real code and dependencies are untouched in production.

**Q: Can I extend or customize the stubs?**
A: Yes! You can copy and modify the stubs as needed or contribute improvements.

## License

ISC

This module helps you run fast, reliable, side-effect-free tests—no HTTP calls, no logs, no real file access—using simple, explicit stubbing for any object or module.
