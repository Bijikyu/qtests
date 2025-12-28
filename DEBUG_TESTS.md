# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: /home/runner/workspace/tests/integration/resolveStubPaths.test.ts

### Output:
```
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/config/jest-setup.ts:43
        qerrors = (await Promise.resolve().then(() => __importStar(require('../dist/lib/qerrorsFallback.js')))).default;
                         ^^^^^^^

    SyntaxError: Unexpected identifier 'Promise'

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1505:14)

```

### Duration: 0ms

---

## Failed Test 2: /home/runner/workspace/tests/integration/demo__server__app__get.test.js

### Output:
```
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/config/jest-setup.ts:43
        qerrors = (await Promise.resolve().then(() => __importStar(require('../dist/lib/qerrorsFallback.js')))).default;
                         ^^^^^^^

    SyntaxError: Unexpected identifier 'Promise'

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1505:14)

```

### Duration: 0ms

---

## Failed Test 3: /home/runner/workspace/tests/integration/demo__server__routes__hello__get.test.js

### Output:
```
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /home/runner/workspace/config/jest-setup.ts:43
        qerrors = (await Promise.resolve().then(() => __importStar(require('../dist/lib/qerrorsFallback.js')))).default;
                         ^^^^^^^

    SyntaxError: Unexpected identifier 'Promise'

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1505:14)

```

### Duration: 0ms

---

## Summary

- Total failed tests: 3
- Failed test files: /home/runner/workspace/tests/integration/resolveStubPaths.test.ts, /home/runner/workspace/tests/integration/demo__server__app__get.test.js, /home/runner/workspace/tests/integration/demo__server__routes__hello__get.test.js
- Generated: 2025-12-27T22:32:33.842Z
