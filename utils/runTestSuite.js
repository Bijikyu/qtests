/**
 * Simple Test Suite Runner - TypeScript Implementation
 *
 * Lightweight test runner for simple testing scenarios where Jest or other
 * full-featured test frameworks might be overkill. Provides basic test
 * execution with pass/fail tracking and formatted console output.
 */
/**
 * Run a test suite with multiple test functions
 */
function runTestSuite(suiteName, testFunctions) {
    console.log(`\n🔧 Running: ${suiteName}`);
    console.log('-'.repeat(40));
    let passed = 0;
    let failed = 0;
    const failures = [];
    for (const [testName, testFn] of testFunctions) {
        try {
            console.log(`  ▶ ${testName}`);
            testFn();
            console.log(`    ✅ PASS`);
            passed++;
        }
        catch (error) {
            console.log(`    ❌ FAIL: ${error.message}`);
            failed++;
            failures.push({ test: testName, error: error.message });
        }
    }
    // Print summary
    console.log('-'.repeat(40));
    console.log(`Summary: ${passed} passed, ${failed} failed`);
    if (failures.length > 0) {
        console.log('\nFailures:');
        failures.forEach(({ test, error }) => {
            console.log(`  ❌ ${test}: ${error}`);
        });
    }
    return { passed, failed, failures };
}
/**
 * Run multiple test suites sequentially
 */
function runTestSuites(suites) {
    let totalPassed = 0;
    let totalFailed = 0;
    const allFailures = [];
    for (const [suiteName, testFunctions] of suites) {
        const result = runTestSuite(suiteName, testFunctions);
        totalPassed += result.passed;
        totalFailed += result.failed;
        allFailures.push(...result.failures);
    }
    console.log(`\n📊 Overall Summary: ${totalPassed} passed, ${totalFailed} failed`);
    return {
        passed: totalPassed,
        failed: totalFailed,
        failures: allFailures
    };
}
/**
 * Create basic assertion helpers
 */
function createAssertions() {
    return {
        equal: (actual, expected, message) => {
            if (actual !== expected) {
                throw new Error(message || `Expected ${expected}, got ${actual}`);
            }
        },
        notEqual: (actual, expected, message) => {
            if (actual === expected) {
                throw new Error(message || `Expected values not to be equal: ${actual}`);
            }
        },
        truthy: (value, message) => {
            if (!value) {
                throw new Error(message || `Expected truthy value, got ${value}`);
            }
        },
        falsy: (value, message) => {
            if (value) {
                throw new Error(message || `Expected falsy value, got ${value}`);
            }
        }
    };
}
// Export test suite utilities using ES module syntax
export { runTestSuite, runTestSuites, createAssertions };
