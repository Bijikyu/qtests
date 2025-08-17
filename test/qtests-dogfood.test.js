// qtests dogfooding demonstration - using qtests to test qtests utilities
// This shows qtests can replace Jest for most testing scenarios

const { runTestSuite, createAssertions } = require('../utils/runTestSuite');
const { mockConsole } = require('../utils/mockConsole');
const { setTestEnv, saveEnv, restoreEnv } = require('../utils/testEnv');
const stubMethod = require('../utils/stubMethod');

const assert = createAssertions();

// Test qtests mockConsole utility
const mockConsoleTests = [
  ['mockConsole captures calls', () => {
    const spy = mockConsole('log');
    console.log('captured message');
    assert.truthy(spy.mock.calls.length > 0, 'Should capture console calls');
    assert.truthy(spy.mock.calls.some(call => 
      call.some(arg => String(arg).includes('captured message'))
    ), 'Should capture message content');
    spy.mockRestore();
  }],

  ['mockConsole restores console', () => {
    const originalLog = console.log;
    const spy = mockConsole('log');
    spy.mockRestore();
    assert.equal(console.log, originalLog, 'Should restore original console.log');
  }]
];

// Test qtests testEnv utility  
const testEnvTests = [
  ['testEnv saves and restores environment', () => {
    process.env.TEST_VAR = 'original';
    const saved = saveEnv();
    process.env.TEST_VAR = 'modified';
    assert.equal(process.env.TEST_VAR, 'modified', 'Should set test environment');
    restoreEnv(saved);
    assert.equal(process.env.TEST_VAR, 'original', 'Should restore original environment');
  }],

  ['testEnv sets standard environment', () => {
    const saved = saveEnv();
    setTestEnv();
    assert.truthy(process.env.GOOGLE_API_KEY, 'Should set GOOGLE_API_KEY');
    assert.truthy(process.env.OPENAI_TOKEN, 'Should set OPENAI_TOKEN');
    restoreEnv(saved);
  }]
];

// Test qtests stubMethod utility
const stubMethodTests = [
  ['stubMethod creates working stubs', () => {
    const obj = { add: (a, b) => a + b };
    const restore = stubMethod(obj, 'add', () => 100);
    assert.equal(obj.add(2, 3), 100, 'Stubbed method should return stub value');
    restore();
    assert.equal(obj.add(2, 3), 5, 'Restored method should work normally');
  }],

  ['stubMethod error handling', () => {
    assert.throws(() => stubMethod(null, 'method', () => {}), 'Should throw for null object');
    assert.throws(() => stubMethod({}, 'missing', () => {}), 'Should throw for missing method');
  }]
];

// Run all test suites using qtests
if (require.main === module) {
  console.log('🐕 qtests Dogfooding Tests - Using qtests to test itself!');
  console.log('=' .repeat(60));
  
  const suites = [
    ['mockConsole Tests', mockConsoleTests],
    ['testEnv Tests', testEnvTests], 
    ['stubMethod Tests', stubMethodTests]
  ];
  
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const [suiteName, tests] of suites) {
    const results = runTestSuite(suiteName, tests);
    totalPassed += results.passed;
    totalFailed += results.failed;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`🎯 DOGFOODING SUMMARY: ${totalPassed} passed, ${totalFailed} failed`);
  console.log('qtests successfully testing itself with qtests utilities!');
  console.log('='.repeat(60));
  
  process.exit(totalFailed > 0 ? 1 : 0);
}