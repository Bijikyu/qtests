# Migration Guide

This guide helps users migrate from older qtests versions to the current version (2.0.0) and adopt new features.

## 🔄 Version 1.x to 2.0.0 Migration

### Breaking Changes

#### Import Path Changes

**Before (v1.x)**:
```typescript
import { TestGenerator } from 'qtests';
import { httpTest } from 'qtests/lib/envUtils.js';
```

**After (v2.0.0)**:
```typescript
import { TestGenerator } from 'qtests/dist/lib/testGenerator.js'; // Use compiled path
import { httpTest } from 'qtests'; // Use main export when available

// Or use convenience exports
import { stubMethod, mockConsole } from 'qtests';
```

#### Dependency Structure

**Before**: qtests claimed "zero dependencies"
**After**: qtests has minimal production dependencies with comprehensive dev dependencies for TypeScript support

```json
// package.json - now includes essential production dependencies
{
  "dependencies": {
    "qtests": "^2.0.0"
  }
}
```

#### CLI Command Preference

**Before**: `qtests-ts-generate` was the primary command
**After**: `qtests-generate` is preferred, `qtests-ts-generate` maintained for backward compatibility

```bash
# Preferred (new)
npx qtests-generate

# Supported (legacy compatibility)
npx qtests-ts-generate
```

### New Features Adoption

#### Error Handling System

**Migration**: Replace manual try-catch with qtests error handling

**Before**:
```typescript
try {
  await riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
  throw error;
}
```

**After**:
```typescript
import { handleError, handleAsyncError } from 'qtests/lib/errorHandling.js';

// Synchronous error handling
try {
  riskyOperation();
} catch (error) {
  handleError(error, 'operation-context', {
    logToConsole: true,
    includeStack: true,
    context: { userId: '123' }
  });
}

// Async error handling with fallback
const result = await handleAsyncError(
  riskyOperation(),
  'operation-context',
  { fallbackValue: null }
);
```

#### Performance Testing Integration

**Migration**: Add performance testing to critical paths

**Before**:
```typescript
// Manual timing
const start = Date.now();
await operation();
const duration = Date.now() - start;
console.log(`Operation took ${duration}ms`);
```

**After**:
```typescript
import { runPerformanceTest } from 'qtests/lib/performance.js';

const results = await runPerformanceTest({
  testFunction: () => operation(),
  duration: 5000,
  samples: 100
});

console.log(`Average: ${results.averageTime}ms, Ops/sec: ${results.opsPerSecond}`);
```

#### Circuit Breaker Implementation

**Migration**: Replace manual retry logic with circuit breakers

**Before**:
```typescript
let retries = 0;
const maxRetries = 3;

while (retries < maxRetries) {
  try {
    return await externalService.call();
  } catch (error) {
    retries++;
    if (retries >= maxRetries) throw error;
    await new Promise(resolve => setTimeout(resolve, 1000 * retries));
  }
}
```

**After**:
```typescript
import { createCircuitBreaker } from 'qtests/lib/circuitBreaker.js';

const breaker = createCircuitBreaker(
  externalService.call,
  {
    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000
  }
);

try {
  return await breaker.fire();
} catch (error) {
  if (error.code === 'EOPENBREAKER') {
    // Handle circuit open state
    return fallbackResponse;
  }
  throw error;
}
```

## 🔧 Setup Migration

### Jest Configuration Migration

**Before**: Manual Jest configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  // Manual configuration
};
```

**After**: Use qtests Jest configuration factory
```javascript
// jest.config.mjs
import { createJestConfig } from 'qtests/lib/jestConfigFactory.js';

export default createJestConfig('typescript-esm', {
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  testEnvironment: 'node'
});
```

### Test Environment Setup Migration

**Before**: Manual environment setup
```typescript
// setupTests.js
process.env.NODE_ENV = 'test';
process.env.DEBUG = 'app:*';
```

**After**: Use qtests environment management
```typescript
// setupTests.js
import { testEnv } from 'qtests';
import './node_modules/qtests/setup.js';

testEnv.setTestEnv();

// In tests, use withSavedEnv for isolation
import { testHelpers } from 'qtests';

test('isolated test', async () => {
  await testHelpers.withSavedEnv(async () => {
    process.env.TEMP_VAR = 'value';
    // Automatically restored
  });
});
```

## 🧪 Testing Pattern Migration

### Unit Test Migration

**Before**: Basic assertion testing
```typescript
test('adds numbers', () => {
  expect(add(1, 2)).toBe(3);
});
```

**After**: Enhanced with qtests utilities
```typescript
import { stubMethod } from 'qtests';

test('adds numbers with stubbed dependency', () => {
  const math = { add: (a, b) => a + b };
  const restore = stubMethod(math, 'add', (a, b) => a + b + 1);
  
  expect(math.add(1, 2)).toBe(4); // Using stub
  
  restore();
  expect(math.add(1, 2)).toBe(3); // Using original
});
```

### Integration Test Migration

**Before**: Manual Express app setup
```typescript
import express from 'express';
import request from 'supertest';

const app = express();
app.use('/api', apiRoutes);

test('GET /api/users', async () => {
  const response = await request(app)
    .get('/api/users')
    .expect(200);
});
```

**After**: Use qtests HTTP testing utilities
```typescript
import { createMockApp, supertest } from 'qtests';

const app = createMockApp();
app.use('/api', apiRoutes);

