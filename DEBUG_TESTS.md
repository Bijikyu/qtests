# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: /home/runner/workspace/find-js-files.test.ts

### Output:
```
  console.log
    🔍 Searching for JavaScript files...

      at JSFileFinder.run (find-js-files.ts:142:13)

  console.error
    Error reading directory .: TypeError: fs_1.default.readdirSync is not a function
        at JSFileFinder.walkDirectory (/home/runner/workspace/find-js-files.ts:40:26)
        at JSFileFinder.run (/home/runner/workspace/find-js-files.ts:145:10)
        at Object.<anonymous> (/home/runner/workspace/find-js-files.ts:158:8)
        at Runtime._execModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:1266:24)
        at Runtime._loadModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:942:12)
        at Runtime.requireModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:830:12)
        at Runtime.requireModuleOrMock (/home/runner/workspace/node_modules/jest-runtime/build/index.js:962:21)
        at Object.<anonymous> (/home/runner/workspace/find-js-files.test.ts:4:1)
        at Runtime._execModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:1266:24)
        at Runtime._loadModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:942:12)
        at Runtime.requireModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:830:12)
        at jestAdapter (/home/runner/workspace/node_modules/jest-circus/build/runner.js:95:13)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at runTestInternal (/home/runner/workspace/node_modules/jest-runner/build/testWorker.js:275:16)
        at runTest (/home/runner/workspace/node_modules/jest-runner/build/testWorker.js:343:7)
        at Object.worker (/home/runner/workspace/node_modules/jest-runner/build/testWorker.js:497:12)

      53 |       }
      54 |     } catch (error) {
    > 55 |       console.error(`Error reading directory ${dir}:`, error);
         |               ^
      56 |     }
      57 |   }
      58 |

      at JSFileFinder.walkDirectory (find-js-files.ts:55:15)
      at JSFileFinder.run (find-js-files.ts:145:10)
      at Object.<anonymous> (find-js-files.ts:158:8)
      at Object.<anonymous> (find-js-files.test.ts:4:1)

  console.log
    No JavaScript files found.

      at JSFileFinder.run (find-js-files.ts:148:15)

  console.log
    🔍 Searching for JavaScript files...

      at JSFileFinder.run (find-js-files.ts:142:13)

  console.error
    Error reading directory .: TypeError: fs_1.default.readdirSync is not a function
        at JSFileFinder.walkDirectory (/home/runner/workspace/find-js-files.ts:40:26)
        at JSFileFinder.run (/home/runner/workspace/find-js-files.ts:145:10)
        at Object.<anonymous> (/home/runner/workspace/find-js-files.ts:158:8)
        at Runtime._execModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:1266:24)
        at Runtime._loadModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:942:12)
        at Runtime.requireModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:830:12)
        at Runtime.requireModuleOrMock (/home/runner/workspace/node_modules/jest-runtime/build/index.js:962:21)
        at Object.<anonymous> (/home/runner/workspace/find-js-files.test.ts:4:1)
        at Runtime._execModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:1266:24)
        at Runtime._loadModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:942:12)
        at Runtime.requireModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:830:12)
        at jestAdapter (/home/runner/workspace/node_modules/jest-circus/build/runner.js:95:13)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at runTestInternal (/home/runner/workspace/node_modules/jest-runner/build/testWorker.js:275:16)
        at runTest (/home/runner/workspace/node_modules/jest-runner/build/testWorker.js:343:7)
        at Object.worker (/home/runner/workspace/node_modules/jest-runner/build/testWorker.js:497:12)

      53 |       }
      54 |     } catch (error) {
    > 55 |       console.error(`Error reading directory ${dir}:`, error);
         |               ^
      56 |     }
      57 |   }
      58 |

      at JSFileFinder.walkDirectory (find-js-files.ts:55:15)
      at JSFileFinder.run (find-js-files.ts:145:10)
      at Object.<anonymous> (find-js-files.ts:158:8)
      at Object.<anonymous> (find-js-files.test.ts:4:1)

  console.log
    No JavaScript files found.

      at JSFileFinder.run (find-js-files.ts:148:15)

  console.log
    🔍 Searching for JavaScript files...

      at JSFileFinder.run (find-js-files.ts:142:13)

  console.error
    Error reading directory .: TypeError: fs_1.default.readdirSync is not a function
        at JSFileFinder.walkDirectory (/home/runner/workspace/find-js-files.ts:40:26)
        at JSFileFinder.run (/home/runner/workspace/find-js-files.ts:145:10)
        at Object.<anonymous> (/home/runner/workspace/find-js-files.ts:158:8)
        at Runtime._execModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:1266:24)
        at Runtime._loadModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:942:12)
        at Runtime.requireModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:830:12)
        at Runtime.requireModuleOrMock (/home/runner/workspace/node_modules/jest-runtime/build/index.js:962:21)
        at Object.<anonymous> (/home/runner/workspace/find-js-files.test.ts:4:1)
        at Runtime._execModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:1266:24)
        at Runtime._loadModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:942:12)
        at Runtime.requireModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:830:12)
        at jestAdapter (/home/runner/workspace/node_modules/jest-circus/build/runner.js:95:13)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at runTestInternal (/home/runner/workspace/node_modules/jest-runner/build/testWorker.js:275:16)
        at runTest (/home/runner/workspace/node_modules/jest-runner/build/testWorker.js:343:7)
        at Object.worker (/home/runner/workspace/node_modules/jest-runner/build/testWorker.js:497:12)

      53 |       }
      54 |     } catch (error) {
    > 55 |       console.error(`Error reading directory ${dir}:`, error);
         |               ^
      56 |     }
      57 |   }
      58 |

      at JSFileFinder.walkDirectory (find-js-files.ts:55:15)
      at JSFileFinder.run (find-js-files.ts:145:10)
      at Object.<anonymous> (find-js-files.ts:158:8)
      at Object.<anonymous> (find-js-files.test.ts:4:1)

  console.log
    No JavaScript files found.

      at JSFileFinder.run (find-js-files.ts:148:15)

  console.log
    🔍 Searching for JavaScript files...

      at JSFileFinder.run (find-js-files.ts:142:13)

  console.error
    Error reading directory .: TypeError: fs_1.default.readdirSync is not a function
        at JSFileFinder.walkDirectory (/home/runner/workspace/find-js-files.ts:40:26)
        at JSFileFinder.run (/home/runner/workspace/find-js-files.ts:145:10)
        at Object.<anonymous> (/home/runner/workspace/find-js-files.ts:158:8)
        at Runtime._execModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:1266:24)
        at Runtime._loadModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:942:12)
        at Runtime.requireModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:830:12)
        at Runtime.requireModuleOrMock (/home/runner/workspace/node_modules/jest-runtime/build/index.js:962:21)
        at Object.<anonymous> (/home/runner/workspace/find-js-files.test.ts:4:1)
        at Runtime._execModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:1266:24)
        at Runtime._loadModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:942:12)
        at Runtime.requireModule (/home/runner/workspace/node_modules/jest-runtime/build/index.js:830:12)
        at jestAdapter (/home/runner/workspace/node_modules/jest-circus/build/runner.js:95:13)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at runTestInternal (/home/runner/workspace/node_modules/jest-runner/build/testWorker.js:275:16)
        at runTest (/home/runner/workspace/node_modules/jest-runner/build/testWorker.js:343:7)
        at Object.worker (/home/runner/workspace/node_modules/jest-runner/build/testWorker.js:497:12)

      53 |       }
      54 |     } catch (error) {
    > 55 |       console.error(`Error reading directory ${dir}:`, error);
         |               ^
      56 |     }
      57 |   }
      58 |

      at JSFileFinder.walkDirectory (find-js-files.ts:55:15)
      at JSFileFinder.run (find-js-files.ts:145:10)
      at Object.<anonymous> (find-js-files.ts:158:8)
      at Object.<anonymous> (find-js-files.test.ts:4:1)

  console.log
    No JavaScript files found.

      at JSFileFinder.run (find-js-files.ts:148:15)

ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL ./find-js-files.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        19.049 s
Ran all test suites matching /home/runner/workspace/find-js-files.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL ./find-js-files.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        16.293 s
Ran all test suites matching /home/runner/workspace/find-js-files.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/find-js-files.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 50369ms

---

## Failed Test 2: /home/runner/workspace/index.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL ./index.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        15.011 s
Ran all test suites matching /home/runner/workspace/index.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL ./index.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        18.681 s
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

### Duration: 44133ms

---

## Failed Test 3: /home/runner/workspace/lib/coreUtils.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL lib/coreUtils.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        18.158 s
Ran all test suites matching /home/runner/workspace/lib/coreUtils.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL lib/coreUtils.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        19.961 s
Ran all test suites matching /home/runner/workspace/lib/coreUtils.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/lib/coreUtils.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 49546ms

---

## Failed Test 4: /home/runner/workspace/lib/dataUtils.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL lib/dataUtils.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        17.927 s
Ran all test suites matching /home/runner/workspace/lib/dataUtils.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL lib/dataUtils.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        19.199 s
Ran all test suites matching /home/runner/workspace/lib/dataUtils.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/lib/dataUtils.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 47242ms

---

## Failed Test 5: /home/runner/workspace/lib/envUtils.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL lib/envUtils.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        18.197 s
Ran all test suites matching /home/runner/workspace/lib/envUtils.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL lib/envUtils.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        16.058 s
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

### Duration: 45140ms

---

## Failed Test 6: /home/runner/workspace/lib/httpUtils.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL lib/httpUtils.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        17.209 s
Ran all test suites matching /home/runner/workspace/lib/httpUtils.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL lib/httpUtils.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        17.552 s
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

### Duration: 45989ms

---

## Failed Test 7: /home/runner/workspace/lib/logUtils.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL lib/logUtils.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        20.244 s
Ran all test suites matching /home/runner/workspace/lib/logUtils.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL lib/logUtils.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        17.809 s
Ran all test suites matching /home/runner/workspace/lib/logUtils.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/lib/logUtils.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 49602ms

---

## Failed Test 8: /home/runner/workspace/lib/setup.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL lib/setup.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        18.175 s
Ran all test suites matching /home/runner/workspace/lib/setup.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL lib/setup.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        18.828 s
Ran all test suites matching /home/runner/workspace/lib/setup.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/lib/setup.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 47890ms

---

## Failed Test 9: /home/runner/workspace/lib/testGenerator.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL lib/testGenerator.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        16.22 s
Ran all test suites matching /home/runner/workspace/lib/testGenerator.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL lib/testGenerator.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        16.502 s
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

### Duration: 43424ms

---

## Failed Test 10: /home/runner/workspace/lib/testUtils.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL lib/testUtils.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        18.473 s
Ran all test suites matching /home/runner/workspace/lib/testUtils.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL lib/testUtils.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        20.045 s
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

### Duration: 48584ms

---

## Failed Test 11: /home/runner/workspace/setup.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
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

(node:14238) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.192 s
Ran all test suites matching /home/runner/workspace/setup.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
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

(node:14656) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.641 s
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

### Duration: 24772ms

---

## Failed Test 12: /home/runner/workspace/src/rename.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL src/rename.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        17.918 s
Ran all test suites matching /home/runner/workspace/src/rename.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL src/rename.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        17.873 s
Ran all test suites matching /home/runner/workspace/src/rename.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/src/rename.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 47899ms

---

## Failed Test 13: /home/runner/workspace/test/axiosStub.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL test/axiosStub.test.ts
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
      at Object.<anonymous> (test/axiosStub.test.ts:1:1)

(node:14316) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
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
Time:        5.567 s
Ran all test suites matching /home/runner/workspace/test/axiosStub.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL test/axiosStub.test.ts
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
      at Object.<anonymous> (test/axiosStub.test.ts:1:1)

(node:14622) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.718 s
Ran all test suites matching /home/runner/workspace/test/axiosStub.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/axiosStub.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 23049ms

---

## Failed Test 14: /home/runner/workspace/test/comprehensive.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/comprehensive.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        16.388 s
Ran all test suites matching /home/runner/workspace/test/comprehensive.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/comprehensive.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        21.22 s
Ran all test suites matching /home/runner/workspace/test/comprehensive.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/comprehensive.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 48232ms

---

## Failed Test 15: /home/runner/workspace/test/dualModuleGeneration.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/dualModuleGeneration.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

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
Time:        24.969 s
Ran all test suites matching /home/runner/workspace/test/dualModuleGeneration.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/dualModuleGeneration.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        18.934 s
Ran all test suites matching /home/runner/workspace/test/dualModuleGeneration.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/dualModuleGeneration.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 57788ms

---

## Failed Test 16: /home/runner/workspace/test/edgeCases.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/edgeCases.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        24.359 s
Ran all test suites matching /home/runner/workspace/test/edgeCases.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/edgeCases.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        16.913 s
Ran all test suites matching /home/runner/workspace/test/edgeCases.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/edgeCases.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 55846ms

---

## Failed Test 17: /home/runner/workspace/test/httpTest.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/httpTest.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        25.678 s
Ran all test suites matching /home/runner/workspace/test/httpTest.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/httpTest.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        19.343 s
Ran all test suites matching /home/runner/workspace/test/httpTest.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/httpTest.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 56628ms

---

## Failed Test 18: /home/runner/workspace/test/indexExports.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/indexExports.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        26.622 s
Ran all test suites matching /home/runner/workspace/test/indexExports.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/indexExports.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        14.297 s
Ran all test suites matching /home/runner/workspace/test/indexExports.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/indexExports.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 57630ms

---

## Failed Test 19: /home/runner/workspace/test/integration.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/integration.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        21.952 s
Ran all test suites matching /home/runner/workspace/test/integration.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/integration.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        21.18 s
Ran all test suites matching /home/runner/workspace/test/integration.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/integration.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 56495ms

---

## Failed Test 20: /home/runner/workspace/test/logUtils.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/logUtils.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        20.553 s
Ran all test suites matching /home/runner/workspace/test/logUtils.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/logUtils.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        20.71 s
Ran all test suites matching /home/runner/workspace/test/logUtils.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/logUtils.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 54938ms

---

## Failed Test 21: /home/runner/workspace/test/mockAxios.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/mockAxios.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        25.858 s
Ran all test suites matching /home/runner/workspace/test/mockAxios.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/mockAxios.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        18.698 s
Ran all test suites matching /home/runner/workspace/test/mockAxios.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/mockAxios.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 56569ms

---

## Failed Test 22: /home/runner/workspace/test/mockConsole.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL test/mockConsole.test.ts
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
      at Object.<anonymous> (test/mockConsole.test.ts:1:1)

(node:16884) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        7.201 s
Ran all test suites matching /home/runner/workspace/test/mockConsole.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL test/mockConsole.test.ts
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
      at Object.<anonymous> (test/mockConsole.test.ts:1:1)

(node:17515) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.791 s
Ran all test suites matching /home/runner/workspace/test/mockConsole.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/mockConsole.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 26790ms

---

## Failed Test 23: /home/runner/workspace/test/mockModels.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/mockModels.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        20.539 s
Ran all test suites matching /home/runner/workspace/test/mockModels.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/mockModels.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        18.93 s
Ran all test suites matching /home/runner/workspace/test/mockModels.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/mockModels.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 53978ms

---

## Failed Test 24: /home/runner/workspace/test/mockUtils.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/mockUtils.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        19.24 s
Ran all test suites matching /home/runner/workspace/test/mockUtils.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/mockUtils.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        20.472 s
Ran all test suites matching /home/runner/workspace/test/mockUtils.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/mockUtils.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 54416ms

---

## Failed Test 25: /home/runner/workspace/test/moduleSystemIntegration.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/moduleSystemIntegration.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        17.733 s
Ran all test suites matching /home/runner/workspace/test/moduleSystemIntegration.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/moduleSystemIntegration.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        21.732 s
Ran all test suites matching /home/runner/workspace/test/moduleSystemIntegration.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/moduleSystemIntegration.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 53984ms

---

## Failed Test 26: /home/runner/workspace/test/offlineIntegration.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL test/offlineIntegration.test.ts
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
      at Object.<anonymous> (test/offlineIntegration.test.ts:2:1)

(node:17026) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.39 s
Ran all test suites matching /home/runner/workspace/test/offlineIntegration.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL test/offlineIntegration.test.ts
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
      at Object.<anonymous> (test/offlineIntegration.test.ts:2:1)

(node:17513) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        7.887 s
Ran all test suites matching /home/runner/workspace/test/offlineIntegration.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/offlineIntegration.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 27899ms

---

## Failed Test 27: /home/runner/workspace/test/offlineMode.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/offlineMode.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        23.397 s
Ran all test suites matching /home/runner/workspace/test/offlineMode.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/offlineMode.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        19.785 s
Ran all test suites matching /home/runner/workspace/test/offlineMode.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/offlineMode.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 56311ms

---

## Failed Test 28: /home/runner/workspace/test/performance.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/performance.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        25.423 s
Ran all test suites matching /home/runner/workspace/test/performance.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/performance.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        15.618 s
Ran all test suites matching /home/runner/workspace/test/performance.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/performance.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 55710ms

---

## Failed Test 29: /home/runner/workspace/test/qtests-dogfood.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/qtests-dogfood.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        20.964 s
Ran all test suites matching /home/runner/workspace/test/qtests-dogfood.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/qtests-dogfood.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        17.74 s
Ran all test suites matching /home/runner/workspace/test/qtests-dogfood.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/qtests-dogfood.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 53594ms

---

## Failed Test 30: /home/runner/workspace/test/resolveStubPaths.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/resolveStubPaths.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        25.209 s
Ran all test suites matching /home/runner/workspace/test/resolveStubPaths.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/resolveStubPaths.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        19.539 s
Ran all test suites matching /home/runner/workspace/test/resolveStubPaths.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/resolveStubPaths.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 57380ms

---

## Failed Test 31: /home/runner/workspace/test/runTestSuite.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/runTestSuite.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        23.632 s
Ran all test suites matching /home/runner/workspace/test/runTestSuite.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/runTestSuite.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        11.443 s
Ran all test suites matching /home/runner/workspace/test/runTestSuite.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/runTestSuite.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 45680ms

---

## Failed Test 32: /home/runner/workspace/test/safeSerialize.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/safeSerialize.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        18.806 s
Ran all test suites matching /home/runner/workspace/test/safeSerialize.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/safeSerialize.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        13.699 s
Ran all test suites matching /home/runner/workspace/test/safeSerialize.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/safeSerialize.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 42999ms

---

## Failed Test 33: /home/runner/workspace/test/sendEmail.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/sendEmail.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        19.361 s
Ran all test suites matching /home/runner/workspace/test/sendEmail.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/sendEmail.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        12.008 s
Ran all test suites matching /home/runner/workspace/test/sendEmail.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/sendEmail.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 42897ms

---

## Failed Test 34: /home/runner/workspace/test/setupMultiple.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL test/setupMultiple.test.ts
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
      at Object.<anonymous> (test/setupMultiple.test.ts:2:1)

(node:20130) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.811 s
Ran all test suites matching /home/runner/workspace/test/setupMultiple.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL test/setupMultiple.test.ts
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
      at Object.<anonymous> (test/setupMultiple.test.ts:2:1)

(node:20964) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.057 s
Ran all test suites matching /home/runner/workspace/test/setupMultiple.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/setupMultiple.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 22480ms

---

## Failed Test 35: /home/runner/workspace/test/setupResolution.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL test/setupResolution.test.ts
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
      at Object.<anonymous> (test/setupResolution.test.ts:2:1)

(node:20207) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.426 s
Ran all test suites matching /home/runner/workspace/test/setupResolution.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL test/setupResolution.test.ts
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
      at Object.<anonymous> (test/setupResolution.test.ts:2:1)

(node:21108) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        7.63 s
Ran all test suites matching /home/runner/workspace/test/setupResolution.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/setupResolution.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 27972ms

---

## Failed Test 36: /home/runner/workspace/test/stubMethod.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/stubMethod.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        23.096 s
Ran all test suites matching /home/runner/workspace/test/stubMethod.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/stubMethod.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        13.214 s
Ran all test suites matching /home/runner/workspace/test/stubMethod.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/stubMethod.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 45172ms

---

## Failed Test 37: /home/runner/workspace/test/testEnv.test.ts

### Output:
```
  console.log
    createScheduleMock is running with none

      at createScheduleMock (utils/testEnv.ts:270:11)

  console.log
    attachMockSpies is running with function (fn) {
                return Promise.resolve(fn()); // execute and resolve instantly for fast tests
            }

      at attachMockSpies (utils/testEnv.ts:193:11)

  console.log
    attachMockSpies is returning function (fn) {
                return Promise.resolve(fn()); // execute and resolve instantly for fast tests
            }

      at attachMockSpies (utils/testEnv.ts:214:13)

  console.log
    createScheduleMock is returning function (fn) {
                return Promise.resolve(fn()); // execute and resolve instantly for fast tests
            }

      at createScheduleMock (utils/testEnv.ts:277:13)

  console.log
    createQerrorsMock is running with none

      at createQerrorsMock (utils/testEnv.ts:305:11)

  console.log
    attachMockSpies is running with function (...args) {
                return args; // return arguments for test inspection
            }

      at attachMockSpies (utils/testEnv.ts:193:11)

  console.log
    attachMockSpies is returning function (...args) {
                return args; // return arguments for test inspection
            }

      at attachMockSpies (utils/testEnv.ts:214:13)

  console.log
    createQerrorsMock is returning function (...args) {
                return args; // return arguments for test inspection
            }

      at createQerrorsMock (utils/testEnv.ts:312:13)

  console.log
    makeLoggedMock is running with createAxiosMock, () => {
            const mock = {
                /**
                 * Configure mock response for GET requests to a specific URL
                 * @param url - URL to mock
                 * @returns Reply configuration object
                 */
                onGet: function (url) {
                    return createReplyBinder(url); // delegate to reply binder
                },
                /**
                 * Configure mock response for POST requests to a specific URL
                 * @param url - URL to mock
                 * @returns Reply configuration object
                 */
                onPost: function (url) {
                    return createReplyBinder(url); // use common binder for post
                },
                /**
                 * Reset all configured mocks
                 * Essential for preventing test pollution
                 */
                reset: function () {
                    mock._replies = {}; // clear stored replies on adapter
                },
                _replies: {}
            };
            function createReplyBinder(url) {
                return {
                    reply: function (status, data) {
                        mock._replies[url] = { status, data }; // bind response to url
                        return mock; // allow chaining
                    }
                }; // close returned object
            }
            return mock; // returned to helper for spies
        }

      at makeLoggedMock (utils/testEnv.ts:237:11)

  console.log
    attachMockSpies is running with [object Object]

      at attachMockSpies (utils/testEnv.ts:193:11)

  console.log
    attachMockSpies is returning [object Object]

      at attachMockSpies (utils/testEnv.ts:214:13)

  console.log
    makeLoggedMock is returning [object Object]

      at makeLoggedMock (utils/testEnv.ts:242:13)

  console.log
    createScheduleMock is running with none

      at createScheduleMock (utils/testEnv.ts:270:11)

  console.log
    attachMockSpies is running with function (fn) {
                return Promise.resolve(fn()); // execute and resolve instantly for fast tests
            }

      at attachMockSpies (utils/testEnv.ts:193:11)

  console.log
    attachMockSpies is returning function (fn) {
                return Promise.resolve(fn()); // execute and resolve instantly for fast tests
            }

      at attachMockSpies (utils/testEnv.ts:214:13)

  console.log
    createScheduleMock is returning function (fn) {
                return Promise.resolve(fn()); // execute and resolve instantly for fast tests
            }

      at createScheduleMock (utils/testEnv.ts:277:13)

  console.log
    createQerrorsMock is running with none

      at createQerrorsMock (utils/testEnv.ts:305:11)

  console.log
    attachMockSpies is running with function (...args) {
                return args; // return arguments for test inspection
            }

      at attachMockSpies (utils/testEnv.ts:193:11)

  console.log
    attachMockSpies is returning function (...args) {
                return args; // return arguments for test inspection
            }

      at attachMockSpies (utils/testEnv.ts:214:13)

  console.log
    createQerrorsMock is returning function (...args) {
                return args; // return arguments for test inspection
            }

      at createQerrorsMock (utils/testEnv.ts:312:13)

  console.log
    makeLoggedMock is running with createAxiosMock, () => {
            const mock = {
                /**
                 * Configure mock response for GET requests to a specific URL
                 * @param url - URL to mock
                 * @returns Reply configuration object
                 */
                onGet: function (url) {
                    return createReplyBinder(url); // delegate to reply binder
                },
                /**
                 * Configure mock response for POST requests to a specific URL
                 * @param url - URL to mock
                 * @returns Reply configuration object
                 */
                onPost: function (url) {
                    return createReplyBinder(url); // use common binder for post
                },
                /**
                 * Reset all configured mocks
                 * Essential for preventing test pollution
                 */
                reset: function () {
                    mock._replies = {}; // clear stored replies on adapter
                },
                _replies: {}
            };
            function createReplyBinder(url) {
                return {
                    reply: function (status, data) {
                        mock._replies[url] = { status, data }; // bind response to url
                        return mock; // allow chaining
                    }
                }; // close returned object
            }
            return mock; // returned to helper for spies
        }

      at makeLoggedMock (utils/testEnv.ts:237:11)

  console.log
    attachMockSpies is running with [object Object]

      at attachMockSpies (utils/testEnv.ts:193:11)

  console.log
    attachMockSpies is returning [object Object]

      at attachMockSpies (utils/testEnv.ts:214:13)

  console.log
    makeLoggedMock is returning [object Object]

      at makeLoggedMock (utils/testEnv.ts:242:13)

  console.log
    createScheduleMock is running with none

      at createScheduleMock (utils/testEnv.ts:270:11)

  console.log
    attachMockSpies is running with function (fn) {
                return Promise.resolve(fn()); // execute and resolve instantly for fast tests
            }

      at attachMockSpies (utils/testEnv.ts:193:11)

  console.log
    attachMockSpies is returning function (fn) {
                return Promise.resolve(fn()); // execute and resolve instantly for fast tests
            }

      at attachMockSpies (utils/testEnv.ts:214:13)

  console.log
    createScheduleMock is returning function (fn) {
                return Promise.resolve(fn()); // execute and resolve instantly for fast tests
            }

      at createScheduleMock (utils/testEnv.ts:277:13)

  console.log
    createQerrorsMock is running with none

      at createQerrorsMock (utils/testEnv.ts:305:11)

  console.log
    attachMockSpies is running with function (...args) {
                return args; // return arguments for test inspection
            }

      at attachMockSpies (utils/testEnv.ts:193:11)

  console.log
    attachMockSpies is returning function (...args) {
                return args; // return arguments for test inspection
            }

      at attachMockSpies (utils/testEnv.ts:214:13)

  console.log
    createQerrorsMock is returning function (...args) {
                return args; // return arguments for test inspection
            }

      at createQerrorsMock (utils/testEnv.ts:312:13)

  console.log
    makeLoggedMock is running with createAxiosMock, () => {
            const mock = {
                /**
                 * Configure mock response for GET requests to a specific URL
                 * @param url - URL to mock
                 * @returns Reply configuration object
                 */
                onGet: function (url) {
                    return createReplyBinder(url); // delegate to reply binder
                },
                /**
                 * Configure mock response for POST requests to a specific URL
                 * @param url - URL to mock
                 * @returns Reply configuration object
                 */
                onPost: function (url) {
                    return createReplyBinder(url); // use common binder for post
                },
                /**
                 * Reset all configured mocks
                 * Essential for preventing test pollution
                 */
                reset: function () {
                    mock._replies = {}; // clear stored replies on adapter
                },
                _replies: {}
            };
            function createReplyBinder(url) {
                return {
                    reply: function (status, data) {
                        mock._replies[url] = { status, data }; // bind response to url
                        return mock; // allow chaining
                    }
                }; // close returned object
            }
            return mock; // returned to helper for spies
        }

      at makeLoggedMock (utils/testEnv.ts:237:11)

  console.log
    attachMockSpies is running with [object Object]

      at attachMockSpies (utils/testEnv.ts:193:11)

  console.log
    attachMockSpies is returning [object Object]

      at attachMockSpies (utils/testEnv.ts:214:13)

  console.log
    makeLoggedMock is returning [object Object]

      at makeLoggedMock (utils/testEnv.ts:242:13)

  console.log
    createScheduleMock is running with none

      at createScheduleMock (utils/testEnv.ts:270:11)

  console.log
    attachMockSpies is running with function (fn) {
                return Promise.resolve(fn()); // execute and resolve instantly for fast tests
            }

      at attachMockSpies (utils/testEnv.ts:193:11)

  console.log
    attachMockSpies is returning function (fn) {
                return Promise.resolve(fn()); // execute and resolve instantly for fast tests
            }

      at attachMockSpies (utils/testEnv.ts:214:13)

  console.log
    createScheduleMock is returning function (fn) {
                return Promise.resolve(fn()); // execute and resolve instantly for fast tests
            }

      at createScheduleMock (utils/testEnv.ts:277:13)

  console.log
    createQerrorsMock is running with none

      at createQerrorsMock (utils/testEnv.ts:305:11)

  console.log
    attachMockSpies is running with function (...args) {
                return args; // return arguments for test inspection
            }

      at attachMockSpies (utils/testEnv.ts:193:11)

  console.log
    attachMockSpies is returning function (...args) {
                return args; // return arguments for test inspection
            }

      at attachMockSpies (utils/testEnv.ts:214:13)

  console.log
    createQerrorsMock is returning function (...args) {
                return args; // return arguments for test inspection
            }

      at createQerrorsMock (utils/testEnv.ts:312:13)

  console.log
    makeLoggedMock is running with createAxiosMock, () => {
            const mock = {
                /**
                 * Configure mock response for GET requests to a specific URL
                 * @param url - URL to mock
                 * @returns Reply configuration object
                 */
                onGet: function (url) {
                    return createReplyBinder(url); // delegate to reply binder
                },
                /**
                 * Configure mock response for POST requests to a specific URL
                 * @param url - URL to mock
                 * @returns Reply configuration object
                 */
                onPost: function (url) {
                    return createReplyBinder(url); // use common binder for post
                },
                /**
                 * Reset all configured mocks
                 * Essential for preventing test pollution
                 */
                reset: function () {
                    mock._replies = {}; // clear stored replies on adapter
                },
                _replies: {}
            };
            function createReplyBinder(url) {
                return {
                    reply: function (status, data) {
                        mock._replies[url] = { status, data }; // bind response to url
                        return mock; // allow chaining
                    }
                }; // close returned object
            }
            return mock; // returned to helper for spies
        }

      at makeLoggedMock (utils/testEnv.ts:237:11)

  console.log
    attachMockSpies is running with [object Object]

      at attachMockSpies (utils/testEnv.ts:193:11)

  console.log
    attachMockSpies is returning [object Object]

      at attachMockSpies (utils/testEnv.ts:214:13)

  console.log
    makeLoggedMock is returning [object Object]

      at makeLoggedMock (utils/testEnv.ts:242:13)

ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/testEnv.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        18.275 s
Ran all test suites matching /home/runner/workspace/test/testEnv.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/testEnv.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        15.232 s
Ran all test suites matching /home/runner/workspace/test/testEnv.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/testEnv.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 45068ms

