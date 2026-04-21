<p align="center"><img src="logoqtests.png" alt="qtests logo" width="100" height="100"></p>

# qtests

A comprehensive Node.js toolkit covering the full testing lifecycle and production reliability in a single dependency. Stub methods, mock modules and HTTP, test security and performance, generate integration tests automatically, and ship circuit breakers, caching, and rate limiting — all with first-class **ES Module and TypeScript** support.

**Latest Updates (v4.2.0 — April 2026)**:
- `npx qtests-generate` now writes integration test stubs under `tests/integration/` for every discovered source file — non-destructively
- After scaffolding, a ready-to-paste AI agent prompt is printed with three clear instructions: prune stubs that don't map to real workflows, fill in the ones that do, and leave the runner alone
- Source discovery covers 11 common layouts out of the box: `src`, `lib`, `bin`, `scripts`, `utils`, `pages`, `app`, `routes`, `controllers`, `packages`, `api`
- Generator output is now compact (3 summary lines instead of one line per file)
- Fixed: old v1.x binary no longer shadows the current generator when `qerrors` is installed as a dependency

**v4.0.0 — April 2026**:
- Security testing module: `SecurityValidator`, `JoiSecurityValidator`, and `PenetrationTester` with full TypeScript types
- Circuit breaker API: `createCircuitBreaker(options)`, `executeWithCircuitBreaker(fn, options)`, `getCircuitBreakerStats()`, `resetCircuitBreaker()`, `CircuitState` enum
- File system utilities: `safeExists` and `safeDelete` for safe file operations in tests
- Mocking improvements: `restoreAll()` and `verifyCallCount()` for cleaner test teardown
- Dual commercial licensing: free for individual developers, paid tiers for teams and companies
- Structured run-results file emitted after every test run for CI artifact ingestion

## Quick Start

```bash
npm install qtests --save-dev
```

### Environment variables

