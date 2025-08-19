# Test Failure Analysis

**Creation Time:** 2025-08-19T09:41:44.783Z
**Pacific Time:** Tuesday, August 19, 2025 at 02:41:44 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: test/testSuite.test.js

### Output:
```
FAIL test/testSuite.test.js
  testSuite utility
    DatabaseTestHelper
      ✓ sets up database models correctly (101 ms)
      ✓ tears down database correctly (19 ms)
      ✓ provides access to models after setup (31 ms)
      ✓ throws error when accessing models before setup (39 ms)
      ✓ creates suite with automatic setup (1 ms)
      ✓ clears model data on setup (81 ms)
    MockManager
      ✓ sets up API client mocks (11 ms)
      ✓ sets up API client mocks with custom responses (8 ms)
      ✓ sets up console mocks (10 ms)
      ✓ sets up environment mocks (28 ms)
      ✓ sets up email mocks (22 ms)
      ✕ sets up HTTP mocks with responses (3 ms)
      ✓ clears all mocks (11 ms)
      ✓ gets specific mock by name (8 ms)
    AssertionHelper
      ✓ asserts database entity properties (5 ms)
      ✓ throws error for invalid database entity (5 ms)
      ✓ throws error for wrong property values (3 ms)
      ✓ asserts API response structure (2 ms)
      ✓ throws error for wrong API response status (3 ms)
      ✓ asserts email sent successfully (76 ms)
      ✓ throws error when expected email not found (8 ms)
      ✕ asserts mock function calls (23 ms)
      ✓ throws error for wrong mock call count (17 ms)
    TestDataFactory
      ✕ creates user with default properties
      ✕ creates user with overrides (1 ms)
      ✕ creates API key with default properties
      ✕ creates log entry with default properties
      ✕ creates configuration with default properties
      ✕ creates multiple entities (1 ms)
      ✕ creates multiple entities with base overrides
      ✕ creates related entities
      ✕ increments counter for unique IDs (1 ms)
      ✕ resets counter
    PerformanceTestHelper
      ✓ measures operation time (44 ms)
      ✓ asserts timing constraint success (18 ms)
      ✓ asserts timing constraint failure (55 ms)
      ✓ tests concurrent operations (2 ms)
      ✕ measures memory usage (1 ms)
    TestSuiteBuilder
      ✕ builds basic test suite (4 ms)
      ✕ builds suite with database (5 ms)
      ✓ builds suite with API mocks (7 ms)
      ✓ builds suite with console mocks (4 ms)
      ✕ builds suite with environment mocks (2 ms)
      ✓ builds suite with email mocks (4 ms)
      ✕ builds suite with HTTP mocks (2 ms)
      ✕ builds suite with performance utilities (2 ms)
      ✕ builds suite with all features (2 ms)
      ✕ supports method chaining (1 ms)
      ✓ supports without auto cleanup (1 ms)
    integration scenarios
      ✕ complete database workflow with assertions (5 ms)
      ✕ mock management with API and email testing (12 ms)
      ✓ performance testing with data factory (156 ms)
      ✕ comprehensive test scenario with all utilities (4 ms)

  ● testSuite utility › MockManager › sets up HTTP mocks with responses

    TypeError: mockManager.setupHttpMocks is not a function

      158 |       ];
      159 |       
    > 160 |       const httpMocks = mockManager.setupHttpMocks(responses);
          |                                     ^
      161 |       
      162 |       expect(httpMocks.app).toBeDefined();
      163 |       expect(typeof httpMocks.supertest).toBe('function');

      at Object.setupHttpMocks (test/testSuite.test.js:160:37)

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

  ● testSuite utility › TestDataFactory › creates user with default properties

    TypeError: TestDataFactory.reset is not a function

      299 |   describe('TestDataFactory', () => {
      300 |     beforeEach(() => {
    > 301 |       TestDataFactory.reset();
          |                       ^
      302 |     });
      303 |
      304 |     test('creates user with default properties', () => {

      at Object.reset (test/testSuite.test.js:301:23)

  ● testSuite utility › TestDataFactory › creates user with overrides

    TypeError: TestDataFactory.reset is not a function

      299 |   describe('TestDataFactory', () => {
      300 |     beforeEach(() => {
    > 301 |       TestDataFactory.reset();
          |                       ^
      302 |     });
      303 |
      304 |     test('creates user with default properties', () => {

      at Object.reset (test/testSuite.test.js:301:23)

  ● testSuite utility › TestDataFactory › creates API key with default properties

    TypeError: TestDataFactory.reset is not a function

      299 |   describe('TestDataFactory', () => {
      300 |     beforeEach(() => {
    > 301 |       TestDataFactory.reset();
          |                       ^
      302 |     });
      303 |
      304 |     test('creates user with default properties', () => {

      at Object.reset (test/testSuite.test.js:301:23)

  ● testSuite utility › TestDataFactory › creates log entry with default properties

    TypeError: TestDataFactory.reset is not a function

      299 |   describe('TestDataFactory', () => {
      300 |     beforeEach(() => {
    > 301 |       TestDataFactory.reset();
          |                       ^
      302 |     });
      303 |
      304 |     test('creates user with default properties', () => {

      at Object.reset (test/testSuite.test.js:301:23)

  ● testSuite utility › TestDataFactory › creates configuration with default properties

    TypeError: TestDataFactory.reset is not a function

      299 |   describe('TestDataFactory', () => {
      300 |     beforeEach(() => {
    > 301 |       TestDataFactory.reset();
          |                       ^
      302 |     });
      303 |
      304 |     test('creates user with default properties', () => {

      at Object.reset (test/testSuite.test.js:301:23)

  ● testSuite utility › TestDataFactory › creates multiple entities

    TypeError: TestDataFactory.reset is not a function

      299 |   describe('TestDataFactory', () => {
      300 |     beforeEach(() => {
    > 301 |       TestDataFactory.reset();
          |                       ^
      302 |     });
      303 |
      304 |     test('creates user with default properties', () => {

      at Object.reset (test/testSuite.test.js:301:23)

  ● testSuite utility › TestDataFactory › creates multiple entities with base overrides

    TypeError: TestDataFactory.reset is not a function

      299 |   describe('TestDataFactory', () => {
      300 |     beforeEach(() => {
    > 301 |       TestDataFactory.reset();
          |                       ^
      302 |     });
      303 |
      304 |     test('creates user with default properties', () => {

      at Object.reset (test/testSuite.test.js:301:23)

  ● testSuite utility › TestDataFactory › creates related entities

    TypeError: TestDataFactory.reset is not a function

      299 |   describe('TestDataFactory', () => {
      300 |     beforeEach(() => {
    > 301 |       TestDataFactory.reset();
          |                       ^
      302 |     });
      303 |
      304 |     test('creates user with default properties', () => {

      at Object.reset (test/testSuite.test.js:301:23)

  ● testSuite utility › TestDataFactory › increments counter for unique IDs

    TypeError: TestDataFactory.reset is not a function

      299 |   describe('TestDataFactory', () => {
      300 |     beforeEach(() => {
    > 301 |       TestDataFactory.reset();
          |                       ^
      302 |     });
      303 |
      304 |     test('creates user with default properties', () => {

      at Object.reset (test/testSuite.test.js:301:23)

  ● testSuite utility › TestDataFactory › resets counter

    TypeError: TestDataFactory.reset is not a function

      299 |   describe('TestDataFactory', () => {
      300 |     beforeEach(() => {
    > 301 |       TestDataFactory.reset();
          |                       ^
      302 |     });
      303 |
      304 |     test('creates user with default properties', () => {

      at Object.reset (test/testSuite.test.js:301:23)

  ● testSuite utility › PerformanceTestHelper › measures memory usage

    TypeError: PerformanceTestHelper.measureMemory is not a function

      476 |       };
      477 |       
    > 478 |       const measurement = await PerformanceTestHelper.measureMemory(operation);
          |                                                       ^
      479 |       
      480 |       expect(measurement.result).toBe(1000);
      481 |       expect(measurement.beforeMemory).toBeDefined();

      at Object.measureMemory (test/testSuite.test.js:478:55)

  ● testSuite utility › TestSuiteBuilder › builds basic test suite

    expect(received).toBe(expected) // Object.is equality

    Expected: [Function AssertionHelper]
    Received: {}

      506 |       
      507 |       expect(suite.mocks).toBeInstanceOf(MockManager);
    > 508 |       expect(suite.assert).toBe(AssertionHelper);
          |                            ^
      509 |       expect(suite.data).toBe(TestDataFactory);
      510 |       expect(suite.db).toBeUndefined(); // Not enabled
      511 |       expect(suite.performance).toBeUndefined(); // Not enabled

      at Object.toBe (test/testSuite.test.js:508:28)

  ● testSuite utility › TestSuiteBuilder › builds suite with database

    TypeError: builder.withDatabase is not a function

      513 |
      514 |     test('builds suite with database', () => {
    > 515 |       const suite = builder.withDatabase().build();
          |                             ^
      516 |       
      517 |       expect(suite.db).toBeInstanceOf(DatabaseTestHelper);
      518 |     });

      at Object.withDatabase (test/testSuite.test.js:515:29)

  ● testSuite utility › TestSuiteBuilder › builds suite with environment mocks

    TypeError: builder.withEnvironmentMocks is not a function

      534 |     test('builds suite with environment mocks', () => {
      535 |       const envVars = { TEST_MODE: 'true' };
    > 536 |       const suite = builder.withEnvironmentMocks(envVars).build();
          |                             ^
      537 |       
      538 |       expect(process.env.TEST_MODE).toBe('true');
      539 |     });

      at Object.withEnvironmentMocks (test/testSuite.test.js:536:29)

  ● testSuite utility › TestSuiteBuilder › builds suite with HTTP mocks

    TypeError: builder.withHttpMocks is not a function

      548 |     test('builds suite with HTTP mocks', () => {
      549 |       const responses = [{ method: 'GET', path: '/', data: { message: 'hello' } }];
    > 550 |       const suite = builder.withHttpMocks(responses).build();
          |                             ^
      551 |       
      552 |       const httpMock = suite.mocks.getMock('http');
      553 |       expect(httpMock).toBeDefined();

      at Object.withHttpMocks (test/testSuite.test.js:550:29)

  ● testSuite utility › TestSuiteBuilder › builds suite with performance utilities

    expect(received).toBe(expected) // Object.is equality

    Expected: [Function PerformanceTestHelper]
    Received: {}

      557 |       const suite = builder.withPerformance().build();
      558 |       
    > 559 |       expect(suite.performance).toBe(PerformanceTestHelper);
          |                                 ^
      560 |     });
      561 |
      562 |     test('builds suite with all features', () => {

      at Object.toBe (test/testSuite.test.js:559:33)

  ● testSuite utility › TestSuiteBuilder › builds suite with all features

    TypeError: builder.withDatabase is not a function

      562 |     test('builds suite with all features', () => {
      563 |       const suite = builder
    > 564 |         .withDatabase()
          |          ^
      565 |         .withApiMocks()
      566 |         .withConsoleMocks()
      567 |         .withEmailMocks()

      at Object.withDatabase (test/testSuite.test.js:564:10)

  ● testSuite utility › TestSuiteBuilder › supports method chaining

    TypeError: builder.withDatabase is not a function

      578 |     test('supports method chaining', () => {
      579 |       const result = builder
    > 580 |         .withDatabase()
          |          ^
      581 |         .withApiMocks()
      582 |         .withPerformance();
      583 |       

      at Object.withDatabase (test/testSuite.test.js:580:10)

  ● testSuite utility › integration scenarios › complete database workflow with assertions

    TypeError: suite.assert.assertDatabaseEntity is not a function

      617 |         
      618 |         // Assert database entity
    > 619 |         suite.assert.assertDatabaseEntity(apiKey, {
          |                      ^
      620 |           key: userData.username + '-key',
      621 |           userId: userData.id
      622 |         });

      at Object.assertDatabaseEntity (test/testSuite.test.js:619:22)

  ● testSuite utility › integration scenarios › mock management with API and email testing

    TypeError: suite.assert.assertEmailSent is not a function

      643 |       emailMock.sendEmail('test@example.com', 'Test', 'Body');
      644 |       
    > 645 |       suite.assert.assertEmailSent({ to: 'test@example.com' });
          |                    ^
      646 |       
      647 |       // Cleanup
      648 |       suite.mocks.clearAll();

      at Object.assertEmailSent (test/testSuite.test.js:645:20)

  ● testSuite utility › integration scenarios › comprehensive test scenario with all utilities

    TypeError: suite.assert.assertEmailSent is not a function

      694 |         
      695 |         // Test assertions
    > 696 |         suite.assert.assertEmailSent({ to: userData.email, subject: 'Welcome' });
          |                      ^
      697 |         
      698 |         // Test console mock
      699 |         const consoleMock = suite.mocks.getMock('console');

      at Object.assertEmailSent (test/testSuite.test.js:696:22)

Test Suites: 1 failed, 1 total
Tests:       23 failed, 30 passed, 53 total
Snapshots:   0 total
Time:        3.735 s
Ran all test suites matching /test\/testSuite.test.js/i.

```

### Duration: 8381ms

---

## Summary

- Total failed tests: 1
- Failed test files: test/testSuite.test.js
- Generated: 2025-08-19T09:41:44.806Z