test('GET /api/users', async () => {
  const response = await supertest(app)
    .get('/api/users')
    .expect(200);
    
  // qtests supertest includes enhanced features
  expect(response.body).toBeDefined();
});
```

## 📁 Project Structure Migration

### Directory Structure

**Before**: Flat test structure
```
project/
├── src/
├── tests/
│   ├── unit/
│   └── integration/
└── jest.config.js
```

**After**: Organized with qtests conventions
```
project/
├── src/
├── tests/
│   ├── unit/                    # Traditional unit tests
│   ├── integration/              # Integration tests
│   ├── generated-tests/          # qtests generated tests
│   ├── performance/             # Performance benchmarks
│   ├── manual-tests/            # Complex manual tests
│   └── e2e/                    # End-to-end tests
├── config/
│   ├── jest.config.mjs          # Generated by qtests
│   ├── jest-setup.ts            # Generated by qtests
│   └── jest-require-polyfill.cjs # Generated by qtests
├── qtests-runner.mjs            # Generated by qtests
└── package.json                # Updated with qtests scripts
```

### Package.json Scripts Migration

**Before**: Basic npm scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

**After**: Enhanced with qtests scripts
```json
{
  "scripts": {
    "pretest": "node scripts/clean-dist.mjs && node scripts/ensure-runner.mjs",
    "test": "node qtests-runner.mjs",
    "test:unit": "node qtests-runner.mjs --testPathPattern=tests/unit",
    "test:integration": "node qtests-runner.mjs --testPathPattern=tests/integration",
    "test:performance": "node tests/performance/run-benchmarks.js",
    "test:generate": "qtests-generate --force",
    "test:ci": "CI=true npm test",
    "ci:verify": "node scripts/ci-verify-runner.mjs"
  }
}
```

## 🔄 CI/CD Migration

### GitHub Actions Migration

**Before**: Basic test workflow
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm test
```

**After**: Enhanced qtests workflow
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      
      - name: Generate tests
        run: npx qtests-generate --force --integration
      
      - name: Run tests
        run: npm test
        
      - name: Performance tests
        run: npm run test:performance
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 🔧 Configuration Migration

### Environment Variables

**Before**: Manual environment setup
```bash
export NODE_ENV=test
export DEBUG=*
```

**After**: qtests environment management
```bash
# qtests automatically sets these in test mode
export QTESTS_SILENT=1           # Reduce noise in CI
export QTESTS_INBAND=1           # Run tests serially
export QTESTS_FILE_WORKERS=2       # Limit parallel workers
export QTESTS_SUPPRESS_DEBUG=1     # Suppress DEBUG_TESTS.md creation
```

### TypeScript Configuration

**Before**: Basic tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "lib": ["ES2018"]
  }
}
```

**After**: Enhanced for qtests compatibility
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "types": ["node", "jest"],
    "skipLibCheck": true
  },
  "include": [
    "src/**/*",
    "tests/**/*"
  ]
}
```

## 🆕 Adopting New Features

### Custom Module Stubs

**Migration**: Replace manual mocks with qtests custom stubs

**Before**:
```typescript
jest.mock('external-service', () => ({
  method: () => 'mocked result'
}));
```

**After**:
```typescript
import { registerModuleStub } from 'qtests/utils/customStubs.js';

registerModuleStub('external-service', {
  method: () => 'mocked result'
});

// Now works without Jest mocks
const service = require('external-service');
console.log(service.method()); // 'mocked result'
```

### Health Monitoring

**Migration**: Add health monitoring to database connections

**Before**: Basic connection testing
```typescript
const pool = createPool();
// Manual health checks needed
```

**After**: Automatic health monitoring
```typescript
import { addHealthMonitoring } from 'qtests/lib/connectionPoolHealth.js';

const pool = createPool();
const monitor = addHealthMonitoring(pool, {
  healthCheckInterval: 30000,
  unhealthyConnectionThreshold: 3
});

monitor.startHealthMonitoring();
// Automatic monitoring and recovery
```

## ⚠️ Common Migration Issues

### Import Resolution Errors

**Issue**: Cannot find qtests modules after upgrade

**Solution**:
```typescript
// Use dist paths for direct imports
import { TestGenerator } from 'qtests/dist/lib/testGenerator.js';

// Or use main exports
import { createCircuitBreaker } from 'qtests';
```

### Test Generation Failures

**Issue**: qtests-generate fails after migration

**Solution**:
```bash
# Clear cache and regenerate
rm -rf .jest-cache
rm -rf node_modules/.cache
npx qtests-generate --force --dry-run  # Preview first
npx qtests-generate --force           # Then generate
```

### Performance Regression

**Issue**: Tests running slower after migration

**Solution**:
```javascript
// jest.config.mjs - optimize for performance
export default {
  maxWorkers: '50%',  // Limit parallelism
  cache: true,        // Enable caching
  transformIgnorePatterns: [
    'node_modules/(?!(qtests)/)'
  ]
};
```

## 📚 Additional Resources

### Migration Tools

**Automated Migration Script**:
```bash
# Run qtests migration helper
npx qtests-migrate --from-version 1.x --to-version 2.0.0

# Options:
# --backup              # Create backup before migration
# --dry-run            # Preview changes
# --update-configs       # Update configuration files
# --migrate-tests       # Update test files
```

### Validation Steps

After migration, validate with:
```bash
# 1. Check installation
npm list qtests

# 2. Verify imports
node -e "console.log(Object.keys(require('qtests')))"

# 3. Test generation
npx qtests-generate --dry-run

# 4. Run tests
npm test

# 5. Performance check
npm run test:performance
```

### Support Resources

- **Migration Guide**: This document
- **API Reference**: [API_REFERENCE.md](./API_REFERENCE.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Enterprise Integration**: [ENTERPRISE_INTEGRATION.md](./ENTERPRISE_INTEGRATION.md)
- **GitHub Issues**: Report migration-specific issues with tag `migration`

This migration guide should help you successfully upgrade to qtests 2.0.0 and take advantage of new features while maintaining backward compatibility where possible.