qtests uses [qerrors](https://www.npmjs.com/package/qerrors) for AI-powered error analysis and debugging suggestions. Set one of the following in your environment (or a `.env` file) before running tests:

```bash
OPENAI_API_KEY=sk-...      # OpenAI GPT models
# or
GEMINI_API_KEY=...         # Google Gemini models
```

qerrors degrades gracefully if neither key is set — errors are still logged, but without AI-generated suggestions. For local development you can omit both and everything will still work.

### Generate tests for your project

Point qtests at your source code and it will discover your files and write integration test stubs for you:

```bash
npx qtests-generate
```

This scaffolds `qtests-runner.mjs`, `config/jest.config.mjs`, and setup files, then scans your project for source files across the common source directories (`src`, `lib`, `bin`, `scripts`, `utils`, `pages`, `app`, `routes`, `controllers`, `packages`, `api`) and writes a stub under `tests/integration/` for each one — non-destructively, so existing test files are never overwritten.

After scaffolding, the generator prints a ready-to-paste AI agent prompt that tells your AI to delete stubs that don't map to real workflows, flesh out the ones that do, and leave the runner configuration alone.

```bash
# Preview what would be generated without writing any files
npx qtests-generate --dry-run

# Regenerate and overwrite existing stubs
npx qtests-generate --force

# Suppress the AI prompt (useful in CI)
QTESTS_SUPPRESS_PROMPT=1 npx qtests-generate
```

qtests can scaffold its Jest runner/config into your project root via `npx qtests-generate` (non-destructive by default). The runner expects Jest to be installed in your project (as a devDependency).

**Setup:** (Jest: loaded globally via `config/jest-setup.ts`/`config/jest-setup.cjs` when you use `npx qtests-generate`; otherwise, put this at the top of each test file before other imports.)
```typescript
// Enable automatic stubbing (CJS + ESM)
import 'qtests/setup';
// CommonJS:
// require('qtests/setup');

// Import with full type safety
import { stubMethod, mockConsole, testEnv } from 'qtests';

// Use with TypeScript intellisense
const restore = stubMethod(myObject, 'methodName', mockImplementation);
```

> **Module format note:** `qtests` (the main API) is ESM-only. In CommonJS tests, use `await import('qtests')` to access helpers like `stubMethod`. The setup entrypoint supports both `import 'qtests/setup'` and `require('qtests/setup')`.

## Features

### Testing
- **Auto Test Generation** — scans 11 common source directories and writes `tests/integration/` stubs for each source file; prints a ready-to-paste AI agent prompt to flesh them out (`npx qtests-generate`)
- **Method Stubbing** — replace any object method and restore it automatically (`stubMethod`, `spyOnMethod`)
- **Console Mocking** — capture and assert on console output with Jest-compatible spies
- **Module Stubs** — drop-in replacements for axios and winston; register custom stubs for any module
- **HTTP Testing** — mock Express apps, chainable supertest-style requests, route test utilities
- **Email Mocking** — send and inspect emails in tests without an external mail service
- **Browser Polyfills** — `window`, `matchMedia`, `clipboard`, and happy-dom for component testing in Node
- **Test Environment** — safe backup and restore of `process.env`; offline mode; test isolation helpers
- **Security Testing** — `SecurityValidator` and `JoiSecurityValidator` for input validation, XSS, path traversal, and HTML sanitisation; `PenetrationTester` for automated attack-vector probing
- **Performance & Load Testing** — built-in load runner, performance monitor, memory leak detector, memory pressure simulation
- **Validation** — schema-based input validation (Joi/Zod), streaming validation, HTML sanitisation middleware

### Production Reliability
- **Circuit Breaker** — `createCircuitBreaker`, `executeWithCircuitBreaker`, state machine with `CircuitState` enum
- **Connection Pooling** — `AdvancedConnectionPool` with health monitoring and metrics
- **Caching** — `CacheManager`, local in-process cache, distributed cache adapters
- **Rate Limiting** — token-bucket and flexible rate limiters ready for Express middleware
- **Logging** — structured Winston-based logging, decorators, convenience wrappers

### Developer Experience
- **Jest Scaffolding** — `npx qtests-generate` writes runner, `jest.config.mjs`, and setup files non-destructively
- **Jest Config Factory** — `createJestConfig` for standardised TypeScript-ESM, React, and monorepo configs
- **Error Handling** — `handleError`, `handleAsyncError`, typed fallbacks, and async wrappers
- **File System** — `safeReadFile`, `safeWriteFile`, `safeExists`, `safeDelete`, `ensureDir`
- **ESM + TypeScript** — full ES Module loader hook, complete type definitions, intellisense throughout

## Mock API (Runtime-Safe)

qtests exposes a small, extensible mocking API that works at runtime without rewriting paths or adding heavy frameworks.

Defaults registered by setup:
- `axios` → qtests stub (truthy, no network)
- `winston` → qtests stub (no-op logger with format/transports)

Usage:
```ts
import qtests from 'qtests';

// Register a custom module mock
qtests.mock.module('external-service', () => ({
  default: {
    call: async () => ({ ok: true })
  }
}));

// Now `require('external-service')` or `import ... from 'external-service'` returns the mock (CJS via require hook; ESM early via optional loader)
```

Notes:
- Activation is runtime-safe: a single require hook returns registered mocks; previously loaded CJS modules are best-effort evicted from `require.cache`.
- ESM projects can optionally use the loader for earliest interception:
  - `node --loader=qtests/loader.mjs your-app.mjs`
- setup still runs first in Jest via `config/jest-setup.ts` (TS) or `config/jest-setup.cjs` (JS-only) so defaults are active before imports.

## Core Usage

### Method Stubbing

```typescript
import { stubMethod } from 'qtests';

const myObj = { greet: (name: string) => `Hello, ${name}!` };

// Stub the method
const restore = stubMethod(myObj, 'greet', () => 'Hi!');
console.log(myObj.greet('Brian')); // 'Hi!'

// Restore original
restore();
console.log(myObj.greet('Brian')); // 'Hello, Brian!'
```

### Console Mocking

```typescript
import { mockConsole } from 'qtests';

const spy = mockConsole('log');
console.log('test message');

console.log(spy.mock.calls); // [['test message']]
spy.mockRestore(); // Restore original console.log
```

### Environment Management

```typescript
import { testEnv } from 'qtests';

// Set test environment
testEnv.setTestEnv(); // Sets NODE_ENV=test, DEBUG=qtests:*

// Save and restore environment
const saved = testEnv.saveEnv();
process.env.TEST_VAR = 'modified';
testEnv.restoreEnv(saved); // TEST_VAR removed, original state restored
```

## Unified Test Runner (API-Only)

- One command for everyone: `npm test`.
- One runner: `qtests-runner.mjs` runs Jest via the programmatic API `runCLI` (no child processes, no `tsx`).
- Honors: `QTESTS_INBAND=1` (serial) and `QTESTS_FILE_WORKERS=<n>` (max workers).
- Always uses project config and `passWithNoTests`, with `cache=true` and `coverage=false`.
- Debugging: creates `DEBUG_TESTS.md` on failures; override with `QTESTS_DEBUG_FILE=path` or suppress with `QTESTS_SUPPRESS_DEBUG=1`.
- Security tests run automatically after Jest. Skip them for fast local iteration with `QTESTS_SKIP_SECURITY=true npm test`.

Runner availability and generator behavior:
- Run `npx qtests-generate` once to scaffold `qtests-runner.mjs` and Jest config files if missing:
  - `config/jest.config.mjs` (ignores `dist/`, `build/`)
  - `config/jest-require-polyfill.cjs` (ensures `require(...)` is available in ESM tests)
  - `config/jest-setup.ts` (TS) or `config/jest-setup.cjs` (JS-only); both load `qtests/setup` first and register Jest mocks for `axios`/`winston`
- Use `--force` to overwrite existing scaffolded files.
- Use `--update-pkg-script` to set `package.json` `scripts.test` to `node qtests-runner.mjs`.
- Use `--auto-install` to install `ts-jest` + `typescript` as devDependencies if missing.

## Runner/Config Scaffolding

### CLI Usage

```bash
# Scaffold runner + Jest config (non-destructive)
npx qtests-generate

# Preview planned writes
npx qtests-generate --dry-run

# Overwrite existing scaffolded files
npx qtests-generate --force

# Update package.json scripts.test to use the runner
npx qtests-generate --update-pkg-script

# Install ts-jest + typescript if missing
npx qtests-generate --auto-install
```

### Custom Module Stubs (Advanced)

When you need to stub a niche dependency (beyond the built-ins axios/winston) without changing qtests itself, register a custom stub in tests:

```ts
// Always load setup first so axios/winston are stubbed globally
import 'qtests/setup';

// Then register your ad-hoc stub(s)
import { registerModuleStub } from 'qtests/utils/customStubs';

registerModuleStub('external-service-client', {
  ping: () => 'pong',
  get: async () => ({ ok: true })
});

// Now this resolves to your in-memory stub even if the module is not installed
const client = require('external-service-client');
await client.get(); // { ok: true }
```

## Module Stubs

### Axios Stub

```typescript
// Automatic when using qtests/setup (for require()-based resolution)
import 'qtests/setup';
const axios = require('axios');

const response = await axios.get('/api');
// Returns: { data: {}, status: 200, statusText: 'OK', headers: {}, config: {} }

await axios.post('/api', data); // Enhanced response format
```

### Winston Stub

```typescript
// Automatic when using qtests/setup (for require()-based resolution)
import 'qtests/setup';
const winston = require('winston');

const logger = winston.createLogger();
logger.info('This produces no output'); // Silent
```

### Custom Module Stubs (Ad-Hoc)

When you need to stub a niche dependency (beyond the built-ins axios/winston) without changing qtests itself, register a custom stub in tests:

```ts
// Always load setup first so axios/winston are stubbed globally
import 'qtests/setup';

// Then register your ad-hoc stub(s)
import { registerModuleStub } from 'qtests/utils/customStubs';

registerModuleStub('external-service-client', {
  ping: () => 'pong',
  get: async () => ({ ok: true })
});

// Now this resolves to your in-memory stub even if the module is not installed
const client = require('external-service-client');
await client.get(); // { ok: true }
```

Notes:
- Call `registerModuleStub` BEFORE the first require/import of that module.
- Use `unregisterModuleStub(id)` and `clearAllModuleStubs()` for cleanup in afterEach.
- Honors `QTESTS_SILENT=1|true` to reduce noise in CI logs.

## Lightweight Test Runner

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

## HTTP Testing

```typescript
// For generated API tests, a local shim is scaffolded at:
//   tests/generated-tests/utils/httpTest.ts (re-exports a JS shim)
//   tests/generated-tests/utils/httpTest.shim.js (implementation with .send())
// You can also import the same helpers directly from qtests if preferred.
import { httpTest } from 'qtests/lib/envUtils.js';

// Create mock Express app
const app = httpTest.createMockApp();
app.get('/users', (req, res) => {
  res.statusCode = 200;
  res.end(JSON.stringify({ users: [] }));
});

// Test the app — chainable .send() supported; JSON is defaulted and parsed
const response = await httpTest.supertest(app)
  .get('/users')
  .expect(200)
  .end();
```

## Email Testing

```typescript
import { sendEmail } from 'qtests/lib/envUtils.js';

// Mock email sending
const result = await sendEmail.send({
  to: 'user@example.com',
  subject: 'Welcome',
  text: 'Welcome to our app!'
});

console.log(result.success); // true
console.log(sendEmail.getHistory()); // Array of sent emails
```

## Advanced Features

### Error Handling Utilities

```typescript
import { handleError, handleAsyncError } from 'qtests/lib/errorHandling.js';

// Synchronous error handling with logging
try {
  riskyOperation();
} catch (error) {
  handleError(error, 'operation-context', {
    logToConsole: true,
    includeStack: true,
    fallbackMessage: 'Operation failed'
  });
}

// Async error handling with fallback
const result = await handleAsyncError(
  riskyAsyncOperation(), 
  'async-operation',
  { fallbackValue: null }
);
if (result === null) {
  console.log('Operation failed but was handled gracefully');
}
```

### Circuit Breaker Pattern

```typescript
import { createCircuitBreaker, executeWithCircuitBreaker, CircuitState } from 'qtests';

// Create a reusable breaker configured with thresholds
const breaker = createCircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 60000,
  timeout: 10000,
  onStateChange: (state: CircuitState) => {
    console.log('Circuit state changed:', state);
  }
});

// Or wrap a one-off call without creating a named breaker
const result = await executeWithCircuitBreaker(
  async () => externalService.process(userData),
  { timeout: 5000, failureThreshold: 3 }
);
```

### Connection Pool Health Monitoring

```typescript
import { addHealthMonitoring, createHealthMonitoredPool } from 'qtests/lib/connectionPoolHealth.js';

// Add health monitoring to existing pool
const pool = createDatabasePool();
const monitor = addHealthMonitoring(pool, {
  healthCheckInterval: 30000, // 30 seconds
  unhealthyConnectionThreshold: 3,
  enableDetailedLogging: true
});

// Listen to health events
monitor.on('health-check-completed', (status) => {
  console.log(`Healthy: ${status.healthyConnections}/${status.totalConnections}`);
});

monitor.on('connection-unhealthy', (data) => {
  alertingService.sendAlert('Database connection unhealthy', data);
});

// Start monitoring
monitor.startHealthMonitoring();
```

### Jest Configuration Factory

```typescript
import { createJestConfig } from 'qtests/lib/jestConfigFactory.js';

// Standardized Jest configurations
const config = createJestConfig('typescript-esm', {
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  testEnvironment: 'node'
});

// For React projects
const reactConfig = createJestConfig('react-typescript', {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom'
});

// Write to jest.config.mjs
import { writeFileSync } from 'fs';
writeFileSync('jest.config.mjs', `export default ${JSON.stringify(config, null, 2)};`);
```

### Offline Mode

```typescript
import { offlineMode } from 'qtests';

// Enable offline mode
offlineMode.setOfflineMode(true);

// Get stubbed axios automatically
const axios = offlineMode.getAxios();
await axios.get('/api/data'); // Returns {} instead of real request
```

### Integration with Jest

```typescript
import { testHelpers } from 'qtests';

test('console output', async () => {
  await testHelpers.withMockConsole('log', (spy) => {
    console.log('test');
    expect(spy.mock.calls[0][0]).toBe('test');
  });
});
```

## API Reference

### Core Methods

| Method | Description |
|--------|-------------|
| `stubMethod(obj, methodName, replacement)` | Replace object method with stub |
| `mockConsole(method)` | Mock console methods with spy |
| `testEnv.setTestEnv()` | Set standard test environment |
| `testEnv.saveEnv()` / `restoreEnv()` | Backup/restore environment |
| `offlineMode.setOfflineMode(enabled)` | Toggle offline mode |
| `handleError(error, context, options)` | Comprehensive error handling |
| `handleAsyncError(promise, context, options)` | Async error handling with fallback |

### Scaffolding CLI

| Tool | Description |
|------|-------------|
| CLI: `npx qtests-generate` | Scaffold `qtests-runner.mjs` + Jest config (`config/jest.config.mjs`, `config/jest-setup.ts` or `config/jest-setup.cjs`, `config/jest-require-polyfill.cjs`) |

### Test Runner

| Method | Description |
|--------|-------------|
| `runTestSuite(name, tests)` | Execute test suite |
| `createAssertions()` | Get assertion methods |

### Error Handling & Performance

| Method | Description |
|--------|-------------|
| `handleError(error, context, options?)` | Handle and log errors with context |
| `handleAsyncError(promise, context, options?)` | Async error handling with fallback |
| `createCircuitBreaker(options)` | Create a circuit breaker instance |
| `executeWithCircuitBreaker(fn, options)` | Wrap a one-off call with circuit breaker protection |
| `getCircuitBreakerStats(breaker)` | Get failure count, state, and success rate |
| `resetCircuitBreaker(breaker)` | Reset breaker to CLOSED state |
| `addHealthMonitoring(pool, options)` | Add health monitoring to pools |
| `createJestConfig(type, options)` | Generate standardized Jest config |

### Advanced Utilities

| Method | Description |
|--------|-------------|
| `registerModuleStub(name, exports)` | Register custom module stub |
| `runTestSuites(suites, options)` | Run multiple test suites |
| `initializePolyfills()` | Initialize browser polyfills |
| `polyfillOrchestrator()` | Manage polyfill lifecycle |

## TypeScript Configuration

To run ESM tests, set `"type": "module"` in your project `package.json` (or use `.mjs`), and ensure your `tsconfig.json` supports Node ESM (NodeNext recommended):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  },
  "ts-node": {
    "esm": true
  }
}
```

### Import Patterns

```typescript
// Core utilities with full type safety
import qtests, { stubMethod, mockConsole, testEnv, mock } from 'qtests';