---

## Failed Test 38: /home/runner/workspace/test/testGenerator.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/testGenerator.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        20.834 s
Ran all test suites matching /home/runner/workspace/test/testGenerator.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/testGenerator.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        12.663 s
Ran all test suites matching /home/runner/workspace/test/testGenerator.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/testGenerator.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 43763ms

---

## Failed Test 39: /home/runner/workspace/test/testHelpers.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL test/testHelpers.test.ts
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
      at Object.<anonymous> (test/testHelpers.test.ts:2:1)

(node:20202) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.413 s
Ran all test suites matching /home/runner/workspace/test/testHelpers.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL test/testHelpers.test.ts
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
      at Object.<anonymous> (test/testHelpers.test.ts:2:1)

(node:21003) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.086 s
Ran all test suites matching /home/runner/workspace/test/testHelpers.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/testHelpers.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 23872ms

---

## Failed Test 40: /home/runner/workspace/test/testSuite.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/testSuite.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        19.276 s
Ran all test suites matching /home/runner/workspace/test/testSuite.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL test/testSuite.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        12.626 s
Ran all test suites matching /home/runner/workspace/test/testSuite.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/test/testSuite.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 43115ms

---

## Failed Test 41: /home/runner/workspace/tests/integration/demo__src__apiRoutes__delete.test.js

