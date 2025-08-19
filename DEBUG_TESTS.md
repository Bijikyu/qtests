# Test Failure Analysis

**Creation Time:** 2025-08-19T09:23:08.121Z
**Pacific Time:** Tuesday, August 19, 2025 at 02:23:08 AM PDT

⚠️ **STALENESS WARNING:** If your code changes are after the creation time above and you are checking this file, then it is stale and tests need to be rerun.

Analyze and address the following test failures:

## Failed Test 1: test/edgeCases.test.js

### Output:
```
FAIL test/edgeCases.test.js
  Essential Edge Cases
    ✓ console method restoration works correctly (34 ms)
    ✕ environment backup and restore handles edge cases (1 ms)
    ✓ offline mode state changes work correctly (23 ms)

  ● Essential Edge Cases › environment backup and restore handles edge cases

    TypeError: backupEnvVars is not a function

      18 |
      19 |   test('environment backup and restore handles edge cases', () => {
    > 20 |     const backup = backupEnvVars();
         |                    ^
      21 |     
      22 |     process.env.TEST_EDGE = 'test value';
      23 |     restoreEnvVars(backup);

      at Object.backupEnvVars (test/edgeCases.test.js:20:20)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 passed, 3 total
Snapshots:   0 total
Time:        2.497 s
Ran all test suites matching /test\/edgeCases.test.js/i.

```

### Duration: 7091ms

---

## Failed Test 2: test/mockModels.test.js

