# Test Failure Analysis

**Creation Time:** 2025-08-19T16:16:44.724Z
**Pacific Time:** Tuesday, August 19, 2025 at 09:16:44 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: lib/logUtils.test.js

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

### Duration: 21379ms

---

## Failed Test 2: qtests-runner.test.js

### Output:
```
Aborted (core dumped)

```

### Duration: 21710ms

---

## Failed Test 3: lib/testGenerator.test.js

### Output:
```
Aborted (core dumped)

```

### Duration: 23423ms

---

## Failed Test 4: test/dualModuleGeneration.test.js

### Output:
```
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7: 28864 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 5376ms

---

## Failed Test 5: lib/coreUtils.test.js

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

### Duration: 28910ms

---

## Failed Test 6: index.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 7: jest.config.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 8: lib/dataUtils.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 9: lib/envUtils.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 10: lib/httpUtils.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 11: test/qtests-dogfood.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 29ms

---

## Failed Test 12: lib/setup.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 13: lib/testUtils.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 14: test/axiosStub.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 15: test/mockConsole.test.js

### Output:
```

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[29209]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7f56b84954d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7f56b849559b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7: 29209 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 4005ms

---

## Failed Test 16: test/indexExports.test.js

### Output:
```
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7: 29082 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 7411ms

---

## Failed Test 17: test/edgeCases.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 18: test/httpTest.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 19: test/mockUtils.test.js

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

### Duration: 24567ms

---

## Failed Test 20: test/testGenerator.test.js

### Output:
```
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7: 29861 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 2683ms

---

## Failed Test 21: test/testSuite.test.js

### Output:
```

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[30018]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7f01857994d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7f018579959b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: line 7: 30018 Aborted                 (core dumped) /nix/store/8y4ls7z2sfxbq6ch3yp45l28p29qswvx-nodejs-20.19.3-wrapped/bin/npx "$@"

```

### Duration: 1560ms

---

## Failed Test 22: test/logUtils.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 23: test/moduleSystemIntegration.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 24: tests/integration/example__put.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 83ms

---

## Failed Test 25: tests/integration/utils__httpTest.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 86ms

---

## Failed Test 26: tests/integration/utils__httpTest__get.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 12ms

---

## Failed Test 27: utils/email/emailFormatter.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 67ms

---

## Failed Test 28: utils/email/emailHistory.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 20ms

---

## Failed Test 29: utils/email/emailSender.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 36ms

---

## Failed Test 30: utils/email/emailTemplate.test.js

### Output:
```
spawn npx EAGAIN
```

### Duration: 62ms

---

## Failed Test 31: test/offlineIntegration.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 32: test/resolveStubPaths.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 33: test/safeSerialize.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 34: test/setupMultiple.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 35: test/setupResolution.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 36: test/stubMethod.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 37: test/testEnv.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 38: utils/helpers/qerrorsStub.test.js

### Output:
```
npm error code EAGAIN
npm error syscall spawn sh
npm error path /home/runner/workspace
npm error errno -11
npm error spawn sh EAGAIN
npm error command sh -c jest --testPathPatterns utils/helpers/qerrorsStub.test.js --no-coverage --cache
npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2025-08-19T16_14_44_844Z-debug-0.log

```

### Duration: 7561ms

---

## Failed Test 39: tests/integration/example.test.js

### Output:
```
/nix/store/djy8g4cghlw19fmy6zblim1waxkr7mf2-npx/bin/npx: fork: retry: Resource temporarily unavailable
Aborted (core dumped)

```

### Duration: 18932ms

---

## Failed Test 40: test/testHelpers.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 41: tests/integration/example__get.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 42: tests/integration/example__post.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 43: utils/email/emailValidator.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 44: utils/helpers/consoleMocker.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 45: utils/helpers/envManager.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 46: utils/helpers/keyGenerator.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 47: utils/helpers/moduleReloader.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 48: utils/helpers/responseMocker.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 49: utils/httpTest.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 50: utils/mockConsole.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 51: utils/models/apiKeyModel.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 52: utils/testing/mockManager.test.js

### Output:
```
sh: 1: Cannot fork

```

### Duration: 8499ms

---

## Failed Test 53: utils/models/baseMockModel.test.js

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

### Duration: 25706ms

---

## Failed Test 54: utils/testSuite.test.js

### Output:
```

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[31778]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7eff8eb6e4d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7eff8eb6e59b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
Aborted (core dumped)

```

### Duration: 17815ms

---

## Failed Test 55: utils/testing/databaseTestHelper.test.js

