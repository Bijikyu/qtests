# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: /home/runner/workspace/lib/testGenerator.GenerateTest.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/config/tsconfig.jest.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
(node:5360) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
FAIL lib/testGenerator.GenerateTest.test.ts
  TestGenerator
    ✕ should create generator with default config (2 ms)
    ✕ should generate unit test with .GeneratedTest.test.ts naming (1 ms)
    ✕ should include qtests/setup import in generated tests
    ✕ should handle dry-run mode without writing files
    ✕ should detect API routes and generate integration tests (1 ms)
    ✕ should skip generating tests inside __mocks__ directory
    ✕ optionally wraps React tests with MemoryRouter when flag is set and router is detected (component tests enabled)
    ✕ falls back to existence test when component has required props (component tests enabled) (1 ms)
    ✕ skips generating tests for React components by default (hooks still generated)
  testModule exports
    ✕ should export TestGenerator class
    ✕ should export default TestGenerator (1 ms)

  ● TestGenerator › should create generator with default config

    ReferenceError: jest is not defined

       8 |
       9 | beforeAll(() => {
    > 10 |   jest.setTimeout(10000);
         |   ^
      11 | });
      12 |
      13 | afterEach(() => {

      at Object.<anonymous> (config/jest-setup.ts:10:3)

  ● TestGenerator › should create generator with default config

    ReferenceError: jest is not defined

      12 |
      13 | afterEach(() => {
    > 14 |   jest.clearAllMocks();
         |   ^
      15 | });

      at Object.<anonymous> (config/jest-setup.ts:14:3)

  ● TestGenerator › should generate unit test with .GeneratedTest.test.ts naming

    ReferenceError: jest is not defined

       8 |
       9 | beforeAll(() => {
    > 10 |   jest.setTimeout(10000);
         |   ^
      11 | });
      12 |
      13 | afterEach(() => {

      at Object.<anonymous> (config/jest-setup.ts:10:3)

  ● TestGenerator › should generate unit test with .GeneratedTest.test.ts naming

    ReferenceError: jest is not defined

      12 |
      13 | afterEach(() => {
    > 14 |   jest.clearAllMocks();
         |   ^
      15 | });

      at Object.<anonymous> (config/jest-setup.ts:14:3)

  ● TestGenerator › should include qtests/setup import in generated tests

    ReferenceError: jest is not defined

       8 |
       9 | beforeAll(() => {
    > 10 |   jest.setTimeout(10000);
         |   ^
      11 | });
      12 |
      13 | afterEach(() => {

      at Object.<anonymous> (config/jest-setup.ts:10:3)

  ● TestGenerator › should include qtests/setup import in generated tests

    ReferenceError: jest is not defined

      12 |
      13 | afterEach(() => {
    > 14 |   jest.clearAllMocks();
         |   ^
      15 | });

      at Object.<anonymous> (config/jest-setup.ts:14:3)

  ● TestGenerator › should handle dry-run mode without writing files

    ReferenceError: jest is not defined

       8 |
       9 | beforeAll(() => {
    > 10 |   jest.setTimeout(10000);
         |   ^
      11 | });
      12 |
      13 | afterEach(() => {

      at Object.<anonymous> (config/jest-setup.ts:10:3)

  ● TestGenerator › should handle dry-run mode without writing files

    ReferenceError: jest is not defined

      12 |
      13 | afterEach(() => {
    > 14 |   jest.clearAllMocks();
         |   ^
      15 | });

      at Object.<anonymous> (config/jest-setup.ts:14:3)

  ● TestGenerator › should detect API routes and generate integration tests

    ReferenceError: jest is not defined

       8 |
       9 | beforeAll(() => {
    > 10 |   jest.setTimeout(10000);
         |   ^
      11 | });
      12 |
      13 | afterEach(() => {

      at Object.<anonymous> (config/jest-setup.ts:10:3)

  ● TestGenerator › should detect API routes and generate integration tests

    ReferenceError: jest is not defined

      12 |
      13 | afterEach(() => {
    > 14 |   jest.clearAllMocks();
         |   ^
      15 | });

      at Object.<anonymous> (config/jest-setup.ts:14:3)

  ● TestGenerator › should skip generating tests inside __mocks__ directory

    ReferenceError: jest is not defined

       8 |
       9 | beforeAll(() => {
    > 10 |   jest.setTimeout(10000);
         |   ^
      11 | });
      12 |
      13 | afterEach(() => {

      at Object.<anonymous> (config/jest-setup.ts:10:3)

  ● TestGenerator › should skip generating tests inside __mocks__ directory

    ReferenceError: jest is not defined

      12 |
      13 | afterEach(() => {
    > 14 |   jest.clearAllMocks();
         |   ^
      15 | });

      at Object.<anonymous> (config/jest-setup.ts:14:3)

  ● TestGenerator › optionally wraps React tests with MemoryRouter when flag is set and router is detected (component tests enabled)

    ReferenceError: jest is not defined

       8 |
       9 | beforeAll(() => {
    > 10 |   jest.setTimeout(10000);
         |   ^
      11 | });
      12 |
      13 | afterEach(() => {

      at Object.<anonymous> (config/jest-setup.ts:10:3)

  ● TestGenerator › optionally wraps React tests with MemoryRouter when flag is set and router is detected (component tests enabled)

    ReferenceError: jest is not defined

      12 |
      13 | afterEach(() => {
    > 14 |   jest.clearAllMocks();
         |   ^
      15 | });

      at Object.<anonymous> (config/jest-setup.ts:14:3)

  ● TestGenerator › falls back to existence test when component has required props (component tests enabled)

    ReferenceError: jest is not defined

       8 |
       9 | beforeAll(() => {
    > 10 |   jest.setTimeout(10000);
         |   ^
      11 | });
      12 |
      13 | afterEach(() => {

      at Object.<anonymous> (config/jest-setup.ts:10:3)

  ● TestGenerator › falls back to existence test when component has required props (component tests enabled)

    ReferenceError: jest is not defined

      12 |
      13 | afterEach(() => {
    > 14 |   jest.clearAllMocks();
         |   ^
      15 | });

      at Object.<anonymous> (config/jest-setup.ts:14:3)

  ● TestGenerator › skips generating tests for React components by default (hooks still generated)

    ReferenceError: jest is not defined

       8 |
       9 | beforeAll(() => {
    > 10 |   jest.setTimeout(10000);
         |   ^
      11 | });
      12 |
      13 | afterEach(() => {

      at Object.<anonymous> (config/jest-setup.ts:10:3)

  ● TestGenerator › skips generating tests for React components by default (hooks still generated)

    ReferenceError: jest is not defined

      12 |
      13 | afterEach(() => {
    > 14 |   jest.clearAllMocks();
         |   ^
      15 | });

      at Object.<anonymous> (config/jest-setup.ts:14:3)

  ● testModule exports › should export TestGenerator class

    ReferenceError: jest is not defined

       8 |
       9 | beforeAll(() => {
    > 10 |   jest.setTimeout(10000);
         |   ^
      11 | });
      12 |
      13 | afterEach(() => {

      at Object.<anonymous> (config/jest-setup.ts:10:3)

  ● testModule exports › should export TestGenerator class

    ReferenceError: jest is not defined

      12 |
      13 | afterEach(() => {
    > 14 |   jest.clearAllMocks();
         |   ^
      15 | });

      at Object.<anonymous> (config/jest-setup.ts:14:3)

  ● testModule exports › should export default TestGenerator

    ReferenceError: jest is not defined

       8 |
       9 | beforeAll(() => {
    > 10 |   jest.setTimeout(10000);
         |   ^
      11 | });
      12 |
      13 | afterEach(() => {

      at Object.<anonymous> (config/jest-setup.ts:10:3)

  ● testModule exports › should export default TestGenerator

    ReferenceError: jest is not defined

      12 |
      13 | afterEach(() => {
    > 14 |   jest.clearAllMocks();
         |   ^
      15 | });

      at Object.<anonymous> (config/jest-setup.ts:14:3)

Test Suites: 1 failed, 1 total
Tests:       11 failed, 11 total
Snapshots:   0 total
Time:        0.95 s
Ran all test suites matching /\/home\/runner\/workspace\/lib\/testGenerator.GenerateTest.test.ts/i.

```

### Duration: 1559ms

---

## Summary

- Total failed tests: 1
- Failed test files: /home/runner/workspace/lib/testGenerator.GenerateTest.test.ts
- Generated: 2025-09-25T23:19:46.482Z