### Output:
```
FAIL test/mockModels.test.js
  Mock Models Framework
    BaseMockModel
      ✓ creates instances with provided data (195 ms)
      ✓ generates unique IDs for each instance (76 ms)
      ✓ saves instances to collection (21 ms)
      ✓ updates existing instances on save (26 ms)
      ✓ removes instances from collection (47 ms)
    Static query methods
      ✓ findOne returns first matching document (37 ms)
      ✓ findOne returns null when no match found (72 ms)
      ✓ findOneAndDelete removes and returns document (90 ms)
      ✓ findOneAndDelete returns null when no match (22 ms)
      ✓ findOneAndUpdate modifies and returns document (20 ms)
      ✓ findOneAndUpdate returns null when no match (70 ms)
      ✕ findOneAndUpdate creates document with upsert option (71 ms)
    Query chaining with find()
      ✕ find() returns all documents by default (98 ms)
      ✕ find() filters by query (26 ms)
      ✕ sort() orders results ascending (19 ms)
      ✕ sort() orders results descending (66 ms)
      ✕ skip() skips specified number of documents (45 ms)
      ✕ limit() restricts number of results (40 ms)
      ✕ combines query, sort, skip, and limit (15 ms)
      ✕ exec() works as alias for lean() (11 ms)
    Bulk operations
      ✕ deleteMany() removes matching documents (25 ms)
      ✕ deleteMany() with empty query removes all documents (58 ms)
      ✕ updateMany() modifies matching documents (19 ms)
      ✕ countDocuments() returns matching count (26 ms)
    ApiKey model
      ✓ creates ApiKey instances with defaults (38 ms)
      ✓ saves to mockApiKeys array (6 ms)
      ✓ findOne works with legacy interface (7 ms)
      ✓ findOneAndDelete removes key (5 ms)
      ✓ findOneAndUpdate modifies key (6 ms)
      ✓ find() returns chain with lean() method (5 ms)
    ApiLog model
      ✓ creates ApiLog instances with defaults (11 ms)
      ✓ saves to mockLogs array (4 ms)
      ✓ find() filters by allowedApi (9 ms)
      ✓ find() returns all logs without query (11 ms)
      ✓ supports method chaining (6 ms)
    createMockModel factory
      ✓ creates new model class with specified name (22 ms)
      ✓ different models have separate collections (9 ms)
      ✕ models can be used independently (16 ms)
    Collection management
      ✓ resetAllCollections clears all data (8 ms)
      ✕ clearCollection clears specific model (7 ms)
    Edge cases and error handling
      ✕ handles empty queries correctly (7 ms)
      ✓ handles non-existent fields in queries (6 ms)
      ✓ maintains instance equality after operations (6 ms)

  ● Mock Models Framework › Static query methods › findOneAndUpdate creates document with upsert option

    TypeError: Cannot read properties of null (reading 'name')

      174 |       
      175 |       expect(result).toBeDefined();
    > 176 |       expect(result.name).toBe('new');
          |                     ^
      177 |       expect(result.status).toBe('created');
      178 |       expect(TestModel.getCollection()).toHaveLength(1);
      179 |     });

      at Object.name (test/mockModels.test.js:176:21)

  ● Mock Models Framework › Query chaining with find() › find() returns all documents by default

    TypeError: TestModel.find(...).lean is not a function

      195 |     
      196 |     test('find() returns all documents by default', async () => {
    > 197 |       const result = await TestModel.find().lean();
          |                                             ^
      198 |       
      199 |       expect(result).toHaveLength(4);
      200 |       expect(result.map(r => r.name)).toEqual(['alice', 'bob', 'charlie', 'david']);

      at Object.lean (test/mockModels.test.js:197:45)

  ● Mock Models Framework › Query chaining with find() › find() filters by query

    TypeError: TestModel.find(...).lean is not a function

      202 |     
      203 |     test('find() filters by query', async () => {
    > 204 |       const result = await TestModel.find({ type: 'user' }).lean();
          |                                                             ^
      205 |       
      206 |       expect(result).toHaveLength(3);
      207 |       expect(result.every(r => r.type === 'user')).toBe(true);

      at Object.lean (test/mockModels.test.js:204:61)

  ● Mock Models Framework › Query chaining with find() › sort() orders results ascending

    TypeError: TestModel.find(...).sort is not a function

      209 |     
      210 |     test('sort() orders results ascending', async () => {
    > 211 |       const result = await TestModel.find().sort({ age: 1 }).lean();
          |                                             ^
      212 |       
      213 |       expect(result.map(r => r.age)).toEqual([20, 25, 30, 35]);
      214 |       expect(result.map(r => r.name)).toEqual(['david', 'alice', 'bob', 'charlie']);

      at Object.sort (test/mockModels.test.js:211:45)

  ● Mock Models Framework › Query chaining with find() › sort() orders results descending

    TypeError: TestModel.find(...).sort is not a function

      216 |     
      217 |     test('sort() orders results descending', async () => {
    > 218 |       const result = await TestModel.find().sort({ age: -1 }).lean();
          |                                             ^
      219 |       
      220 |       expect(result.map(r => r.age)).toEqual([35, 30, 25, 20]);
      221 |       expect(result.map(r => r.name)).toEqual(['charlie', 'bob', 'alice', 'david']);

      at Object.sort (test/mockModels.test.js:218:45)

  ● Mock Models Framework › Query chaining with find() › skip() skips specified number of documents

    TypeError: TestModel.find(...).sort is not a function

      224 |     test('skip() skips specified number of documents', async () => {
      225 |       const result = await TestModel.find()
    > 226 |         .sort({ age: 1 })
          |          ^
      227 |         .skip(2)
      228 |         .lean();
      229 |       

      at Object.sort (test/mockModels.test.js:226:10)

  ● Mock Models Framework › Query chaining with find() › limit() restricts number of results

    TypeError: TestModel.find(...).sort is not a function

      234 |     test('limit() restricts number of results', async () => {
      235 |       const result = await TestModel.find()
    > 236 |         .sort({ age: 1 })
          |          ^
      237 |         .limit(2)
      238 |         .lean();
      239 |       

      at Object.sort (test/mockModels.test.js:236:10)

  ● Mock Models Framework › Query chaining with find() › combines query, sort, skip, and limit

    TypeError: TestModel.find(...).sort is not a function

      244 |     test('combines query, sort, skip, and limit', async () => {
      245 |       const result = await TestModel.find({ type: 'user' })
    > 246 |         .sort({ age: -1 })
          |          ^
      247 |         .skip(1)
      248 |         .limit(1)
      249 |         .lean();

      at Object.sort (test/mockModels.test.js:246:10)

  ● Mock Models Framework › Query chaining with find() › exec() works as alias for lean()

    TypeError: TestModel.find(...).exec is not a function

      254 |     
      255 |     test('exec() works as alias for lean()', async () => {
    > 256 |       const result = await TestModel.find({ type: 'user' }).exec();
          |                                                             ^
      257 |       
      258 |       expect(result).toHaveLength(3);
      259 |       expect(result.every(r => r.type === 'user')).toBe(true);

      at Object.exec (test/mockModels.test.js:256:61)

  ● Mock Models Framework › Bulk operations › deleteMany() removes matching documents

    TypeError: TestModel.deleteMany is not a function

      274 |     
      275 |     test('deleteMany() removes matching documents', async () => {
    > 276 |       const result = await TestModel.deleteMany({ status: 'inactive' });
          |                                      ^
      277 |       
      278 |       expect(result.deletedCount).toBe(1);
      279 |       expect(result.acknowledged).toBe(true);

      at Object.deleteMany (test/mockModels.test.js:276:38)

  ● Mock Models Framework › Bulk operations › deleteMany() with empty query removes all documents

    TypeError: TestModel.deleteMany is not a function

      283 |     
      284 |     test('deleteMany() with empty query removes all documents', async () => {
    > 285 |       const result = await TestModel.deleteMany({});
          |                                      ^
      286 |       
      287 |       expect(result.deletedCount).toBe(3);
      288 |       expect(TestModel.getCollection()).toHaveLength(0);

      at Object.deleteMany (test/mockModels.test.js:285:38)

  ● Mock Models Framework › Bulk operations › updateMany() modifies matching documents

    TypeError: TestModel.updateMany is not a function

      290 |     
      291 |     test('updateMany() modifies matching documents', async () => {
    > 292 |       const result = await TestModel.updateMany(
          |                                      ^
      293 |         { status: 'active' },
      294 |         { status: 'verified' }
      295 |       );

      at Object.updateMany (test/mockModels.test.js:292:38)

  ● Mock Models Framework › Bulk operations › countDocuments() returns matching count

    TypeError: TestModel.countDocuments is not a function

      304 |     
      305 |     test('countDocuments() returns matching count', async () => {
    > 306 |       const activeCount = await TestModel.countDocuments({ status: 'active' });
          |                                           ^
      307 |       const totalCount = await TestModel.countDocuments({});
      308 |       
      309 |       expect(activeCount).toBe(2);

      at Object.countDocuments (test/mockModels.test.js:306:43)

  ● Mock Models Framework › createMockModel factory › models can be used independently

    TypeError: Product.find(...).lean is not a function

      465 |       await new Category({ name: 'Tools' }).save();
      466 |       
    > 467 |       const products = await Product.find().lean();
          |                                             ^
      468 |       const categories = await Category.find().lean();
      469 |       
      470 |       expect(products).toHaveLength(1);

      at Object.lean (test/mockModels.test.js:467:45)

  ● Mock Models Framework › Collection management › clearCollection clears specific model

    TypeError: User.clearCollection is not a function

      501 |       await new Post({ title: 'Hello' }).save();
      502 |       
    > 503 |       User.clearCollection();
          |            ^
      504 |       
      505 |       expect(User.getCollection()).toHaveLength(0);
      506 |       expect(Post.getCollection()).toHaveLength(1);

      at Object.clearCollection (test/mockModels.test.js:503:12)

  ● Mock Models Framework › Edge cases and error handling › handles empty queries correctly

    TypeError: TestModel.find(...).lean is not a function

      514 |       await new TestModel({ name: 'test' }).save();
      515 |       
    > 516 |       const allDocs = await TestModel.find({}).lean();
          |                                                ^
      517 |       const foundDoc = await TestModel.findOne({});
      518 |       
      519 |       expect(allDocs).toHaveLength(1);

      at Object.lean (test/mockModels.test.js:516:48)

Test Suites: 1 failed, 1 total
Tests:       16 failed, 27 passed, 43 total
Snapshots:   0 total
Time:        4.229 s
Ran all test suites matching /test\/mockModels.test.js/i.

```

