# Test Failure Analysis

**Creation Time:** 2025-08-19T14:34:00.265Z
**Pacific Time:** Tuesday, August 19, 2025 at 07:34:00 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: test/dualModuleGeneration.test.js

### Output:
```
FAIL test/dualModuleGeneration.test.js
  ● Console

    console.log
      setup is running with none

      at Object.setup (lib/setup.js:58:11)

    console.log
      setup has run resulting in module resolution modification

      at Object.setup (lib/setup.js:62:13)

  ● qtests Dual Module System Test Generation › Test Generation for Different Module Systems › should generate CommonJS-style tests for CommonJS projects

    expect(received).toContain(expected) // indexOf

    Expected substring: "describe('mathUtils.js'"
    Received string:    "// Lightweight unit test for mathUtils.js - no complex operations·
    describe('mathUtils.js basic exports', () => {
      test('module loads without errors', () => {
        // Delayed module loading prevents hanging in parallel execution
        expect(() => require('./mathUtils.js')).not.toThrow();
        const mod = require('./mathUtils.js');
        expect(mod).toBeDefined();
        expect(typeof mod).toBe('object');
      });
    });
    "

      228 |       expect(testContent).toContain('const mod = require(');
      229 |       expect(testContent).not.toContain('import');
    > 230 |       expect(testContent).toContain("describe('mathUtils.js'");
          |                           ^
      231 |       expect(testContent).toContain("test('add works'");
      232 |     });
      233 |

      at Object.toContain (test/dualModuleGeneration.test.js:230:27)

  ● qtests Dual Module System Test Generation › Test Generation for Different Module Systems › should generate ES module-style tests for ES module projects

    expect(received).toContain(expected) // indexOf

    Expected substring: "import * as mod from"
    Received string:    "// Lightweight unit test for dataProcessor.js - no complex operations·
    describe('dataProcessor.js basic exports', () => {
      test('module loads without errors', () => {
        // Delayed module loading prevents hanging in parallel execution
        expect(() => import('./dataProcessor.js')).not.toThrow();
      });
    });
    "

      248 |       
      249 |       // Should use import syntax
    > 250 |       expect(testContent).toContain('import * as mod from');
          |                           ^
      251 |       expect(testContent).not.toContain('require(');
      252 |       expect(testContent).toContain("describe('dataProcessor.js'");
      253 |       expect(testContent).toContain("test('process works'");

      at Object.toContain (test/dualModuleGeneration.test.js:250:27)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 16 passed, 18 total
Snapshots:   0 total
Time:        5.605 s, estimated 14 s
Ran all test suites matching test/dualModuleGeneration.test.js.

```

### Duration: 10300ms

---

## Failed Test 2: test/moduleSystemIntegration.test.js

