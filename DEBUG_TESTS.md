# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: /home/runner/workspace/tests/integration/round20-bugs.test.ts

### Output:
```
[1m[31m  [1m● [22m[1mtestUtils — testHelpers › withMockConsole suppresses console and restores it[39m[22m

    TypeError: fn is not a function
[2m[22m
[2m    [0m [90m 47 |[39m         registerMocked(method)[33m;[39m[22m
[2m     [90m 48 |[39m         [36mtry[39m {[22m
[2m    [31m[1m>[22m[2m[39m[90m 49 |[39m             [36mreturn[39m fn(spy)[33m;[39m[22m
[2m     [90m    |[39m                    [31m[1m^[22m[2m[39m[22m
[2m     [90m 50 |[39m         }[22m
[2m     [90m 51 |[39m         [36mfinally[39m {[22m
[2m     [90m 52 |[39m             spy[33m.[39mmockRestore()[33m;[39m[0m[22m
[2m[22m
[2m      [2mat fn ([22m[2mdist/utils/console/consoleUtils.js[2m:49:20)[22m[2m[22m
[2m      [2mat fn ([22m[2mdist/lib/errorHandling/errorLogging.js[2m:28:16)[22m[2m[22m
[2m      [2mat Object.withMockConsole ([22m[2mdist/utils/console/consoleUtils.js[2m:17:28)[22m[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/round20-bugs.test.ts[39m[0m[2m:439:17)[22m[2m[22m

```

### Duration: 598ms

---

## Summary

- Total failed tests: 1
- Failed test files: /home/runner/workspace/tests/integration/round20-bugs.test.ts
- Generated: 2026-04-17T23:30:31.005Z
