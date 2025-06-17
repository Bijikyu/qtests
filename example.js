/**
 * qtests Usage Examples and Demonstrations
 * 
 * This file provides comprehensive examples of how to use all qtests utilities
 * in real testing scenarios. It serves as both documentation and a functional
 * test of the qtests module's capabilities.
 * 
 * File organization:
 * - Setup demonstration (critical for module stubbing)
 * - Individual utility examples with before/after comparisons
 * - Practical testing patterns that developers can copy
 * - Error handling and restoration examples
 * 
 * Why comprehensive examples are important:
 * - Shows correct usage patterns to prevent common mistakes
 * - Demonstrates setup order requirements (setup before requires)
 * - Provides copy-paste examples for quick implementation
 * - Validates that all utilities work correctly together
 * 
 * This file can be run directly to see qtests in action:
 * node example.js
 */

// CRITICAL: Setup must be required before any modules that need stubbing
// This modifies Node.js module resolution to use our stubs instead of real modules
// If you require axios or winston before this line, you'll get the real modules
require('./setup');

// Import qtests utilities after setup to ensure proper module resolution
// These imports will now use stubbed dependencies if they internally require axios/winston
const { stubMethod, mockConsole, testEnv } = require('./index');

console.log('=== qtests Comprehensive Usage Examples ===');

/**
 * Example 1: Method Stubbing for Dependency Isolation
 * 
 * This demonstrates the core stubMethod utility for temporarily replacing
 * object methods during testing. This is essential for isolating units
 * under test from their dependencies.
 * 
 * Common use cases:
 * - Stubbing database calls to return test data
 * - Replacing network operations with predictable responses
 * - Mocking time-dependent functions for consistent testing
 * - Isolating functions from file system operations
 */
console.log('\n1. Method Stubbing for Dependency Isolation:');

// Create example object with methods that might have side effects in tests
const exampleObject = {
  // Simple greeting method - easy to verify stubbing worked
  greet: (name) => `Hello, ${name}!`,

  // Math operation - demonstrates parameter passing through stubs
  calculate: (a, b) => a + b,

  // Simulated database operation - common stubbing target
  saveUser: (userData) => {
    // In real code, this might write to database
    return { id: 123, ...userData, saved: true };
  }
};

// Show original behavior before stubbing
console.log('Original greeting:', exampleObject.greet('World'));
console.log('Original calculation:', exampleObject.calculate(5, 3));

// Stub the greeting method with different behavior
// The restore function is critical - ALWAYS capture it for cleanup
const restoreGreet = stubMethod(exampleObject, 'greet', (name) => `Hi there, ${name}!`);
console.log('Stubbed greeting:', exampleObject.greet('World'));

// Stub the database method to return test data without side effects
const restoreSave = stubMethod(exampleObject, 'saveUser', (userData) => {
  // Return predictable test data instead of hitting real database
  return { id: 999, ...userData, saved: true, isTestData: true };
});

const saveResult = exampleObject.saveUser({ name: 'Test User', email: 'test@example.com' });
console.log('Stubbed save result:', saveResult);

// CRITICAL: Always restore original methods to prevent test pollution
// Other tests or code might depend on original behavior
restoreGreet();
restoreSave();

// Verify restoration worked correctly
console.log('Restored greeting:', exampleObject.greet('World'));
const realSaveResult = exampleObject.saveUser({ name: 'Real User' });
console.log('Restored save (no isTestData flag):', realSaveResult);

/**
 * Example 2: Console Output Capture for Testing Logging
 * 
 * This demonstrates console mocking for testing code that writes to console
 * without polluting test output. Essential for testing logging behavior,
 * error reporting, and debug output.
 * 
 * Benefits of console mocking:
 * - Test output stays clean and readable
 * - Can assert on what was logged without visual inspection
 * - Prevents logging side effects during testing
 * - Works with any console method (log, error, warn, etc.)
 */
console.log('\n2. Console Output Capture for Logging Tests:');

// Create a spy for console.log to capture its calls
// This replaces console.log temporarily while tracking all calls
const consoleSpy = mockConsole('log');