### Output:
```
FAIL test/moduleSystemIntegration.test.js
  ● Console

    console.log
      setup is running with none

      at Object.setup (lib/setup.js:58:11)

    console.log
      setup has run resulting in module resolution modification

      at Object.setup (lib/setup.js:62:13)

    console.log
      Scanning project for test generation...

      at TestGenerator.log [as generate] (lib/testGenerator.js:931:13)

    console.log
      Found 2 source files and 0 existing tests

      at TestGenerator.log [as generate] (lib/testGenerator.js:937:13)

    console.log
      ✅ Generated 2 new test files:

      at TestGenerator.log [as generate] (lib/testGenerator.js:947:15)

    console.log
        📦 Unit → src/mathUtils.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → src/stringUtils.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
      Scanning project for test generation...

      at TestGenerator.log [as generate] (lib/testGenerator.js:931:13)

    console.log
      Found 3 source files and 0 existing tests

      at TestGenerator.log [as generate] (lib/testGenerator.js:937:13)

    console.log
      ✅ Generated 3 new test files:

      at TestGenerator.log [as generate] (lib/testGenerator.js:947:15)

    console.log
        📦 Unit → lib/helpers.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → lib/manager.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → lib/utils.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
      Scanning project for test generation...

      at TestGenerator.log [as generate] (lib/testGenerator.js:931:13)

    console.log
      Found 2 source files and 0 existing tests

      at TestGenerator.log [as generate] (lib/testGenerator.js:937:13)

    console.log
      ✅ Generated 2 new test files:

      at TestGenerator.log [as generate] (lib/testGenerator.js:947:15)

    console.log
        📦 Unit → src/dataProcessor.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → src/validator.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
      Scanning project for test generation...

      at TestGenerator.log [as generate] (lib/testGenerator.js:931:13)

    console.log
      Found 3 source files and 0 existing tests

      at TestGenerator.log [as generate] (lib/testGenerator.js:937:13)

    console.log
      ✅ Generated 3 new test files:

      at TestGenerator.log [as generate] (lib/testGenerator.js:947:15)

    console.log
        📦 Unit → src/cjsFile.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → src/esFile1.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → src/esFile2.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
      Scanning project for test generation...

      at TestGenerator.log [as generate] (lib/testGenerator.js:931:13)

    console.log
      Found 1 source files and 0 existing tests

      at TestGenerator.log [as generate] (lib/testGenerator.js:937:13)

    console.log
      ✅ Generated 3 new test files:

      at TestGenerator.log [as generate] (lib/testGenerator.js:947:15)

    console.log
        📦 Unit → routes/users.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        🌐 API → tests/integration/routes__users__get.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        🌐 API → tests/integration/routes__users__post.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
      Scanning project for test generation...

      at TestGenerator.log [as generate] (lib/testGenerator.js:931:13)

    console.log
      Found 50 source files and 0 existing tests

      at TestGenerator.log [as generate] (lib/testGenerator.js:937:13)

    console.log
      ✅ Generated 50 new test files:

      at TestGenerator.log [as generate] (lib/testGenerator.js:947:15)

    console.log
        📦 Unit → large-project/module0/file0.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module0/file1.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module0/file2.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module0/file3.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module0/file4.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module1/file0.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module1/file1.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module1/file2.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module1/file3.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module1/file4.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module2/file0.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module2/file1.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module2/file2.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module2/file3.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module2/file4.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module3/file0.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module3/file1.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module3/file2.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module3/file3.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module3/file4.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module4/file0.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module4/file1.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module4/file2.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module4/file3.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module4/file4.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module5/file0.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module5/file1.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module5/file2.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module5/file3.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module5/file4.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module6/file0.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module6/file1.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module6/file2.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module6/file3.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module6/file4.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module7/file0.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module7/file1.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module7/file2.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module7/file3.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module7/file4.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module8/file0.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module8/file1.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module8/file2.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module8/file3.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module8/file4.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module9/file0.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module9/file1.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module9/file2.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module9/file3.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
        📦 Unit → large-project/module9/file4.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

    console.log
      Scanning project for test generation...

      at TestGenerator.log [as generate] (lib/testGenerator.js:931:13)

    console.log
      Found 1 source files and 0 existing tests

      at TestGenerator.log [as generate] (lib/testGenerator.js:937:13)

    console.log
      ✅ Generated 1 new test files:

      at TestGenerator.log [as generate] (lib/testGenerator.js:947:15)

    console.log
        📦 Unit → problematic/broken.test.js

      at log (lib/testGenerator.js:950:17)
          at Array.forEach (<anonymous>)

  ● qtests Module System Integration Tests › CommonJS Project Integration › should detect CommonJS project and generate appropriate tests

    expect(received).toContain(expected) // indexOf

    Expected substring: "test('add works'"
    Received string:    "// Lightweight unit test for mathUtils.js - no complex operations·
    // Lightweight mock setup - basic stubs only
    jest.mock('fs', () => ({
      __esModule: true,
      default: jest.fn(() => 'mock-fs'),
      // Lightweight mocks prevent hanging
    }));·
    describe('mathUtils.js basic exports', () => {
      test('module loads without errors', () => {
        // Delayed module loading prevents hanging in parallel execution
        expect(() => require('./mathUtils.js')).not.toThrow();
        const mod = require('./mathUtils.js');
        expect(mod).toBeDefined();
        expect(typeof mod).toBe('object');
      });
    });
    "

      124 |         expect(testContent).toContain('const mod = require(');
      125 |         expect(testContent).not.toContain('import');
    > 126 |         expect(testContent).toContain("test('add works'");
          |                             ^
      127 |         expect(testContent).toContain("test('multiply works'");
      128 |         expect(testContent).toContain("test('Calculator works'");
      129 |       }

      at Object.toContain (test/moduleSystemIntegration.test.js:126:29)

  ● qtests Module System Integration Tests › ES Module Project Integration › should detect ES module project and generate appropriate tests

    expect(received).toContain(expected) // indexOf

    Expected substring: "import * as mod from"
    Received string:    "// Lightweight unit test for dataProcessor.js - no complex operations·
    // Lightweight mock setup - basic stubs only
    jest.mock('fs', () => ({
      __esModule: true,
      default: jest.fn(() => 'mock-fs'),
      // Lightweight mocks prevent hanging
    }));·
    describe('dataProcessor.js basic exports', () => {
      test('module loads without errors', () => {
        // Delayed module loading prevents hanging in parallel execution
        expect(() => import('./dataProcessor.js')).not.toThrow();
      });
    });
    "

      252 |       if (fs.existsSync(dataProcessorTestPath)) {
      253 |         const testContent = fs.readFileSync(dataProcessorTestPath, 'utf8');
    > 254 |         expect(testContent).toContain('import * as mod from');
          |                             ^
      255 |         expect(testContent).not.toContain('require(');
      256 |         expect(testContent).toContain("test('processData works'");
      257 |         expect(testContent).toContain("test('saveData works'");

      at Object.toContain (test/moduleSystemIntegration.test.js:254:29)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 6 passed, 8 total
Snapshots:   0 total
Time:        7.502 s, estimated 24 s
Ran all test suites matching test/moduleSystemIntegration.test.js.

```