### Duration: 7956ms

---

## Failed Test 3: test/testEnv.test.js

### Output:
```
FAIL test/testEnv.test.js
  ✕ setTestEnv sets variables (6 ms)
  ✕ saveEnv and restoreEnv capture state (1 ms)
  ✓ createScheduleMock executes function immediately (106 ms)
  ✓ createQerrorsMock captures arguments (58 ms)
  ✓ createAxiosMock stores replies and resets (20 ms)
  ✓ createAxiosMock stores post replies (41 ms)
  ✓ resetMocks clears history on mocks (24 ms)
  ✕ initSearchTest sets env and returns mocks

  ● setTestEnv sets variables

    TypeError: withSavedEnv is not a function

      3 | const { withSavedEnv } = require("../utils/testHelpers"); //(import env helper)
      4 |
    > 5 | test('setTestEnv sets variables', () => withSavedEnv(() => { // (use helper to restore env)
        |                                         ^
      6 |   delete process.env.GOOGLE_API_KEY; // (remove old key)
      7 |   delete process.env.GOOGLE_CX; // (remove old cx)
      8 |   delete process.env.OPENAI_TOKEN; // (remove old token)

      at Object.withSavedEnv (test/testEnv.test.js:5:41)

  ● saveEnv and restoreEnv capture state

    TypeError: withSavedEnv is not a function

      13 | }));
      14 |
    > 15 | test('saveEnv and restoreEnv capture state', () => withSavedEnv(() => { // (verify env round trip)
         |                                                    ^
      16 |   process.env.TEST_ENV_TEMP = 'a'; // (set test variable)
      17 |   const saved = saveEnv(); // (capture environment)
      18 |   process.env.TEST_ENV_TEMP = 'b'; // (modify variable)

      at Object.withSavedEnv (test/testEnv.test.js:15:52)

  ● initSearchTest sets env and returns mocks

    TypeError: withSavedEnv is not a function

      79 |
      80 |
    > 81 | test('initSearchTest sets env and returns mocks', () => withSavedEnv(() => { // (wrap env lifecycle)
         |                                                         ^
      82 |   const { mock, scheduleMock, qerrorsMock } = initSearchTest(); // (initialize search test)
      83 |   expect(process.env.GOOGLE_API_KEY).toBe(defaultEnv.GOOGLE_API_KEY); // (env key set)
      84 |   expect(mock).toBeDefined(); // (axios mock present)

      at Object.withSavedEnv (test/testEnv.test.js:81:57)

Test Suites: 1 failed, 1 total
Tests:       3 failed, 5 passed, 8 total
Snapshots:   0 total
Time:        2.816 s
Ran all test suites matching /test\/testEnv.test.js/i.

```

### Duration: 5856ms

---

## Failed Test 4: test/testHelpers.test.js

