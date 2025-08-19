# Test Failure Analysis

**Creation Time:** 2025-08-19T08:41:23.308Z
**Pacific Time:** Tuesday, August 19, 2025 at 01:41:23 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: lib/testGenerator.test.js

### Output:
```
FAIL lib/testGenerator.test.js
  ● Test suite failed to run

    TypeError: test is not a function

      11 |
      12 | describe('testGenerator.js', () => {
    > 13 |   test('TestGenerator works', async () => {
         |   ^
      14 |     // Fast assertion - TODO: implement specific test logic
      15 |     expect(typeof mod.TestGenerator).toBeDefined();
      16 |   });

      at test (lib/testGenerator.test.js:13:3)
      at Object.describe (lib/testGenerator.test.js:12:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.501 s
Ran all test suites matching /lib\/testGenerator.test.js/i.

```

### Duration: 12987ms

---

## Failed Test 2: test/dualModuleGeneration.test.js

### Output:
```
FAIL test/dualModuleGeneration.test.js
  qtests Dual Module System Test Generation
    CommonJS Export Detection
      ✓ should detect module.exports single function (27 ms)
      ✓ should detect module.exports object with multiple exports (13 ms)
      ✓ should detect exports.property assignments (4 ms)
      ✓ should detect module.exports.property assignments (6 ms)
    ES Module Export Detection
      ✓ should detect export const declarations (4 ms)
      ✓ should detect export function declarations (9 ms)
      ✓ should detect export class declarations (8 ms)
    Mixed Module Pattern Detection
      ✓ should handle files with both ES and CommonJS patterns (4 ms)
    Import Detection (CommonJS vs ES Modules)
      ✓ should detect CommonJS require statements (17 ms)
      ✓ should detect ES module import statements (3 ms)
      ✓ should filter out relative imports (10 ms)
    Test Generation for Different Module Systems
      ✓ should generate CommonJS-style tests for CommonJS projects (13 ms)
      ✕ should generate ES module-style tests for ES module projects (10 ms)
    Real File Analysis and Test Generation
      ✓ should analyze and generate tests for CommonJS files (13 ms)
      ✓ should analyze and generate tests for ES module files (38 ms)
    Edge Cases and Error Handling
      ✓ should handle files with no exports gracefully (3 ms)
      ✓ should handle malformed export patterns (3 ms)
      ✓ should handle files with comments containing export-like patterns (2 ms)

  ● qtests Dual Module System Test Generation › Test Generation for Different Module Systems › should generate ES module-style tests for ES module projects

    expect(received).toContain(expected) // indexOf

    Expected substring: "import * as mod from"
    Received string:    "// Auto-generated unit test for dataProcessor.js - optimized for speed
    const mod = require('./dataProcessor.js');·
    describe('dataProcessor.js', () => {
      test('process works', async () => {
        // Fast assertion - TODO: implement specific test logic
        expect(typeof mod.process).toBeDefined();
      });
    });
    "

      247 |       
      248 |       // Should use import syntax
    > 249 |       expect(testContent).toContain('import * as mod from');
          |                           ^
      250 |       expect(testContent).not.toContain('require(');
      251 |       expect(testContent).toContain("describe('dataProcessor.js'");
      252 |       expect(testContent).toContain("test('process works'");

      at Object.toContain (test/dualModuleGeneration.test.js:249:27)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 17 passed, 18 total
Snapshots:   0 total
Time:        5.7 s
Ran all test suites matching /test\/dualModuleGeneration.test.js/i.

```

### Duration: 13117ms

---

## Failed Test 3: test/moduleSystemIntegration.test.js

### Output:
```
FAIL test/moduleSystemIntegration.test.js
  qtests Module System Integration Tests
    CommonJS Project Integration
      ✓ should detect CommonJS project and generate appropriate tests (143 ms)
      ✓ should handle mixed CommonJS patterns in the same project (101 ms)
    ES Module Project Integration
      ✕ should detect ES module project and generate appropriate tests (56 ms)
    Mixed Project Detection
      ✕ should handle projects without package.json by analyzing source code (19 ms)
      ✓ should default to CommonJS when no clear pattern emerges (11 ms)
    API Route Detection Integration
      ✓ should generate API tests regardless of module system (48 ms)
    Performance and Edge Cases
      ✓ should handle large projects efficiently (939 ms)
      ✓ should gracefully handle files with syntax errors (28 ms)

  ● qtests Module System Integration Tests › ES Module Project Integration › should detect ES module project and generate appropriate tests

    expect(received).toContain(expected) // indexOf

    Expected substring: "import * as mod from"
    Received string:    "// Auto-generated unit test for dataProcessor.js - optimized for speed
    // Mock external dependencies for speed
    jest.mock('fs', () => ({ __esModule: true, default: jest.fn(), ...jest.requireActual('fs') }));
    const mod = require('./dataProcessor.js');·
    describe('dataProcessor.js', () => {
      test('processData works', async () => {
        // Fast assertion - TODO: implement specific test logic
        expect(typeof mod.processData).toBeDefined();
      });
      test('saveData works', async () => {
        // Fast assertion - TODO: implement specific test logic
        expect(typeof mod.saveData).toBeDefined();
      });
      test('DataManager works', async () => {
        // Fast assertion - TODO: implement specific test logic
        expect(typeof mod.DataManager).toBeDefined();
      });
    });
    "

      245 |       if (fs.existsSync(dataProcessorTestPath)) {
      246 |         const testContent = fs.readFileSync(dataProcessorTestPath, 'utf8');
    > 247 |         expect(testContent).toContain('import * as mod from');
          |                             ^
      248 |         expect(testContent).not.toContain('require(');
      249 |         expect(testContent).toContain("test('processData works'");
      250 |         expect(testContent).toContain("test('saveData works'");

      at Object.toContain (test/moduleSystemIntegration.test.js:247:29)

  ● qtests Module System Integration Tests › Mixed Project Detection › should handle projects without package.json by analyzing source code

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      282 |       
      283 |       // Should detect ES modules due to prevalence
    > 284 |       expect(generator.isESModule).toBe(true);
          |                                    ^
      285 |       
      286 |       const results = generator.generate();
      287 |       expect(results.length).toBe(3); // All files should have tests generated

      at Object.toBe (test/moduleSystemIntegration.test.js:284:36)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 6 passed, 8 total
Snapshots:   0 total
Time:        4.34 s
Ran all test suites matching /test\/moduleSystemIntegration.test.js/i.

```

### Duration: 12719ms

---

## Summary

- Total failed tests: 3
- Failed test files: lib/testGenerator.test.js, test/dualModuleGeneration.test.js, test/moduleSystemIntegration.test.js
- Generated: 2025-08-19T08:41:23.337Z
