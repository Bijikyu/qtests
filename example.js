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
const { offlineMode, mockAxios, httpTest, mockModels } = require('./lib/envUtils');

// Get current environment state information
const envState = offlineMode.getEnvironmentState();
console.log(`Environment detection: ${JSON.stringify(envState, null, 2)}`);

// Create environment-aware adapters that automatically configure based on offline mode
(async () => {
  const adapters = await offlineMode.createEnvironmentAdapters();
  console.log(`Adapters created - Offline mode: ${adapters.isOffline}`);
})();

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
(async () => {
  offlineMode.setOfflineMode(true);
  const offlineAdapters = await offlineMode.createEnvironmentAdapters();
  console.log(`After toggle - Offline state: ${offlineAdapters.isOffline}`);

  // Toggle back to online mode
  offlineMode.setOfflineMode(false);
  const onlineAdapters = await offlineMode.createEnvironmentAdapters();
  console.log(`After toggle back - Offline state: ${onlineAdapters.isOffline}`);
})();

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

/**
 * Example 8: In-Memory Database Models for Unit Testing
 * 
 * This demonstrates the in-memory Mongoose model replacements that provide
 * database functionality without requiring actual database connections.
 * Essential for fast, isolated unit testing of data-dependent applications.
 * 
 * Key benefits of mock models:
 * - Zero database dependencies for unit testing
 * - Fast test execution without database I/O
 * - Predictable data state for reliable testing
 * - Full Mongoose API compatibility for seamless integration
 * - Complete control over test data scenarios
 */

// Demonstrate in-memory database model testing
console.log('\n=== In-Memory Database Models Demo ===');

// Create custom models for different entity types
const User = mockModels.createMockModel('User');
const Product = mockModels.createMockModel('Product');

// Use pre-built models for common scenarios
const { ApiKey, ApiLog } = mockModels;

async function demonstrateModelOperations() {
  console.log('\n--- Model CRUD Operations Demo ---');
  
  try {
    // Create and save user instances
    const user1 = new User({ name: 'Alice', email: 'alice@example.com', role: 'admin' });
    const user2 = new User({ name: 'Bob', email: 'bob@example.com', role: 'user' });
    
    await user1.save();
    await user2.save();
    
    console.log(`Created users with IDs: ${user1._id}, ${user2._id}`);
    
    // Create product instances
    const product1 = new Product({ name: 'Widget', price: 29.99, category: 'tools' });
    const product2 = new Product({ name: 'Gadget', price: 49.99, category: 'electronics' });
    
    await product1.save();
    await product2.save();
    
    console.log(`Created products: ${product1.name}, ${product2.name}`);
    
    // Demonstrate query operations
    const adminUser = await User.findOne({ role: 'admin' });
    console.log(`Found admin user: ${adminUser.name}`);
    
    const expensiveProducts = await Product.find({ price: { $gt: 30 } }).lean();
    console.log(`Found ${expensiveProducts.length} expensive products`);
    
    // Demonstrate updates
    const updatedUser = await User.findOneAndUpdate(
      { name: 'Bob' },
      { role: 'moderator' }
    );
    console.log(`Updated user ${updatedUser.name} to role: ${updatedUser.role}`);
    
    // Demonstrate deletion
    const deletedProduct = await Product.findOneAndDelete({ name: 'Widget' });
    console.log(`Deleted product: ${deletedProduct.name}`);
    
    console.log('CRUD operations completed successfully');
    
  } catch (error) {
    console.log(`Model operations error: ${error.message}`);
  }
}

async function demonstrateQueryChaining() {
  console.log('\n--- Query Chaining Demo ---');
  
  try {
    // Create test data for query demonstrations
    await new User({ name: 'Charlie', age: 25, department: 'engineering' }).save();
    await new User({ name: 'Diana', age: 30, department: 'marketing' }).save();
    await new User({ name: 'Eve', age: 35, department: 'engineering' }).save();
    await new User({ name: 'Frank', age: 28, department: 'sales' }).save();
    
    // Demonstrate complex query chaining
    const engineeringUsers = await User.find({ department: 'engineering' })
      .sort({ age: -1 })
      .limit(2)
      .lean();
    
    console.log(`Engineering users (sorted by age desc, limit 2):`);
    engineeringUsers.forEach(user => {
      console.log(`  ${user.name} (age ${user.age})`);
    });
    
    // Demonstrate pagination
    const paginatedUsers = await User.find({})
      .sort({ name: 1 })
      .skip(2)
      .limit(2)
      .lean();
    
    console.log(`Paginated users (skip 2, limit 2):`);
    paginatedUsers.forEach(user => {
      console.log(`  ${user.name}`);
    });
    
    // Demonstrate counting
    const totalUsers = await User.countDocuments({});
    const engineeringCount = await User.countDocuments({ department: 'engineering' });
    
    console.log(`Total users: ${totalUsers}, Engineering users: ${engineeringCount}`);
    
  } catch (error) {
    console.log(`Query chaining error: ${error.message}`);
  }
}

