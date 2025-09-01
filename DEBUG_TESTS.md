# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: /home/runner/workspace/generated-tests/example__get.test.ts

### Output:
```
FAIL generated-tests/example__get.test.ts
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

    /home/runner/workspace/generated-tests/example__get.test.ts:7
    const uniqueRoute = '/api/status' + (/api/status.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
                                         ^

    SyntaxError: Invalid regular expression flags

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        7.332 s
Ran all test suites matching /home/runner/workspace/generated-tests/example__get.test.ts.
FAIL generated-tests/example__get.test.ts
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

    /home/runner/workspace/generated-tests/example__get.test.ts:7
    const uniqueRoute = '/api/status' + (/api/status.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
                                         ^

    SyntaxError: Invalid regular expression flags

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        3.254 s
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

### Duration: 21899ms

---

## Failed Test 2: /home/runner/workspace/generated-tests/example__post.test.ts

### Output:
```
FAIL generated-tests/example__post.test.ts
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

    /home/runner/workspace/generated-tests/example__post.test.ts:7
    const uniqueRoute = '/api/users' + (/api/users.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
                                        ^

    SyntaxError: Invalid regular expression flags

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.815 s
Ran all test suites matching /home/runner/workspace/generated-tests/example__post.test.ts.
FAIL generated-tests/example__post.test.ts
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

    /home/runner/workspace/generated-tests/example__post.test.ts:7
    const uniqueRoute = '/api/users' + (/api/users.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
                                        ^

    SyntaxError: Invalid regular expression flags

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        3.222 s
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

### Duration: 20646ms

---

## Failed Test 3: /home/runner/workspace/generated-tests/example__put.test.ts

### Output:
```
FAIL generated-tests/example__put.test.ts
  ● Test suite failed to run

    [96mgenerated-tests/example__put.test.ts[0m:[93m6[0m:[93m52[0m - [91merror[0m[90m TS1109: [0mExpression expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                   ~[0m
    [96mgenerated-tests/example__put.test.ts[0m:[93m6[0m:[93m55[0m - [91merror[0m[90m TS1005: [0m',' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                      ~[0m
    [96mgenerated-tests/example__put.test.ts[0m:[93m6[0m:[93m64[0m - [91merror[0m[90m TS1005: [0m',' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                               ~[0m
    [96mgenerated-tests/example__put.test.ts[0m:[93m6[0m:[93m81[0m - [91merror[0m[90m TS1005: [0m';' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                                                ~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.34 s
Ran all test suites matching /home/runner/workspace/generated-tests/example__put.test.ts.
FAIL generated-tests/example__put.test.ts
  ● Test suite failed to run

    [96mgenerated-tests/example__put.test.ts[0m:[93m6[0m:[93m52[0m - [91merror[0m[90m TS1109: [0mExpression expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                   ~[0m
    [96mgenerated-tests/example__put.test.ts[0m:[93m6[0m:[93m55[0m - [91merror[0m[90m TS1005: [0m',' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                      ~[0m
    [96mgenerated-tests/example__put.test.ts[0m:[93m6[0m:[93m64[0m - [91merror[0m[90m TS1005: [0m',' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                               ~[0m
    [96mgenerated-tests/example__put.test.ts[0m:[93m6[0m:[93m81[0m - [91merror[0m[90m TS1005: [0m';' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                                                ~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.03 s
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

### Duration: 19564ms

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
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        3.821 s
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
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.53 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__delete.test.js.
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/node_modules/qtests/lib/envUtils' imported from /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__delete.test.js
Did you mean to import "qtests/lib/envUtils.js"?
    at finalizeResolution (node:internal/modules/esm/resolve:283:11)
    at moduleResolve (node:internal/modules/esm/resolve:952:10)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/workspace/node_modules/qtests/lib/envUtils'
}

Node.js v20.19.3

```

### Duration: 19724ms

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
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.265 s
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
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.611 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__get.test.js.
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/node_modules/qtests/lib/envUtils' imported from /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__get.test.js
Did you mean to import "qtests/lib/envUtils.js"?
    at finalizeResolution (node:internal/modules/esm/resolve:283:11)
    at moduleResolve (node:internal/modules/esm/resolve:952:10)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/workspace/node_modules/qtests/lib/envUtils'
}

Node.js v20.19.3

```

### Duration: 20275ms

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
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.298 s
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
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.602 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__patch.test.js.
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/node_modules/qtests/lib/envUtils' imported from /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__patch.test.js
Did you mean to import "qtests/lib/envUtils.js"?
    at finalizeResolution (node:internal/modules/esm/resolve:283:11)
    at moduleResolve (node:internal/modules/esm/resolve:952:10)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/workspace/node_modules/qtests/lib/envUtils'
}

Node.js v20.19.3

```

### Duration: 21423ms

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
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.216 s
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
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        3.472 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__post.test.js.
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/node_modules/qtests/lib/envUtils' imported from /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__post.test.js
Did you mean to import "qtests/lib/envUtils.js"?
    at finalizeResolution (node:internal/modules/esm/resolve:283:11)
    at moduleResolve (node:internal/modules/esm/resolve:952:10)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/workspace/node_modules/qtests/lib/envUtils'
}

