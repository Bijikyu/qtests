# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: /home/runner/workspace/tests/integration/mockConsole.test.js

### Output:
```
[1m[31m  [1m● [22m[1mwithMockConsole › restores after callback throws[39m[22m

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m

    Expected: [32m[Function log][39m
    Received: [31m[Function anonymous][39m
[2m[22m
[2m    [0m [90m 158 |[39m     }[22m
[2m     [90m 159 |[39m     expect(threw)[33m.[39mtoBe([36mtrue[39m)[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 160 |[39m     expect(console[33m.[39mlog)[33m.[39mtoBe(orig)[33m;[39m[22m
[2m     [90m     |[39m                         [31m[1m^[22m[2m[39m[22m
[2m     [90m 161 |[39m   })[33m;[39m[22m
[2m     [90m 162 |[39m })[33m;[39m[22m
[2m     [90m 163 |[39m[0m[22m
[2m[22m
[2m      [2mat Object.toBe ([22m[2m[0m[36mtests/integration/mockConsole.test.js[39m[0m[2m:160:25)[22m[2m[22m

[1m[31m  [1m● [22m[1mmockAllConsole › returns mocks for all console methods[39m[22m

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m

    Expected: [32m"object"[39m
    Received: [31m"function"[39m
[2m[22m
[2m    [0m [90m 170 |[39m     [36mconst[39m mocks [33m=[39m mockAllConsole()[33m;[39m[22m
[2m     [90m 171 |[39m     expect([36mtypeof[39m mocks)[33m.[39mtoBe([32m'object'[39m)[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 172 |[39m     expect([36mtypeof[39m mocks[33m.[39mlog)[33m.[39mtoBe([32m'object'[39m)[33m;[39m[22m
[2m     [90m     |[39m                              [31m[1m^[22m[2m[39m[22m
[2m     [90m 173 |[39m     expect([36mtypeof[39m mocks[33m.[39mwarn)[33m.[39mtoBe([32m'object'[39m)[33m;[39m[22m
[2m     [90m 174 |[39m     expect([36mtypeof[39m mocks[33m.[39merror)[33m.[39mtoBe([32m'object'[39m)[33m;[39m[22m
[2m     [90m 175 |[39m     expect([36mtypeof[39m mocks[33m.[39minfo)[33m.[39mtoBe([32m'object'[39m)[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Object.toBe ([22m[2m[0m[36mtests/integration/mockConsole.test.js[39m[0m[2m:172:30)[22m[2m[22m

[1m[31m  [1m● [22m[1misMocked › returns true after mocking, false after restore[39m[22m

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m

    Expected: [32mfalse[39m
    Received: [31mtrue[39m
[2m[22m
[2m    [0m [90m 212 |[39m     expect(isMocked([32m'log'[39m))[33m.[39mtoBe([36mtrue[39m)[33m;[39m[22m
[2m     [90m 213 |[39m     mock[33m.[39mmockRestore()[33m;[39m[22m
[2m    [31m[1m>[22m[2m[39m[90m 214 |[39m     expect(isMocked([32m'log'[39m))[33m.[39mtoBe([36mfalse[39m)[33m;[39m[22m
[2m     [90m     |[39m                             [31m[1m^[22m[2m[39m[22m
[2m     [90m 215 |[39m   })[33m;[39m[22m
[2m     [90m 216 |[39m[22m
[2m     [90m 217 |[39m   test([32m'returns false for unmocked methods'[39m[33m,[39m () [33m=>[39m {[0m[22m
[2m[22m
[2m      [2mat Object.toBe ([22m[2m[0m[36mtests/integration/mockConsole.test.js[39m[0m[2m:214:29)[22m[2m[22m

```

### Duration: 1855ms

---

## Summary

- Total failed tests: 1
- Failed test files: /home/runner/workspace/tests/integration/mockConsole.test.js
- Generated: 2026-04-17T19:16:11.600Z
