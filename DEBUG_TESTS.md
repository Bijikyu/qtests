# Test Failure Analysis

**Creation Time:** 2025-08-19T13:46:41.264Z
**Pacific Time:** Tuesday, August 19, 2025 at 06:46:41 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: test/setupResolution.test.js

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

### Duration: 14526ms

---

## Failed Test 2: test/testHelpers.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 426ms

---

## Failed Test 3: test/testEnv.test.js

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

### Duration: 16748ms

---

## Failed Test 4: lib/testGenerator.test.js

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

### Duration: 38198ms

---

## Failed Test 5: lib/httpUtils.test.js

### Output:
```
Aborted (core dumped)

```

### Duration: 38835ms

---

## Failed Test 6: utils/email/emailValidator.test.js

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

### Duration: 18758ms

---

## Failed Test 7: utils/mockConsole.test.js

### Output:
```

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[22474]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7fd10b8b34d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7fd10b8b359b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7: 22474 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 3590ms

---

## Failed Test 8: tests/integration/utils__httpTest.test.js

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

### Duration: 22912ms

---

## Failed Test 9: utils/helpers/consoleMocker.test.js

### Output:
```

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[22462]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7f5f3e8704d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7f5f3e87059b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
Aborted (core dumped)

```

### Duration: 19075ms

---

## Failed Test 10: utils/testing/databaseTestHelper.test.js

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

### Duration: 11905ms

---

## Summary

- Total failed tests: 10
- Failed test files: test/setupResolution.test.js, test/testHelpers.test.js, test/testEnv.test.js, lib/testGenerator.test.js, lib/httpUtils.test.js, utils/email/emailValidator.test.js, utils/mockConsole.test.js, tests/integration/utils__httpTest.test.js, utils/helpers/consoleMocker.test.js, utils/testing/databaseTestHelper.test.js
- Generated: 2025-08-19T13:46:41.282Z
