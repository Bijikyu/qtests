// test-utilities.test.js
// Comprehensive test utilities and helper functions for advanced testing scenarios

import assert from 'assert'
import sinon from 'sinon'

// Test utility classes and functions

/**
 * Test Data Builder Pattern
 * Provides fluent interface for creating test data
 */
class TestDataBuilder {
  constructor(defaults = {}) {
    this.data = { ...defaults }
  }

  withId(id) {
    this.data.id = id
    return this
  }

  withName(name) {
    this.data.name = name
    return this
  }

  withEmail(email) {
    this.data.email = email
    return this
  }

  withCreatedAt(date) {
    this.data.createdAt = date || new Date()
    return this
  }

  withUpdatedAt(date) {
    this.data.updatedAt = date || new Date()
    return this
  }

  withStatus(status) {
    this.data.status = status
    return this
  }

  withMetadata(metadata) {
    this.data.metadata = { ...this.data.metadata, ...metadata }
    return this
  }

  build() {
    return { ...this.data }
  }

  static user() {
    return new TestDataBuilder({
      name: 'Test User',
      email: 'test@example.com',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  static product() {
    return new TestDataBuilder({
      name: 'Test Product',
      price: 99.99,
      status: 'available',
      inventory: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  static order() {
    return new TestDataBuilder({
      userId: 'user-123',
      items: [],
      total: 0,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }
}

/**
 * Test Scenario Runner
 * Runs test scenarios with setup, execution, and teardown
 */
class TestScenarioRunner {
  constructor() {
    this.scenarios = new Map()
    this.results = new Map()
  }

  addScenario(name, setupFn, testFn, teardownFn) {
    this.scenarios.set(name, { setupFn, testFn, teardownFn })
    return this
  }

  async runScenario(name) {
    const scenario = this.scenarios.get(name)
    if (!scenario) {
      throw new Error(`Scenario ${name} not found`)
    }

    const scenarioResult = {
      name,
      startTime: Date.now(),
      status: 'running',
      error: null,
      metrics: {}
    }

    try {
      // Setup
      if (scenario.setupFn) {
        const setupStart = Date.now()
        const setupData = await scenario.setupFn()
        scenarioResult.metrics.setupTime = Date.now() - setupStart
        scenarioResult.setupData = setupData
      }

      // Execute test
      const testStart = Date.now()
      const testResult = await scenario.testFn(scenarioResult.setupData)
      scenarioResult.metrics.testTime = Date.now() - testStart
      scenarioResult.testData = testResult

      scenarioResult.status = 'passed'
      scenarioResult.endTime = Date.now()
      scenarioResult.totalTime = scenarioResult.endTime - scenarioResult.startTime

    } catch (error) {
      scenarioResult.status = 'failed'
      scenarioResult.error = {
        message: error.message,
        stack: error.stack
      }
      scenarioResult.endTime = Date.now()
      scenarioResult.totalTime = scenarioResult.endTime - scenarioResult.startTime
    } finally {
      // Teardown
      if (scenario.teardownFn) {
        try {
          const teardownStart = Date.now()
          await scenario.teardownFn(scenarioResult.setupData, scenarioResult.testData, scenarioResult.error)
          scenarioResult.metrics.teardownTime = Date.now() - teardownStart
        } catch (teardownError) {
          scenarioResult.teardownError = {
            message: teardownError.message,
            stack: teardownError.stack
          }
        }
      }
    }

    this.results.set(name, scenarioResult)
    return scenarioResult
  }

  async runAllScenarios() {
    const results = []
    
    for (const [name] of this.scenarios) {
      const result = await this.runScenario(name)
      results.push(result)
    }

    return results
  }

  getResults() {
    return Array.from(this.results.values())
  }

  getPassedScenarios() {
    return this.getResults().filter(r => r.status === 'passed')
  }

  getFailedScenarios() {
    return this.getResults().filter(r => r.status === 'failed')
  }

  printSummary() {
    const results = this.getResults()
    const passed = this.getPassedScenarios().length
    const failed = this.getFailedScenarios().length

    console.log('\n📊 Test Scenario Summary')
    console.log('='.repeat(40))
    console.log(`Total: ${results.length}`)
    console.log(`Passed: ${passed} ✅`)
    console.log(`Failed: ${failed} ❌`)
    
    if (failed > 0) {
      console.log('\n❌ Failed Scenarios:')
      this.getFailedScenarios().forEach(scenario => {
        console.log(`  - ${scenario.name}: ${scenario.error.message}`)
      })
    }

    console.log('='.repeat(40))
  }
}

/**
 * Mock Factory
 * Creates pre-configured mock objects for common scenarios
 */
class MockFactory {
  static createUserService() {
    return {
      getUser: sinon.stub(),
      createUser: sinon.stub(),
      updateUser: sinon.stub(),
      deleteUser: sinon.stub(),
      getUsers: sinon.stub()
    }
  }

  static createDatabaseService() {
    return {
      query: sinon.stub(),
      transaction: sinon.stub(),
      connect: sinon.stub(),
      disconnect: sinon.stub()
    }
  }

  static createPaymentService() {
    return {
      processPayment: sinon.stub(),
      refundPayment: sinon.stub(),
      validatePaymentMethod: sinon.stub(),
      createCharge: sinon.stub(),
      createRefund: sinon.stub()
    }
  }

  static createEmailService() {
    return {
      sendEmail: sinon.stub(),
      sendWelcomeEmail: sinon.stub(),
      sendOrderConfirmation: sinon.stub(),
      sendPaymentConfirmation: sinon.stub(),
      sendRefundConfirmation: sinon.stub()
    }
  }

  static createCacheService() {
    return {
      get: sinon.stub(),
      set: sinon.stub(),
      delete: sinon.stub(),
      clear: sinon.stub(),
      getStats: sinon.stub()
    }
  }

  static createHTTPClient() {
    return {
      get: sinon.stub(),
      post: sinon.stub(),
      put: sinon.stub(),
      delete: sinon.stub(),
      patch: sinon.stub()
    }
  }
}

/**
 * Assertion Helpers
 * Provides enhanced assertion methods for common test scenarios
 */
class AssertionHelpers {
  static assertStubCall(stub, expectedCallCount, expectedArgs = null) {
    if (!stub.called) {
      throw new Error('Expected stub to be called but it was not')
    }

    if (expectedCallCount !== undefined) {
      if (stub.callCount !== expectedCallCount) {
        throw new Error(`Expected stub to be called ${expectedCallCount} times, but was called ${stub.callCount} times`)
      }
    }

    if (expectedArgs) {
      const lastCall = stub.lastCall
      if (!lastCall) {
        throw new Error('Expected stub to have arguments but no calls were made')
      }

      if (JSON.stringify(lastCall.args) !== JSON.stringify(expectedArgs)) {
        throw new Error(`Expected stub to be called with ${JSON.stringify(expectedArgs)}, but was called with ${JSON.stringify(lastCall.args)}`)
      }
    }
  }

  static assertDeepEqualWithExcludedKeys(actual, expected, excludedKeys = []) {
    const filteredActual = this.excludeKeys(actual, excludedKeys)
    const filteredExpected = this.excludeKeys(expected, excludedKeys)
    
    try {
      assert.deepStrictEqual(filteredActual, filteredExpected)
    } catch (error) {
      throw new Error(`Objects are not equal (excluding keys ${excludedKeys.join(', ')}):\n${error.message}`)
    }
  }

  static excludeKeys(obj, keysToExclude) {
    if (typeof obj !== 'object' || obj === null) {
      return obj
    }

    const result = { ...obj }
    keysToExclude.forEach(key => delete result[key])
    return result
  }

  static assertAsyncThrows(asyncFn, expectedErrorMessage = null) {
    return asyncFn()
      .then(() => {
        throw new Error('Expected async function to throw but it resolved successfully')
      })
      .catch(error => {
        if (expectedErrorMessage && error.message !== expectedErrorMessage) {
          throw new Error(`Expected error message "${expectedErrorMessage}", but got "${error.message}"`)
        }
        return error
      })
  }

  static assertTimeRange(actualTime, minMs, maxMs, message = null) {
    if (actualTime < minMs || actualTime > maxMs) {
      const defaultMessage = `Expected time to be between ${minMs}ms and ${maxMs}ms, but got ${actualTime}ms`
      throw new Error(message || defaultMessage)
    }
  }

  static assertPerformanceImprovement(originalTime, optimizedTime, minimumImprovementPercent = 10) {
    const improvement = ((originalTime - optimizedTime) / originalTime) * 100
    
    if (improvement < minimumImprovementPercent) {
      throw new Error(`Expected at least ${minimumImprovementPercent}% improvement, but got ${improvement.toFixed(2)}%`)
    }
  }
}

/**
 * Test Data Generators
 * Generates realistic test data for various scenarios
 */
class TestDataGenerators {
  static user(overrides = {}) {
    return {
      id: this.generateId('user'),
      name: this.generateName(),
      email: this.generateEmail(),
      status: 'active',
      createdAt: this.generateDate(),
      updatedAt: this.generateDate(),
      ...overrides
    }
  }

  static users(count, overrides = {}) {
    return Array.from({ length: count }, (_, i) => 
      this.user({ ...overrides, id: `user-${i + 1}` })
    )
  }

  static product(overrides = {}) {
    return {
      id: this.generateId('product'),
      name: this.generateProductName(),
      description: this.generateDescription(),
      price: this.generatePrice(),
      category: this.generateCategory(),
      inventory: Math.floor(Math.random() * 1000),
      status: 'available',
      createdAt: this.generateDate(),
      updatedAt: this.generateDate(),
      ...overrides
    }
  }

  static products(count, overrides = {}) {
    return Array.from({ length: count }, (_, i) => 
      this.product({ ...overrides, id: `product-${i + 1}` })
    )
  }

  static order(overrides = {}) {
    return {
      id: this.generateId('order'),
      userId: this.generateId('user'),
      items: this.generateOrderItems(),
      total: 0,
      status: 'pending',
      shippingAddress: this.generateAddress(),
      createdAt: this.generateDate(),
      updatedAt: this.generateDate(),
      ...overrides
    }
  }

  static generateId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  }

  static generateName() {
    const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank']
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis']
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
  }

  static generateEmail() {
    const domains = ['example.com', 'test.com', 'demo.org', 'sample.net']
    const name = Math.random().toString(36).substr(2, 8)
    const domain = domains[Math.floor(Math.random() * domains.length)]
    return `${name}@${domain}`
  }

  static generateDate(daysAgo = 0) {
    const date = new Date()
    if (daysAgo > 0) {
      date.setDate(date.getDate() - daysAgo)
    }
    return date
  }

  static generatePrice(min = 1, max = 1000) {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100
  }

  static generateProductName() {
    const adjectives = ['Premium', 'Deluxe', 'Standard', 'Basic', 'Advanced', 'Professional', 'Elite', 'Ultimate']
    const products = ['Widget', 'Gadget', 'Device', 'Tool', 'System', 'Solution', 'Platform', 'Service']
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const product = products[Math.floor(Math.random() * products.length)]
    return `${adjective} ${product}`
  }

  static generateDescription() {
    return `This is a high-quality product with excellent features and great value. Perfect for everyday use.`
  }

  static generateCategory() {
    const categories = ['Electronics', 'Clothing', 'Home', 'Sports', 'Books', 'Toys', 'Food', 'Beauty']
    return categories[Math.floor(Math.random() * categories.length)]
  }

  static generateOrderItems() {
    const itemCount = Math.floor(Math.random() * 5) + 1
    return Array.from({ length: itemCount }, (_, i) => ({
      productId: this.generateId('product'),
      quantity: Math.floor(Math.random() * 5) + 1,
      price: this.generatePrice(10, 500)
    }))
  }

  static generateAddress() {
    const streets = ['123 Main St', '456 Oak Ave', '789 Pine Rd', '321 Elm Blvd']
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ']
    const zips = ['10001', '90210', '60601', '77001', '85001']
    
    return {
      street: streets[Math.floor(Math.random() * streets.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)],
      zip: zips[Math.floor(Math.random() * zips.length)],
      country: 'USA'
    }
  }
}

/**
 * Test Environment Manager
 * Manages test environment setup and cleanup
 */
class TestEnvironmentManager {
  constructor() {
    this.environments = new Map()
    this.currentEnvironment = null
  }

  addEnvironment(name, setupFn, teardownFn) {
    this.environments.set(name, { setupFn, teardownFn })
    return this
  }

  async setupEnvironment(name) {
    const env = this.environments.get(name)
    if (!env) {
      throw new Error(`Environment ${name} not found`)
    }

    this.currentEnvironment = name
    return await env.setupFn()
  }

  async teardownEnvironment() {
    if (!this.currentEnvironment) {
      return
    }

    const env = this.environments.get(this.currentEnvironment)
    if (env && env.teardownFn) {
      await env.teardownFn()
    }

    this.currentEnvironment = null
  }

  async withEnvironment(name, testFn) {
    const setupData = await this.setupEnvironment(name)
    try {
      return await testFn(setupData)
    } finally {
      await this.teardownEnvironment()
    }
  }
}

// Test the utilities
async function runTestUtilitiesTests() {
  console.log('Running test utilities tests...\n')

  // Test 1: TestDataBuilder
  console.log('🏗️ Test 1: TestDataBuilder')
  
  const user = TestDataBuilder.user()
    .withId('user-123')
    .withName('Custom Name')
    .withEmail('custom@example.com')
    .withStatus('premium')
    .build()

  assert.strictEqual(user.id, 'user-123')
  assert.strictEqual(user.name, 'Custom Name')
  assert.strictEqual(user.email, 'custom@example.com')
  assert.strictEqual(user.status, 'premium')
  assert(user.createdAt instanceof Date, 'should have createdAt date')

  console.log('✅ TestDataBuilder test passed\n')

  // Test 2: TestScenarioRunner
  console.log('🏃 Test 2: TestScenarioRunner')
  
  const runner = new TestScenarioRunner()
  
  runner.addScenario('success', async () => ({ data: 'setup' }), async (data) => {
    return { result: data.data + '-processed' }
  }, async (setupData, testData) => {
    // Cleanup
  })

  const scenarioResult = await runner.runScenario('success')
  assert.strictEqual(scenarioResult.status, 'passed')
  assert.strictEqual(scenarioResult.testData.result, 'setup-processed')
  assert(scenarioResult.metrics.setupTime >= 0, 'should track setup time')
  assert(scenarioResult.metrics.testTime >= 0, 'should track test time')

  console.log('✅ TestScenarioRunner test passed\n')

  // Test 3: MockFactory
  console.log('🏭 Test 3: MockFactory')
  
  const mockService = MockFactory.createUserService()
  mockService.getUser.resolves({ id: 'user-1', name: 'Test User' })

  const result = await mockService.getUser('user-1')
  assert.strictEqual(result.name, 'Test User')
  assert(mockService.getUser.calledOnce, 'should track stub calls')

  console.log('✅ MockFactory test passed\n')

  // Test 4: AssertionHelpers
  console.log('🔍 Test 4: AssertionHelpers')
  
  const testStub = sinon.stub()
  testStub('arg1', 'arg2')

  AssertionHelpers.assertStubCall(testStub, 1, ['arg1', 'arg2'])

  const obj1 = { id: 1, name: 'Test', createdAt: new Date() }
  const obj2 = { id: 1, name: 'Test', createdAt: new Date(Date.now() + 1000) }
  
  AssertionHelpers.assertDeepEqualWithExcludedKeys(obj1, obj2, ['createdAt'])

  await AssertionHelpers.assertAsyncThrows(async () => {
    throw new Error('Test error')
  }, 'Test error')

  AssertionHelpers.assertPerformanceImprovement(100, 80, 15)

  console.log('✅ AssertionHelpers test passed\n')

  // Test 5: TestDataGenerators
  console.log('🎲 Test 5: TestDataGenerators')
  
  const generatedUser = TestDataGenerators.user({ status: 'premium' })
  assert(generatedUser.id.startsWith('user-'), 'should generate user with id prefix')
  assert.strictEqual(generatedUser.status, 'premium', 'should apply overrides')
  assert(generatedUser.email.includes('@'), 'should generate valid email')

  const generatedProducts = TestDataGenerators.products(3)
  assert.strictEqual(generatedProducts.length, 3, 'should generate correct number of products')
  assert(generatedProducts.every(p => p.id.startsWith('product-')), 'should generate products with correct ids')

  console.log('✅ TestDataGenerators test passed\n')

  // Test 6: TestEnvironmentManager
  console.log('🌍 Test 6: TestEnvironmentManager')
  
  const envManager = new TestEnvironmentManager()
  let setupCalled = false
  let teardownCalled = false

  envManager.addEnvironment('test', async () => {
    setupCalled = true
    return { config: 'test-config' }
  }, async () => {
    teardownCalled = true
  })

  const envResult = await envManager.withEnvironment('test', async (data) => {
    return data.config + '-used'
  })

  assert.strictEqual(envResult, 'test-config-used', 'should use environment data')
  assert.strictEqual(setupCalled, true, 'should call setup')
  assert.strictEqual(teardownCalled, true, 'should call teardown')

  console.log('✅ TestEnvironmentManager test passed\n')

  console.log('🎉 All test utilities tests passed!')
  console.log('Utilities tested: 6')
  
  return true
}

// Export for use in other test files
export {
  runTestUtilitiesTests,
  TestDataBuilder,
  TestScenarioRunner,
  MockFactory,
  AssertionHelpers,
  TestDataGenerators,
  TestEnvironmentManager
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTestUtilitiesTests().catch(console.error)
}