// Custom module stubs (no ".js" suffix in subpath imports)
import { registerModuleStub } from 'qtests/utils/customStubs';

// Module stubs (still available)
import { stubs } from 'qtests';
await stubs.axios.get('https://example.com');
```

### Browser Testing Polyfills

```typescript
// For React/browser component testing
import { 
  initializePolyfills, 
  getWindow, 
  matchMedia, 
  clipboard 
} from 'qtests';

// Set up browser environment
initializePolyfills();

// Now you have access to browser APIs in Node.js tests
const window = getWindow();
window.innerWidth = 1024;
const mediaQuery = matchMedia('(max-width: 768px)');
clipboard.writeText('test text');
```

## Philosophy

qtests is built around one idea: a team should be able to add a single dependency and cover the entire testing lifecycle without assembling a patchwork of separate libraries. That means unit tests with stubs and mocks, integration tests against real HTTP routes, security probing, performance benchmarking, and browser-environment component tests — all in one package.

The production reliability utilities (circuit breaker, connection pooling, caching, rate limiting) are included because testing those patterns well requires realistic implementations, not hollow mocks. Shipping them in qtests means you can test your resilience logic against the same code you run in production.

## CLI Reference

### qtests-generate (Scaffolder)
- Usage: `qtests-generate [--dry-run] [--force] [--update-pkg-script] [--auto-install]`
- Alias: `qtests-ts-generate`
- Purpose: Scaffolds `qtests-runner.mjs` and Jest config files into the client project (INIT_CWD).
- Options:
  - `--dry-run`: Print planned writes without modifying files
  - `--force`: Overwrite existing scaffolded files
  - `--update-pkg-script`: Set `package.json` `scripts.test` to `node qtests-runner.mjs`
  - `--auto-install`: Install `ts-jest` + `typescript` as devDependencies if missing
  - `-h, --help`: Show help
  - `-v, --version`: Show version

Examples:
- `qtests-generate`
- `qtests-generate --dry-run`
- `qtests-generate --force`
- `qtests-generate --update-pkg-script`
- `qtests-generate --auto-install`

Notes:
- This CLI scaffolds runner/config files; it does not generate tests.

### qtests runner
- Usage: `qtests-ts-runner`
- Purpose: Discovers and runs tests in the project with a Jest-first strategy.
- Behavior:
  - Discovers files matching `.test|.spec|_test|_spec` with `.js|.ts|.jsx|.tsx`
  - Runs Jest via the programmatic API (`runCLI`) (no child processes, no `tsx`)
  - Runs tests in parallel batches (controlled by `QTESTS_INBAND`, `QTESTS_FILE_WORKERS`, `QTESTS_CONCURRENCY`)
- Notes:
  - `qtests-runner.mjs` is scaffolded into the client project by `qtests-generate` (or install-time scaffolding)
  - Always passes `--config config/jest.config.mjs` and `--passWithNoTests`
  - Honors `QTESTS_SUPPRESS_DEBUG=1|true` to skip creating `DEBUG_TESTS.md`
  - Honors `QTESTS_DEBUG_FILE` to set a custom debug report path/name
  - Honors `QTESTS_SKIP_SECURITY=1|true` to skip the security test suite (useful for fast local iteration)
  - Records Jest argv to `runner-jest-args.json` to aid debugging
  - If `ts-jest` + `typescript` are installed, the scaffolded Jest config enables TypeScript ESM transforms

## Best Practices

### 1. Always Load Setup First

```typescript
// Correct
import 'qtests/setup';
import myModule from './myModule.js';

