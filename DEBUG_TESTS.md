# Test Failure Analysis

**Creation Time:** 2025-08-19T15:51:19.847Z
**Pacific Time:** Tuesday, August 19, 2025 at 08:51:19 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: test/offlineMode.test.js

### Output:
```
FAIL test/offlineMode.test.js (6.442 s)
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

      49 |       const { getEnvironmentState } = require('../utils/offlineMode');
      50 |       const envState = getEnvironmentState();
    > 51 |       expect(envState.codexFlag).toBe(true);
         |                                  ^
      52 |       expect(envState.environmentDetected).toBe(true);
      53 |     });
      54 |     

      at Object.toBe (test/offlineMode.test.js:51:34)

  ● Enhanced Offline Mode › Environment Variable Detection › detects OFFLINE_MODE environment variable

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      58 |       const { getEnvironmentState } = require('../utils/offlineMode');
      59 |       const envState = getEnvironmentState();
    > 60 |       expect(envState.offlineFlagExplicit).toBe(true);
         |                                            ^
      61 |       expect(envState.environmentDetected).toBe(true);
      62 |     });
      63 |     

      at Object.toBe (test/offlineMode.test.js:60:44)

  ● Enhanced Offline Mode › Environment Variable Detection › handles case-insensitive environment variables

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      68 |       const { getEnvironmentState } = require('../utils/offlineMode');
      69 |       const envState = getEnvironmentState();
    > 70 |       expect(envState.codexFlag).toBe(true);
         |                                  ^
      71 |       expect(envState.offlineFlagExplicit).toBe(true);
      72 |     });
      73 |     

      at Object.toBe (test/offlineMode.test.js:70:34)


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
Tests:       3 failed, 14 passed, 17 total
Snapshots:   0 total
Time:        9.205 s
Ran all test suites matching test/offlineMode.test.js.

```

### Duration: 12385ms

---

## Summary

- Total failed tests: 1
- Failed test files: test/offlineMode.test.js
- Generated: 2025-08-19T15:51:19.880Z
