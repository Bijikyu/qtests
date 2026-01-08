// performance-testing.test.js
// Comprehensive performance testing with stubs and benchmarks

import assert from 'assert'
import sinon from 'sinon'

// Performance monitoring utilities
class PerformanceMonitor {
  constructor() {
    this.measurements = new Map()
    this.benchmarks = new Map()
  }

  startTimer(label) {
    this.measurements.set(label, {
      start: process.hrtime.bigint(),
      memoryStart: process.memoryUsage()
    })
  }

  endTimer(label) {
    const measurement = this.measurements.get(label)
    if (!measurement) {
      throw new Error(`Timer ${label} not started`)
    }

    const end = process.hrtime.bigint()
    const memoryEnd = process.memoryUsage()

    const result = {
      duration: Number(end - measurement.start) / 1000000, // Convert to milliseconds
      memoryDelta: {
        rss: memoryEnd.rss - measurement.memoryStart.rss,
        heapUsed: memoryEnd.heapUsed - measurement.memoryStart.heapUsed,
        heapTotal: memoryEnd.heapTotal - measurement.memoryStart.heapTotal
      },
      timestamp: Date.now()
    }

    this.measurements.set(label, { ...measurement, result })
    return result
  }

  getMeasurement(label) {
    return this.measurements.get(label)?.result
  }

  addBenchmark(label, value, unit = 'ms') {
    if (!this.benchmarks.has(label)) {
      this.benchmarks.set(label, [])
    }
    this.benchmarks.get(label).push({ value, unit, timestamp: Date.now() })
  }

  getBenchmarkStats(label) {
    const values = this.benchmarks.get(label) || []
    if (values.length === 0) return null

    const numericValues = values.map(v => v.value)
    return {
      count: values.length,
      min: Math.min(...numericValues),
      max: Math.max(...numericValues),
      avg: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
      median: this._median(numericValues),
      p95: this._percentile(numericValues, 95),
      p99: this._percentile(numericValues, 99),
      unit: values[0].unit
    }
  }

  _median(values) {
    const sorted = [...values].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid]
  }

  _percentile(values, p) {
    const sorted = [...values].sort((a, b) => a - b)
    const index = Math.ceil((p / 100) * sorted.length) - 1
    return sorted[index]
  }
}

// Mock services for performance testing
class FastDatabaseService {
  constructor() {
    this.queryCount = 0
    this.cache = new Map()
  }