### Output:
```
FAIL test/testHelpers.test.js
  Enhanced Test Helpers Framework
    stubQerrors with Node.js test module integration
      ✕ handles missing qerrors module gracefully (716 ms)
      ✕ logs function entry and completion (2 ms)
    Enhanced environment variable management
      ✕ selective backup captures only specified variables (1 ms)
      ✕ full backup captures entire environment (1 ms)
      ✕ selective restoration only restores specified variables
      ✕ complete restoration removes added variables (1 ms)
      ✕ handles undefined values correctly
      ✕ restoreEnvVars handles no backup parameter (14 ms)
    Enhanced generateKey with HTTP support
      ✕ generates direct API keys with suffix
      ✕ generates timestamp-based keys without suffix (1 ms)
      ✕ handles HTTP app testing mode (2 ms)
    Module reloading with thread safety
      ✕ reload prevents concurrent operations on same module (8 ms)
      ✕ reload handles non-existent modules gracefully (3 ms)
      ✕ moduleReloadLock is exposed for testing
    Response object creation with framework compatibility
      ✕ createJsonRes works with Jest spies (5 ms)
      ✕ createRes provides comprehensive response mock (4 ms)
      ✕ response mocks work without Jest (4 ms)
    Environment wrapper utilities
      ✕ withSavedEnv executes callback with environment restoration (1 ms)
      ✕ withSavedEnv handles callback errors properly (2 ms)
      ✕ withMockConsole executes callback with console restoration (3 ms)
    Integration scenarios
      ✕ combines environment management with module reloading (1 ms)
      ✕ response mocks work with multiple framework patterns (3 ms)
    Error handling and edge cases
      ✕ handles invalid backup objects gracefully (2 ms)
      ✕ module reload handles path resolution errors (5 ms)
      ✕ generateKey handles missing httpTest module (1 ms)

  ● Enhanced Test Helpers Framework › stubQerrors with Node.js test module integration › handles missing qerrors module gracefully

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › stubQerrors with Node.js test module integration › logs function entry and completion

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Enhanced environment variable management › selective backup captures only specified variables

    TypeError: backupEnvVars is not a function

      88 |     
      89 |     test('selective backup captures only specified variables', () => {
    > 90 |       const backup = backupEnvVars('ORIGINAL_VAR', 'NONEXISTENT_VAR');
         |                      ^
      91 |       
      92 |       expect(backup).toHaveProperty('ORIGINAL_VAR', 'original_value');
      93 |       expect(backup).toHaveProperty('NONEXISTENT_VAR', undefined);

      at Object.backupEnvVars (test/testHelpers.test.js:90:22)

  ● Enhanced Test Helpers Framework › Enhanced environment variable management › selective backup captures only specified variables

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Enhanced environment variable management › full backup captures entire environment

    TypeError: backupEnvVars is not a function

       96 |     
       97 |     test('full backup captures entire environment', () => {
    >  98 |       const backup = backupEnvVars();
          |                      ^
       99 |       
      100 |       expect(backup).toHaveProperty('ORIGINAL_VAR', 'original_value');
      101 |       expect(backup).toHaveProperty('MODIFY_VAR', 'will_be_modified');

      at Object.backupEnvVars (test/testHelpers.test.js:98:22)

  ● Enhanced Test Helpers Framework › Enhanced environment variable management › full backup captures entire environment

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Enhanced environment variable management › selective restoration only restores specified variables

    TypeError: backupEnvVars is not a function

      104 |     
      105 |     test('selective restoration only restores specified variables', () => {
    > 106 |       const backup = backupEnvVars('MODIFY_VAR');
          |                      ^
      107 |       
      108 |       // Modify variables
      109 |       process.env.MODIFY_VAR = 'modified_value';

      at Object.backupEnvVars (test/testHelpers.test.js:106:22)

  ● Enhanced Test Helpers Framework › Enhanced environment variable management › selective restoration only restores specified variables

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Enhanced environment variable management › complete restoration removes added variables

    TypeError: backupEnvVars is not a function

      118 |     
      119 |     test('complete restoration removes added variables', () => {
    > 120 |       const backup = backupEnvVars();
          |                      ^
      121 |       
      122 |       // Add new variable and modify existing
      123 |       process.env.NEW_VAR = 'new_value';

      at Object.backupEnvVars (test/testHelpers.test.js:120:22)

  ● Enhanced Test Helpers Framework › Enhanced environment variable management › complete restoration removes added variables

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Enhanced environment variable management › handles undefined values correctly

    TypeError: backupEnvVars is not a function

      134 |       // Create backup with undefined value
      135 |       delete process.env.MODIFY_VAR;
    > 136 |       const backup = backupEnvVars('MODIFY_VAR');
          |                      ^
      137 |       
      138 |       // Add the variable back
      139 |       process.env.MODIFY_VAR = 'added_back';

      at Object.backupEnvVars (test/testHelpers.test.js:136:22)

  ● Enhanced Test Helpers Framework › Enhanced environment variable management › handles undefined values correctly

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Enhanced environment variable management › restoreEnvVars handles no backup parameter

    expect(received).not.toThrow()

    Error name:    "TypeError"
    Error message: "restoreEnvVars is not a function"

          147 |     test('restoreEnvVars handles no backup parameter', () => {
          148 |       expect(() => {
        > 149 |         restoreEnvVars(); // Should not throw
              |         ^
          150 |       }).not.toThrow();
          151 |     });
          152 |   });

      at restoreEnvVars (test/testHelpers.test.js:149:9)
      at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
      at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
      at Object.toThrow (test/testHelpers.test.js:150:14)
      at Object.toThrow (test/testHelpers.test.js:150:14)

  ● Enhanced Test Helpers Framework › Enhanced environment variable management › restoreEnvVars handles no backup parameter

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Enhanced generateKey with HTTP support › generates direct API keys with suffix

    TypeError: generateKey is not a function

      155 |     
      156 |     test('generates direct API keys with suffix', async () => {
    > 157 |       const key = await generateKey('user');
          |                         ^
      158 |       
      159 |       expect(key).toBe('test-api-key-user');
      160 |     });

      at Object.generateKey (test/testHelpers.test.js:157:25)

  ● Enhanced Test Helpers Framework › Enhanced generateKey with HTTP support › generates direct API keys with suffix

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Enhanced generateKey with HTTP support › generates timestamp-based keys without suffix

    TypeError: generateKey is not a function

      161 |     
      162 |     test('generates timestamp-based keys without suffix', async () => {
    > 163 |       const key = await generateKey();
          |                         ^
      164 |       
      165 |       expect(key).toMatch(/^test-api-key-\d+$/);
      166 |     });

      at Object.generateKey (test/testHelpers.test.js:163:25)

  ● Enhanced Test Helpers Framework › Enhanced generateKey with HTTP support › generates timestamp-based keys without suffix

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Enhanced generateKey with HTTP support › handles HTTP app testing mode

    expect(received).toContain(expected) // indexOf

    Expected substring: "Cannot find module"
    Received string:    "generateKey is not a function"

      191 |       } catch (err) {
      192 |         // Expected if httpTest module is not available
    > 193 |         expect(err.message).toContain('Cannot find module');
          |                             ^
      194 |       }
      195 |     });
      196 |   });

      at Object.toContain (test/testHelpers.test.js:193:29)

  ● Enhanced Test Helpers Framework › Enhanced generateKey with HTTP support › handles HTTP app testing mode

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Module reloading with thread safety › reload prevents concurrent operations on same module

    Cannot find module '/home/runner/workspace/utils/utils/mockConsole' from 'utils/helpers/moduleReloader.js'

      34 |   try {
      35 |     moduleReloadLock.add(fullPath);
    > 36 |     delete require.cache[require.resolve(fullPath)];
         |                                  ^
      37 |     const mod = require(fullPath);
      38 |     moduleReloadLock.delete(fullPath);
      39 |     console.log(`reload is returning module`);

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at resolve (utils/helpers/moduleReloader.js:36:34)
      at Object.reload (test/testHelpers.test.js:204:23)

  ● Enhanced Test Helpers Framework › Module reloading with thread safety › reload prevents concurrent operations on same module

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Module reloading with thread safety › reload handles non-existent modules gracefully

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Module reloading with thread safety › moduleReloadLock is exposed for testing

    expect(received).toBeDefined()

    Received: undefined

      224 |     
      225 |     test('moduleReloadLock is exposed for testing', () => {
    > 226 |       expect(moduleReloadLock).toBeDefined();
          |                                ^
      227 |       expect(moduleReloadLock.has).toBeInstanceOf(Function);
      228 |       expect(moduleReloadLock.add).toBeInstanceOf(Function);
      229 |       expect(moduleReloadLock.delete).toBeInstanceOf(Function);

      at Object.toBeDefined (test/testHelpers.test.js:226:32)

  ● Enhanced Test Helpers Framework › Module reloading with thread safety › moduleReloadLock is exposed for testing

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Response object creation with framework compatibility › createJsonRes works with Jest spies

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Response object creation with framework compatibility › createRes provides comprehensive response mock

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Response object creation with framework compatibility › response mocks work without Jest

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Environment wrapper utilities › withSavedEnv executes callback with environment restoration

    TypeError: withSavedEnv is not a function

      302 |       process.env.TEST_WITH_SAVED = 'initial';
      303 |       
    > 304 |       const result = await withSavedEnv(() => {
          |                            ^
      305 |         // Modify environment inside callback
      306 |         process.env.TEST_WITH_SAVED = 'modified';
      307 |         process.env.TEMP_VAR = 'temporary';

      at Object.withSavedEnv (test/testHelpers.test.js:304:28)

  ● Enhanced Test Helpers Framework › Environment wrapper utilities › withSavedEnv executes callback with environment restoration

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Environment wrapper utilities › withSavedEnv handles callback errors properly

    expect(received).rejects.toThrow(expected)

    Expected substring: "Callback error"
    Received message:   "withSavedEnv is not a function"

          324 |       
          325 |       await expect(async () => {
        > 326 |         await withSavedEnv(() => {
              |               ^
          327 |           process.env.ERROR_TEST = 'modified';
          328 |           throw new Error('Callback error');
          329 |         });

      at withSavedEnv (test/testHelpers.test.js:326:15)
      at Object.toThrow (node_modules/expect/build/index.js:202:58)
      at Object.toThrow (test/testHelpers.test.js:330:18)
      at Object.toThrow (node_modules/expect/build/index.js:218:22)
      at Object.toThrow (test/testHelpers.test.js:330:18)

  ● Enhanced Test Helpers Framework › Environment wrapper utilities › withSavedEnv handles callback errors properly

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Environment wrapper utilities › withMockConsole executes callback with console restoration

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Integration scenarios › combines environment management with module reloading

    TypeError: backupEnvVars is not a function

      355 |     test('combines environment management with module reloading', () => {
      356 |       // Backup environment
    > 357 |       const envBackup = backupEnvVars('NODE_ENV');
          |                         ^
      358 |       
      359 |       // Modify environment
      360 |       process.env.NODE_ENV = 'test_integration';

      at Object.backupEnvVars (test/testHelpers.test.js:357:25)

  ● Enhanced Test Helpers Framework › Integration scenarios › combines environment management with module reloading

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Integration scenarios › response mocks work with multiple framework patterns

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Error handling and edge cases › handles invalid backup objects gracefully

    expect(received).not.toThrow()

    Error name:    "TypeError"
    Error message: "restoreEnvVars is not a function"

          393 |     test('handles invalid backup objects gracefully', () => {
          394 |       expect(() => {
        > 395 |         restoreEnvVars(null);
              |         ^
          396 |       }).not.toThrow();
          397 |       
          398 |       expect(() => {

      at restoreEnvVars (test/testHelpers.test.js:395:9)
      at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
      at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
      at Object.toThrow (test/testHelpers.test.js:396:14)
      at Object.toThrow (test/testHelpers.test.js:396:14)

  ● Enhanced Test Helpers Framework › Error handling and edge cases › handles invalid backup objects gracefully

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Error handling and edge cases › module reload handles path resolution errors

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

  ● Enhanced Test Helpers Framework › Error handling and edge cases › generateKey handles missing httpTest module

    expect(received).toMatch(expected)

    Expected pattern: /Cannot find module|require/
    Received string:  "generateKey is not a function"

      418 |         // Should either succeed or throw module not found error
      419 |       } catch (err) {
    > 420 |         expect(err.message).toMatch(/Cannot find module|require/);
          |                             ^
      421 |       }
      422 |     });
      423 |   });

      at Object.toMatch (test/testHelpers.test.js:420:29)

  ● Enhanced Test Helpers Framework › Error handling and edge cases › generateKey handles missing httpTest module

    TypeError: Cannot read properties of undefined (reading 'clear')

      33 |   afterEach(() => {
      34 |     // Clear module reload locks
    > 35 |     moduleReloadLock.clear();
         |                      ^
      36 |     
      37 |     // Restore environment if needed
      38 |     if (process.env.QTESTS_TEST_VAR) {

      at Object.clear (test/testHelpers.test.js:35:22)

Test Suites: 1 failed, 1 total
Tests:       25 failed, 25 total
Snapshots:   0 total
Time:        3.975 s
Ran all test suites matching /test\/testHelpers.test.js/i.

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/testHelpers.test.js.

      at buildLogger (node_modules/qerrors/lib/logger.js:152:33)

ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From test/testHelpers.test.js.

      at Object.get [as File] (node_modules/winston/lib/winston/transports/index.js:30:12)
      at node_modules/qerrors/lib/logger.js:164:57
      at buildLogger (node_modules/qerrors/lib/logger.js:171:11)
/home/runner/workspace/node_modules/qerrors/lib/logger.js:164
                                arr.push(new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error', ...rotationOpts, maxFiles: fileCap, format: fileFormat })); //(size-based rotation for error files with count limit)
                                         ^

TypeError: transports.File is not a constructor
    at /home/runner/workspace/node_modules/qerrors/lib/logger.js:164:42
    at buildLogger (/home/runner/workspace/node_modules/qerrors/lib/logger.js:171:11)

Node.js v20.19.3

```