### Output:
```
FAIL tests/integration/demo__src__apiRoutes__delete.test.js
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

    /home/runner/workspace/tests/integration/demo__src__apiRoutes__delete.test.js:2
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:20312) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.819 s
Ran all test suites matching /home/runner/workspace/tests/integration/demo__src__apiRoutes__delete.test.js.
FAIL tests/integration/demo__src__apiRoutes__delete.test.js
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

    /home/runner/workspace/tests/integration/demo__src__apiRoutes__delete.test.js:2
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:20896) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.742 s
Ran all test suites matching /home/runner/workspace/tests/integration/demo__src__apiRoutes__delete.test.js.
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/node_modules/qtests/lib/envUtils' imported from /home/runner/workspace/tests/integration/demo__src__apiRoutes__delete.test.js
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

### Duration: 23033ms

---

## Failed Test 42: /home/runner/workspace/tests/integration/demo__src__apiRoutes__get.test.js

### Output:
```
FAIL tests/integration/demo__src__apiRoutes__get.test.js
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

    /home/runner/workspace/tests/integration/demo__src__apiRoutes__get.test.js:2
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:20341) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.568 s
Ran all test suites matching /home/runner/workspace/tests/integration/demo__src__apiRoutes__get.test.js.
FAIL tests/integration/demo__src__apiRoutes__get.test.js
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

    /home/runner/workspace/tests/integration/demo__src__apiRoutes__get.test.js:2
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:21043) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.381 s
Ran all test suites matching /home/runner/workspace/tests/integration/demo__src__apiRoutes__get.test.js.
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/node_modules/qtests/lib/envUtils' imported from /home/runner/workspace/tests/integration/demo__src__apiRoutes__get.test.js
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

