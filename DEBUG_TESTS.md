# Test Failure Analysis

**Creation Time:** 2025-08-19T15:40:27.870Z
**Pacific Time:** Tuesday, August 19, 2025 at 08:40:27 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: lib/setup.test.js

### Output:
```
/home/runner/workspace/lib/setup.test.js:2
describe('setup.js basic exports', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/lib/setup.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 239ms

---

## Failed Test 2: lib/logUtils.test.js

### Output:
```
/home/runner/workspace/lib/logUtils.test.js:2
describe('logUtils.js basic exports', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/lib/logUtils.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 309ms

---

## Failed Test 3: lib/httpUtils.test.js

### Output:
```
/home/runner/workspace/lib/httpUtils.test.js:2
describe('httpUtils.js basic exports', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/lib/httpUtils.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 336ms

---

## Failed Test 4: lib/envUtils.test.js

### Output:
```
/home/runner/workspace/lib/envUtils.test.js:2
describe('envUtils.js basic exports', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/lib/envUtils.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 358ms

---

## Failed Test 5: jest.config.test.js

### Output:
```
/home/runner/workspace/jest.config.test.js:4
describe('jest.config.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/jest.config.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 389ms

---

## Failed Test 6: lib/dataUtils.test.js

### Output:
```
/home/runner/workspace/lib/dataUtils.test.js:2
describe('dataUtils.js basic exports', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/lib/dataUtils.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 393ms

---

## Failed Test 7: lib/coreUtils.test.js

### Output:
```
/home/runner/workspace/lib/coreUtils.test.js:2
describe('coreUtils.js basic exports', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/lib/coreUtils.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 422ms

---

## Failed Test 8: index.test.js

### Output:
```
/home/runner/workspace/index.test.js:2
describe('index.js basic exports', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/index.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 495ms

---

## Failed Test 9: lib/testGenerator.test.js

### Output:
```
/home/runner/workspace/lib/testGenerator.test.js:3
jest.mock('fs', () => ({ __esModule: true, default: jest.fn(), ...jest.requireActual('fs') }));
^

ReferenceError: jest is not defined
    at Object.<anonymous> (/home/runner/workspace/lib/testGenerator.test.js:3:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 369ms

---

## Failed Test 10: lib/testUtils.test.js

### Output:
```
/home/runner/workspace/lib/testUtils.test.js:4
describe('testUtils.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/lib/testUtils.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 392ms

---

## Failed Test 11: test/edgeCases.test.js

### Output:
```
/home/runner/workspace/test/edgeCases.test.js:9
describe('Essential Edge Cases', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/edgeCases.test.js:9:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 262ms

---

## Failed Test 12: test/logUtils.test.js

### Output:
```
/home/runner/workspace/test/logUtils.test.js:9
test('logStart logs correct start message', () => withMockConsole('log', spy => { //jest test for logStart with helper
^

ReferenceError: test is not defined
    at Object.<anonymous> (/home/runner/workspace/test/logUtils.test.js:9:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 241ms

---

## Failed Test 13: qtests-runner.test.js

### Output:
```
/home/runner/workspace/qtests-runner.test.js:3
jest.mock('fs', () => ({ __esModule: true, default: jest.fn(), ...jest.requireActual('fs') }));
^

ReferenceError: jest is not defined
    at Object.<anonymous> (/home/runner/workspace/qtests-runner.test.js:3:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 470ms

---

## Failed Test 14: test/mockConsole.test.js

### Output:
```
/home/runner/workspace/test/mockConsole.test.js:5
test('mockConsole captures calls and restores', async () => { //verify helper restores console
^

ReferenceError: test is not defined
    at Object.<anonymous> (/home/runner/workspace/test/mockConsole.test.js:5:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 297ms

---

## Failed Test 15: test/httpTest.test.js

### Output:
```
/home/runner/workspace/test/httpTest.test.js:2
describe('httpTest.js basic exports', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/httpTest.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 386ms

---

## Failed Test 16: test/mockUtils.test.js

### Output:
```
/home/runner/workspace/test/mockUtils.test.js:6
test('attachMockSpies uses jest spies when available', () => {
^

ReferenceError: test is not defined
    at Object.<anonymous> (/home/runner/workspace/test/mockUtils.test.js:6:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 373ms

---

## Failed Test 17: test/dualModuleGeneration.test.js

### Output:
```
/home/runner/workspace/test/dualModuleGeneration.test.js:2
describe('dualModuleGeneration basic tests', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/dualModuleGeneration.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 464ms

---

## Failed Test 18: test/axiosStub.test.js

### Output:
```
/home/runner/workspace/test/axiosStub.test.js:4
 test('stubs.axios.get returns enhanced response object', async () => {
 ^

ReferenceError: test is not defined
    at Object.<anonymous> (/home/runner/workspace/test/axiosStub.test.js:4:2)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 581ms

---

## Failed Test 19: test/qtests-dogfood.test.js

### Output:
```
/home/runner/workspace/test/qtests-dogfood.test.js:2
describe('qtests Dogfooding Tests', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/qtests-dogfood.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 292ms

---

## Failed Test 20: test/moduleSystemIntegration.test.js

### Output:
```
/home/runner/workspace/test/moduleSystemIntegration.test.js:2
describe('moduleSystemIntegration basic tests', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/moduleSystemIntegration.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 392ms

---

## Failed Test 21: test/offlineIntegration.test.js

### Output:
```
/home/runner/workspace/test/offlineIntegration.test.js:2
describe('offlineIntegration basic tests', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/offlineIntegration.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 396ms

---

## Failed Test 22: test/indexExports.test.js

### Output:
```
/home/runner/workspace/test/indexExports.test.js:8
 test('index exports expected modules', () => {
 ^

ReferenceError: test is not defined
    at Object.<anonymous> (/home/runner/workspace/test/indexExports.test.js:8:2)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 545ms

---

## Failed Test 23: test/safeSerialize.test.js

### Output:
```
/home/runner/workspace/test/safeSerialize.test.js:4
test('serializes primitives and objects', () => { //verify JSON path
^

ReferenceError: test is not defined
    at Object.<anonymous> (/home/runner/workspace/test/safeSerialize.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 310ms

---

## Failed Test 24: test/setupMultiple.test.js

### Output:
```
/home/runner/workspace/test/setupMultiple.test.js:4
describe('setup multiple calls', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/setupMultiple.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 288ms

---

## Failed Test 25: test/resolveStubPaths.test.js

### Output:
```
/home/runner/workspace/test/resolveStubPaths.test.js:2
describe('resolveStubPaths basic tests', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/resolveStubPaths.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 374ms

---

## Failed Test 26: test/stubMethod.test.js

### Output:
```
/home/runner/workspace/test/stubMethod.test.js:4
describe('stubMethod', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/stubMethod.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 265ms

---

## Failed Test 27: test/setupResolution.test.js

### Output:
```
/home/runner/workspace/test/setupResolution.test.js:3
describe('setup resolution', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/setupResolution.test.js:3:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 343ms

---

## Failed Test 28: test/testEnv.test.js

### Output:
```
/home/runner/workspace/test/testEnv.test.js:5
describe('testEnv utilities', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/testEnv.test.js:5:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 386ms

---

## Failed Test 29: tests/integration/example__put.test.js

### Output:
```
/home/runner/workspace/tests/integration/example__put.test.js:4
describe('PUT /api/users/:id', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/tests/integration/example__put.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 281ms

---

## Failed Test 30: tests/integration/example__post.test.js

### Output:
```
/home/runner/workspace/tests/integration/example__post.test.js:4
describe('POST /api/users', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/tests/integration/example__post.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 310ms

---

## Failed Test 31: test/testSuite.test.js

### Output:
```
/home/runner/workspace/test/testSuite.test.js:2
describe('testSuite basic tests', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/testSuite.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 383ms

---

## Failed Test 32: test/testGenerator.test.js

### Output:
```
/home/runner/workspace/test/testGenerator.test.js:2
describe('TestGenerator basic tests', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/testGenerator.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 462ms

---

## Failed Test 33: tests/integration/example__get.test.js

### Output:
```
/home/runner/workspace/tests/integration/example__get.test.js:4
describe('GET /api/status', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/tests/integration/example__get.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 403ms

---

## Failed Test 34: utils/email/emailHistory.test.js

### Output:
```
/home/runner/workspace/utils/email/emailHistory.test.js:4
describe('emailHistory.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/email/emailHistory.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 283ms

---

## Failed Test 35: tests/integration/example.test.js

### Output:
```
/home/runner/workspace/tests/integration/example.test.js:4
describe('GET /api/status', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/tests/integration/example.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 455ms

---

## Failed Test 36: utils/email/emailFormatter.test.js

### Output:
```
/home/runner/workspace/utils/email/emailFormatter.test.js:4
describe('emailFormatter.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/email/emailFormatter.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 341ms

---

## Failed Test 37: test/testHelpers.test.js

### Output:
```
/home/runner/workspace/test/testHelpers.test.js:4
describe('Test Helpers Basic Tests', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/testHelpers.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 548ms

---

## Failed Test 38: tests/integration/utils__httpTest.test.js

### Output:
```
/home/runner/workspace/tests/integration/utils__httpTest.test.js:2
describe('httpTest basic functionality', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/tests/integration/utils__httpTest.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 457ms

---

## Failed Test 39: tests/integration/utils__httpTest__get.test.js

### Output:
```
/home/runner/workspace/tests/integration/utils__httpTest__get.test.js:4
describe('GET /test', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/tests/integration/utils__httpTest__get.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 431ms

---

## Failed Test 40: utils/helpers/envManager.test.js

### Output:
```
/home/runner/workspace/utils/helpers/envManager.test.js:2
describe('envManager.js basic exports', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/helpers/envManager.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 182ms

---

## Failed Test 41: utils/helpers/consoleMocker.test.js

### Output:
```
/home/runner/workspace/utils/helpers/consoleMocker.test.js:2
describe('consoleMocker.js basic exports', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/helpers/consoleMocker.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 256ms

---

## Failed Test 42: utils/email/emailTemplate.test.js

### Output:
```
/home/runner/workspace/utils/email/emailTemplate.test.js:4
describe('emailTemplate.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/email/emailTemplate.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 325ms

---

## Failed Test 43: utils/email/emailValidator.test.js

### Output:
```
/home/runner/workspace/utils/email/emailValidator.test.js:4
describe('emailValidator.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/email/emailValidator.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 365ms

---

## Failed Test 44: utils/helpers/qerrorsStub.test.js

### Output:
```
/home/runner/workspace/utils/helpers/qerrorsStub.test.js:4
describe('qerrorsStub.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/helpers/qerrorsStub.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 277ms

---

## Failed Test 45: utils/mockConsole.test.js

### Output:
```
/home/runner/workspace/utils/mockConsole.test.js:4
describe('mockConsole.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/mockConsole.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 251ms

---

## Failed Test 46: utils/helpers/moduleReloader.test.js

### Output:
```
/home/runner/workspace/utils/helpers/moduleReloader.test.js:2
describe('moduleReloader.js basic exports', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/helpers/moduleReloader.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 338ms

---

## Failed Test 47: utils/httpTest.test.js

### Output:
```
/home/runner/workspace/utils/httpTest.test.js:4
describe('httpTest.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/httpTest.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 280ms

---

## Failed Test 48: utils/helpers/keyGenerator.test.js

### Output:
```
/home/runner/workspace/utils/helpers/keyGenerator.test.js:2
describe('keyGenerator.js basic exports', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/helpers/keyGenerator.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 378ms

---

## Failed Test 49: utils/email/emailSender.test.js

### Output:
```
/home/runner/workspace/utils/email/emailSender.test.js:4
describe('emailSender.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/email/emailSender.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 523ms

---

## Failed Test 50: utils/models/apiLogModel.test.js

### Output:
```
/home/runner/workspace/utils/models/apiLogModel.test.js:4
describe('apiLogModel.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/models/apiLogModel.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 331ms

---

## Failed Test 51: utils/models/apiKeyModel.test.js

### Output:
```
/home/runner/workspace/utils/models/apiKeyModel.test.js:4
describe('apiKeyModel.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/models/apiKeyModel.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 377ms

---

## Failed Test 52: utils/helpers/responseMocker.test.js

### Output:
```
/home/runner/workspace/utils/helpers/responseMocker.test.js:4
describe('responseMocker.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/helpers/responseMocker.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 538ms

---

## Failed Test 53: utils/models/baseMockModel.test.js

### Output:
```
/home/runner/workspace/utils/models/baseMockModel.test.js:4
describe('baseMockModel.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/models/baseMockModel.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 408ms

---

## Failed Test 54: utils/testing/assertionHelper.test.js

### Output:
```
/home/runner/workspace/utils/testing/assertionHelper.test.js:4
describe('assertionHelper.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/testing/assertionHelper.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 238ms

---

## Failed Test 55: utils/stubMethod.test.js

### Output:
```
/home/runner/workspace/utils/stubMethod.test.js:4
describe('stubMethod.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/stubMethod.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 361ms

---

## Failed Test 56: utils/testing/mockManager.test.js

### Output:
```
/home/runner/workspace/utils/testing/mockManager.test.js:4
describe('mockManager.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/testing/mockManager.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 254ms

---

## Failed Test 57: utils/models/modelFactory.test.js

### Output:
```
/home/runner/workspace/utils/models/modelFactory.test.js:4
describe('modelFactory.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/models/modelFactory.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 414ms

---

## Failed Test 58: utils/testEnv.test.js

### Output:
```
/home/runner/workspace/utils/testEnv.test.js:4
describe('testEnv.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/testEnv.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 349ms

---

## Failed Test 59: utils/testing/databaseTestHelper.test.js

### Output:
```
/home/runner/workspace/utils/testing/databaseTestHelper.test.js:4
describe('databaseTestHelper.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/testing/databaseTestHelper.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 277ms

---

## Failed Test 60: utils/testSuite.test.js

### Output:
```
/home/runner/workspace/utils/testSuite.test.js:4
describe('testSuite.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/testSuite.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 313ms

---

## Failed Test 61: utils/testHelpers.test.js

### Output:
```
/home/runner/workspace/utils/testHelpers.test.js:4
describe('testHelpers.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/testHelpers.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 327ms

---

## Failed Test 62: utils/testing/performanceTestHelper.test.js

### Output:
```
/home/runner/workspace/utils/testing/performanceTestHelper.test.js:4
describe('performanceTestHelper.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/testing/performanceTestHelper.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 215ms

---

## Failed Test 63: utils/testing/testDataFactory.test.js

### Output:
```
/home/runner/workspace/utils/testing/testDataFactory.test.js:4
describe('testDataFactory.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/testing/testDataFactory.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 216ms

---

## Failed Test 64: test/mockAxios.test.js

### Output:
```
/home/runner/workspace/test/mockAxios.test.js:2
describe('mockAxios functionality', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/mockAxios.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 144ms

---

## Failed Test 65: test/comprehensive.test.js

### Output:
```
/home/runner/workspace/test/comprehensive.test.js:10
describe('Additional qtests Coverage', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/comprehensive.test.js:10:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 166ms

---

## Failed Test 66: test/mockModels.test.js

### Output:
```
/home/runner/workspace/test/mockModels.test.js:12
describe('Mock Models Integration', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/mockModels.test.js:12:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 159ms

---

## Failed Test 67: test/integration.test.js

### Output:
```
/home/runner/workspace/test/integration.test.js:21
test('integration flow using stubs', () => withMockConsole('log', async logSpy => { //jest test executing searchTask with helper
^

ReferenceError: test is not defined
    at Object.<anonymous> (/home/runner/workspace/test/integration.test.js:21:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 222ms

---

## Failed Test 68: test/sendEmail.test.js

### Output:
```
/home/runner/workspace/test/sendEmail.test.js:7
describe('Send Email Integration', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/sendEmail.test.js:7:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 134ms

---

## Failed Test 69: test/runTestSuite.test.js

### Output:
```
/home/runner/workspace/test/runTestSuite.test.js:2
describe('runTestSuite.js basic exports', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/test/runTestSuite.test.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 146ms

---

## Failed Test 70: utils/mockAxios.test.js

### Output:
```
/home/runner/workspace/utils/mockAxios.test.js:4
describe('mockAxios.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/mockAxios.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 129ms

---

## Failed Test 71: utils/mockModels.test.js

### Output:
```
/home/runner/workspace/utils/mockModels.test.js:4
describe('mockModels.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/mockModels.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 133ms

---

## Failed Test 72: utils/runTestSuite.test.js

### Output:
```
/home/runner/workspace/utils/runTestSuite.test.js:4
describe('runTestSuite.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/runTestSuite.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 118ms

---

## Failed Test 73: utils/sendEmail.test.js

### Output:
```
/home/runner/workspace/utils/sendEmail.test.js:4
describe('sendEmail.js', () => {
^

ReferenceError: describe is not defined
    at Object.<anonymous> (/home/runner/workspace/utils/sendEmail.test.js:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1529:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1613:10)
    at Module.load (node:internal/modules/cjs/loader:1275:32)
    at Module._load (node:internal/modules/cjs/loader:1096:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.19.3

```

### Duration: 129ms

---

## Failed Test 74: test/offlineMode.test.js

### Output:
```

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at buildLogger (node_modules/qerrors/lib/logger.js:152:33)

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at Object.get [as File] (node_modules/winston/lib/winston/transports/index.js:30:12)
      at node_modules/qerrors/lib/logger.js:164:57
      at buildLogger (node_modules/qerrors/lib/logger.js:171:11)
/home/runner/workspace/node_modules/qerrors/lib/logger.js:164
                                arr.push(new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error', ...rotationOpts, maxFiles: fileCap, format: fileFormat })); //(size-based rotation for error files with count limit)
                                         ^

[TypeError: transports.File is not a constructor]

Node.js v20.19.3

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at buildLogger (node_modules/qerrors/lib/logger.js:152:33)

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at Object.get [as File] (node_modules/winston/lib/winston/transports/index.js:30:12)
      at node_modules/qerrors/lib/logger.js:164:57
      at buildLogger (node_modules/qerrors/lib/logger.js:171:11)
/home/runner/workspace/node_modules/qerrors/lib/logger.js:164
                                arr.push(new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error', ...rotationOpts, maxFiles: fileCap, format: fileFormat })); //(size-based rotation for error files with count limit)
                                         ^

[TypeError: transports.File is not a constructor]

Node.js v20.19.3

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at buildLogger (node_modules/qerrors/lib/logger.js:152:33)

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at Object.get [as File] (node_modules/winston/lib/winston/transports/index.js:30:12)
      at node_modules/qerrors/lib/logger.js:164:57
      at buildLogger (node_modules/qerrors/lib/logger.js:171:11)
/home/runner/workspace/node_modules/qerrors/lib/logger.js:164
                                arr.push(new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error', ...rotationOpts, maxFiles: fileCap, format: fileFormat })); //(size-based rotation for error files with count limit)
                                         ^

[TypeError: transports.File is not a constructor]

Node.js v20.19.3

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at buildLogger (node_modules/qerrors/lib/logger.js:152:33)

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/offlineMode.test.js.

      at Object.get [as File] (node_modules/winston/lib/winston/transports/index.js:30:12)
      at node_modules/qerrors/lib/logger.js:164:57
      at buildLogger (node_modules/qerrors/lib/logger.js:171:11)
/home/runner/workspace/node_modules/qerrors/lib/logger.js:164
                                arr.push(new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error', ...rotationOpts, maxFiles: fileCap, format: fileFormat })); //(size-based rotation for error files with count limit)
                                         ^

[TypeError: transports.File is not a constructor]

Node.js v20.19.3
FAIL test/offlineMode.test.js
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit

      at ChildProcessWorker.initialize (node_modules/jest-worker/build/index.js:805:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        10.165 s
Ran all test suites matching test/offlineMode.test.js.

```

### Duration: 12509ms

---

## Summary

- Total failed tests: 74
- Failed test files: lib/setup.test.js, lib/logUtils.test.js, lib/httpUtils.test.js, lib/envUtils.test.js, jest.config.test.js, lib/dataUtils.test.js, lib/coreUtils.test.js, index.test.js, lib/testGenerator.test.js, lib/testUtils.test.js, test/edgeCases.test.js, test/logUtils.test.js, qtests-runner.test.js, test/mockConsole.test.js, test/httpTest.test.js, test/mockUtils.test.js, test/dualModuleGeneration.test.js, test/axiosStub.test.js, test/qtests-dogfood.test.js, test/moduleSystemIntegration.test.js, test/offlineIntegration.test.js, test/indexExports.test.js, test/safeSerialize.test.js, test/setupMultiple.test.js, test/resolveStubPaths.test.js, test/stubMethod.test.js, test/setupResolution.test.js, test/testEnv.test.js, tests/integration/example__put.test.js, tests/integration/example__post.test.js, test/testSuite.test.js, test/testGenerator.test.js, tests/integration/example__get.test.js, utils/email/emailHistory.test.js, tests/integration/example.test.js, utils/email/emailFormatter.test.js, test/testHelpers.test.js, tests/integration/utils__httpTest.test.js, tests/integration/utils__httpTest__get.test.js, utils/helpers/envManager.test.js, utils/helpers/consoleMocker.test.js, utils/email/emailTemplate.test.js, utils/email/emailValidator.test.js, utils/helpers/qerrorsStub.test.js, utils/mockConsole.test.js, utils/helpers/moduleReloader.test.js, utils/httpTest.test.js, utils/helpers/keyGenerator.test.js, utils/email/emailSender.test.js, utils/models/apiLogModel.test.js, utils/models/apiKeyModel.test.js, utils/helpers/responseMocker.test.js, utils/models/baseMockModel.test.js, utils/testing/assertionHelper.test.js, utils/stubMethod.test.js, utils/testing/mockManager.test.js, utils/models/modelFactory.test.js, utils/testEnv.test.js, utils/testing/databaseTestHelper.test.js, utils/testSuite.test.js, utils/testHelpers.test.js, utils/testing/performanceTestHelper.test.js, utils/testing/testDataFactory.test.js, test/mockAxios.test.js, test/comprehensive.test.js, test/mockModels.test.js, test/integration.test.js, test/sendEmail.test.js, test/runTestSuite.test.js, utils/mockAxios.test.js, utils/mockModels.test.js, utils/runTestSuite.test.js, utils/sendEmail.test.js, test/offlineMode.test.js
- Generated: 2025-08-19T15:40:27.908Z