### Duration: 8163ms

---

## Failed Test 5: test/testSuite.test.js

### Output:
```
FAIL test/testSuite.test.js
  testSuite utility
    DatabaseTestHelper
      ✓ sets up database models correctly (59 ms)
      ✓ tears down database correctly (6 ms)
      ✓ provides access to models after setup (40 ms)
      ✓ throws error when accessing models before setup (30 ms)
      ✓ creates suite with automatic setup (1 ms)
      ✓ clears model data on setup (21 ms)
    MockManager
      ✓ sets up API client mocks (9 ms)
      ✓ sets up API client mocks with custom responses (10 ms)
      ✓ sets up console mocks (8 ms)
      ✓ sets up environment mocks (25 ms)
      ✓ sets up email mocks (28 ms)
      ✕ sets up HTTP mocks with responses (5 ms)
      ✓ clears all mocks (97 ms)
      ✓ gets specific mock by name (19 ms)
    AssertionHelper
      ✓ asserts database entity properties (6 ms)
      ✓ throws error for invalid database entity (23 ms)
      ✓ throws error for wrong property values (4 ms)
      ✓ asserts API response structure (3 ms)
      ✓ throws error for wrong API response status (4 ms)
      ✓ asserts email sent successfully (68 ms)
      ✓ throws error when expected email not found (11 ms)
      ✕ asserts mock function calls (9 ms)
      ✓ throws error for wrong mock call count (12 ms)
    TestDataFactory
      ✓ creates user with default properties (4 ms)
      ✓ creates user with overrides (3 ms)
      ✓ creates API key with default properties (3 ms)
      ✓ creates log entry with default properties (28 ms)
      ✕ creates configuration with default properties (24 ms)
      ✕ creates multiple entities
      ✕ creates multiple entities with base overrides (12 ms)
      ✕ creates related entities (176 ms)
      ✓ increments counter for unique IDs (11 ms)
      ✓ resets counter (6 ms)
    PerformanceTestHelper
      ✓ measures operation time (14 ms)
      ✓ asserts timing constraint success (4 ms)
      ✓ asserts timing constraint failure (55 ms)
      ✓ tests concurrent operations (3 ms)
      ✕ measures memory usage (5 ms)
    TestSuiteBuilder
      ✕ builds basic test suite (1 ms)
      ✕ builds suite with database (8 ms)
      ✕ builds suite with API mocks
      ✕ builds suite with console mocks
      ✕ builds suite with environment mocks
      ✕ builds suite with email mocks
      ✕ builds suite with HTTP mocks (1 ms)
      ✕ builds suite with performance utilities
      ✕ builds suite with all features
      ✕ supports method chaining
      ✕ supports without auto cleanup
    integration scenarios
      ✕ complete database workflow with assertions (3 ms)
      ✕ mock management with API and email testing
      ✕ performance testing with data factory
      ✕ comprehensive test scenario with all utilities

  ● testSuite utility › MockManager › sets up HTTP mocks with responses

    TypeError: mockManager.setupHttpMocks is not a function

      158 |       ];
      159 |       
    > 160 |       const httpMocks = mockManager.setupHttpMocks(responses);
          |                                     ^
      161 |       
      162 |       expect(httpMocks.app).toBeDefined();
      163 |       expect(typeof httpMocks.supertest).toBe('function');

      at Object.setupHttpMocks (test/testSuite.test.js:160:37)

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

  ● testSuite utility › TestDataFactory › creates configuration with default properties

    expect(received).toMatch(expected)

    Expected pattern: /^Test Configuration \d+$/
    Received string:  "Test Config 1"

      355 |       
      356 |       expect(config.id).toMatch(/^config-\d+$/);
    > 357 |       expect(config.name).toMatch(/^Test Configuration \d+$/);
          |                           ^
      358 |       expect(config.environment).toBe('test');
      359 |       expect(config.settings).toBeDefined();
      360 |       expect(config.features).toBeDefined();

      at Object.toMatch (test/testSuite.test.js:357:27)

  ● testSuite utility › TestDataFactory › creates multiple entities

    TypeError: TestDataFactory.createMultiple is not a function

      363 |
      364 |     test('creates multiple entities', () => {
    > 365 |       const users = TestDataFactory.createMultiple(TestDataFactory.createUser, 3);
          |                                     ^
      366 |       
      367 |       expect(users).toHaveLength(3);
      368 |       expect(users[0].id).toBe('user-1');

      at Object.createMultiple (test/testSuite.test.js:365:37)

  ● testSuite utility › TestDataFactory › creates multiple entities with base overrides

    TypeError: TestDataFactory.createMultiple is not a function

      372 |
      373 |     test('creates multiple entities with base overrides', () => {
    > 374 |       const users = TestDataFactory.createMultiple(
          |                                     ^
      375 |         TestDataFactory.createUser,
      376 |         2,
      377 |         { isActive: false }

      at Object.createMultiple (test/testSuite.test.js:374:37)

  ● testSuite utility › TestDataFactory › creates related entities

    expect(received).toHaveLength(expected)

    Expected length: 4
    Received length: 1
    Received array:  [{"createdAt": 2025-08-19T09:22:56.254Z, "expiresAt": 2025-09-18T09:22:56.254Z, "id": "key-3", "isActive": true, "key": "test-api-key-3-8uzpv6hjd", "name": "Test API Key 3", "permissions": ["read", "write"], "userId": "user-1"}]

      392 |       
      393 |       expect(entities.users).toHaveLength(2);
    > 394 |       expect(entities.apiKeys).toHaveLength(4); // 2 users * 2 keys each
          |                                ^
      395 |       expect(entities.logs).toHaveLength(2); // 2 users * 1 log each
      396 |       expect(entities.configs).toHaveLength(1);
      397 |       

      at Object.toHaveLength (test/testSuite.test.js:394:32)

  ● testSuite utility › PerformanceTestHelper › measures memory usage

    expect(received).toBeDefined()

    Received: undefined

      479 |       
      480 |       expect(measurement.result).toBe(1000);
    > 481 |       expect(measurement.beforeMemory).toBeDefined();
          |                                        ^
      482 |       expect(measurement.afterMemory).toBeDefined();
      483 |       expect(measurement.memoryDelta).toBeDefined();
      484 |       expect(measurement.timestamp).toBeInstanceOf(Date);

      at Object.toBeDefined (test/testSuite.test.js:481:40)

  ● testSuite utility › TestSuiteBuilder › builds basic test suite

    TypeError: TestSuiteBuilder is not a constructor

      490 |
      491 |     beforeEach(() => {
    > 492 |       builder = new TestSuiteBuilder();
          |                 ^
      493 |     });
      494 |
      495 |     afterEach(() => {

      at Object.<anonymous> (test/testSuite.test.js:492:17)

  ● testSuite utility › TestSuiteBuilder › builds suite with database

    TypeError: TestSuiteBuilder is not a constructor

      490 |
      491 |     beforeEach(() => {
    > 492 |       builder = new TestSuiteBuilder();
          |                 ^
      493 |     });
      494 |
      495 |     afterEach(() => {

      at Object.<anonymous> (test/testSuite.test.js:492:17)

  ● testSuite utility › TestSuiteBuilder › builds suite with API mocks

    TypeError: TestSuiteBuilder is not a constructor

      490 |
      491 |     beforeEach(() => {
    > 492 |       builder = new TestSuiteBuilder();
          |                 ^
      493 |     });
      494 |
      495 |     afterEach(() => {

      at Object.<anonymous> (test/testSuite.test.js:492:17)

  ● testSuite utility › TestSuiteBuilder › builds suite with console mocks

    TypeError: TestSuiteBuilder is not a constructor

      490 |
      491 |     beforeEach(() => {
    > 492 |       builder = new TestSuiteBuilder();
          |                 ^
      493 |     });
      494 |
      495 |     afterEach(() => {

      at Object.<anonymous> (test/testSuite.test.js:492:17)

  ● testSuite utility › TestSuiteBuilder › builds suite with environment mocks

    TypeError: TestSuiteBuilder is not a constructor

      490 |
      491 |     beforeEach(() => {
    > 492 |       builder = new TestSuiteBuilder();
          |                 ^
      493 |     });
      494 |
      495 |     afterEach(() => {

      at Object.<anonymous> (test/testSuite.test.js:492:17)

  ● testSuite utility › TestSuiteBuilder › builds suite with email mocks

    TypeError: TestSuiteBuilder is not a constructor

      490 |
      491 |     beforeEach(() => {
    > 492 |       builder = new TestSuiteBuilder();
          |                 ^
      493 |     });
      494 |
      495 |     afterEach(() => {

      at Object.<anonymous> (test/testSuite.test.js:492:17)

  ● testSuite utility › TestSuiteBuilder › builds suite with HTTP mocks

    TypeError: TestSuiteBuilder is not a constructor

      490 |
      491 |     beforeEach(() => {
    > 492 |       builder = new TestSuiteBuilder();
          |                 ^
      493 |     });
      494 |
      495 |     afterEach(() => {

      at Object.<anonymous> (test/testSuite.test.js:492:17)

  ● testSuite utility › TestSuiteBuilder › builds suite with performance utilities

    TypeError: TestSuiteBuilder is not a constructor

      490 |
      491 |     beforeEach(() => {
    > 492 |       builder = new TestSuiteBuilder();
          |                 ^
      493 |     });
      494 |
      495 |     afterEach(() => {

      at Object.<anonymous> (test/testSuite.test.js:492:17)

  ● testSuite utility › TestSuiteBuilder › builds suite with all features

    TypeError: TestSuiteBuilder is not a constructor

      490 |
      491 |     beforeEach(() => {
    > 492 |       builder = new TestSuiteBuilder();
          |                 ^
      493 |     });
      494 |
      495 |     afterEach(() => {

      at Object.<anonymous> (test/testSuite.test.js:492:17)

  ● testSuite utility › TestSuiteBuilder › supports method chaining

    TypeError: TestSuiteBuilder is not a constructor

      490 |
      491 |     beforeEach(() => {
    > 492 |       builder = new TestSuiteBuilder();
          |                 ^
      493 |     });
      494 |
      495 |     afterEach(() => {

      at Object.<anonymous> (test/testSuite.test.js:492:17)

  ● testSuite utility › TestSuiteBuilder › supports without auto cleanup

    TypeError: TestSuiteBuilder is not a constructor

      490 |
      491 |     beforeEach(() => {
    > 492 |       builder = new TestSuiteBuilder();
          |                 ^
      493 |     });
      494 |
      495 |     afterEach(() => {

      at Object.<anonymous> (test/testSuite.test.js:492:17)

  ● testSuite utility › integration scenarios › complete database workflow with assertions

    TypeError: TestSuiteBuilder is not a constructor

      599 |       
      600 |       try {
    > 601 |         const suite = new TestSuiteBuilder()
          |                       ^
      602 |           .withoutAutoCleanup()
      603 |           .build();
      604 |         

      at Object.<anonymous> (test/testSuite.test.js:601:23)

  ● testSuite utility › integration scenarios › mock management with API and email testing

    TypeError: TestSuiteBuilder is not a constructor

      629 |
      630 |     test('mock management with API and email testing', () => {
    > 631 |       const suite = new TestSuiteBuilder()
          |                     ^
      632 |         .withApiMocks()
      633 |         .withEmailMocks()
      634 |         .withoutAutoCleanup()

      at Object.<anonymous> (test/testSuite.test.js:631:21)

  ● testSuite utility › integration scenarios › performance testing with data factory

    TypeError: TestSuiteBuilder is not a constructor

      650 |
      651 |     test('performance testing with data factory', async () => {
    > 652 |       const suite = new TestSuiteBuilder()
          |                     ^
      653 |         .withPerformance()
      654 |         .withoutAutoCleanup()
      655 |         .build();

      at Object.<anonymous> (test/testSuite.test.js:652:21)

  ● testSuite utility › integration scenarios › comprehensive test scenario with all utilities

    TypeError: TestSuiteBuilder is not a constructor

      667 |
      668 |     test('comprehensive test scenario with all utilities', async () => {
    > 669 |       const suite = new TestSuiteBuilder()
          |                     ^
      670 |         .withApiMocks()
      671 |         .withEmailMocks()
      672 |         .withConsoleMocks()

      at Object.<anonymous> (test/testSuite.test.js:669:21)

Test Suites: 1 failed, 1 total
Tests:       22 failed, 31 passed, 53 total
Snapshots:   0 total
Time:        3.827 s
Ran all test suites matching /test\/testSuite.test.js/i.

```

### Duration: 7711ms

---

## Summary

- Total failed tests: 5
- Failed test files: test/edgeCases.test.js, test/mockModels.test.js, test/testEnv.test.js, test/testHelpers.test.js, test/testSuite.test.js
- Generated: 2025-08-19T09:23:08.143Z
