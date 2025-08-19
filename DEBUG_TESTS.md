# Test Failure Analysis

**Creation Time:** 2025-08-19T14:57:03.489Z
**Pacific Time:** Tuesday, August 19, 2025 at 07:57:03 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: lib/testGenerator.test.js

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

### Duration: 17172ms

---

## Failed Test 2: index.test.js

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

### Duration: 17447ms

---

## Failed Test 3: lib/logUtils.test.js

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

### Duration: 17374ms

---

## Failed Test 4: lib/testUtils.test.js

### Output:
```

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[6716]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7efed680d4d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7efed680d59b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
FAIL lib/testUtils.test.js
  ● Test suite failed to run

    A jest worker process (pid=6716) was terminated by another process: signal=SIGABRT, exitCode=null. Operating system logs may contain more information on why this occurred.

      at ChildProcessWorker._onExit (node_modules/jest-worker/build/index.js:968:23)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.716 s, estimated 6 s
Ran all test suites matching lib/testUtils.test.js.

```

### Duration: 18392ms

---

## Failed Test 5: test/edgeCases.test.js

### Output:
```
npm error code EAGAIN
npm error syscall spawn sh
npm error path /home/runner/workspace
npm error errno -11
npm error spawn sh EAGAIN
npm error command sh -c jest --testPathPatterns test/edgeCases.test.js --no-coverage --cache
npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2025-08-19T14_55_12_491Z-debug-0.log

```

### Duration: 5571ms

---

## Failed Test 6: test/dualModuleGeneration.test.js

### Output:
```
npm error code EAGAIN
npm error syscall spawn sh
npm error path /home/runner/workspace
npm error errno -11
npm error spawn sh EAGAIN
npm error command sh -c jest --testPathPatterns test/dualModuleGeneration.test.js --no-coverage --cache
npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2025-08-19T14_55_12_397Z-debug-0.log

```

### Duration: 6677ms

---

## Failed Test 7: test/indexExports.test.js

### Output:
```

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[7139]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7fe1d005f4d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7fe1d005f59b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7:  7139 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 1650ms

---

## Failed Test 8: test/comprehensive.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 9: test/httpTest.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 10: test/offlineMode.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 11: test/setupMultiple.test.js

### Output:
```
Aborted (core dumped)

```

### Duration: 14630ms

---

## Failed Test 12: test/safeSerialize.test.js

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

### Duration: 17954ms

---

## Failed Test 13: test/sendEmail.test.js

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

### Duration: 16929ms

---

## Failed Test 14: test/setupResolution.test.js

### Output:
```
Aborted (core dumped)

```

### Duration: 17183ms

---

## Failed Test 15: test/testHelpers.test.js

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

### Duration: 16365ms

---

## Failed Test 16: test/testGenerator.test.js

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

### Duration: 16983ms

---

## Failed Test 17: utils/email/emailFormatter.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 38ms

---

## Failed Test 18: tests/integration/utils__httpTest.test.js

### Output:
```

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[9617]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7f96a8dca4d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7f96a8dca59b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7:  9617 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 1781ms

---

## Failed Test 19: test/stubMethod.test.js

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

### Duration: 19377ms

---

## Failed Test 20: utils/email/emailSender.test.js

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

### Duration: 14589ms

---

## Failed Test 21: utils/email/emailHistory.test.js

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

### Duration: 14755ms

---

## Failed Test 22: test/testSuite.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 23: utils/helpers/moduleReloader.test.js

### Output:
```
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7: 10412 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 3510ms

---

## Failed Test 24: utils/helpers/responseMocker.test.js

### Output:
```
node[10464]: pthread_create: Resource temporarily unavailable
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7: 10464 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 3249ms

---

## Failed Test 25: utils/helpers/qerrorsStub.test.js