Node.js v20.19.3

```

### Duration: 21484ms

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
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.717 s
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
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.424 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__put.test.js.
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/node_modules/qtests/lib/envUtils' imported from /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__put.test.js
Did you mean to import "qtests/lib/envUtils.js"?
    at finalizeResolution (node:internal/modules/esm/resolve:283:11)
    at moduleResolve (node:internal/modules/esm/resolve:952:10)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/workspace/node_modules/qtests/lib/envUtils'
}

Node.js v20.19.3

```

### Duration: 18025ms

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at generated-tests/integration/example.test.ts:5:17
      at Object.<anonymous> (generated-tests/integration/example.test.ts:5:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        8.227 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example.test.ts.
FAIL generated-tests/integration/example.test.ts
  Example Integration Tests
    ✕ example integration works (19 ms)

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at generated-tests/integration/example.test.ts:5:17
      at Object.<anonymous> (generated-tests/integration/example.test.ts:5:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        3.62 s, estimated 4 s
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

### Duration: 21856ms

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
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        7.118 s
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
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.231 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__get.test.js.
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/node_modules/qtests/lib/envUtils' imported from /home/runner/workspace/generated-tests/integration/example__get.test.js
Did you mean to import "qtests/lib/envUtils.js"?
    at finalizeResolution (node:internal/modules/esm/resolve:283:11)
    at moduleResolve (node:internal/modules/esm/resolve:952:10)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/workspace/node_modules/qtests/lib/envUtils'
}

Node.js v20.19.3

```

### Duration: 21282ms

---

## Failed Test 11: /home/runner/workspace/generated-tests/integration/example__get.test.ts

### Output:
```
FAIL generated-tests/integration/example__get.test.ts
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

    /home/runner/workspace/generated-tests/integration/example__get.test.ts:7
    const uniqueRoute = '/api/status' + (/api/status.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
                                         ^

    SyntaxError: Invalid regular expression flags

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.241 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__get.test.ts.
FAIL generated-tests/integration/example__get.test.ts
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

    /home/runner/workspace/generated-tests/integration/example__get.test.ts:7
    const uniqueRoute = '/api/status' + (/api/status.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
                                         ^

    SyntaxError: Invalid regular expression flags

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.925 s
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

### Duration: 20378ms

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
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.658 s
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
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.632 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__post.test.js.
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/node_modules/qtests/lib/envUtils' imported from /home/runner/workspace/generated-tests/integration/example__post.test.js
Did you mean to import "qtests/lib/envUtils.js"?
    at finalizeResolution (node:internal/modules/esm/resolve:283:11)
    at moduleResolve (node:internal/modules/esm/resolve:952:10)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/workspace/node_modules/qtests/lib/envUtils'
}

Node.js v20.19.3

```

### Duration: 20816ms

---

## Failed Test 13: /home/runner/workspace/generated-tests/integration/example__post.test.ts

### Output:
```
FAIL generated-tests/integration/example__post.test.ts
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

    /home/runner/workspace/generated-tests/integration/example__post.test.ts:7
    const uniqueRoute = '/api/users' + (/api/users.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
                                        ^

    SyntaxError: Invalid regular expression flags

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.795 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__post.test.ts.
FAIL generated-tests/integration/example__post.test.ts
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

    /home/runner/workspace/generated-tests/integration/example__post.test.ts:7
    const uniqueRoute = '/api/users' + (/api/users.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
                                        ^

    SyntaxError: Invalid regular expression flags

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.623 s
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

### Duration: 20270ms

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
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.084 s
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
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.9 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__put.test.js.
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/node_modules/qtests/lib/envUtils' imported from /home/runner/workspace/generated-tests/integration/example__put.test.js
Did you mean to import "qtests/lib/envUtils.js"?
    at finalizeResolution (node:internal/modules/esm/resolve:283:11)
    at moduleResolve (node:internal/modules/esm/resolve:952:10)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/workspace/node_modules/qtests/lib/envUtils'
}

Node.js v20.19.3

```

### Duration: 20874ms

---

## Failed Test 15: /home/runner/workspace/generated-tests/integration/example__put.test.ts

### Output:
```
FAIL generated-tests/integration/example__put.test.ts
  ● Test suite failed to run

    [96mgenerated-tests/integration/example__put.test.ts[0m:[93m6[0m:[93m52[0m - [91merror[0m[90m TS1109: [0mExpression expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                   ~[0m
    [96mgenerated-tests/integration/example__put.test.ts[0m:[93m6[0m:[93m55[0m - [91merror[0m[90m TS1005: [0m',' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                      ~[0m
    [96mgenerated-tests/integration/example__put.test.ts[0m:[93m6[0m:[93m64[0m - [91merror[0m[90m TS1005: [0m',' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                               ~[0m
    [96mgenerated-tests/integration/example__put.test.ts[0m:[93m6[0m:[93m81[0m - [91merror[0m[90m TS1005: [0m';' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                                                ~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.766 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/example__put.test.ts.
FAIL generated-tests/integration/example__put.test.ts
  ● Test suite failed to run

    [96mgenerated-tests/integration/example__put.test.ts[0m:[93m6[0m:[93m52[0m - [91merror[0m[90m TS1109: [0mExpression expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                   ~[0m
    [96mgenerated-tests/integration/example__put.test.ts[0m:[93m6[0m:[93m55[0m - [91merror[0m[90m TS1005: [0m',' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                      ~[0m
    [96mgenerated-tests/integration/example__put.test.ts[0m:[93m6[0m:[93m64[0m - [91merror[0m[90m TS1005: [0m',' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                               ~[0m
    [96mgenerated-tests/integration/example__put.test.ts[0m:[93m6[0m:[93m81[0m - [91merror[0m[90m TS1005: [0m';' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                                                ~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.273 s
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

### Duration: 21158ms

---

## Failed Test 16: /home/runner/workspace/generated-tests/integration/utils__httpTest__get.test.ts

### Output:
```
FAIL generated-tests/integration/utils__httpTest__get.test.ts
  ● Test suite failed to run

    [96mgenerated-tests/integration/utils__httpTest__get.test.ts[0m:[93m6[0m:[93m32[0m - [91merror[0m[90m TS1161: [0mUnterminated regular expression literal.

    [7m6[0m const uniqueRoute = '/test' + (/test.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.276 s
Ran all test suites matching /home/runner/workspace/generated-tests/integration/utils__httpTest__get.test.ts.
FAIL generated-tests/integration/utils__httpTest__get.test.ts
  ● Test suite failed to run

    [96mgenerated-tests/integration/utils__httpTest__get.test.ts[0m:[93m6[0m:[93m32[0m - [91merror[0m[90m TS1161: [0mUnterminated regular expression literal.

    [7m6[0m const uniqueRoute = '/test' + (/test.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        3.532 s
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

### Duration: 21588ms

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at index.test.ts:5:17
      at Object.<anonymous> (index.test.ts:5:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        3.61 s
Ran all test suites matching /home/runner/workspace/index.test.ts.
FAIL ./index.test.ts
  index.ts basic exports
    ✕ module exports exist (31 ms)

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at index.test.ts:5:17
      at Object.<anonymous> (index.test.ts:5:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        4.193 s
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

### Duration: 14167ms

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at lib/envUtils.test.ts:4:17
      at Object.<anonymous> (lib/envUtils.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        5.512 s
Ran all test suites matching /home/runner/workspace/lib/envUtils.test.ts.
FAIL lib/envUtils.test.ts
  envUtils.ts basic exports
    ✕ module loads without errors (38 ms)

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at lib/envUtils.test.ts:4:17
      at Object.<anonymous> (lib/envUtils.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        2.999 s
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

### Duration: 17266ms

---

## Failed Test 19: /home/runner/workspace/lib/httpUtils.test.ts

### Output:
```
FAIL lib/httpUtils.test.ts
  ● httpUtils.ts basic exports › module loads without errors

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      37 | // offlineMode automatically switches between real and stub implementations
      38 | // based on whether the test should simulate offline conditions
    > 39 | import offlineMode from '../utils/offlineMode.js';
         | ^
      40 |
      41 | /**
      42 |  * Export HTTP testing utilities

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/httpUtils.ts:39:1)
      at lib/httpUtils.test.ts:4:17
      at Object.<anonymous> (lib/httpUtils.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        6.349 s
Ran all test suites matching /home/runner/workspace/lib/httpUtils.test.ts.
FAIL lib/httpUtils.test.ts
  httpUtils.ts basic exports
    ✕ module loads without errors (16 ms)

  ● httpUtils.ts basic exports › module loads without errors

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      37 | // offlineMode automatically switches between real and stub implementations
      38 | // based on whether the test should simulate offline conditions
    > 39 | import offlineMode from '../utils/offlineMode.js';
         | ^
      40 |
      41 | /**
      42 |  * Export HTTP testing utilities

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/httpUtils.ts:39:1)
      at lib/httpUtils.test.ts:4:17
      at Object.<anonymous> (lib/httpUtils.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        3.881 s
Ran all test suites matching /home/runner/workspace/lib/httpUtils.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/lib/httpUtils.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 19570ms

---

## Failed Test 20: /home/runner/workspace/lib/stubs.test.ts

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
Time:        5.755 s
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
Time:        3.552 s
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

### Duration: 19437ms

---

## Failed Test 21: /home/runner/workspace/lib/testGenerator.test.ts

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
Time:        8.018 s
Ran all test suites matching /home/runner/workspace/lib/testGenerator.test.ts.
FAIL lib/testGenerator.test.ts
  testGenerator.ts basic exports
    ✕ module loads without errors (11 ms)

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
Time:        2.316 s
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

### Duration: 19847ms

---

## Failed Test 22: /home/runner/workspace/lib/testUtils.test.ts

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
Time:        7.709 s
Ran all test suites matching /home/runner/workspace/lib/testUtils.test.ts.
FAIL lib/testUtils.test.ts
  testUtils.ts basic exports
    ✕ module loads without errors (11 ms)

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
Time:        2.516 s
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

### Duration: 19854ms

---

## Failed Test 23: /home/runner/workspace/manual-tests/axiosStub.test.ts

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at Object.<anonymous> (manual-tests/axiosStub.test.ts:1:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.376 s
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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at Object.<anonymous> (manual-tests/axiosStub.test.ts:1:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        3.349 s
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

### Duration: 19108ms

---

## Failed Test 24: /home/runner/workspace/manual-tests/comprehensive.test.ts

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/comprehensive.test.ts:4:17
      at Object.<anonymous> (manual-tests/comprehensive.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        5.894 s
Ran all test suites matching /home/runner/workspace/manual-tests/comprehensive.test.ts.
FAIL manual-tests/comprehensive.test.ts
  Comprehensive Tests
    ✕ comprehensive functionality works (22 ms)

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/comprehensive.test.ts:4:17
      at Object.<anonymous> (manual-tests/comprehensive.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        3.45 s
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

### Duration: 19303ms

---

## Failed Test 25: /home/runner/workspace/manual-tests/dualModuleGeneration.test.ts

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
Time:        8.125 s
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
Time:        3.611 s
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

### Duration: 19698ms

---

## Failed Test 26: /home/runner/workspace/manual-tests/edgeCases.test.ts

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/edgeCases.test.ts:4:17
      at Object.<anonymous> (manual-tests/edgeCases.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        4.372 s
Ran all test suites matching /home/runner/workspace/manual-tests/edgeCases.test.ts.
FAIL manual-tests/edgeCases.test.ts
  Edge Cases Tests
    ✕ handles edge cases correctly (20 ms)

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/edgeCases.test.ts:4:17
      at Object.<anonymous> (manual-tests/edgeCases.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        3.973 s
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

### Duration: 17406ms

---

## Failed Test 27: /home/runner/workspace/manual-tests/indexExports.test.ts

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/indexExports.test.ts:4:17
      at Object.<anonymous> (manual-tests/indexExports.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        6.135 s
Ran all test suites matching /home/runner/workspace/manual-tests/indexExports.test.ts.
FAIL manual-tests/indexExports.test.ts
  Index Exports Tests
    ✕ index exports are available (23 ms)

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/indexExports.test.ts:4:17
      at Object.<anonymous> (manual-tests/indexExports.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        3.12 s
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

### Duration: 19233ms

---

## Failed Test 28: /home/runner/workspace/manual-tests/integration.test.ts

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/integration.test.ts:4:19
      at Object.<anonymous> (manual-tests/integration.test.ts:4:19)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        7.505 s
Ran all test suites matching /home/runner/workspace/manual-tests/integration.test.ts.
FAIL manual-tests/integration.test.ts
  Integration Tests
    ✕ core modules integrate correctly (20 ms)

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/integration.test.ts:4:19
      at Object.<anonymous> (manual-tests/integration.test.ts:4:19)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        4.213 s
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

### Duration: 21140ms

---

## Failed Test 29: /home/runner/workspace/manual-tests/mockConsole.test.ts

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
Time:        6.494 s
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
Time:        4.811 s
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

### Duration: 21949ms

---

## Failed Test 30: /home/runner/workspace/manual-tests/moduleSystemIntegration.test.ts

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/moduleSystemIntegration.test.ts:4:17
      at Object.<anonymous> (manual-tests/moduleSystemIntegration.test.ts:4:17)

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
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        7.073 s
Ran all test suites matching /home/runner/workspace/manual-tests/moduleSystemIntegration.test.ts.
FAIL manual-tests/moduleSystemIntegration.test.ts
  Module System Integration Tests
    ✕ ES module integration works (61 ms)

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/moduleSystemIntegration.test.ts:4:17
      at Object.<anonymous> (manual-tests/moduleSystemIntegration.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        2.917 s
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

### Duration: 21803ms

---

## Failed Test 31: /home/runner/workspace/manual-tests/offlineIntegration.test.ts

### Output:
```
FAIL manual-tests/offlineIntegration.test.ts
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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      1 | // Simplified offline integration tests for TypeScript ES modules
    > 2 | import { isOfflineMode, setOfflineMode } from '../utils/offlineMode.js';
        | ^
      3 |
      4 | describe('Offline Integration Tests', () => {
      5 |   test('offline mode can be toggled', () => {

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (manual-tests/offlineIntegration.test.ts:2:1)

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
Time:        7.708 s
Ran all test suites matching /home/runner/workspace/manual-tests/offlineIntegration.test.ts.
FAIL manual-tests/offlineIntegration.test.ts
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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      1 | // Simplified offline integration tests for TypeScript ES modules
    > 2 | import { isOfflineMode, setOfflineMode } from '../utils/offlineMode.js';
        | ^
      3 |
      4 | describe('Offline Integration Tests', () => {
      5 |   test('offline mode can be toggled', () => {

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (manual-tests/offlineIntegration.test.ts:2:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.848 s
Ran all test suites matching /home/runner/workspace/manual-tests/offlineIntegration.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/offlineIntegration.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 21544ms

---

## Failed Test 32: /home/runner/workspace/manual-tests/offlineMode.test.ts

### Output:
```
FAIL manual-tests/offlineMode.test.ts
  ● Offline Mode Tests › offline mode functions correctly

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      2 | describe('Offline Mode Tests', () => {
      3 |   test('offline mode functions correctly', async () => {
    > 4 |     const mod = await import('../utils/offlineMode.js');
        |                 ^
      5 |     expect(mod).toBeDefined();
      6 |     expect(typeof mod).toBe('object');
      7 |   });

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at manual-tests/offlineMode.test.ts:4:17
      at Object.<anonymous> (manual-tests/offlineMode.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        6.409 s
Ran all test suites matching /home/runner/workspace/manual-tests/offlineMode.test.ts.
FAIL manual-tests/offlineMode.test.ts
  Offline Mode Tests
    ✕ offline mode functions correctly (23 ms)

  ● Offline Mode Tests › offline mode functions correctly

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      2 | describe('Offline Mode Tests', () => {
      3 |   test('offline mode functions correctly', async () => {
    > 4 |     const mod = await import('../utils/offlineMode.js');
        |                 ^
      5 |     expect(mod).toBeDefined();
      6 |     expect(typeof mod).toBe('object');
      7 |   });

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at manual-tests/offlineMode.test.ts:4:17
      at Object.<anonymous> (manual-tests/offlineMode.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        4.557 s
Ran all test suites matching /home/runner/workspace/manual-tests/offlineMode.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/manual-tests/offlineMode.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 21534ms

---

## Failed Test 33: /home/runner/workspace/manual-tests/performance.test.ts

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/performance.test.ts:5:17
      at Object.<anonymous> (manual-tests/performance.test.ts:5:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        6.335 s
Ran all test suites matching /home/runner/workspace/manual-tests/performance.test.ts.
FAIL manual-tests/performance.test.ts
  Performance Tests
    ✕ performance is acceptable (20 ms)

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      15 | // Import environment management utilities using ES module syntax
      16 | import { testEnv } from '../utils/testEnv.js';
    > 17 | import { offlineMode } from '../utils/offlineMode.js';
         | ^
      18 | import { testHelpers } from '../utils/testHelpers.js';
      19 |
      20 | // Export the core utilities that our TypeScript index needs

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at Object.<anonymous> (lib/envUtils.ts:17:1)
      at Object.<anonymous> (index.ts:17:1)
      at manual-tests/performance.test.ts:5:17
      at Object.<anonymous> (manual-tests/performance.test.ts:5:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        3.021 s
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

### Duration: 21979ms

---

## Failed Test 34: /home/runner/workspace/manual-tests/resolveStubPaths.test.ts

### Output:
```
FAIL manual-tests/resolveStubPaths.test.ts
  ● Stub Path Resolution Tests › stubs resolve correctly after setup

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

    /home/runner/workspace/setup.ts:40
    const require = (0, module_1.createRequire)(import.meta.url);
          ^

    SyntaxError: Identifier 'require' has already been declared

      2 | describe('Stub Path Resolution Tests', () => {
      3 |   test('stubs resolve correctly after setup', async () => {
    > 4 |     await import('../setup.js'); // activate stub resolution
        |     ^
      5 |     
      6 |     // Test that stub paths resolve without throwing
      7 |     expect(() => require('axios')).not.toThrow();

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at manual-tests/resolveStubPaths.test.ts:4:5
      at Object.<anonymous> (manual-tests/resolveStubPaths.test.ts:4:5)

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
Tests:       1 failed, 1 passed, 2 total
Snapshots:   0 total
Time:        7.141 s
Ran all test suites matching /home/runner/workspace/manual-tests/resolveStubPaths.test.ts.
FAIL manual-tests/resolveStubPaths.test.ts
  Stub Path Resolution Tests
    ✕ stubs resolve correctly after setup (11 ms)
    ✓ stub modules provide expected interfaces (287 ms)

  ● Stub Path Resolution Tests › stubs resolve correctly after setup

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

    /home/runner/workspace/setup.ts:40
    const require = (0, module_1.createRequire)(import.meta.url);
          ^

    SyntaxError: Identifier 'require' has already been declared

      2 | describe('Stub Path Resolution Tests', () => {
      3 |   test('stubs resolve correctly after setup', async () => {
    > 4 |     await import('../setup.js'); // activate stub resolution
        |     ^
      5 |     
      6 |     // Test that stub paths resolve without throwing
      7 |     expect(() => require('axios')).not.toThrow();

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at manual-tests/resolveStubPaths.test.ts:4:5
      at Object.<anonymous> (manual-tests/resolveStubPaths.test.ts:4:5)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
Snapshots:   0 total
Time:        4.407 s
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

### Duration: 21955ms

---

## Failed Test 35: /home/runner/workspace/manual-tests/setupMultiple.test.ts

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

    /home/runner/workspace/setup.ts:40
    const require = (0, module_1.createRequire)(import.meta.url);
          ^

    SyntaxError: Identifier 'require' has already been declared

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
Time:        7.335 s
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

    /home/runner/workspace/setup.ts:40
    const require = (0, module_1.createRequire)(import.meta.url);
          ^

    SyntaxError: Identifier 'require' has already been declared

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
Time:        3.777 s
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

### Duration: 21775ms

---

## Failed Test 36: /home/runner/workspace/manual-tests/setupResolution.test.ts

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

    /home/runner/workspace/setup.ts:40
    const require = (0, module_1.createRequire)(import.meta.url);
          ^

    SyntaxError: Identifier 'require' has already been declared

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
Time:        5.376 s
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

    /home/runner/workspace/setup.ts:40
    const require = (0, module_1.createRequire)(import.meta.url);
          ^

    SyntaxError: Identifier 'require' has already been declared

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
Time:        1.719 s
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

### Duration: 15341ms

---

## Failed Test 37: /home/runner/workspace/manual-tests/stubMethod.test.ts

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
Time:        7.302 s
Ran all test suites matching /home/runner/workspace/manual-tests/stubMethod.test.ts.
FAIL manual-tests/stubMethod.test.ts
  ✕ stubMethod replaces and restores methods (6 ms)

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
Time:        1.735 s
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

### Duration: 15003ms

---

## Failed Test 38: /home/runner/workspace/manual-tests/testGenerator.test.ts

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
Time:        6.351 s
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
Time:        1.639 s
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

### Duration: 15347ms

---

## Failed Test 39: /home/runner/workspace/manual-tests/testHelpers.test.ts

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
Time:        5.261 s
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
Time:        1.62 s
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

### Duration: 15553ms

---

## Failed Test 40: /home/runner/workspace/setup.test.ts

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

    /home/runner/workspace/setup.ts:40
    const require = (0, module_1.createRequire)(import.meta.url);
          ^

    SyntaxError: Identifier 'require' has already been declared

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
Time:        5.39 s
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

    /home/runner/workspace/setup.ts:40
    const require = (0, module_1.createRequire)(import.meta.url);
          ^

    SyntaxError: Identifier 'require' has already been declared

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
Time:        1.651 s
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

### Duration: 15494ms

---

## Failed Test 41: /home/runner/workspace/utils/helpers/moduleReloader.test.ts

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
Time:        7.375 s
Ran all test suites matching /home/runner/workspace/utils/helpers/moduleReloader.test.ts.
FAIL utils/helpers/moduleReloader.test.ts
  moduleReloader.ts basic exports
    ✕ module loads without errors (12 ms)

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
Time:        1.244 s
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

### Duration: 14898ms

---

## Failed Test 42: /home/runner/workspace/utils/offlineMode.test.ts

### Output:
```
FAIL utils/offlineMode.test.ts
  ● offlineMode.ts basic exports › module loads without errors

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      2 | describe('offlineMode.ts basic exports', () => {
      3 |   test('module loads without errors', async () => {
    > 4 |     const mod = await import('./offlineMode.js');
        |                 ^
      5 |     expect(mod).toBeDefined();
      6 |     expect(typeof mod).toBe('object');
      7 |   });

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at utils/offlineMode.test.ts:4:17
      at Object.<anonymous> (utils/offlineMode.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        4.609 s
Ran all test suites matching /home/runner/workspace/utils/offlineMode.test.ts.
FAIL utils/offlineMode.test.ts
  offlineMode.ts basic exports
    ✕ module loads without errors (8 ms)

  ● offlineMode.ts basic exports › module loads without errors

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

    /home/runner/workspace/utils/offlineMode.ts:74
                const stubAxios = await Promise.resolve().then(() => __importStar(require('../stubs/axios.js')));
                                  ^^^^^

    SyntaxError: await is only valid in async functions and the top level bodies of modules

      2 | describe('offlineMode.ts basic exports', () => {
      3 |   test('module loads without errors', async () => {
    > 4 |     const mod = await import('./offlineMode.js');
        |                 ^
      5 |     expect(mod).toBeDefined();
      6 |     expect(typeof mod).toBe('object');
      7 |   });

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)
      at utils/offlineMode.test.ts:4:17
      at Object.<anonymous> (utils/offlineMode.test.ts:4:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1.416 s
Ran all test suites matching /home/runner/workspace/utils/offlineMode.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/offlineMode.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 14437ms

---

## Failed Test 43: /home/runner/workspace/utils/testHelpers.test.ts

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
Time:        4.014 s
Ran all test suites matching /home/runner/workspace/utils/testHelpers.test.ts.
FAIL utils/testHelpers.test.ts
  testHelpers.ts basic exports
    ✕ module loads without errors (107 ms)

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
Time:        1.302 s
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

### Duration: 9133ms

---

## Summary

- Total failed tests: 43
- Failed test files: /home/runner/workspace/generated-tests/example__get.test.ts, /home/runner/workspace/generated-tests/example__post.test.ts, /home/runner/workspace/generated-tests/example__put.test.ts, /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__delete.test.js, /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__get.test.js, /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__patch.test.js, /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__post.test.js, /home/runner/workspace/generated-tests/integration/demo__src__apiRoutes__put.test.js, /home/runner/workspace/generated-tests/integration/example.test.ts, /home/runner/workspace/generated-tests/integration/example__get.test.js, /home/runner/workspace/generated-tests/integration/example__get.test.ts, /home/runner/workspace/generated-tests/integration/example__post.test.js, /home/runner/workspace/generated-tests/integration/example__post.test.ts, /home/runner/workspace/generated-tests/integration/example__put.test.js, /home/runner/workspace/generated-tests/integration/example__put.test.ts, /home/runner/workspace/generated-tests/integration/utils__httpTest__get.test.ts, /home/runner/workspace/index.test.ts, /home/runner/workspace/lib/envUtils.test.ts, /home/runner/workspace/lib/httpUtils.test.ts, /home/runner/workspace/lib/stubs.test.ts, /home/runner/workspace/lib/testGenerator.test.ts, /home/runner/workspace/lib/testUtils.test.ts, /home/runner/workspace/manual-tests/axiosStub.test.ts, /home/runner/workspace/manual-tests/comprehensive.test.ts, /home/runner/workspace/manual-tests/dualModuleGeneration.test.ts, /home/runner/workspace/manual-tests/edgeCases.test.ts, /home/runner/workspace/manual-tests/indexExports.test.ts, /home/runner/workspace/manual-tests/integration.test.ts, /home/runner/workspace/manual-tests/mockConsole.test.ts, /home/runner/workspace/manual-tests/moduleSystemIntegration.test.ts, /home/runner/workspace/manual-tests/offlineIntegration.test.ts, /home/runner/workspace/manual-tests/offlineMode.test.ts, /home/runner/workspace/manual-tests/performance.test.ts, /home/runner/workspace/manual-tests/resolveStubPaths.test.ts, /home/runner/workspace/manual-tests/setupMultiple.test.ts, /home/runner/workspace/manual-tests/setupResolution.test.ts, /home/runner/workspace/manual-tests/stubMethod.test.ts, /home/runner/workspace/manual-tests/testGenerator.test.ts, /home/runner/workspace/manual-tests/testHelpers.test.ts, /home/runner/workspace/setup.test.ts, /home/runner/workspace/utils/helpers/moduleReloader.test.ts, /home/runner/workspace/utils/offlineMode.test.ts, /home/runner/workspace/utils/testHelpers.test.ts
- Generated: 2025-09-01T10:41:57.815Z