### Duration: 25806ms

---

## Failed Test 43: /home/runner/workspace/tests/integration/demo__src__apiRoutes__patch.test.js

### Output:
```
FAIL tests/integration/demo__src__apiRoutes__patch.test.js
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

    /home/runner/workspace/tests/integration/demo__src__apiRoutes__patch.test.js:2
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:20200) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.284 s
Ran all test suites matching /home/runner/workspace/tests/integration/demo__src__apiRoutes__patch.test.js.
FAIL tests/integration/demo__src__apiRoutes__patch.test.js
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

    /home/runner/workspace/tests/integration/demo__src__apiRoutes__patch.test.js:2
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:20856) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.636 s
Ran all test suites matching /home/runner/workspace/tests/integration/demo__src__apiRoutes__patch.test.js.
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/node_modules/qtests/lib/envUtils' imported from /home/runner/workspace/tests/integration/demo__src__apiRoutes__patch.test.js
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

### Duration: 20976ms

---

## Failed Test 44: /home/runner/workspace/tests/integration/demo__src__apiRoutes__post.test.js

### Output:
```
FAIL tests/integration/demo__src__apiRoutes__post.test.js
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

    /home/runner/workspace/tests/integration/demo__src__apiRoutes__post.test.js:2
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:20104) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.719 s
Ran all test suites matching /home/runner/workspace/tests/integration/demo__src__apiRoutes__post.test.js.
FAIL tests/integration/demo__src__apiRoutes__post.test.js
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

    /home/runner/workspace/tests/integration/demo__src__apiRoutes__post.test.js:2
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:20781) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.764 s
Ran all test suites matching /home/runner/workspace/tests/integration/demo__src__apiRoutes__post.test.js.
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/node_modules/qtests/lib/envUtils' imported from /home/runner/workspace/tests/integration/demo__src__apiRoutes__post.test.js
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

