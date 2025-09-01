# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: /home/runner/workspace/generated-tests/example__get.test.ts

### Output:
```
  console.log
    createMockApp is running with none

      at Object.createMockApp (utils/httpTest.ts:295:11)

  console.log
    createMockApp is returning app

      at Object.createMockApp (utils/httpTest.ts:379:13)

  console.log
    supertest is running with app

      at Object.supertest (utils/httpTest.ts:50:11)

  console.log
    supertest is returning Super instance

      at Object.supertest (utils/httpTest.ts:61:13)

  console.log
    Test is running with get /api/status?testSession=169660579102403-nvde4mm5k

      at new Test (utils/httpTest.ts:96:13)

  console.log
    Test.send is running with object

      at Test.send (utils/httpTest.ts:121:13)

  console.log
    Test.send is returning this

      at Test.send (utils/httpTest.ts:131:15)

  console.log
    Test.expect is running with 200

      at Test.expect (utils/httpTest.ts:140:13)

  console.log
    Test.expect is returning this

      at Test.expect (utils/httpTest.ts:144:15)

FAIL generated-tests/example__get.test.ts
  ● Console

    console.log
      createMockApp is running with none

      at Object.createMockApp (utils/httpTest.ts:295:11)

    console.log
      createMockApp is returning app

      at Object.createMockApp (utils/httpTest.ts:379:13)

    console.log
      supertest is running with app

      at Object.supertest (utils/httpTest.ts:50:11)

    console.log
      supertest is returning Super instance

      at Object.supertest (utils/httpTest.ts:61:13)

    console.log
      Test is running with get /api/status?testSession=169649654403186-qyz4fop2e

      at new Test (utils/httpTest.ts:96:13)

    console.log
      Test.send is running with object

      at Test.send (utils/httpTest.ts:121:13)

    console.log
      Test.send is returning this

      at Test.send (utils/httpTest.ts:131:15)

    console.log
      Test.expect is running with 200

      at Test.expect (utils/httpTest.ts:140:13)

    console.log
      Test.expect is returning this

      at Test.expect (utils/httpTest.ts:144:15)

  ● GET /api/status [API-169649654403186-qyz4fop2e] › should succeed with unique test data

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: undefined

      35 |       .expect(200);
      36 |     
    > 37 |     expect(res.body.success).toBe(true);
         |                              ^
      38 |     expect(res.body.testSession).toBe(apiTestSession);
      39 |   });
      40 | });

      at Object.<anonymous> (generated-tests/example__get.test.ts:37:30)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        5.904 s
Ran all test suites matching /home/runner/workspace/generated-tests/example__get.test.ts.
FAIL generated-tests/example__get.test.ts
  GET /api/status [API-169660579102403-nvde4mm5k]
    ✕ should succeed with unique test data (160 ms)

  ● GET /api/status [API-169660579102403-nvde4mm5k] › should succeed with unique test data

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: undefined

      35 |       .expect(200);
      36 |     
    > 37 |     expect(res.body.success).toBe(true);
         |                              ^
      38 |     expect(res.body.testSession).toBe(apiTestSession);
      39 |   });
      40 | });

      at Object.<anonymous> (generated-tests/example__get.test.ts:37:30)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        4.213 s
Ran all test suites matching /home/runner/workspace/generated-tests/example__get.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/generated-tests/example__get.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 24243ms

---

## Failed Test 2: /home/runner/workspace/generated-tests/example__post.test.ts

### Output:
```
  console.log
    createMockApp is running with none

      at Object.createMockApp (utils/httpTest.ts:295:11)

  console.log
    createMockApp is returning app

      at Object.createMockApp (utils/httpTest.ts:379:13)

  console.log
    supertest is running with app

      at Object.supertest (utils/httpTest.ts:50:11)

  console.log
    supertest is returning Super instance

      at Object.supertest (utils/httpTest.ts:61:13)

  console.log
    Test is running with post /api/users?testSession=169660792492014-fagh3grqx

      at new Test (utils/httpTest.ts:96:13)

  console.log
    Test.send is running with object

      at Test.send (utils/httpTest.ts:121:13)

  console.log
    Test.send is returning this

      at Test.send (utils/httpTest.ts:131:15)

  console.log
    Test.expect is running with 200

      at Test.expect (utils/httpTest.ts:140:13)

  console.log
    Test.expect is returning this

      at Test.expect (utils/httpTest.ts:144:15)

FAIL generated-tests/example__post.test.ts
  ● Console

    console.log
      createMockApp is running with none

      at Object.createMockApp (utils/httpTest.ts:295:11)

    console.log
      createMockApp is returning app

      at Object.createMockApp (utils/httpTest.ts:379:13)

    console.log
      supertest is running with app

      at Object.supertest (utils/httpTest.ts:50:11)

    console.log
      supertest is returning Super instance

      at Object.supertest (utils/httpTest.ts:61:13)

    console.log
      Test is running with post /api/users?testSession=169650980707295-80wfb9mt5

      at new Test (utils/httpTest.ts:96:13)

    console.log
      Test.send is running with object

      at Test.send (utils/httpTest.ts:121:13)

    console.log
      Test.send is returning this

      at Test.send (utils/httpTest.ts:131:15)

    console.log
      Test.expect is running with 200

      at Test.expect (utils/httpTest.ts:140:13)

    console.log
      Test.expect is returning this

      at Test.expect (utils/httpTest.ts:144:15)

  ● POST /api/users [API-169650980707295-80wfb9mt5] › should succeed with unique test data

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: undefined

      35 |       .expect(200);
      36 |     
    > 37 |     expect(res.body.success).toBe(true);
         |                              ^
      38 |     expect(res.body.testSession).toBe(apiTestSession);
      39 |   });
      40 | });

      at Object.<anonymous> (generated-tests/example__post.test.ts:37:30)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        9.447 s
Ran all test suites matching /home/runner/workspace/generated-tests/example__post.test.ts.
FAIL generated-tests/example__post.test.ts
  POST /api/users [API-169660792492014-fagh3grqx]
    ✕ should succeed with unique test data (206 ms)

  ● POST /api/users [API-169660792492014-fagh3grqx] › should succeed with unique test data

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: undefined

      35 |       .expect(200);
      36 |     
    > 37 |     expect(res.body.success).toBe(true);
         |                              ^
      38 |     expect(res.body.testSession).toBe(apiTestSession);
      39 |   });
      40 | });

      at Object.<anonymous> (generated-tests/example__post.test.ts:37:30)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        6.01 s
Ran all test suites matching /home/runner/workspace/generated-tests/example__post.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/generated-tests/example__post.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 24396ms

---

## Failed Test 3: /home/runner/workspace/generated-tests/example__put.test.ts