async function demonstratePreBuiltModels() {
  console.log('\n--- Pre-built Models Demo ---');
  
  try {
    // Demonstrate ApiKey model usage
    const apiKey1 = new ApiKey({ key: 'api-key-123', userId: 'user-456', scopes: ['read', 'write'] });
    const apiKey2 = new ApiKey({ key: 'api-key-789', userId: 'user-321', scopes: ['read'] });
    
    await apiKey1.save();
    await apiKey2.save();
    
    console.log(`Created API keys: ${apiKey1.key}, ${apiKey2.key}`);
    
    // Find API key by key value
    const foundKey = await ApiKey.findOne({ key: 'api-key-123' });
    console.log(`Found API key for user: ${foundKey.userId}`);
    
    // Update API key status
    const deactivatedKey = await ApiKey.findOneAndUpdate(
      { key: 'api-key-789' },
      { isActive: false }
    );
    console.log(`Deactivated API key: ${deactivatedKey.key}`);
    
    // Demonstrate ApiLog model usage
    const log1 = new ApiLog({ 
      message: 'API request processed', 
      allowedApi: 'userService',
      level: 'info',
      userId: 'user-456'
    });
    
    const log2 = new ApiLog({ 
      message: 'Rate limit exceeded', 
      allowedApi: 'userService',
      level: 'warning',
      userId: 'user-321'
    });
    
    await log1.save();
    await log2.save();
    
    console.log(`Created ${mockModels.mockLogs.length} log entries`);
    
    // Query logs by service
    const userServiceLogs = await ApiLog.find({ allowedApi: 'userService' }).lean();
    console.log(`User service logs: ${userServiceLogs.length}`);
    
    userServiceLogs.forEach(log => {
      console.log(`  ${log.level}: ${log.message}`);
    });
    
  } catch (error) {
    console.log(`Pre-built models error: ${error.message}`);
  }
}

async function demonstrateBulkOperations() {
  console.log('\n--- Bulk Operations Demo ---');
  
  try {
    // Create multiple users for bulk operations
    await new User({ name: 'User1', status: 'active', category: 'premium' }).save();
    await new User({ name: 'User2', status: 'inactive', category: 'basic' }).save();
    await new User({ name: 'User3', status: 'active', category: 'premium' }).save();
    await new User({ name: 'User4', status: 'pending', category: 'basic' }).save();
    
    // Bulk update operation
    const updateResult = await User.updateMany(
      { status: 'active' },
      { lastLogin: new Date() }
    );
    console.log(`Updated ${updateResult.modifiedCount} active users with lastLogin`);
    
    // Bulk delete operation
    const deleteResult = await User.deleteMany({ status: 'inactive' });
    console.log(`Deleted ${deleteResult.deletedCount} inactive users`);
    
    // Count remaining users
    const remainingCount = await User.countDocuments({});
    console.log(`Remaining users: ${remainingCount}`);
    
  } catch (error) {
    console.log(`Bulk operations error: ${error.message}`);
  }
}

// Run all model demonstrations
demonstrateModelOperations();
demonstrateQueryChaining();
demonstratePreBuiltModels();
demonstrateBulkOperations();

// Clean up test data
console.log('\n--- Cleanup Demo ---');
mockModels.resetAllCollections();
console.log('All collections reset for clean test state');

console.log('All database model demonstrations completed');

/**
 * Example 9: Enhanced Test Helper Utilities for Shared Testing Logic
 * 
 * This demonstrates the enhanced test helper utilities that centralize common
 * mocking and module reload logic across test suites. These utilities provide
 * Node.js test module integration, selective environment management, and 
 * framework-agnostic response mocking capabilities.
 * 
 * Key benefits of shared test helpers:
 * - Centralized mocking logic reduces test setup duplication
 * - Node.js test module integration provides superior spying capabilities
 * - Selective environment backup improves test performance and clarity
 * - Framework-agnostic response mocks work with Jest and vanilla Node.js
 * - Thread-safe module reloading prevents test concurrency issues
 */

// Demonstrate enhanced test helper utilities
console.log('\n=== Enhanced Test Helper Utilities Demo ===');

// Import enhanced test helpers from environment utilities
const { testHelpers } = require('./lib/envUtils');