// Wrong
import myModule from './myModule.js';
import 'qtests/setup';
```

### 2. Clean Up After Tests
```typescript
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
```typescript
import { testHelpers } from 'qtests';

test('environment test', async () => {
  await testHelpers.withSavedEnv(async () => {
    process.env.TEST_VAR = 'value';
    // Environment automatically restored
  });
});
```

## Testing Patterns & Organization

### Test File Types
qtests supports multiple testing patterns depending on your needs:

| Pattern | When to Use | File Location |
|---------|-------------|---------------|
| **Unit Tests** | Testing individual functions/classes | `src/module.test.ts` or `tests/unit/` |
| **Integration Tests** | Testing API routes and service interactions | `tests/integration/` or `tests/generated-tests/` |
| **Manual Tests** | Complex scenarios requiring custom setup | `tests/manual-tests/` |
| **Performance Tests** | Benchmarking and load testing | `tests/performance/` |
| **End-to-End Tests** | Full application workflows | `tests/e2e/` |

### Choosing Test Patterns

```typescript
// Unit test - test individual functions
import 'qtests/setup';
import { calculateTotal } from './billing.js';

test('calculates total with tax', () => {
  const total = calculateTotal(100, 0.1);
  expect(total).toBe(110);
});

// Integration test - test API endpoints
import { createMockApp, supertest } from '../utils/httpTest.js';
import billingRoutes from './billingRoutes.js';

describe('POST /api/billing/calculate', () => {
  it('should calculate total with discounts', async () => {
    const app = createMockApp();
    app.use('/api/billing', billingRoutes);
    
    const response = await supertest(app)
      .post('/api/billing/calculate')
      .send({ amount: 100, discount: 0.2 })
      .expect(200);
      
    expect(response.body.total).toBe(80);
  });
});
```

