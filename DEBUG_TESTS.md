# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: /home/runner/workspace/tests/integration/demo__server__routes__hello__get.test.js

### Output:
```
[1m[31m  [1m● [22m[1mGET /hello › should succeed[39m[22m

    TypeError: httpTest.supertest(...).get(...).expect(...).end is not a function
[2m[22m
[2m    [0m [90m 22 |[39m       [33m.[39m[36mget[39m([32m'/hello'[39m)[22m
[2m     [90m 23 |[39m       [33m.[39mexpect([35m200[39m)[22m
[2m    [31m[1m>[22m[2m[39m[90m 24 |[39m       [33m.[39mend()[33m;[39m[22m
[2m     [90m    |[39m        [31m[1m^[22m[2m[39m[22m
[2m     [90m 25 |[39m     [22m
[2m     [90m 26 |[39m     expect(res[33m.[39mbody[33m.[39msuccess)[33m.[39mtoBe([36mtrue[39m)[33m;[39m[22m
[2m     [90m 27 |[39m   })[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Object.end ([22m[2m[0m[36mtests/integration/demo__server__routes__hello__get.test.js[39m[0m[2m:24:8)[22m[2m[22m

[1m[31m  [1m● [22m[1mGET /hello › should handle error responses[39m[22m

    TypeError: httpTest.supertest(...).get(...).expect(...).end is not a function
[2m[22m
[2m    [0m [90m 38 |[39m       [33m.[39m[36mget[39m([32m'/hello'[39m)[22m
[2m     [90m 39 |[39m       [33m.[39mexpect([35m400[39m)[22m
[2m    [31m[1m>[22m[2m[39m[90m 40 |[39m       [33m.[39mend()[33m;[39m[22m
[2m     [90m    |[39m        [31m[1m^[22m[2m[39m[22m
[2m     [90m 41 |[39m     [22m
[2m     [90m 42 |[39m     expect(res[33m.[39mbody[33m.[39merror)[33m.[39mtoBe([32m'Bad request'[39m)[33m;[39m[22m
[2m     [90m 43 |[39m   })[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Object.end ([22m[2m[0m[36mtests/integration/demo__server__routes__hello__get.test.js[39m[0m[2m:40:8)[22m[2m[22m

```

### Duration: 535ms

---

## Failed Test 2: /home/runner/workspace/tests/integration/demo__server__app__get.test.js

### Output:
```
[1m[31m  [1m● [22m[1mGET /health › should succeed[39m[22m

    TypeError: httpTest.supertest(...).get(...).expect(...).end is not a function
[2m[22m
[2m    [0m [90m 22 |[39m       [33m.[39m[36mget[39m([32m'/health'[39m)[22m
[2m     [90m 23 |[39m       [33m.[39mexpect([35m200[39m)[22m
[2m    [31m[1m>[22m[2m[39m[90m 24 |[39m       [33m.[39mend()[33m;[39m[22m
[2m     [90m    |[39m        [31m[1m^[22m[2m[39m[22m
[2m     [90m 25 |[39m     [22m
[2m     [90m 26 |[39m     expect(res[33m.[39mbody[33m.[39msuccess)[33m.[39mtoBe([36mtrue[39m)[33m;[39m[22m
[2m     [90m 27 |[39m   })[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Object.end ([22m[2m[0m[36mtests/integration/demo__server__app__get.test.js[39m[0m[2m:24:8)[22m[2m[22m

[1m[31m  [1m● [22m[1mGET /health › should handle error responses[39m[22m

    TypeError: httpTest.supertest(...).get(...).expect(...).end is not a function
[2m[22m
[2m    [0m [90m 38 |[39m       [33m.[39m[36mget[39m([32m'/health'[39m)[22m
[2m     [90m 39 |[39m       [33m.[39mexpect([35m400[39m)[22m
[2m    [31m[1m>[22m[2m[39m[90m 40 |[39m       [33m.[39mend()[33m;[39m[22m
[2m     [90m    |[39m        [31m[1m^[22m[2m[39m[22m
[2m     [90m 41 |[39m     [22m
[2m     [90m 42 |[39m     expect(res[33m.[39mbody[33m.[39merror)[33m.[39mtoBe([32m'Bad request'[39m)[33m;[39m[22m
[2m     [90m 43 |[39m   })[33m;[39m[0m[22m
[2m[22m
[2m      [2mat Object.end ([22m[2m[0m[36mtests/integration/demo__server__app__get.test.js[39m[0m[2m:40:8)[22m[2m[22m

```

### Duration: 70ms

---

## Summary

- Total failed tests: 2
- Failed test files: /home/runner/workspace/tests/integration/demo__server__routes__hello__get.test.js, /home/runner/workspace/tests/integration/demo__server__app__get.test.js
- Generated: 2025-12-12T07:02:42.278Z
