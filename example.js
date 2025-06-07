
const { stubMethod, mockConsole, stubs } = require('./index');

console.log('=== Stub Utils Examples ===');

// 1. Method stubbing example
const myObj = {
  greet: name => `Hello, ${name}!`,
  calculate: (a, b) => a + b
};

console.log('\n--- Method Stubbing ---');
console.log('Original:', myObj.greet('World'));

const restore = stubMethod(myObj, 'greet', name => `Hi there, ${name}!`);
console.log('Stubbed:', myObj.greet('World'));

restore();
console.log('Restored:', myObj.greet('World'));

// 2. Axios stub example
console.log('\n--- Axios Stub ---');
(async () => {
  const result = await stubs.axios.post('https://fake-api.com', { data: 'test' });
  console.log('Axios stub result:', result);
})();

// 3. Winston stub example
console.log('\n--- Winston Stub ---');
const logger = stubs.winston.createLogger();
console.log('Creating logger (no output expected):');
logger.info('This is an info message');
logger.warn('This is a warning');
logger.error('This is an error');
console.log('Logger methods called successfully (silently)');

// 4. Console mocking example
console.log('\n--- Console Mocking ---');
const consoleSpy = mockConsole('log');
console.log('This log will be captured');
console.log('This too');
console.log('Captured calls:', consoleSpy.mock.calls.length);
consoleSpy.mockRestore();
console.log('Console restored - this will show');
