# Test Failure Analysis

**Creation Time:** 2025-08-19T13:23:07.784Z
**Pacific Time:** Tuesday, August 19, 2025 at 06:23:07 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: test/testEnv.test.js

### Output:
```
Error: Cannot parse /home/runner/workspace/test/temp_integration_project/package.json as JSON: ENOENT: no such file or directory, open '/home/runner/workspace/test/temp_integration_project/package.json'
    at Object.worker (/home/runner/workspace/node_modules/jest-haste-map/build/worker.js:267:13)
    at execFunction (/home/runner/workspace/node_modules/jest-worker/build/processChild.js:297:17)
    at execHelper (/home/runner/workspace/node_modules/jest-worker/build/processChild.js:285:5)
    at execMethod (/home/runner/workspace/node_modules/jest-worker/build/processChild.js:288:5)
    at process.messageListener (/home/runner/workspace/node_modules/jest-worker/build/processChild.js:196:7)
    at process.emit (node:events:524:28)
    at emit (node:internal/child_process:950:14)
    at process.processTicksAndRejections (node:internal/process/task_queues:83:21)

```

### Duration: 6585ms

---

## Failed Test 2: test/setupMultiple.test.js

### Output:
```
Error: Cannot parse /home/runner/workspace/test/temp_integration_project/package.json as JSON: ENOENT: no such file or directory, open '/home/runner/workspace/test/temp_integration_project/package.json'
    at Object.worker (/home/runner/workspace/node_modules/jest-haste-map/build/worker.js:267:13)
    at execFunction (/home/runner/workspace/node_modules/jest-worker/build/processChild.js:297:17)
    at execHelper (/home/runner/workspace/node_modules/jest-worker/build/processChild.js:285:5)
    at execMethod (/home/runner/workspace/node_modules/jest-worker/build/processChild.js:288:5)
    at process.messageListener (/home/runner/workspace/node_modules/jest-worker/build/processChild.js:196:7)
    at process.emit (node:events:524:28)
    at emit (node:internal/child_process:950:14)
    at process.processTicksAndRejections (node:internal/process/task_queues:83:21)

```

### Duration: 8603ms

---

## Summary

- Total failed tests: 2
- Failed test files: test/testEnv.test.js, test/setupMultiple.test.js
- Generated: 2025-08-19T13:23:07.809Z