### Duration: 21769ms

---

## Failed Test 45: /home/runner/workspace/tests/integration/demo__src__apiRoutes__put.test.js

### Output:
```
FAIL tests/integration/demo__src__apiRoutes__put.test.js
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

    /home/runner/workspace/tests/integration/demo__src__apiRoutes__put.test.js:2
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:19984) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.74 s
Ran all test suites matching /home/runner/workspace/tests/integration/demo__src__apiRoutes__put.test.js.
FAIL tests/integration/demo__src__apiRoutes__put.test.js
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

    /home/runner/workspace/tests/integration/demo__src__apiRoutes__put.test.js:2
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:20936) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.891 s
Ran all test suites matching /home/runner/workspace/tests/integration/demo__src__apiRoutes__put.test.js.
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/node_modules/qtests/lib/envUtils' imported from /home/runner/workspace/tests/integration/demo__src__apiRoutes__put.test.js
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

### Duration: 24009ms

---

## Failed Test 46: /home/runner/workspace/tests/integration/example.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL tests/integration/example.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        22.664 s
Ran all test suites matching /home/runner/workspace/tests/integration/example.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL tests/integration/example.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        12.553 s
Ran all test suites matching /home/runner/workspace/tests/integration/example.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/tests/integration/example.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 44515ms

---

## Failed Test 47: /home/runner/workspace/tests/integration/example__get.test.js

### Output:
```
FAIL tests/integration/example__get.test.js
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

    /home/runner/workspace/tests/integration/example__get.test.js:2
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:22946) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        9.594 s
Ran all test suites matching /home/runner/workspace/tests/integration/example__get.test.js.
FAIL tests/integration/example__get.test.js
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

    /home/runner/workspace/tests/integration/example__get.test.js:2
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:24094) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        7.717 s
Ran all test suites matching /home/runner/workspace/tests/integration/example__get.test.js.
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/node_modules/qtests/lib/envUtils' imported from /home/runner/workspace/tests/integration/example__get.test.js
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

### Duration: 34036ms

---