function demonstrateSelectiveEnvironmentManagement() {
  console.log('\n--- Selective Environment Management Demo ---');
  
  try {
    // Set up test environment variables
    process.env.DEMO_VAR1 = 'original_value_1';
    process.env.DEMO_VAR2 = 'original_value_2';
    process.env.DEMO_VAR3 = 'original_value_3';
    
    console.log(`Initial state: DEMO_VAR1=${process.env.DEMO_VAR1}, DEMO_VAR2=${process.env.DEMO_VAR2}`);
    
    // Demonstrate selective backup - only backup specific variables
    const selectiveBackup = testHelpers.backupEnvVars('DEMO_VAR1', 'DEMO_VAR2');
    console.log(`Selective backup created for DEMO_VAR1 and DEMO_VAR2`);
    
    // Modify environment variables during test
    process.env.DEMO_VAR1 = 'modified_value_1';
    process.env.DEMO_VAR2 = 'modified_value_2';
    process.env.DEMO_VAR3 = 'modified_value_3';
    process.env.NEW_VAR = 'new_variable';
    
    console.log(`After modifications: DEMO_VAR1=${process.env.DEMO_VAR1}, DEMO_VAR2=${process.env.DEMO_VAR2}, NEW_VAR=${process.env.NEW_VAR}`);
    
    // Restore selective backup - only restores specified variables
    testHelpers.restoreEnvVars(selectiveBackup);
    console.log(`After selective restore: DEMO_VAR1=${process.env.DEMO_VAR1}, DEMO_VAR2=${process.env.DEMO_VAR2}`);
    console.log(`NEW_VAR still exists: ${process.env.NEW_VAR} (selective restore doesn't remove it)`);
    console.log(`DEMO_VAR3 remains modified: ${process.env.DEMO_VAR3} (not in selective backup)`);
    
    // Demonstrate full environment backup and restoration
    const fullBackup = testHelpers.backupEnvVars(); // No arguments = full backup
    console.log(`Full environment backup created`);
    
    // Add more variables
    process.env.TEMP_VAR1 = 'temporary_1';
    process.env.TEMP_VAR2 = 'temporary_2';
    
    console.log(`Added temporary variables: TEMP_VAR1=${process.env.TEMP_VAR1}, TEMP_VAR2=${process.env.TEMP_VAR2}`);
    
    // Full restore removes added variables and restores all original values
    testHelpers.restoreEnvVars(fullBackup);
    console.log(`After full restore: TEMP_VAR1=${process.env.TEMP_VAR1}, TEMP_VAR2=${process.env.TEMP_VAR2} (removed)`);
    console.log(`Original values restored: DEMO_VAR1=${process.env.DEMO_VAR1}, DEMO_VAR3=${process.env.DEMO_VAR3}`);
    
    // Clean up demonstration variables
    delete process.env.DEMO_VAR1;
    delete process.env.DEMO_VAR2;
    delete process.env.DEMO_VAR3;
    delete process.env.NEW_VAR;
    
    console.log('Selective environment management demo completed');
    
  } catch (error) {
    console.log(`Environment management demo error: ${error.message}`);
  }
}

function demonstrateFrameworkAgnosticResponseMocks() {
  console.log('\n--- Framework-Agnostic Response Mocks Demo ---');
  
  try {
    // Demonstrate minimal JSON response mock
    const jsonRes = testHelpers.createJsonRes();
    console.log('Created minimal JSON response mock');
    
    // Simulate API endpoint usage
    jsonRes.json({ message: 'Success', data: { id: 123, name: 'Test' } });
    
    // Verify mock call tracking (works with both Jest and manual tracking)
    if (jsonRes.json.mock && jsonRes.json.mock.calls) {
      const callCount = jsonRes.json.mock.calls.length;
      const lastCall = jsonRes.json.mock.calls[callCount - 1];
      console.log(`JSON response called ${callCount} times`);
      console.log(`Last call data: ${JSON.stringify(lastCall[0])}`);
    }
    
    // Demonstrate comprehensive response mock
    const res = testHelpers.createRes();
    console.log('Created comprehensive response mock');
    
    // Simulate Express middleware pattern with method chaining
    res.status(201)
       .json({ created: true, id: 456 });
    
    // Verify statusCode property is set (Express compatibility)
    console.log(`Response status code: ${res.statusCode}`);
    
    // Verify call tracking for all methods
    if (res.status.mock && res.json.mock) {
      console.log(`Status method called ${res.status.mock.calls.length} times with: ${res.status.mock.calls[0][0]}`);
      console.log(`JSON method called ${res.json.mock.calls.length} times`);
    }
    
    // Demonstrate error response pattern
    const errorRes = testHelpers.createRes();
    errorRes.status(400)
           .json({ error: 'Bad Request', details: 'Invalid input data' });
    
    console.log(`Error response status: ${errorRes.statusCode}`);
    if (errorRes.json.mock) {
      const errorData = errorRes.json.mock.calls[0][0];
      console.log(`Error response data: ${JSON.stringify(errorData)}`);
    }
    
    console.log('Framework-agnostic response mocks demo completed');
    
  } catch (error) {
    console.log(`Response mocks demo error: ${error.message}`);
  }
}

