// index.test.js
// Node.js test file using stubMethod for advanced stub scenarios

import assert from 'assert'
import sinon from 'sinon'

// Complex example class for advanced stubbing
class UserService {
  constructor() {
    this.users = new Map()
  }
  
  async createUser(userData) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 50))
    const id = Math.random().toString(36).substr(2, 9)
    this.users.set(id, { id, ...userData })
    return this.users.get(id)
  }
  
  getUser(id) {
    return this.users.get(id)
  }
  
  async deleteUser(id) {
    await new Promise(resolve => setTimeout(resolve, 30))
    return this.users.delete(id)
  }
}

// Test configuration object
const testConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
}

// Function with complex logic for testing
function processUserData(user) {
  if (!user) {
    throw new Error('User cannot be null')
  }
  
  if (user.age < 0) {
    throw new Error('Age cannot be negative')
  }
  
  return {
    ...user,
    isAdult: user.age >= 18,
    status: user.active ? 'active' : 'inactive'
  }
}

// Async function for testing promise-based stubs
async function fetchUserData(userId) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100))
  return {
    id: userId,
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    active: true
  }
}

// Function with callback for testing callback stubs
function fetchUserWithCallback(userId, callback) {
  setTimeout(() => {
    if (userId === 'invalid') {
      callback(new Error('User not found'))
    } else {
      callback(null, { id: userId, name: 'Callback User' })
    }
  }, 50)
}

