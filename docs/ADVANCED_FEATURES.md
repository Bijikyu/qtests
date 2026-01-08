# Advanced Features Documentation

This document covers advanced qtests features that require detailed configuration or have complex use cases.

## 🔄 Error Handling System

The error handling system provides comprehensive error management with context preservation, fallback mechanisms, and integration with monitoring systems.

### Core Error Handling Functions

```typescript
import { handleError, handleAsyncError } from 'qtests/lib/errorHandling.js';

// Basic error handling
handleError(error, 'user-registration', {
  logToConsole: true,
  includeStack: true,
  context: { userId: '123', action: 'register' }
});

// Async error handling with fallback
const user = await handleAsyncError(
  fetchUser('123'), 
  'user-fetch',
  { 
    fallbackValue: null,
    context: { userId: '123' },
    onRetry: (attempt) => console.log(`Retry attempt ${attempt}`)
  }
);
```

### Error Handling Options

| Option | Type | Default | Description |
|--------|------|----------|-------------|
| `logToConsole` | boolean | true | Log errors to console |
| `includeStack` | boolean | true | Include stack trace in logs |
| `context` | object | {} | Additional context data |
| `fallbackValue` | any | undefined | Value to return on error |
| `fallbackMessage` | string | undefined | Custom error message |
| `onRetry` | function | undefined | Callback on retry attempts |

## ⚡ Performance Testing Framework

Built-in performance testing capabilities for benchmarking, load testing, and regression detection.

### Performance Testing

```typescript
import { runPerformanceTest, measureMemoryUsage } from 'qtests/lib/performance.js';

// Basic performance benchmark
const results = await runPerformanceTest({
  testFunction: () => processData(largeDataset),
  duration: 5000, // Test duration in ms
  samples: 100,    // Number of samples to collect
  warmupSamples: 10 // Warm-up samples
});

console.log({
  averageTime: results.averageTime,
  minTime: results.minTime,
  maxTime: results.maxTime,
  opsPerSecond: results.opsPerSecond,
  percentiles: results.percentiles
});

// Memory usage measurement
const before = measureMemoryUsage();
await heavyOperation();
const after = measureMemoryUsage();

console.log(`Memory delta: ${after.heapUsed - before.heapUsed} bytes`);
```

### Load Testing

```typescript
import { runLoadTest } from 'qtests/lib/performance.js';

const loadResults = await runLoadTest({
  targetFunction: () => apiCall('/api/users'),
  concurrentUsers: 50,
  duration: 30000, // 30 seconds
  rampUpTime: 5000  // 5 seconds ramp-up
});

console.log(`Total requests: ${loadResults.totalRequests}`);
console.log(`Success rate: ${loadResults.successRate}%`);
console.log(`Average response time: ${loadResults.averageResponseTime}ms`);
```

## 🔗 Circuit Breaker Implementation

Production-ready circuit breaker using Opossum library with enterprise features.

### Circuit Breaker Setup

```typescript
import { createCircuitBreaker } from 'qtests/lib/circuitBreaker.js';

// Basic circuit breaker
const breaker = createCircuitBreaker(
  async (data) => externalService.process(data),
  {
    timeout: 5000,                    // 5 second timeout
    errorThresholdPercentage: 50,       // Open at 50% error rate
    resetTimeout: 30000,              // 30 second reset timeout
    monitoring: {
      log: console.info,
      metrics: true                   // Enable metrics collection
    }
  }
);

// Using the circuit breaker
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

### Circuit Breaker Events

```typescript
// Monitor circuit breaker state changes
breaker.on('open', () => {
  alertingService.sendAlert('Circuit breaker opened', { service: 'external-api' });
});

breaker.on('halfOpen', () => {
  console.log('Circuit breaker half-open - testing service');
});

breaker.on('close', () => {
  alertingService.resolveAlert('Circuit breaker closed');
});

breaker.on('fallback', (result) => {
  metricsService.recordFallbackUsage();
});
```

## 📊 Connection Pool Health Monitoring

Advanced health monitoring for database connection pools with metrics and automatic recovery.

### Health Monitoring Setup

```typescript
import { addHealthMonitoring, createHealthMonitoredPool } from 'qtests/lib/connectionPoolHealth.js';

// Option 1: Add to existing pool
const pool = createDatabasePool();
const monitor = addHealthMonitoring(pool, {
  healthCheckInterval: 30000,        // 30 seconds
  validationTimeout: 5000,           // 5 second timeout
  maxConcurrentValidations: 5,      // Max parallel validations
  unhealthyConnectionThreshold: 3,     // Fail 3 times before marking unhealthy
  enableDetailedLogging: false,       // Reduce log noise in production
  metrics: {
    enabled: true,
    prometheus: true,               // Enable Prometheus metrics
    customTags: { service: 'user-api' }
  }
});