### Duration: 13380ms

---

## Failed Test 3: test/offlineMode.test.js

### Output:
```
FAIL test/offlineMode.test.js
  ● Console

    console.log
      setup is running with none

      at Object.setup (lib/setup.js:58:11)

    console.log
      setup has run resulting in module resolution modification

      at Object.setup (lib/setup.js:62:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      getEnvironmentState is running with none

      at log (utils/offlineMode.js:267:11)

    console.log
      getEnvironmentState is returning {"codexFlag":false,"offlineFlagExplicit":false,"testEnvironment":true,"isOffline":false,"environmentDetected":false}

      at log (utils/offlineMode.js:277:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      getEnvironmentState is running with none

      at log (utils/offlineMode.js:267:11)

    console.log
      getEnvironmentState is returning {"codexFlag":false,"offlineFlagExplicit":false,"testEnvironment":true,"isOffline":false,"environmentDetected":false}

      at log (utils/offlineMode.js:277:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      getEnvironmentState is running with none

      at log (utils/offlineMode.js:267:11)

    console.log
      getEnvironmentState is returning {"codexFlag":false,"offlineFlagExplicit":false,"testEnvironment":true,"isOffline":false,"environmentDetected":false}

      at log (utils/offlineMode.js:277:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      getEnvironmentState is running with none

      at log (utils/offlineMode.js:267:11)

    console.log
      getEnvironmentState is returning {"codexFlag":false,"offlineFlagExplicit":false,"testEnvironment":true,"isOffline":false,"environmentDetected":false}

      at log (utils/offlineMode.js:277:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is running with true

      at log (utils/offlineMode.js:81:11)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is returning true

      at log (utils/offlineMode.js:87:13)

    console.log
      getQerrors is running with offline: true

      at log (utils/offlineMode.js:209:11)

    console.log
      getQerrors is returning [object Object]

      at log (utils/offlineMode.js:240:13)

    console.log
      noopQerrors is running with none

      at Object.log [as qerrors] (utils/offlineMode.js:225:19)

    console.log
      noopQerrors has run

      at Object.log [as qerrors] (utils/offlineMode.js:227:21)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is running with true

      at log (utils/offlineMode.js:81:11)

    console.log
      setOfflineMode is returning true

      at log (utils/offlineMode.js:87:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is running with true

      at log (utils/offlineMode.js:81:11)

    console.log
      setOfflineMode is returning true

      at log (utils/offlineMode.js:87:13)

    console.log
      getEnvironmentState is running with none

      at log (utils/offlineMode.js:267:11)

    console.log
      getEnvironmentState is returning {"codexFlag":false,"offlineFlagExplicit":false,"testEnvironment":true,"isOffline":true,"environmentDetected":false}

      at log (utils/offlineMode.js:277:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      getEnvironmentState is running with none

      at log (utils/offlineMode.js:267:11)

    console.log
      getEnvironmentState is returning {"codexFlag":false,"offlineFlagExplicit":false,"testEnvironment":true,"isOffline":true,"environmentDetected":false}

      at log (utils/offlineMode.js:277:13)

    console.log
      setOfflineMode is running with true

      at log (utils/offlineMode.js:81:11)

    console.log
      setOfflineMode is returning true

      at log (utils/offlineMode.js:87:13)

    console.log
      getEnvironmentState is running with none

      at log (utils/offlineMode.js:267:11)

    console.log
      getEnvironmentState is returning {"codexFlag":false,"offlineFlagExplicit":false,"testEnvironment":true,"isOffline":true,"environmentDetected":false}

      at log (utils/offlineMode.js:277:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is running with true

      at log (utils/offlineMode.js:81:11)

    console.log
      setOfflineMode is returning true

      at log (utils/offlineMode.js:87:13)

    console.log
      createEnvironmentAdapters is running with offline: true

      at log (utils/offlineMode.js:301:11)

    console.log
      getAxios is running with offline: true

      at log (utils/offlineMode.js:140:11)

    console.log
      getAxios is returning [object Object]

      at log (utils/offlineMode.js:171:13)

    console.log
      getQerrors is running with offline: true

      at log (utils/offlineMode.js:209:11)

    console.log
      getQerrors is returning [object Object]

      at log (utils/offlineMode.js:240:13)

    console.log
      createEnvironmentAdapters is returning adapters

      at log (utils/offlineMode.js:309:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is running with true

      at log (utils/offlineMode.js:81:11)

    console.log
      setOfflineMode is returning true

      at log (utils/offlineMode.js:87:13)

    console.log
      createEnvironmentAdapters is running with offline: true

      at log (utils/offlineMode.js:301:11)

    console.log
      getAxios is running with offline: true

      at log (utils/offlineMode.js:140:11)

    console.log
      getAxios is returning [object Object]

      at log (utils/offlineMode.js:171:13)

    console.log
      getQerrors is running with offline: true

      at log (utils/offlineMode.js:209:11)

    console.log
      getQerrors is returning [object Object]

      at log (utils/offlineMode.js:240:13)

    console.log
      createEnvironmentAdapters is returning adapters

      at log (utils/offlineMode.js:309:13)

    console.log
      noopQerrors is running with none

      at Object.log [as qerrors] (utils/offlineMode.js:225:19)

    console.log
      noopQerrors has run

      at Object.log [as qerrors] (utils/offlineMode.js:227:21)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is running with false

      at log (utils/offlineMode.js:81:11)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is returning false

      at log (utils/offlineMode.js:87:13)

    console.log
      createEnvironmentAdapters is running with offline: false

      at log (utils/offlineMode.js:301:11)

    console.log
      getAxios is running with offline: false

      at log (utils/offlineMode.js:140:11)

    console.log
      getAxios is returning function wrap() {
          return fn.apply(thisArg, arguments);
        }

      at log (utils/offlineMode.js:171:13)

    console.log
      getQerrors is running with offline: false

      at log (utils/offlineMode.js:209:11)

    console.log
      getQerrors is returning [object Object]

      at log (utils/offlineMode.js:240:13)

    console.log
      createEnvironmentAdapters is returning adapters

      at log (utils/offlineMode.js:309:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is running with true

      at log (utils/offlineMode.js:81:11)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is returning true

      at log (utils/offlineMode.js:87:13)

    console.log
      getAxios is running with offline: true

      at log (utils/offlineMode.js:140:11)

    console.log
      getAxios is returning [object Object]

      at log (utils/offlineMode.js:171:13)

    console.log
      getAxios is running with offline: true

      at log (utils/offlineMode.js:140:11)

    console.log
      getAxios is returning [object Object]

      at log (utils/offlineMode.js:148:15)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is running with true

      at log (utils/offlineMode.js:81:11)

    console.log
      setOfflineMode is returning true

      at log (utils/offlineMode.js:87:13)

    console.log
      getAxios is running with offline: true

      at log (utils/offlineMode.js:140:11)

    console.log
      getAxios is returning [object Object]

      at log (utils/offlineMode.js:171:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      getAxios is running with offline: true

      at log (utils/offlineMode.js:140:11)

    console.log
      getAxios is returning [object Object]

      at log (utils/offlineMode.js:171:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is running with true

      at log (utils/offlineMode.js:81:11)

    console.log
      setOfflineMode is returning true

      at log (utils/offlineMode.js:87:13)

    console.log
      getAxios is running with offline: true

      at log (utils/offlineMode.js:140:11)

    console.log
      getAxios is returning [object Object]

      at log (utils/offlineMode.js:171:13)

    console.log
      setOfflineMode is running with false

      at log (utils/offlineMode.js:81:11)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is returning false

      at log (utils/offlineMode.js:87:13)

    console.log
      getAxios is running with offline: false

      at log (utils/offlineMode.js:140:11)

    console.log
      getAxios is returning function wrap() {
          return fn.apply(thisArg, arguments);
        }

      at log (utils/offlineMode.js:171:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is running with false

      at log (utils/offlineMode.js:81:11)

    console.log
      setOfflineMode is returning false

      at log (utils/offlineMode.js:87:13)

    console.log
      getAxios is running with offline: false

      at log (utils/offlineMode.js:140:11)

    console.log
      getAxios is returning function wrap() {
          return fn.apply(thisArg, arguments);
        }

      at log (utils/offlineMode.js:171:13)

    console.log
      getQerrors is running with offline: false

      at log (utils/offlineMode.js:209:11)

    console.log
      getQerrors is returning [object Object]

      at log (utils/offlineMode.js:240:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is running with false

      at log (utils/offlineMode.js:81:11)

    console.log
      setOfflineMode is returning false

      at log (utils/offlineMode.js:87:13)

    console.log
      getAxios is running with offline: false

      at log (utils/offlineMode.js:140:11)

    console.log
      getAxios is returning function wrap() {
          return fn.apply(thisArg, arguments);
        }

      at log (utils/offlineMode.js:171:13)

    console.log
      getQerrors is running with offline: false

      at log (utils/offlineMode.js:209:11)

    console.log
      getQerrors is returning [object Object]

      at log (utils/offlineMode.js:240:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is running with true

      at log (utils/offlineMode.js:81:11)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is returning true

      at log (utils/offlineMode.js:87:13)

    console.log
      setOfflineMode is running with false

      at log (utils/offlineMode.js:81:11)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is returning false

      at log (utils/offlineMode.js:87:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is running with true

      at log (utils/offlineMode.js:81:11)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

    console.log
      setOfflineMode is returning true

      at log (utils/offlineMode.js:87:13)

    console.log
      getAxios is running with offline: true

      at log (utils/offlineMode.js:140:11)

    console.log
      getAxios is returning [object Object]

      at log (utils/offlineMode.js:171:13)

    console.log
      clearOfflineCache is running with none

      at log (utils/offlineMode.js:318:11)

    console.log
      clearOfflineCache is returning undefined

      at log (utils/offlineMode.js:323:13)

  ● Enhanced Offline Mode › Environment Variable Detection › detects CODEX environment variable

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      50 |       const { getEnvironmentState } = require('../utils/offlineMode');
      51 |       const envState = getEnvironmentState();
    > 52 |       expect(envState.codexFlag).toBe(true);
         |                                  ^
      53 |       expect(envState.environmentDetected).toBe(true);
      54 |     });
      55 |     

      at Object.toBe (test/offlineMode.test.js:52:34)

  ● Enhanced Offline Mode › Environment Variable Detection › detects OFFLINE_MODE environment variable

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      59 |       const { getEnvironmentState } = require('../utils/offlineMode');
      60 |       const envState = getEnvironmentState();
    > 61 |       expect(envState.offlineFlagExplicit).toBe(true);
         |                                            ^
      62 |       expect(envState.environmentDetected).toBe(true);
      63 |     });
      64 |     

      at Object.toBe (test/offlineMode.test.js:61:44)

  ● Enhanced Offline Mode › Environment Variable Detection › handles case-insensitive environment variables

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      69 |       const { getEnvironmentState } = require('../utils/offlineMode');
      70 |       const envState = getEnvironmentState();
    > 71 |       expect(envState.codexFlag).toBe(true);
         |                                  ^
      72 |       expect(envState.offlineFlagExplicit).toBe(true);
      73 |     });
      74 |     

      at Object.toBe (test/offlineMode.test.js:71:34)


ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at buildLogger (node_modules/qerrors/lib/logger.js:152:33)

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at Object.get [as File] (node_modules/winston/lib/winston/transports/index.js:30:12)
      at node_modules/qerrors/lib/logger.js:164:57
      at buildLogger (node_modules/qerrors/lib/logger.js:171:11)
/home/runner/workspace/node_modules/qerrors/lib/logger.js:164
                                arr.push(new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error', ...rotationOpts, maxFiles: fileCap, format: fileFormat })); //(size-based rotation for error files with count limit)
                                         ^

[TypeError: transports.File is not a constructor]

Node.js v20.19.3
Test Suites: 1 failed, 1 total
Tests:       3 failed, 15 passed, 18 total
Snapshots:   0 total
Time:        8.286 s, estimated 51 s
Ran all test suites matching test/offlineMode.test.js.

```