### Test Environment Setup

```typescript
// Global test setup (setupTests.ts)
import 'qtests/setup';
import { testEnv } from 'qtests';

// Set up test environment before all tests
beforeAll(() => {
  testEnv.setTestEnv();
});

// Clean up after all tests
afterAll(() => {
  testEnv.restoreEnv();
});
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Stubs not working (CommonJS) | Ensure `require('qtests/setup')` is called first |
| Stubs not working (ES Modules) | Ensure `import 'qtests/setup'` is called first |
| TypeScript import errors | Add `"type": "module"` to package.json and update tsconfig.json |
| ES Module syntax errors | Ensure `"module": "ES2020"` in tsconfig.json |
| Console pollution | Use `mockConsole()` to capture output |
| Environment leaks | Use `testHelpers.withSavedEnv()` for isolation |
| Module not found for advanced features | Use qtests subpath exports without a `.js` suffix (e.g. `qtests/lib/errorHandling`) |
| CLI not found | Use `npx qtests-generate` (alias: `qtests-ts-generate`) or install globally |
| File extension errors | For qtests subpath imports, omit the `.js` suffix (e.g. `qtests/utils/customStubs`) |
| generateKey returns empty string | Fixed in latest version - now correctly returns test keys like "test-api-key-user" |
| Circuit breaker not opening | Check error threshold settings and ensure proper error handling |
| Health monitoring not working | Ensure `pool.start()` is called before adding health monitoring |
| Performance tests timing out | Increase timeout in Jest config or reduce test duration |
| Custom module stubs not loading | Call `registerModuleStub()` before importing the target module |

## Enterprise Integration

### CI/CD Pipeline Integration

```yaml
# GitHub Actions example
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Generate tests
        run: npx qtests-generate --force --update-pkg-script
        
      - name: Run tests
        run: npm test
        
      - name: Performance tests
        run: npm run test:performance
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