## Failed Test 48: /home/runner/workspace/tests/integration/example__get.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL tests/integration/example__get.test.ts
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

    /home/runner/workspace/tests/integration/example__get.test.ts:7
    const uniqueRoute = '/api/status' + (/api/status.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
                                         ^

    SyntaxError: Invalid regular expression flags

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:22731) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        8.133 s
Ran all test suites matching /home/runner/workspace/tests/integration/example__get.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL tests/integration/example__get.test.ts
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

    /home/runner/workspace/tests/integration/example__get.test.ts:7
    const uniqueRoute = '/api/status' + (/api/status.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
                                         ^

    SyntaxError: Invalid regular expression flags

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:23784) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.954 s
Ran all test suites matching /home/runner/workspace/tests/integration/example__get.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/tests/integration/example__get.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 27596ms

---

## Failed Test 49: /home/runner/workspace/tests/integration/example__post.test.js

### Output:
```
FAIL tests/integration/example__post.test.js
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

    /home/runner/workspace/tests/integration/example__post.test.js:2
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:22732) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        10.468 s
Ran all test suites matching /home/runner/workspace/tests/integration/example__post.test.js.
FAIL tests/integration/example__post.test.js
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

    /home/runner/workspace/tests/integration/example__post.test.js:2
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:23878) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.679 s
Ran all test suites matching /home/runner/workspace/tests/integration/example__post.test.js.
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/node_modules/qtests/lib/envUtils' imported from /home/runner/workspace/tests/integration/example__post.test.js
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

### Duration: 27735ms

---

## Failed Test 50: /home/runner/workspace/tests/integration/example__post.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL tests/integration/example__post.test.ts
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

    /home/runner/workspace/tests/integration/example__post.test.ts:7
    const uniqueRoute = '/api/users' + (/api/users.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
                                        ^

    SyntaxError: Invalid regular expression flags

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:23000) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        7.786 s
Ran all test suites matching /home/runner/workspace/tests/integration/example__post.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL tests/integration/example__post.test.ts
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

    /home/runner/workspace/tests/integration/example__post.test.ts:7
    const uniqueRoute = '/api/users' + (/api/users.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
                                        ^

    SyntaxError: Invalid regular expression flags

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:23905) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        8.549 s
Ran all test suites matching /home/runner/workspace/tests/integration/example__post.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/tests/integration/example__post.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 30666ms

---

## Failed Test 51: /home/runner/workspace/tests/integration/example__put.test.js

### Output:
```
FAIL tests/integration/example__put.test.js
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

    /home/runner/workspace/tests/integration/example__put.test.js:2
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:22848) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        8.087 s
Ran all test suites matching /home/runner/workspace/tests/integration/example__put.test.js.
FAIL tests/integration/example__put.test.js
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

    /home/runner/workspace/tests/integration/example__put.test.js:2
    import { httpTest } from 'qtests/lib/envUtils';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1316:40)

(node:23844) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        6.071 s
Ran all test suites matching /home/runner/workspace/tests/integration/example__put.test.js.
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/workspace/node_modules/qtests/lib/envUtils' imported from /home/runner/workspace/tests/integration/example__put.test.js
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

### Duration: 27651ms

---