async function demonstrateEnhancedAPIKeyGeneration() {
  console.log('\n--- Enhanced API Key Generation Demo ---');
  
  try {
    // Demonstrate direct API key generation
    const userKey = await testHelpers.generateKey('user');
    console.log(`Generated user API key: ${userKey}`);
    
    const adminKey = await testHelpers.generateKey('admin');
    console.log(`Generated admin API key: ${adminKey}`);
    
    // Generate timestamp-based key for uniqueness
    const uniqueKey = await testHelpers.generateKey();
    console.log(`Generated unique API key: ${uniqueKey}`);
    
    // Demonstrate HTTP endpoint testing pattern (simulated)
    try {
      // This would be used with actual Express app in real tests
      const mockApp = {
        post: () => ({ send: () => Promise.resolve({ statusCode: 201, body: { key: 'api-key-generated' } }) })
      };
      
      // In real usage: const response = await testHelpers.generateKey(app, 'userService');
      console.log('HTTP endpoint testing pattern available for integration tests');
      console.log('Usage: await generateKey(expressApp, "serviceName") returns HTTP response');
      
    } catch (httpError) {
      console.log(`HTTP testing requires actual app instance: ${httpError.message}`);
    }
    
    console.log('Enhanced API key generation demo completed');
    
  } catch (error) {
    console.log(`API key generation demo error: ${error.message}`);
  }
}

function demonstrateModuleReloadingWithSafety() {
  console.log('\n--- Thread-Safe Module Reloading Demo ---');
  
  try {
    // Demonstrate module reloading for test isolation
    console.log('Reloading mock console utility for fresh state...');
    const reloadedModule = testHelpers.reload('../utils/mockConsole');
    
    if (reloadedModule && typeof reloadedModule.mockConsole === 'function') {
      console.log('Module reloaded successfully - fresh instance available');
    } else {
      console.log('Module reloaded - structure varies by module type');
    }
    
    // Demonstrate thread-safety features
    console.log('Module reload lock prevents concurrent operations on same module');
    console.log('Lock state visible for debugging: has, add, delete methods available');
    
    // Show lock exposure for testing
    if (testHelpers.moduleReloadLock) {
      console.log('Module reload lock exposed for advanced testing scenarios');
      console.log(`Lock methods available: ${Object.getOwnPropertyNames(testHelpers.moduleReloadLock).join(', ')}`);
    }
    
    console.log('Thread-safe module reloading demo completed');
    
  } catch (error) {
    console.log(`Module reloading demo error: ${error.message}`);
  }
}

async function demonstrateEnvironmentWrapperUtilities() {
  console.log('\n--- Environment Wrapper Utilities Demo ---');
  
  try {
    // Set up test state
    process.env.WRAPPER_TEST = 'initial_value';
    
    // Demonstrate withSavedEnv wrapper utility
    const result = await testHelpers.withSavedEnv(() => {
      console.log(`Inside wrapper: WRAPPER_TEST=${process.env.WRAPPER_TEST}`);
      
      // Modify environment inside callback
      process.env.WRAPPER_TEST = 'modified_value';
      process.env.TEMPORARY_VAR = 'temp_value';
      
      console.log(`Modified inside wrapper: WRAPPER_TEST=${process.env.WRAPPER_TEST}, TEMPORARY_VAR=${process.env.TEMPORARY_VAR}`);
      
      return 'callback_result';
    });
    
    console.log(`Wrapper returned: ${result}`);
    console.log(`After wrapper: WRAPPER_TEST=${process.env.WRAPPER_TEST} (restored)`);
    console.log(`After wrapper: TEMPORARY_VAR=${process.env.TEMPORARY_VAR} (removed)`);
    
    // Demonstrate error handling with environment restoration
    try {
      await testHelpers.withSavedEnv(() => {
        process.env.WRAPPER_TEST = 'error_test_value';
        throw new Error('Simulated error');
      });
    } catch (err) {
      console.log(`Caught expected error: ${err.message}`);
      console.log(`Environment restored despite error: WRAPPER_TEST=${process.env.WRAPPER_TEST}`);
    }
    
    // Clean up
    delete process.env.WRAPPER_TEST;
    
    console.log('Environment wrapper utilities demo completed');
    
  } catch (error) {
    console.log(`Environment wrapper demo error: ${error.message}`);
  }
}

function demonstrateIntegratedTestPatterns() {
  console.log('\n--- Integrated Test Patterns Demo ---');
  
  try {
    // Demonstrate combining multiple test helpers
    console.log('Combining environment backup with response mocking...');
    
    const envBackup = testHelpers.backupEnvVars('NODE_ENV');
    process.env.NODE_ENV = 'test_integration';
    
    const res = testHelpers.createRes();
    res.status(200).json({ environment: process.env.NODE_ENV });
    
    console.log(`Response status: ${res.statusCode}`);
    if (res.json.mock) {
      console.log(`Response data: ${JSON.stringify(res.json.mock.calls[0][0])}`);
    }
    
    testHelpers.restoreEnvVars(envBackup);
    console.log(`Environment restored: NODE_ENV=${process.env.NODE_ENV || 'undefined'}`);
    
    // Demonstrate test setup/teardown pattern
    console.log('Complete test setup/teardown pattern demonstrated:');
    console.log('1. Backup environment variables');
    console.log('2. Create response mocks');
    console.log('3. Execute test logic');
    console.log('4. Verify mock interactions');
    console.log('5. Restore environment state');
    
    console.log('Integrated test patterns demo completed');
    
  } catch (error) {
    console.log(`Integrated patterns demo error: ${error.message}`);
  }
}

