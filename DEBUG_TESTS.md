# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: /home/runner/workspace/tests/integration/demo__server__routes__hello__get.test.js

### Output:
```
  ● Test suite failed to run

    Configuration error:

    Could not locate module ../utils/values.js mapped as:
    /home/runner/workspace/utils/$1.ts.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^\.\.\/utils\/(.*)\.js$/": "/home/runner/workspace/utils/$1.ts"
      },
      "resolver": undefined
    }

       6 |
       7 | import { createMockApp, supertest } from '../utils/httpTest.js';
    >  8 | import qerrors from 'qerrors';
         | ^
       9 |
      10 | // ==================== TEST INTERFACES ====================
      11 |

      at createNoMappedModuleFoundError (node_modules/jest-resolve/build/resolver.js:759:17)
      at Object.require (node_modules/openai/src/internal/qs/utils.ts:3:1)
      at Object.require (node_modules/openai/src/internal/qs/stringify.ts:1:1)
      at Object.require (node_modules/openai/src/internal/qs/index.ts:10:1)
      at Object.require (node_modules/openai/src/client.ts:14:1)
      at Object.require (node_modules/openai/src/index.ts:5:27)
      at Object.<anonymous> (node_modules/@langchain/openai/dist/index.cjs:18:16)
      at Object.<anonymous> (node_modules/@langchain/openai/index.cjs:1:120)
      at Object.require (node_modules/qerrors/lib/aiModelManager.js:16:24)
      at Object.require (node_modules/qerrors/lib/qerrors.js:24:31)
      at Object.require (node_modules/qerrors/index.js:18:17)
      at Object.<anonymous> (lib/routeTestUtils.ts:8:1)
      at Object.require (tests/integration/demo__server__routes__hello__get.test.js:2:1)

```

### Duration: 0ms

---

## Failed Test 2: /home/runner/workspace/tests/integration/demo__server__app__get.test.js

### Output:
```
  ● Test suite failed to run

    Configuration error:

    Could not locate module ../utils/values.js mapped as:
    /home/runner/workspace/utils/$1.ts.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^\.\.\/utils\/(.*)\.js$/": "/home/runner/workspace/utils/$1.ts"
      },
      "resolver": undefined
    }

       6 |
       7 | import { createMockApp, supertest } from '../utils/httpTest.js';
    >  8 | import qerrors from 'qerrors';
         | ^
       9 |
      10 | // ==================== TEST INTERFACES ====================
      11 |

      at createNoMappedModuleFoundError (node_modules/jest-resolve/build/resolver.js:759:17)
      at Object.require (node_modules/openai/src/internal/qs/utils.ts:3:1)
      at Object.require (node_modules/openai/src/internal/qs/stringify.ts:1:1)
      at Object.require (node_modules/openai/src/internal/qs/index.ts:10:1)
      at Object.require (node_modules/openai/src/client.ts:14:1)
      at Object.require (node_modules/openai/src/index.ts:5:27)
      at Object.<anonymous> (node_modules/@langchain/openai/dist/index.cjs:18:16)
      at Object.<anonymous> (node_modules/@langchain/openai/index.cjs:1:120)
      at Object.require (node_modules/qerrors/lib/aiModelManager.js:16:24)
      at Object.require (node_modules/qerrors/lib/qerrors.js:24:31)
      at Object.require (node_modules/qerrors/index.js:18:17)
      at Object.<anonymous> (lib/routeTestUtils.ts:8:1)
      at Object.require (tests/integration/demo__server__app__get.test.js:2:1)

```

### Duration: 0ms

---

## Summary

- Total failed tests: 2
- Failed test files: /home/runner/workspace/tests/integration/demo__server__routes__hello__get.test.js, /home/runner/workspace/tests/integration/demo__server__app__get.test.js
- Generated: 2025-12-27T11:00:44.086Z