### Output:
```
  console.log
    createMockApp is running with none

      at Object.createMockApp (utils/httpTest.ts:295:11)

  console.log
    createMockApp is returning app

      at Object.createMockApp (utils/httpTest.ts:379:13)

  console.log
    supertest is running with app

      at Object.supertest (utils/httpTest.ts:50:11)

  console.log
    supertest is returning Super instance

      at Object.supertest (utils/httpTest.ts:61:13)

  console.log
    Test is running with put /api/users/:id?testSession=169658506362598-0swj3au92

      at new Test (utils/httpTest.ts:96:13)

  console.log
    Test.send is running with object

      at Test.send (utils/httpTest.ts:121:13)

  console.log
    Test.send is returning this

      at Test.send (utils/httpTest.ts:131:15)

  console.log
    Test.expect is running with 200

      at Test.expect (utils/httpTest.ts:140:13)

  console.log
    Test.expect is returning this

      at Test.expect (utils/httpTest.ts:144:15)

FAIL generated-tests/example__put.test.ts
  ● Console

    console.log
      createMockApp is running with none

      at Object.createMockApp (utils/httpTest.ts:295:11)

    console.log
      createMockApp is returning app

      at Object.createMockApp (utils/httpTest.ts:379:13)

    console.log
      supertest is running with app

      at Object.supertest (utils/httpTest.ts:50:11)

    console.log
      supertest is returning Super instance

      at Object.supertest (utils/httpTest.ts:61:13)

    console.log
      Test is running with put /api/users/:id?testSession=169648301936558-2i7at4ihq

      at new Test (utils/httpTest.ts:96:13)

    console.log
      Test.send is running with object

      at Test.send (utils/httpTest.ts:121:13)

    console.log
      Test.send is returning this

      at Test.send (utils/httpTest.ts:131:15)

    console.log
      Test.expect is running with 200

      at Test.expect (utils/httpTest.ts:140:13)

    console.log
      Test.expect is returning this

      at Test.expect (utils/httpTest.ts:144:15)

  ● PUT /api/users/:id [API-169648301936558-2i7at4ihq] › should succeed with unique test data

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: undefined

      35 |       .expect(200);
      36 |     
    > 37 |     expect(res.body.success).toBe(true);
         |                              ^
      38 |     expect(res.body.testSession).toBe(apiTestSession);
      39 |   });
      40 | });

      at Object.<anonymous> (generated-tests/example__put.test.ts:37:30)

Unable to check memory usage Error: write EPIPE
    at target._send (node:internal/child_process:878:20)
    at target.send (node:internal/child_process:751:19)
    at ChildProcessWorker.checkMemoryUsage (/home/runner/workspace/node_modules/jest-worker/build/index.js:1072:19)
    at ChildProcessWorker._onProcessEnd (/home/runner/workspace/node_modules/jest-worker/build/index.js:988:16)
    at ChildProcessWorker._onExit (/home/runner/workspace/node_modules/jest-worker/build/index.js:969:14)
    at ChildProcess.emit (node:events:524:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12) {
  errno: -32,
  code: 'EPIPE',
  syscall: 'write'
}
Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        5.896 s
Ran all test suites matching /home/runner/workspace/generated-tests/example__put.test.ts.
FAIL generated-tests/example__put.test.ts
  PUT /api/users/:id [API-169658506362598-0swj3au92]
    ✕ should succeed with unique test data (168 ms)

  ● PUT /api/users/:id [API-169658506362598-0swj3au92] › should succeed with unique test data

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: undefined

      35 |       .expect(200);
      36 |     
    > 37 |     expect(res.body.success).toBe(true);
         |                              ^
      38 |     expect(res.body.testSession).toBe(apiTestSession);
      39 |   });
      40 | });

      at Object.<anonymous> (generated-tests/example__put.test.ts:37:30)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        4.685 s
Ran all test suites matching /home/runner/workspace/generated-tests/example__put.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/generated-tests/example__put.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 22344ms

---

## Failed Test 4: /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__delete.test.js

### Output:
```
FAIL generated-tests/integration/demo__src__apiRoutes__delete.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__delete.test.js:2
    import * as httpTest from '../../utils/httpTest.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.956 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__delete.test.js.
FAIL generated-tests/integration/demo__src__apiRoutes__delete.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__delete.test.js:2
    import * as httpTest from '../../utils/httpTest.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.313 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__delete.test.js.
node:internal/modules/esm/resolve:283
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/utils/httpTest.js' imported from /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__delete.test.js
    at finalizeResolution (node:internal/modules/esm/resolve:283:11)
    at moduleResolve (node:internal/modules/esm/resolve:952:10)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/workspace/utils/httpTest.js'
}

Node.js v20.19.3

```

### Duration: 20206ms

---

## Failed Test 5: /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__get.test.js

### Output:
```
FAIL generated-tests/integration/demo__src__apiRoutes__get.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__get.test.js:2
    import * as httpTest from '../../utils/httpTest.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        7.663 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__get.test.js.
FAIL generated-tests/integration/demo__src__apiRoutes__get.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__get.test.js:2
    import * as httpTest from '../../utils/httpTest.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.2 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__get.test.js.
node:internal/modules/esm/resolve:283
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/utils/httpTest.js' imported from /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__get.test.js
    at finalizeResolution (node:internal/modules/esm/resolve:283:11)
    at moduleResolve (node:internal/modules/esm/resolve:952:10)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/workspace/utils/httpTest.js'
}

Node.js v20.19.3

```

### Duration: 24231ms

---

## Failed Test 6: /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__patch.test.js

### Output:
```
FAIL generated-tests/integration/demo__src__apiRoutes__patch.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__patch.test.js:2
    import * as httpTest from '../../utils/httpTest.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        2.887 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__patch.test.js.
FAIL generated-tests/integration/demo__src__apiRoutes__patch.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__patch.test.js:2
    import * as httpTest from '../../utils/httpTest.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.439 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__patch.test.js.
node:internal/modules/esm/resolve:283
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/utils/httpTest.js' imported from /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__patch.test.js
    at finalizeResolution (node:internal/modules/esm/resolve:283:11)
    at moduleResolve (node:internal/modules/esm/resolve:952:10)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/workspace/utils/httpTest.js'
}

Node.js v20.19.3

```

### Duration: 18612ms

---

## Failed Test 7: /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__post.test.js

### Output:
```
FAIL generated-tests/integration/demo__src__apiRoutes__post.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__post.test.js:2
    import * as httpTest from '../../utils/httpTest.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.634 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__post.test.js.
FAIL generated-tests/integration/demo__src__apiRoutes__post.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__post.test.js:2
    import * as httpTest from '../../utils/httpTest.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.9 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__post.test.js.
node:internal/modules/esm/resolve:283
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/utils/httpTest.js' imported from /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__post.test.js
    at finalizeResolution (node:internal/modules/esm/resolve:283:11)
    at moduleResolve (node:internal/modules/esm/resolve:952:10)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/workspace/utils/httpTest.js'
}

Node.js v20.19.3

```

### Duration: 23734ms

---

## Failed Test 8: /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__put.test.js

### Output:
```
FAIL generated-tests/integration/demo__src__apiRoutes__put.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__put.test.js:2
    import * as httpTest from '../../utils/httpTest.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.143 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__put.test.js.
