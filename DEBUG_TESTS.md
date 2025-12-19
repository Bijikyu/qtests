# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: /home/runner/workspace/tests/integration/demo__server__routes__hello__get.test.js

### Output:
```
  ● Test suite failed to run

    TypeError: Cannot read properties of undefined (reading 'qtestsSilent')

      38 |
      39 | // Honor CI silence toggle to reduce noise
    > 40 | const shouldLog = !(localVars.qtestsSilent === '1' || localVars.qtestsSilent === 'true');
         |                               ^
      41 | if (shouldLog) {
      42 |   console.log('qtests: Global module resolution patching activated');
      43 |   console.log(`qtests: Stub registry contains: ${mockRegistry.list().join(', ')}`);

      at Object.<anonymous> (setup.ts:40:31)
      at Object.<anonymous> (config/jest-setup.ts:3:1)

```

### Duration: 0ms

---

## Failed Test 2: /home/runner/workspace/tests/integration/demo__server__app__get.test.js

### Output:
```
  ● Test suite failed to run

    TypeError: Cannot read properties of undefined (reading 'qtestsSilent')

      38 |
      39 | // Honor CI silence toggle to reduce noise
    > 40 | const shouldLog = !(localVars.qtestsSilent === '1' || localVars.qtestsSilent === 'true');
         |                               ^
      41 | if (shouldLog) {
      42 |   console.log('qtests: Global module resolution patching activated');
      43 |   console.log(`qtests: Stub registry contains: ${mockRegistry.list().join(', ')}`);

      at Object.<anonymous> (setup.ts:40:31)
      at Object.<anonymous> (config/jest-setup.ts:3:1)

```

### Duration: 0ms

---

## Summary

- Total failed tests: 2
- Failed test files: /home/runner/workspace/tests/integration/demo__server__routes__hello__get.test.js, /home/runner/workspace/tests/integration/demo__server__app__get.test.js
- Generated: 2025-12-19T18:33:01.965Z
