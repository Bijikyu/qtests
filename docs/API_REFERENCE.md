# Complete API Reference

This comprehensive reference documents all qtests APIs, methods, and configuration options.

## 📦 Core Exports

### Main Entry Point (`qtests`)

```typescript
import {
  setup,                    // Initialize qtests stubbing
  stubs,                   // Built-in module stubs
  testEnv,                  // Environment management
  offlineMode,              // Offline mode utilities
  testHelpers,              // Test helper functions
  stubMethod,               // Method stubbing (convenience export)
  mockConsole,              // Console mocking (convenience export)
  createMockApp,            // HTTP testing app creator (convenience export)
  runTestSuite,             // Test runner (convenience export)
  createAssertions           // Assertion creator (convenience export)
} from 'qtests';
```

## 🔧 Core Utilities

### setup()
Initialize qtests module stubbing and global configurations.

```typescript
import { setup } from 'qtests';

// Load qtests setup
setup();
```

**Effects**:
- Registers default module stubs (axios, winston, mongoose)
- Sets up module resolution hooks
- Initializes global test environment

### stubs
Object containing built-in module stubs.

```typescript
import { stubs } from 'qtests';

// Access specific stub
await stubs.axios.get('https://api.example.com');
await stubs.winston.info('Test message');

// Stub returns:
// axios: { data: {}, status: 200, statusText: 'OK', headers: {}, config: {} }
// winston: No-op (silent logging)
```

**Available Stubs**:
- `stubs.axios` - HTTP client stub
- `stubs.winston` - Logger stub
- `stubs.mongoose` - MongoDB ODM stub

## 🎭 Method Stubbing

### stubMethod()

Replace object methods with stub implementations.

```typescript
import { stubMethod } from 'qtests';

const restore = stubMethod(obj, methodName, replacement);

// Example:
const userService = { getUser: (id) => database.find(id) };
const restore = stubMethod(userService, 'getUser', (id) => ({
  id, name: 'Mock User', stubbed: true
}));

const user = userService.getUser('123'); // Returns mock user
restore(); // Restore original method
```

**Parameters**:
- `obj: object` - Target object
- `methodName: string` - Method name to stub
- `replacement: function` - Stub function

**Returns**: `Function` - Restore function

**Advanced Usage**:
```typescript
// With context preservation
const restore = stubMethod(contextObject, 'method', function() {
  // 'this' is preserved
  return this.prefix + ' stubbed';
});

// Performance measurement
const restore = stubMethod(obj, 'method', (value) => {
  const start = Date.now();
  const result = originalMethod(value);
  console.log(`Method took ${Date.now() - start}ms`);
  return result;
});
```

### spyOnMethod()

Create a spy on existing method without replacing it.

```typescript
import { spyOnMethod } from 'qtests';

const spy = spyOnMethod(obj, 'methodName');

obj.methodName('test');
console.log(spy.calls); // [{ args: ['test'], result: undefined }]
```

## 📺 Console Mocking

### mockConsole()

Create Jest-compatible console spies.

```typescript
import { mockConsole } from 'qtests';

const spy = mockConsole('log');
console.log('test message');
console.log('another message');

console.log(spy.mock.calls);
// [
//   [['test message']],
//   [['another message']]
// ]

spy.mockRestore(); // Restore original console.log
```

**Parameters**:
- `method: string` - Console method to mock ('log', 'error', 'warn', 'info', 'debug')

**Returns**: Jest mock object with methods:
- `mock.calls` - Array of call arguments
- `mock.results` - Array of return values
- `mockRestore()` - Restore original method
- `mockClear()` - Clear call history

**Multiple Methods**:
```typescript
const spies = mockConsole(['log', 'error', 'warn']);
spies.log.mock.calls; // Console.log calls
spies.error.mock.calls; // Console.error calls
spies.mockRestoreAll(); // Restore all
```

## 🌍 Environment Management

### testEnv

Environment variable management utilities.