// Run the test suite
async function runTests() {
  console.log('Running index.test.js advanced stub tests...\n')

  // Test 1: Method replacement on instance
  const userService = new UserService()
  
  const userStub = sinon.stub(userService, 'createUser').callsFake(async (userData) => {
    console.log('🚀 STUBBED createUser called with:', userData)
    return { id: 'stubbed-id', ...userData, stubbed: true }
  })
  
  const stubbedUser = await userService.createUser({ name: 'Alice', age: 25 })
  console.log('Stubbed user result:', stubbedUser)
  assert.strictEqual(stubbedUser.stubbed, true, 'should use stubbed createUser')
  assert.strictEqual(stubbedUser.name, 'Alice', 'should preserve user data')
  userStub.restore()

  // Test 2: Static method stubbing
  UserService.fromArray = (users) => {
    console.log('🔧 STUBBED fromArray called with:', users.length, 'users')
    return new UserService()
  }
  
  const staticStubService = UserService.fromArray([])
  assert(staticStubService instanceof UserService, 'should create instance via stub')
  
  // Restore static method
  delete UserService.fromArray

  // Test 3: Multiple method stubs on same object
  const multiService = new UserService()
  
  const createUserStub = stubMethod({
    obj: multiService,
    methodName: 'createUser',
    stubFn: (userData) => ({ id: 'multi-1', ...userData })
  })
  const getUserStub = stubMethod({
    obj: multiService,
    methodName: 'getUser',
    stubFn: (id) => ({ id, name: 'Multi Stub User' })
  })
  const deleteUserStub = stubMethod({
    obj: multiService,
    methodName: 'deleteUser',
    stubFn: (id) => true
  })
  
  const multiUser = await multiService.createUser({ name: 'Bob' })
  const fetchedUser = multiService.getUser('multi-1')
  const deleted = await multiService.deleteUser('multi-1')
  
  assert.strictEqual(multiUser.name, 'Bob', 'should use stubbed createUser')
  assert.strictEqual(fetchedUser.name, 'Multi Stub User', 'should use stubbed getUser')
  assert.strictEqual(deleted, true, 'should use stubbed deleteUser')
  
  createUserStub.restore()
  getUserStub.restore()
  deleteUserStub.restore()

  // Test 4: Function stubbing with different return types
  let callCount = 0
  const originalProcessUserData = processUserData
  global.processUserData = (user) => {
    callCount++
    console.log('🎯 STUBBED processUserData call #' + callCount, 'for user:', user.name)
    return { ...user, processed: true, callCount }
  }
  
  const processed1 = processUserData({ name: 'Alice', age: 25, active: true })
  const processed2 = processUserData({ name: 'Bob', age: 30, active: false })
  
  assert.strictEqual(processed1.processed, true, 'should process first user')
  assert.strictEqual(processed1.callCount, 1, 'should track call count')
  assert.strictEqual(processed2.processed, true, 'should process second user')
  assert.strictEqual(processed2.callCount, 2, 'should increment call count')
  
  // Restore function
  global.processUserData = originalProcessUserData

  // Test 5: Promise-based function stubbing
  const originalFetchUserData = fetchUserData
  global.fetchUserData = async (userId) => {
    console.log('⚡ STUBBED fetchUserData for userId:', userId)
    await new Promise(resolve => setTimeout(resolve, 10)) // Minimal async delay
    return {
      id: userId,
      name: 'Stubbed Async User',
      email: 'stubbed@example.com',
      age: 99,
      stubbed: true
    }
  }
  
  const asyncUser = await fetchUserData('user-123')
  assert.strictEqual(asyncUser.stubbed, true, 'should use stubbed async function')
  assert.strictEqual(asyncUser.name, 'Stubbed Async User', 'should return stubbed data')
  
  // Restore function
  global.fetchUserData = originalFetchUserData

  // Test 6: Error handling with stubbed methods
  const errorService = new UserService()
  const errorStub = stubMethod({
    obj: errorService,
    methodName: 'createUser',
    stubFn: () => {
      throw new Error('Database connection failed')
    }
  })
  
  try {
    await errorService.createUser({ name: 'Error User' })
    assert.fail('Should have thrown an error')
  } catch (error) {
    assert.strictEqual(error.message, 'Database connection failed', 'should throw stubbed error')
  }
  errorStub.restore()

  // Test 7: Callback-style function stubbing
  const originalFetchUserWithCallback = fetchUserWithCallback
  global.fetchUserWithCallback = (userId, callback) => {
    console.log('🔄 STUBBED fetchUserWithCallback for userId:', userId)
    setTimeout(() => {
      callback(null, { id: userId, name: 'Callback Stub User', stubbed: true })
    }, 5)
  }
  
  await new Promise((resolve) => {
    fetchUserWithCallback('cb-123', (error, user) => {
      assert.strictEqual(error, null, 'should not return error')
      assert.strictEqual(user.stubbed, true, 'should return stubbed user')
      resolve()
    })
  })
  
  // Restore function
  global.fetchUserWithCallback = originalFetchUserWithCallback

  // Test 8: Property getter/setter stubbing
  const configObj = { value: 'initial' }
  
  Object.defineProperty(configObj, 'computedValue', {
    get: function() { return this.value.toUpperCase() },
    set: function(newValue) { this.value = newValue.toLowerCase() },
    configurable: true
  })
  
  // Stub the getter
  const originalDescriptor = Object.getOwnPropertyDescriptor(configObj, 'computedValue')
  Object.defineProperty(configObj, 'computedValue', {
    get: function() { 
      console.log('🔍 STUBBED getter called')
      return 'STUBBED_VALUE' 
    },
    set: function(newValue) {
      console.log('📝 STUBBED setter called with:', newValue)
      this.value = 'stubbed-' + newValue
    },
    configurable: true
  })
  
  const stubbedValue = configObj.computedValue
  assert.strictEqual(stubbedValue, 'STUBBED_VALUE', 'should use stubbed getter')
  
  configObj.computedValue = 'test'
  assert.strictEqual(configObj.value, 'stubbed-test', 'should use stubbed setter')
  
  // Restore original descriptor
  Object.defineProperty(configObj, 'computedValue', originalDescriptor)

  // Test 9: Multiple restore scenarios
  const restoreService = new UserService()
  
  const restoreUserStub = stubMethod({
    obj: restoreService,
    methodName: 'createUser',
    stubFn: () => ({ id: 'restore-test' })
  })
  const restoreGetStub = stubMethod({
    obj: restoreService,
    methodName: 'getUser',
    stubFn: () => ({ name: 'Restore Test' })
  })
  
  const beforeRestore = await restoreService.createUser({ name: 'Test' })
  assert.strictEqual(beforeRestore.id, 'restore-test', 'should use stub before restore')
  
  // Restore specific method
  restoreUserStub.restore()
  
  // Test that original method is restored for createUser but stub remains for getUser
  const afterPartialRestore = restoreService.getUser('any-id')
  assert.strictEqual(afterPartialRestore.name, 'Restore Test', 'getUser should still be stubbed')
  
  stubMethod.restoreAll()

  // Test 10: Chained method calls
  const chainService = new UserService()
  const chainCreateStub = stubMethod({
    obj: chainService,
    methodName: 'createUser',
    stubFn: async (userData) => {
      const user = { id: 'chain-test', ...userData, chained: true }
      // Chain to another method
      return chainService.getUser(user.id)
    }
  })
  
  const chainGetStub = stubMethod({
    obj: chainService,
    methodName: 'getUser',
    stubFn: (id) => ({ 
      id, 
      name: 'Chained User', 
      chainResult: true 
    })
  })
  
  const chainedResult = await chainService.createUser({ name: 'Chain Test' })
  assert.strictEqual(chainedResult.chainResult, true, 'should handle chained stub calls')
  assert.strictEqual(chainedResult.chained, undefined, 'original method data should be replaced')
  
  chainCreateStub.restore()
  chainGetStub.restore()

  // Test 11: Context preservation
  let contextValue = null
  const contextObj = {
    value: 'context-test',
    method: function() {
      contextValue = this.value
      return this.value
    }
  }
  
  const contextStub = stubMethod({
    obj: contextObj,
    methodName: 'method',
    stubFn: function() {
      console.log('🎯 Context method called, this.value =', this.value)
      return this.value + '-stubbed'
    }
  })
  
  const contextResult = contextObj.method()
  assert.strictEqual(contextValue, 'context-test', 'should preserve context')
  assert.strictEqual(contextResult, 'context-test-stubbed', 'should use context in stub')
  
  contextStub.restore()

  // Test 12: Performance measurement with stubs
  const perfService = new UserService()
  const originalMethod = perfService.createUser
  
  const perfStub = stubMethod({
    obj: perfService,
    methodName: 'createUser',
    stubFn: async (userData) => {
      const start = Date.now()
      console.log('⏱️ Performance stub starting')
      
      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 5))
      
      const result = { id: 'perf-test', ...userData }
      console.log('⏱️ Performance stub completed in', Date.now() - start, 'ms')
      return result
    }
  })
  
  const perfResult = await perfService.createUser({ name: 'Perf Test' })
  assert.strictEqual(perfResult.id, 'perf-test', 'should work with performance measurement')
  
  perfStub.restore()

  // Test 13: Mixed stub types (function + object method)
  const mixedUser = { name: 'Mixed', age: 25, active: true }
  
  // Stub the utility function
  const mixedProcessUserDataOriginal = processUserData
  global.processUserData = (user) => ({ 
    ...user, 
    functionStubbed: true,
    processedAt: Date.now()
  })
  
  // Stub the object method
  const mixedService = new UserService()
  const mixedStub = stubMethod({
    obj: mixedService,
    methodName: 'createUser',
    stubFn: async (userData) => ({
      id: 'mixed-stub',
      ...userData,
      methodStubbed: true
    })
  })
  
  const functionResult = processUserData(mixedUser)
  const methodResult = await mixedService.createUser(mixedUser)
  
  assert.strictEqual(functionResult.functionStubbed, true, 'should use function stub')
  assert.strictEqual(methodResult.methodStubbed, true, 'should use method stub')
  
  // Restore
  global.processUserData = mixedProcessUserDataOriginal
  mixedStub.restore()

  // Test 14: Edge case - stubbing undefined methods
  const edgeObj = {}
  
  // Add a method dynamically then stub it
  edgeObj.dynamicMethod = function(value) { return value + 1 }
  
  const edgeStub = stubMethod({
    obj: edgeObj,
    methodName: 'dynamicMethod',
    stubFn: function(value) {
      console.log('🔧 Dynamic stub called with:', value)
      return value * 2
    }
  })
  
  const dynamicResult = edgeObj.dynamicMethod(5)
  assert.strictEqual(dynamicResult, 10, 'should stub dynamically added methods')
  
  edgeStub.restore()

  // Test 15: Nested object method stubbing
  const nestedObj = {
    level1: {
      level2: {
        method: function(value) { return value + 1 }
      }
    }
  }
  
  const nestedStub = stubMethod({
    obj: nestedObj.level1.level2,
    methodName: 'method',
    stubFn: function(value) {
      console.log('🪜 Nested stub called with:', value)
      return value * 3
    }
  })
  
  const nestedResult = nestedObj.level1.level2.method(4)
  assert.strictEqual(nestedResult, 12, 'should stub nested object methods')
  
  nestedStub.restore()

  // Test 16: Array method stubbing
  const testArray = [1, 2, 3, 4, 5]
  
  const arrayStub = stubMethod({
    obj: Array.prototype,
    methodName: 'filter',
    stubFn: function(callback) {
      console.log('🔍 Array filter stubbed')
      return [1, 3, 5] // Return odd numbers
    }
  })
  
  const filtered = testArray.filter(x => x > 2)
  assert.deepStrictEqual(filtered, [1, 3, 5], 'should use stubbed array method')
  
  arrayStub.restore()

  // Test 17: Multiple calls tracking
  const trackingObj = {
    counter: 0,
    increment: function() { this.counter++; return this.counter }
  }
  
  const calls = []
  const trackingStub = stubMethod({
    obj: trackingObj,
    methodName: 'increment',
    stubFn: function() {
      calls.push({ timestamp: Date.now(), counter: this.counter })
      this.counter++
      return this.counter
    }
  })
  
  trackingObj.increment()
  trackingObj.increment()
  trackingObj.increment()
  
  assert.strictEqual(trackingObj.counter, 3, 'should track multiple calls')
  assert.strictEqual(calls.length, 3, 'should record all call attempts')
  
  trackingStub.restore()

  console.log('\n✅ All index.test.js advanced stub tests passed!')
  console.log('Total tests executed: 17')
  
  return true
}

// Test helper functions for complex scenarios
function processComplexData(data, options = {}) {
  const { validate = true, transform = true } = options
  
  if (validate && !data.id) {
    throw new Error('Data must have an id')
  }
  
  let result = { ...data }
  
  if (transform) {
    result.processed = true
    result.timestamp = Date.now()
  }
  
  return result
}

async function processAsyncData(data, delay = 100) {
  await new Promise(resolve => setTimeout(resolve, delay))
  return {
    ...data,
    asyncProcessed: true,
    processedAt: new Date().toISOString()
  }
}

function processWithError(data, shouldError = false) {
  if (shouldError) {
    throw new Error(`Processing failed for data: ${data.id}`)
  }
  return { ...data, success: true }
}

// Export for use in other test files
export {
  runTests,
  UserService,
  processUserData,
  fetchUserData,
  fetchUserWithCallback,
  processComplexData,
  processAsyncData,
  processWithError,
  testConfig
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error)
}