### Duration: 13575ms

---

## Failed Test 4: test/testGenerator.test.js

### Output:
```
FAIL test/testGenerator.test.js
  ● Console

    console.log
      setup is running with none

      at Object.setup (lib/setup.js:58:11)

    console.log
      setup has run resulting in module resolution modification

      at Object.setup (lib/setup.js:62:13)

  ● TestGenerator basic tests › should show help when requested

    ReferenceError: execSync is not defined

      16 |
      17 |   it('should show help when requested', () => {
    > 18 |     const result = execSync('node bin/qtests-generate --help', { 
         |                    ^
      19 |       cwd: path.join(__dirname, '..'),
      20 |       encoding: 'utf8',
      21 |       stdio: 'pipe'

      at Object.execSync (test/testGenerator.test.js:18:20)

  ● TestGenerator basic tests › should show version when requested

    ReferenceError: execSync is not defined

      28 |
      29 |   it('should show version when requested', () => {
    > 30 |     const result = execSync('node bin/qtests-generate --version', { 
         |                    ^
      31 |       cwd: path.join(__dirname, '..'),
      32 |       encoding: 'utf8',
      33 |       stdio: 'pipe'

      at Object.execSync (test/testGenerator.test.js:30:20)

  ● TestGenerator Content Generation › should generate unit test content

    ReferenceError: TestGenerator is not defined

      40 | describe('TestGenerator Content Generation', () => {
      41 |   it('should generate unit test content', () => {
    > 42 |     const generator = new TestGenerator();
         |                       ^
      43 |     const exports = ['calculate', 'Calculator'];
      44 |     const usesQtests = false;
      45 |     const mocks = ['axios'];

      at Object.<anonymous> (test/testGenerator.test.js:42:23)

  ● TestGenerator Content Generation › should generate API test content

    ReferenceError: TestGenerator is not defined

      53 |
      54 |   it('should generate API test content', () => {
    > 55 |     const generator = new TestGenerator();
         |                       ^
      56 |     const method = 'get';
      57 |     const route = '/api/users';
      58 |     

      at Object.<anonymous> (test/testGenerator.test.js:55:23)

Test Suites: 1 failed, 1 total
Tests:       4 failed, 2 passed, 6 total
Snapshots:   0 total
Time:        5.071 s, estimated 21 s
Ran all test suites matching test/testGenerator.test.js.

```

### Duration: 9489ms

---

## Summary

- Total failed tests: 4
- Failed test files: test/dualModuleGeneration.test.js, test/moduleSystemIntegration.test.js, test/offlineMode.test.js, test/testGenerator.test.js
- Generated: 2025-08-19T14:34:00.302Z
