# Troubleshooting Guide

This comprehensive guide addresses common issues, troubleshooting steps, and solutions for qtests users.

## 🔧 Installation & Setup Issues

### Module Resolution Problems

**Issue**: Cannot resolve qtests imports
```typescript
// Error: Cannot find module 'qtests/lib/envUtils.js'
import { httpTest } from 'qtests/lib/envUtils.js';
```

**Solutions**:
1. **Check Build Status**: Ensure you're using the built version
```bash
npm run build  # If using qtests from source
```

2. **Use Dist Path**: Import from compiled distribution
```typescript
// Correct import from dist
import { httpTest } from 'qtests/dist/lib/envUtils.js';

// Or use main exports
import { httpTest } from 'qtests';
```

3. **Verify package.json Exports**
```json
{
  "exports": {
    ".": "./dist/index.js",
    "./lib/envUtils": "./dist/lib/envUtils.js"
  }
}
```

### TypeScript Configuration Issues

**Issue**: TypeScript errors with qtests imports
```
TS2307: Cannot find module 'qtests' or its corresponding type declarations.
```

**Solutions**:
1. **Update tsconfig.json**
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "types": ["node", "jest"]
  },
  "include": ["node_modules/qtests/dist/**/*.d.ts"]
}
```

2. **Install Type Definitions**
```bash
npm install --save-dev @types/node @types/jest
```

3. **Use Type Assertion** (temporary fix)
```typescript
import qtests from 'qtests';
const { stubMethod } = qtests as any;
```

## 🧪 Test Execution Issues

### Stub Not Working

**Issue**: Methods not being stubbed correctly
```typescript
import './node_modules/qtests/setup.js';
import { myService } from './myService';

const restore = stubMethod(myService, 'getData', () => 'stubbed');
console.log(myService.getData()); // Still calls original method
```

**Solutions**:
1. **Import Order Check**
```typescript
// ✅ Correct - setup first
import './node_modules/qtests/setup.js';
import { myService } from './myService';

// ❌ Wrong - import first
import { myService } from './myService';
import './node_modules/qtests/setup.js';
```

2. **Module Loading Issue**
```typescript
// Force module reload if needed
delete require.cache[require.resolve('./myService')];
import { myService } from './myService';
```

3. **Check Method Binding**
```typescript
// Ensure method exists before stubbing
console.log(Object.getOwnPropertyNames(myService)); // Should show 'getData'
```

### Environment Variable Issues

**Issue**: Environment variables leaking between tests
```typescript
test('test 1', () => {
  process.env.TEST_VAR = 'value1';
  // ...
});

test('test 2', () => {
  console.log(process.env.TEST_VAR); // Still 'value1' from previous test
});
```

**Solutions**:
1. **Use Test Environment Helpers**
```typescript
import { testEnv } from 'qtests';

beforeEach(() => {
  testEnv.saveEnv();
});

afterEach(() => {
  testEnv.restoreEnv();
});
```

2. **Use withSavedEnv Wrapper**
```typescript
import { testHelpers } from 'qtests';

test('isolated environment test', async () => {
  await testHelpers.withSavedEnv(async () => {
    process.env.TEST_VAR = 'temporary';
    // Environment automatically restored
  });
});
```

### Asynchronous Test Issues

**Issue**: Tests timing out or not completing
```typescript
test('async test fails', async () => {
  const result = await someAsyncOperation();
  expect(result).toBe('expected'); // Test hangs
});
```

**Solutions**:
1. **Increase Test Timeout**
```typescript
// In Jest config
testTimeout: 10000, // 10 seconds

// Or per-test
test('async test', async () => {
  // ...
}, 15000); // 15 seconds timeout
```

2. **Check Promise Resolution**
```typescript
test('async test with proper handling', async () => {
  try {
    const result = await Promise.race([
      someAsyncOperation(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )
    ]);
    expect(result).toBe('expected');
  } catch (error) {
    if (error.message === 'Timeout') {
      console.warn('Operation timed out');
      // Handle timeout appropriately
    } else {
      throw error;
    }
  }
});
```

## 🌐 HTTP Testing Issues

### Express App Mocking Problems

**Issue**: HTTP tests failing with "Cannot read property of undefined"
```typescript
const app = createMockApp();
app.get('/users', (req, res) => {
  res.statusCode = 200;
  res.end(JSON.stringify({ users: [] }));
});

const response = await httpTest.supertest(app)
  .get('/users')
  .expect(200); // Fails: Cannot read property 'status' of undefined
