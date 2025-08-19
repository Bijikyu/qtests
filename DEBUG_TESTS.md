# Test Failure Analysis

**Creation Time:** 2025-08-19T14:10:30.278Z
**Pacific Time:** Tuesday, August 19, 2025 at 07:10:30 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: index.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 2: jest.config.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 3: lib/coreUtils.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 4: lib/dataUtils.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 5: test/stubMethod.test.js

### Output:
```
node:events:502
      throw er; // Unhandled 'error' event
      ^

Error: spawn /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node EAGAIN
    at ChildProcess._handle.onexit (node:internal/child_process:285:19)
    at onErrorNT (node:internal/child_process:483:16)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
Emitted 'error' event on ChildProcess instance at:
    at ChildProcess._handle.onexit (node:internal/child_process:291:12)
    at onErrorNT (node:internal/child_process:483:16)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  errno: -11,
  code: 'EAGAIN',
  syscall: 'spawn /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node',
  path: '/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node',
  spawnargs: [
    '/home/runner/workspace/node_modules/jest-worker/build/processChild.js'
  ]
}

Node.js v20.19.3

```

### Duration: 12794ms

---

## Failed Test 6: test/setupMultiple.test.js

### Output:
```
Aborted (core dumped)

```

### Duration: 13572ms

---

## Failed Test 7: test/mockConsole.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 8: test/offlineMode.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 9: test/qtests-dogfood.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 10: test/resolveStubPaths.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 11: test/sendEmail.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 12: utils/helpers/envManager.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 81ms

---

## Failed Test 13: tests/integration/utils__httpTest.test.js

### Output:
```
node:events:502
      throw er; // Unhandled 'error' event
      ^

Error: spawn /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node EAGAIN
    at ChildProcess._handle.onexit (node:internal/child_process:285:19)
    at onErrorNT (node:internal/child_process:483:16)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
Emitted 'error' event on ChildProcess instance at:
    at ChildProcess._handle.onexit (node:internal/child_process:291:12)
    at onErrorNT (node:internal/child_process:483:16)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  errno: -11,
  code: 'EAGAIN',
  syscall: 'spawn /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node',
  path: '/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node',
  spawnargs: [
    '/home/runner/workspace/node_modules/jest-worker/build/processChild.js'
  ]
}

Node.js v20.19.3

```

### Duration: 16484ms

---

## Failed Test 14: utils/email/emailHistory.test.js

### Output:
```
npm error code EAGAIN
npm error syscall spawn sh
npm error path /home/runner/workspace
npm error errno -11
npm error spawn sh EAGAIN
npm error command sh -c jest --testPathPatterns utils/email/emailHistory.test.js --no-coverage --cache
npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2025-08-19T14_09_36_531Z-debug-0.log

```

### Duration: 13022ms

---

## Failed Test 15: tests/integration/example__put.test.js

### Output:
```
node:events:502
      throw er; // Unhandled 'error' event
      ^

Error: spawn /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node EAGAIN
    at ChildProcess._handle.onexit (node:internal/child_process:285:19)
    at onErrorNT (node:internal/child_process:483:16)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
Emitted 'error' event on ChildProcess instance at:
    at ChildProcess._handle.onexit (node:internal/child_process:291:12)
    at onErrorNT (node:internal/child_process:483:16)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  errno: -11,
  code: 'EAGAIN',
  syscall: 'spawn /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node',
  path: '/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node',
  spawnargs: [
    '/home/runner/workspace/node_modules/jest-worker/build/processChild.js'
  ]
}

Node.js v20.19.3

```

### Duration: 17431ms

---

## Failed Test 16: utils/email/emailValidator.test.js

### Output:
```
Aborted (core dumped)

```

### Duration: 11592ms

---

## Failed Test 17: utils/email/emailTemplate.test.js

### Output:
```
Aborted (core dumped)

```

### Duration: 11972ms

---

