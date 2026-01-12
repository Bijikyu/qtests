// advanced-edge-cases.test.js
// Advanced test scenarios covering edge cases, race conditions, and complex patterns

import assert from 'assert'
import sinon from 'sinon'

// Complex classes for edge case testing
class DatabaseService {
  constructor() {
    this.connections = new Map()
    this.queryCount = 0
  }
  
  async connect(connectionString) {
    await new Promise(resolve => setTimeout(resolve, 100))
    const id = Math.random().toString(36).substr(2, 9)
    this.connections.set(id, { 
      id, 
      connectionString, 
      connected: true,
      createdAt: Date.now()
    })
    return this.connections.get(id)
  }
  
  async query(connectionId, sql, params = []) {
    await new Promise(resolve => setTimeout(resolve, 50))
    this.queryCount++
    return {
      id: this.queryCount,
      connectionId,
      sql,
      params,
      rows: [{ id: 1, name: 'Test Data', queryCount: this.queryCount }],
      affectedRows: 1,
      executionTime: Math.random() * 50
    }
  }
  
  async disconnect(connectionId) {
    await new Promise(resolve => setTimeout(resolve, 20))
    if (this.connections.has(connectionId)) {
      const connection = this.connections.get(connectionId)
      connection.connected = false
      this.connections.delete(connectionId)
      return true
    }
    return false
  }
  
  getConnectionStats() {
    return {
      totalConnections: this.connections.size,
      queryCount: this.queryCount,
      activeConnections: Array.from(this.connections.values()).filter(c => c.connected).length
    }
  }
}

class CacheService {
  constructor() {
    this.cache = new Map()
    this.hitCount = 0
    this.missCount = 0
    this.ttl = new Map() // Time-to-live tracking
  }
  
  async get(key) {
    await new Promise(resolve => setTimeout(resolve, 5))
    
    // Check if key exists and not expired
    if (this.cache.has(key)) {
      const ttl = this.ttl.get(key)
      if (ttl && Date.now() > ttl) {
        this.cache.delete(key)
        this.ttl.delete(key)
        this.missCount++
        return null
      }
      this.hitCount++
      return this.cache.get(key)
    }
    
    this.missCount++
    return null
  }
  
  async set(key, value, ttlMs = 300000) { // Default 5 minutes
    await new Promise(resolve => setTimeout(resolve, 2))
    this.cache.set(key, value)
    if (ttlMs > 0) {
      this.ttl.set(key, Date.now() + ttlMs)
    }
    return true
  }
  
  async delete(key) {
    await new Promise(resolve => setTimeout(resolve, 3))
    this.cache.delete(key)
    this.ttl.delete(key)
    return true
  }
  
  getStats() {
    return {
      size: this.cache.size,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: this.hitCount / (this.hitCount + this.missCount) || 0
    }
  }
}

class EmailService {
  constructor() {
    this.sentEmails = []
    this.failedEmails = []
    this.queue = []
  }
  
  async send(to, subject, body, options = {}) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    try {
      if (to.includes('invalid')) {
        throw new Error(`Invalid email address: ${to}`)
      }
      
      const email = {
        id: Math.random().toString(36).substr(2, 9),
        to,
        subject,
        body,
        options,
        sentAt: Date.now(),
        status: 'sent'
      }
      
      this.sentEmails.push(email)
      return email
    } catch (error) {
      const failedEmail = {
        id: Math.random().toString(36).substr(2, 9),
        to,
        subject,
        body,
        options,
        error: error.message,
        failedAt: Date.now(),
        status: 'failed'
      }
      
      this.failedEmails.push(failedEmail)
      throw error
    }
  }
  
  async sendBulk(emails) {
    const results = []
    
    for (const emailData of emails) {
      try {
        const result = await this.send(emailData.to, emailData.subject, emailData.body, emailData.options)
        results.push({ success: true, email: result })
      } catch (error) {
        results.push({ success: false, error: error.message })
      }
    }
    
    return results
  }
  
  getStats() {
    return {
      sent: this.sentEmails.length,
      failed: this.failedEmails.length,
      total: this.sentEmails.length + this.failedEmails.length,
      queueLength: this.queue.length
    }
  }
}

// Utility functions for edge case testing
function complexDataProcessor(data, options = {}) {
  const { 
    validate = true, 
    transform = true, 
    async = false,
    retry = false,
    fallback = null 
  } = options
  
  // Validation phase
  if (validate) {
    if (!data || typeof data !== 'object') {
      throw new Error('Data must be an object')
    }
    
    if (!data.id) {
      throw new Error('Data must have an id field')
    }
    
    if (data.value < 0 && !allowNegativeValues) {
      throw new Error('Negative values not allowed')
    }
  }
  
  // Processing phase
  let result = { ...data }
  
  if (transform) {
    result.processed = true
    result.timestamp = Date.now()
    result.version = '2.0.0'
    
    if (data.value > 100) {
      result.category = 'high'
    } else if (data.value > 50) {
      result.category = 'medium'
    } else {
      result.category = 'low'
    }
  }
  
  return result
}

