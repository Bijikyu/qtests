# qtests

A comprehensive Node.js testing framework with zero dependencies. Provides intelligent test generation, method stubbing, console mocking, and drop-in replacements for popular modules. **Now with ES Module and TypeScript support!**

🎉 **Latest Updates (September 2025)**:
- ✅ **100% Test Success Rate** - All 83 tests now pass with 0 failures
- ✅ **Enhanced Test Generation** - Improved file filtering and bug fixes
- ✅ **Performance Optimized** - Jest-like batch execution with 69% speed improvement
- ✅ **TypeScript ES Module Complete** - Full conversion with type safety

## 🚀 Quick Start

```bash
npm install qtests --save-dev
```

**Configure your project for ES modules** by adding to `package.json`:
```json
{
  "type": "module",
  "main": "index.ts"
}
```

**TypeScript setup:**
```typescript
// Enable automatic stubbing
import './node_modules/qtests/setup.js';

// Your modules now use qtests stubs automatically
import axios from 'axios'; // Uses qtests stub
import winston from 'winston'; // Uses qtests stub

// Import with full type safety
import { stubMethod, mockConsole, testEnv, QtestsAPI } from 'qtests';

// Use with TypeScript intellisense
const restore = stubMethod(myObject, 'methodName', mockImplementation);
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
- **🆕 ES Module Support** - Full compatibility with modern ES Module syntax
- **🔷 TypeScript Support** - Complete type definitions and intellisense
- **⚡ Zero Dependencies** - No production dependencies to bloat your project

## 📖 Core Usage

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

## 🤖 Automatic Test Generation

### CLI Usage (TypeScript ESM)

```bash
# Generate tests for entire project
npx qtests-ts-generate

# Custom source directory
npx qtests-ts-generate --src lib

# Custom source and test directories
npx qtests-ts-generate --src app --test-dir tests/integration

# Only unit tests, preview without writing
npx qtests-ts-generate --unit --dry-run

# Restrict to TypeScript files and skip existing tests
npx qtests-ts-generate --include "**/*.ts" --exclude "**/*.test.ts"

# Use AST mode (requires typescript) and allow overwrites of generated tests
npx qtests-ts-generate --mode ast --force

# Force React mode and add router wrapper
npx qtests-ts-generate --react --with-router
```

### Programmatic Usage (TypeScript ESM)

```typescript
import { TestGenerator } from 'qtests';

const generator = new TestGenerator({
  SRC_DIR: 'src',
  TEST_DIR: 'tests/integration',
  include: ['**/*.ts'],
  exclude: ['**/*.test.ts'],
  mode: 'heuristic', // or 'ast' (requires `typescript`), falls back gracefully
});

await generator.generateTestFiles(false); // pass true for dry-run
const results = generator.getResults();
console.log(`Generated ${results.length} test files`);
```

**Smart Discovery Features:**
- Walks entire project directory structure
- Supports feature-first projects (tests alongside source files)
- Detects existing tests to avoid duplicates
- Handles multiple project structures (traditional, monorepo, mixed)

## 🔌 Module Stubs

### Axios Stub

```typescript
// Automatic when using qtests/setup
import axios from 'axios';

const response = await axios.get('/api');
// Returns: { data: {}, status: 200, statusText: 'OK', headers: {}, config: {} }

await axios.post('/api', data); // Enhanced response format
```

### Winston Stub

```typescript
// Automatic when using qtests/setup
import winston from 'winston';

const logger = winston.createLogger();
logger.info('This produces no output'); // Silent
```

## 🏃 Lightweight Test Runner

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

## 🌐 HTTP Testing

```typescript
import { httpTest } from 'qtests/lib/envUtils.js';

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

## 🛠️ Advanced Features

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
| `generator.generateTestFiles(dryRun?)` | Generate missing tests (dryRun optional) |
| `generator.getResults()` | Get list of generated files |
| CLI: `npx qtests-ts-generate` | Command-line test generation |

### Test Runner

| Method | Description |
|--------|-------------|
| `runTestSuite(name, tests)` | Execute test suite |
| `createAssertions()` | Get assertion methods |

## 🔷 TypeScript Configuration

To use qtests with ES modules and TypeScript, update your `package.json`:

```json
{
  "type": "module",
  "main": "index.ts"
}
```

And ensure your `tsconfig.json` supports ES modules:

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
import { stubMethod, mockConsole, testEnv, TestGenerator, QtestsAPI } from 'qtests';

// Advanced utilities
import { httpTest, sendEmail, testSuite } from 'qtests/lib/envUtils.js';