// Option 2: Create pool with built-in monitoring
const { pool: monitoredPool, monitor: newMonitor } = createHealthMonitoredPool(
  {
    maxConnections: 20,
    factory: createDatabaseConnection,
    destroy: destroyDatabaseConnection,
    validate: validateConnection
  },
  {
    healthCheckInterval: 15000,
    unhealthyConnectionThreshold: 2
  }
);
```

### Health Events and Metrics

```typescript
// Listen to health events
monitor.on('health-check-completed', (status) => {
  console.log({
    timestamp: status.timestamp,
    totalConnections: status.totalConnections,
    healthyConnections: status.healthyConnections,
    unhealthyConnections: status.unhealthyConnections,
    averageResponseTime: status.averageResponseTime,
    memoryUsage: status.memoryUsage.heapUsed
  });
});

monitor.on('connection-unhealthy', async (data) => {
  // Log to monitoring system
  await loggingService.warn('Connection unhealthy', {
    connectionId: data.connection.id,
    error: data.error.message,
    consecutiveFailures: data.consecutiveFailures
  });
});

monitor.on('connection-replaced', (data) => {
  metricsService.incrementCounter('connection_pool_replacements', {
    oldConnectionId: data.oldConnection.id,
    newConnectionId: data.newConnection.id
  });
});

// Get current health status
const currentStatus = monitor.getLastHealthStatus();
if (currentStatus.unhealthyConnections > 0) {
  console.warn(`Pool has ${currentStatus.unhealthyConnections} unhealthy connections`);
}
```

### Integration with Monitoring Systems

```typescript
// Prometheus metrics
const prometheus = require('prom-client');

const healthGauge = new prometheus.Gauge({
  name: 'connection_pool_healthy_connections',
  help: 'Number of healthy connections in pool',
  labelNames: ['service', 'pool']
});

const responseTimeGauge = new prometheus.Gauge({
  name: 'connection_pool_validation_response_time',
  help: 'Average validation response time in ms',
  labelNames: ['service', 'pool']
});

monitor.on('health-check-completed', (status) => {
  healthGauge.set(
    { service: 'user-api', pool: 'main' }, 
    status.healthyConnections
  );
  responseTimeGauge.set(
    { service: 'user-api', pool: 'main' }, 
    status.averageResponseTime
  );
});
```

## 🛠️ Jest Configuration Factory

Standardized Jest configurations for different project types and scenarios.

### Using the Configuration Factory

```typescript
import { createJestConfig } from 'qtests/lib/jestConfigFactory.js';

// TypeScript ESM project
const tsEsmConfig = createJestConfig('typescript-esm', {
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
});

// React TypeScript project
const reactConfig = createJestConfig('react-typescript', {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1'
  }
});

// JavaScript CommonJS project
const jsConfig = createJestConfig('javascript-cjs', {
  testEnvironment: 'node',
  collectCoverage: true
});

// Write configuration files
import { writeFileSync } from 'fs';
writeFileSync('jest.config.mjs', `export default ${JSON.stringify(tsEsmConfig, null, 2)};`);
```

### Available Configuration Presets

| Preset | Description | Use Case |
|--------|-------------|-----------|
| `typescript-esm` | TypeScript with ES modules | Modern TypeScript projects |
| `typescript-cjs` | TypeScript with CommonJS | Legacy TypeScript projects |
| `javascript-cjs` | JavaScript with CommonJS | Node.js JavaScript projects |
| `react-typescript` | React with TypeScript | React applications |
| `demo` | Demo/test configuration | Examples and demos |

### Custom Configuration Options

```typescript
const customConfig = createJestConfig('typescript-esm', {
  // Coverage settings
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Performance settings
  maxWorkers: '50%',
  testTimeout: 10000,
  
  // Reporting
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'reports', outputName: 'junit.xml' }],
    ['jest-html-reporters', { publicPath: 'reports', filename: 'report.html' }]
  ],
  
  // Transform patterns
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  
  // Module mapping
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
});
```

## 🔧 Custom Module Stubs

Advanced module stubbing for complex scenarios and external dependencies.

### Registering Custom Stubs

```typescript
import { registerModuleStub, unregisterModuleStub, clearAllModuleStubs } from 'qtests/utils/customStubs.js';

// Register a simple stub
registerModuleStub('external-api', {
  getUsers: () => [{ id: 1, name: 'Test User' }],
  createUser: (userData) => ({ id: 2, ...userData }),
  deleteUser: (id) => true
});

// Register a factory stub for dynamic behavior
registerModuleStub('database', () => {
  const data = new Map();
  
  return {
    find: async (id) => data.get(id),
    save: async (record) => {
      const id = record.id || Math.random().toString(36);
      data.set(id, { ...record, id });
      return data.get(id);
    },
    delete: async (id) => data.delete(id)
  };
});

// Use the stubbed modules
const api = require('external-api');
const db = require('database');

