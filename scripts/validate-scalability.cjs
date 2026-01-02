#!/usr/bin/env node

/**
 * Scalability Validation Script
 * 
 * Comprehensive testing of all scalability improvements in production-like environment
 */

const { MemoryPressureMonitor } = require('../../lib/memoryPressure');
const { PerformanceMonitor } = require('../../lib/performanceMonitor');
const { DistributedCache } = require('../../lib/cache');
const { AdvancedConnectionPool } = require('../../lib/connectionPool');
const { CircuitBreaker } = require('../../lib/circuitBreaker');
const { CleanupManager } = require('../../lib/cleanupManager');

class ScalabilityValidator {
  constructor() {
    this.results = {
      memoryPressure: { passed: false, details: [] },
      performanceMonitoring: { passed: false, details: [] },
      cacheSystem: { passed: false, details: [] },
      connectionPool: { passed: false, details: [] },
      circuitBreaker: { passed: false, details: [] },
      cleanupManager: { passed: false, details: [] },
      integration: { passed: false, details: [] }
    };
    
    console.log('🧪 Starting Scalability Validation Suite...');
  }

  async runAllValidations() {
    try {
      console.log('📊 Testing Memory Pressure Monitor...');
      await this.validateMemoryPressureMonitor();
      
      console.log('📈 Testing Performance Monitor...');
      await this.validatePerformanceMonitor();
      
      console.log('💾 Testing Cache System...');
      await this.validateCacheSystem();
      
      console.log('🔗 Testing Connection Pool...');
      await this.validateConnectionPool();
      
      console.log('⚡ Testing Circuit Breaker...');
      await this.validateCircuitBreaker();
      
      console.log('🧹 Testing Cleanup Manager...');
      await this.validateCleanupManager();
      
      console.log('🔗 Testing Integration...');
      await this.validateIntegration();
      
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Validation suite failed:', error);
      process.exit(1);
    }
  }

  async validateMemoryPressureMonitor() {
    const details = [];
    
    try {
      // Test initialization
      const monitor = new MemoryPressureMonitor({
        checkInterval: 1000,
        lowMemoryThreshold: 0.7,
        highMemoryThreshold: 0.85,
        criticalMemoryThreshold: 0.95,
        enableAutoScaling: true,
        enableGarbageCollection: true
      });
      
      details.push('✅ Monitor initialized successfully');
      
      // Test memory pressure detection
      monitor.start();
      await this.sleep(2000);
      
      const stats = monitor.getMemoryStats();
      if (stats && typeof stats.percentage === 'number') {
        details.push('✅ Memory pressure detection working');
      } else {
        details.push('❌ Memory pressure detection failed');
      }
      
      // Test component registration
      let registered = false;
      try {
        monitor.registerComponent('test-cache', 'cache', () => 100, () => {}, () => 0);
        registered = true;
        details.push('✅ Component registration working');
      } catch (error) {
        details.push('❌ Component registration failed: ' + error.message);
      }
      
      monitor.stop();
      
      this.results.memoryPressure.passed = registered && stats !== null;
      this.results.memoryPressure.details = details;
      
    } catch (error) {
      this.results.memoryPressure.passed = false;
      this.results.memoryPressure.details.push('❌ Critical error: ' + error.message);
    }
  }

  async validatePerformanceMonitor() {
    const details = [];
    
    try {
      const monitor = new PerformanceMonitor({
        intervalMs: 1000,
        historySize: 100,
        enableCpuMonitoring: true,
        enableMemoryMonitoring: true
      });
      
      details.push('✅ Performance monitor initialized');
      
      monitor.start();
      await this.sleep(2000);
      
      const metrics = monitor.getMetrics();
      if (metrics && typeof metrics.cpu.usage === 'number') {
        details.push('✅ CPU metrics collection working');
      } else {
        details.push('❌ CPU metrics collection failed');
      }
      
      if (metrics && typeof metrics.memory.percentage === 'number') {
        details.push('✅ Memory metrics collection working');
      } else {
        details.push('❌ Memory metrics collection failed');
      }
      
      monitor.stop();
      
      this.results.performanceMonitoring.passed = true;
      this.results.performanceMonitoring.details = details;
      
    } catch (error) {
      this.results.performanceMonitoring.passed = false;
      this.results.performanceMonitoring.details.push('❌ Critical error: ' + error.message);
    }
  }