```typescript
import { testEnv } from 'qtests';

// Set standard test environment
testEnv.setTestEnv();
// Sets: NODE_ENV=test, DEBUG=qtests:*

// Save current environment
const saved = testEnv.saveEnv();
process.env.MY_VAR = 'test';
// Make changes...

// Restore original environment
testEnv.restoreEnv(saved);
```

**Methods**:

| Method | Description |
|--------|-------------|
| `setTestEnv()` | Set NODE_ENV=test and DEBUG=qtests:* |
| `saveEnv()` | Return snapshot of current environment |
| `restoreEnv(saved)` | Restore environment from snapshot |
| `clearTestEnv()` | Clear qtests environment variables |

### withSavedEnv()

Execute function with automatic environment cleanup.

```typescript
import { testHelpers } from 'qtests';

await testHelpers.withSavedEnv(async () => {
  process.env.TEMP_VAR = 'temporary';
  // Your code here
  // Environment automatically restored
});
```

## 🔌 Offline Mode

### offlineMode

Control offline mode for external service stubbing.

```typescript
import { offlineMode } from 'qtests';

// Enable offline mode
offlineMode.setOfflineMode(true);

// Check if offline mode is active
if (offlineMode.isOfflineMode()) {
  console.log('Running in offline mode');
}

// Get offline-stubbed modules
const axios = offlineMode.getAxios(); // Returns stubbed axios
const qerrors = offlineMode.getQerrors(); // Returns stubbed qerrors

// Clear offline cache
offlineMode.clearOfflineCache();
```

**Methods**:

| Method | Description |
|--------|-------------|
| `setOfflineMode(enabled)` | Enable/disable offline mode |
| `isOfflineMode()` | Check if offline mode is active |
| `getAxios()` | Get offline-stubbed axios |
| `getQerrors()` | Get offline-stubbed qerrors |
| `clearOfflineCache()` | Clear offline mode cache |

## 🌐 HTTP Testing

### createMockApp()

Create Express-like app for HTTP testing.

```typescript
import { createMockApp, supertest } from 'qtests';

const app = createMockApp();

// Define routes
app.get('/users', (req, res) => {
  res.status(200).json({ users: [] });
});

app.post('/users', (req, res) => {
  res.status(201).json({ id: '1', ...req.body });
});

// Test the app
const response = await supertest(app)
  .get('/users')
  .expect(200);

expect(response.body.users).toEqual([]);
```

**App Methods**:
- Standard Express methods: `get()`, `post()`, `put()`, `delete()`, `patch()`
- Middleware support: `use()`
- Response helpers: `status()`, `json()`, `send()`, `end()`

### supertest()

Supertest-like interface for HTTP testing.

```typescript
const response = await supertest(app)
  .post('/users')
  .send({ name: 'John', email: 'john@example.com' })
  .set('Authorization', 'Bearer token')
  .expect(201)
  .expect('Content-Type', /json/);

expect(response.body).toMatchObject({
  id: expect.any(String),
  name: 'John',
  email: 'john@example.com'
});
```

**Chainable Methods**:
- `.get(url)`, `.post(url)`, `.put(url)`, `.delete(url)`, `.patch(url)`
- `.send(data)` - Send request body
- `.set(header, value)` - Set request header
- `.expect(status)` - Expect response status
- `.expect(header, value)` - Expect response header
- `.end()` - Execute request (returns Promise)

## 🛠️ Advanced Features

### Error Handling

#### handleError()

Comprehensive error handling with logging and context.

```typescript
import { handleError } from 'qtests/lib/errorHandling.js';

handleError(error, context, options);

// Example:
try {
  await riskyOperation();
} catch (error) {
  handleError(error, 'user-registration', {
    logToConsole: true,
    includeStack: true,
    context: { userId: '123', action: 'register' },
    fallbackMessage: 'Registration failed'
  });
}
```