### Output:
```

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[31773]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7f8b90c334d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7f8b90c3359b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
Aborted (core dumped)

```

### Duration: 16772ms

---

## Failed Test 56: utils/models/apiLogModel.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 57: utils/models/modelFactory.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 58: utils/stubMethod.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 59: utils/testEnv.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 60: utils/testHelpers.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 61: utils/testing/assertionHelper.test.js

### Output:
```
Test timeout after 30 seconds
```

### Duration: 30000ms

---

## Failed Test 62: utils/mockAxios.test.js

### Output:
```

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[1294]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7f0fb83454d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7f0fb834559b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[1306]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7fee986d04d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7fee986d059b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[1307]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7fd4309fd4d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7fd4309fd59b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]

  #  /nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node[1301]: std::unique_ptr<long unsigned int> node::WorkerThreadsTaskRunner::DelayedTaskScheduler::Start() at ../../src/node_platform.cc:68
  #  Assertion failed: (0) == (uv_thread_create(t.get(), start_thread, this))

----- Native stack trace -----

 1: 0xc22b83 node::Assert(node::AssertionInfo const&) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 2: 0xcab0e5 node::WorkerThreadsTaskRunner::WorkerThreadsTaskRunner(int) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 3: 0xcab1d0 node::NodePlatform::NodePlatform(int, v8::TracingController*, v8::PageAllocator*) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 4: 0xbd1c5d  [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 5: 0xbd3bbc node::Start(int, char**) [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
 6: 0x7fe0c17934d8  [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 7: 0x7fe0c179359b __libc_start_main [/nix/store/g2jzxk3s7cnkhh8yq55l4fbvf639zy37-glibc-2.40-66/lib/libc.so.6]
 8: 0xae5355 _start [/nix/store/lz7iav1hd92jbv44zf2rdd7b2mj23536-nodejs-20.19.3/bin/node]
FAIL utils/mockAxios.test.js
  ● Test suite failed to run

    A jest worker process (pid=1294) was terminated by another process: signal=SIGABRT, exitCode=null. Operating system logs may contain more information on why this occurred.

      at ChildProcessWorker._onExit (node_modules/jest-worker/build/index.js:968:23)

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
Time:        3.403 s
Ran all test suites matching utils/mockAxios.test.js.

```

### Duration: 14185ms

---

## Summary

- Total failed tests: 62
- Failed test files: lib/logUtils.test.js, qtests-runner.test.js, lib/testGenerator.test.js, test/dualModuleGeneration.test.js, lib/coreUtils.test.js, index.test.js, jest.config.test.js, lib/dataUtils.test.js, lib/envUtils.test.js, lib/httpUtils.test.js, test/qtests-dogfood.test.js, lib/setup.test.js, lib/testUtils.test.js, test/axiosStub.test.js, test/mockConsole.test.js, test/indexExports.test.js, test/edgeCases.test.js, test/httpTest.test.js, test/mockUtils.test.js, test/testGenerator.test.js, test/testSuite.test.js, test/logUtils.test.js, test/moduleSystemIntegration.test.js, tests/integration/example__put.test.js, tests/integration/utils__httpTest.test.js, tests/integration/utils__httpTest__get.test.js, utils/email/emailFormatter.test.js, utils/email/emailHistory.test.js, utils/email/emailSender.test.js, utils/email/emailTemplate.test.js, test/offlineIntegration.test.js, test/resolveStubPaths.test.js, test/safeSerialize.test.js, test/setupMultiple.test.js, test/setupResolution.test.js, test/stubMethod.test.js, test/testEnv.test.js, utils/helpers/qerrorsStub.test.js, tests/integration/example.test.js, test/testHelpers.test.js, tests/integration/example__get.test.js, tests/integration/example__post.test.js, utils/email/emailValidator.test.js, utils/helpers/consoleMocker.test.js, utils/helpers/envManager.test.js, utils/helpers/keyGenerator.test.js, utils/helpers/moduleReloader.test.js, utils/helpers/responseMocker.test.js, utils/httpTest.test.js, utils/mockConsole.test.js, utils/models/apiKeyModel.test.js, utils/testing/mockManager.test.js, utils/models/baseMockModel.test.js, utils/testSuite.test.js, utils/testing/databaseTestHelper.test.js, utils/models/apiLogModel.test.js, utils/models/modelFactory.test.js, utils/stubMethod.test.js, utils/testEnv.test.js, utils/testHelpers.test.js, utils/testing/assertionHelper.test.js, utils/mockAxios.test.js
- Generated: 2025-08-19T16:16:44.779Z
