# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: demo/src/apiRoutes.test.js

### Output:
```
No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /home/runner/workspace
  88 files checked.
  testMatch: /home/runner/workspace/test/**/*.test.js - 24 matches
  testPathIgnorePatterns: /node_modules/, /demo/, /examples/, /docs/, /stubs/, /utils/axiosStub.js, /utils/winstonStub.js - 68 matches
  testRegex:  - 0 matches
Pattern: demo/src/apiRoutes.test.js - 0 matches
npm warn exec The following package was not found and will be installed: mocha@11.7.1
(node:852) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/runner/workspace/demo/src/apiRoutes.js is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /home/runner/workspace/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)

 Exception during run: Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'express' imported from /home/runner/workspace/demo/src/apiRoutes.js
    at packageResolve (node:internal/modules/esm/resolve:873:9)
    at moduleResolve (node:internal/modules/esm/resolve:946:18)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND'
}
(node:864) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/runner/workspace/demo/src/apiRoutes.test.js is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /home/runner/workspace/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
node:internal/modules/esm/resolve:873
  throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), null);
        ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'express' imported from /home/runner/workspace/demo/src/apiRoutes.js
    at packageResolve (node:internal/modules/esm/resolve:873:9)
    at moduleResolve (node:internal/modules/esm/resolve:946:18)
    at defaultResolve (node:internal/modules/esm/resolve:1188:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:642:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:591:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:574:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:236:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:130:49) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v20.19.3

```

### Duration: 8724ms

---

## Failed Test 2: demo/tests/apiRoutes__delete.test.ts

### Output:
```
No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /home/runner/workspace
  88 files checked.
  testMatch: /home/runner/workspace/test/**/*.test.js - 24 matches
  testPathIgnorePatterns: /node_modules/, /demo/, /examples/, /docs/, /stubs/, /utils/axiosStub.js, /utils/winstonStub.js - 68 matches
  testRegex:  - 0 matches
Pattern: demo/tests/apiRoutes__delete.test.ts - 0 matches

 Exception during run: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/apiRoutes__delete.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/apiRoutes__delete.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 5304ms

---

## Failed Test 3: demo/tests/apiRoutes__get.test.ts

### Output:
```
No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /home/runner/workspace
  88 files checked.
  testMatch: /home/runner/workspace/test/**/*.test.js - 24 matches
  testPathIgnorePatterns: /node_modules/, /demo/, /examples/, /docs/, /stubs/, /utils/axiosStub.js, /utils/winstonStub.js - 68 matches
  testRegex:  - 0 matches
Pattern: demo/tests/apiRoutes__get.test.ts - 0 matches

 Exception during run: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/apiRoutes__get.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/apiRoutes__get.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 3789ms

---

## Failed Test 4: demo/tests/apiRoutes__patch.test.ts

### Output:
```
No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /home/runner/workspace
  88 files checked.
  testMatch: /home/runner/workspace/test/**/*.test.js - 24 matches
  testPathIgnorePatterns: /node_modules/, /demo/, /examples/, /docs/, /stubs/, /utils/axiosStub.js, /utils/winstonStub.js - 68 matches
  testRegex:  - 0 matches
Pattern: demo/tests/apiRoutes__patch.test.ts - 0 matches

 Exception during run: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/apiRoutes__patch.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/apiRoutes__patch.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 3238ms

---

## Failed Test 5: demo/tests/apiRoutes__post.test.ts

### Output:
```
No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /home/runner/workspace
  88 files checked.
  testMatch: /home/runner/workspace/test/**/*.test.js - 24 matches
  testPathIgnorePatterns: /node_modules/, /demo/, /examples/, /docs/, /stubs/, /utils/axiosStub.js, /utils/winstonStub.js - 68 matches
  testRegex:  - 0 matches
Pattern: demo/tests/apiRoutes__post.test.ts - 0 matches

 Exception during run: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/apiRoutes__post.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/apiRoutes__post.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 3297ms

---

## Failed Test 6: demo/tests/apiRoutes__put.test.ts