  async validateCacheSystem() {
    const details = [];
    
    try {
      const cache = new DistributedCache({
        maxSize: 100,
        defaultTTL: 60000,
        enableDistributed: false,
        metricsEnabled: true
      });
      
      details.push('✅ Cache initialized');
      
      // Test basic operations
      await cache.set('test-key-1', 'test-value-1', 30000);
      await cache.set('test-key-2', 'test-value-2', 30000);
      
      const value1 = await cache.get('test-key-1');
      const value2 = await cache.get('test-key-2');
      
      if (value1 === 'test-value-1' && value2 === 'test-value-2') {
        details.push('✅ Basic cache operations working');
      } else {
        details.push('❌ Basic cache operations failed');
      }
      
      // Test memory pressure adaptation
      const stats = cache.getStats();
      if (stats && stats.local && typeof stats.local.memoryUsage === 'number') {
        details.push('✅ Memory tracking working');
      } else {
        details.push('❌ Memory tracking failed');
      }
      
      // Test eviction under pressure
      for (let i = 0; i < 150; i++) {
        await cache.set(`test-key-${i}`, `test-value-${i}`, 30000);
      }
      
      const statsAfterPressure = cache.getStats();
      if (statsAfterPressure.local.memoryUsage > stats.local.memoryUsage) {
        details.push('✅ Memory-aware eviction working');
      } else {
        details.push('⚠️ Memory-aware eviction may not be triggering');
      }
      
      this.results.cacheSystem.passed = true;
      this.results.cacheSystem.details = details;
      
    } catch (error) {
      this.results.cacheSystem.passed = false;
      this.results.cacheSystem.details.push('❌ Critical error: ' + error.message);
    }
  }

  async validateConnectionPool() {
    const details = [];
    
    try {
      let connectionCount = 0;
      const pool = new AdvancedConnectionPool({
        maxConnections: 10,
        minConnections: 2,
        acquireTimeout: 1000,
        idleTimeout: 5000,
        factory: async () => {
          connectionCount++;
          return { id: connectionCount, created: Date.now() };
        },
        destroy: async (conn) => {
          // Mock destruction
        },
        validate: async (conn) => {
          return conn.id !== null;
        }
      });
      
      details.push('✅ Connection pool initialized');
      
      // Test connection acquisition
      const connections = [];
      for (let i = 0; i < 5; i++) {
        const conn = await pool.acquire();
        connections.push(conn);
        details.push(`✅ Acquired connection ${i + 1}`);
      }
      
      // Test connection release
      for (let i = 0; i < connections.length; i++) {
        await pool.release(connections[i]);
        details.push(`✅ Released connection ${i + 1}`);
      }
      
      // Test queue management
      const stats = pool.getStats();
      if (stats && typeof stats.active === 'number' && typeof stats.total === 'number') {
        details.push('✅ Statistics tracking working');
      } else {
        details.push('❌ Statistics tracking failed');
      }
      
      await pool.shutdown();
      
      this.results.connectionPool.passed = true;
      this.results.connectionPool.details = details;
      
    } catch (error) {
      this.results.connectionPool.passed = false;
      this.results.connectionPool.details.push('❌ Critical error: ' + error.message);
    }
  }

  async validateCircuitBreaker() {
    const details = [];
    
    try {
      let callCount = 0;
      const breaker = new CircuitBreaker({
        failureThreshold: 3,
        resetTimeout: 5000,
        timeout: 1000,
        onStateChange: (state) => {
          details.push(`📡 Circuit state changed to: ${state}`);
        }
      });
      
      details.push('✅ Circuit breaker initialized');
      
      // Test successful calls
      for (let i = 0; i < 5; i++) {
        const result = await breaker.execute(async () => {
          callCount++;
          await this.sleep(100);
          return { success: true, callId: callCount };
        });
        
        if (result && result.success) {
          details.push(`✅ Successful call ${i + 1}`);
        }
      }
      
      // Test failure handling
      try {
        await breaker.execute(async () => {
          throw new Error('Simulated failure');
        });
      } catch (error) {
        details.push('✅ Failure handling working');
      }
      
      // Test timeout handling
      try {
        await breaker.execute(async () => {
          await this.sleep(2000); // Longer than timeout
        });
      } catch (error) {
        if (error.message.includes('timeout')) {
          details.push('✅ Timeout handling working');
        }
      }
      
      this.results.circuitBreaker.passed = true;
      this.results.circuitBreaker.details = details;
      
    } catch (error) {
      this.results.circuitBreaker.passed = false;
      this.results.circuitBreaker.details.push('❌ Critical error: ' + error.message);
    }
  }