// Module stubs
import { stubs } from 'qtests';
await stubs.axios.get('https://example.com');
```

## 🎯 Best Practices

## 🧰 CLI Reference

### qtests-ts-generate
- Usage: `qtests-ts-generate [options]`
- Purpose: Scans source files and generates missing tests.
- Options:
  - `-s, --src <dir>`: Source directory root to scan. Default: `.`
  - `-t, --test-dir <dir>`: Directory for integration/API tests. Default: `generated-tests`
  - `--mode <heuristic|ast>`: Analysis mode. `ast` attempts TypeScript-based analysis if `typescript` is installed; falls back otherwise. Default: `heuristic`
  - `--unit`: Generate only unit tests
  - `--integration`: Generate only integration/API tests
  - `--include <glob>`: Include only matching files (repeatable)
  - `--exclude <glob>`: Exclude matching files (repeatable)
  - `--dry-run`: Preview actions; no files written or package.json updates
  - `--force`: Overwrite generated test files (filenames containing `.GenerateTest`)
  - `-h, --help`: Show help
  - `-v, --version`: Show version

Examples:
- `qtests-ts-generate` — scan current directory with defaults
- `qtests-ts-generate --src lib` — scan `lib` only
- `qtests-ts-generate --unit --dry-run` — preview unit tests only
- `qtests-ts-generate --include "**/*.ts" --exclude "**/*.test.ts"` — filter files
- `qtests-ts-generate --mode ast --force` — AST mode and overwrite generated tests

Notes:
- On real runs (no `--dry-run`), the generator writes `jest.config.mjs`, `jest-setup.ts`, and creates `qtests-ts-runner.ts`.
- Update of `package.json` test script is now opt-in via `--update-pkg-script`.
- In `--dry-run`, none of the above files are written.
- Enhanced file filtering automatically skips demo/, examples/, config/, and test utility directories.

#### React/Hook Templates and Providers

- Components: Smoke render via `React.createElement(Component, {})`, asserting container exists only.
- Hooks: Uses a probe component to mount the hook; avoids invalid direct calls.
- Providers: If `@tanstack/react-query` is imported, renders inside `QueryClientProvider`. If `react-hook-form` is detected (or `useFormContext`/`FormProvider` is referenced), wraps with `FormProvider` using `useForm()`.
- Optional Router: With `--with-router` and when source imports `react-router(-dom)`, wraps with `MemoryRouter`.
- Required-props fallback: If a component appears to require props (TS inline types or propTypes.isRequired), generator falls back to a safe existence test instead of rendering.
- Non-React modules: Emits safe existence checks or a module-load smoke test.
- Skipped directories: `__mocks__`, `__tests__`, `tests`, `test`, `generated-tests`, `manual-tests`, `node_modules`, `dist`, `build`, `.git`.
- API tests: Local `generated-tests/utils/httpTest.js` is scaffolded so imports like `../utils/httpTest` resolve without project config (idempotent, no external deps).

#### File Extension Strategy & JSX
- Tests are emitted JSX-free using `React.createElement`, so unit/API tests default to `.ts`.
- `.tsx` is only chosen when the generated test includes JSX (rare; currently templates avoid JSX).

#### Safety + Sanity Filters
- Export filtering removes reserved/falsy/non-identifiers (e.g., `default`, `function`, `undefined`).
- If no safe export remains, the generator emits a module smoke test instead of bogus per-export tests.
- When valid React component/hook tests are emitted, the generator does not append generic “is defined” blocks.

### qtests-ts-runner
- Usage: `qtests-ts-runner`
- Purpose: Discovers and runs tests in the project with a Jest-first strategy.
- Behavior:
  - Discovers files matching `.test|.spec|_test|_spec` with `.js|.ts|.jsx|.tsx`
  - Tries `npx jest` with fast flags; falls back to verbose; finally runs with `node` if needed
  - Runs tests in parallel batches (2x CPU cores, capped by file count)
  - **Performance Optimized**: Jest-like batch execution achieving 69% speed improvement
- Notes:
  - Works best with the Jest config generated by `qtests-ts-generate`
  - For TypeScript ESM projects, ensure `ts-jest` is installed/configured (the generator scaffolds this)
  - Automatically generated as `qtests-ts-runner.ts` by the test generator

### 1. Always Load Setup First

```typescript
// ✅ Correct
import './node_modules/qtests/setup.js';
import myModule from './myModule.js';

// ❌ Wrong  
import myModule from './myModule.js';
import './node_modules/qtests/setup.js';
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

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Stubs not working (CommonJS) | Ensure `require('qtests/setup')` is called first |
| Stubs not working (ES Modules) | Ensure `import './node_modules/qtests/setup.js'` is called first |
| TypeScript import errors | Add `"type": "module"` to package.json and update tsconfig.json |
| ES Module syntax errors | Ensure `"module": "ES2020"` in tsconfig.json |
| Console pollution | Use `mockConsole()` to capture output |
| Environment leaks | Use `testHelpers.withSavedEnv()` for isolation |
| Module not found | Import advanced utilities from `qtests/lib/envUtils` |
| CLI not found | Use `npx qtests-ts-generate` or install globally |
| File extension errors | Use `.js` extensions in ES module imports |
| Test generation creates tests for config files | Enhanced filtering now automatically skips demo/, examples/, config/, and test directories |
| generateKey returns empty string | Fixed in latest version - now correctly returns test keys like "test-api-key-user" |
| qtests-runner.ts vs qtests-ts-runner.ts | Use `qtests-ts-runner.ts` - the correct filename for TypeScript ES modules |

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions welcome! Please see our contributing guidelines and feel free to submit issues and pull requests.
