# Test Failure Analysis

**Creation Time:** 2025-08-19T14:49:01.881Z
**Pacific Time:** Tuesday, August 19, 2025 at 07:49:01 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: test/mockModels.test.js

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

### Duration: 14812ms

---

## Failed Test 2: test/integration.test.js

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

### Duration: 17850ms

---

## Failed Test 3: test/offlineMode.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 299ms

---

## Failed Test 4: test/qtests-dogfood.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 44ms

---

## Failed Test 5: test/resolveStubPaths.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 21ms

---

## Failed Test 6: test/runTestSuite.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 7ms

---

## Failed Test 7: test/safeSerialize.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 32ms

---

## Failed Test 8: test/sendEmail.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 2ms

---

## Failed Test 9: test/setupMultiple.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 2ms

---

## Failed Test 10: test/setupResolution.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 9ms

---

## Failed Test 11: test/stubMethod.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 7ms

---

## Failed Test 12: test/testEnv.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 2ms

---

## Failed Test 13: test/testGenerator.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 14ms

---

## Failed Test 14: test/testHelpers.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 40ms

---

## Failed Test 15: test/testSuite.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 14ms

---

## Failed Test 16: tests/integration/example.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 4ms

---

## Failed Test 17: tests/integration/example__get.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 55ms

---

## Failed Test 18: tests/integration/example__post.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 38ms

---

## Failed Test 19: test/mockConsole.test.js

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

### Duration: 17806ms

---

## Failed Test 20: test/moduleSystemIntegration.test.js

### Output:
```
Aborted (core dumped)

```

### Duration: 16660ms

---

## Failed Test 21: test/logUtils.test.js

### Output:
```

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[20218]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7f070a1b04d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7f070a1b059b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
node[20216]: pthread_create: Resource temporarily unavailable

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[20210]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7fb5db6694d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7fb5db66959b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
FAIL test/logUtils.test.js
  ● Test suite failed to run

    A jest worker process (pid=20210) was terminated by another process: signal=SIGABRT, exitCode=null. Operating system logs may contain more information on why this occurred.

      at ChildProcessWorker._onExit (node_modules/jest-worker/build/index.js:968:23)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        5.784 s
Ran all test suites matching test/logUtils.test.js.

```

### Duration: 21814ms

---

## Failed Test 22: tests/integration/utils__httpTest.test.js

### Output:
```

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[20329]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7fc0e31d54d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7fc0e31d559b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7: 20329 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 2647ms

---

## Failed Test 23: tests/integration/utils__httpTest__get.test.js

### Output:
```

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[20330]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7efd0e4a94d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7efd0e4a959b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7: 20330 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 2348ms

---

## Failed Test 24: utils/email/emailHistory.test.js

### Output:
```

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[20381]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7fe74a9b44d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7fe74a9b459b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7: 20381 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 2078ms

---

## Failed Test 25: utils/email/emailFormatter.test.js

### Output:
```
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7: 20368 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 3439ms

---

## Failed Test 26: test/offlineIntegration.test.js

### Output:
```
node[20186]: pthread_create: Resource temporarily unavailable

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[20530]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7f3ffaa584d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7f3ffaa5859b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
Aborted (core dumped)

```

### Duration: 9774ms

---

## Failed Test 27: utils/email/emailTemplate.test.js

### Output:
```
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7: 20471 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 3061ms

---

## Failed Test 28: test/indexExports.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 29: test/mockAxios.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 30: utils/helpers/keyGenerator.test.js

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

### Duration: 16575ms

---

## Failed Test 31: utils/helpers/qerrorsStub.test.js

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

### Duration: 16096ms

---

## Failed Test 32: utils/email/emailSender.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 33: utils/models/apiKeyModel.test.js

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

### Duration: 16941ms

---

## Failed Test 34: utils/mockModels.test.js

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

### Duration: 17586ms

---

## Failed Test 35: utils/offlineMode.test.js

### Output:
```
npm error code EAGAIN
npm error syscall spawn sh
npm error path /home/runner/workspace
npm error errno -11
npm error spawn sh EAGAIN
npm error command sh -c jest --testPathPatterns utils/offlineMode.test.js --no-coverage --cache
npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2025-08-19T14_48_06_415Z-debug-0.log

```

### Duration: 5205ms

---

## Failed Test 36: utils/runTestSuite.test.js

### Output:
```
npm error code EAGAIN
npm error syscall spawn sh
npm error path /home/runner/workspace
npm error errno -11
npm error spawn sh EAGAIN
npm error command sh -c jest --testPathPatterns utils/runTestSuite.test.js --no-coverage --cache
npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2025-08-19T14_48_06_666Z-debug-0.log

```

### Duration: 5628ms

---

## Failed Test 37: utils/helpers/responseMocker.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 38: utils/sendEmail.test.js

### Output:
```
npm error code EAGAIN
npm error syscall spawn sh
npm error path /home/runner/workspace
npm error errno -11
npm error spawn sh EAGAIN
npm error command sh -c jest --testPathPatterns utils/sendEmail.test.js --no-coverage --cache
npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2025-08-19T14_48_07_652Z-debug-0.log

```

### Duration: 7199ms

---

## Failed Test 39: utils/testEnv.test.js

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

### Duration: 18933ms

---

## Failed Test 40: utils/testHelpers.test.js

### Output:
```
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: fork: retry: Resource temporarily unavailable
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

### Duration: 19634ms

---

## Failed Test 41: utils/testing/databaseTestHelper.test.js

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

### Duration: 17748ms

---

## Failed Test 42: utils/models/modelFactory.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 43: utils/testing/assertionHelper.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 44: utils/testing/mockManager.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 45: utils/testing/performanceTestHelper.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 46: utils/testing/testDataFactory.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Summary

- Total failed tests: 46
- Failed test files: test/mockModels.test.js, test/integration.test.js, test/offlineMode.test.js, test/qtests-dogfood.test.js, test/resolveStubPaths.test.js, test/runTestSuite.test.js, test/safeSerialize.test.js, test/sendEmail.test.js, test/setupMultiple.test.js, test/setupResolution.test.js, test/stubMethod.test.js, test/testEnv.test.js, test/testGenerator.test.js, test/testHelpers.test.js, test/testSuite.test.js, tests/integration/example.test.js, tests/integration/example__get.test.js, tests/integration/example__post.test.js, test/mockConsole.test.js, test/moduleSystemIntegration.test.js, test/logUtils.test.js, tests/integration/utils__httpTest.test.js, tests/integration/utils__httpTest__get.test.js, utils/email/emailHistory.test.js, utils/email/emailFormatter.test.js, test/offlineIntegration.test.js, utils/email/emailTemplate.test.js, test/indexExports.test.js, test/mockAxios.test.js, utils/helpers/keyGenerator.test.js, utils/helpers/qerrorsStub.test.js, utils/email/emailSender.test.js, utils/models/apiKeyModel.test.js, utils/mockModels.test.js, utils/offlineMode.test.js, utils/runTestSuite.test.js, utils/helpers/responseMocker.test.js, utils/sendEmail.test.js, utils/testEnv.test.js, utils/testHelpers.test.js, utils/testing/databaseTestHelper.test.js, utils/models/modelFactory.test.js, utils/testing/assertionHelper.test.js, utils/testing/mockManager.test.js, utils/testing/performanceTestHelper.test.js, utils/testing/testDataFactory.test.js
- Generated: 2025-08-19T14:49:01.948Z