**Options**:
```typescript
interface ErrorHandlingOptions {
  logToConsole?: boolean;        // Default: true
  includeStack?: boolean;         // Default: true
  context?: Record<string, any>; // Default: {}
  fallbackMessage?: string;       // Default: undefined
  onRetry?: (attempt: number) => void; // Retry callback
}
```

#### handleAsyncError()

Async error handling with fallback values.

```typescript
import { handleAsyncError } from 'qtests/lib/errorHandling.js';

const result = await handleAsyncError(
  promise,
  context,
  options
);

// Example:
const user = await handleAsyncError(
  fetchUser('123'),
  'user-fetch',
  {
    fallbackValue: null,
    context: { userId: '123' }
  }
);
```

**Returns**: Promise resolving to either the promise result or fallback value.

### Performance Testing

#### runPerformanceTest()

Execute performance benchmarks.

```typescript
import { runPerformanceTest } from 'qtests/lib/performance.js';

const results = await runPerformanceTest(config);

// Example:
const results = await runPerformanceTest({
  testFunction: () => processData(largeDataset),
  duration: 5000,    // 5 seconds
  samples: 100,       // Number of samples to collect
  warmupSamples: 10   // Warm-up samples
});

console.log({
  averageTime: results.averageTime,
  minTime: results.minTime,
  maxTime: results.maxTime,
  opsPerSecond: results.opsPerSecond,
  percentiles: results.percentiles
});
```

**Configuration**:
```typescript
interface PerformanceConfig {
  testFunction: () => any;           // Function to benchmark
  duration?: number;                   // Test duration in ms (default: 5000)
  samples?: number;                    // Number of samples (default: 100)
  warmupSamples?: number;              // Warm-up samples (default: 10)
  memoryTracking?: boolean;            // Track memory usage (default: true)
}
```

**Results**:
```typescript
interface PerformanceResults {
  averageTime: number;      // Average execution time
  minTime: number;         // Minimum execution time
  maxTime: number;         // Maximum execution time
  opsPerSecond: number;     // Operations per second
  percentiles: {           // Percentile breakdown
    p50: number;
    p90: number;
    p95: number;
    p99: number;
  };
  memoryUsage?: {         // If memory tracking enabled
    before: NodeJS.MemoryUsage;
    after: NodeJS.MemoryUsage;
    delta: number;
  };
}
```

#### measureMemoryUsage()

Get current memory usage snapshot.

```typescript
import { measureMemoryUsage } from 'qtests/lib/performance.js';

const memoryBefore = measureMemoryUsage();
await heavyOperation();
const memoryAfter = measureMemoryUsage();

console.log(`Memory delta: ${memoryAfter.heapUsed - memoryBefore.heapUsed} bytes`);
```

### Circuit Breaker

#### createCircuitBreaker()

Create circuit breaker for external service calls.

```typescript
import { createCircuitBreaker } from 'qtests/lib/circuitBreaker.js';

const breaker = createCircuitBreaker(
  functionToProtect,
  options
);

// Example:
const breaker = createCircuitBreaker(
  async (data) => externalService.process(data),
  {
    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
    monitoring: {
      log: console.info,
      metrics: true
    }
  }
);

try {
  const result = await breaker.fire(userData);
  console.log('Success:', result);
} catch (error) {
  if (error.code === 'EOPENBREAKER') {
    console.log('Circuit is open - using fallback');
    return fallbackResponse;
  }
  throw error;
}
```

**Options**:
```typescript
interface CircuitBreakerOptions {
  timeout?: number;                    // Timeout in ms (default: 5000)
  errorThresholdPercentage?: number;      // Error threshold % (default: 50)
  resetTimeout?: number;               // Reset timeout in ms (default: 30000)
  minimumThroughput?: number;          // Min calls before opening (default: 10)
  monitoring?: {
    log?: (message: string) => void;
    metrics?: boolean;                  // Enable metrics collection
  };
}
```

**Events**:
- `open` - Circuit opened
- `close` - Circuit closed
- `halfOpen` - Circuit half-open (testing)
- `fallback` - Fallback used
- `timeout` - Call timed out