```bash
# Jenkins Pipeline example
pipeline {
  agent any
  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }
    stage('Generate Tests') {
      steps {
        sh 'npx qtests-generate --force'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
    stage('Performance') {
      steps {
        sh 'npm run test:scalability'
      }
    }
  }
}
```

### Large Codebase Strategies

```typescript
// jest.config.mjs for monorepos
export default {
  projects: [
    {
      displayName: 'frontend',
      testMatch: ['<rootDir>/packages/frontend/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/packages/frontend/setupTests.ts'],
      moduleNameMapper: {
        '^@shared/(.*)$': '<rootDir>/packages/shared/$1'
      }
    },
    {
      displayName: 'backend',
      testMatch: ['<rootDir>/packages/backend/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/packages/backend/setupTests.ts']
    },
    {
      displayName: 'generated-tests',
      testMatch: ['<rootDir>/tests/generated-tests/**/*.test.ts'],
      testTimeout: 30000 // Longer timeout for integration tests
    }
  ]
};
```

```bash
# Scripts for large projects
# package.json
{
  "scripts": {
    "test:unit": "jest --testPathPattern=packages/*/src/**/*.test.ts",
    "test:integration": "jest --testPathPattern=tests/generated-tests",
    "test:performance": "jest --testPathPattern=tests/performance",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:performance",
    "test:watch": "jest --watch --testPathPattern=packages",
    "test:coverage": "jest --coverage --coverageReporters=text-lcov | coveralls"
  }
}
```

