# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: /home/runner/workspace/tests/integration/round11-bugs.test.ts

### Output:
```
[1m[31m  [1m● [22m[1mRound 11 Bug Fixes › testSetupFactory — no crash on import › exports testSetupFactory as a function[39m[22m

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m

    Expected: [32m"function"[39m
    Received: [31m"object"[39m
[2m[22m
[2m    [0m [90m 41 |[39m[22m
[2m     [90m 42 |[39m     test([32m'exports testSetupFactory as a function'[39m[33m,[39m () [33m=>[39m {[22m
[2m    [31m[1m>[22m[2m[39m[90m 43 |[39m       expect([36mtypeof[39m mod[33m.[39mtestSetupFactory)[33m.[39mtoBe([32m'function'[39m)[33m;[39m[22m
[2m     [90m    |[39m                                           [31m[1m^[22m[2m[39m[22m
[2m     [90m 44 |[39m     })[33m;[39m[22m
[2m     [90m 45 |[39m   })[33m;[39m[22m
[2m     [90m 46 |[39m[0m[22m
[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/round11-bugs.test.ts[39m[0m[2m:43:43)[22m[2m[22m

```

### Duration: 728ms

---

## Summary

- Total failed tests: 1
- Failed test files: /home/runner/workspace/tests/integration/round11-bugs.test.ts
- Generated: 2026-04-17T19:52:59.791Z
