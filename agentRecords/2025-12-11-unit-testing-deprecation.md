# Unit Testing Deprecation - 2025-12-11

## Summary
Comprehensively removed all unit testing from the qtests codebase while preserving integration testing, E2E testing, test runners, test scripts, and the qtests module itself.

## Changes Made

### 1. Removed Unit Test Files
- **Demo project unit tests:**
  - `demo/src/calculator.test.js`
  - `demo/src/apiRoutes.test.js`
  - `demo/server/app.test.js`
  - `demo/server/routes/hello.test.js`
  - `demo/server/services/externalService.test.js`
  - `demo/tests/app.dom.test.jsx`
  - `demo/tests/axios-winston-stubs.test.js`
  - `demo/tests/hello.route.test.js`

- **Main project unit tests:**
  - Entire `tests/manual-tests/` directory (containing unit tests for individual utilities)
  - Entire `tests/generated-tests/` directory (generated unit tests)
  - All temporary test directories (`tmp-tests-*`, `test-temp`)

### 2. Updated Jest Configurations
- **Main Jest config (`config/jest.config.mjs`):**
  - Updated `testMatch` to only include integration tests: `**/integration/**/*.test.*`
  - Added `/manual-tests/` and `/generated-tests/` to `testPathIgnorePatterns`
  
- **Root Jest config (`jest.config.js`):**
  - Changed `roots` to only include `tests/integration`
  - Added explicit `testMatch` for integration tests
  - Added unit test directories to `testPathIgnorePatterns`

- **Demo Jest config (`demo/jest.config.js`):**
  - Updated `roots` to only include `tests` (integration tests only)

### 3. Removed Unit Test Dependencies
- **Demo project:**
  - Removed `babel-jest`
  - Removed `jest-environment-jsdom`
  - Removed `ts-jest`

- **Main project:**
  - Removed `babel-jest`
  - Removed `ts-jest`
  - Removed `tsx`

### 4. Preserved Components
- **Integration testing:** All files in `tests/integration/` preserved
- **E2E testing:** Test runners and scripts preserved
- **qtests module:** Core functionality and stubbing preserved
- **Test scripts:** Package.json test scripts preserved (now integration-only)
- **Jest framework:** Core Jest preserved for integration tests

## Rationale
The development flow has been updated to deprecate unit testing in favor of focusing on integration and E2E testing. This provides better confidence in system interactions while reducing the maintenance burden of isolated unit tests.

## Impact
- Test execution will now focus exclusively on integration tests
- Faster feedback on system-level functionality
- Reduced test maintenance overhead
- Preserved ability to test external service interactions via qtests stubbing

## Verification
- Integration tests in `tests/integration/` remain functional
- qtests module continues to provide stubbing for external dependencies
- Test runners (`qtests-runner.mjs`, `bin/qtests-ts-runner`) preserved
- Demo project integration tests preserved