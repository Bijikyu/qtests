# Test Failure Analysis

Analyze and address the following test failures:

## Failed Test 1: /home/runner/workspace/tests/integration/demo__server__app__get.test.js

### Output:
```
  ● GET /health › should succeed

    TypeError: httpTest.supertest(...).get(...).expect(...).end is not a function

      22 |       .get('/health')
      23 |       .expect(200)
    > 24 |       .end();
         |        ^
      25 |     
      26 |     expect(res.body.success).toBe(true);
      27 |   });

      at Object.end (tests/integration/demo__server__app__get.test.js:24:8)

  ● GET /health › should handle error responses

    TypeError: httpTest.supertest(...).get(...).expect(...).end is not a function

      38 |       .get('/health')
      39 |       .expect(400)
    > 40 |       .end();
         |        ^
      41 |     
      42 |     expect(res.body.error).toBe('Bad request');
      43 |   });

      at Object.end (tests/integration/demo__server__app__get.test.js:40:8)

```

### Duration: 1029ms

---

## Failed Test 2: /home/runner/workspace/tests/integration/demo__server__routes__hello__get.test.js

### Output:
```
  ● GET /hello › should succeed

    TypeError: httpTest.supertest(...).get(...).expect(...).end is not a function

      22 |       .get('/hello')
      23 |       .expect(200)
    > 24 |       .end();
         |        ^
      25 |     
      26 |     expect(res.body.success).toBe(true);
      27 |   });

      at Object.end (tests/integration/demo__server__routes__hello__get.test.js:24:8)

  ● GET /hello › should handle error responses

    TypeError: httpTest.supertest(...).get(...).expect(...).end is not a function

      38 |       .get('/hello')
      39 |       .expect(400)
    > 40 |       .end();
         |        ^
      41 |     
      42 |     expect(res.body.error).toBe('Bad request');
      43 |   });

      at Object.end (tests/integration/demo__server__routes__hello__get.test.js:40:8)

```

### Duration: 96ms

---

## Summary

- Total failed tests: 2
- Failed test files: /home/runner/workspace/tests/integration/demo__server__app__get.test.js, /home/runner/workspace/tests/integration/demo__server__routes__hello__get.test.js
- Generated: 2025-12-12T20:45:04.939Z
