# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: /home/runner/workspace/tests/integration/createMockApp.test.js

### Output:
```
[1m[31m  [1m● [22m[1mcreateMockApp — .use() method exists (bug fix) › app.use is a function[39m[22m

    [1m[31mJest encountered an unexpected token[39m[22m

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see [4mhttps://jestjs.io/docs/ecmascript-modules[24m for how to enable it.
     • If you are trying to use TypeScript, see [4mhttps://jestjs.io/docs/getting-started#using-typescript[24m
     • To have some of your "node_modules" files transformed, you can specify a custom [1m"transformIgnorePatterns"[22m in your config.
     • If you need a custom transformation, specify a [1m"transform"[22m option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the [1m"moduleNameMapper"[22m config option.

    You'll find more details and examples of these config options in the docs:
    [36mhttps://jestjs.io/docs/configuration[39m
    For information about custom transformations, see:
    [36mhttps://jestjs.io/docs/code-transformation[39m

    [1m[31mDetails:[39m[22m

    /home/runner/workspace/dist/lib/stubs.js:67
    const _filename = (0, _url.fileURLToPath)(import.meta.url);
                                                     ^^^^

    SyntaxError: Cannot use 'import.meta' outside a module
[2m[22m
[2m    [0m [90m 1 |[39m [90m/** qtests - Main Entry Point */[39m[22m
[2m     [90m 2 |[39m [36mimport[39m { setup } [36mfrom[39m [32m'./lib/setup.js'[39m[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 3 |[39m [36mimport[39m stubs [36mfrom[39m [32m'./lib/stubs.js'[39m[33m;[39m[22m
[2m     [90m   |[39m [31m[1m^[22m[2m[39m[22m
[2m     [90m 4 |[39m [36mimport[39m { testEnv[33m,[39m offlineMode[33m,[39m testHelpers } [36mfrom[39m [32m'./lib/envUtils.js'[39m[33m;[39m[22m
[2m     [90m 5 |[39m [36mimport[39m { mockAPI } [36mfrom[39m [32m'./lib/mockSystem.js'[39m[33m;[39m[22m
[2m     [90m 6 |[39m [36mimport[39m { initializePolyfills[33m,[39m resetPolyfills[33m,[39m getWindow[33m,[39m matchMedia[33m,[39m clipboard[33m,[39m polyfillOrchestrator } [36mfrom[39m [32m'./lib/polyfills/index.js'[39m[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Runtime.createScriptFromCode ([22m[2mnode_modules/jest-runtime/build/index.js[2m:1318:40)[22m[2m[22m
[2m      [2mat Object.require ([22m[2mdist/index.js[2m:3:1)[22m[2m[22m
[2m      [2mat require ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m

[1m[31m  [1m● [22m[1mcreateMockApp — .use() method exists (bug fix) › app.use returns app for chaining[39m[22m

    [1m[31mJest encountered an unexpected token[39m[22m

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see [4mhttps://jestjs.io/docs/ecmascript-modules[24m for how to enable it.
     • If you are trying to use TypeScript, see [4mhttps://jestjs.io/docs/getting-started#using-typescript[24m
     • To have some of your "node_modules" files transformed, you can specify a custom [1m"transformIgnorePatterns"[22m in your config.
     • If you need a custom transformation, specify a [1m"transform"[22m option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the [1m"moduleNameMapper"[22m config option.

    You'll find more details and examples of these config options in the docs:
    [36mhttps://jestjs.io/docs/configuration[39m
    For information about custom transformations, see:
    [36mhttps://jestjs.io/docs/code-transformation[39m

    [1m[31mDetails:[39m[22m

    /home/runner/workspace/dist/lib/stubs.js:67
    const _filename = (0, _url.fileURLToPath)(import.meta.url);
                                                     ^^^^

    SyntaxError: Cannot use 'import.meta' outside a module
[2m[22m
[2m    [0m [90m 1 |[39m [90m/** qtests - Main Entry Point */[39m[22m
[2m     [90m 2 |[39m [36mimport[39m { setup } [36mfrom[39m [32m'./lib/setup.js'[39m[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 3 |[39m [36mimport[39m stubs [36mfrom[39m [32m'./lib/stubs.js'[39m[33m;[39m[22m
[2m     [90m   |[39m [31m[1m^[22m[2m[39m[22m
[2m     [90m 4 |[39m [36mimport[39m { testEnv[33m,[39m offlineMode[33m,[39m testHelpers } [36mfrom[39m [32m'./lib/envUtils.js'[39m[33m;[39m[22m
[2m     [90m 5 |[39m [36mimport[39m { mockAPI } [36mfrom[39m [32m'./lib/mockSystem.js'[39m[33m;[39m[22m
[2m     [90m 6 |[39m [36mimport[39m { initializePolyfills[33m,[39m resetPolyfills[33m,[39m getWindow[33m,[39m matchMedia[33m,[39m clipboard[33m,[39m polyfillOrchestrator } [36mfrom[39m [32m'./lib/polyfills/index.js'[39m[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Runtime.createScriptFromCode ([22m[2mnode_modules/jest-runtime/build/index.js[2m:1318:40)[22m[2m[22m
[2m      [2mat Object.require ([22m[2mdist/index.js[2m:3:1)[22m[2m[22m
[2m      [2mat require ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m

[1m[31m  [1m● [22m[1mcreateMockApp — middleware execution order › middleware runs before route handler[39m[22m

    [1m[31mJest encountered an unexpected token[39m[22m

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see [4mhttps://jestjs.io/docs/ecmascript-modules[24m for how to enable it.
     • If you are trying to use TypeScript, see [4mhttps://jestjs.io/docs/getting-started#using-typescript[24m
     • To have some of your "node_modules" files transformed, you can specify a custom [1m"transformIgnorePatterns"[22m in your config.
     • If you need a custom transformation, specify a [1m"transform"[22m option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the [1m"moduleNameMapper"[22m config option.

    You'll find more details and examples of these config options in the docs:
    [36mhttps://jestjs.io/docs/configuration[39m
    For information about custom transformations, see:
    [36mhttps://jestjs.io/docs/code-transformation[39m

    [1m[31mDetails:[39m[22m

    /home/runner/workspace/dist/lib/stubs.js:67
    const _filename = (0, _url.fileURLToPath)(import.meta.url);
                                                     ^^^^

    SyntaxError: Cannot use 'import.meta' outside a module
[2m[22m
[2m    [0m [90m 1 |[39m [90m/** qtests - Main Entry Point */[39m[22m
[2m     [90m 2 |[39m [36mimport[39m { setup } [36mfrom[39m [32m'./lib/setup.js'[39m[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 3 |[39m [36mimport[39m stubs [36mfrom[39m [32m'./lib/stubs.js'[39m[33m;[39m[22m
[2m     [90m   |[39m [31m[1m^[22m[2m[39m[22m
[2m     [90m 4 |[39m [36mimport[39m { testEnv[33m,[39m offlineMode[33m,[39m testHelpers } [36mfrom[39m [32m'./lib/envUtils.js'[39m[33m;[39m[22m
[2m     [90m 5 |[39m [36mimport[39m { mockAPI } [36mfrom[39m [32m'./lib/mockSystem.js'[39m[33m;[39m[22m
[2m     [90m 6 |[39m [36mimport[39m { initializePolyfills[33m,[39m resetPolyfills[33m,[39m getWindow[33m,[39m matchMedia[33m,[39m clipboard[33m,[39m polyfillOrchestrator } [36mfrom[39m [32m'./lib/polyfills/index.js'[39m[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Runtime.createScriptFromCode ([22m[2mnode_modules/jest-runtime/build/index.js[2m:1318:40)[22m[2m[22m
[2m      [2mat Object.require ([22m[2mdist/index.js[2m:3:1)[22m[2m[22m
[2m      [2mat require ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m

[1m[31m  [1m● [22m[1mcreateMockApp — middleware execution order › multiple middleware run in registration order[39m[22m

    [1m[31mJest encountered an unexpected token[39m[22m

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see [4mhttps://jestjs.io/docs/ecmascript-modules[24m for how to enable it.
     • If you are trying to use TypeScript, see [4mhttps://jestjs.io/docs/getting-started#using-typescript[24m
     • To have some of your "node_modules" files transformed, you can specify a custom [1m"transformIgnorePatterns"[22m in your config.
     • If you need a custom transformation, specify a [1m"transform"[22m option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the [1m"moduleNameMapper"[22m config option.

    You'll find more details and examples of these config options in the docs:
    [36mhttps://jestjs.io/docs/configuration[39m
    For information about custom transformations, see:
    [36mhttps://jestjs.io/docs/code-transformation[39m

    [1m[31mDetails:[39m[22m

    /home/runner/workspace/dist/lib/stubs.js:67
    const _filename = (0, _url.fileURLToPath)(import.meta.url);
                                                     ^^^^

    SyntaxError: Cannot use 'import.meta' outside a module
[2m[22m
[2m    [0m [90m 1 |[39m [90m/** qtests - Main Entry Point */[39m[22m
[2m     [90m 2 |[39m [36mimport[39m { setup } [36mfrom[39m [32m'./lib/setup.js'[39m[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 3 |[39m [36mimport[39m stubs [36mfrom[39m [32m'./lib/stubs.js'[39m[33m;[39m[22m
[2m     [90m   |[39m [31m[1m^[22m[2m[39m[22m
[2m     [90m 4 |[39m [36mimport[39m { testEnv[33m,[39m offlineMode[33m,[39m testHelpers } [36mfrom[39m [32m'./lib/envUtils.js'[39m[33m;[39m[22m
[2m     [90m 5 |[39m [36mimport[39m { mockAPI } [36mfrom[39m [32m'./lib/mockSystem.js'[39m[33m;[39m[22m
[2m     [90m 6 |[39m [36mimport[39m { initializePolyfills[33m,[39m resetPolyfills[33m,[39m getWindow[33m,[39m matchMedia[33m,[39m clipboard[33m,[39m polyfillOrchestrator } [36mfrom[39m [32m'./lib/polyfills/index.js'[39m[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Runtime.createScriptFromCode ([22m[2mnode_modules/jest-runtime/build/index.js[2m:1318:40)[22m[2m[22m
[2m      [2mat Object.require ([22m[2mdist/index.js[2m:3:1)[22m[2m[22m
[2m      [2mat require ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m

[1m[31m  [1m● [22m[1mcreateMockApp — middleware short-circuit (auth guard pattern) › middleware that does not call next() blocks the route[39m[22m

    [1m[31mJest encountered an unexpected token[39m[22m

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see [4mhttps://jestjs.io/docs/ecmascript-modules[24m for how to enable it.
     • If you are trying to use TypeScript, see [4mhttps://jestjs.io/docs/getting-started#using-typescript[24m
     • To have some of your "node_modules" files transformed, you can specify a custom [1m"transformIgnorePatterns"[22m in your config.
     • If you need a custom transformation, specify a [1m"transform"[22m option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the [1m"moduleNameMapper"[22m config option.

    You'll find more details and examples of these config options in the docs:
    [36mhttps://jestjs.io/docs/configuration[39m
    For information about custom transformations, see:
    [36mhttps://jestjs.io/docs/code-transformation[39m

    [1m[31mDetails:[39m[22m

    /home/runner/workspace/dist/lib/stubs.js:67
    const _filename = (0, _url.fileURLToPath)(import.meta.url);
                                                     ^^^^

    SyntaxError: Cannot use 'import.meta' outside a module
[2m[22m
[2m    [0m [90m 1 |[39m [90m/** qtests - Main Entry Point */[39m[22m
[2m     [90m 2 |[39m [36mimport[39m { setup } [36mfrom[39m [32m'./lib/setup.js'[39m[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 3 |[39m [36mimport[39m stubs [36mfrom[39m [32m'./lib/stubs.js'[39m[33m;[39m[22m
[2m     [90m   |[39m [31m[1m^[22m[2m[39m[22m
[2m     [90m 4 |[39m [36mimport[39m { testEnv[33m,[39m offlineMode[33m,[39m testHelpers } [36mfrom[39m [32m'./lib/envUtils.js'[39m[33m;[39m[22m
[2m     [90m 5 |[39m [36mimport[39m { mockAPI } [36mfrom[39m [32m'./lib/mockSystem.js'[39m[33m;[39m[22m
[2m     [90m 6 |[39m [36mimport[39m { initializePolyfills[33m,[39m resetPolyfills[33m,[39m getWindow[33m,[39m matchMedia[33m,[39m clipboard[33m,[39m polyfillOrchestrator } [36mfrom[39m [32m'./lib/polyfills/index.js'[39m[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Runtime.createScriptFromCode ([22m[2mnode_modules/jest-runtime/build/index.js[2m:1318:40)[22m[2m[22m
[2m      [2mat Object.require ([22m[2mdist/index.js[2m:3:1)[22m[2m[22m
[2m      [2mat require ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m

[1m[31m  [1m● [22m[1mcreateMockApp — middleware short-circuit (auth guard pattern) › middleware can inspect headers and conditionally allow[39m[22m

    [1m[31mJest encountered an unexpected token[39m[22m

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see [4mhttps://jestjs.io/docs/ecmascript-modules[24m for how to enable it.
     • If you are trying to use TypeScript, see [4mhttps://jestjs.io/docs/getting-started#using-typescript[24m
     • To have some of your "node_modules" files transformed, you can specify a custom [1m"transformIgnorePatterns"[22m in your config.
     • If you need a custom transformation, specify a [1m"transform"[22m option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the [1m"moduleNameMapper"[22m config option.

    You'll find more details and examples of these config options in the docs:
    [36mhttps://jestjs.io/docs/configuration[39m
    For information about custom transformations, see:
    [36mhttps://jestjs.io/docs/code-transformation[39m

    [1m[31mDetails:[39m[22m

    /home/runner/workspace/dist/lib/stubs.js:67
    const _filename = (0, _url.fileURLToPath)(import.meta.url);
                                                     ^^^^

    SyntaxError: Cannot use 'import.meta' outside a module
[2m[22m
[2m    [0m [90m 1 |[39m [90m/** qtests - Main Entry Point */[39m[22m
[2m     [90m 2 |[39m [36mimport[39m { setup } [36mfrom[39m [32m'./lib/setup.js'[39m[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 3 |[39m [36mimport[39m stubs [36mfrom[39m [32m'./lib/stubs.js'[39m[33m;[39m[22m
[2m     [90m   |[39m [31m[1m^[22m[2m[39m[22m
[2m     [90m 4 |[39m [36mimport[39m { testEnv[33m,[39m offlineMode[33m,[39m testHelpers } [36mfrom[39m [32m'./lib/envUtils.js'[39m[33m;[39m[22m
[2m     [90m 5 |[39m [36mimport[39m { mockAPI } [36mfrom[39m [32m'./lib/mockSystem.js'[39m[33m;[39m[22m
[2m     [90m 6 |[39m [36mimport[39m { initializePolyfills[33m,[39m resetPolyfills[33m,[39m getWindow[33m,[39m matchMedia[33m,[39m clipboard[33m,[39m polyfillOrchestrator } [36mfrom[39m [32m'./lib/polyfills/index.js'[39m[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Runtime.createScriptFromCode ([22m[2mnode_modules/jest-runtime/build/index.js[2m:1318:40)[22m[2m[22m
[2m      [2mat Object.require ([22m[2mdist/index.js[2m:3:1)[22m[2m[22m
[2m      [2mat require ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m

[1m[31m  [1m● [22m[1mcreateMockApp — middleware error handling › middleware that throws returns 500 without crashing[39m[22m

    [1m[31mJest encountered an unexpected token[39m[22m

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see [4mhttps://jestjs.io/docs/ecmascript-modules[24m for how to enable it.
     • If you are trying to use TypeScript, see [4mhttps://jestjs.io/docs/getting-started#using-typescript[24m
     • To have some of your "node_modules" files transformed, you can specify a custom [1m"transformIgnorePatterns"[22m in your config.
     • If you need a custom transformation, specify a [1m"transform"[22m option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the [1m"moduleNameMapper"[22m config option.

    You'll find more details and examples of these config options in the docs:
    [36mhttps://jestjs.io/docs/configuration[39m
    For information about custom transformations, see:
    [36mhttps://jestjs.io/docs/code-transformation[39m

    [1m[31mDetails:[39m[22m

    /home/runner/workspace/dist/lib/stubs.js:67
    const _filename = (0, _url.fileURLToPath)(import.meta.url);
                                                     ^^^^

    SyntaxError: Cannot use 'import.meta' outside a module
[2m[22m
[2m    [0m [90m 1 |[39m [90m/** qtests - Main Entry Point */[39m[22m
[2m     [90m 2 |[39m [36mimport[39m { setup } [36mfrom[39m [32m'./lib/setup.js'[39m[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 3 |[39m [36mimport[39m stubs [36mfrom[39m [32m'./lib/stubs.js'[39m[33m;[39m[22m
[2m     [90m   |[39m [31m[1m^[22m[2m[39m[22m
[2m     [90m 4 |[39m [36mimport[39m { testEnv[33m,[39m offlineMode[33m,[39m testHelpers } [36mfrom[39m [32m'./lib/envUtils.js'[39m[33m;[39m[22m
[2m     [90m 5 |[39m [36mimport[39m { mockAPI } [36mfrom[39m [32m'./lib/mockSystem.js'[39m[33m;[39m[22m
[2m     [90m 6 |[39m [36mimport[39m { initializePolyfills[33m,[39m resetPolyfills[33m,[39m getWindow[33m,[39m matchMedia[33m,[39m clipboard[33m,[39m polyfillOrchestrator } [36mfrom[39m [32m'./lib/polyfills/index.js'[39m[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Runtime.createScriptFromCode ([22m[2mnode_modules/jest-runtime/build/index.js[2m:1318:40)[22m[2m[22m
[2m      [2mat Object.require ([22m[2mdist/index.js[2m:3:1)[22m[2m[22m
[2m      [2mat require ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m

[1m[31m  [1m● [22m[1mcreateMockApp — middleware error handling › middleware can mutate request before route sees it[39m[22m

    [1m[31mJest encountered an unexpected token[39m[22m

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see [4mhttps://jestjs.io/docs/ecmascript-modules[24m for how to enable it.
     • If you are trying to use TypeScript, see [4mhttps://jestjs.io/docs/getting-started#using-typescript[24m
     • To have some of your "node_modules" files transformed, you can specify a custom [1m"transformIgnorePatterns"[22m in your config.
     • If you need a custom transformation, specify a [1m"transform"[22m option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the [1m"moduleNameMapper"[22m config option.

    You'll find more details and examples of these config options in the docs:
    [36mhttps://jestjs.io/docs/configuration[39m
    For information about custom transformations, see:
    [36mhttps://jestjs.io/docs/code-transformation[39m

    [1m[31mDetails:[39m[22m

    /home/runner/workspace/dist/lib/stubs.js:67
    const _filename = (0, _url.fileURLToPath)(import.meta.url);
                                                     ^^^^

    SyntaxError: Cannot use 'import.meta' outside a module
[2m[22m
[2m    [0m [90m 1 |[39m [90m/** qtests - Main Entry Point */[39m[22m
[2m     [90m 2 |[39m [36mimport[39m { setup } [36mfrom[39m [32m'./lib/setup.js'[39m[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 3 |[39m [36mimport[39m stubs [36mfrom[39m [32m'./lib/stubs.js'[39m[33m;[39m[22m
[2m     [90m   |[39m [31m[1m^[22m[2m[39m[22m
[2m     [90m 4 |[39m [36mimport[39m { testEnv[33m,[39m offlineMode[33m,[39m testHelpers } [36mfrom[39m [32m'./lib/envUtils.js'[39m[33m;[39m[22m
[2m     [90m 5 |[39m [36mimport[39m { mockAPI } [36mfrom[39m [32m'./lib/mockSystem.js'[39m[33m;[39m[22m
[2m     [90m 6 |[39m [36mimport[39m { initializePolyfills[33m,[39m resetPolyfills[33m,[39m getWindow[33m,[39m matchMedia[33m,[39m clipboard[33m,[39m polyfillOrchestrator } [36mfrom[39m [32m'./lib/polyfills/index.js'[39m[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Runtime.createScriptFromCode ([22m[2mnode_modules/jest-runtime/build/index.js[2m:1318:40)[22m[2m[22m
[2m      [2mat Object.require ([22m[2mdist/index.js[2m:3:1)[22m[2m[22m
[2m      [2mat require ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m

[1m[31m  [1m● [22m[1mcreateMockApp — existing behaviour still works after fix › GET route responds correctly[39m[22m

    [1m[31mJest encountered an unexpected token[39m[22m

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see [4mhttps://jestjs.io/docs/ecmascript-modules[24m for how to enable it.
     • If you are trying to use TypeScript, see [4mhttps://jestjs.io/docs/getting-started#using-typescript[24m
     • To have some of your "node_modules" files transformed, you can specify a custom [1m"transformIgnorePatterns"[22m in your config.
     • If you need a custom transformation, specify a [1m"transform"[22m option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the [1m"moduleNameMapper"[22m config option.

    You'll find more details and examples of these config options in the docs:
    [36mhttps://jestjs.io/docs/configuration[39m
    For information about custom transformations, see:
    [36mhttps://jestjs.io/docs/code-transformation[39m

    [1m[31mDetails:[39m[22m

    /home/runner/workspace/dist/lib/stubs.js:67
    const _filename = (0, _url.fileURLToPath)(import.meta.url);
                                                     ^^^^

    SyntaxError: Cannot use 'import.meta' outside a module
[2m[22m
[2m    [0m [90m 1 |[39m [90m/** qtests - Main Entry Point */[39m[22m
[2m     [90m 2 |[39m [36mimport[39m { setup } [36mfrom[39m [32m'./lib/setup.js'[39m[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 3 |[39m [36mimport[39m stubs [36mfrom[39m [32m'./lib/stubs.js'[39m[33m;[39m[22m
[2m     [90m   |[39m [31m[1m^[22m[2m[39m[22m
[2m     [90m 4 |[39m [36mimport[39m { testEnv[33m,[39m offlineMode[33m,[39m testHelpers } [36mfrom[39m [32m'./lib/envUtils.js'[39m[33m;[39m[22m
[2m     [90m 5 |[39m [36mimport[39m { mockAPI } [36mfrom[39m [32m'./lib/mockSystem.js'[39m[33m;[39m[22m
[2m     [90m 6 |[39m [36mimport[39m { initializePolyfills[33m,[39m resetPolyfills[33m,[39m getWindow[33m,[39m matchMedia[33m,[39m clipboard[33m,[39m polyfillOrchestrator } [36mfrom[39m [32m'./lib/polyfills/index.js'[39m[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Runtime.createScriptFromCode ([22m[2mnode_modules/jest-runtime/build/index.js[2m:1318:40)[22m[2m[22m
[2m      [2mat Object.require ([22m[2mdist/index.js[2m:3:1)[22m[2m[22m
[2m      [2mat require ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m

[1m[31m  [1m● [22m[1mcreateMockApp — existing behaviour still works after fix › POST route receives body[39m[22m

    [1m[31mJest encountered an unexpected token[39m[22m

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see [4mhttps://jestjs.io/docs/ecmascript-modules[24m for how to enable it.
     • If you are trying to use TypeScript, see [4mhttps://jestjs.io/docs/getting-started#using-typescript[24m
     • To have some of your "node_modules" files transformed, you can specify a custom [1m"transformIgnorePatterns"[22m in your config.
     • If you need a custom transformation, specify a [1m"transform"[22m option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the [1m"moduleNameMapper"[22m config option.

    You'll find more details and examples of these config options in the docs:
    [36mhttps://jestjs.io/docs/configuration[39m
    For information about custom transformations, see:
    [36mhttps://jestjs.io/docs/code-transformation[39m

    [1m[31mDetails:[39m[22m

    /home/runner/workspace/dist/lib/stubs.js:67
    const _filename = (0, _url.fileURLToPath)(import.meta.url);
                                                     ^^^^

    SyntaxError: Cannot use 'import.meta' outside a module
[2m[22m
[2m    [0m [90m 1 |[39m [90m/** qtests - Main Entry Point */[39m[22m
[2m     [90m 2 |[39m [36mimport[39m { setup } [36mfrom[39m [32m'./lib/setup.js'[39m[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 3 |[39m [36mimport[39m stubs [36mfrom[39m [32m'./lib/stubs.js'[39m[33m;[39m[22m
[2m     [90m   |[39m [31m[1m^[22m[2m[39m[22m
[2m     [90m 4 |[39m [36mimport[39m { testEnv[33m,[39m offlineMode[33m,[39m testHelpers } [36mfrom[39m [32m'./lib/envUtils.js'[39m[33m;[39m[22m
[2m     [90m 5 |[39m [36mimport[39m { mockAPI } [36mfrom[39m [32m'./lib/mockSystem.js'[39m[33m;[39m[22m
[2m     [90m 6 |[39m [36mimport[39m { initializePolyfills[33m,[39m resetPolyfills[33m,[39m getWindow[33m,[39m matchMedia[33m,[39m clipboard[33m,[39m polyfillOrchestrator } [36mfrom[39m [32m'./lib/polyfills/index.js'[39m[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Runtime.createScriptFromCode ([22m[2mnode_modules/jest-runtime/build/index.js[2m:1318:40)[22m[2m[22m
[2m      [2mat Object.require ([22m[2mdist/index.js[2m:3:1)[22m[2m[22m
[2m      [2mat require ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m

[1m[31m  [1m● [22m[1mcreateMockApp — existing behaviour still works after fix › unknown route returns 404[39m[22m

    [1m[31mJest encountered an unexpected token[39m[22m

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see [4mhttps://jestjs.io/docs/ecmascript-modules[24m for how to enable it.
     • If you are trying to use TypeScript, see [4mhttps://jestjs.io/docs/getting-started#using-typescript[24m
     • To have some of your "node_modules" files transformed, you can specify a custom [1m"transformIgnorePatterns"[22m in your config.
     • If you need a custom transformation, specify a [1m"transform"[22m option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the [1m"moduleNameMapper"[22m config option.

    You'll find more details and examples of these config options in the docs:
    [36mhttps://jestjs.io/docs/configuration[39m
    For information about custom transformations, see:
    [36mhttps://jestjs.io/docs/code-transformation[39m

    [1m[31mDetails:[39m[22m

    /home/runner/workspace/dist/lib/stubs.js:67
    const _filename = (0, _url.fileURLToPath)(import.meta.url);
                                                     ^^^^

    SyntaxError: Cannot use 'import.meta' outside a module
[2m[22m
[2m    [0m [90m 1 |[39m [90m/** qtests - Main Entry Point */[39m[22m
[2m     [90m 2 |[39m [36mimport[39m { setup } [36mfrom[39m [32m'./lib/setup.js'[39m[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 3 |[39m [36mimport[39m stubs [36mfrom[39m [32m'./lib/stubs.js'[39m[33m;[39m[22m
[2m     [90m   |[39m [31m[1m^[22m[2m[39m[22m
[2m     [90m 4 |[39m [36mimport[39m { testEnv[33m,[39m offlineMode[33m,[39m testHelpers } [36mfrom[39m [32m'./lib/envUtils.js'[39m[33m;[39m[22m
[2m     [90m 5 |[39m [36mimport[39m { mockAPI } [36mfrom[39m [32m'./lib/mockSystem.js'[39m[33m;[39m[22m
[2m     [90m 6 |[39m [36mimport[39m { initializePolyfills[33m,[39m resetPolyfills[33m,[39m getWindow[33m,[39m matchMedia[33m,[39m clipboard[33m,[39m polyfillOrchestrator } [36mfrom[39m [32m'./lib/polyfills/index.js'[39m[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Runtime.createScriptFromCode ([22m[2mnode_modules/jest-runtime/build/index.js[2m:1318:40)[22m[2m[22m
[2m      [2mat Object.require ([22m[2mdist/index.js[2m:3:1)[22m[2m[22m
[2m      [2mat require ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m

[1m[31m  [1m● [22m[1mcreateMockApp — existing behaviour still works after fix › route handler that throws returns 500[39m[22m

    [1m[31mJest encountered an unexpected token[39m[22m

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see [4mhttps://jestjs.io/docs/ecmascript-modules[24m for how to enable it.
     • If you are trying to use TypeScript, see [4mhttps://jestjs.io/docs/getting-started#using-typescript[24m
     • To have some of your "node_modules" files transformed, you can specify a custom [1m"transformIgnorePatterns"[22m in your config.
     • If you need a custom transformation, specify a [1m"transform"[22m option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the [1m"moduleNameMapper"[22m config option.

    You'll find more details and examples of these config options in the docs:
    [36mhttps://jestjs.io/docs/configuration[39m
    For information about custom transformations, see:
    [36mhttps://jestjs.io/docs/code-transformation[39m

    [1m[31mDetails:[39m[22m

    /home/runner/workspace/dist/lib/stubs.js:67
    const _filename = (0, _url.fileURLToPath)(import.meta.url);
                                                     ^^^^

    SyntaxError: Cannot use 'import.meta' outside a module
[2m[22m
[2m    [0m [90m 1 |[39m [90m/** qtests - Main Entry Point */[39m[22m
[2m     [90m 2 |[39m [36mimport[39m { setup } [36mfrom[39m [32m'./lib/setup.js'[39m[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 3 |[39m [36mimport[39m stubs [36mfrom[39m [32m'./lib/stubs.js'[39m[33m;[39m[22m
[2m     [90m   |[39m [31m[1m^[22m[2m[39m[22m
[2m     [90m 4 |[39m [36mimport[39m { testEnv[33m,[39m offlineMode[33m,[39m testHelpers } [36mfrom[39m [32m'./lib/envUtils.js'[39m[33m;[39m[22m
[2m     [90m 5 |[39m [36mimport[39m { mockAPI } [36mfrom[39m [32m'./lib/mockSystem.js'[39m[33m;[39m[22m
[2m     [90m 6 |[39m [36mimport[39m { initializePolyfills[33m,[39m resetPolyfills[33m,[39m getWindow[33m,[39m matchMedia[33m,[39m clipboard[33m,[39m polyfillOrchestrator } [36mfrom[39m [32m'./lib/polyfills/index.js'[39m[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Runtime.createScriptFromCode ([22m[2mnode_modules/jest-runtime/build/index.js[2m:1318:40)[22m[2m[22m
[2m      [2mat Object.require ([22m[2mdist/index.js[2m:3:1)[22m[2m[22m
[2m      [2mat require ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m

[1m[31m  [1m● [22m[1mcreateMockApp — existing behaviour still works after fix › no middleware runs fine (no regression)[39m[22m

    [1m[31mJest encountered an unexpected token[39m[22m

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see [4mhttps://jestjs.io/docs/ecmascript-modules[24m for how to enable it.
     • If you are trying to use TypeScript, see [4mhttps://jestjs.io/docs/getting-started#using-typescript[24m
     • To have some of your "node_modules" files transformed, you can specify a custom [1m"transformIgnorePatterns"[22m in your config.
     • If you need a custom transformation, specify a [1m"transform"[22m option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the [1m"moduleNameMapper"[22m config option.

    You'll find more details and examples of these config options in the docs:
    [36mhttps://jestjs.io/docs/configuration[39m
    For information about custom transformations, see:
    [36mhttps://jestjs.io/docs/code-transformation[39m

    [1m[31mDetails:[39m[22m

    /home/runner/workspace/dist/lib/stubs.js:67
    const _filename = (0, _url.fileURLToPath)(import.meta.url);
                                                     ^^^^

    SyntaxError: Cannot use 'import.meta' outside a module
[2m[22m
[2m    [0m [90m 1 |[39m [90m/** qtests - Main Entry Point */[39m[22m
[2m     [90m 2 |[39m [36mimport[39m { setup } [36mfrom[39m [32m'./lib/setup.js'[39m[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 3 |[39m [36mimport[39m stubs [36mfrom[39m [32m'./lib/stubs.js'[39m[33m;[39m[22m
[2m     [90m   |[39m [31m[1m^[22m[2m[39m[22m
[2m     [90m 4 |[39m [36mimport[39m { testEnv[33m,[39m offlineMode[33m,[39m testHelpers } [36mfrom[39m [32m'./lib/envUtils.js'[39m[33m;[39m[22m
[2m     [90m 5 |[39m [36mimport[39m { mockAPI } [36mfrom[39m [32m'./lib/mockSystem.js'[39m[33m;[39m[22m
[2m     [90m 6 |[39m [36mimport[39m { initializePolyfills[33m,[39m resetPolyfills[33m,[39m getWindow[33m,[39m matchMedia[33m,[39m clipboard[33m,[39m polyfillOrchestrator } [36mfrom[39m [32m'./lib/polyfills/index.js'[39m[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Runtime.createScriptFromCode ([22m[2mnode_modules/jest-runtime/build/index.js[2m:1318:40)[22m[2m[22m
[2m      [2mat Object.require ([22m[2mdist/index.js[2m:3:1)[22m[2m[22m
[2m      [2mat require ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m

[1m[31m  [1m● [22m[1mcreateMockApp — existing behaviour still works after fix › query string is stripped for route matching[39m[22m

    [1m[31mJest encountered an unexpected token[39m[22m

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see [4mhttps://jestjs.io/docs/ecmascript-modules[24m for how to enable it.
     • If you are trying to use TypeScript, see [4mhttps://jestjs.io/docs/getting-started#using-typescript[24m
     • To have some of your "node_modules" files transformed, you can specify a custom [1m"transformIgnorePatterns"[22m in your config.
     • If you need a custom transformation, specify a [1m"transform"[22m option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the [1m"moduleNameMapper"[22m config option.

    You'll find more details and examples of these config options in the docs:
    [36mhttps://jestjs.io/docs/configuration[39m
    For information about custom transformations, see:
    [36mhttps://jestjs.io/docs/code-transformation[39m

    [1m[31mDetails:[39m[22m

    /home/runner/workspace/dist/lib/stubs.js:67
    const _filename = (0, _url.fileURLToPath)(import.meta.url);
                                                     ^^^^

    SyntaxError: Cannot use 'import.meta' outside a module
[2m[22m
[2m    [0m [90m 1 |[39m [90m/** qtests - Main Entry Point */[39m[22m
[2m     [90m 2 |[39m [36mimport[39m { setup } [36mfrom[39m [32m'./lib/setup.js'[39m[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 3 |[39m [36mimport[39m stubs [36mfrom[39m [32m'./lib/stubs.js'[39m[33m;[39m[22m
[2m     [90m   |[39m [31m[1m^[22m[2m[39m[22m
[2m     [90m 4 |[39m [36mimport[39m { testEnv[33m,[39m offlineMode[33m,[39m testHelpers } [36mfrom[39m [32m'./lib/envUtils.js'[39m[33m;[39m[22m
[2m     [90m 5 |[39m [36mimport[39m { mockAPI } [36mfrom[39m [32m'./lib/mockSystem.js'[39m[33m;[39m[22m
[2m     [90m 6 |[39m [36mimport[39m { initializePolyfills[33m,[39m resetPolyfills[33m,[39m getWindow[33m,[39m matchMedia[33m,[39m clipboard[33m,[39m polyfillOrchestrator } [36mfrom[39m [32m'./lib/polyfills/index.js'[39m[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Runtime.createScriptFromCode ([22m[2mnode_modules/jest-runtime/build/index.js[2m:1318:40)[22m[2m[22m
[2m      [2mat Object.require ([22m[2mdist/index.js[2m:3:1)[22m[2m[22m
[2m      [2mat require ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/createMockApp.test.js[39m[0m[2m:26:24)[22m[2m[22m

```

### Duration: 1052ms

---

## Summary

- Total failed tests: 1
- Failed test files: /home/runner/workspace/tests/integration/createMockApp.test.js
- Generated: 2026-04-17T18:53:50.531Z