FAIL generated-tests/integration/demo__src__apiRoutes__put.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__put.test.js:2
    import * as httpTest from '../../utils/httpTest.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.605 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__put.test.js.
node:internal/modules/esm/resolve:283
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/utils/httpTest.js' imported from /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__put.test.js
    at finalizeResolution (node:internal/modules/esm/resolve:283:11)
    at moduleResolve (node:internal/modules/esm/resolve:952:10)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/workspace/utils/httpTest.js'
}

Node.js v20.19.3

```

### Duration: 23223ms

---

## Failed Test 9: /home/runner/workspace/generated-tests/integration/example.test.ts

### Output:
```
FAIL generated-tests/integration/example.test.ts
  ● Example Integration Tests › example integration works

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at generated-tests/integration/example.test.ts:5:17
      at Object.<anonymous> (generated-tests/integration/example.test.ts:5:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        5.588 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example.test.ts.
FAIL generated-tests/integration/example.test.ts
  Example Integration Tests
    ✕ example integration works (229 ms)

  ● Example Integration Tests › example integration works

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at generated-tests/integration/example.test.ts:5:17
      at Object.<anonymous> (generated-tests/integration/example.test.ts:5:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        6.739 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/generated-tests/integration/example.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 21843ms

---

## Failed Test 10: /home/runner/workspace/generated-tests/integration/example__get.test.js

### Output:
```
FAIL generated-tests/integration/example__get.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/generated-tests/integration/example__get.test.js:2
    import * as httpTest from '../../utils/httpTest.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        7.412 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__get.test.js.
FAIL generated-tests/integration/example__get.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/generated-tests/integration/example__get.test.js:2
    import * as httpTest from '../../utils/httpTest.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.363 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__get.test.js.
node:internal/modules/esm/resolve:283
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/utils/httpTest.js' imported from /home/runner/workspace/generated-tests/integration/example__get.test.js
    at finalizeResolution (node:internal/modules/esm/resolve:283:11)
    at moduleResolve (node:internal/modules/esm/resolve:952:10)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/workspace/utils/httpTest.js'
}

Node.js v20.19.3

```

### Duration: 21886ms

---

## Failed Test 11: /home/runner/workspace/generated-tests/integration/example__get.test.ts

### Output:
```
FAIL generated-tests/integration/example__get.test.ts
  ● Test suite failed to run

    Configuration error:

    Could not locate module ../utils/httpTest.js mapped as:
    $1.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^(\.{1,2}\/.*)\.js$/": "$1"
      },
      "resolver": undefined
    }

       6 | const uniqueRoute = '/api/status' + ('/api/status'.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
       7 |
    >  8 | import * as httpTest from '../utils/httpTest.js';
         | ^
       9 |
      10 | describe(`GET /api/status [API-${apiTestSession}]`, () => {
      11 |   // Test data factory for unique request/response data

      at createNoMappedModuleFoundError (node_modules/jest-resolve/build/index.js:1117:17)
      at Object.<anonymous> (generated-tests/integration/example__get.test.ts:8:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        7.527 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__get.test.ts.
FAIL generated-tests/integration/example__get.test.ts
  ● Test suite failed to run

    Configuration error:

    Could not locate module ../utils/httpTest.js mapped as:
    $1.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^(\.{1,2}\/.*)\.js$/": "$1"
      },
      "resolver": undefined
    }

       6 | const uniqueRoute = '/api/status' + ('/api/status'.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
       7 |
    >  8 | import * as httpTest from '../utils/httpTest.js';
         | ^
       9 |
      10 | describe(`GET /api/status [API-${apiTestSession}]`, () => {
      11 |   // Test data factory for unique request/response data

      at createNoMappedModuleFoundError (node_modules/jest-resolve/build/index.js:1117:17)
      at Object.<anonymous> (generated-tests/integration/example__get.test.ts:8:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.414 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__get.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/generated-tests/integration/example__get.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 24382ms

---

## Failed Test 12: /home/runner/workspace/generated-tests/integration/example__post.test.js

### Output:
```
FAIL generated-tests/integration/example__post.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/generated-tests/integration/example__post.test.js:2
    import * as httpTest from '../../utils/httpTest.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        7.63 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__post.test.js.
FAIL generated-tests/integration/example__post.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/generated-tests/integration/example__post.test.js:2
    import * as httpTest from '../../utils/httpTest.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        3.089 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__post.test.js.
node:internal/modules/esm/resolve:283
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/utils/httpTest.js' imported from /home/runner/workspace/generated-tests/integration/example__post.test.js
    at finalizeResolution (node:internal/modules/esm/resolve:283:11)
    at moduleResolve (node:internal/modules/esm/resolve:952:10)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/workspace/utils/httpTest.js'
}

Node.js v20.19.3

```

### Duration: 24376ms

---

## Failed Test 13: /home/runner/workspace/generated-tests/integration/example__post.test.ts

### Output:
```
FAIL generated-tests/integration/example__post.test.ts
  ● Test suite failed to run

    Configuration error:

    Could not locate module ../utils/httpTest.js mapped as:
    $1.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^(\.{1,2}\/.*)\.js$/": "$1"
      },
      "resolver": undefined
    }

       6 | const uniqueRoute = '/api/users' + ('/api/users'.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
       7 |
    >  8 | import * as httpTest from '../utils/httpTest.js';
         | ^
       9 |
      10 | describe(`POST /api/users [API-${apiTestSession}]`, () => {
      11 |   // Test data factory for unique request/response data

      at createNoMappedModuleFoundError (node_modules/jest-resolve/build/index.js:1117:17)
      at Object.<anonymous> (generated-tests/integration/example__post.test.ts:8:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.673 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__post.test.ts.
FAIL generated-tests/integration/example__post.test.ts
  ● Test suite failed to run

    Configuration error:

    Could not locate module ../utils/httpTest.js mapped as:
    $1.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^(\.{1,2}\/.*)\.js$/": "$1"
      },
      "resolver": undefined
    }

       6 | const uniqueRoute = '/api/users' + ('/api/users'.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
       7 |
    >  8 | import * as httpTest from '../utils/httpTest.js';
         | ^
       9 |
      10 | describe(`POST /api/users [API-${apiTestSession}]`, () => {
      11 |   // Test data factory for unique request/response data

      at createNoMappedModuleFoundError (node_modules/jest-resolve/build/index.js:1117:17)
      at Object.<anonymous> (generated-tests/integration/example__post.test.ts:8:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.626 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__post.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/generated-tests/integration/example__post.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 22204ms

---

## Failed Test 14: /home/runner/workspace/generated-tests/integration/example__put.test.js

### Output:
```
FAIL generated-tests/integration/example__put.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/generated-tests/integration/example__put.test.js:2
    import * as httpTest from '../../utils/httpTest.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.851 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__put.test.js.
FAIL generated-tests/integration/example__put.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/generated-tests/integration/example__put.test.js:2
    import * as httpTest from '../../utils/httpTest.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Unable to check memory usage Error: write EPIPE
    at target._send (node:internal/child_process:878:20)
    at target.send (node:internal/child_process:751:19)
    at ChildProcessWorker.checkMemoryUsage (/home/runner/workspace/node_modules/jest-worker/build/index.js:1072:19)
    at ChildProcessWorker._onProcessEnd (/home/runner/workspace/node_modules/jest-worker/build/index.js:988:16)
    at ChildProcessWorker._onExit (/home/runner/workspace/node_modules/jest-worker/build/index.js:969:14)
    at ChildProcess.emit (node:events:524:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12) {
  errno: -32,
  code: 'EPIPE',
  syscall: 'write'
}
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        3.797 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__put.test.js.
node:internal/modules/esm/resolve:283
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/utils/httpTest.js' imported from /home/runner/workspace/generated-tests/integration/example__put.test.js
    at finalizeResolution (node:internal/modules/esm/resolve:283:11)
    at moduleResolve (node:internal/modules/esm/resolve:952:10)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/workspace/utils/httpTest.js'
}

Node.js v20.19.3

```

### Duration: 20804ms

---

## Failed Test 15: /home/runner/workspace/generated-tests/integration/example__put.test.ts

### Output:
```
FAIL generated-tests/integration/example__put.test.ts
  ● Test suite failed to run

    Configuration error:

    Could not locate module ../utils/httpTest.js mapped as:
    $1.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^(\.{1,2}\/.*)\.js$/": "$1"
      },
      "resolver": undefined
    }

       6 | const uniqueRoute = '/api/users/:id' + ('/api/users/:id'.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
       7 |
    >  8 | import * as httpTest from '../utils/httpTest.js';
         | ^
       9 |
      10 | describe(`PUT /api/users/:id [API-${apiTestSession}]`, () => {
      11 |   // Test data factory for unique request/response data

      at createNoMappedModuleFoundError (node_modules/jest-resolve/build/index.js:1117:17)
      at Object.<anonymous> (generated-tests/integration/example__put.test.ts:8:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.707 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__put.test.ts.
FAIL generated-tests/integration/example__put.test.ts
  ● Test suite failed to run

    Configuration error:

    Could not locate module ../utils/httpTest.js mapped as:
    $1.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^(\.{1,2}\/.*)\.js$/": "$1"
      },
      "resolver": undefined
    }

       6 | const uniqueRoute = '/api/users/:id' + ('/api/users/:id'.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
       7 |
    >  8 | import * as httpTest from '../utils/httpTest.js';
         | ^
       9 |
      10 | describe(`PUT /api/users/:id [API-${apiTestSession}]`, () => {
      11 |   // Test data factory for unique request/response data

      at createNoMappedModuleFoundError (node_modules/jest-resolve/build/index.js:1117:17)
      at Object.<anonymous> (generated-tests/integration/example__put.test.ts:8:1)

Unable to check memory usage Error: write EPIPE
    at target._send (node:internal/child_process:878:20)
    at target.send (node:internal/child_process:751:19)
    at ChildProcessWorker.checkMemoryUsage (/home/runner/workspace/node_modules/jest-worker/build/index.js:1072:19)
    at ChildProcessWorker._onProcessEnd (/home/runner/workspace/node_modules/jest-worker/build/index.js:988:16)
    at ChildProcessWorker._onExit (/home/runner/workspace/node_modules/jest-worker/build/index.js:969:14)
    at ChildProcess.emit (node:events:524:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12) {
  errno: -32,
  code: 'EPIPE',
  syscall: 'write'
}
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        7.031 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__put.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/generated-tests/integration/example__put.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 23670ms

---

## Failed Test 16: /home/runner/workspace/generated-tests/integration/utils__httpTest__get.test.ts

### Output:
```
FAIL generated-tests/integration/utils__httpTest__get.test.ts
  ● Test suite failed to run

    Configuration error:

    Could not locate module ../utils/httpTest.js mapped as:
    $1.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^(\.{1,2}\/.*)\.js$/": "$1"
      },
      "resolver": undefined
    }

       6 | const uniqueRoute = '/test' + ('/test'.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
       7 |
    >  8 | import * as httpTest from '../utils/httpTest.js';
         | ^
       9 |
      10 | describe(`GET /test [API-${apiTestSession}]`, () => {
      11 |   // Test data factory for unique request/response data

      at createNoMappedModuleFoundError (node_modules/jest-resolve/build/index.js:1117:17)
      at Object.<anonymous> (generated-tests/integration/utils__httpTest__get.test.ts:8:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        8.036 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/utils__httpTest__get.test.ts.
FAIL generated-tests/integration/utils__httpTest__get.test.ts
  ● Test suite failed to run

    Configuration error:

    Could not locate module ../utils/httpTest.js mapped as:
    $1.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^(\.{1,2}\/.*)\.js$/": "$1"
      },
      "resolver": undefined
    }

       6 | const uniqueRoute = '/test' + ('/test'.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
       7 |
    >  8 | import * as httpTest from '../utils/httpTest.js';
         | ^
       9 |
      10 | describe(`GET /test [API-${apiTestSession}]`, () => {
      11 |   // Test data factory for unique request/response data

      at createNoMappedModuleFoundError (node_modules/jest-resolve/build/index.js:1117:17)
      at Object.<anonymous> (generated-tests/integration/utils__httpTest__get.test.ts:8:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.203 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/utils__httpTest__get.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/generated-tests/integration/utils__httpTest__get.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 24114ms

---

## Failed Test 17: /home/runner/workspace/index.test.ts

### Output:
```
FAIL ./index.test.ts
  ● index.ts basic exports › module exports exist

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at index.test.ts:5:17
      at Object.<anonymous> (index.test.ts:5:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        6.616 s
Ran all test suites matching /home/runner/workspace/index.test.ts.
FAIL ./index.test.ts
  index.ts basic exports
    ✕ module exports exist (26 ms)

  ● index.ts basic exports › module exports exist

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at index.test.ts:5:17
      at Object.<anonymous> (index.test.ts:5:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        2.803 s
Ran all test suites matching /home/runner/workspace/index.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/index.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 17926ms

---

## Failed Test 18: /home/runner/workspace/lib/envUtils.test.ts

### Output:
```
FAIL lib/envUtils.test.ts
  ● envUtils.ts basic exports › module loads without errors

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at lib/envUtils.test.ts:4:17
      at Object.<anonymous> (lib/envUtils.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        5.966 s
Ran all test suites matching /home/runner/workspace/lib/envUtils.test.ts.
FAIL lib/envUtils.test.ts
  envUtils.ts basic exports
    ✕ module loads without errors (42 ms)

  ● envUtils.ts basic exports › module loads without errors

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at lib/envUtils.test.ts:4:17
      at Object.<anonymous> (lib/envUtils.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        2.778 s
Ran all test suites matching /home/runner/workspace/lib/envUtils.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/lib/envUtils.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 17401ms

---

## Failed Test 19: /home/runner/workspace/lib/stubs.test.ts

### Output:
```
FAIL lib/stubs.test.ts
  ● stubs.ts basic exports › module loads without errors

    expect(received).toBeDefined()

    Received: undefined

       8 |     expect(typeof module).toBe('object');
       9 |     // Check for expected exports
    > 10 |     expect(module.stubs).toBeDefined();
         |                          ^
      11 |   });
      12 | });
      13 |

      at Object.<anonymous> (lib/stubs.test.ts:10:26)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        5.542 s
Ran all test suites matching /home/runner/workspace/lib/stubs.test.ts.
FAIL lib/stubs.test.ts
  stubs.ts basic exports
    ✕ module loads without errors (11 ms)

  ● stubs.ts basic exports › module loads without errors

    expect(received).toBeDefined()

    Received: undefined

       8 |     expect(typeof module).toBe('object');
       9 |     // Check for expected exports
    > 10 |     expect(module.stubs).toBeDefined();
         |                          ^
      11 |   });
      12 | });
      13 |

      at Object.<anonymous> (lib/stubs.test.ts:10:26)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        3.369 s
Ran all test suites matching /home/runner/workspace/lib/stubs.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/lib/stubs.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 17782ms

---

## Failed Test 20: /home/runner/workspace/lib/testGenerator.test.ts

### Output:
```
FAIL lib/testGenerator.test.ts
  ● testGenerator.ts basic exports › module loads without errors

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/lib/testGenerator.ts:26
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      2 | describe('testGenerator.ts basic exports', () => {
      3 |   test('module loads without errors', async () => {
    > 4 |     const mod = await import('./testGenerator.js');
        |                 ^
      5 |     expect(mod).toBeDefined();
      6 |     expect(typeof mod).toBe('object');
      7 |   });

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at lib/testGenerator.test.ts:4:17
      at Object.<anonymous> (lib/testGenerator.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        5.827 s
Ran all test suites matching /home/runner/workspace/lib/testGenerator.test.ts.
FAIL lib/testGenerator.test.ts
  testGenerator.ts basic exports
    ✕ module loads without errors (17 ms)

  ● testGenerator.ts basic exports › module loads without errors

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/lib/testGenerator.ts:26
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      2 | describe('testGenerator.ts basic exports', () => {
      3 |   test('module loads without errors', async () => {
    > 4 |     const mod = await import('./testGenerator.js');
        |                 ^
      5 |     expect(mod).toBeDefined();
      6 |     expect(typeof mod).toBe('object');
      7 |   });

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at lib/testGenerator.test.ts:4:17
      at Object.<anonymous> (lib/testGenerator.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        3.244 s
Ran all test suites matching /home/runner/workspace/lib/testGenerator.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/lib/testGenerator.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 17867ms

---

## Failed Test 21: /home/runner/workspace/lib/testUtils.test.ts

### Output:
```
FAIL lib/testUtils.test.ts
  ● testUtils.ts basic exports › module loads without errors

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/testUtils.ts:30:1)
      at lib/testUtils.test.ts:4:17
      at Object.<anonymous> (lib/testUtils.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        4.686 s
Ran all test suites matching /home/runner/workspace/lib/testUtils.test.ts.
FAIL lib/testUtils.test.ts
  testUtils.ts basic exports
    ✕ module loads without errors (13 ms)

  ● testUtils.ts basic exports › module loads without errors

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/testUtils.ts:30:1)
      at lib/testUtils.test.ts:4:17
      at Object.<anonymous> (lib/testUtils.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        3.132 s
Ran all test suites matching /home/runner/workspace/lib/testUtils.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/lib/testUtils.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 17737ms

---

## Failed Test 22: /home/runner/workspace/manual-tests/axiosStub.test.ts

### Output:
```
FAIL manual-tests/axiosStub.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at Object.<anonymous> (manual-tests/axiosStub.test.ts:1:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.337 s
Ran all test suites matching /home/runner/workspace/manual-tests/axiosStub.test.ts.
FAIL manual-tests/axiosStub.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at Object.<anonymous> (manual-tests/axiosStub.test.ts:1:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        2.728 s
Ran all test suites matching /home/runner/workspace/manual-tests/axiosStub.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/axiosStub.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 17867ms

---

## Failed Test 23: /home/runner/workspace/manual-tests/comprehensive.test.ts

### Output:
```
FAIL manual-tests/comprehensive.test.ts
  ● Comprehensive Tests › comprehensive functionality works

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/comprehensive.test.ts:4:17
      at Object.<anonymous> (manual-tests/comprehensive.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        4.793 s
Ran all test suites matching /home/runner/workspace/manual-tests/comprehensive.test.ts.
FAIL manual-tests/comprehensive.test.ts
  Comprehensive Tests
    ✕ comprehensive functionality works (23 ms)

  ● Comprehensive Tests › comprehensive functionality works

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/comprehensive.test.ts:4:17
      at Object.<anonymous> (manual-tests/comprehensive.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        2.877 s
Ran all test suites matching /home/runner/workspace/manual-tests/comprehensive.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/comprehensive.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 16517ms

---

## Failed Test 24: /home/runner/workspace/manual-tests/dualModuleGeneration.test.ts

### Output:
```
FAIL manual-tests/dualModuleGeneration.test.ts
  ● Dual Module Generation Tests › TypeScript ES module generation works

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/lib/testGenerator.ts:26
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      3 |   test('TypeScript ES module generation works', async () => {
      4 |     // Simple test for TypeScript ES module functionality
    > 5 |     const testModule = await import('../lib/testGenerator.js');
        |                        ^
      6 |     expect(testModule).toBeDefined();
      7 |   });
      8 | });

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at manual-tests/dualModuleGeneration.test.ts:5:24
      at Object.<anonymous> (manual-tests/dualModuleGeneration.test.ts:5:24)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        3.817 s
Ran all test suites matching /home/runner/workspace/manual-tests/dualModuleGeneration.test.ts.
FAIL manual-tests/dualModuleGeneration.test.ts
  Dual Module Generation Tests
    ✕ TypeScript ES module generation works (15 ms)

  ● Dual Module Generation Tests › TypeScript ES module generation works

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/lib/testGenerator.ts:26
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      3 |   test('TypeScript ES module generation works', async () => {
      4 |     // Simple test for TypeScript ES module functionality
    > 5 |     const testModule = await import('../lib/testGenerator.js');
        |                        ^
      6 |     expect(testModule).toBeDefined();
      7 |   });
      8 | });

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at manual-tests/dualModuleGeneration.test.ts:5:24
      at Object.<anonymous> (manual-tests/dualModuleGeneration.test.ts:5:24)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        4.079 s
Ran all test suites matching /home/runner/workspace/manual-tests/dualModuleGeneration.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/dualModuleGeneration.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 16763ms

---

## Failed Test 25: /home/runner/workspace/manual-tests/edgeCases.test.ts

### Output:
```
FAIL manual-tests/edgeCases.test.ts
  ● Edge Cases Tests › handles edge cases correctly

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/edgeCases.test.ts:4:17
      at Object.<anonymous> (manual-tests/edgeCases.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        5.645 s
Ran all test suites matching /home/runner/workspace/manual-tests/edgeCases.test.ts.
FAIL manual-tests/edgeCases.test.ts
  Edge Cases Tests
    ✕ handles edge cases correctly (27 ms)

  ● Edge Cases Tests › handles edge cases correctly

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/edgeCases.test.ts:4:17
      at Object.<anonymous> (manual-tests/edgeCases.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        3.597 s
Ran all test suites matching /home/runner/workspace/manual-tests/edgeCases.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/edgeCases.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 17818ms

---

## Failed Test 26: /home/runner/workspace/manual-tests/indexExports.test.ts

### Output:
```
FAIL manual-tests/indexExports.test.ts
  ● Index Exports Tests › index exports are available

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/indexExports.test.ts:4:17
      at Object.<anonymous> (manual-tests/indexExports.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        4.038 s
Ran all test suites matching /home/runner/workspace/manual-tests/indexExports.test.ts.
FAIL manual-tests/indexExports.test.ts
  Index Exports Tests
    ✕ index exports are available (68 ms)

  ● Index Exports Tests › index exports are available

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/indexExports.test.ts:4:17
      at Object.<anonymous> (manual-tests/indexExports.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        2.986 s
Ran all test suites matching /home/runner/workspace/manual-tests/indexExports.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/indexExports.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 15699ms

---

## Failed Test 27: /home/runner/workspace/manual-tests/integration.test.ts

### Output:
```
FAIL manual-tests/integration.test.ts
  ● Integration Tests › core modules integrate correctly

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/integration.test.ts:4:19
      at Object.<anonymous> (manual-tests/integration.test.ts:4:19)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        5.143 s
Ran all test suites matching /home/runner/workspace/manual-tests/integration.test.ts.
FAIL manual-tests/integration.test.ts
  Integration Tests
    ✕ core modules integrate correctly (28 ms)

  ● Integration Tests › core modules integrate correctly

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/integration.test.ts:4:19
      at Object.<anonymous> (manual-tests/integration.test.ts:4:19)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        2.113 s
Ran all test suites matching /home/runner/workspace/manual-tests/integration.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/integration.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 15718ms

---

## Failed Test 28: /home/runner/workspace/manual-tests/mockConsole.test.ts

### Output:
```
FAIL manual-tests/mockConsole.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (manual-tests/mockConsole.test.ts:1:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.019 s
Ran all test suites matching /home/runner/workspace/manual-tests/mockConsole.test.ts.
FAIL manual-tests/mockConsole.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (manual-tests/mockConsole.test.ts:1:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        2.309 s
Ran all test suites matching /home/runner/workspace/manual-tests/mockConsole.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/mockConsole.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 16060ms

---

## Failed Test 29: /home/runner/workspace/manual-tests/moduleSystemIntegration.test.ts

### Output:
```
FAIL manual-tests/moduleSystemIntegration.test.ts
  ● Module System Integration Tests › ES module integration works

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/moduleSystemIntegration.test.ts:4:17
      at Object.<anonymous> (manual-tests/moduleSystemIntegration.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        6.852 s
Ran all test suites matching /home/runner/workspace/manual-tests/moduleSystemIntegration.test.ts.
FAIL manual-tests/moduleSystemIntegration.test.ts
  Module System Integration Tests
    ✕ ES module integration works (29 ms)

  ● Module System Integration Tests › ES module integration works

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/moduleSystemIntegration.test.ts:4:17
      at Object.<anonymous> (manual-tests/moduleSystemIntegration.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        2.138 s
Ran all test suites matching /home/runner/workspace/manual-tests/moduleSystemIntegration.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/moduleSystemIntegration.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 15970ms

---

## Failed Test 30: /home/runner/workspace/manual-tests/performance.test.ts

### Output:
```
FAIL manual-tests/performance.test.ts
  ● Performance Tests › performance is acceptable

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/performance.test.ts:5:17
      at Object.<anonymous> (manual-tests/performance.test.ts:5:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        6.916 s
Ran all test suites matching /home/runner/workspace/manual-tests/performance.test.ts.
FAIL manual-tests/performance.test.ts
  Performance Tests
    ✕ performance is acceptable (21 ms)

  ● Performance Tests › performance is acceptable

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (lib/envUtils.ts:18:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/performance.test.ts:5:17
      at Object.<anonymous> (manual-tests/performance.test.ts:5:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1.822 s
Ran all test suites matching /home/runner/workspace/manual-tests/performance.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/performance.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 16223ms

---

## Failed Test 31: /home/runner/workspace/manual-tests/resolveStubPaths.test.ts

### Output:
```
FAIL manual-tests/resolveStubPaths.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/manual-tests/resolveStubPaths.test.ts:44
            import axios from 'axios';
            ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Unable to check memory usage Error: write EPIPE
    at target._send (node:internal/child_process:878:20)
    at target.send (node:internal/child_process:751:19)
    at ChildProcessWorker.checkMemoryUsage (/home/runner/workspace/node_modules/jest-worker/build/index.js:1072:19)
    at ChildProcessWorker._onProcessEnd (/home/runner/workspace/node_modules/jest-worker/build/index.js:988:16)
    at ChildProcessWorker._onExit (/home/runner/workspace/node_modules/jest-worker/build/index.js:969:14)
    at ChildProcess.emit (node:events:524:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12) {
  errno: -32,
  code: 'EPIPE',
  syscall: 'write'
}
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.519 s
Ran all test suites matching /home/runner/workspace/manual-tests/resolveStubPaths.test.ts.
FAIL manual-tests/resolveStubPaths.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/manual-tests/resolveStubPaths.test.ts:44
            import axios from 'axios';
            ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        2.192 s
Ran all test suites matching /home/runner/workspace/manual-tests/resolveStubPaths.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/resolveStubPaths.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 16136ms

---

## Failed Test 32: /home/runner/workspace/manual-tests/setupMultiple.test.ts

### Output:
```
FAIL manual-tests/setupMultiple.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/setup.ts:41
    const __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
          ^

    SyntaxError: Identifier '__dirname' has already been declared

      1 | // Simplified setup test to prevent child process spawning issues
    > 2 | import '../setup.js'; // activate stub resolution for test environment
        | ^
      3 |
      4 | describe('setup multiple calls', () => {
      5 |   test('setup can be called multiple times safely', async () => {

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (manual-tests/setupMultiple.test.ts:2:1)

Unable to check memory usage Error: write EPIPE
    at target._send (node:internal/child_process:878:20)
    at target.send (node:internal/child_process:751:19)
    at ChildProcessWorker.checkMemoryUsage (/home/runner/workspace/node_modules/jest-worker/build/index.js:1072:19)
    at ChildProcessWorker._onProcessEnd (/home/runner/workspace/node_modules/jest-worker/build/index.js:988:16)
    at ChildProcessWorker._onExit (/home/runner/workspace/node_modules/jest-worker/build/index.js:969:14)
    at ChildProcess.emit (node:events:524:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12) {
  errno: -32,
  code: 'EPIPE',
  syscall: 'write'
}
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        7.177 s
Ran all test suites matching /home/runner/workspace/manual-tests/setupMultiple.test.ts.
FAIL manual-tests/setupMultiple.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/setup.ts:41
    const __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
          ^

    SyntaxError: Identifier '__dirname' has already been declared

      1 | // Simplified setup test to prevent child process spawning issues
    > 2 | import '../setup.js'; // activate stub resolution for test environment
        | ^
      3 |
      4 | describe('setup multiple calls', () => {
      5 |   test('setup can be called multiple times safely', async () => {

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (manual-tests/setupMultiple.test.ts:2:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        1.704 s
Ran all test suites matching /home/runner/workspace/manual-tests/setupMultiple.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/setupMultiple.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 16195ms

---

## Failed Test 33: /home/runner/workspace/manual-tests/setupResolution.test.ts

### Output:
```
FAIL manual-tests/setupResolution.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/setup.ts:41
    const __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
          ^

    SyntaxError: Identifier '__dirname' has already been declared

      1 | // Simplified setup resolution test for TypeScript ES modules
    > 2 | import '../setup.js'; // activate stub resolution
        | ^
      3 |
      4 | describe('setup resolution functionality', () => {
      5 |   test('setup modifies module resolution', () => {

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (manual-tests/setupResolution.test.ts:2:1)

Unable to check memory usage Error: write EPIPE
    at target._send (node:internal/child_process:878:20)
    at target.send (node:internal/child_process:751:19)
    at ChildProcessWorker.checkMemoryUsage (/home/runner/workspace/node_modules/jest-worker/build/index.js:1072:19)
    at ChildProcessWorker._onProcessEnd (/home/runner/workspace/node_modules/jest-worker/build/index.js:988:16)
    at ChildProcessWorker._onExit (/home/runner/workspace/node_modules/jest-worker/build/index.js:969:14)
    at ChildProcess.emit (node:events:524:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12) {
  errno: -32,
  code: 'EPIPE',
  syscall: 'write'
}
Unable to check memory usage Error: write EPIPE
    at target._send (node:internal/child_process:878:20)
    at target.send (node:internal/child_process:751:19)
    at ChildProcessWorker.checkMemoryUsage (/home/runner/workspace/node_modules/jest-worker/build/index.js:1072:19)
    at ChildProcessWorker._onProcessEnd (/home/runner/workspace/node_modules/jest-worker/build/index.js:988:16)
    at ChildProcessWorker._onExit (/home/runner/workspace/node_modules/jest-worker/build/index.js:969:14)
    at ChildProcess.emit (node:events:524:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12) {
  errno: -32,
  code: 'EPIPE',
  syscall: 'write'
}
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.822 s
Ran all test suites matching /home/runner/workspace/manual-tests/setupResolution.test.ts.
FAIL manual-tests/setupResolution.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/setup.ts:41
    const __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
          ^

    SyntaxError: Identifier '__dirname' has already been declared

      1 | // Simplified setup resolution test for TypeScript ES modules
    > 2 | import '../setup.js'; // activate stub resolution
        | ^
      3 |
      4 | describe('setup resolution functionality', () => {
      5 |   test('setup modifies module resolution', () => {

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (manual-tests/setupResolution.test.ts:2:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        1.477 s
Ran all test suites matching /home/runner/workspace/manual-tests/setupResolution.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/setupResolution.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 14506ms

---

## Failed Test 34: /home/runner/workspace/manual-tests/stubMethod.test.ts

### Output:
```
FAIL manual-tests/stubMethod.test.ts
  ● stubMethod replaces and restores methods

    TypeError: (0 , stubMethod_js_1.stubMethod) is not a function

      3 | test('stubMethod replaces and restores methods', () => {
      4 |   const obj = { method: () => 'original' };
    > 5 |   const stub = stubMethod(obj, 'method', () => 'stubbed');
        |                          ^
      6 |   
      7 |   expect(obj.method()).toBe('stubbed');
      8 |   stub.restore();

      at Object.<anonymous> (manual-tests/stubMethod.test.ts:5:26)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        5.584 s
Ran all test suites matching /home/runner/workspace/manual-tests/stubMethod.test.ts.
FAIL manual-tests/stubMethod.test.ts
  ✕ stubMethod replaces and restores methods (4 ms)

  ● stubMethod replaces and restores methods

    TypeError: (0 , stubMethod_js_1.stubMethod) is not a function

      3 | test('stubMethod replaces and restores methods', () => {
      4 |   const obj = { method: () => 'original' };
    > 5 |   const stub = stubMethod(obj, 'method', () => 'stubbed');
        |                          ^
      6 |   
      7 |   expect(obj.method()).toBe('stubbed');
      8 |   stub.restore();

      at Object.<anonymous> (manual-tests/stubMethod.test.ts:5:26)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1.624 s
Ran all test suites matching /home/runner/workspace/manual-tests/stubMethod.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/stubMethod.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 14421ms

---

## Failed Test 35: /home/runner/workspace/manual-tests/testGenerator.test.ts

### Output:
```
FAIL manual-tests/testGenerator.test.ts
  ● testGenerator.ts basic exports › module loads without errors

    Configuration error:

    Could not locate module ./testGenerator.js mapped as:
    $1.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^(\.{1,2}\/.*)\.js$/": "$1"
      },
      "resolver": undefined
    }

      2 | describe('testGenerator.ts basic exports', () => {
      3 |   test('module loads without errors', async () => {
    > 4 |     const mod = await import('./testGenerator.js');
        |                 ^
      5 |     expect(mod).toBeDefined();
      6 |     expect(typeof mod).toBe('object');
      7 |   });

      at createNoMappedModuleFoundError (node_modules/jest-resolve/build/index.js:1117:17)
      at manual-tests/testGenerator.test.ts:4:17
      at Object.<anonymous> (manual-tests/testGenerator.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        5.251 s
Ran all test suites matching /home/runner/workspace/manual-tests/testGenerator.test.ts.
FAIL manual-tests/testGenerator.test.ts
  testGenerator.ts basic exports
    ✕ module loads without errors (5 ms)

  ● testGenerator.ts basic exports › module loads without errors

    Configuration error:

    Could not locate module ./testGenerator.js mapped as:
    $1.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^(\.{1,2}\/.*)\.js$/": "$1"
      },
      "resolver": undefined
    }

      2 | describe('testGenerator.ts basic exports', () => {
      3 |   test('module loads without errors', async () => {
    > 4 |     const mod = await import('./testGenerator.js');
        |                 ^
      5 |     expect(mod).toBeDefined();
      6 |     expect(typeof mod).toBe('object');
      7 |   });

      at createNoMappedModuleFoundError (node_modules/jest-resolve/build/index.js:1117:17)
      at manual-tests/testGenerator.test.ts:4:17
      at Object.<anonymous> (manual-tests/testGenerator.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1.687 s
Ran all test suites matching /home/runner/workspace/manual-tests/testGenerator.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/testGenerator.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 13358ms

---

## Failed Test 36: /home/runner/workspace/manual-tests/testHelpers.test.ts

### Output:
```
FAIL manual-tests/testHelpers.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (manual-tests/testHelpers.test.ts:2:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.088 s
Ran all test suites matching /home/runner/workspace/manual-tests/testHelpers.test.ts.
FAIL manual-tests/testHelpers.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at Object.<anonymous> (manual-tests/testHelpers.test.ts:2:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        1.286 s
Ran all test suites matching /home/runner/workspace/manual-tests/testHelpers.test.ts.
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

### Duration: 14994ms

---

## Failed Test 37: /home/runner/workspace/setup.test.ts

### Output:
```
FAIL ./setup.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/setup.ts:41
    const __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
          ^

    SyntaxError: Identifier '__dirname' has already been declared

      1 | // Auto-generated unit test for setup.ts - optimized for speed
    > 2 | import * as mod from './setup.ts';
        | ^
      3 |
      4 | describe('setup.ts', () => {
      5 |   test('setupComplete works', async () => {

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (setup.test.ts:2:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.545 s
Ran all test suites matching /home/runner/workspace/setup.test.ts.
FAIL ./setup.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/setup.ts:41
    const __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
          ^

    SyntaxError: Identifier '__dirname' has already been declared

      1 | // Auto-generated unit test for setup.ts - optimized for speed
    > 2 | import * as mod from './setup.ts';
        | ^
      3 |
      4 | describe('setup.ts', () => {
      5 |   test('setupComplete works', async () => {

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (setup.test.ts:2:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        1.469 s
Ran all test suites matching /home/runner/workspace/setup.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/setup.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 14758ms

---

## Failed Test 38: /home/runner/workspace/utils/helpers/moduleReloader.test.ts

### Output:
```
FAIL utils/helpers/moduleReloader.test.ts
  ● moduleReloader.ts basic exports › module loads without errors

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      2 | describe('moduleReloader.ts basic exports', () => {
      3 |   test('module loads without errors', async () => {
    > 4 |     const mod = await import('./moduleReloader.js');
        |                 ^
      5 |     expect(mod).toBeDefined();
      6 |     expect(typeof mod).toBe('object');
      7 |   });

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at utils/helpers/moduleReloader.test.ts:4:17
      at Object.<anonymous> (utils/helpers/moduleReloader.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        4.692 s
Ran all test suites matching /home/runner/workspace/utils/helpers/moduleReloader.test.ts.
FAIL utils/helpers/moduleReloader.test.ts
  moduleReloader.ts basic exports
    ✕ module loads without errors (8 ms)

  ● moduleReloader.ts basic exports › module loads without errors

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      2 | describe('moduleReloader.ts basic exports', () => {
      3 |   test('module loads without errors', async () => {
    > 4 |     const mod = await import('./moduleReloader.js');
        |                 ^
      5 |     expect(mod).toBeDefined();
      6 |     expect(typeof mod).toBe('object');
      7 |   });

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at utils/helpers/moduleReloader.test.ts:4:17
      at Object.<anonymous> (utils/helpers/moduleReloader.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1.015 s
Ran all test suites matching /home/runner/workspace/utils/helpers/moduleReloader.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/helpers/moduleReloader.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 12763ms

---

## Failed Test 39: /home/runner/workspace/utils/testHelpers.test.ts

### Output:
```
FAIL utils/testHelpers.test.ts
  ● testHelpers.ts basic exports › module loads without errors

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at utils/testHelpers.test.ts:4:17
      at Object.<anonymous> (utils/testHelpers.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        3.174 s
Ran all test suites matching /home/runner/workspace/utils/testHelpers.test.ts.
FAIL utils/testHelpers.test.ts
  testHelpers.ts basic exports
    ✕ module loads without errors (12 ms)

  ● testHelpers.ts basic exports › module loads without errors

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation, specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/utils/helpers/moduleReloader.ts:50
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
          ^

    SyntaxError: Identifier '__filename' has already been declared

      13 |
      14 | // Import focused helper utilities
    > 15 | import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
         | ^
      16 | import { stubQerrors } from './helpers/qerrorsStub.js';
      17 | import { withMockConsole } from './helpers/consoleMocker.js';
      18 | import { createJsonRes, createRes } from './helpers/responseMocker.js';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (utils/testHelpers.ts:15:1)
      at utils/testHelpers.test.ts:4:17
      at Object.<anonymous> (utils/testHelpers.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        0.964 s, estimated 1 s
Ran all test suites matching /home/runner/workspace/utils/testHelpers.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/testHelpers.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 7642ms

---

## Summary

- Total failed tests: 39
- Failed test files: /home/runner/workspace/generated-tests/example__get.test.ts, /home/runner/workspace/generated-tests/example__post.test.ts, /home/runner/workspace/generated-tests/example__put.test.ts, /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__delete.test.js, /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__get.test.js, /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__patch.test.js, /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__post.test.js, /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__put.test.js, /home/runner/workspace/generated-tests/integration/example.test.ts, /home/runner/workspace/generated-tests/integration/example__get.test.js, /home/runner/workspace/generated-tests/integration/example__get.test.ts, /home/runner/workspace/generated-tests/integration/example__post.test.js, /home/runner/workspace/generated-tests/integration/example__post.test.ts, /home/runner/workspace/generated-tests/integration/example__put.test.js, /home/runner/workspace/generated-tests/integration/example__put.test.ts, /home/runner/workspace/generated-tests/integration/utils__httpTest__get.test.ts, /home/runner/workspace/index.test.ts, /home/runner/workspace/lib/envUtils.test.ts, /home/runner/workspace/lib/stubs.test.ts, /home/runner/workspace/lib/testGenerator.test.ts, /home/runner/workspace/lib/testUtils.test.ts, /home/runner/workspace/manual-tests/axiosStub.test.ts, /home/runner/workspace/manual-tests/comprehensive.test.ts, /home/runner/workspace/manual-tests/dualModuleGeneration.test.ts, /home/runner/workspace/manual-tests/edgeCases.test.ts, /home/runner/workspace/manual-tests/indexExports.test.ts, /home/runner/workspace/manual-tests/integration.test.ts, /home/runner/workspace/manual-tests/mockConsole.test.ts, /home/runner/workspace/manual-tests/moduleSystemIntegration.test.ts, /home/runner/workspace/manual-tests/performance.test.ts, /home/runner/workspace/manual-tests/resolveStubPaths.test.ts, /home/runner/workspace/manual-tests/setupMultiple.test.ts, /home/runner/workspace/manual-tests/setupResolution.test.ts, /home/runner/workspace/manual-tests/stubMethod.test.ts, /home/runner/workspace/manual-tests/testGenerator.test.ts, /home/runner/workspace/manual-tests/testHelpers.test.ts, /home/runner/workspace/setup.test.ts, /home/runner/workspace/utils/helpers/moduleReloader.test.ts, /home/runner/workspace/utils/testHelpers.test.ts
- Generated: 2025-09-01T10:59:55.557Z
