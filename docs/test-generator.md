# qtests Test Generator

The qtests Test Generator is a powerful tool that automatically generates unit tests and API tests by analyzing your JavaScript/TypeScript source code. It detects exported functions, classes, and Express API routes to create comprehensive test scaffolding.

## Features

- **Automatic Unit Test Generation**: Creates test files for exported functions and classes
- **API Test Generation**: Detects Express routes and generates integration tests
- **Smart Mock Detection**: Automatically sets up mocks for known libraries (axios, mongoose, etc.)
- **Framework Integration**: Generates Jest-compatible tests with proper setup
- **CLI Tool**: Easy-to-use command-line interface
- **Programmatic API**: Use within Node.js applications

## Installation

The test generator is included with the qtests package:

```bash
npm install qtests
```

## CLI Usage

### Basic Usage

Generate tests for your `src` directory:

```bash
qtests-generate
```

### Custom Source Directory

Specify a different source directory:

```bash
qtests-generate --src lib
qtests-generate -s app
```

### Custom Test Directory

Specify where integration tests should be placed:

```bash
qtests-generate --test-dir spec
qtests-generate -t tests/integration
```

### Combined Options

```bash
qtests-generate --src app --test-dir spec
```

### Help and Version

```bash
qtests-generate --help
qtests-generate --version
```

## Programmatic Usage

```javascript
const { TestGenerator } = require('qtests');

// Create generator with custom configuration
const generator = new TestGenerator({
  SRC_DIR: 'src',
  TEST_DIR: 'tests/integration',
  KNOWN_MOCKS: ['axios', 'mongoose', 'redis']
});

// Generate tests
const results = generator.generate();

console.log(`Generated ${results.length} test files`);
results.forEach(result => {
  console.log(`${result.type}: ${result.file}`);
});
```

## Generated Test Types

### Unit Tests

Generated for files with exported functions or classes:

**Source file (`src/math.js`):**
```javascript
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
export class Calculator {
  // class implementation
}
```

**Generated test (`src/math.test.js`):**
```javascript
// Auto-generated unit test for math.js
import * as mod from './math.js';

describe('math.js', () => {
  test('add works', () => {
    // TODO: test mod.add
  });
  test('multiply works', () => {
    // TODO: test mod.multiply
  });
  test('Calculator works', () => {
    // TODO: test mod.Calculator
  });
});
```

### API Tests

Generated for Express routes found in source files:

**Source file (`src/routes.js`):**
```javascript
export const setupRoutes = (app) => {
  app.get('/api/users', getUsers);
  app.post('/api/auth', authenticate);
};
```

**Generated tests:**
- `tests/integration/routes__get.test.ts` for GET `/api/users`
- `tests/integration/routes__post.test.ts` for POST `/api/auth`

**Example generated API test:**
```javascript
// Auto-generated API test for GET /api/users
import request from '../../src/app';

describe('GET /api/users', () => {
  test('should succeed', async () => {
    const res = await request.get('/api/users');
    expect(res.status).toBe(200);
  });

  test('should handle failure', async () => {
    const res = await request.get('/api/users').send({ bad: true });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
```

## Configuration

### Default Configuration

```javascript
{
  SRC_DIR: 'src',
  TEST_DIR: 'tests/integration', 
  KNOWN_MOCKS: ['axios', 'node-fetch', 'pg', 'mongoose', 'fs', 'redis'],
  VALID_EXTS: ['.ts', '.js', '.tsx', '.jsx']
}
```

### Custom Configuration

```javascript
const generator = new TestGenerator({
  SRC_DIR: 'lib',              // Custom source directory
  TEST_DIR: 'spec',            // Custom test directory
  KNOWN_MOCKS: ['custom-lib'], // Additional libraries to mock
  VALID_EXTS: ['.js', '.ts']   // File extensions to process
});
```

## Automatic Mock Setup

The generator automatically adds mock setup for known libraries:

**If your source file imports axios:**
```javascript
import axios from 'axios';
```

**Generated test includes:**
```javascript
jest.mock('axios');
```

### Known Mock Libraries

- `axios` - HTTP client
- `node-fetch` - HTTP client
- `pg` - PostgreSQL client
- `mongoose` - MongoDB ODM
- `fs` - File system (for testing file operations)
- `redis` - Redis client

## Jest Configuration

The generator automatically creates Jest configuration files:

**`jest.config.js`:**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/src', '<rootDir>/tests'],
};
```

**`tests/setup.ts`:**
```javascript
let server;

beforeAll(async () => {
  const app = require('../src/app').default || require('../src/app');
  server = app.listen(4000, () => console.log('Test server started'));
});

afterAll(async () => {
  if (server) server.close();
});
```

## Integration with qtests Utilities

Generated tests work seamlessly with other qtests utilities:

```javascript
import { stubMethod, mockConsole, TestGenerator } from 'qtests';

// Generate test scaffolding
const generator = new TestGenerator();
generator.generate();

// Use qtests utilities in your tests
describe('My Component', () => {
  test('handles API calls', () => {
    const restore = stubMethod(api, 'call', () => ({ success: true }));
    const mockLog = mockConsole();
    
    // Your test code here
    
    restore();
    mockLog.restore();
  });
});
```

## Best Practices

1. **Review Generated Tests**: Always review and customize generated test stubs
2. **Add Specific Assertions**: Replace `// TODO` comments with actual test logic
3. **Use with qtests Utilities**: Combine with stubMethod, mockConsole, etc.
4. **Run Before Commits**: Generate tests regularly as your codebase grows
5. **Customize Mocks**: Add project-specific libraries to KNOWN_MOCKS

## File Naming Conventions

- **Unit tests**: `filename.test.js` (same directory as source)
- **API tests**: `tests/integration/filename__method.test.ts`
- **Configuration**: `jest.config.js`, `tests/setup.ts`

## Examples

See the `examples/test-generator-demo.js` file for comprehensive usage examples and the `demo/` directory for generated test examples.

## Troubleshooting

### No Tests Generated

- Ensure source files have exported functions/classes
- Check file extensions are supported (`.js`, `.ts`, `.jsx`, `.tsx`)
- Verify source directory exists and contains files

### API Tests Not Generated

- Ensure Express routes use the pattern: `app.method('/route', handler)`
- Supported methods: `get`, `post`, `put`, `delete`, `patch`
- Routes must be in string literals (not variables)

### Mock Issues

- Add custom libraries to `KNOWN_MOCKS` configuration
- Verify import statements use standard syntax: `from 'library'`
- Relative imports (`./file`) are not mocked by default