// Run all enhanced test helper demonstrations
demonstrateSelectiveEnvironmentManagement();
demonstrateFrameworkAgnosticResponseMocks();
demonstrateEnhancedAPIKeyGeneration();
demonstrateModuleReloadingWithSafety();
demonstrateEnvironmentWrapperUtilities();
demonstrateIntegratedTestPatterns();

console.log('All enhanced test helper demonstrations completed');

/**
 * Example 6: Email Mock Testing for Notification Systems
 * 
 * This demonstrates the sendEmail utility for testing applications that send
 * email notifications without requiring external mail service configuration.
 * Essential for testing user registration, password resets, and notification systems.
 * 
 * Benefits of email mocking:
 * - Tests run without actual email delivery
 * - Email content can be verified programmatically
 * - No external service dependencies in test environment
 * - Fast execution without network delays
 * - Complete email history tracking for comprehensive testing
 */

function demonstrateEmailMocking() {
  console.log('\n=== Email Mock Testing Demonstration ===');
  
  try {
    const { sendEmail } = require('./lib/envUtils');
    const {
      sendEmail: sendEmailFn,
      sendEmailBatch,
      createEmailTemplate,
      clearEmailHistory,
      getEmailHistory
    } = sendEmail;
    
    // Clear previous email history for clean demonstration
    clearEmailHistory();
    console.log('Email history cleared for clean test state');
    
    // Basic email sending demonstration
    console.log('\n--- Basic Email Sending ---');
    const basicResult = sendEmailFn(
      'user@example.com',
      'Welcome to Our Service',
      'Thank you for joining! Your account is now active.'
    );
    
    console.log(`Email sent: ${basicResult.success}`);
    console.log(`Email ID: ${basicResult.id}`);
    console.log(`Message: ${basicResult.message}`);
    
    // Template-based email demonstration
    console.log('\n--- Template-Based Email ---');
    const welcomeTemplate = createEmailTemplate('welcome', {
      appName: 'QtestsDemo',
      userName: 'John Doe'
    });
    
    if (welcomeTemplate.success) {
      const templateResult = sendEmailFn(
        'john.doe@example.com',
        welcomeTemplate.template.subject,
        welcomeTemplate.template.body
      );
      console.log(`Template email sent: ${templateResult.success}`);
      console.log(`Subject: ${templateResult.emailData.subject}`);
    }
    
    // Batch email sending demonstration
    console.log('\n--- Batch Email Processing ---');
    const batchEmails = [
      { to: 'user1@example.com', subject: 'Notification 1', body: 'First notification' },
      { to: 'user2@example.com', subject: 'Notification 2', body: 'Second notification' },
      { to: 'invalid-email', subject: 'Failed Email', body: 'This will fail' },
      { to: 'user3@example.com', subject: 'Notification 3', body: 'Third notification' }
    ];
    
    const batchResult = sendEmailBatch(batchEmails);
    console.log(`Batch processing: ${batchResult.success ? 'completed' : 'completed with errors'}`);
    console.log(`Summary: ${batchResult.summary.successful} successful, ${batchResult.summary.failed} failed`);
    
    // Email history verification
    console.log('\n--- Email History Verification ---');
    const history = getEmailHistory();
    console.log(`Total emails in history: ${history.length}`);
    
    const successfulEmails = history.filter(email => email.success);
    const failedEmails = history.filter(email => !email.success);
    
    console.log(`Successful emails: ${successfulEmails.length}`);
    console.log(`Failed emails: ${failedEmails.length}`);
    
    // Advanced template usage with custom variables
    console.log('\n--- Advanced Template Usage ---');
    const resetTemplate = createEmailTemplate('reset', {
      appName: 'QtestsDemo',
      userName: 'Jane Smith',
      resetLink: 'https://qtestsdemo.com/reset/abc123'
    });
    
    if (resetTemplate.success) {
      const resetResult = sendEmailFn(
        'jane.smith@example.com',
        resetTemplate.template.subject,
        resetTemplate.template.body,
        { priority: 'high', category: 'security' }
      );
      
      console.log(`Password reset email sent: ${resetResult.success}`);
      console.log(`Priority: ${resetResult.emailData.priority}`);
      console.log(`Category: ${resetResult.emailData.category}`);
    }
    
    // Testing email validation and error handling
    console.log('\n--- Error Handling Demonstration ---');
    const invalidResult = sendEmailFn('not-an-email', 'Test', 'Test body');
    console.log(`Invalid email handling: ${!invalidResult.success ? 'working correctly' : 'unexpected success'}`);
    console.log(`Error type: ${invalidResult.error}`);
    
    console.log('\nEmail mock testing demonstration completed');
    
  } catch (error) {
    console.log(`Email mock demo error: ${error.message}`);
  }
}

