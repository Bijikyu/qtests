# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: /home/runner/workspace/tests/integration/demo__server__app__get.test.js

### Output:
```
  ● Test suite failed to run

    Configuration error:

    Could not locate module ./httpTest.shim.js mapped as:
    $1.js.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^(.*\/httpTest\.shim)\.js$/": "$1.js"
      },
      "resolver": undefined
    }

      5 | // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      6 | // @ts-ignore
    > 7 | export { createMockApp, supertest } from './httpTest.shim.js';
        | ^
      8 |

      at createNoMappedModuleFoundError (node_modules/jest-resolve/build/resolver.js:759:17)
      at Object.<anonymous> (utils/httpTest.ts:7:1)
      at Object.<anonymous> (lib/routeTestUtils.ts:7:1)
      at Object.require (tests/integration/demo__server__app__get.test.js:2:1)

```

### Duration: 0ms

---

## Failed Test 2: /home/runner/workspace/tests/integration/demo__server__routes__hello__get.test.js

### Output:
```
  ● Test suite failed to run

    Configuration error:

    Could not locate module ./httpTest.shim.js mapped as:
    $1.js.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^(.*\/httpTest\.shim)\.js$/": "$1.js"
      },
      "resolver": undefined
    }

      5 | // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      6 | // @ts-ignore
    > 7 | export { createMockApp, supertest } from './httpTest.shim.js';
        | ^
      8 |

      at createNoMappedModuleFoundError (node_modules/jest-resolve/build/resolver.js:759:17)
      at Object.<anonymous> (utils/httpTest.ts:7:1)
      at Object.<anonymous> (lib/routeTestUtils.ts:7:1)
      at Object.require (tests/integration/demo__server__routes__hello__get.test.js:2:1)

```

### Duration: 0ms

---

## Summary

- Total failed tests: 2
- Failed test files: /home/runner/workspace/tests/integration/demo__server__app__get.test.js, /home/runner/workspace/tests/integration/demo__server__routes__hello__get.test.js
- Generated: 2025-12-22T07:53:56.286Z