### Connection Pool Health Monitoring

#### addHealthMonitoring()

Add health monitoring to connection pools.

```typescript
import { addHealthMonitoring } from 'qtests/lib/connectionPoolHealth.js';

const monitor = addHealthMonitoring(pool, options);

// Example:
const monitor = addHealthMonitoring(pool, {
  healthCheckInterval: 30000,        // 30 seconds
  validationTimeout: 5000,           // 5 second timeout
  maxConcurrentValidations: 5,      // Max parallel validations
  unhealthyConnectionThreshold: 3,     // Failures before marking unhealthy
  enableDetailedLogging: false,       // Reduce log noise
  metrics: {
    enabled: true,
    prometheus: true,
    customTags: { service: 'user-api' }
  }
});

// Start monitoring
monitor.startHealthMonitoring();

// Listen to events
monitor.on('health-check-completed', (status) => {
  console.log('Health status:', status);
});
```

**Options**:
```typescript
interface HealthMonitoringOptions {
  healthCheckInterval?: number;        // Check interval in ms (default: 30000)
  validationTimeout?: number;          // Validation timeout in ms (default: 5000)
  maxConcurrentValidations?: number;  // Max concurrent validations (default: 5)
  unhealthyConnectionThreshold?: number; // Failures before unhealthy (default: 3)
  enableDetailedLogging?: boolean;     // Enable verbose logging (default: false)
  validate?: (connection: any) => Promise<boolean>; // Custom validation function
  metrics?: {
    enabled?: boolean;
    prometheus?: boolean;
    customTags?: Record<string, string>;
  };
}
```

**Health Status**:
```typescript
interface HealthStatus {
  timestamp: Date;                    // When check was performed
  totalConnections: number;           // Total connections in pool
  healthyConnections: number;         // Connections that passed validation
  unhealthyConnections: number;       // Connections that failed validation
  validatedConnections: number;        // Total connections validated
  replacedConnections: number;         // Connections replaced during check
  validationErrors: string[];         // Array of validation error messages
  averageResponseTime: number;         // Average time for validation operations
  memoryUsage: NodeJS.MemoryUsage;    // Current memory usage statistics
}
```

## 🎯 Jest Integration

### createJestConfig()

Create standardized Jest configurations.

```typescript
import { createJestConfig } from 'qtests/lib/jestConfigFactory.js';

const config = createJestConfig(preset, options);

// Example:
const config = createJestConfig('typescript-esm', {
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  testEnvironment: 'node'
});

export default config;
```

**Presets**:
- `typescript-esm` - TypeScript with ES modules
- `typescript-cjs` - TypeScript with CommonJS
- `javascript-cjs` - JavaScript with CommonJS
- `react-typescript` - React with TypeScript
- `demo` - Demo configuration

### Test Generator

#### TestGenerator Class

```typescript
import { TestGenerator } from 'qtests/dist/lib/testGenerator.js';

const generator = new TestGenerator(options);
await generator.generateTestFiles(dryRun);
const results = generator.getResults();
```

**Options**:
```typescript
interface TestGeneratorOptions {
  SRC_DIR?: string;                    // Source directory (default: '.')
  TEST_DIR?: string;                    // Test directory (default: 'tests/generated-tests')
  KNOWN_MOCKS?: string[];              // Mock libraries (default: ['axios', 'winston', ...])
  VALID_EXTS?: string[];                // File extensions (default: ['.ts', '.js', '.tsx', '.jsx'])
  include?: string[];                   // Include glob patterns
  exclude?: string[];                   // Exclude glob patterns
  mode?: 'heuristic' | 'ast';          // Analysis mode (default: 'heuristic')
  skipReactComponents?: boolean;         // Skip React tests (default: true)
  force?: boolean;                       // Overwrite existing tests (default: false)
}
```

**Results**:
```typescript
interface GenerationResult {
  file: string;           // Generated file path
  type: 'unit' | 'integration'; // Test type
  exports: string[];       // Generated exports
  status: 'created' | 'updated' | 'skipped';
}
```