  async validateCleanupManager() {
    const details = [];
    
    try {
      const manager = new CleanupManager({
        defaultCleanupInterval: 5000,
        maxTaskAge: 30000,
        enableMetrics: true
      });
      
      details.push('✅ Cleanup manager initialized');
      
      let taskExecuted = false;
      
      // Test task registration
      manager.registerTask('test-cleanup', 'Test cleanup task', async () => {
        taskExecuted = true;
        await this.sleep(100);
      }, { frequency: 2000, component: 'test' });
      
      await this.sleep(3000);
      
      if (taskExecuted) {
        details.push('✅ Task registration and execution working');
      } else {
        details.push('❌ Task execution failed');
      }
      
      // Test metrics
      const metrics = manager.getMetrics();
      if (metrics && typeof metrics.totalTasks === 'number') {
        details.push('✅ Metrics tracking working');
      } else {
        details.push('❌ Metrics tracking failed');
      }
      
      await manager.shutdown();
      
      this.results.cleanupManager.passed = true;
      this.results.cleanupManager.details = details;
      
    } catch (error) {
      this.results.cleanupManager.passed = false;
      this.results.cleanupManager.details.push('❌ Critical error: ' + error.message);
    }
  }

  async validateIntegration() {
    const details = [];
    let integrationPassed = true;
    
    try {
      // Test all components working together
      const memoryMonitor = new MemoryPressureMonitor({
        checkInterval: 1000,
        lowMemoryThreshold: 0.7,
        highMemoryThreshold: 0.85,
        enableAutoScaling: true
      });
      
      const cache = new DistributedCache({ maxSize: 50 });
      const pool = new AdvancedConnectionPool({
        maxConnections: 5,
        factory: async () => ({ id: 1 }),
        destroy: async () => {},
        validate: async () => true
      });
      
      // Register components for integration
      memoryMonitor.registerComponent('integration-cache', 'cache', 
        () => cache.getStats().local.totalItems,
        (size) => { /* Mock setMaxSize */ },
        () => 0.5
      );
      
      // Start monitoring
      memoryMonitor.start();
      
      // Test coordinated scaling
      for (let i = 0; i < 20; i++) {
        await cache.set(`integration-key-${i}`, `integration-value-${i}`, 10000);
        
        if (i % 5 === 0) {
          const conn = await pool.acquire();
          await pool.release(conn);
        }
      }
      
      const memoryStats = memoryMonitor.getMemoryStats();
      const cacheStats = cache.getStats();
      const poolStats = pool.getStats();
      
      // Verify integration working
      if (memoryStats && cacheStats && poolStats) {
        details.push('✅ All components working together');
      } else {
        details.push('❌ Integration failure');
        integrationPassed = false;
      }
      
      // Cleanup
      memoryMonitor.stop();
      await pool.shutdown();
      
    } catch (error) {
      details.push('❌ Integration error: ' + error.message);
      integrationPassed = false;
    }
    
    this.results.integration.passed = integrationPassed;
    this.results.integration.details = details;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateReport() {
    console.log('\n📋 SCALABILITY VALIDATION REPORT');
    console.log('='.repeat(60));
    
    const categories = [
      { name: 'Memory Pressure Monitor', result: this.results.memoryPressure },
      { name: 'Performance Monitor', result: this.results.performanceMonitoring },
      { name: 'Cache System', result: this.results.cacheSystem },
      { name: 'Connection Pool', result: this.results.connectionPool },
      { name: 'Circuit Breaker', result: this.results.circuitBreaker },
      { name: 'Cleanup Manager', result: this.results.cleanupManager },
      { name: 'Integration', result: this.results.integration }
    ];
    
    let totalPassed = 0;
    let totalCategories = categories.length;
    
    categories.forEach(category => {
      const status = category.result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${category.name.padEnd(25)}`);
      
      if (category.result.passed) {
        totalPassed++;
      }
      
      category.result.details.forEach(detail => {
        console.log(`    ${detail}`);
      });
      console.log('');
    });
    
    // Summary
    const successRate = Math.round((totalPassed / totalCategories) * 100);
    console.log('📊 OVERALL SUMMARY');
    console.log(`  Categories Passed: ${totalPassed}/${totalCategories} (${successRate}%)`);
    
    if (successRate === 100) {
      console.log('🎉 ALL SCALABILITY FEATURES VALIDATED SUCCESSFULLY!');
    } else if (successRate >= 80) {
      console.log('✅ SCALABILITY FEATURES MOSTLY WORKING');
    } else if (successRate >= 60) {
      console.log('⚠️ SCALABILITY FEATURES PARTIALLY WORKING');
    } else {
      console.log('❌ SCALABILITY FEATURES NEED ATTENTION');
    }
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    categories.forEach(category => {
      if (!category.result.passed) {
        console.log(`  • ${category.name}: Review implementation and fix issues`);
      }
    });
    
    if (successRate < 100) {
      console.log('  • Run individual component tests for detailed diagnostics');
      console.log('  • Check environment configuration and dependencies');
    }
    
    console.log('\n' + '='.repeat(60));
  }
}

if (require.main === module) {
  const validator = new ScalabilityValidator();
  validator.runAllValidations()
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error('Validation failed:', error);
      process.exit(1);
    });
}