function demonstrateEmailTestingWorkflow() {
  console.log('\n=== Complete Email Testing Workflow ===');
  
  try {
    const { sendEmail } = require('./lib/envUtils');
    const {
      sendEmail: sendEmailFn,
      createEmailTemplate,
      clearEmailHistory,
      getEmailHistory
    } = sendEmail;
    
    // Simulate a complete user registration workflow
    console.log('\n--- User Registration Email Workflow ---');
    
    // Step 1: Clear email state for test
    clearEmailHistory();
    
    // Step 2: Simulate user registration
    const userData = {
      email: 'newuser@example.com',
      name: 'New User',
      activationCode: 'ACT12345'
    };
    
    // Step 3: Create welcome email template
    const welcomeTemplate = createEmailTemplate('welcome', {
      appName: 'QtestsDemo',
      userName: userData.name
    });
    
    // Step 4: Send welcome email
    const welcomeResult = sendEmailFn(
      userData.email,
      welcomeTemplate.template.subject,
      welcomeTemplate.template.body,
      { 
        activationCode: userData.activationCode,
        emailType: 'registration'
      }
    );
    
    // Step 5: Send confirmation email with custom content
    const confirmationResult = sendEmailFn(
      userData.email,
      'Please Confirm Your Email Address',
      `Hello ${userData.name},\n\nPlease click this link to activate your account: https://qtestsdemo.com/activate/${userData.activationCode}\n\nBest regards,\nThe QtestsDemo Team`,
      { emailType: 'activation' }
    );
    
    // Step 6: Verify workflow results
    const emailHistory = getEmailHistory();
    console.log(`Registration workflow sent ${emailHistory.length} emails`);
    
    const registrationEmails = emailHistory.filter(email => email.emailData?.emailType === 'registration');
    const activationEmails = emailHistory.filter(email => email.emailData?.emailType === 'activation');
    
    console.log(`Registration emails: ${registrationEmails.length}`);
    console.log(`Activation emails: ${activationEmails.length}`);
    
    // Step 7: Demonstrate test assertions
    console.log('\n--- Test Assertion Examples ---');
    console.log('// Example test assertions for email workflow:');
    console.log(`// expect(emailHistory).toHaveLength(2);`);
    console.log(`// expect(registrationEmails[0].emailData.to).toBe('${userData.email}');`);
    console.log(`// expect(activationEmails[0].emailData.activationCode).toBe('${userData.activationCode}');`);
    console.log(`// expect(emailHistory.every(email => email.success)).toBe(true);`);
    
    console.log('\nComplete email testing workflow demonstrated');
    
  } catch (error) {
    console.log(`Email workflow demo error: ${error.message}`);
  }
}

// Run email mock demonstrations
demonstrateEmailMocking();
demonstrateEmailTestingWorkflow();

console.log('\nAll email mock demonstrations completed');

/**
 * Example 7: Comprehensive Test Suite Utilities for Pattern Elimination
 * 
 * This demonstrates the testSuite utility for eliminating duplicate patterns
 * across test suites by centralizing setup, teardown, mocking, and assertion
 * patterns. Essential for large projects with consistent testing requirements.
 * 
 * Benefits of comprehensive test suite utilities:
 * - Eliminates duplicate setup/teardown patterns across test files
 * - Provides standardized mocking patterns for consistent behavior
 * - Centralizes assertion helpers for common testing scenarios
 * - Reduces boilerplate code and improves test maintainability
 * - Ensures consistent testing patterns across different developers
 */

