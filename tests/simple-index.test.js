// simple-index.test.js
// Simple Node.js test file using sinon for basic stub testing

import assert from 'assert'
import sinon from 'sinon'

// Test class for basic stub testing
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
}

// Simple function for testing
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

// Make it globally available for stubbing
global.processUserData = processUserData

// Run the test suite
async function runSimpleTests() {
  console.log('Running simple-index.test.js with sinon...\n')

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

  // Test 2: Function stubbing using sinon
  const processUserDataStub = sinon.stub(global, 'processUserData').callsFake((user) => {
    console.log('🎯 STUBBED processUserData called for user:', user?.name)
    return { ...user, processed: true, stubbed: true }
  })
  
  const processedUser = global.processUserData({ name: 'Bob', age: 30, active: true })
  assert.strictEqual(processedUser.processed, true, 'should process user data')
  assert.strictEqual(processedUser.stubbed, true, 'should mark as stubbed')
  
  // Restore function
  processUserDataStub.restore()

  // Test 3: Multiple method stubs on same object
  const multiService = new UserService()
  
  const createUserStub = sinon.stub(multiService, 'createUser').callsFake((userData) => ({ id: 'multi-1', ...userData }))
  const getUserStub = sinon.stub(multiService, 'getUser').callsFake((id) => ({ id, name: 'Multi Stub User' }))
  
  const multiUser = await multiService.createUser({ name: 'Bob' })
  const fetchedUser = multiService.getUser('multi-1')
  
  assert.strictEqual(multiUser.name, 'Bob', 'should use stubbed createUser')
  assert.strictEqual(fetchedUser.name, 'Multi Stub User', 'should use stubbed getUser')
  
  createUserStub.restore()
  getUserStub.restore()

  // Test 4: Async function stubbing
  const originalFetchUserData = async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      active: true
    }
  }

  global.fetchUserData = async (userId) => {
    console.log('⚡ STUBBED fetchUserData for userId:', userId)
    await new Promise(resolve => setTimeout(resolve, 10))
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

  // Test 5: Error handling with stubbed methods
  const errorService = new UserService()
  const errorStub = sinon.stub(errorService, 'createUser').throws(new Error('Database connection failed'))
  
  try {
    await errorService.createUser({ name: 'Error User' })
    assert.fail('Should have thrown an error')
  } catch (error) {
    assert.strictEqual(error.message, 'Database connection failed', 'should throw stubbed error')
  }
  errorStub.restore()

  // Test 6: Method with callback
  const fetchUserWithCallback = (userId, callback) => {
    setTimeout(() => {
      if (userId === 'invalid') {
        callback(new Error('User not found'))
      } else {
        callback(null, { id: userId, name: 'Callback User' })
      }
    }, 50)
  }

  global.fetchUserWithCallback = fetchUserWithCallback
  
  const callbackStub = sinon.stub(global, 'fetchUserWithCallback').callsFake((userId, callback) => {
    console.log('🔄 STUBBED fetchUserWithCallback for userId:', userId)
    setTimeout(() => {
      callback(null, { id: userId, name: 'Callback Stub User', stubbed: true })
    }, 5)
  })
  
  await new Promise((resolve) => {
    global.fetchUserWithCallback('cb-123', (error, user) => {
      assert.strictEqual(error, null, 'should not return error')
      assert.strictEqual(user.stubbed, true, 'should return stubbed user')
      resolve()
    })
  })
  
  // Restore function
  callbackStub.restore()

  // Test 7: Array method stubbing
  const testArray = [1, 2, 3, 4, 5]
  
  const arrayStub = sinon.stub(Array.prototype, 'filter').callsFake(function(callback) {
    console.log('🔍 Array filter stubbed')
    return [1, 3, 5] // Return odd numbers
  })
  
  const filtered = testArray.filter(x => x > 2)
  assert.deepStrictEqual(filtered, [1, 3, 5], 'should use stubbed array method')
  
  arrayStub.restore()

  // Test 8: Context preservation
  let contextValue = null
  const contextObj = {
    value: 'context-test',
    method: function() {
      contextValue = this.value
      return this.value
    }
  }
  
  const contextStub = sinon.stub(contextObj, 'method').callsFake(function() {
    console.log('🎯 Context method called, this.value =', this.value)
    contextValue = this.value // Store context value
    return this.value + '-stubbed'
  })
  
  const contextResult = contextObj.method()
  assert.strictEqual(contextValue, 'context-test', 'should preserve context')
  assert.strictEqual(contextResult, 'context-test-stubbed', 'should use context in stub')
  
  contextStub.restore()

  // Test 9: Call tracking
  const trackingObj = {
    counter: 0,
    increment: function() { this.counter++; return this.counter }
  }
  
  const calls = []
  const trackingStub = sinon.stub(trackingObj, 'increment').callsFake(function() {
    calls.push({ timestamp: Date.now(), counter: this.counter })
    this.counter++
    return this.counter
  })
  
  trackingObj.increment()
  trackingObj.increment()
  trackingObj.increment()
  
  assert.strictEqual(trackingObj.counter, 3, 'should track multiple calls')
  assert.strictEqual(calls.length, 3, 'should record all call attempts')
  assert.strictEqual(trackingStub.callCount, 3, 'should track stub call count')
  
  trackingStub.restore()

  // Test 10: Verify called with
  const verifyObj = {
    calculate: function(a, b) { return a + b }
  }
  
  const verifyStub = sinon.stub(verifyObj, 'calculate').callsFake((a, b) => {
    console.log('🔢 Calculate called with:', a, b)
    return a * b // Multiply instead of add
  })
  
  const result1 = verifyObj.calculate(2, 3)
  const result2 = verifyObj.calculate(5, 4)
  
  assert.strictEqual(result1, 6, 'should multiply 2*3')
  assert.strictEqual(result2, 20, 'should multiply 5*4')
  assert.strictEqual(verifyStub.calledTwice, true, 'should be called twice')
  assert(verifyStub.calledWith(2, 3), 'should be called with 2,3')
  assert(verifyStub.calledWith(5, 4), 'should be called with 5,4')
  
  verifyStub.restore()

  console.log('\n✅ All simple-index.test.js tests passed!')
  console.log('Total tests executed: 10')
  
  return true
}

// Export for use in other test files
export {
  runSimpleTests,
  UserService,
  processUserData
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSimpleTests().catch(console.error)
}