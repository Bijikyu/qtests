# Test Failure Analysis

**Creation Time:** 2025-08-19T13:30:31.867Z
**Pacific Time:** Tuesday, August 19, 2025 at 06:30:31 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: test/resolveStubPaths.test.js

### Output:
```
Error: Cannot parse /home/runner/workspace/test/temp_integration_project_196268932275675-w55es626u/package.json as JSON: ENOENT: no such file or directory, open '/home/runner/workspace/test/temp_integration_project_196268932275675-w55es626u/package.json'
    at Object.worker (/home/runner/workspace/node_modules/jest-haste-map/build/worker.js:267:13)
    at execFunction (/home/runner/workspace/node_modules/jest-worker/build/processChild.js:297:17)
    at execHelper (/home/runner/workspace/node_modules/jest-worker/build/processChild.js:285:5)
    at execMethod (/home/runner/workspace/node_modules/jest-worker/build/processChild.js:288:5)
    at process.messageListener (/home/runner/workspace/node_modules/jest-worker/build/processChild.js:196:7)
    at process.emit (node:events:524:28)
    at emit (node:internal/child_process:950:14)
    at process.processTicksAndRejections (node:internal/process/task_queues:83:21)

```

### Duration: 16258ms

---

## Failed Test 2: test/mockAxios.test.js

### Output:
```
FAIL test/mockAxios.test.js (15.982 s)
  Mock Axios Factory
    createMockAxios
      ✓ creates mock axios with default configuration (442 ms)
      ✓ creates mock axios with custom configuration (77 ms)
      ✓ GET method returns axios-compatible response (36 ms)
      ✓ POST method handles data payload (27 ms)
      ✓ PUT method maintains API compatibility (79 ms)
      ✓ DELETE method works without data payload (12 ms)
      ✓ request method handles custom configurations (29 ms)
      ✓ simulates network errors when configured (172 ms)
    createUserMockAxios
      ✓ creates mock axios with URL-specific response mapping (7 ms)
      ✓ returns default seeded response for configured URL (19 ms)
      ✓ configures custom responses using __set method (586 ms)
      ✓ simulates error responses when reject flag is set (17 ms)
      ✓ returns 500 error for unconfigured URLs (15 ms)
      ✓ handles multiple configurations for same URL (13 ms)
      ✓ maintains isolation between different mock instances (21 ms)
      ✓ matches exact implementation provided by user (6 ms)
    createSimpleMockAxios
      ✓ creates basic mock axios without configuration (36 ms)
      ✓ provides same interface as configurable version (282 ms)
    Performance and Reliability
      ✕ mock responses resolve immediately (162 ms)
      ✓ handles concurrent requests correctly (615 ms)
      ✓ maintains state isolation between instances (237 ms)

  ● Mock Axios Factory › Performance and Reliability › mock responses resolve immediately

    expect(received).toBeLessThan(expected)

    Expected: < 100
    Received:   131

      267 |       const duration = Date.now() - startTime;
      268 |       // Mock requests should complete in well under 100ms
    > 269 |       expect(duration).toBeLessThan(100);
          |                        ^
      270 |     });
      271 |     
      272 |     test('handles concurrent requests correctly', async () => {

      at Object.toBeLessThan (test/mockAxios.test.js:269:24)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 20 passed, 21 total
Snapshots:   0 total
Time:        20.394 s
Ran all test suites matching test/mockAxios.test.js.

```

### Duration: 35439ms

---

## Summary

- Total failed tests: 2
- Failed test files: test/resolveStubPaths.test.js, test/mockAxios.test.js
- Generated: 2025-08-19T13:30:31.907Z