### Output:
```
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7: 10426 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 3883ms

---

## Failed Test 26: utils/helpers/keyGenerator.test.js

### Output:
```
npm error code EAGAIN
npm error syscall spawn sh
npm error path /home/runner/workspace
npm error errno -11
npm error spawn sh EAGAIN
npm error command sh -c jest --testPathPatterns utils/helpers/keyGenerator.test.js --no-coverage --cache
npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2025-08-19T14_56_16_850Z-debug-0.log

```

### Duration: 7754ms

---

## Failed Test 27: utils/mockAxios.test.js

### Output:
```

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[10584]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7fca2c08e4d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7fca2c08e59b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7: 10584 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 1756ms

---

## Failed Test 28: utils/helpers/consoleMocker.test.js

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

### Duration: 14378ms

---

## Failed Test 29: tests/integration/example__get.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 30: utils/sendEmail.test.js

### Output:
```
Aborted (core dumped)

```

### Duration: 12108ms

---

## Failed Test 31: utils/models/apiLogModel.test.js

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

### Duration: 17054ms

---

## Failed Test 32: utils/helpers/envManager.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 33: utils/testHelpers.test.js

### Output:
```
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7: 11572 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 2713ms

---

## Failed Test 34: utils/testing/performanceTestHelper.test.js

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

### Duration: 13055ms

---

## Failed Test 35: utils/testSuite.test.js

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

### Duration: 15568ms

---

## Failed Test 36: utils/testing/assertionHelper.test.js

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

### Duration: 15511ms

---

## Failed Test 37: utils/testing/testDataFactory.test.js

### Output:
```
Error: A jest worker process (pid=12579) was terminated by another process: signal=SIGABRT, exitCode=null. Operating system logs may contain more information on why this occurred.
    at ChildProcessWorker._onExit (/home/runner/workspace/node_modules/jest-worker/build/index.js:968:23)
    at ChildProcess.emit (node:events:524:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12)

```

### Duration: 12909ms

---

## Failed Test 38: utils/testing/mockManager.test.js

### Output:
```

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[12594]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7fdaa74354d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7fdaa743559b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[12597]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7f6f50d9e4d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7f6f50d9e59b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
node[12627]: pthread_create: Resource temporarily unavailable
node[12629]: pthread_create: Resource temporarily unavailable
FAIL utils/testing/mockManager.test.js
  ● Test suite failed to run

    A jest worker process (pid=12594) was terminated by another process: signal=SIGABRT, exitCode=null. Operating system logs may contain more information on why this occurred.

      at ChildProcessWorker._onExit (node_modules/jest-worker/build/index.js:968:23)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        3.669 s
Ran all test suites matching utils/testing/mockManager.test.js.

```

### Duration: 16145ms

---

## Summary

- Total failed tests: 38
- Failed test files: lib/testGenerator.test.js, index.test.js, lib/logUtils.test.js, lib/testUtils.test.js, test/edgeCases.test.js, test/dualModuleGeneration.test.js, test/indexExports.test.js, test/comprehensive.test.js, test/httpTest.test.js, test/offlineMode.test.js, test/setupMultiple.test.js, test/safeSerialize.test.js, test/sendEmail.test.js, test/setupResolution.test.js, test/testHelpers.test.js, test/testGenerator.test.js, utils/email/emailFormatter.test.js, tests/integration/utils__httpTest.test.js, test/stubMethod.test.js, utils/email/emailSender.test.js, utils/email/emailHistory.test.js, test/testSuite.test.js, utils/helpers/moduleReloader.test.js, utils/helpers/responseMocker.test.js, utils/helpers/qerrorsStub.test.js, utils/helpers/keyGenerator.test.js, utils/mockAxios.test.js, utils/helpers/consoleMocker.test.js, tests/integration/example__get.test.js, utils/sendEmail.test.js, utils/models/apiLogModel.test.js, utils/helpers/envManager.test.js, utils/testHelpers.test.js, utils/testing/performanceTestHelper.test.js, utils/testSuite.test.js, utils/testing/assertionHelper.test.js, utils/testing/testDataFactory.test.js, utils/testing/mockManager.test.js
- Generated: 2025-08-19T14:57:03.514Z