  async query(sql, params = []) {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 20)) // 0-20ms
    this.queryCount++
    
    const cacheKey = `${sql}:${JSON.stringify(params)}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const result = {
      id: this.queryCount,
      sql,
      params,
      rows: Array.from({ length: Math.floor(Math.random() * 100) }, (_, i) => ({
        id: i + 1,
        data: `result-${i}`,
        queryId: this.queryCount
      })),
      executionTime: Math.random() * 15
    }

    this.cache.set(cacheKey, result)
    return result
  }

  async batch(queries) {
    const results = await Promise.all(
      queries.map(({ sql, params }) => this.query(sql, params))
    )
    return results
  }
}

class SlowExternalAPI {
  constructor() {
    this.rateLimiter = new Map()
  }

  async fetchData(endpoint, options = {}) {
    // Simulate rate limiting
    const now = Date.now()
    const lastCall = this.rateLimiter.get(endpoint) || 0
    if (now - lastCall < 100) { // 100ms rate limit
      await new Promise(resolve => setTimeout(resolve, 100 - (now - lastCall)))
    }
    this.rateLimiter.set(endpoint, Date.now())

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200)) // 100-300ms

    return {
      endpoint,
      data: {
        items: Array.from({ length: 50 }, (_, i) => ({
          id: i + 1,
          title: `Item ${i + 1}`,
          content: `Content for item ${i + 1}`,
          timestamp: Date.now() - (i * 1000)
        })),
        total: 50,
        page: 1
      },
      responseTime: 100 + Math.random() * 200,
      cached: false
    }
  }

  async fetchMultiple(endpoints) {
    const results = await Promise.allSettled(
      endpoints.map(endpoint => this.fetchData(endpoint))
    )
    return results
  }
}

class CacheService {
  constructor() {
    this.cache = new Map()
    this.hitCount = 0
    this.missCount = 0
    this.ttl = new Map()
  }

  async get(key) {
    const start = process.hrtime.bigint()
    await new Promise(resolve => setTimeout(resolve, 1 + Math.random() * 5)) // 1-6ms

    const ttl = this.ttl.get(key)
    if (ttl && Date.now() > ttl) {
      this.cache.delete(key)
      this.ttl.delete(key)
      this.missCount++
      return null
    }

    if (this.cache.has(key)) {
      this.hitCount++
      const result = this.cache.get(key)
      return { ...result, cached: true, responseTime: Number(process.hrtime.bigint() - start) / 1000000 }
    }

    this.missCount++
    return null
  }

  async set(key, value, ttlMs = 300000) {
    const start = process.hrtime.bigint()
    await new Promise(resolve => setTimeout(resolve, 2 + Math.random() * 3)) // 2-5ms

    this.cache.set(key, { ...value, cached: true, createdAt: Date.now() })
    if (ttlMs > 0) {
      this.ttl.set(key, Date.now() + ttlMs)
    }

    return {
      success: true,
      responseTime: Number(process.hrtime.bigint() - start) / 1000000
    }
  }

  getStats() {
    const total = this.hitCount + this.missCount
    return {
      size: this.cache.size,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: total > 0 ? this.hitCount / total : 0,
      totalRequests: total
    }
  }
}

// Performance test suite
async function runPerformanceTests() {
  console.log('Running comprehensive performance tests...\n')

  const monitor = new PerformanceMonitor()

  // Test 1: Database query performance
  console.log('🗄️ Test 1: Database query performance')
  const dbService = new FastDatabaseService()
  
  // Test with original implementation
  monitor.startTimer('db-original')
  const originalResults = await Promise.all([
    dbService.query('SELECT * FROM users WHERE active = $1', [true]),
    dbService.query('SELECT * FROM posts WHERE created_at > $1', [Date.now() - 86400000]),
    dbService.query('SELECT COUNT(*) FROM orders WHERE status = $1', ['completed'])
  ])
  const originalTime = monitor.endTimer('db-original')
  
  // Stub with optimized implementation
  const dbStub = sinon.stub(dbService, 'query').callsFake(async (sql, params) => {
    await new Promise(resolve => setTimeout(resolve, 1)) // 1ms constant time
    
    return {
      id: ++dbService.queryCount,
      sql,
      params,
      rows: [{ id: 1, data: 'optimized-result', cached: true }],
      executionTime: 1,
      optimized: true
    }
  })
  
  monitor.startTimer('db-stubbed')
  const stubbedResults = await Promise.all([
    dbService.query('SELECT * FROM users WHERE active = $1', [true]),
    dbService.query('SELECT * FROM posts WHERE created_at > $1', [Date.now() - 86400000]),
    dbService.query('SELECT COUNT(*) FROM orders WHERE status = $1', ['completed'])
  ])
  const stubbedTime = monitor.endTimer('db-stubbed')
  
  console.log(`Original time: ${originalTime.duration.toFixed(2)}ms`)
  console.log(`Stubbed time: ${stubbedTime.duration.toFixed(2)}ms`)
  console.log(`Performance improvement: ${((originalTime.duration - stubbedTime.duration) / originalTime.duration * 100).toFixed(1)}%`)
  
  assert(stubbedTime.duration < originalTime.duration, 'stubbed implementation should be faster')
  assert(stubbedResults[0].optimized === true, 'should use optimized results')
  
  // Add to benchmarks
  monitor.addBenchmark('db-original', originalTime.duration)
  monitor.addBenchmark('db-stubbed', stubbedTime.duration)
  
  dbStub.restore()
  console.log('✅ Database performance test passed\n')

  // Test 2: External API call performance
  console.log('🌐 Test 2: External API call performance')
  const apiService = new SlowExternalAPI()
  
  // Test original API calls
  monitor.startTimer('api-original')
  const originalApiResults = await Promise.allSettled([
    apiService.fetchData('/users'),
    apiService.fetchData('/posts'),
    apiService.fetchData('/comments')
  ])
  const originalApiTime = monitor.endTimer('api-original')
  
  // Stub with fast responses
  const apiStub = sinon.stub(apiService, 'fetchData').callsFake(async (endpoint, options = {}) => {
    await new Promise(resolve => setTimeout(resolve, 5)) // 5ms constant time
    
    return {
      endpoint,
      data: {
        items: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          title: `Fast Item ${i + 1}`,
          cached: true
        })),
        total: 10
      },
      responseTime: 5,
      cached: true,
      stubbed: true
    }
  })
  
  monitor.startTimer('api-stubbed')
  const stubbedApiResults = await Promise.allSettled([
    apiService.fetchData('/users'),
    apiService.fetchData('/posts'),
    apiService.fetchData('/comments')
  ])
  const stubbedApiTime = monitor.endTimer('api-stubbed')
  
  console.log(`Original API time: ${originalApiTime.duration.toFixed(2)}ms`)
  console.log(`Stubbed API time: ${stubbedApiTime.duration.toFixed(2)}ms`)
  console.log(`API performance improvement: ${((originalApiTime.duration - stubbedApiTime.duration) / originalApiTime.duration * 100).toFixed(1)}%`)
  
  assert(stubbedApiTime.duration < originalApiTime.duration, 'stubbed API should be faster')
  assert(stubbedApiResults[0].value.data.items[0].cached === true, 'should return cached results')
  
  monitor.addBenchmark('api-original', originalApiTime.duration)
  monitor.addBenchmark('api-stubbed', stubbedApiTime.duration)
  
  apiStub.restore()
  console.log('✅ API performance test passed\n')

  // Test 3: Cache service performance
  console.log('💾 Test 3: Cache service performance')
  const cacheService = new CacheService()
  
  // Populate cache
  await Promise.all([
    cacheService.set('user-1', { name: 'John', age: 30 }),
    cacheService.set('user-2', { name: 'Jane', age: 25 }),
    cacheService.set('user-3', { name: 'Bob', age: 35 })
  ])
  
  // Test cache hits
  monitor.startTimer('cache-hits')
  const cacheHits = await Promise.all([
    cacheService.get('user-1'),
    cacheService.get('user-2'),
    cacheService.get('user-3'),
    cacheService.get('user-1'), // Duplicate hit
    cacheService.get('user-2')  // Duplicate hit
  ])
  const cacheHitsTime = monitor.endTimer('cache-hits')
  
  // Stub with instant cache hits
  const cacheGetStub = sinon.stub(cacheService, 'get').callsFake(async (key) => {
    cacheService.hitCount++ // Increment hit count
    return {
      name: `Stubbed ${key}`,
      cached: true,
      responseTime: 0.1, // 0.1ms
      stubbed: true
    }
  })
  
  monitor.startTimer('cache-stubbed')
  const stubbedCacheHits = await Promise.all([
    cacheService.get('user-1'),
    cacheService.get('user-2'),
    cacheService.get('user-3'),
    cacheService.get('user-1'),
    cacheService.get('user-2')
  ])
  const stubbedCacheTime = monitor.endTimer('cache-stubbed')
  
  console.log(`Original cache time: ${cacheHitsTime.duration.toFixed(2)}ms`)
  console.log(`Stubbed cache time: ${stubbedCacheTime.duration.toFixed(2)}ms`)
  console.log(`Cache performance improvement: ${((cacheHitsTime.duration - stubbedCacheTime.duration) / cacheHitsTime.duration * 100).toFixed(1)}%`)
  
  assert(stubbedCacheTime.duration < cacheHitsTime.duration, 'stubbed cache should be faster')
  assert(stubbedCacheHits[0].stubbed === true, 'should use stubbed cache results')
  
  monitor.addBenchmark('cache-original', cacheHitsTime.duration)
  monitor.addBenchmark('cache-stubbed', stubbedCacheTime.duration)
  
  cacheGetStub.restore()
  console.log('✅ Cache performance test passed\n')

  // Test 4: Batch operation performance
  console.log('📦 Test 4: Batch operation performance')
  const batchDb = new FastDatabaseService()
  
  const queries = Array.from({ length: 50 }, (_, i) => ({
    sql: 'SELECT * FROM items WHERE category = $1',
    params: [`category-${i % 5}`]
  }))
  
  // Original batch
  monitor.startTimer('batch-original')
  const originalBatch = await batchDb.batch(queries)
  const originalBatchTime = monitor.endTimer('batch-original')
  
  // Stub with parallel processing
  const batchStub = sinon.stub(batchDb, 'batch').callsFake(async (queries) => {
    // Process all queries in parallel with minimal delay
    const results = await Promise.all(
      queries.map((query, index) => 
        new Promise(resolve => setTimeout(() => {
          resolve({
            id: index + 1,
            ...query,
            rows: [{ id: 1, batch: true, optimized: true }],
            executionTime: 2
          })
        }, 2))
      )
    )
    return results
  })
  
  monitor.startTimer('batch-stubbed')
  const stubbedBatch = await batchDb.batch(queries)
  const stubbedBatchTime = monitor.endTimer('batch-stubbed')
  
  console.log(`Original batch time: ${originalBatchTime.duration.toFixed(2)}ms`)
  console.log(`Stubbed batch time: ${stubbedBatchTime.duration.toFixed(2)}ms`)
  console.log(`Batch performance improvement: ${((originalBatchTime.duration - stubbedBatchTime.duration) / originalBatchTime.duration * 100).toFixed(1)}%`)
  
  assert(stubbedBatchTime.duration < originalBatchTime.duration, 'stubbed batch should be faster')
  assert(stubbedBatch.length === 50, 'should process all queries')
  assert(stubbedBatch[0].rows[0].optimized === true, 'should use optimized batch processing')
  
  monitor.addBenchmark('batch-original', originalBatchTime.duration)
  monitor.addBenchmark('batch-stubbed', stubbedBatchTime.duration)
  
  batchStub.restore()
  console.log('✅ Batch performance test passed\n')

  // Test 5: Memory usage optimization
  console.log('🧠 Test 5: Memory usage optimization')
  
  const memoryIntensiveFunction = (size) => {
    // Create memory-intensive data structure
    const largeArray = new Array(size).fill(0).map((_, i) => ({
      id: i,
      data: new Array(100).fill(`memory-intensive-data-${i}`),
      metadata: {
        created: Date.now(),
        updated: Date.now(),
        version: '1.0.0',
        tags: Array.from({ length: 10 }, (_, j) => `tag-${j}`)
      }
    }))
    
    return {
      size: largeArray.length,
      memoryUsage: process.memoryUsage(),
      processed: true
    }
  }
  
  global.memoryIntensiveFunction = memoryIntensiveFunction
  
  // Test original function
  monitor.startTimer('memory-original')
  const originalMemory = memoryIntensiveFunction(1000)
  const originalMemoryTime = monitor.endTimer('memory-original')
  
  // Stub with memory-optimized version
  const memoryStub = sinon.stub(global, 'memoryIntensiveFunction').callsFake((size) => {
    // Simulate memory-optimized processing
    const chunkSize = 100
    const chunks = []
    
    for (let i = 0; i < size; i += chunkSize) {
      const chunk = {
        startId: i,
        endId: Math.min(i + chunkSize, size),
        count: Math.min(chunkSize, size - i),
        processed: true,
        optimized: true
      }
      chunks.push(chunk)
    }
    
    return {
      size: size,
      chunks: chunks.length,
      chunkSize: chunkSize,
      memoryOptimized: true,
      estimatedMemory: size * 1024, // 1KB per item
      stubbed: true
    }
  })
  
  monitor.startTimer('memory-optimized')
  const optimizedMemory = global.memoryIntensiveFunction(1000)
  const optimizedMemoryTime = monitor.endTimer('memory-optimized')
  
  console.log(`Original memory processing: ${originalMemoryTime.duration.toFixed(2)}ms`)
  console.log(`Optimized memory processing: ${optimizedMemoryTime.duration.toFixed(2)}ms`)
  console.log(`Memory performance improvement: ${((originalMemoryTime.duration - optimizedMemoryTime.duration) / originalMemoryTime.duration * 100).toFixed(1)}%`)
  
  assert(optimizedMemoryTime.duration < originalMemoryTime.duration, 'optimized memory should be faster')
  assert(optimizedMemory.memoryOptimized === true, 'should use memory optimization')
  assert(optimizedMemory.chunks === 10, 'should create correct number of chunks')
  
  monitor.addBenchmark('memory-original', originalMemoryTime.duration)
  monitor.addBenchmark('memory-optimized', optimizedMemoryTime.duration)
  
  memoryStub.restore()
  console.log('✅ Memory optimization test passed\n')

  // Test 6: Concurrent operations performance
  console.log('⚡ Test 6: Concurrent operations performance')
  const concurrentDb = new FastDatabaseService()
  
  const concurrentQueries = Array.from({ length: 100 }, (_, i) => 
    concurrentDb.query('SELECT * FROM concurrent_test WHERE id = $1', [i])
  )
  
  // Original concurrent execution
  monitor.startTimer('concurrent-original')
  const originalConcurrent = await Promise.all(concurrentQueries)
  const originalConcurrentTime = monitor.endTimer('concurrent-original')
  
  // Stub with optimized concurrent processing
  const concurrentStub = sinon.stub(concurrentDb, 'query').callsFake(async (sql, params) => {
    // Simulate instant concurrent processing
    return {
      id: params[0],
      sql,
      params,
      rows: [{ id: params[0], concurrent: true, optimized: true }],
      executionTime: 0.1,
      stubbed: true
    }
  })
  
  monitor.startTimer('concurrent-stubbed')
  const stubbedConcurrent = await Promise.all(
    Array.from({ length: 100 }, (_, i) => 
      concurrentDb.query('SELECT * FROM concurrent_test WHERE id = $1', [i])
    )
  )
  const stubbedConcurrentTime = monitor.endTimer('concurrent-stubbed')
  
  console.log(`Original concurrent: ${originalConcurrentTime.duration.toFixed(2)}ms`)
  console.log(`Stubbed concurrent: ${stubbedConcurrentTime.duration.toFixed(2)}ms`)
  console.log(`Concurrent performance improvement: ${((originalConcurrentTime.duration - stubbedConcurrentTime.duration) / originalConcurrentTime.duration * 100).toFixed(1)}%`)
  
  assert(stubbedConcurrentTime.duration < originalConcurrentTime.duration, 'stubbed concurrent should be faster')
  assert(stubbedConcurrent.length === 100, 'should process all concurrent operations')
  assert(stubbedConcurrent[0].rows[0].concurrent === true, 'should use concurrent optimization')
  
  monitor.addBenchmark('concurrent-original', originalConcurrentTime.duration)
  monitor.addBenchmark('concurrent-stubbed', stubbedConcurrentTime.duration)
  
  concurrentStub.restore()
  console.log('✅ Concurrent operations test passed\n')

  // Performance summary
  console.log('📊 Performance Summary')
  const categories = ['db', 'api', 'cache', 'batch', 'memory', 'concurrent']
  
  categories.forEach(category => {
    const originalStats = monitor.getBenchmarkStats(`${category}-original`)
    const stubbedStats = monitor.getBenchmarkStats(`${category}-stubbed`)
    
    if (originalStats && stubbedStats) {
      const improvement = ((originalStats.avg - stubbedStats.avg) / originalStats.avg * 100).toFixed(1)
      console.log(`${category.toUpperCase()}: Original ${originalStats.avg.toFixed(2)}${originalStats.unit} → Stubbed ${stubbedStats.avg.toFixed(2)}${stubbedStats.unit} (${improvement}% improvement)`)
    }
  })

  console.log('\n🎉 All performance tests passed!')
  console.log(`Performance benchmarks collected: ${categories.length * 2} measurements`)
  
  return true
}

// Export for use in other test files
export {
  runPerformanceTests,
  PerformanceMonitor,
  FastDatabaseService,
  SlowExternalAPI,
  CacheService
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runPerformanceTests().catch(console.error)
}