function demonstrateTestSuiteUtilities() {
  console.log('\n=== Comprehensive Test Suite Utilities Demonstration ===');
  
  try {
    const { testSuite } = require('./lib/envUtils');
    const {
      DatabaseTestHelper,
      MockManager,
      AssertionHelper,
      TestDataFactory,
      PerformanceTestHelper,
      TestSuiteBuilder
    } = testSuite;
    
    // Database Testing Helper demonstration
    console.log('\n--- Database Testing Helper ---');
    const dbHelper = new DatabaseTestHelper();
    
    // Mock management demonstration
    console.log('\n--- Mock Management System ---');
    const mockManager = new MockManager();
    
    // Set up API client mocks
    mockManager.setupApiClientMocks({
      get: { status: 200, data: { message: 'Mock API response' } }
    });
    console.log('✓ API client mocks configured');
    
    // Set up email mocks
    const emailMocks = mockManager.setupEmailMocks();
    console.log('✓ Email mocks configured');
    
    // Test data factory demonstration
    console.log('\n--- Test Data Factory ---');
    TestDataFactory.reset(); // Start with clean counter
    
    const user1 = TestDataFactory.createUser();
    const user2 = TestDataFactory.createUser({ username: 'customuser' });
    const apiKey = TestDataFactory.createApiKey();
    
    console.log(`✓ Created user: ${user1.username} (${user1.email})`);
    console.log(`✓ Created custom user: ${user2.username} (${user2.email})`);
    console.log(`✓ Created API key: ${apiKey.name}`);
    
    // Create multiple related entities
    const entities = TestDataFactory.createRelatedEntities({
      userCount: 2,
      apiKeysPerUser: 1,
      logsPerUser: 1
    });
    
    console.log(`✓ Created ${entities.users.length} users with related data`);
    console.log(`✓ Total API keys: ${entities.apiKeys.length}`);
    console.log(`✓ Total logs: ${entities.logs.length}`);
    
    // Assertion helper demonstration
    console.log('\n--- Assertion Helpers ---');
    
    // Mock database entity for assertion testing
    const mockEntity = {
      _id: 'test-id-123',
      createdAt: new Date(),
      name: 'Test Entity',
      status: 'active'
    };
    
    try {
      AssertionHelper.assertDatabaseEntity(mockEntity, {
        name: 'Test Entity',
        status: 'active'
      });
      console.log('✓ Database entity assertions passed');
    } catch (error) {
      console.log(`✗ Database entity assertion failed: ${error.message}`);
    }
    
    // API response assertion
    const mockResponse = {
      status: 200,
      body: { data: 'test data' }
    };
    
    try {
      AssertionHelper.assertApiResponse(mockResponse, 200, true);
      console.log('✓ API response assertions passed');
    } catch (error) {
      console.log(`✗ API response assertion failed: ${error.message}`);
    }
    
    // Email assertion
    emailMocks.sendEmail('test@example.com', 'Test Email', 'Test content');
    
    try {
      AssertionHelper.assertEmailSent({ to: 'test@example.com' });
      console.log('✓ Email assertion passed');
    } catch (error) {
      console.log(`✗ Email assertion failed: ${error.message}`);
    }
    
    // Clean up mocks
    mockManager.clearAll();
    console.log('✓ All mocks cleared');
    
    console.log('\nTest suite utilities demonstration completed');
    
  } catch (error) {
    console.log(`Test suite demo error: ${error.message}`);
  }
}

async function demonstratePerformanceTestingUtilities() {
  console.log('\n=== Performance Testing Utilities Demonstration ===');
  
  try {
    const { testSuite } = require('./lib/envUtils');
    const { PerformanceTestHelper, TestDataFactory } = testSuite;
    
    // Performance measurement demonstration
    console.log('\n--- Performance Measurement ---');
    
    const operation = async () => {
      // Simulate some work
      const users = TestDataFactory.createMultiple(TestDataFactory.createUser, 50);
      return users.filter(user => user.isActive).length;
    };
    
    const measurement = await PerformanceTestHelper.measureTime(operation);
    console.log(`✓ Operation completed in ${measurement.duration.toFixed(2)}ms`);
    console.log(`✓ Result: ${measurement.result} active users`);
    
    // Timing constraint demonstration
    console.log('\n--- Timing Constraint Testing ---');
    
    const fastOperation = async () => {
      await new Promise(resolve => setTimeout(resolve, 5));
      return 'fast result';
    };
    
    try {
      const result = await PerformanceTestHelper.assertTimingConstraint(fastOperation, 50);
      console.log(`✓ Timing constraint passed: ${result}`);
    } catch (error) {
      console.log(`✗ Timing constraint failed: ${error.message}`);
    }
    
    // Concurrency testing demonstration
    console.log('\n--- Concurrency Testing ---');
    
    const operations = [
      async () => 'operation 1',
      async () => 'operation 2',
      async () => 'operation 3'
    ];
    
    const concurrencyResult = await PerformanceTestHelper.testConcurrency(operations);
    console.log(`✓ Concurrent operations: ${concurrencyResult.successful}/${concurrencyResult.results.length} successful`);
    console.log(`✓ Average duration: ${concurrencyResult.averageDuration.toFixed(2)}ms`);
    
    // Memory measurement demonstration
    console.log('\n--- Memory Usage Testing ---');
    
    const memoryOperation = async () => {
      const largeArray = new Array(1000).fill('test data');
      return largeArray.length;
    };
    
    const memoryMeasurement = await PerformanceTestHelper.measureMemory(memoryOperation);
    console.log(`✓ Memory operation result: ${memoryMeasurement.result}`);
    console.log(`✓ Heap used change: ${(memoryMeasurement.memoryDelta.heapUsed / 1024).toFixed(2)}KB`);
    
    console.log('\nPerformance testing utilities demonstration completed');
    
  } catch (error) {
    console.log(`Performance demo error: ${error.message}`);
  }
}

