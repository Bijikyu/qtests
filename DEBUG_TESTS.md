# Test Failure Analysis

**Creation Time:** 2025-08-19T10:43:19.691Z
**Pacific Time:** Tuesday, August 19, 2025 at 03:43:19 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: test/testSuite.test.js

### Output:
```
FAIL test/testSuite.test.js
  testSuite utility
    DatabaseTestHelper
      ✓ sets up database models correctly (51 ms)
      ✓ tears down database correctly (6 ms)
      ✓ provides access to models after setup (18 ms)
      ✓ throws error when accessing models before setup (37 ms)
      ✓ creates suite with automatic setup (1 ms)
      ✓ clears model data on setup (21 ms)
    MockManager
      ✓ sets up API client mocks (14 ms)
      ✓ sets up API client mocks with custom responses (9 ms)
      ✓ sets up console mocks (7 ms)
      ✓ sets up environment mocks (40 ms)
      ✓ sets up email mocks (13 ms)
      ✓ sets up HTTP mocks with responses (6 ms)
      ✓ clears all mocks (13 ms)
      ✓ gets specific mock by name (11 ms)
    AssertionHelper
      ✓ asserts database entity properties (7 ms)
      ✓ throws error for invalid database entity (7 ms)
      ✓ throws error for wrong property values (5 ms)
      ✓ asserts API response structure (15 ms)
      ✓ throws error for wrong API response status (4 ms)
      ✓ asserts email sent successfully (22 ms)
      ✓ throws error when expected email not found (8 ms)
      ✕ asserts mock function calls (25 ms)
      ✓ throws error for wrong mock call count (3 ms)
    TestDataFactory
      ✓ creates user with default properties (5 ms)
      ✓ creates user with overrides (2 ms)
      ✓ creates API key with default properties (4 ms)
      ✓ creates log entry with default properties (20 ms)
      ✓ creates configuration with default properties (7 ms)
      ✓ creates multiple entities (26 ms)
      ✓ creates multiple entities with base overrides (8 ms)
      ✓ creates related entities (33 ms)
      ✓ increments counter for unique IDs (4 ms)
      ✓ resets counter (3 ms)
    PerformanceTestHelper
      ✓ measures operation time (15 ms)
      ✓ asserts timing constraint success (5 ms)
      ✓ asserts timing constraint failure (59 ms)
      ✓ tests concurrent operations (4 ms)
      ✓ measures memory usage (5 ms)
    TestSuiteBuilder
      ✓ builds basic test suite (4 ms)
      ✓ builds suite with database (9 ms)
      ✓ builds suite with API mocks (9 ms)
      ✓ builds suite with console mocks (3 ms)
      ✓ builds suite with environment mocks (9 ms)
      ✓ builds suite with email mocks (4 ms)
      ✓ builds suite with HTTP mocks (8 ms)
      ✓ builds suite with performance utilities (3 ms)
      ✓ builds suite with all features (6 ms)
      ✓ supports method chaining (8 ms)
      ✓ supports without auto cleanup (2 ms)
    integration scenarios
      ✓ complete database workflow with assertions (9 ms)
      ✓ mock management with API and email testing (32 ms)
      ✓ performance testing with data factory (224 ms)
      ✓ comprehensive test scenario with all utilities (6 ms)

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

Test Suites: 1 failed, 1 total
Tests:       1 failed, 52 passed, 53 total
Snapshots:   0 total
Time:        3.311 s, estimated 8 s
Ran all test suites matching /test\/testSuite.test.js/i.

```

### Duration: 12696ms

---

## Summary

- Total failed tests: 1
- Failed test files: test/testSuite.test.js
- Generated: 2025-08-19T10:43:19.708Z
