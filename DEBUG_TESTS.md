# Test Failure Analysis

**Creation Time:** 2025-08-19T10:02:33.232Z
**Pacific Time:** Tuesday, August 19, 2025 at 03:02:33 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: test/runTestSuite.test.js

### Output:
```
Error: Cannot parse /home/runner/workspace/test/temp_integration_project/package.json as JSON: ENOENT: no such file or directory, open '/home/runner/workspace/test/temp_integration_project/package.json'
    at Object.worker (/home/runner/workspace/node_modules/jest-haste-map/build/worker.js:128:13)
    at execFunction (/home/runner/workspace/node_modules/jest-worker/build/workers/processChild.js:149:17)
    at execHelper (/home/runner/workspace/node_modules/jest-worker/build/workers/processChild.js:137:5)
    at execMethod (/home/runner/workspace/node_modules/jest-worker/build/workers/processChild.js:140:5)
    at process.messageListener (/home/runner/workspace/node_modules/jest-worker/build/workers/processChild.js:44:7)
    at process.emit (node:events:524:28)
    at emit (node:internal/child_process:950:14)
    at process.processTicksAndRejections (node:internal/process/task_queues:83:21)

```

### Duration: 5829ms

---

## Failed Test 2: test/testGenerator.test.js

### Output:
```
FAIL test/testGenerator.test.js
  TestGenerator Configuration
    ✓ should use default configuration (4 ms)
    ✓ should accept custom configuration (1 ms)
  TestGenerator File System
    ✓ should walk directory structure (5 ms)
  TestGenerator CLI
    ✕ should have executable CLI script (2 ms)
    ✓ should show help when requested (223 ms)
    ✓ should show version when requested (303 ms)
  TestGenerator Content Generation
    ✓ should generate unit test content (2 ms)
    ✓ should generate API test content (1 ms)

  ● TestGenerator CLI › should have executable CLI script

    expect(received).toBeTruthy()

    Received: 0

      72 |     
      73 |     const stats = fs.statSync(cliPath);
    > 74 |     expect(stats.mode & 0o111).toBeTruthy(); // Check executable bit
         |                                ^
      75 |   });
      76 |
      77 |   it('should show help when requested', () => {

      at Object.toBeTruthy (test/testGenerator.test.js:74:32)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 7 passed, 8 total
Snapshots:   0 total
Time:        2.825 s
Ran all test suites matching /test\/testGenerator.test.js/i.

```

### Duration: 7784ms

---

## Failed Test 3: test/testSuite.test.js

