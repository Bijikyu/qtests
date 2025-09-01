# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: /home/runner/workspace/manual-tests/testHelpers.test.ts

### Output:
```
  console.log
    createJsonRes is running with data and status 200

      at createJsonRes (utils/helpers/responseMocker.ts:32:11)

  console.log
    createJsonRes is returning mock response

      at createJsonRes (utils/helpers/responseMocker.ts:82:13)

  console.log
    createRes is running with status 200

      at createRes (utils/helpers/responseMocker.ts:101:11)

  console.log
    createRes is returning mock response

      at createRes (utils/helpers/responseMocker.ts:149:13)

  console.log
    generateKey is running with length user and prefix none

      at generateKey (utils/helpers/keyGenerator.ts:20:11)

  console.log
    generateKey is returning key with length 0

      at generateKey (utils/helpers/keyGenerator.ts:35:13)

FAIL manual-tests/testHelpers.test.ts
  ● Console

    console.log
      createJsonRes is running with data and status 200

      at createJsonRes (utils/helpers/responseMocker.ts:32:11)

    console.log
      createJsonRes is returning mock response

      at createJsonRes (utils/helpers/responseMocker.ts:82:13)

    console.log
      createRes is running with status 200

      at createRes (utils/helpers/responseMocker.ts:101:11)

    console.log
      createRes is returning mock response

      at createRes (utils/helpers/responseMocker.ts:149:13)

    console.log
      generateKey is running with length user and prefix none

      at generateKey (utils/helpers/keyGenerator.ts:20:11)

    console.log
      generateKey is returning key with length 0

      at generateKey (utils/helpers/keyGenerator.ts:35:13)

  ● Test Helpers Basic Tests › generateKey works with basic parameters

    expect(received).toBe(expected) // Object.is equality

    Expected: "test-api-key-user"
    Received: ""

      20 |   test('generateKey works with basic parameters', async () => {
      21 |     const key = await generateKey('user');
    > 22 |     expect(key).toBe('test-api-key-user');
         |                 ^
      23 |   });
      24 | });

      at Object.<anonymous> (manual-tests/testHelpers.test.ts:22:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 passed, 3 total
Snapshots:   0 total
Time:        5.387 s
Ran all test suites matching /\/home\/runner\/workspace\/manual-tests\/testHelpers.test.ts/i.
FAIL manual-tests/testHelpers.test.ts
  Test Helpers Basic Tests
    ✓ createJsonRes works correctly (55 ms)
    ✓ createRes provides response mock (5 ms)
    ✕ generateKey works with basic parameters (6 ms)

  ● Test Helpers Basic Tests › generateKey works with basic parameters

    expect(received).toBe(expected) // Object.is equality

    Expected: "test-api-key-user"
    Received: ""

      20 |   test('generateKey works with basic parameters', async () => {
      21 |     const key = await generateKey('user');
    > 22 |     expect(key).toBe('test-api-key-user');
         |                 ^
      23 |   });
      24 | });

      at Object.<anonymous> (manual-tests/testHelpers.test.ts:22:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 passed, 3 total
Snapshots:   0 total
Time:        1.095 s
Ran all test suites matching /\/home\/runner\/workspace\/manual-tests\/testHelpers.test.ts/i.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/testHelpers.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 13428ms

---

## Summary

- Total failed tests: 1
- Failed test files: /home/runner/workspace/manual-tests/testHelpers.test.ts
- Generated: 2025-09-01T11:52:39.219Z
