# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: /home/runner/workspace/tests/integration/round21-bugs.test.ts

### Output:
```
[1m[31m  [1m● [22m[1msafeExecution › safeGetProperty returns undefined for null obj[39m[22m

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBeUndefined[2m()[22m

    Received: [31mnull[39m
[2m[22m
[2m    [0m [90m 384 |[39m[22m
[2m     [90m 385 |[39m   it([32m'safeGetProperty returns undefined for null obj'[39m[33m,[39m () [33m=>[39m {[22m
[2m    [31m[1m>[22m[2m[39m[90m 386 |[39m     expect(safeGetProperty([36mnull[39m[33m,[39m [32m'x'[39m))[33m.[39mtoBeUndefined()[33m;[39m[22m
[2m     [90m     |[39m                                        [31m[1m^[22m[2m[39m[22m
[2m     [90m 387 |[39m   })[33m;[39m[22m
[2m     [90m 388 |[39m })[33m;[39m[22m
[2m     [90m 389 |[39m[0m[22m
[2m[22m
[2m      [2mat Object.<anonymous> ([22m[2m[0m[36mtests/integration/round21-bugs.test.ts[39m[0m[2m:386:40)[22m[2m[22m

```

### Duration: 827ms

---

## Summary

- Total failed tests: 1
- Failed test files: /home/runner/workspace/tests/integration/round21-bugs.test.ts
- Generated: 2026-04-17T23:38:12.546Z