### Output:
```
FAIL test/testSuite.test.js
  testSuite utility
    DatabaseTestHelper
      ✓ sets up database models correctly (154 ms)
      ✓ tears down database correctly (59 ms)
      ✓ provides access to models after setup (20 ms)
      ✓ throws error when accessing models before setup (83 ms)
      ✓ creates suite with automatic setup (1 ms)
      ✓ clears model data on setup (39 ms)
    MockManager
      ✓ sets up API client mocks (11 ms)
      ✓ sets up API client mocks with custom responses (37 ms)
      ✓ sets up console mocks (21 ms)
      ✓ sets up environment mocks (25 ms)
      ✓ sets up email mocks (32 ms)
      ✕ sets up HTTP mocks with responses (11 ms)
      ✓ clears all mocks (19 ms)
      ✓ gets specific mock by name (9 ms)
    AssertionHelper
      ✓ asserts database entity properties (5 ms)
      ✕ throws error for invalid database entity (4 ms)
      ✕ throws error for wrong property values (57 ms)
      ✓ asserts API response structure (21 ms)
      ✓ throws error for wrong API response status (4 ms)
      ✓ asserts email sent successfully (31 ms)
      ✕ throws error when expected email not found (16 ms)
      ✕ asserts mock function calls (36 ms)
      ✓ throws error for wrong mock call count (6 ms)
    TestDataFactory
      ✓ creates user with default properties (18 ms)
      ✓ creates user with overrides (7 ms)
      ✓ creates API key with default properties (9 ms)
      ✓ creates log entry with default properties (11 ms)
      ✕ creates configuration with default properties (57 ms)
      ✓ creates multiple entities (20 ms)
      ✓ creates multiple entities with base overrides (69 ms)
      ✕ creates related entities (102 ms)
      ✓ increments counter for unique IDs (4 ms)
      ✓ resets counter (4 ms)
    PerformanceTestHelper
      ✓ measures operation time (25 ms)
      ✓ asserts timing constraint success (6 ms)
      ✓ asserts timing constraint failure (61 ms)
      ✓ tests concurrent operations (2 ms)
      ✓ measures memory usage (2 ms)
    TestSuiteBuilder
      ✓ builds basic test suite (2 ms)
      ✓ builds suite with database (1 ms)
      ✓ builds suite with API mocks (6 ms)
      ✓ builds suite with console mocks (2 ms)
      ✓ builds suite with environment mocks (10 ms)
      ✓ builds suite with email mocks (4 ms)
      ✓ builds suite with HTTP mocks (7 ms)
      ✓ builds suite with performance utilities (1 ms)
      ✓ builds suite with all features (5 ms)
      ✓ supports method chaining (3 ms)
      ✓ supports without auto cleanup (2 ms)
    integration scenarios
      ✓ complete database workflow with assertions (6 ms)
      ✓ mock management with API and email testing (14 ms)
      ✓ performance testing with data factory (167 ms)
      ✓ comprehensive test scenario with all utilities (6 ms)

  ● testSuite utility › MockManager › sets up HTTP mocks with responses

    expect(received).toBe(expected) // Object.is equality

    Expected: "function"
    Received: "undefined"

      162 |       expect(httpMocks.app).toBeDefined();
      163 |       expect(typeof httpMocks.supertest).toBe('function');
    > 164 |       expect(typeof httpMocks.request).toBe('function');
          |                                        ^
      165 |     });
      166 |
      167 |     test('clears all mocks', () => {

      at Object.toBe (test/testSuite.test.js:164:40)

  ● testSuite utility › AssertionHelper › throws error for invalid database entity

    expect(received).toThrow(expected)

    Expected substring: "Entity _id must be defined and truthy"

    Received function did not throw

      212 |       expect(() => {
      213 |         AssertionHelper.assertDatabaseEntity(entity, {});
    > 214 |       }).toThrow('Entity _id must be defined and truthy');
          |          ^
      215 |     });
      216 |
      217 |     test('throws error for wrong property values', () => {

      at Object.toThrow (test/testSuite.test.js:214:10)

  ● testSuite utility › AssertionHelper › throws error for wrong property values

    expect(received).toThrow(expected)

    Expected substring: "Expected entity.status to be active, but got inactive"
    Received message:   "Expected status to be 'active', but got 'inactive'"

          261 |       Object.keys(expectedProps).forEach(prop => {
          262 |         if (entity[prop] !== expectedProps[prop]) {
        > 263 |           throw new Error(`Expected ${prop} to be '${expectedProps[prop]}', but got '${entity[prop]}'`);
              |                 ^
          264 |         }
          265 |       });
          266 |

      at utils/testing/assertionHelper.js:263:17
                at Array.forEach (<anonymous>)
      at Function.forEach [as assertDatabaseEntity] (utils/testing/assertionHelper.js:261:34)
      at assertDatabaseEntity (test/testSuite.test.js:226:25)
      at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
      at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
      at Object.toThrow (test/testSuite.test.js:227:10)
      at Object.toThrow (test/testSuite.test.js:227:10)

  ● testSuite utility › AssertionHelper › throws error when expected email not found

    expect(received).toThrow(expected)

    Expected substring: "Expected at least 1 emails, but found 0"

    Received function did not throw

      270 |       expect(() => {
      271 |         AssertionHelper.assertEmailSent({ to: 'test@example.com' });
    > 272 |       }).toThrow('Expected at least 1 emails, but found 0');
          |          ^
      273 |     });
      274 |
      275 |     test('asserts mock function calls', () => {

      at Object.toThrow (test/testSuite.test.js:272:10)

  ● testSuite utility › AssertionHelper › asserts mock function calls

    expect(received).not.toThrow()

    Error name:    "Error"
    Error message: "Expected 1 calls, but got 2"

          171 |         
          172 |         if (callCount !== times) {
        > 173 |           throw new Error(`Expected ${times} calls, but got ${callCount}`);
              |                 ^
          174 |         }
          175 |         
          176 |         if (calledWith !== null && callCount > 0) {

      at Function.assertMockCalled (utils/testing/assertionHelper.js:173:17)
      at assertMockCalled (test/testSuite.test.js:285:25)
      at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
      at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
      at Object.toThrow (test/testSuite.test.js:286:14)
      at Object.toThrow (test/testSuite.test.js:286:14)

  ● testSuite utility › TestDataFactory › creates configuration with default properties

    expect(received).toBeDefined()

    Received: undefined

      357 |       expect(config.name).toMatch(/^Test Configuration \d+$/);
      358 |       expect(config.environment).toBe('test');
    > 359 |       expect(config.settings).toBeDefined();
          |                               ^
      360 |       expect(config.features).toBeDefined();
      361 |       expect(config.createdAt).toBeInstanceOf(Date);
      362 |     });

      at Object.toBeDefined (test/testSuite.test.js:359:31)

  ● testSuite utility › TestDataFactory › creates related entities

    expect(received).toHaveLength(expected)

    Matcher error: received value must have a length property whose value must be a number

    Received has value: undefined

      394 |       expect(entities.apiKeys).toHaveLength(4); // 2 users * 2 keys each
      395 |       expect(entities.logs).toHaveLength(2); // 2 users * 1 log each
    > 396 |       expect(entities.configs).toHaveLength(1);
          |                                ^
      397 |       
      398 |       // Check relationships
      399 |       expect(entities.apiKeys[0].userId).toBe(entities.users[0].id);

      at Object.toHaveLength (test/testSuite.test.js:396:32)

Test Suites: 1 failed, 1 total
Tests:       7 failed, 46 passed, 53 total
Snapshots:   0 total
Time:        4.354 s
Ran all test suites matching /test\/testSuite.test.js/i.

```

### Duration: 8298ms

---

## Summary

- Total failed tests: 3
- Failed test files: test/runTestSuite.test.js, test/testGenerator.test.js, test/testSuite.test.js
- Generated: 2025-08-19T10:02:33.252Z
