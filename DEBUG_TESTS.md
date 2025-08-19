# Test Failure Analysis

**Creation Time:** 2025-08-19T10:31:40.252Z
**Pacific Time:** Tuesday, August 19, 2025 at 03:31:40 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: test/dualModuleGeneration.test.js

### Output:
```
FAIL test/dualModuleGeneration.test.js
  qtests Dual Module System Test Generation
    CommonJS Export Detection
      ✓ should detect module.exports single function (8 ms)
      ✓ should detect module.exports object with multiple exports (3 ms)
      ✓ should detect exports.property assignments (2 ms)
      ✓ should detect module.exports.property assignments (3 ms)
    ES Module Export Detection
      ✓ should detect export const declarations (2 ms)
      ✓ should detect export function declarations (2 ms)
      ✓ should detect export class declarations (3 ms)
    Mixed Module Pattern Detection
      ✓ should handle files with both ES and CommonJS patterns (2 ms)
    Import Detection (CommonJS vs ES Modules)
      ✓ should detect CommonJS require statements (13 ms)
      ✓ should detect ES module import statements (2 ms)
      ✓ should filter out relative imports (2 ms)
    Test Generation for Different Module Systems
      ✕ should generate CommonJS-style tests for CommonJS projects (5 ms)
      ✕ should generate ES module-style tests for ES module projects (4 ms)
    Real File Analysis and Test Generation
      ✓ should analyze and generate tests for CommonJS files (4 ms)
      ✓ should analyze and generate tests for ES module files (5 ms)
    Edge Cases and Error Handling
      ✓ should handle files with no exports gracefully (3 ms)
      ✓ should handle malformed export patterns (1 ms)
      ✓ should handle files with comments containing export-like patterns (2 ms)

  ● qtests Dual Module System Test Generation › Test Generation for Different Module Systems › should generate CommonJS-style tests for CommonJS projects

    expect(received).toContain(expected) // indexOf

    Expected substring: "const mod = require("
    Received string:    "// Auto-generated unit test for mathUtils.js
    // PARALLEL-SAFE DESIGN: This test avoids race conditions by:
    // - Using unique test identifiers (hrtime + random)
    // - Isolated mock state per test
    // - No shared global variables
    // - Test-scoped data generation·
    // Unique test session ID for parallel execution safety
    const testSessionId = `${process.hrtime.bigint()}-${Math.random().toString(36).substr(2, 9)}`;·
    const moduleUnderTest = require('./mathUtils.js');·
    describe(`mathUtils.js [${testSessionId}]`, () => {
      // Isolated test data for each test function
      const createUniqueTestData = (prefix = 'test') => ({
        id: `${prefix}-${testSessionId}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        timestamp: new Date(),
        sessionId: testSessionId
      });·
      test('add works', async () => {
        // Unique test data for this specific test execution
        const testData = createUniqueTestData('add');·····
        // Verify function exists and is callable
        expect(typeof moduleUnderTest.add).toBeDefined();
        expect(typeof moduleUnderTest.add).not.toBe('undefined');·····
        // TODO: Add specific test logic using testData for uniqueness
        // Example: const result = await moduleUnderTest.add(testData);
        // expect(result).toBeDefined();
      });·
    });
    "

      225 |       
      226 |       // Should use require syntax
    > 227 |       expect(testContent).toContain('const mod = require(');
          |                           ^
      228 |       expect(testContent).not.toContain('import');
      229 |       expect(testContent).toContain("describe('mathUtils.js'");
      230 |       expect(testContent).toContain("test('add works'");

      at Object.toContain (test/dualModuleGeneration.test.js:227:27)

  ● qtests Dual Module System Test Generation › Test Generation for Different Module Systems › should generate ES module-style tests for ES module projects

    expect(received).toContain(expected) // indexOf

    Expected substring: "import * as mod from"
    Received string:    "// Auto-generated unit test for dataProcessor.js
    // PARALLEL-SAFE DESIGN: This test avoids race conditions by:
    // - Using unique test identifiers (hrtime + random)
    // - Isolated mock state per test
    // - No shared global variables
    // - Test-scoped data generation·
    // Unique test session ID for parallel execution safety
    const testSessionId = `${process.hrtime.bigint()}-${Math.random().toString(36).substr(2, 9)}`;·
    import * as moduleUnderTest from './dataProcessor.js';·
    describe(`dataProcessor.js [${testSessionId}]`, () => {
      // Isolated test data for each test function
      const createUniqueTestData = (prefix = 'test') => ({
        id: `${prefix}-${testSessionId}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        timestamp: new Date(),
        sessionId: testSessionId
      });·
      test('process works', async () => {
        // Unique test data for this specific test execution
        const testData = createUniqueTestData('process');·····
        // Verify function exists and is callable
        expect(typeof moduleUnderTest.process).toBeDefined();
        expect(typeof moduleUnderTest.process).not.toBe('undefined');·····
        // TODO: Add specific test logic using testData for uniqueness
        // Example: const result = await moduleUnderTest.process(testData);
        // expect(result).toBeDefined();
      });·
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
Tests:       2 failed, 16 passed, 18 total
Snapshots:   0 total
Time:        2.101 s
Ran all test suites matching /test\/dualModuleGeneration.test.js/i.

```

### Duration: 16331ms

---

## Failed Test 2: test/mockModels.test.js

### Output:
```
FAIL test/mockModels.test.js (6.5 s)
  Mock Models Framework
    BaseMockModel
      ✓ creates instances with provided data (148 ms)
      ✓ generates unique IDs for each instance (62 ms)
      ✕ saves instances to collection (18 ms)
      ✕ updates existing instances on save (31 ms)
      ✕ removes instances from collection (41 ms)
    Static query methods
      ✕ findOne returns first matching document (27 ms)
      ✓ findOne returns null when no match found (42 ms)
      ✕ findOneAndDelete removes and returns document (32 ms)
      ✕ findOneAndDelete returns null when no match (19 ms)
      ✕ findOneAndUpdate modifies and returns document (19 ms)
      ✓ findOneAndUpdate returns null when no match (22 ms)
      ✕ findOneAndUpdate creates document with upsert option (27 ms)
    Query chaining with find()
      ✕ find() returns all documents by default (92 ms)
      ✕ find() filters by query (63 ms)
      ✕ sort() orders results ascending (62 ms)
      ✕ sort() orders results descending (128 ms)
      ✕ skip() skips specified number of documents (30 ms)
      ✕ limit() restricts number of results (36 ms)
      ✕ combines query, sort, skip, and limit (46 ms)
      ✕ exec() works as alias for lean() (44 ms)
    Bulk operations
      ✕ deleteMany() removes matching documents (35 ms)
      ✕ deleteMany() with empty query removes all documents (38 ms)
      ✕ updateMany() modifies matching documents (29 ms)
      ✕ countDocuments() returns matching count (33 ms)
    ApiKey model
      ✓ creates ApiKey instances with defaults (10 ms)
      ✓ saves to mockApiKeys array (9 ms)
      ✓ findOne works with legacy interface (15 ms)
      ✓ findOneAndDelete removes key (14 ms)
      ✓ findOneAndUpdate modifies key (15 ms)
      ✓ find() returns chain with lean() method (20 ms)
    ApiLog model
      ✓ creates ApiLog instances with defaults (21 ms)
      ✓ saves to mockLogs array (11 ms)
      ✓ find() filters by allowedApi (20 ms)
      ✓ find() returns all logs without query (11 ms)
      ✓ supports method chaining (8 ms)
    createMockModel factory
      ✓ creates new model class with specified name (18 ms)
      ✕ different models have separate collections (22 ms)
      ✕ models can be used independently (27 ms)
    Collection management
      ✕ resetAllCollections clears all data (26 ms)
      ✕ clearCollection clears specific model (21 ms)
    Edge cases and error handling
      ✕ handles empty queries correctly (14 ms)
      ✓ handles non-existent fields in queries (24 ms)
      ✕ maintains instance equality after operations (13 ms)

  ● Mock Models Framework › BaseMockModel › saves instances to collection

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      65 |       
      66 |       expect(saved).toBe(instance);
    > 67 |       expect(TestModel.getCollection()).toHaveLength(1);
         |                                         ^
      68 |       expect(TestModel.getCollection()[0]).toBe(instance);
      69 |     });
      70 |     

      at Object.toHaveLength (test/mockModels.test.js:67:41)

  ● Mock Models Framework › BaseMockModel › updates existing instances on save

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      77 |       await instance.save();
      78 |       
    > 79 |       expect(TestModel.getCollection()).toHaveLength(1);
         |                                         ^
      80 |       expect(TestModel.getCollection()[0].name).toBe('updated');
      81 |     });
      82 |     

      at Object.toHaveLength (test/mockModels.test.js:79:41)

  ● Mock Models Framework › BaseMockModel › removes instances from collection

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      85 |       await instance.save();
      86 |       
    > 87 |       expect(TestModel.getCollection()).toHaveLength(1);
         |                                         ^
      88 |       
      89 |       const removed = await instance.remove();
      90 |       

      at Object.toHaveLength (test/mockModels.test.js:87:41)

  ● Mock Models Framework › Static query methods › findOne returns first matching document

    TypeError: Cannot read properties of null (reading 'name')

      110 |       
      111 |       expect(result).toBeDefined();
    > 112 |       expect(result.name).toBe('first');
          |                     ^
      113 |       expect(result.type).toBe('A');
      114 |     });
      115 |     

      at Object.name (test/mockModels.test.js:112:21)

  ● Mock Models Framework › Static query methods › findOneAndDelete removes and returns document

    TypeError: Cannot read properties of null (reading 'name')

      129 |       
      130 |       expect(deleted).toBeDefined();
    > 131 |       expect(deleted.name).toBe('delete');
          |                      ^
      132 |       expect(TestModel.getCollection()).toHaveLength(1);
      133 |       expect(TestModel.getCollection()[0].name).toBe('keep');
      134 |     });

      at Object.name (test/mockModels.test.js:131:22)

  ● Mock Models Framework › Static query methods › findOneAndDelete returns null when no match

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      140 |       
      141 |       expect(result).toBeNull();
    > 142 |       expect(TestModel.getCollection()).toHaveLength(1);
          |                                         ^
      143 |     });
      144 |     
      145 |     test('findOneAndUpdate modifies and returns document', async () => {

      at Object.toHaveLength (test/mockModels.test.js:142:41)

  ● Mock Models Framework › Static query methods › findOneAndUpdate modifies and returns document

    TypeError: Cannot read properties of null (reading 'name')

      152 |       
      153 |       expect(updated).toBeDefined();
    > 154 |       expect(updated.name).toBe('original');
          |                      ^
      155 |       expect(updated.status).toBe('published');
      156 |       expect(TestModel.getCollection()[0].status).toBe('published');
      157 |     });

      at Object.name (test/mockModels.test.js:154:22)

  ● Mock Models Framework › Static query methods › findOneAndUpdate creates document with upsert option

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      176 |       expect(result.name).toBe('new');
      177 |       expect(result.status).toBe('created');
    > 178 |       expect(TestModel.getCollection()).toHaveLength(1);
          |                                         ^
      179 |     });
      180 |   });
      181 |   

      at Object.toHaveLength (test/mockModels.test.js:178:41)

  ● Mock Models Framework › Query chaining with find() › find() returns all documents by default

    expect(received).toHaveLength(expected)

    Expected length: 4
    Received length: 0
    Received array:  []

      197 |       const result = await TestModel.find().lean();
      198 |       
    > 199 |       expect(result).toHaveLength(4);
          |                      ^
      200 |       expect(result.map(r => r.name)).toEqual(['alice', 'bob', 'charlie', 'david']);
      201 |     });
      202 |     

      at Object.toHaveLength (test/mockModels.test.js:199:22)

  ● Mock Models Framework › Query chaining with find() › find() filters by query

    expect(received).toHaveLength(expected)

    Expected length: 3
    Received length: 0
    Received array:  []

      204 |       const result = await TestModel.find({ type: 'user' }).lean();
      205 |       
    > 206 |       expect(result).toHaveLength(3);
          |                      ^
      207 |       expect(result.every(r => r.type === 'user')).toBe(true);
      208 |     });
      209 |     

      at Object.toHaveLength (test/mockModels.test.js:206:22)

  ● Mock Models Framework › Query chaining with find() › sort() orders results ascending

    expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 1

    - Array [
    -   20,
    -   25,
    -   30,
    -   35,
    - ]
    + Array []

      211 |       const result = await TestModel.find().sort({ age: 1 }).lean();
      212 |       
    > 213 |       expect(result.map(r => r.age)).toEqual([20, 25, 30, 35]);
          |                                      ^
      214 |       expect(result.map(r => r.name)).toEqual(['david', 'alice', 'bob', 'charlie']);
      215 |     });
      216 |     

      at Object.toEqual (test/mockModels.test.js:213:38)

  ● Mock Models Framework › Query chaining with find() › sort() orders results descending

    expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 1

    - Array [
    -   35,
    -   30,
    -   25,
    -   20,
    - ]
    + Array []

      218 |       const result = await TestModel.find().sort({ age: -1 }).lean();
      219 |       
    > 220 |       expect(result.map(r => r.age)).toEqual([35, 30, 25, 20]);
          |                                      ^
      221 |       expect(result.map(r => r.name)).toEqual(['charlie', 'bob', 'alice', 'david']);
      222 |     });
      223 |     

      at Object.toEqual (test/mockModels.test.js:220:38)

  ● Mock Models Framework › Query chaining with find() › skip() skips specified number of documents

    expect(received).toHaveLength(expected)

    Expected length: 2
    Received length: 0
    Received array:  []

      228 |         .lean();
      229 |       
    > 230 |       expect(result).toHaveLength(2);
          |                      ^
      231 |       expect(result.map(r => r.name)).toEqual(['bob', 'charlie']);
      232 |     });
      233 |     

      at Object.toHaveLength (test/mockModels.test.js:230:22)

  ● Mock Models Framework › Query chaining with find() › limit() restricts number of results

    expect(received).toHaveLength(expected)

    Expected length: 2
    Received length: 0
    Received array:  []

      238 |         .lean();
      239 |       
    > 240 |       expect(result).toHaveLength(2);
          |                      ^
      241 |       expect(result.map(r => r.name)).toEqual(['david', 'alice']);
      242 |     });
      243 |     

      at Object.toHaveLength (test/mockModels.test.js:240:22)

  ● Mock Models Framework › Query chaining with find() › combines query, sort, skip, and limit

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      249 |         .lean();
      250 |       
    > 251 |       expect(result).toHaveLength(1);
          |                      ^
      252 |       expect(result[0].name).toBe('alice');
      253 |     });
      254 |     

      at Object.toHaveLength (test/mockModels.test.js:251:22)

  ● Mock Models Framework › Query chaining with find() › exec() works as alias for lean()

    expect(received).toHaveLength(expected)

    Expected length: 3
    Received length: 0
    Received array:  []

      256 |       const result = await TestModel.find({ type: 'user' }).exec();
      257 |       
    > 258 |       expect(result).toHaveLength(3);
          |                      ^
      259 |       expect(result.every(r => r.type === 'user')).toBe(true);
      260 |     });
      261 |   });

      at Object.toHaveLength (test/mockModels.test.js:258:22)

  ● Mock Models Framework › Bulk operations › deleteMany() removes matching documents

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      276 |       const result = await TestModel.deleteMany({ status: 'inactive' });
      277 |       
    > 278 |       expect(result.deletedCount).toBe(1);
          |                                   ^
      279 |       expect(result.acknowledged).toBe(true);
      280 |       expect(TestModel.getCollection()).toHaveLength(2);
      281 |       expect(TestModel.getCollection().every(doc => doc.status === 'active')).toBe(true);

      at Object.toBe (test/mockModels.test.js:278:35)

  ● Mock Models Framework › Bulk operations › deleteMany() with empty query removes all documents

    expect(received).toBe(expected) // Object.is equality

    Expected: 3
    Received: 0

      285 |       const result = await TestModel.deleteMany({});
      286 |       
    > 287 |       expect(result.deletedCount).toBe(3);
          |                                   ^
      288 |       expect(TestModel.getCollection()).toHaveLength(0);
      289 |     });
      290 |     

      at Object.toBe (test/mockModels.test.js:287:35)

  ● Mock Models Framework › Bulk operations › updateMany() modifies matching documents

    expect(received).toBe(expected) // Object.is equality

    Expected: 2
    Received: 0

      295 |       );
      296 |       
    > 297 |       expect(result.modifiedCount).toBe(2);
          |                                    ^
      298 |       expect(result.acknowledged).toBe(true);
      299 |       
      300 |       const docs = TestModel.getCollection();

      at Object.toBe (test/mockModels.test.js:297:36)

  ● Mock Models Framework › Bulk operations › countDocuments() returns matching count

    expect(received).toBe(expected) // Object.is equality

    Expected: 2
    Received: 0

      307 |       const totalCount = await TestModel.countDocuments({});
      308 |       
    > 309 |       expect(activeCount).toBe(2);
          |                           ^
      310 |       expect(totalCount).toBe(3);
      311 |     });
      312 |   });

      at Object.toBe (test/mockModels.test.js:309:27)

  ● Mock Models Framework › createMockModel factory › different models have separate collections

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      452 |       await new Post({ title: 'Hello' }).save();
      453 |       
    > 454 |       expect(User.getCollection()).toHaveLength(1);
          |                                    ^
      455 |       expect(Post.getCollection()).toHaveLength(1);
      456 |       expect(User.getCollection()[0].name).toBe('John');
      457 |       expect(Post.getCollection()[0].title).toBe('Hello');

      at Object.toHaveLength (test/mockModels.test.js:454:36)

  ● Mock Models Framework › createMockModel factory › models can be used independently

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      468 |       const categories = await Category.find().lean();
      469 |       
    > 470 |       expect(products).toHaveLength(1);
          |                        ^
      471 |       expect(categories).toHaveLength(1);
      472 |       expect(products[0].price).toBe(10);
      473 |       expect(categories[0].name).toBe('Tools');

      at Object.toHaveLength (test/mockModels.test.js:470:24)

  ● Mock Models Framework › Collection management › resetAllCollections clears all data

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      483 |       await new ApiLog({ message: 'test log' }).save();
      484 |       
    > 485 |       expect(User.getCollection()).toHaveLength(1);
          |                                    ^
      486 |       expect(mockApiKeys).toHaveLength(1);
      487 |       expect(mockLogs).toHaveLength(1);
      488 |       

      at Object.toHaveLength (test/mockModels.test.js:485:36)

  ● Mock Models Framework › Collection management › clearCollection clears specific model

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      504 |       
      505 |       expect(User.getCollection()).toHaveLength(0);
    > 506 |       expect(Post.getCollection()).toHaveLength(1);
          |                                    ^
      507 |     });
      508 |   });
      509 |   

      at Object.toHaveLength (test/mockModels.test.js:506:36)

  ● Mock Models Framework › Edge cases and error handling › handles empty queries correctly

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      517 |       const foundDoc = await TestModel.findOne({});
      518 |       
    > 519 |       expect(allDocs).toHaveLength(1);
          |                       ^
      520 |       expect(foundDoc).toBeDefined();
      521 |     });
      522 |     

      at Object.toHaveLength (test/mockModels.test.js:519:23)

  ● Mock Models Framework › Edge cases and error handling › maintains instance equality after operations

    expect(received).toBe(expected) // Object.is equality

    Expected: {"_id": "1zpsogyyhmeiel1f4", "name": "test"}
    Received: null

      538 |       
      539 |       const found = await TestModel.findOne({ name: 'test' });
    > 540 |       expect(found).toBe(instance);
          |                     ^
      541 |     });
      542 |   });
      543 | });

      at Object.toBe (test/mockModels.test.js:540:21)

Test Suites: 1 failed, 1 total
Tests:       26 failed, 17 passed, 43 total
Snapshots:   0 total
Time:        7.935 s
Ran all test suites matching /test\/mockModels.test.js/i.

```

### Duration: 13115ms

---

## Failed Test 3: test/moduleSystemIntegration.test.js

### Output:
```
FAIL test/moduleSystemIntegration.test.js
  qtests Module System Integration Tests
    CommonJS Project Integration
      ✕ should detect CommonJS project and generate appropriate tests (230 ms)
      ✕ should handle mixed CommonJS patterns in the same project (77 ms)
    ES Module Project Integration
      ✕ should detect ES module project and generate appropriate tests (103 ms)
    Mixed Project Detection
      ✓ should handle projects without package.json by analyzing source code (66 ms)
      ✓ should default to CommonJS when no clear pattern emerges (23 ms)
    API Route Detection Integration
      ✓ should generate API tests regardless of module system (67 ms)
    Performance and Edge Cases
      ✓ should handle large projects efficiently (890 ms)
      ✓ should gracefully handle files with syntax errors (77 ms)

  ● qtests Module System Integration Tests › CommonJS Project Integration › should detect CommonJS project and generate appropriate tests

    expect(received).toContain(expected) // indexOf

    Expected substring: "const mod = require("
    Received string:    "// Auto-generated unit test for mathUtils.js
    // PARALLEL-SAFE DESIGN: This test avoids race conditions by:
    // - Using unique test identifiers (hrtime + random)
    // - Isolated mock state per test
    // - No shared global variables
    // - Test-scoped data generation·
    // Unique test session ID for parallel execution safety
    const testSessionId = `${process.hrtime.bigint()}-${Math.random().toString(36).substr(2, 9)}`;·
    // Parallel-safe mock setup - isolated per test execution
    jest.mock('fs', () => ({
      __esModule: true,
      default: jest.fn(),
      // Each test gets fresh mock instances
      ...jest.requireActual('fs')
    }));·
    const moduleUnderTest = require('./mathUtils.js');·
    describe(`mathUtils.js [${testSessionId}]`, () => {
      // Isolated test data for each test function
      const createUniqueTestData = (prefix = 'test') => ({
        id: `${prefix}-${testSessionId}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        timestamp: new Date(),
        sessionId: testSessionId
      });·
      test('add works', async () => {
        // Unique test data for this specific test execution
        const testData = createUniqueTestData('add');·····
        // Verify function exists and is callable
        expect(typeof moduleUnderTest.add).toBeDefined();
        expect(typeof moduleUnderTest.add).not.toBe('undefined');·····
        // TODO: Add specific test logic using testData for uniqueness
        // Example: const result = await moduleUnderTest.add(testData);
        // expect(result).toBeDefined();
      });·
      test('multiply works', async () => {
        // Unique test data for this specific test execution
        const testData = createUniqueTestData('multiply');·····
        // Verify function exists and is callable
        expect(typeof moduleUnderTest.multiply).toBeDefined();
        expect(typeof moduleUnderTest.multiply).not.toBe('undefined');·····
        // TODO: Add specific test logic using testData for uniqueness
        // Example: const result = await moduleUnderTest.multiply(testData);
        // expect(result).toBeDefined();
      });·
      test('Calculator works', async () => {
        // Unique test data for this specific test execution
        const testData = createUniqueTestData('Calculator');·····
        // Verify function exists and is callable
        expect(typeof moduleUnderTest.Calculator).toBeDefined();
        expect(typeof moduleUnderTest.Calculator).not.toBe('undefined');·····
        // TODO: Add specific test logic using testData for uniqueness
        // Example: const result = await moduleUnderTest.Calculator(testData);
        // expect(result).toBeDefined();
      });·
    });
    "

      121 |       if (fs.existsSync(mathUtilsTestPath)) {
      122 |         const testContent = fs.readFileSync(mathUtilsTestPath, 'utf8');
    > 123 |         expect(testContent).toContain('const mod = require(');
          |                             ^
      124 |         expect(testContent).not.toContain('import');
      125 |         expect(testContent).toContain("test('add works'");
      126 |         expect(testContent).toContain("test('multiply works'");

      at Object.toContain (test/moduleSystemIntegration.test.js:123:29)

  ● qtests Module System Integration Tests › CommonJS Project Integration › should handle mixed CommonJS patterns in the same project

    expect(received).toContain(expected) // indexOf

    Expected substring: "const mod = require("
    Received string:    "// Auto-generated unit test for helpers.js
    // PARALLEL-SAFE DESIGN: This test avoids race conditions by:
    // - Using unique test identifiers (hrtime + random)
    // - Isolated mock state per test
    // - No shared global variables
    // - Test-scoped data generation·
    // Unique test session ID for parallel execution safety
    const testSessionId = `${process.hrtime.bigint()}-${Math.random().toString(36).substr(2, 9)}`;·
    const moduleUnderTest = require('./helpers.js');·
    describe(`helpers.js [${testSessionId}]`, () => {
      // Isolated test data for each test function
      const createUniqueTestData = (prefix = 'test') => ({
        id: `${prefix}-${testSessionId}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        timestamp: new Date(),
        sessionId: testSessionId
      });·
      test('helper1 works', async () => {
        // Unique test data for this specific test execution
        const testData = createUniqueTestData('helper1');·····
        // Verify function exists and is callable
        expect(typeof moduleUnderTest.helper1).toBeDefined();
        expect(typeof moduleUnderTest.helper1).not.toBe('undefined');·····
        // TODO: Add specific test logic using testData for uniqueness
        // Example: const result = await moduleUnderTest.helper1(testData);
        // expect(result).toBeDefined();
      });·
      test('helper2 works', async () => {
        // Unique test data for this specific test execution
        const testData = createUniqueTestData('helper2');·····
        // Verify function exists and is callable
        expect(typeof moduleUnderTest.helper2).toBeDefined();
        expect(typeof moduleUnderTest.helper2).not.toBe('undefined');·····
        // TODO: Add specific test logic using testData for uniqueness
        // Example: const result = await moduleUnderTest.helper2(testData);
        // expect(result).toBeDefined();
      });·
    });
    "

      174 |         if (fs.existsSync(testPath)) {
      175 |           const testContent = fs.readFileSync(testPath, 'utf8');
    > 176 |           expect(testContent).toContain('const mod = require(');
          |                               ^
      177 |         }
      178 |       });
      179 |     });

      at toContain (test/moduleSystemIntegration.test.js:176:31)
          at Array.forEach (<anonymous>)
      at Object.forEach (test/moduleSystemIntegration.test.js:171:15)

  ● qtests Module System Integration Tests › ES Module Project Integration › should detect ES module project and generate appropriate tests

    expect(received).toContain(expected) // indexOf

    Expected substring: "import * as mod from"
    Received string:    "// Auto-generated unit test for dataProcessor.js
    // PARALLEL-SAFE DESIGN: This test avoids race conditions by:
    // - Using unique test identifiers (hrtime + random)
    // - Isolated mock state per test
    // - No shared global variables
    // - Test-scoped data generation·
    // Unique test session ID for parallel execution safety
    const testSessionId = `${process.hrtime.bigint()}-${Math.random().toString(36).substr(2, 9)}`;·
    // Parallel-safe mock setup - isolated per test execution
    jest.mock('fs', () => ({
      __esModule: true,
      default: jest.fn(),
      // Each test gets fresh mock instances
      ...jest.requireActual('fs')
    }));·
    import * as moduleUnderTest from './dataProcessor.js';·
    describe(`dataProcessor.js [${testSessionId}]`, () => {
      // Isolated test data for each test function
      const createUniqueTestData = (prefix = 'test') => ({
        id: `${prefix}-${testSessionId}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        timestamp: new Date(),
        sessionId: testSessionId
      });·
      test('processData works', async () => {
        // Unique test data for this specific test execution
        const testData = createUniqueTestData('processData');·····
        // Verify function exists and is callable
        expect(typeof moduleUnderTest.processData).toBeDefined();
        expect(typeof moduleUnderTest.processData).not.toBe('undefined');·····
        // TODO: Add specific test logic using testData for uniqueness
        // Example: const result = await moduleUnderTest.processData(testData);
        // expect(result).toBeDefined();
      });·
      test('saveData works', async () => {
        // Unique test data for this specific test execution
        const testData = createUniqueTestData('saveData');·····
        // Verify function exists and is callable
        expect(typeof moduleUnderTest.saveData).toBeDefined();
        expect(typeof moduleUnderTest.saveData).not.toBe('undefined');·····
        // TODO: Add specific test logic using testData for uniqueness
        // Example: const result = await moduleUnderTest.saveData(testData);
        // expect(result).toBeDefined();
      });·
      test('DataManager works', async () => {
        // Unique test data for this specific test execution
        const testData = createUniqueTestData('DataManager');·····
        // Verify function exists and is callable
        expect(typeof moduleUnderTest.DataManager).toBeDefined();
        expect(typeof moduleUnderTest.DataManager).not.toBe('undefined');·····
        // TODO: Add specific test logic using testData for uniqueness
        // Example: const result = await moduleUnderTest.DataManager(testData);
        // expect(result).toBeDefined();
      });·
    });
    "

      251 |       if (fs.existsSync(dataProcessorTestPath)) {
      252 |         const testContent = fs.readFileSync(dataProcessorTestPath, 'utf8');
    > 253 |         expect(testContent).toContain('import * as mod from');
          |                             ^
      254 |         expect(testContent).not.toContain('require(');
      255 |         expect(testContent).toContain("test('processData works'");
      256 |         expect(testContent).toContain("test('saveData works'");

      at Object.toContain (test/moduleSystemIntegration.test.js:253:29)

Test Suites: 1 failed, 1 total
Tests:       3 failed, 5 passed, 8 total
Snapshots:   0 total
Time:        5.61 s
Ran all test suites matching /test\/moduleSystemIntegration.test.js/i.

```

### Duration: 12124ms

---

## Failed Test 4: test/testGenerator.test.js

### Output:
```
FAIL test/testGenerator.test.js
  TestGenerator Configuration
    ✓ should use default configuration (9 ms)
    ✓ should accept custom configuration (5 ms)
  TestGenerator File System
    ✓ should walk directory structure (42 ms)
  TestGenerator CLI
    ✕ should have executable CLI script (4 ms)
    ✓ should show help when requested (275 ms)
    ✓ should show version when requested (213 ms)
  TestGenerator Content Generation
    ✓ should generate unit test content (3 ms)
    ✓ should generate API test content (6 ms)

  ● TestGenerator CLI › should have executable CLI script

    expect(received).toBeTruthy()

    Received: 0

      72 |     
      73 |     const stats = fs.statSync(cliPath);
    > 74 |     expect(stats.mode & 0o111).toBeTruthy(); // Check executable bit
         |                                ^
      75 |   });
      76 |
      77 |   it('should show help when requested', () => {

      at Object.toBeTruthy (test/testGenerator.test.js:74:32)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 7 passed, 8 total
Snapshots:   0 total
Time:        6.521 s
Ran all test suites matching /test\/testGenerator.test.js/i.

```

### Duration: 11987ms

---

## Failed Test 5: test/testSuite.test.js

### Output:
```
FAIL test/testSuite.test.js
  testSuite utility
    DatabaseTestHelper
      ✓ sets up database models correctly (82 ms)
      ✓ tears down database correctly (32 ms)
      ✓ provides access to models after setup (10 ms)
      ✓ throws error when accessing models before setup (82 ms)
      ✓ creates suite with automatic setup (2 ms)
      ✓ clears model data on setup (62 ms)
    MockManager
      ✓ sets up API client mocks (34 ms)
      ✓ sets up API client mocks with custom responses (20 ms)
      ✓ sets up console mocks (25 ms)
      ✓ sets up environment mocks (63 ms)
      ✓ sets up email mocks (30 ms)
      ✕ sets up HTTP mocks with responses (13 ms)
      ✓ clears all mocks (20 ms)
      ✓ gets specific mock by name (11 ms)
    AssertionHelper
      ✓ asserts database entity properties (16 ms)
      ✕ throws error for invalid database entity (4 ms)
      ✕ throws error for wrong property values (33 ms)
      ✓ asserts API response structure (33 ms)
      ✓ throws error for wrong API response status (5 ms)
      ✓ asserts email sent successfully (33 ms)
      ✕ throws error when expected email not found (9 ms)
      ✕ asserts mock function calls (12 ms)
      ✓ throws error for wrong mock call count (7 ms)
    TestDataFactory
      ✕ creates user with default properties (13 ms)
      ✓ creates user with overrides (3 ms)
      ✕ creates API key with default properties (6 ms)
      ✕ creates log entry with default properties (4 ms)
      ✕ creates configuration with default properties (4 ms)
      ✕ creates multiple entities (95 ms)
      ✓ creates multiple entities with base overrides (30 ms)
      ✕ creates related entities (25 ms)
      ✕ increments counter for unique IDs (10 ms)
      ✕ resets counter (8 ms)
    PerformanceTestHelper
      ✓ measures operation time (16 ms)
      ✓ asserts timing constraint success (8 ms)
      ✓ asserts timing constraint failure (61 ms)
      ✓ tests concurrent operations (3 ms)
      ✓ measures memory usage (9 ms)
    TestSuiteBuilder
      ✓ builds basic test suite (6 ms)
      ✓ builds suite with database (3 ms)
      ✓ builds suite with API mocks (29 ms)
      ✓ builds suite with console mocks (7 ms)
      ✓ builds suite with environment mocks (21 ms)
      ✓ builds suite with email mocks (9 ms)
      ✓ builds suite with HTTP mocks (15 ms)
      ✓ builds suite with performance utilities (6 ms)
      ✓ builds suite with all features (10 ms)
      ✓ supports method chaining (18 ms)
      ✓ supports without auto cleanup (5 ms)
    integration scenarios
      ✓ complete database workflow with assertions (16 ms)
      ✓ mock management with API and email testing (67 ms)
      ✓ performance testing with data factory (551 ms)
      ✓ comprehensive test scenario with all utilities (28 ms)

  ● testSuite utility › MockManager › sets up HTTP mocks with responses

    expect(received).toBe(expected) // Object.is equality

    Expected: "function"
    Received: "undefined"

      162 |       expect(httpMocks.app).toBeDefined();
      163 |       expect(typeof httpMocks.supertest).toBe('function');
    > 164 |       expect(typeof httpMocks.request).toBe('function');
          |                                        ^
      165 |     });
      166 |
      167 |     test('clears all mocks', () => {

      at Object.toBe (test/testSuite.test.js:164:40)

  ● testSuite utility › AssertionHelper › throws error for invalid database entity

    expect(received).toThrow(expected)

    Expected substring: "Entity _id must be defined and truthy"

    Received function did not throw

      212 |       expect(() => {
      213 |         AssertionHelper.assertDatabaseEntity(entity, {});
    > 214 |       }).toThrow('Entity _id must be defined and truthy');
          |          ^
      215 |     });
      216 |
      217 |     test('throws error for wrong property values', () => {

      at Object.toThrow (test/testSuite.test.js:214:10)

  ● testSuite utility › AssertionHelper › throws error for wrong property values

    expect(received).toThrow(expected)

    Expected substring: "Expected entity.status to be active, but got inactive"
    Received message:   "Expected status to be 'active', but got 'inactive'"

          261 |       Object.keys(expectedProps).forEach(prop => {
          262 |         if (entity[prop] !== expectedProps[prop]) {
        > 263 |           throw new Error(`Expected ${prop} to be '${expectedProps[prop]}', but got '${entity[prop]}'`);
              |                 ^
          264 |         }
          265 |       });
          266 |

      at utils/testing/assertionHelper.js:263:17
                at Array.forEach (<anonymous>)
      at Function.forEach [as assertDatabaseEntity] (utils/testing/assertionHelper.js:261:34)
      at assertDatabaseEntity (test/testSuite.test.js:226:25)
      at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
      at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
      at Object.toThrow (test/testSuite.test.js:227:10)
      at Object.toThrow (test/testSuite.test.js:227:10)

  ● testSuite utility › AssertionHelper › throws error when expected email not found

    expect(received).toThrow(expected)

    Expected substring: "Expected at least 1 emails, but found 0"

    Received function did not throw

      270 |       expect(() => {
      271 |         AssertionHelper.assertEmailSent({ to: 'test@example.com' });
    > 272 |       }).toThrow('Expected at least 1 emails, but found 0');
          |          ^
      273 |     });
      274 |
      275 |     test('asserts mock function calls', () => {

      at Object.toThrow (test/testSuite.test.js:272:10)

  ● testSuite utility › AssertionHelper › asserts mock function calls

    expect(received).not.toThrow()

    Error name:    "Error"
    Error message: "Expected 1 calls, but got 2"

          171 |         
          172 |         if (callCount !== times) {
        > 173 |           throw new Error(`Expected ${times} calls, but got ${callCount}`);
              |                 ^
          174 |         }
          175 |         
          176 |         if (calledWith !== null && callCount > 0) {

      at Function.assertMockCalled (utils/testing/assertionHelper.js:173:17)
      at assertMockCalled (test/testSuite.test.js:285:25)
      at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
      at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
      at Object.toThrow (test/testSuite.test.js:286:14)
      at Object.toThrow (test/testSuite.test.js:286:14)

  ● testSuite utility › TestDataFactory › creates user with default properties

    expect(received).toMatch(expected)

    Expected pattern: /^user-\d+$/
    Received string:  "user-185585351454505-4po3x3x4e"

      305 |       const user = TestDataFactory.createUser();
      306 |       
    > 307 |       expect(user.id).toMatch(/^user-\d+$/);
          |                       ^
      308 |       expect(user.username).toMatch(/^testuser\d+$/);
      309 |       expect(user.email).toMatch(/^test\d+@example\.com$/);
      310 |       expect(user.firstName).toBe('Test');

      at Object.toMatch (test/testSuite.test.js:307:23)

  ● testSuite utility › TestDataFactory › creates API key with default properties

    expect(received).toMatch(expected)

    Expected pattern: /^key-\d+$/
    Received string:  "key-185585366301495-ogj5w6whp"

      331 |       const apiKey = TestDataFactory.createApiKey();
      332 |       
    > 333 |       expect(apiKey.id).toMatch(/^key-\d+$/);
          |                         ^
      334 |       expect(apiKey.key).toMatch(/^test-api-key-\d+-[a-z0-9]+$/);
      335 |       expect(apiKey.name).toMatch(/^Test API Key \d+$/);
      336 |       expect(apiKey.isActive).toBe(true);

      at Object.toMatch (test/testSuite.test.js:333:25)

  ● testSuite utility › TestDataFactory › creates log entry with default properties

    expect(received).toMatch(expected)

    Expected pattern: /^log-\d+$/
    Received string:  "log-185585372582335-j32jqa7vp"

      343 |       const logEntry = TestDataFactory.createLogEntry();
      344 |       
    > 345 |       expect(logEntry.id).toMatch(/^log-\d+$/);
          |                           ^
      346 |       expect(logEntry.message).toMatch(/^Test log message \d+$/);
      347 |       expect(logEntry.level).toBe('info');
      348 |       expect(logEntry.timestamp).toBeInstanceOf(Date);

      at Object.toMatch (test/testSuite.test.js:345:27)

  ● testSuite utility › TestDataFactory › creates configuration with default properties

    expect(received).toMatch(expected)

    Expected pattern: /^config-\d+$/
    Received string:  "config-185585378105445-6zdd51vbo"

      354 |       const config = TestDataFactory.createConfig();
      355 |       
    > 356 |       expect(config.id).toMatch(/^config-\d+$/);
          |                         ^
      357 |       expect(config.name).toMatch(/^Test Configuration \d+$/);
      358 |       expect(config.environment).toBe('test');
      359 |       expect(config.settings).toBeDefined();

      at Object.toMatch (test/testSuite.test.js:356:25)

  ● testSuite utility › TestDataFactory › creates multiple entities

    expect(received).toBe(expected) // Object.is equality

    Expected: "user-1"
    Received: "user-185585428701484-teq31qpup"

      366 |       
      367 |       expect(users).toHaveLength(3);
    > 368 |       expect(users[0].id).toBe('user-1');
          |                           ^
      369 |       expect(users[1].id).toBe('user-2');
      370 |       expect(users[2].id).toBe('user-3');
      371 |     });

      at Object.toBe (test/testSuite.test.js:368:27)

  ● testSuite utility › TestDataFactory › creates related entities

    expect(received).toHaveLength(expected)

    Matcher error: received value must have a length property whose value must be a number

    Received has value: undefined

      394 |       expect(entities.apiKeys).toHaveLength(4); // 2 users * 2 keys each
      395 |       expect(entities.logs).toHaveLength(2); // 2 users * 1 log each
    > 396 |       expect(entities.configs).toHaveLength(1);
          |                                ^
      397 |       
      398 |       // Check relationships
      399 |       expect(entities.apiKeys[0].userId).toBe(entities.users[0].id);

      at Object.toHaveLength (test/testSuite.test.js:396:32)

  ● testSuite utility › TestDataFactory › increments counter for unique IDs

    expect(received).toBe(expected) // Object.is equality

    Expected: "user-1"
    Received: "user-185585539057843-epdxapiii"

      405 |       const user2 = TestDataFactory.createUser();
      406 |       
    > 407 |       expect(user1.id).toBe('user-1');
          |                        ^
      408 |       expect(user2.id).toBe('user-2');
      409 |     });
      410 |

      at Object.toBe (test/testSuite.test.js:407:24)

  ● testSuite utility › TestDataFactory › resets counter

    expect(received).toBe(expected) // Object.is equality

    Expected: "user-1"
    Received: "user-185585553143623-h0jhsecbi"

      414 |       
      415 |       const user = TestDataFactory.createUser();
    > 416 |       expect(user.id).toBe('user-1'); // Counter reset
          |                       ^
      417 |     });
      418 |   });
      419 |

      at Object.toBe (test/testSuite.test.js:416:23)

Test Suites: 1 failed, 1 total
Tests:       13 failed, 40 passed, 53 total
Snapshots:   0 total
Time:        5.853 s
Ran all test suites matching /test\/testSuite.test.js/i.

```

### Duration: 11455ms

---

## Summary

- Total failed tests: 5
- Failed test files: test/dualModuleGeneration.test.js, test/mockModels.test.js, test/moduleSystemIntegration.test.js, test/testGenerator.test.js, test/testSuite.test.js
- Generated: 2025-08-19T10:31:40.271Z