## Failed Test 18: utils/email/emailSender.test.js

### Output:
```
node:events:502
      throw er; // Unhandled 'error' event
      ^

Error: spawn /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node EAGAIN
    at ChildProcess._handle.onexit (node:internal/child_process:285:19)
    at onErrorNT (node:internal/child_process:483:16)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
Emitted 'error' event on ChildProcess instance at:
    at ChildProcess._handle.onexit (node:internal/child_process:291:12)
    at onErrorNT (node:internal/child_process:483:16)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  errno: -11,
  code: 'EAGAIN',
  syscall: 'spawn /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node',
  path: '/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node',
  spawnargs: [
    '/home/runner/workspace/node_modules/jest-worker/build/processChild.js'
  ]
}

Node.js v20.19.3

```

### Duration: 15997ms

---

## Failed Test 19: test/testGenerator.test.js

### Output:
```
FAIL test/testGenerator.test.js (7.8 s)
  ● Console

    console.log
      setup is running with none

      at Object.setup (lib/setup.js:58:11)

    console.log
      setup has run resulting in module resolution modification

      at Object.setup (lib/setup.js:62:13)

  ● TestGenerator CLI › should show version when requested

    Command failed: node bin/qtests-generate --version

      #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[23723]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
      #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

    ----- Native stack trace -----

     1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
     2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
     3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
     4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
     5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
     6: 0x7f80dc26c4d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
     7: 0x7f80dc26c59b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
     8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
    Aborted (core dumped)

      87 |
      88 |   it('should show version when requested', () => {
    > 89 |     const result = execSync('node bin/qtests-generate --version', { 
         |                    ^
      90 |       cwd: path.join(__dirname, '..'),
      91 |       encoding: 'utf8',
      92 |       stdio: 'pipe'

      at Object.execSync (test/testGenerator.test.js:89:20)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 7 passed, 8 total
Snapshots:   0 total
Time:        13.053 s
Ran all test suites matching test/testGenerator.test.js.

```

### Duration: 26684ms

---

## Failed Test 20: tests/integration/utils__httpTest__get.test.js

### Output:
```
node:events:502
      throw er; // Unhandled 'error' event
      ^

Error: spawn /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node EAGAIN
    at ChildProcess._handle.onexit (node:internal/child_process:285:19)
    at onErrorNT (node:internal/child_process:483:16)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
Emitted 'error' event on ChildProcess instance at:
    at ChildProcess._handle.onexit (node:internal/child_process:291:12)
    at onErrorNT (node:internal/child_process:483:16)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  errno: -11,
  code: 'EAGAIN',
  syscall: 'spawn /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node',
  path: '/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node',
  spawnargs: [
    '/home/runner/workspace/node_modules/jest-worker/build/processChild.js'
  ]
}

Node.js v20.19.3

```

### Duration: 19683ms

---

## Failed Test 21: test/testHelpers.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 22: test/testSuite.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 23: tests/integration/example__get.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 24: utils/email/emailFormatter.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Summary

- Total failed tests: 24
- Failed test files: index.test.js, jest.config.test.js, lib/coreUtils.test.js, lib/dataUtils.test.js, test/stubMethod.test.js, test/setupMultiple.test.js, test/mockConsole.test.js, test/offlineMode.test.js, test/qtests-dogfood.test.js, test/resolveStubPaths.test.js, test/sendEmail.test.js, utils/helpers/envManager.test.js, tests/integration/utils__httpTest.test.js, utils/email/emailHistory.test.js, tests/integration/example__put.test.js, utils/email/emailValidator.test.js, utils/email/emailTemplate.test.js, utils/email/emailSender.test.js, test/testGenerator.test.js, tests/integration/utils__httpTest__get.test.js, test/testHelpers.test.js, test/testSuite.test.js, tests/integration/example__get.test.js, utils/email/emailFormatter.test.js
- Generated: 2025-08-19T14:10:30.300Z