### Team Adoption Guidelines

1. **Start Small**: Begin with unit tests for new features
2. **Gradual Expansion**: Add integration tests for critical API endpoints
3. **Performance Baselines**: Establish performance benchmarks early
4. **Code Review**: Require test coverage in pull requests
5. **Documentation**: Maintain test patterns in team wikis

### Monitoring & Alerting

```typescript
// tests/monitoring/setup.js
import { addHealthMonitoring } from 'qtests/lib/connectionPoolHealth.js';
import { createCircuitBreaker } from 'qtests/lib/circuitBreaker.js';

// Global health monitoring for test environments
if (process.env.NODE_ENV === 'test') {
  const pool = global.databasePool;
  const monitor = addHealthMonitoring(pool, {
    healthCheckInterval: 15000,
    unhealthyConnectionThreshold: 2
  });
  
  monitor.on('health-check-completed', (status) => {
    if (status.unhealthyConnections > 0) {
      console.warn(`Test database has ${status.unhealthyConnections} unhealthy connections`);
    }
  });
}
```

## Additional Resources

### Configuration Examples
- [Jest Configuration Factory](./lib/jestConfigFactory.ts) - Standardized configs for different project types
- [Test Setup Patterns](./lib/testSetupFactory.ts) - Reusable test environment setups
- [Error Handling Patterns](./lib/utils/__tests__/errorHandling.test.ts) - Comprehensive error handling examples

### Advanced Features
- [Connection Pool Health](./lib/connectionPoolHealth.md) - Detailed health monitoring guide
- [Performance Testing](./scripts/benchmarks/) - Performance testing utilities and examples

### Community & Support
- [Issue Templates](./.github/ISSUE_TEMPLATE/) - Standardized issue reporting
- [API Documentation](./docs/API_REFERENCE.md) - Complete API reference and examples
- [Advanced Features](./docs/ADVANCED_FEATURES.md) - Error handling, performance testing, circuit breakers
- [Enterprise Integration](./docs/ENTERPRISE_INTEGRATION.md) - CI/CD patterns and production deployment
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues and solutions

## License

Dual license — see [LICENSE](./LICENSE) and [COMMERCIAL_LICENSE.md](./COMMERCIAL_LICENSE.md) for details.

Free for individual developers. Teams and companies require a paid Commercial License (Startup $99/yr, Team $499/yr, Business $1,999/yr). Open source projects may qualify for the free tier — see the Open Source Exception in LICENSE.

## Contributing

Contributions welcome! Please feel free to submit issues and pull requests.