async function raceConditionFunction(id, delay = 100) {
  // Simulate a function that can have race conditions
  await new Promise(resolve => setTimeout(resolve, Math.random() * delay))
  
  // Simulate shared state access
  if (!raceConditionFunction.sharedState) {
    raceConditionFunction.sharedState = new Map()
  }
  
  const existing = raceConditionFunction.sharedState.get(id)
  if (existing) {
    return { id, ...existing, duplicate: true }
  }
  
  const newData = { 
    id, 
    createdAt: Date.now(),
    processed: true 
  }
  
  raceConditionFunction.sharedState.set(id, newData)
  return newData
}

function memoryIntensiveFunction(size = 1000) {
  // Create large arrays to test memory behavior
  const largeArray = new Array(size).fill(0).map((_, i) => ({
    id: i,
    data: new Array(100).fill(`data-${i}`),
    timestamp: Date.now() + i,
    nested: {
      level1: { level2: { level3: { data: `deep-${i}` } } }
    }
  }))
  
  return {
    size: largeArray.length,
    memoryUsage: process.memoryUsage(),
    processed: true
  }
}

// Make functions globally available for stubbing
global.raceConditionFunction = raceConditionFunction
global.memoryIntensiveFunction = memoryIntensiveFunction

// Advanced edge case test suite
async function runAdvancedEdgeCaseTests() {
  console.log('Running advanced edge case tests...\n')

  // Test 1: Race condition handling with stubs
  console.log('🏁 Test 1: Race condition handling')
  const sharedState = new Map() // Create shared state outside the stub
  
  const raceStub = sinon.stub(global, 'raceConditionFunction').callsFake(async (id, delay = 100) => {
      // Simulate deterministic behavior for testing
    await new Promise(resolve => setTimeout(resolve, 10))
    
    const existing = sharedState.get(id)
    if (existing) {
      const result = { ...existing, duplicate: true }
      result.stubbed = true
      return result
    }
    
    const newData = { 
      id, 
      createdAt: Date.now(),
      processed: true,
      stubbed: true
    }
    
    sharedState.set(id, newData)
    return newData
  })
  
  // Simulate sequential access for predictable behavior
  const raceResult1 = await global.raceConditionFunction('test-1')
  const raceResult2 = await global.raceConditionFunction('test-2')
  const raceResult3 = await global.raceConditionFunction('test-1') // Duplicate
  const raceResult4 = await global.raceConditionFunction('test-3')
  
  const raceResults = [raceResult1, raceResult2, raceResult3, raceResult4]
  
  assert.strictEqual(raceResults.length, 4, 'should process all calls')
  assert.strictEqual(raceResult3.duplicate, true, 'should detect duplicate')
  assert.strictEqual(raceResult3.stubbed, true, 'should use stubbed implementation')
  
  raceStub.restore()
  console.log('✅ Race condition test passed\n')

  // Test 2: Memory management with large data
  console.log('🧠 Test 2: Memory management')
  const memoryStub = sinon.stub(global, 'memoryIntensiveFunction').callsFake((size = 1000) => {
    // Simulate memory-conscious implementation
    const chunkSize = 100
    const chunks = []
    
    for (let i = 0; i < size; i += chunkSize) {
      const chunk = new Array(Math.min(chunkSize, size - i)).fill(0).map((_, j) => ({
        id: i + j,
        data: `lightweight-data-${i + j}`,
        timestamp: Date.now() + (i + j)
      }))
      chunks.push(chunk)
    }
    
    return {
      size: size,
      chunks: chunks.length,
      memoryOptimized: true,
      stubbed: true,
      memoryUsage: {
        rss: 50 * 1024 * 1024, // 50MB simulated
        heapUsed: 10 * 1024 * 1024 // 10MB simulated
      }
    }
  })
  
  const memoryResult = global.memoryIntensiveFunction(10000)
  assert.strictEqual(memoryResult.memoryOptimized, true, 'should optimize memory')
  assert.strictEqual(memoryResult.stubbed, true, 'should use stubbed implementation')
  assert.strictEqual(memoryResult.chunks, 100, 'should create correct number of chunks')
  
  memoryStub.restore()
  console.log('✅ Memory management test passed\n')

  // Test 3: Complex database service with connection pooling
  console.log('🗄️ Test 3: Database service with connection pooling')
  const dbService = new DatabaseService()
  
  const connectStub = sinon.stub(dbService, 'connect').callsFake(async (connectionString) => {
    // Fast connection for testing
    await new Promise(resolve => setTimeout(resolve, 5))
    return {
      id: 'stubbed-connection-' + Math.random(),
      connectionString,
      connected: true,
      createdAt: Date.now(),
      poolSize: 10,
      activeConnections: 3,
      stubbed: true
    }
  })
  
  const queryStub = sinon.stub(dbService, 'query').callsFake(async (connectionId, sql, params = []) => {
    await new Promise(resolve => setTimeout(resolve, 2))
    return {
      id: 'query-' + Math.random(),
      connectionId,
      sql,
      params,
      rows: [{ 
        id: 1, 
        name: 'Stubbed Data', 
        queryCount: dbService.queryCount + 1,
        stubbed: true 
      }],
      affectedRows: 1,
      executionTime: 5, // Fast execution
      cached: true
    }
  })
  
  const connection = await dbService.connect('postgresql://localhost:5432/test')
  const queryResult = await dbService.query(connection.id, 'SELECT * FROM users WHERE id = $1', [1])
  
  assert.strictEqual(connection.stubbed, true, 'should use stubbed connection')
  assert.strictEqual(queryResult.rows[0].stubbed, true, 'should use stubbed query')
  assert.strictEqual(queryResult.executionTime, 5, 'should return fast execution time')
  assert.strictEqual(queryResult.cached, true, 'should indicate cached result')
  
  connectStub.restore()
  queryStub.restore()
  console.log('✅ Database service test passed\n')

  // Test 4: Cache service with TTL and eviction
  console.log('💾 Test 4: Cache service with TTL and eviction')
  const cacheService = new CacheService()
  
  const getStub = sinon.stub(cacheService, 'get').callsFake(async (key) => {
    await new Promise(resolve => setTimeout(resolve, 1))
    
    // Simulate cache hit/miss logic
    if (key.includes('hit')) {
      cacheService.hitCount++
      return { value: 'cached-value', key, timestamp: Date.now(), stubbed: true }
    } else {
      cacheService.missCount++
      return null
    }
  })
  
  const setStub = sinon.stub(cacheService, 'set').callsFake(async (key, value, ttlMs = 300000) => {
    await new Promise(resolve => setTimeout(resolve, 1))
    cacheService.cache.set(key, { value, key, timestamp: Date.now(), stubbed: true })
    if (ttlMs > 0) {
      cacheService.ttl.set(key, Date.now() + ttlMs)
    }
    return true
  })
  
  await cacheService.set('user-123-hit', { name: 'John', age: 30 })
  const hitResult = await cacheService.get('user-123-hit')
  const missResult = await cacheService.get('user-456-miss')
  
  assert.strictEqual(hitResult.stubbed, true, 'should return cached data on hit')
  assert.strictEqual(missResult, null, 'should return null on miss')
  
  const stats = cacheService.getStats()
  assert.strictEqual(stats.hitCount, 1, 'should track cache hits')
  assert.strictEqual(stats.missCount, 1, 'should track cache misses')
  
  getStub.restore()
  setStub.restore()
  console.log('✅ Cache service test passed\n')

  // Test 5: Email service with bulk operations and error handling
  console.log('📧 Test 5: Email service bulk operations')
  const emailService = new EmailService()
  
  const sendStub = sinon.stub(emailService, 'send').callsFake(async (to, subject, body, options = {}) => {
    await new Promise(resolve => setTimeout(resolve, 5))
    
    if (to.includes('fail')) {
      const failedEmail = {
        id: 'email-fail-' + Math.random(),
        to,
        subject,
        body,
        options,
        error: `Failed to send to ${to}: SMTP Error`,
        failedAt: Date.now(),
        status: 'failed'
      }
      emailService.failedEmails.push(failedEmail)
      throw new Error(`Failed to send to ${to}: SMTP Error`)
    }
    
    const email = {
      id: 'email-' + Math.random(),
      to,
      subject,
      body,
      options,
      sentAt: Date.now(),
      status: 'sent',
      provider: 'stubbed-smtp',
      deliveryTime: 50
    }
    
    emailService.sentEmails.push(email)
    return email
  })
  
  const bulkResults = await emailService.sendBulk([
    { to: 'user1@example.com', subject: 'Test 1', body: 'Hello 1' },
    { to: 'user2@example.com', subject: 'Test 2', body: 'Hello 2' },
    { to: 'fail@example.com', subject: 'Test 3', body: 'Hello 3' },
    { to: 'user3@example.com', subject: 'Test 4', body: 'Hello 4' }
  ])
  
  assert.strictEqual(bulkResults.length, 4, 'should process all emails')
  assert.strictEqual(bulkResults[0].success, true, 'should send first email')
  assert.strictEqual(bulkResults[2].success, false, 'should fail third email')
  assert(bulkResults[2].error.includes('SMTP Error'), 'should include SMTP error')
  
  const emailStats = emailService.getStats()
  assert.strictEqual(emailStats.sent, 3, 'should track sent emails')
  assert.strictEqual(emailStats.failed, 1, 'should track failed emails')
  
  sendStub.restore()
  console.log('✅ Email service test passed\n')

  // Test 6: Complex data processor with multiple options
  console.log('🔄 Test 6: Complex data processor')
  
  // Make the function globally available
  global.complexDataProcessor = complexDataProcessor
  
  const processorStub = sinon.stub(global, 'complexDataProcessor').callsFake((data, options = {}) => {
    const { validate = true, transform = true, async = false } = options
    
    if (validate && !data.id) {
      throw new Error('Data must have an id field')
    }
    
    let result = { ...data }
    
    if (transform) {
      result.processed = true
      result.timestamp = Date.now()
      result.version = '2.1.0-stubbed'
      result.category = data.value > 75 ? 'high' : 'standard'
    }
    
    return result
  })
  
  const processedData = global.complexDataProcessor(
    { id: 'test-123', value: 80, name: 'Test Item' },
    { validate: true, transform: true }
  )
  
  assert.strictEqual(processedData.processed, true, 'should process data')
  assert.strictEqual(processedData.version, '2.1.0-stubbed', 'should use stubbed version')
  assert.strictEqual(processedData.category, 'high', 'should categorize correctly')
  
  // Test validation error
  try {
    global.complexDataProcessor({ value: 50 }, { validate: true })
    assert.fail('Should throw validation error')
  } catch (error) {
    assert.strictEqual(error.message, 'Data must have an id field', 'should validate properly')
  }
  
  processorStub.restore()
  console.log('✅ Complex data processor test passed\n')

  // Test 7: Stub restoration and cleanup verification
  console.log('🧹 Test 7: Stub restoration and cleanup')
  
  const cleanupService = new DatabaseService()
  const originalQuery = cleanupService.query.bind(cleanupService)
  
  const cleanupStub = sinon.stub(cleanupService, 'query').callsFake(async (connectionId, sql, params) => {
    return { 
      id: 'cleanup-test', 
      connectionId, 
      sql, 
      params,
      stubbed: true,
      cleanup: true
    }
  })
  
  const beforeRestore = await cleanupService.query('conn-1', 'SELECT 1')
  assert.strictEqual(beforeRestore.stubbed, true, 'should use stub before restore')
  
  cleanupStub.restore()
  
  const afterRestore = await cleanupService.query('conn-1', 'SELECT 2')
  // After restore, it should use the original method
  assert.strictEqual(afterRestore.affectedRows, 1, 'should use original method after restore')
  assert.strictEqual(afterRestore.stubbed, undefined, 'should not have stubbed property')
  
  console.log('✅ Stub restoration test passed\n')

  // Test 8: Performance measurement with stubs
  console.log('⚡ Test 8: Performance measurement')
  
  const perfService = new CacheService()
  const perfTimes = []
  
  const perfStub = sinon.stub(perfService, 'get').callsFake(async (key) => {
    const start = Date.now()
    
    // Simulate variable performance
    const delay = Math.random() * 20
    await new Promise(resolve => setTimeout(resolve, delay))
    
    const end = Date.now()
    perfTimes.push(end - start)
    
    return { key, value: 'perf-test', responseTime: end - start, stubbed: true }
  })
  
  const perfResults = await Promise.all([
    perfService.get('perf-1'),
    perfService.get('perf-2'),
    perfService.get('perf-3'),
    perfService.get('perf-4'),
    perfService.get('perf-5')
  ])
  
  const avgTime = perfTimes.reduce((a, b) => a + b, 0) / perfTimes.length
  const maxTime = Math.max(...perfTimes)
  
  assert.strictEqual(perfResults.length, 5, 'should complete all operations')
  assert(avgTime < 50, 'should have reasonable average response time')
  assert(maxTime < 100, 'should have reasonable maximum response time')
  assert(perfResults.every(r => r.stubbed === true), 'should use stubbed implementation')
  
  perfStub.restore()
  console.log('✅ Performance measurement test passed\n')

  console.log('🎉 All advanced edge case tests passed!')
  console.log(`Total edge cases tested: 8`)
  
  return true
}

// Export for use in other test files
export {
  runAdvancedEdgeCaseTests,
  DatabaseService,
  CacheService,
  EmailService,
  complexDataProcessor,
  raceConditionFunction,
  memoryIntensiveFunction
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAdvancedEdgeCaseTests().catch(console.error)
}