const users = await api.getUsers();
const user = await db.save({ name: 'New User' });
const deleted = await api.deleteUser(1);
```

### Stub Lifecycle Management

```typescript
// List active stubs
const activeStubs = listModuleStubs();
console.log('Active stubs:', activeStubs);

// Unregister a specific stub
unregisterModuleStub('external-api');

// Clear all custom stubs (useful in test cleanup)
clearAllModuleStubs();
```

### Advanced Stub Patterns

```typescript
// Conditional stubbing based on environment
if (process.env.NODE_ENV === 'test') {
  registerModuleStub('payment-service', {
    processPayment: (amount) => ({ 
      success: true, 
      transactionId: 'test-' + Math.random(),
      amount,
      mode: 'test'
    })
  });
}

// Stub with state management
let mockDatabase = new Map();
registerModuleStub('user-service', () => ({
  findById: async (id) => mockDatabase.get(id),
  create: async (userData) => {
    const user = { id: Date.now().toString(), ...userData };
    mockDatabase.set(user.id, user);
    return user;
  },
  update: async (id, updates) => {
    const user = mockDatabase.get(id);
    if (user) {
      Object.assign(user, updates);
      mockDatabase.set(id, user);
    }
    return user;
  },
  delete: async (id) => mockDatabase.delete(id),
  
  // Helper for test setup
  _reset: () => { mockDatabase.clear(); },
  _seed: (users) => { 
    mockDatabase = new Map(users.map(u => [u.id, u])); 
  }
}));

// In tests
const userService = require('user-service');
userService._seed([{ id: '1', name: 'Test User' }]);
const user = await userService.findById('1');
```

## Integration Examples

### Complete Test Suite with Advanced Features

```typescript
// tests/integration/user-service.test.ts
import './node_modules/qtests/setup.js';
import { addHealthMonitoring } from 'qtests/lib/connectionPoolHealth.js';
import { createCircuitBreaker } from 'qtests/lib/circuitBreaker.js';
import { handleError, handleAsyncError } from 'qtests/lib/errorHandling.js';
import { runPerformanceTest } from 'qtests/lib/performance.js';
import { registerModuleStub } from 'qtests/utils/customStubs.js';

describe('User Service Integration', () => {
  let userService;
  let monitor;
  let circuitBreaker;

  beforeAll(async () => {
    // Stub external dependencies
    registerModuleStub('email-service', {
      send: async (email) => ({ success: true, messageId: 'test-id' })
    });

    // Set up service with health monitoring
    const pool = createDatabasePool();
    monitor = addHealthMonitoring(pool, {
      healthCheckInterval: 5000,
      enableDetailedLogging: true
    });
    
    // Wrap service with circuit breaker
    circuitBreaker = createCircuitBreaker(
      createUserService,
      {
        timeout: 3000,
        errorThresholdPercentage: 25,
        resetTimeout: 10000
      }
    );
    
    userService = await circuitBreaker.fire();
    await monitor.startHealthMonitoring();
  });

  afterAll(async () => {
    await monitor.stopHealthMonitoring();
    await monitor.shutdown(true);
  });

  test('creates user with error handling', async () => {
    const userData = { name: 'John Doe', email: 'john@example.com' };
    
    const result = await handleAsyncError(
      userService.createUser(userData),
      'user-creation',
      { 
        fallbackValue: null,
        context: { userData }
      }
    );

    expect(result).toBeTruthy();
    expect(result.name).toBe('John Doe');
  });

  test('user creation performance', async () => {
    const performanceResults = await runPerformanceTest({
      testFunction: () => userService.createUser({
        name: 'Performance Test',
        email: 'perf@test.com'
      }),
      duration: 2000,
      samples: 100
    });

    expect(performanceResults.averageTime).toBeLessThan(100); // 100ms threshold
    expect(performanceResults.opsPerSecond).toBeGreaterThan(10);
  });

  test('circuit breaker on service failure', async () => {
    // Simulate service failure
    const originalMethod = userService.createUser;
    userService.createUser = () => {
      throw new Error('Database connection failed');
    };

    // Trigger circuit breaker opening
    for (let i = 0; i < 10; i++) {
      try {
        await circuitBreaker.fire({ name: 'Test User' });
      } catch (error) {
        // Expected errors
      }
    }

    // Circuit should now be open
    await expect(circuitBreaker.fire({ name: 'Test User' }))
      .rejects.toThrow('EOPENBREAKER');

    // Restore original method
    userService.createUser = originalMethod;
  });
});
```

## Best Practices

1. **Error Handling**: Always use `handleError` and `handleAsyncError` for consistent error management
2. **Performance Testing**: Establish performance baselines early and monitor for regressions
3. **Circuit Breakers**: Use circuit breakers for all external service calls
4. **Health Monitoring**: Monitor database pools and external service connections
5. **Custom Stubs**: Use custom module stubs to isolate tests from external dependencies
6. **Configuration**: Use the Jest configuration factory for consistent test environments
7. **Cleanup**: Always properly shut down monitors and clear stubs in test cleanup