// These calls will be captured but not displayed
// This is perfect for testing functions that log their actions
console.log('This message will be captured, not displayed');
console.log('Another captured message with', 'multiple', 'arguments');
console.log('Testing with object:', { key: 'value', number: 42 });

// Verify the spy captured all calls correctly
console.log('\n--- Console Spy Results ---');
console.log('Total captured calls:', consoleSpy.mock.calls.length);
console.log('First call arguments:', consoleSpy.mock.calls[0]);
console.log('Second call arguments:', consoleSpy.mock.calls[1]);
console.log('Third call arguments:', consoleSpy.mock.calls[2]);

// Example of testing a function that logs
function logUserAction(action, userId) {
  console.log(`User ${userId} performed action: ${action}`);
  return true;
}

// Clear previous calls to test just this function
consoleSpy.mock.calls.length = 0;
const actionResult = logUserAction('login', 'user123');

// Assert on both the return value and the logging behavior
console.log('Function returned:', actionResult);
console.log('Function logged:', consoleSpy.mock.calls[0]);

// CRITICAL: Always restore console to prevent affecting other code
consoleSpy.mockRestore();
console.log('Console restored - this message will be displayed normally');

/**
 * Example 3: Test Environment Setup for Predictable Testing
 * 
 * Demonstrates environment variable management for tests that depend on
 * configuration or API keys. Essential for integration testing and ensuring
 * tests run consistently across different environments.
 * 
 * Why environment management matters:
 * - Tests need predictable inputs to be deterministic
 * - Avoids dependency on developer's local environment setup
 * - Prevents accidental use of production API keys in tests
 * - Enables testing of environment-dependent code paths
 */
console.log('\n3. Test Environment Setup for Predictable Testing:');

// Show current environment state before setup
console.log('Before setTestEnv:');
console.log('  GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY || 'undefined');
console.log('  OPENAI_TOKEN:', process.env.OPENAI_TOKEN || 'undefined');
console.log('  GOOGLE_CX:', process.env.GOOGLE_CX || 'undefined');

// Set up test environment with known values
// This ensures all tests see the same environment configuration
testEnv.setTestEnv();

console.log('\nAfter setTestEnv:');
console.log('  GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY);
console.log('  OPENAI_TOKEN:', process.env.OPENAI_TOKEN);
console.log('  GOOGLE_CX:', process.env.GOOGLE_CX);

// Example function that depends on environment variables
function createApiClient() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY environment variable required');
  }
  return { apiKey, ready: true };
}

// This now works because setTestEnv provided the required variables
const apiClient = createApiClient();
console.log('API client created with test environment:', apiClient);

// Demonstrate environment save and restore for test isolation
console.log('\n--- Environment Save/Restore Example ---');
const savedEnv = testEnv.saveEnv();
console.log('Environment saved');

// Modify environment during test
process.env.TEST_VARIABLE = 'temporary value';
console.log('Added TEST_VARIABLE:', process.env.TEST_VARIABLE);

// Restore original environment
testEnv.restoreEnv(savedEnv);
console.log('Environment restored');
console.log('TEST_VARIABLE after restore:', process.env.TEST_VARIABLE || 'undefined');

/**
 * Example 4: Mock Creation for Complex Dependencies
 * 
 * Demonstrates creation of specialized mocks for common testing scenarios.
 * These mocks replace complex external dependencies with simple, predictable
 * implementations that work well in test environments.
 * 
 * Mock types and their use cases:
 * - Schedule mock: for testing rate-limited or queued operations
 * - Error handler mock: for testing error reporting without side effects
 * - HTTP adapter mock: for testing HTTP clients without network calls
 */
console.log('\n4. Mock Creation for Complex Dependencies:');