```

**Solutions**:
1. **Use Proper Response Methods**
```typescript
app.get('/users', (req, res) => {
  res.status(200).json({ users: [] }); // Use status() and json()
});
```

2. **Check App Initialization**
```typescript
const app = createMockApp();
console.log(app); // Should show Express app methods

// Alternative: Use real Express app
import express from 'express';
const app = express();
```

### Request Body Issues

**Issue**: Request body undefined in tests
```typescript
app.post('/users', (req, res) => {
  console.log(req.body); // undefined
  res.status(201).json({ success: true });
});
```

**Solutions**:
1. **Add Body Parser Middleware**
```typescript
app.use(express.json()); // For JSON bodies
app.use(express.urlencoded({ extended: true })); // For form data

app.post('/users', (req, res) => {
  console.log(req.body); // Now works
  res.status(201).json({ success: true });
});
```

2. **Use Test Helper**
```typescript
import { createMockAppWithMiddleware } from './test-helpers';

const app = createMockAppWithMiddleware();
// App now includes body parsing
```

## 🔄 Performance Testing Issues

### Memory Leak Detection

**Issue**: Performance tests showing increasing memory usage
```typescript
const results = await runPerformanceTest({
  testFunction: () => processData(data),
  duration: 10000
});
// Memory usage steadily increasing
```

**Solutions**:
1. **Force Garbage Collection**
```typescript
const results = await runPerformanceTest({
  testFunction: () => {
    if (global.gc) global.gc(); // Force garbage collection if available
    return processData(data);
  },
  duration: 10000
});
```

2. **Monitor Memory Explicitly**
```typescript
const memoryBefore = process.memoryUsage();
await processData(data);
const memoryAfter = process.memoryUsage();

const memoryDelta = memoryAfter.heapUsed - memoryBefore.heapUsed;
if (memoryDelta > 1024 * 1024) { // 1MB
  console.warn('High memory usage detected:', memoryDelta);
}
```

### Timeout Issues

**Issue**: Performance tests timing out
```typescript
const results = await runPerformanceTest({
  testFunction: () => slowOperation(), // Takes 10+ seconds
  duration: 5000 // Times out
});
```

**Solutions**:
1. **Increase Duration**
```typescript
const results = await runPerformanceTest({
  testFunction: () => slowOperation(),
  duration: 15000, // 15 seconds
  samples: 50 // Reduce samples for slower operations
});
```

2. **Reduce Sample Size**
```typescript
const results = await runPerformanceTest({
  testFunction: () => slowOperation(),
  duration: 5000,
  samples: 10, // Fewer samples
  warmupSamples: 2 // Fewer warmup samples
});
```

## 🔗 Circuit Breaker Issues

### Circuit Not Opening

**Issue**: Circuit breaker not opening despite high error rate
```typescript
const breaker = createCircuitBreaker(failingFunction, {
  errorThresholdPercentage: 50,
  timeout: 1000
});

// Circuit never opens even with 100% failure rate
```

**Solutions**:
1. **Check Minimum Throughput**
```typescript
const breaker = createCircuitBreaker(failingFunction, {
  errorThresholdPercentage: 50,
  timeout: 1000,
  minimumThroughput: 10 // Need at least 10 calls
});
```

2. **Enable Logging**
```typescript
const breaker = createCircuitBreaker(failingFunction, {
  errorThresholdPercentage: 50,
  timeout: 1000,
  monitoring: {
    log: console.log, // Enable detailed logging
    metrics: true
  }
});
```

3. **Manual State Check**
```typescript
setInterval(() => {
  console.log('Circuit state:', breaker.stats);
  console.log('Is open:', breaker.opened);
}, 1000);
```

## 📊 Health Monitoring Issues

### Health Checks Failing

**Issue**: Health monitoring shows unhealthy connections
```typescript
const monitor = addHealthMonitoring(pool, {
  healthCheckInterval: 5000, // 5 seconds
  validationTimeout: 100 // Too short timeout
});

// Always shows unhealthy connections
```

**Solutions**:
1. **Increase Timeout**
```typescript
const monitor = addHealthMonitoring(pool, {
  healthCheckInterval: 30000, // 30 seconds
  validationTimeout: 5000, // 5 seconds
  unhealthyConnectionThreshold: 3
});
```

2. **Check Validation Function**
```typescript
const monitor = addHealthMonitoring(pool, {
  healthCheckInterval: 30000,
  validate: async (connection) => {
    try {
      await connection.query('SELECT 1'); // Proper validation
      return true;
    } catch (error) {
      return false;
    }
  }
});
```

3. **Enable Detailed Logging**
```typescript
const monitor = addHealthMonitoring(pool, {
  healthCheckInterval: 30000,
  enableDetailedLogging: true // See what's happening
});
```

## 🔧 Configuration Issues

### Jest Configuration Conflicts

**Issue**: Jest configuration conflicts with qtests
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  // qtests setup.js not being loaded
};
```

