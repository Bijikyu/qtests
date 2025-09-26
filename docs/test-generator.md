# qtests Test Generator (TypeScript ESM)

The qtests Test Generator automatically creates unit and API test scaffolding by analyzing your TypeScript/JavaScript source code. It detects exported functions, classes, and Express-style routes to generate tests that already import `qtests/setup` so stubs are active from line 1.

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

## CLI Usage (qtests-generate)
Alias: `qtests-ts-generate` (backward compatible)

### Basic Usage

Generate tests for the current project:

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

### Filtering & Modes

```bash
# Limit to TypeScript files and skip existing tests
qtests-generate --include "**/*.ts" --exclude "**/*.test.ts"

# Only unit tests, dry-run preview
qtests-generate --unit --dry-run

# AST mode (requires `typescript` in your project)
qtests-generate --mode ast
```

### Help and Version

```bash
qtests-generate --help
qtests-generate --version
```

## Programmatic Usage (TypeScript ESM)

```typescript
import { TestGenerator } from 'qtests';

const generator = new TestGenerator({
  SRC_DIR: 'src',
  TEST_DIR: 'tests/integration',
  include: ['**/*.ts'],
  exclude: ['**/*.test.ts'],
  KNOWN_MOCKS: ['axios', 'mongoose', 'redis'],
  mode: 'heuristic' // or 'ast' if you have `typescript` installed
});

await generator.generateTestFiles(false); // pass true for dry-run
const results = generator.getResults();

console.log(`Generated ${results.length} test files`);
for (const r of results) {
  console.log(`${r.type}: ${r.file}`);
}
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

**Generated test (`src/math.GenerateTest.test.ts`):**
```javascript
// Generated unit test for math.ts - TypeScript ES module
import 'qtests/setup';
import * as mod from './math.ts';

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
- `generated-tests/routes.GenerateTest__get.test.ts` for GET `/api/users`
- `generated-tests/routes.GenerateTest__post.test.ts` for POST `/api/auth`

**Example generated API test:**
```typescript
// Generated integration test for GET /api/users - TypeScript ES module
import 'qtests/setup';
import { createMockApp, supertest } from '../utils/httpTest.js';

describe('GET /api/users', () => {
  it('should return success response', async () => {
    const app = createMockApp();
    app.get('/api/users', (req, res) => {
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ success: true }));
    });

    const res = await supertest(app).get('/api/users').expect(200);
    expect(res.body.success).toBe(true);
  });
});
```

## Configuration

### Default Configuration

```typescript
{
  SRC_DIR: '.',
  TEST_DIR: 'generated-tests',
  KNOWN_MOCKS: ['axios', 'node-fetch', 'pg', 'mongoose', 'fs', 'redis'],
  VALID_EXTS: ['.ts', '.js', '.tsx', '.jsx']
}
```

### Custom Configuration

```typescript
const generator = new TestGenerator({
  SRC_DIR: 'lib',              // Custom source directory
  TEST_DIR: 'spec',            // Custom test directory
  KNOWN_MOCKS: ['custom-lib'], // Additional libraries to mock
  VALID_EXTS: ['.js', '.ts'],  // File extensions to process
  include: ['**/*.ts'],        // Only process matching files
  exclude: ['**/*.test.ts'],   // Exclude matching files
});
```

## Automatic Mock Setup

The generator automatically adds mock setup for known libraries:

**If your source file imports axios:**
```javascript
import axios from 'axios';
```

Generated tests include `import 'qtests/setup'` so axios/winston and other known libraries are stubbed automatically — no `jest.mock` calls are required.

### Known Mock Libraries

- `axios` - HTTP client
- `node-fetch` - HTTP client
- `pg` - PostgreSQL client
- `mongoose` - MongoDB ODM
- `fs` - File system (for testing file operations)
- `redis` - Redis client

## Jest Configuration & Runner

On non-dry runs the generator writes:
- `config/jest.config.mjs` configured for TypeScript ESM using ts-jest
- `config/jest-setup.ts` with standard Jest setup
- `qtests-runner.mjs` (ESM). The runner invokes Jest with `--config config/jest.config.mjs --passWithNoTests` and does not rely on `tsx`.

In `--dry-run` mode, these files are not written.

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
- **Configuration**: `config/jest.config.mjs`, `config/jest-setup.ts`

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

### AST Mode Not Taking Effect

- Install `typescript` in your project: `npm i -D typescript`
- Use `--mode ast` or `mode: 'ast'` in the programmatic API
- The generator falls back to heuristic scanning if the TS compiler isn’t available

### Mock Issues

- Add custom libraries to `KNOWN_MOCKS` configuration
- Stubs are automatic via `qtests/setup`; no `jest.mock` needed
- Relative imports (`./file`) are not replaced — only external packages

### Overwriting Generated Tests

- Use `--force` to overwrite previously generated tests. It applies to files whose names contain `.GenerateTest` (both unit and API test files).
