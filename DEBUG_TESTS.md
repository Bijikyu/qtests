# Test Failure Analysis

**Creation Time:** 2025-08-19T15:02:52.838Z
**Pacific Time:** Tuesday, August 19, 2025 at 08:02:52 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: test/offlineMode.test.js

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
Tests:       3 failed, 14 passed, 17 total
Snapshots:   0 total
Time:        7.963 s, estimated 20 s
Ran all test suites matching test/offlineMode.test.js.

```

### Duration: 11846ms

---

## Summary

- Total failed tests: 1
- Failed test files: test/offlineMode.test.js
- Generated: 2025-08-19T15:02:52.862Z