## Failed Test 52: /home/runner/workspace/tests/integration/example__put.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL tests/integration/example__put.test.ts
  ● Test suite failed to run

    [96mtests/integration/example__put.test.ts[0m:[93m6[0m:[93m52[0m - [91merror[0m[90m TS1109: [0mExpression expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                   ~[0m
    [96mtests/integration/example__put.test.ts[0m:[93m6[0m:[93m55[0m - [91merror[0m[90m TS1005: [0m',' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                      ~[0m
    [96mtests/integration/example__put.test.ts[0m:[93m6[0m:[93m64[0m - [91merror[0m[90m TS1005: [0m',' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                               ~[0m
    [96mtests/integration/example__put.test.ts[0m:[93m6[0m:[93m81[0m - [91merror[0m[90m TS1005: [0m';' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                                                ~[0m

(node:23302) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.717 s
Ran all test suites matching /home/runner/workspace/tests/integration/example__put.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL tests/integration/example__put.test.ts
  ● Test suite failed to run

    [96mtests/integration/example__put.test.ts[0m:[93m6[0m:[93m52[0m - [91merror[0m[90m TS1109: [0mExpression expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                   ~[0m
    [96mtests/integration/example__put.test.ts[0m:[93m6[0m:[93m55[0m - [91merror[0m[90m TS1005: [0m',' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                      ~[0m
    [96mtests/integration/example__put.test.ts[0m:[93m6[0m:[93m64[0m - [91merror[0m[90m TS1005: [0m',' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                               ~[0m
    [96mtests/integration/example__put.test.ts[0m:[93m6[0m:[93m81[0m - [91merror[0m[90m TS1005: [0m';' expected.

    [7m6[0m const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                                                                                ~[0m

(node:23983) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        8.338 s
Ran all test suites matching /home/runner/workspace/tests/integration/example__put.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/tests/integration/example__put.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 30228ms

---

## Failed Test 53: /home/runner/workspace/tests/integration/utils__httpTest__get.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL tests/integration/utils__httpTest__get.test.ts
  ● Test suite failed to run

    [96mtests/integration/utils__httpTest__get.test.ts[0m:[93m6[0m:[93m32[0m - [91merror[0m[90m TS1161: [0mUnterminated regular expression literal.

    [7m6[0m const uniqueRoute = '/test' + (/test.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m

(node:23249) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        9.83 s
Ran all test suites matching /home/runner/workspace/tests/integration/utils__httpTest__get.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
FAIL tests/integration/utils__httpTest__get.test.ts
  ● Test suite failed to run

    [96mtests/integration/utils__httpTest__get.test.ts[0m:[93m6[0m:[93m32[0m - [91merror[0m[90m TS1161: [0mUnterminated regular expression literal.

    [7m6[0m const uniqueRoute = '/test' + (/test.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;
    [7m [0m [91m                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m

(node:23908) [JEST-01] DeprecationWarning: 'currentlyRunningTest' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        8.714 s
Ran all test suites matching /home/runner/workspace/tests/integration/utils__httpTest__get.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/tests/integration/utils__httpTest__get.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 32396ms

---

## Failed Test 54: /home/runner/workspace/utils/email/emailFormatter.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/email/emailFormatter.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        23.895 s
Ran all test suites matching /home/runner/workspace/utils/email/emailFormatter.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/email/emailFormatter.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        11.003 s
Ran all test suites matching /home/runner/workspace/utils/email/emailFormatter.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/email/emailFormatter.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 48389ms

---

## Failed Test 55: /home/runner/workspace/utils/email/emailHistory.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/email/emailHistory.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        24.147 s
Ran all test suites matching /home/runner/workspace/utils/email/emailHistory.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/email/emailHistory.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        12.299 s
Ran all test suites matching /home/runner/workspace/utils/email/emailHistory.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/email/emailHistory.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 48658ms

---

## Failed Test 56: /home/runner/workspace/utils/email/emailSender.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/email/emailSender.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        21.934 s
Ran all test suites matching /home/runner/workspace/utils/email/emailSender.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/email/emailSender.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        10.96 s
Ran all test suites matching /home/runner/workspace/utils/email/emailSender.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/email/emailSender.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 48567ms

---

## Failed Test 57: /home/runner/workspace/utils/email/emailTemplate.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/email/emailTemplate.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        20.663 s
Ran all test suites matching /home/runner/workspace/utils/email/emailTemplate.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/email/emailTemplate.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        11.608 s
Ran all test suites matching /home/runner/workspace/utils/email/emailTemplate.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/email/emailTemplate.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 47343ms

---

## Failed Test 58: /home/runner/workspace/utils/email/emailValidator.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/email/emailValidator.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        23.964 s
Ran all test suites matching /home/runner/workspace/utils/email/emailValidator.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/email/emailValidator.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        13.544 s
Ran all test suites matching /home/runner/workspace/utils/email/emailValidator.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/email/emailValidator.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 48466ms

---

## Failed Test 59: /home/runner/workspace/utils/helpers/consoleMocker.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/helpers/consoleMocker.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        28.829 s
Ran all test suites matching /home/runner/workspace/utils/helpers/consoleMocker.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/helpers/consoleMocker.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        11.565 s
Ran all test suites matching /home/runner/workspace/utils/helpers/consoleMocker.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/helpers/consoleMocker.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 49196ms

---

## Failed Test 60: /home/runner/workspace/utils/helpers/envManager.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/helpers/envManager.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        20.314 s
Ran all test suites matching /home/runner/workspace/utils/helpers/envManager.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/helpers/envManager.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        12.572 s
Ran all test suites matching /home/runner/workspace/utils/helpers/envManager.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/helpers/envManager.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 46664ms

---

## Failed Test 61: /home/runner/workspace/utils/helpers/keyGenerator.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/helpers/keyGenerator.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        23.681 s
Ran all test suites matching /home/runner/workspace/utils/helpers/keyGenerator.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/helpers/keyGenerator.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        10.138 s
Ran all test suites matching /home/runner/workspace/utils/helpers/keyGenerator.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/helpers/keyGenerator.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 49313ms

---

## Failed Test 62: /home/runner/workspace/utils/helpers/moduleReloader.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/helpers/moduleReloader.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        22.667 s
Ran all test suites matching /home/runner/workspace/utils/helpers/moduleReloader.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/helpers/moduleReloader.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        13.508 s
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

### Duration: 47571ms

---

## Failed Test 63: /home/runner/workspace/utils/helpers/qerrorsStub.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/helpers/qerrorsStub.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        19.092 s
Ran all test suites matching /home/runner/workspace/utils/helpers/qerrorsStub.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/helpers/qerrorsStub.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        27.738 s
Ran all test suites matching /home/runner/workspace/utils/helpers/qerrorsStub.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/helpers/qerrorsStub.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 56712ms

---

## Failed Test 64: /home/runner/workspace/utils/helpers/responseMocker.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/helpers/responseMocker.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        19.936 s
Ran all test suites matching /home/runner/workspace/utils/helpers/responseMocker.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/helpers/responseMocker.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        27.522 s
Ran all test suites matching /home/runner/workspace/utils/helpers/responseMocker.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/helpers/responseMocker.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 63319ms

---

## Failed Test 65: /home/runner/workspace/utils/httpTest.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/httpTest.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        16.981 s
Ran all test suites matching /home/runner/workspace/utils/httpTest.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/httpTest.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        31.207 s
Ran all test suites matching /home/runner/workspace/utils/httpTest.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/httpTest.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 61104ms

---

## Failed Test 66: /home/runner/workspace/utils/mockAxios.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/mockAxios.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        19.388 s
Ran all test suites matching /home/runner/workspace/utils/mockAxios.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/mockAxios.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        22.755 s
Ran all test suites matching /home/runner/workspace/utils/mockAxios.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/mockAxios.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 54142ms

---

## Failed Test 67: /home/runner/workspace/utils/mockConsole.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/mockConsole.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        22.325 s
Ran all test suites matching /home/runner/workspace/utils/mockConsole.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/mockConsole.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        27.144 s
Ran all test suites matching /home/runner/workspace/utils/mockConsole.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/mockConsole.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 63209ms

---

## Failed Test 68: /home/runner/workspace/utils/mockModels.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/mockModels.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        21.17 s
Ran all test suites matching /home/runner/workspace/utils/mockModels.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/mockModels.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        25.748 s
Ran all test suites matching /home/runner/workspace/utils/mockModels.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/mockModels.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 60046ms

---

## Failed Test 69: /home/runner/workspace/utils/models/apiKeyModel.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/models/apiKeyModel.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        23.749 s
Ran all test suites matching /home/runner/workspace/utils/models/apiKeyModel.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/models/apiKeyModel.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

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
Time:        24.284 s
Ran all test suites matching /home/runner/workspace/utils/models/apiKeyModel.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/models/apiKeyModel.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 60957ms

---

## Failed Test 70: /home/runner/workspace/utils/models/apiLogModel.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/models/apiLogModel.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        17.85 s
Ran all test suites matching /home/runner/workspace/utils/models/apiLogModel.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/models/apiLogModel.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        21.608 s
Ran all test suites matching /home/runner/workspace/utils/models/apiLogModel.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/models/apiLogModel.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 54970ms

---

## Failed Test 71: /home/runner/workspace/utils/models/baseMockModel.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/models/baseMockModel.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        20.075 s
Ran all test suites matching /home/runner/workspace/utils/models/baseMockModel.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/models/baseMockModel.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        23.566 s
Ran all test suites matching /home/runner/workspace/utils/models/baseMockModel.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/models/baseMockModel.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 56812ms

---

## Failed Test 72: /home/runner/workspace/utils/models/modelFactory.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/models/modelFactory.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        15.697 s
Ran all test suites matching /home/runner/workspace/utils/models/modelFactory.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/models/modelFactory.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        28.659 s
Ran all test suites matching /home/runner/workspace/utils/models/modelFactory.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/models/modelFactory.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 56662ms

---

## Failed Test 73: /home/runner/workspace/utils/offlineMode.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/offlineMode.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        21.836 s
Ran all test suites matching /home/runner/workspace/utils/offlineMode.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/offlineMode.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        28.761 s
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

### Duration: 63247ms

---

## Failed Test 74: /home/runner/workspace/utils/runTestSuite.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/runTestSuite.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        19.466 s
Ran all test suites matching /home/runner/workspace/utils/runTestSuite.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/runTestSuite.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        23.645 s
Ran all test suites matching /home/runner/workspace/utils/runTestSuite.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/runTestSuite.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 57037ms

---

## Failed Test 75: /home/runner/workspace/utils/sendEmail.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/sendEmail.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        31.169 s
Ran all test suites matching /home/runner/workspace/utils/sendEmail.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/sendEmail.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        18.005 s
Ran all test suites matching /home/runner/workspace/utils/sendEmail.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/sendEmail.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 64034ms

---

## Failed Test 76: /home/runner/workspace/utils/stubMethod.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/stubMethod.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        19.221 s
Ran all test suites matching /home/runner/workspace/utils/stubMethod.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/stubMethod.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        25.458 s
Ran all test suites matching /home/runner/workspace/utils/stubMethod.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/stubMethod.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 60354ms

---

## Failed Test 77: /home/runner/workspace/utils/testEnv.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/testEnv.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        18.558 s
Ran all test suites matching /home/runner/workspace/utils/testEnv.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/testEnv.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        20.092 s
Ran all test suites matching /home/runner/workspace/utils/testEnv.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/testEnv.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 55189ms

---

## Failed Test 78: /home/runner/workspace/utils/testHelpers.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/testHelpers.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        19.914 s
Ran all test suites matching /home/runner/workspace/utils/testHelpers.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/testHelpers.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        25.234 s
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

### Duration: 60672ms

---

## Failed Test 79: /home/runner/workspace/utils/testSuite.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/testSuite.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        16.073 s
Ran all test suites matching /home/runner/workspace/utils/testSuite.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/testSuite.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        11.575 s
Ran all test suites matching /home/runner/workspace/utils/testSuite.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/testSuite.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 35671ms

---

## Failed Test 80: /home/runner/workspace/utils/testing/assertionHelper.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/testing/assertionHelper.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        12.349 s
Ran all test suites matching /home/runner/workspace/utils/testing/assertionHelper.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/testing/assertionHelper.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        11.197 s
Ran all test suites matching /home/runner/workspace/utils/testing/assertionHelper.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/testing/assertionHelper.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 31551ms

---

## Failed Test 81: /home/runner/workspace/utils/testing/databaseTestHelper.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/testing/databaseTestHelper.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        13.95 s
Ran all test suites matching /home/runner/workspace/utils/testing/databaseTestHelper.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/testing/databaseTestHelper.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        12.175 s
Ran all test suites matching /home/runner/workspace/utils/testing/databaseTestHelper.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/testing/databaseTestHelper.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 35180ms

---

## Failed Test 82: /home/runner/workspace/utils/testing/mockManager.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/testing/mockManager.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        15.909 s
Ran all test suites matching /home/runner/workspace/utils/testing/mockManager.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/testing/mockManager.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        11.191 s
Ran all test suites matching /home/runner/workspace/utils/testing/mockManager.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/testing/mockManager.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 34810ms

---

## Failed Test 83: /home/runner/workspace/utils/testing/performanceTestHelper.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/testing/performanceTestHelper.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        12.657 s
Ran all test suites matching /home/runner/workspace/utils/testing/performanceTestHelper.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/testing/performanceTestHelper.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        12.56 s
Ran all test suites matching /home/runner/workspace/utils/testing/performanceTestHelper.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/testing/performanceTestHelper.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 33861ms

---

## Failed Test 84: /home/runner/workspace/utils/testing/testDataFactory.test.ts

### Output:
```
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/testing/testDataFactory.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        14.523 s
Ran all test suites matching /home/runner/workspace/utils/testing/testDataFactory.test.ts.
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
ts-jest[config] (WARN) 
    The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/workspace/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
  
node:internal/modules/esm/utils:270
    throw new ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG();
          ^

TypeError: A dynamic import callback was invoked without --experimental-vm-modules
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:270:11)
    at /home/runner/workspace/test/testSetup.js:3:21
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG'
}

Node.js v20.19.3
FAIL utils/testing/testDataFactory.test.ts
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        10.242 s
Ran all test suites matching /home/runner/workspace/utils/testing/testDataFactory.test.ts.
node:internal/modules/esm/get_format:189
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
        ^

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/workspace/utils/testing/testDataFactory.test.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:232:36)
    at defaultLoad (node:internal/modules/esm/load:145:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:477:45)
    at async ModuleJob._link (node:internal/modules/esm/module_job:110:19) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.19.3

```

### Duration: 34427ms

---

## Summary

- Total failed tests: 84
- Failed test files: /home/runner/workspace/find-js-files.test.ts, /home/runner/workspace/index.test.ts, /home/runner/workspace/lib/coreUtils.test.ts, /home/runner/workspace/lib/dataUtils.test.ts, /home/runner/workspace/lib/envUtils.test.ts, /home/runner/workspace/lib/httpUtils.test.ts, /home/runner/workspace/lib/logUtils.test.ts, /home/runner/workspace/lib/setup.test.ts, /home/runner/workspace/lib/testGenerator.test.ts, /home/runner/workspace/lib/testUtils.test.ts, /home/runner/workspace/setup.test.ts, /home/runner/workspace/src/rename.test.ts, /home/runner/workspace/test/axiosStub.test.ts, /home/runner/workspace/test/comprehensive.test.ts, /home/runner/workspace/test/dualModuleGeneration.test.ts, /home/runner/workspace/test/edgeCases.test.ts, /home/runner/workspace/test/httpTest.test.ts, /home/runner/workspace/test/indexExports.test.ts, /home/runner/workspace/test/integration.test.ts, /home/runner/workspace/test/logUtils.test.ts, /home/runner/workspace/test/mockAxios.test.ts, /home/runner/workspace/test/mockConsole.test.ts, /home/runner/workspace/test/mockModels.test.ts, /home/runner/workspace/test/mockUtils.test.ts, /home/runner/workspace/test/moduleSystemIntegration.test.ts, /home/runner/workspace/test/offlineIntegration.test.ts, /home/runner/workspace/test/offlineMode.test.ts, /home/runner/workspace/test/performance.test.ts, /home/runner/workspace/test/qtests-dogfood.test.ts, /home/runner/workspace/test/resolveStubPaths.test.ts, /home/runner/workspace/test/runTestSuite.test.ts, /home/runner/workspace/test/safeSerialize.test.ts, /home/runner/workspace/test/sendEmail.test.ts, /home/runner/workspace/test/setupMultiple.test.ts, /home/runner/workspace/test/setupResolution.test.ts, /home/runner/workspace/test/stubMethod.test.ts, /home/runner/workspace/test/testEnv.test.ts, /home/runner/workspace/test/testGenerator.test.ts, /home/runner/workspace/test/testHelpers.test.ts, /home/runner/workspace/test/testSuite.test.ts, /home/runner/workspace/tests/integration/demo__src__apiRoutes__delete.test.js, /home/runner/workspace/tests/integration/demo__src__apiRoutes__get.test.js, /home/runner/workspace/tests/integration/demo__src__apiRoutes__patch.test.js, /home/runner/workspace/tests/integration/demo__src__apiRoutes__post.test.js, /home/runner/workspace/tests/integration/demo__src__apiRoutes__put.test.js, /home/runner/workspace/tests/integration/example.test.ts, /home/runner/workspace/tests/integration/example__get.test.js, /home/runner/workspace/tests/integration/example__get.test.ts, /home/runner/workspace/tests/integration/example__post.test.js, /home/runner/workspace/tests/integration/example__post.test.ts, /home/runner/workspace/tests/integration/example__put.test.js, /home/runner/workspace/tests/integration/example__put.test.ts, /home/runner/workspace/tests/integration/utils__httpTest__get.test.ts, /home/runner/workspace/utils/email/emailFormatter.test.ts, /home/runner/workspace/utils/email/emailHistory.test.ts, /home/runner/workspace/utils/email/emailSender.test.ts, /home/runner/workspace/utils/email/emailTemplate.test.ts, /home/runner/workspace/utils/email/emailValidator.test.ts, /home/runner/workspace/utils/helpers/consoleMocker.test.ts, /home/runner/workspace/utils/helpers/envManager.test.ts, /home/runner/workspace/utils/helpers/keyGenerator.test.ts, /home/runner/workspace/utils/helpers/moduleReloader.test.ts, /home/runner/workspace/utils/helpers/qerrorsStub.test.ts, /home/runner/workspace/utils/helpers/responseMocker.test.ts, /home/runner/workspace/utils/httpTest.test.ts, /home/runner/workspace/utils/mockAxios.test.ts, /home/runner/workspace/utils/mockConsole.test.ts, /home/runner/workspace/utils/mockModels.test.ts, /home/runner/workspace/utils/models/apiKeyModel.test.ts, /home/runner/workspace/utils/models/apiLogModel.test.ts, /home/runner/workspace/utils/models/baseMockModel.test.ts, /home/runner/workspace/utils/models/modelFactory.test.ts, /home/runner/workspace/utils/offlineMode.test.ts, /home/runner/workspace/utils/runTestSuite.test.ts, /home/runner/workspace/utils/sendEmail.test.ts, /home/runner/workspace/utils/stubMethod.test.ts, /home/runner/workspace/utils/testEnv.test.ts, /home/runner/workspace/utils/testHelpers.test.ts, /home/runner/workspace/utils/testSuite.test.ts, /home/runner/workspace/utils/testing/assertionHelper.test.ts, /home/runner/workspace/utils/testing/databaseTestHelper.test.ts, /home/runner/workspace/utils/testing/mockManager.test.ts, /home/runner/workspace/utils/testing/performanceTestHelper.test.ts, /home/runner/workspace/utils/testing/testDataFactory.test.ts
- Generated: 2025-09-01T09:44:52.504Z