function demonstrateTestSuiteBuilder() {
  console.log('\n=== Test Suite Builder Demonstration ===');
  
  try {
    const { testSuite } = require('./lib/envUtils');
    const { TestSuiteBuilder } = testSuite;
    
    // Builder pattern demonstration
    console.log('\n--- Fluent Configuration API ---');
    
    const suite = new TestSuiteBuilder()
      .withApiMocks()
      .withEmailMocks()
      .withPerformance()
      .withoutAutoCleanup()
      .build();
    
    console.log('✓ Test suite built with fluent API');
    console.log(`✓ Includes API mocks: ${suite.mocks.getMock('apiClient') ? 'Yes' : 'No'}`);
    console.log(`✓ Includes email mocks: ${suite.mocks.getMock('email') ? 'Yes' : 'No'}`);
    console.log(`✓ Includes performance utilities: ${suite.performance ? 'Yes' : 'No'}`);
    
    // Testing the configured suite
    console.log('\n--- Using Configured Suite ---');
    
    // Create test data
    const userData = suite.data.createUser({ email: 'builder-test@example.com' });
    console.log(`✓ Created test user: ${userData.username}`);
    
    // Test email functionality
    const emailMock = suite.mocks.getMock('email');
    emailMock.sendEmail(userData.email, 'Builder Test', 'Testing the builder');
    console.log('✓ Email sent through configured mock');
    
    // Test assertions
    try {
      suite.assert.assertEmailSent({ to: userData.email });
      console.log('✓ Email assertion passed');
    } catch (error) {
      console.log(`✗ Email assertion failed: ${error.message}`);
    }
    
    // Test API mock
    const apiClient = suite.mocks.getMock('apiClient');
    apiClient.get().then(response => {
      console.log(`✓ API mock response status: ${response.status}`);
    });
    
    // Clean up
    suite.mocks.clearAll();
    console.log('✓ Suite cleaned up');
    
    console.log('\nTest suite builder demonstration completed');
    
  } catch (error) {
    console.log(`Builder demo error: ${error.message}`);
  }
}

async function demonstrateCompleteTestingWorkflow() {
  console.log('\n=== Complete Testing Workflow Integration ===');
  
  try {
    const { testSuite } = require('./lib/envUtils');
    const { TestSuiteBuilder } = testSuite;
    
    // Configure comprehensive test suite
    console.log('\n--- Comprehensive Test Setup ---');
    
    const suite = new TestSuiteBuilder()
      .withApiMocks()
      .withEmailMocks()
      .withPerformance()
      .withoutAutoCleanup()
      .build();
    
    console.log('✓ Comprehensive test suite configured');
    
    // Simulate complete application testing workflow
    console.log('\n--- Simulated Application Testing ---');
    
    // 1. Create test data
    const testUsers = suite.data.createMultiple(suite.data.createUser, 3);
    console.log(`✓ Created ${testUsers.length} test users`);
    
    // 2. Test API interactions
    const apiClient = suite.mocks.getMock('apiClient');
    const apiResponse = await apiClient.get();
    suite.assert.assertApiResponse(apiResponse, 200, true);
    console.log('✓ API interaction tested');
    
    // 3. Test email notifications
    const emailMock = suite.mocks.getMock('email');
    testUsers.forEach(user => {
      emailMock.sendEmail(user.email, 'Welcome', `Welcome ${user.firstName}!`);
    });
    console.log(`✓ Sent ${testUsers.length} welcome emails`);
    
    // 4. Test performance constraints
    const batchOperation = async () => {
      return testUsers.map(user => ({ id: user.id, processed: true }));
    };
    
    const result = await suite.performance.assertTimingConstraint(batchOperation, 100);
    console.log(`✓ Batch operation processed ${result.length} items within time limit`);
    
    // 5. Verify all expectations
    const emailHistory = emailMock.getHistory();
    if (emailHistory.length === testUsers.length) {
      console.log('✓ All email notifications verified');
    }
    
    // 6. Test concurrent operations
    const concurrentOps = testUsers.map(user => async () => {
      return { userId: user.id, status: 'processed' };
    });
    
    const concurrencyResults = await suite.performance.testConcurrency(concurrentOps);
    console.log(`✓ Concurrent processing: ${concurrencyResults.successful}/${concurrencyResults.results.length} successful`);
    
    // 7. Clean up
    suite.mocks.clearAll();
    suite.data.reset();
    console.log('✓ Test environment cleaned up');
    
    console.log('\n--- Test Pattern Summary ---');
    console.log('1. Data factory created realistic test entities');
    console.log('2. Mock manager handled API and email mocking');
    console.log('3. Assertion helpers verified expected behavior');
    console.log('4. Performance utilities tested timing and concurrency');
    console.log('5. Builder pattern enabled flexible configuration');
    console.log('6. Automated cleanup prevented test interference');
    
    console.log('\nComplete testing workflow demonstration completed');
    
  } catch (error) {
    console.log(`Workflow demo error: ${error.message}`);
  }
}

// Run comprehensive test suite demonstrations
demonstrateTestSuiteUtilities();
demonstrateTestSuiteBuilder();

// Run async demonstrations
(async () => {
  await demonstratePerformanceTestingUtilities();
  await demonstrateCompleteTestingWorkflow();
  
  console.log('\n=== All Test Suite Demonstrations Completed ===');
  console.log('✓ Database testing helpers for in-memory model management');
  console.log('✓ Mock management system with qtests integration');
  console.log('✓ Assertion helpers for common testing patterns');
  console.log('✓ Test data factory for realistic entity creation');
  console.log('✓ Performance testing utilities with timing and concurrency');
  console.log('✓ Test suite builder with fluent configuration API');
  console.log('✓ Complete workflow integration for comprehensive testing');
})();

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