### Output:
```
No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /home/runner/workspace
  88 files checked.
  testMatch: /home/runner/workspace/test/**/*.test.js - 24 matches
  testPathIgnorePatterns: /node_modules/, /demo/, /examples/, /docs/, /stubs/, /utils/axiosStub.js, /utils/winstonStub.js - 68 matches
  testRegex:  - 0 matches
Pattern: demo/tests/apiRoutes__put.test.ts - 0 matches

 Exception during run: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/apiRoutes__put.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/apiRoutes__put.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 3190ms

---

## Failed Test 7: demo/tests/integration/apiRoutes__delete.test.ts

### Output:
```
No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /home/runner/workspace
  88 files checked.
  testMatch: /home/runner/workspace/test/**/*.test.js - 24 matches
  testPathIgnorePatterns: /node_modules/, /demo/, /examples/, /docs/, /stubs/, /utils/axiosStub.js, /utils/winstonStub.js - 68 matches
  testRegex:  - 0 matches
Pattern: demo/tests/integration/apiRoutes__delete.test.ts - 0 matches

 Exception during run: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/integration/apiRoutes__delete.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/integration/apiRoutes__delete.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 3145ms

---

## Failed Test 8: demo/tests/integration/apiRoutes__get.test.ts

### Output:
```
No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /home/runner/workspace
  88 files checked.
  testMatch: /home/runner/workspace/test/**/*.test.js - 24 matches
  testPathIgnorePatterns: /node_modules/, /demo/, /examples/, /docs/, /stubs/, /utils/axiosStub.js, /utils/winstonStub.js - 68 matches
  testRegex:  - 0 matches
Pattern: demo/tests/integration/apiRoutes__get.test.ts - 0 matches

 Exception during run: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/integration/apiRoutes__get.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/integration/apiRoutes__get.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 2983ms

---

## Failed Test 9: demo/tests/integration/apiRoutes__patch.test.ts

### Output:
```
No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /home/runner/workspace
  88 files checked.
  testMatch: /home/runner/workspace/test/**/*.test.js - 24 matches
  testPathIgnorePatterns: /node_modules/, /demo/, /examples/, /docs/, /stubs/, /utils/axiosStub.js, /utils/winstonStub.js - 68 matches
  testRegex:  - 0 matches
Pattern: demo/tests/integration/apiRoutes__patch.test.ts - 0 matches

 Exception during run: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/integration/apiRoutes__patch.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/integration/apiRoutes__patch.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 3005ms

---

## Failed Test 10: demo/tests/integration/apiRoutes__post.test.ts

### Output:
```
No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /home/runner/workspace
  88 files checked.
  testMatch: /home/runner/workspace/test/**/*.test.js - 24 matches
  testPathIgnorePatterns: /node_modules/, /demo/, /examples/, /docs/, /stubs/, /utils/axiosStub.js, /utils/winstonStub.js - 68 matches
  testRegex:  - 0 matches
Pattern: demo/tests/integration/apiRoutes__post.test.ts - 0 matches

 Exception during run: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/integration/apiRoutes__post.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/integration/apiRoutes__post.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 2979ms

---

## Failed Test 11: demo/tests/integration/apiRoutes__put.test.ts

### Output:
```
No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /home/runner/workspace
  88 files checked.
  testMatch: /home/runner/workspace/test/**/*.test.js - 24 matches
  testPathIgnorePatterns: /node_modules/, /demo/, /examples/, /docs/, /stubs/, /utils/axiosStub.js, /utils/winstonStub.js - 68 matches
  testRegex:  - 0 matches
Pattern: demo/tests/integration/apiRoutes__put.test.ts - 0 matches

 Exception during run: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/integration/apiRoutes__put.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/demo/tests/integration/apiRoutes__put.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 3381ms

---

## Summary

- Total failed tests: 11
- Failed test files: demo/src/apiRoutes.test.js, demo/tests/apiRoutes__delete.test.ts, demo/tests/apiRoutes__get.test.ts, demo/tests/apiRoutes__patch.test.ts, demo/tests/apiRoutes__post.test.ts, demo/tests/apiRoutes__put.test.ts, demo/tests/integration/apiRoutes__delete.test.ts, demo/tests/integration/apiRoutes__get.test.ts, demo/tests/integration/apiRoutes__patch.test.ts, demo/tests/integration/apiRoutes__post.test.ts, demo/tests/integration/apiRoutes__put.test.ts
- Generated: 2025-08-17T04:08:44.026Z