(async () => { // (wrapping async demo to allow top-level await in CommonJS)

// Create a scheduler mock for testing rate-limited operations
// Real schedulers delay execution; this mock executes immediately
const scheduleMock = testEnv.createScheduleMock();

console.log('--- Schedule Mock Example ---');
// Test function that would normally be rate-limited
const testTask = () => {
  console.log('Task executed at:', new Date().toISOString());
  return 'Task completed successfully';
};

// Schedule the task - this executes immediately in test environment
const scheduleResult = await scheduleMock(testTask);
console.log('Schedule mock result:', scheduleResult);

// Create error handler mock for testing error reporting
const errorMock = testEnv.createQerrorsMock();

console.log('\n--- Error Handler Mock Example ---');
// Test error reporting without triggering real error handling
const errorResult = errorMock('Test error', { context: 'example', severity: 'low' });
console.log('Error mock captured:', errorResult);

// Create HTTP adapter mock for testing network operations
const httpMock = testEnv.createAxiosMock();

console.log('\n--- HTTP Adapter Mock Example ---');
// Configure mock responses for different endpoints
httpMock.onGet('/api/users').reply(200, { users: ['alice', 'bob'] });
httpMock.onPost('/api/login').reply(200, { token: 'fake-jwt-token' });

console.log('HTTP mock configured for /api/users and /api/login');
console.log('Mock would return predefined responses without network calls');

/**
 * Example 5: Complete Test Scenario Integration
 * 
 * This demonstrates how all qtests utilities work together in a realistic
 * testing scenario. Shows the complete workflow from setup through cleanup.
 * 
 * This pattern can be copied for real integration tests that need:
 * - Environment isolation
 * - Dependency mocking
 * - Output capture
 * - Proper cleanup
 */
console.log('\n5. Complete Integration Test Pattern:');

// Initialize complete test environment with all mocks
const testMocks = testEnv.initSearchTest();
console.log('Complete test environment initialized');

// Example function that uses multiple dependencies
async function complexOperation(query) {
  // This would normally log progress
  console.log(`Starting search for: ${query}`);

  // This would normally make HTTP request
  const axios = require('axios'); // Uses stubbed axios
  const searchResult = await axios.post('/api/search', { q: query });

  // This would normally log results
  console.log(`Search completed, found: ${searchResult.length || 0} results`);

  return { query, results: searchResult, completed: true };
}

// Test the complex operation with mocked console to capture logs
const testConsoleSpy = mockConsole('log');

// Execute the operation - no real HTTP calls or visible logs
const operationResult = await complexOperation('test query');

// Verify the operation worked and captured logs
console.log('\n--- Integration Test Results ---');
console.log('Operation result:', operationResult);
console.log('Captured log calls:', testConsoleSpy.mock.calls.length);
console.log('First log call:', testConsoleSpy.mock.calls[0]);

// Clean up all mocks and restore normal behavior
testConsoleSpy.mockRestore();
testEnv.resetMocks(testMocks.mock, testMocks.scheduleMock, testMocks.qerrorsMock);

console.log('\n=== All Examples Complete ===');
console.log('All mocks have been cleaned up and original behavior restored');

/**
 * Example 6: Environment-Aware Adapter Pattern
 * 
 * This demonstrates the enhanced environment adapter functionality that
 * automatically configures HTTP clients and error reporting based on
 * environment variables. This pattern is essential for applications that
 * need to work seamlessly across development, testing, and production environments.
 * 
 * Key benefits of environment adapters:
 * - Automatic configuration based on environment variables (CODEX, OFFLINE_MODE)
 * - Consistent interface across online/offline modes
 * - Enhanced mock implementations with realistic response simulation
 * - Comprehensive error handling with graceful degradation
 * - Easy integration with existing codebases
 */

// Demonstrate environment adapter creation and usage
console.log('\n=== Environment Adapter Pattern Demo ===');

// Import environment utilities with enhanced adapter support
const { offlineMode, mockAxios, httpTest } = require('./lib/envUtils');

// Get current environment state information
const envState = offlineMode.getEnvironmentState();
console.log(`Environment detection: ${JSON.stringify(envState, null, 2)}`);

// Create environment-aware adapters that automatically configure based on offline mode
const adapters = offlineMode.createEnvironmentAdapters();
console.log(`Adapters created - Offline mode: ${adapters.isOffline}`);

// Demonstrate HTTP client adapter usage
async function demonstrateHttpAdapter() {
  console.log('\n--- HTTP Client Adapter Demo ---');
  
  try {
    // Use the environment-aware axios instance
    const response = await adapters.axios.get('/api/users');
    console.log(`HTTP GET response status: ${response.status}`);
    console.log(`Response data type: ${typeof response.data}`);
    
    // Demonstrate POST request with data
    const postResponse = await adapters.axios.post('/api/users', {
      name: 'Test User',
      email: 'test@example.com'
    });
    console.log(`HTTP POST response status: ${postResponse.status}`);
    
  } catch (error) {
    console.log(`HTTP request error: ${error.message}`);
  }
}

// Demonstrate error reporting adapter usage
function demonstrateErrorAdapter() {
  console.log('\n--- Error Reporting Adapter Demo ---');
  
  try {
    // Use the environment-aware error reporting
    adapters.qerrors.qerrors();
    console.log('Error reporting adapter executed successfully');
  } catch (error) {
    console.log(`Error reporting failed: ${error.message}`);
  }
}

// Demonstrate custom mock axios factory
function demonstrateCustomMockFactory() {
  console.log('\n--- Custom Mock Factory Demo ---');
  
  // Create a custom mock with specific response data
  const customMock = mockAxios.createMockAxios({
    defaultResponse: { users: ['alice', 'bob', 'charlie'] },
    defaultStatus: 200
  });
  
  // Test the custom mock
  customMock.get('/api/users').then(response => {
    console.log(`Custom mock response: ${JSON.stringify(response.data)}`);
    console.log(`Custom mock status: ${response.status}`);
  });
  
  // Create a simple mock for basic testing
  const simpleMock = mockAxios.createSimpleMockAxios();
  simpleMock.post('/api/test', { data: 'test' }).then(response => {
    console.log(`Simple mock response status: ${response.status}`);
  });
}

// Demonstrate user-provided mock axios implementation
function demonstrateUserMockFactory() {
  console.log('\n--- User Mock Factory Demo ---');
  
  // Create user's exact mock axios implementation
  const userMock = mockAxios.createUserMockAxios();
  
  // Configure specific responses for different endpoints using __set method
  userMock.__set('http://api.example.com/users', { users: ['alice', 'bob'] }, 200);
  userMock.__set('http://api.example.com/posts', { posts: [] }, 200);
  userMock.__set('http://api.example.com/error', { error: 'Not found' }, 404, true);
  
  // Test successful responses
  userMock({ url: 'http://api.example.com/users' }).then(response => {
    console.log(`Users response: ${JSON.stringify(response.data)}`);
    console.log(`Users status: ${response.status}`);
  });
  
  userMock({ url: 'http://api.example.com/posts' }).then(response => {
    console.log(`Posts response: ${JSON.stringify(response.data)}`);
    console.log(`Posts status: ${response.status}`);
  });
  
  // Test error response with reject flag
  userMock({ url: 'http://api.example.com/error' }).catch(error => {
    console.log(`Error response status: ${error.response.status}`);
    console.log(`Error response data: ${JSON.stringify(error.response.data)}`);
  });
  
  // Test unknown URL (should return 500 error)
  userMock({ url: 'http://unknown.com' }).catch(error => {
    console.log(`Unknown URL status: ${error.response.status}`);
    console.log(`Unknown URL data: ${error.response.data}`);
  });
  
  // Test default seeded response
  userMock({ url: 'http://a' }).then(response => {
    console.log(`Default response: ${JSON.stringify(response.data)}`);
    console.log(`Default status: ${response.status}`);
  });
}

// Run the demonstrations
demonstrateHttpAdapter();
demonstrateErrorAdapter();
demonstrateCustomMockFactory();
demonstrateUserMockFactory();

// Demonstrate offline mode toggling with environment adapters
console.log('\n--- Offline Mode Toggling Demo ---');
console.log(`Initial offline state: ${offlineMode.isOfflineMode()}`);

// Toggle to offline mode and create new adapters
offlineMode.setOfflineMode(true);
const offlineAdapters = offlineMode.createEnvironmentAdapters();
console.log(`After toggle - Offline state: ${offlineAdapters.isOffline}`);

// Toggle back to online mode
offlineMode.setOfflineMode(false);
const onlineAdapters = offlineMode.createEnvironmentAdapters();
console.log(`After toggle back - Offline state: ${onlineAdapters.isOffline}`);

console.log('Environment adapter demonstrations completed');

/**
 * Example 7: HTTP Integration Testing with Lightweight Client
 * 
 * This demonstrates the lightweight HTTP testing client that provides
 * supertest-like functionality without external dependencies. Essential
 * for integration testing of HTTP endpoints and applications.
 * 
 * Key benefits of HTTP test client:
 * - Zero external dependencies (uses Node.js core http module)
 * - Express-compatible mock application support
 * - Supertest-like API for familiar testing patterns
 * - Automatic JSON parsing and response handling
 * - Comprehensive error handling and cleanup
 */

// Demonstrate HTTP integration testing capabilities
console.log('\n=== HTTP Integration Testing Demo ===');

// Create a mock Express-style application for testing
const app = httpTest.createMockApp();

// Configure routes on the mock application
app.get('/api/status', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ status: 'healthy', timestamp: Date.now() }));
});