**Solutions**:
1. **Include qtests Setup**
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/node_modules/qtests/setup.js'], // Load qtests first
  setupFilesAfterEnv: ['<rootDir>/setupTests.js']
};
```

2. **Use qtests Jest Config Factory**
```javascript
import { createJestConfig } from 'qtests/lib/jestConfigFactory.js';

export default createJestConfig('react-typescript', {
  testEnvironment: 'jsdom',
  customSetup: ['<rootDir>/setupTests.js']
});
```

### Module Resolution in Monorepo

**Issue**: Cannot resolve qtests in monorepo packages
```
packages/frontend/src/App.test.ts:
Cannot find module 'qtests' from 'frontend/src/App.test.ts'
```

**Solutions**:
1. **Workspace Configuration**
```json
// Root package.json
{
  "workspaces": ["packages/*"],
  "devDependencies": {
    "qtests": "^2.0.0"
  }
}

// Individual package.json
{
  "devDependencies": {
    "qtests": "workspace:*"
  }
}
```

2. **Jest Module Mapping**
```javascript
// jest.config.js
module.exports = {
  moduleNameMapper: {
    '^qtests$': '<rootDir>/node_modules/qtests/dist/index.js',
    '^qtests/(.*)$': '<rootDir>/node_modules/qtests/dist/$1.js'
  }
};
```

## 🐛 Common Debugging Techniques

### Enable Verbose Logging

```typescript
// Enable qtests debugging
process.env.QTESTS_SILENT = 'false'; // Show all logs
process.env.DEBUG = 'qtests:*'; // Node.js debug style

// In tests
import './node_modules/qtests/setup.js';
// Now you'll see detailed qtests logs
```

### Test Isolation

```typescript
// Use describe.each for parameterized tests
describe.each([
  { input: 'a', expected: 'processed-a' },
  { input: 'b', expected: 'processed-b' }
])('processInput: $input', ({ input, expected }) => {
  beforeEach(() => {
    // Reset state for each test
    jest.clearAllMocks();
    testEnv.saveEnv();
  });

  afterEach(() => {
    testEnv.restoreEnv();
  });

  test(`processes ${input} to ${expected}`, () => {
    const result = processInput(input);
    expect(result).toBe(expected);
  });
});
```

### Mock Inspection

```typescript
// Check mock states
import { mockConsole } from 'qtests';

const consoleSpy = mockConsole('log');
console.log('test message');

console.log('Calls:', consoleSpy.mock.calls);
console.log('Instances:', consoleSpy.mock.instances);

// Reset specific mock
consoleSpy.mockClear();

// Reset all mocks
jest.clearAllMocks();
```

## 📞 Getting Help

### Checklist Before Reporting Issues

1. **Version Information**
   ```bash
   npm list qtests
   node --version
   npm --version
   ```

2. **Minimal Reproduction**
   ```typescript
   // Create minimal test case
   import './node_modules/qtests/setup.js';
   import { stubMethod } from 'qtests';
   
   test('minimal case', () => {
     const obj = { method: () => 'original' };
     const restore = stubMethod(obj, 'method', () => 'stubbed');
     expect(obj.method()).toBe('stubbed');
     restore();
   });
   ```

3. **Environment Details**
   ```bash
   echo $NODE_ENV
   echo $CI
   echo Operating System: $(uname -s)
   ```

### Community Resources

- **GitHub Issues**: [github.com/your-repo/qtests/issues](https://github.com/your-repo/qtests/issues)
- **Documentation**: [qtests.readthedocs.io](https://qtests.readthedocs.io)
- **Discord Community**: [discord.gg/qtests](https://discord.gg/qtests)
- **Stack Overflow**: Use tag `qtests`

### Reporting Template

```markdown
## Issue Description
[Brief description of the issue]

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- qtests version: [X.X.X]
- Node.js version: [XX.X.X]
- OS: [Windows/macOS/Linux]
- Framework: [Jest/Mocha/etc.]

## Code Example
```typescript
// Minimal reproduction case
```

## Additional Context
[Any additional information]
```

This troubleshooting guide covers the most common issues encountered when using qtests. For additional help, refer to the community resources or create an issue with the provided template.