## 🔧 Custom Module Stubs

### registerModuleStub()

Register custom module stubs at runtime.

```typescript
import { registerModuleStub } from 'qtests/utils/customStubs.js';

// Register simple stub
registerModuleStub('external-service', {
  method1: () => 'stubbed result',
  method2: async () => ({ success: true })
});

// Register factory stub
registerModuleStub('database', () => {
  const data = new Map();
  return {
    find: async (id) => data.get(id),
    save: async (record) => {
      const id = record.id || Math.random().toString(36);
      data.set(id, { ...record, id });
      return data.get(id);
    }
  };
});

// Use stubbed modules
const service = require('external-service');
const db = require('database');

console.log(service.method1()); // 'stubbed result'
console.log(await db.save({ name: 'Test' })); // Saved record
```

**Methods**:
- `registerModuleStub(name, exports)` - Register stub
- `unregisterModuleStub(name)` - Unregister stub
- `listModuleStubs()` - List active stubs
- `clearAllModuleStubs()` - Clear all custom stubs

## 🌐 Browser Testing Polyfills

### Polyfill Management

```typescript
import { 
  initializePolyfills, 
  resetPolyfills, 
  getWindow, 
  matchMedia, 
  clipboard,
  polyfillOrchestrator 
} from 'qtests';

// Initialize browser environment
initializePolyfills();

// Access browser APIs
const window = getWindow();
window.innerWidth = 1024;
window.innerHeight = 768;

// Media queries
const mediaQuery = matchMedia('(max-width: 768px)');
if (mediaQuery.matches) {
  console.log('Mobile viewport');
}

// Clipboard API
clipboard.writeText('text to copy');
const copiedText = clipboard.readText();

// Clean up polyfills
resetPolyfills();
```

**Available Polyfills**:
- `window` object with common properties
- `document` object with basic DOM methods
- `navigator` object
- `matchMedia()` for responsive testing
- `clipboard` API for clipboard operations
- `localStorage` and `sessionStorage`
- `fetch()` API polyfill

## 🏃 Test Runner

### runTestSuite()

Execute test suites without external frameworks.

```typescript
import { runTestSuite, createAssertions } from 'qtests';

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

**Assertion Methods**:
- `assert.equals(actual, expected)` - Equality check
- `assert.notEquals(actual, expected)` - Inequality check
- `assert.isTrue(value)` - Truthiness check
- `assert.isFalse(value)` - Falsiness check
- `assert.isNull(value)` - Null check
- `assert.isNotNull(value)` - Not null check
- `assert.throws(fn)` - Expect error
- `assert.doesNotThrow(fn)` - Expect no error

### runTestSuites()

Run multiple test suites.

```typescript
const suites = {
  'Math Tests': mathTests,
  'String Tests': stringTests,
  'Array Tests': arrayTests
};

const results = runTestSuites(suites);
console.log(`Total tests: ${results.total}`);
console.log(`Passed: ${results.passed}`);
console.log(`Failed: ${results.failed}`);
```

## 📝 Configuration Variables

### Local Configuration

Access qtests internal configuration.

```typescript
import { 
  // Test configuration
  defaultTestTimeout,
  defaultRetryAttempts,
  defaultRetryDelay,
  maxConcurrentTests,
  
  // Performance configuration
  performanceTestDuration,
  performanceTestSamples,
  performanceTestThreshold,
  
  // Mock configuration
  defaultMockStatusCode,
  defaultMockResponse,
  axiosStubTimeout,
  
  // Feature flags
  experimentalFeatures,
  legacyMode,
  devVerboseLogging
} from 'qtests';

// Use in tests
test('with custom timeout', async () => {
  // Test respects defaultTestTimeout
}, defaultTestTimeout);
```

This API reference covers all public APIs and common usage patterns for qtests. For additional examples and integration patterns, see the other documentation files.