app.post('/api/users', (req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    const userData = JSON.parse(body);
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ id: 123, ...userData, created: true }));
  });
});

app.put('/api/users/:id', (req, res) => {
  const auth = req.headers.authorization;
  if (auth === 'Bearer valid-token') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ updated: true }));
  } else {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Unauthorized' }));
  }
});

// Demonstrate HTTP testing patterns
async function demonstrateHttpTesting() {
  console.log('\n--- HTTP Test Client Demo ---');
  
  try {
    // Test GET endpoint
    console.log('Testing GET /api/status...');
    const statusResponse = await httpTest.supertest(app)
      .get('/api/status')
      .expect(200)
      .end();
    
    console.log(`GET response status: ${statusResponse.status}`);
    console.log(`GET response body: ${JSON.stringify(statusResponse.body)}`);
    
    // Test POST endpoint with JSON body
    console.log('\nTesting POST /api/users...');
    const createResponse = await httpTest.supertest(app)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'john@example.com' })
      .expect(201)
      .end();
    
    console.log(`POST response status: ${createResponse.status}`);
    console.log(`POST response body: ${JSON.stringify(createResponse.body)}`);
    
    // Test PUT endpoint with authentication
    console.log('\nTesting PUT /api/users/123 with auth...');
    const updateResponse = await httpTest.supertest(app)
      .put('/api/users/123')
      .set('Authorization', 'Bearer valid-token')
      .send({ name: 'John Updated' })
      .expect(200)
      .end();
    
    console.log(`PUT response status: ${updateResponse.status}`);
    console.log(`PUT response body: ${JSON.stringify(updateResponse.body)}`);
    
    // Test unauthorized request
    console.log('\nTesting unauthorized PUT request...');
    const unauthorizedResponse = await httpTest.supertest(app)
      .put('/api/users/123')
      .set('Authorization', 'Bearer invalid-token')
      .send({ name: 'John Hacker' })
      .expect(401)
      .end();
    
    console.log(`Unauthorized response status: ${unauthorizedResponse.status}`);
    console.log(`Unauthorized response body: ${JSON.stringify(unauthorizedResponse.body)}`);
    
    console.log('\nHTTP integration testing completed successfully');
    
  } catch (error) {
    console.log(`HTTP testing error: ${error.message}`);
  }
}

// Run HTTP testing demonstration
demonstrateHttpTesting();

console.log('All HTTP testing demonstrations completed');

})(); // (end async wrapper to keep CommonJS compatible)

/**
 * Key Takeaways for Using qtests:
 * 
 * 1. Setup Order: Always require('qtests/setup') before other modules
 * 2. Restoration: Always restore stubs and mocks after tests
 * 3. Isolation: Use environment save/restore for test isolation
 * 4. Integration: Combine utilities for comprehensive test scenarios
 * 5. Cleanup: Use resetMocks and mockRestore to prevent test pollution
 * 
 * This example file demonstrates all these patterns and can serve as
 * a reference for implementing qtests in your own test suites.
 */