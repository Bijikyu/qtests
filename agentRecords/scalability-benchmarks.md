# Scalability Performance Benchmarks

## Overview
Performance benchmarks to validate scalability improvements and establish baseline metrics for production deployment.

## Test Scenarios

### 1. Memory Pressure Testing

#### Low Load Baseline
```javascript
// Expected: < 50MB heap, < 0.5 memory pressure
const baseline = {
  targetMemoryUsage: 50 * 1024 * 1024, // 50MB
  maxMemoryPressure: 0.5,
  expectedCacheHitRate: 0.85,
  expectedResponseTime: 100 // ms
};
```

#### Medium Load Testing
```javascript
// Expected: 50-150MB heap, 0.5-0.7 memory pressure
const mediumLoad = {
  targetMemoryUsage: 150 * 1024 * 1024, // 150MB
  maxMemoryPressure: 0.7,
  expectedCacheHitRate: 0.75,
  expectedResponseTime: 250 // ms
};
```

#### High Load Testing
```javascript
// Expected: 150-300MB heap, 0.7-0.9 memory pressure
const highLoad = {
  targetMemoryUsage: 300 * 1024 * 1024, // 300MB
  maxMemoryPressure: 0.9,
  expectedCacheHitRate: 0.60,
  expectedResponseTime: 500 // ms
};
```

### 2. Connection Pool Stress Testing

#### Concurrency Testing
```javascript
const concurrencyTests = {
  lowConcurrency: {
    maxConnections: 10,
    queueSize: 50,
    expectedAcquireTime: 5 // ms
  },
  mediumConcurrency: {
    maxConnections: 25,
    queueSize: 100,
    expectedAcquireTime: 15 // ms
  },
  highConcurrency: {
    maxConnections: 50,
    queueSize: 200,
    expectedAcquireTime: 50 // ms
  }
};
```

#### Rejection Testing
```javascript
// Test queue overflow behavior
const rejectionScenarios = {
  aggressiveRejection: {
    // 30% of requests rejected under extreme load
    rejectionThreshold: 0.9,
    expectedRejectionRate: 0.3
  },
  moderateRejection: {
    // 15% of requests rejected under high load
    rejectionThreshold: 0.8,
    expectedRejectionRate: 0.15
  }
};
```

### 3. Circuit Breaker Validation

#### Failure Injection Testing
```javascript
const circuitBreakerTests = {
  // Simulate service failures
  failureInjection: {
    failureRate: 0.2, // 20% failure rate
    expectedCircuitOpenTime: 30000, // 30 seconds
    expectedRecoveryTime: 5000 // 5 seconds
  },
  timeoutTesting: {
    timeoutMs: 10000,
    expectedCleanupTime: 100, // ms
    memoryLeakPrevention: true
  }
};
```

## Benchmark Implementation

### Memory Performance Tests
```typescript
import { MemoryPressureMonitor } from '../lib/memoryPressure.js';
import { PerformanceMonitor } from '../lib/performanceMonitor.js';

class ScalabilityBenchmark {
  private memoryMonitor: MemoryPressureMonitor;
  private perfMonitor: PerformanceMonitor;
  private results: BenchmarkResult[] = [];

  constructor() {
    this.memoryMonitor = new MemoryPressureMonitor({
      checkInterval: 1000, // 1 second for granular monitoring
      lowMemoryThreshold: 0.5,
      highMemoryThreshold: 0.8,
      criticalMemoryThreshold: 0.95,
      enableAutoScaling: true,
      enableGarbageCollection: true
    });

    this.perfMonitor = new PerformanceMonitor({
      intervalMs: 1000,
      historySize: 300, // 5 minutes of detailed data
      enableCpuMonitoring: true,
      enableMemoryMonitoring: true
    });
  }

  async runMemoryBenchmarks(): Promise<BenchmarkResult[]> {
    console.log('🧪 Running Memory Benchmarks...');
    
    const scenarios = [
      { name: 'Baseline', targetMemory: 50 * 1024 * 1024 },
      { name: 'Medium Load', targetMemory: 150 * 1024 * 1024 },
      { name: 'High Load', targetMemory: 300 * 1024 * 1024 },
      { name: 'Extreme Load', targetMemory: 500 * 1024 * 1024 }
    ];

    for (const scenario of scenarios) {
      console.log(`  📊 Testing ${scenario.name}...`);
      
      const result = await this.runMemoryScenario(scenario);
      this.results.push(result);
      
      // Allow system to recover
      await this.sleep(2000);
    }

    return this.results;
  }

  private async runMemoryScenario(scenario): Promise<BenchmarkResult> {
    const startTime = Date.now();
    const startMemory = process.memoryUsage();
    
    // Simulate memory load
    const memoryHog = this.createMemoryLoad(scenario.targetMemory);
    
    const peakMemory = process.memoryUsage();
    const memoryPressure = this.memoryMonitor.getMemoryStats();
    
    // Test cleanup performance
    const cleanupStart = Date.now();
    memoryHog = null;
    if (global.gc) global.gc();
    const cleanupTime = Date.now() - cleanupStart;
    
    const endMemory = process.memoryUsage();
    
    return {
      scenario: scenario.name,
      targetMemory: scenario.targetMemory,
      peakMemoryUsed: peakMemory.heapUsed,
      memoryPressure: memoryPressure?.percentage || 0,
      cleanupTime,
      memoryFreed: startMemory.heapUsed - endMemory.heapUsed,
      adaptiveScalingActions: this.memoryMonitor.getScalingHistory(60000),
      totalDuration: Date.now() - startTime
    };
  }

  private createMemoryLoad(targetBytes: number): Uint8Array[] {
    const chunks: Uint8Array[] = [];
    const chunkSize = 1024 * 1024; // 1MB chunks
    const numChunks = Math.floor(targetBytes / chunkSize);
    
    for (let i = 0; i < numChunks; i++) {
      chunks.push(new Uint8Array(chunkSize));
    }
    
    return chunks;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

interface BenchmarkResult {
  scenario: string;
  targetMemory: number;
  peakMemoryUsed: number;
  memoryPressure: number;
  cleanupTime: number;
  memoryFreed: number;
  adaptiveScalingActions: any[];
  totalDuration: number;
}
```

### Database Performance Tests
```typescript
import { ScalableDatabaseClient } from '../lib/scalableDatabase.js';

class DatabaseBenchmark {
  private db: ScalableDatabaseClient;
  
  constructor() {
    this.db = new ScalableDatabaseClient({
      host: 'localhost',
      database: 'benchmark',
      maxConnections: 20,
      minConnections: 2,
      enableQueryCache: true,
      cacheMaxSize: 100
    });
  }

  async runQueryBenchmarks(): Promise<DatabaseBenchmarkResult> {
    console.log('🗄️ Running Database Benchmarks...');
    
    const queries = [
      { type: 'simple', sql: 'SELECT 1', params: [] },
      { type: 'medium', sql: 'SELECT * FROM users WHERE id = ?', params: [1] },
      { type: 'complex', sql: 'SELECT u.*, p.* FROM users u JOIN profiles p ON u.id = p.user_id WHERE u.active = ?', params: [true] },
      { type: 'large', sql: 'SELECT * FROM large_table LIMIT 10000', params: [] }
    ];

    const results: DatabaseBenchmarkResult = {
      totalQueries: 0,
      averageResponseTime: 0,
      cacheHitRate: 0,
      truncatedQueries: 0,
      memoryPressure: 0,
      connectionPoolStats: {} as any
    };

    for (const query of queries) {
      const startTime = Date.now();
      
      try {
        const result = await this.db.query(query.sql, query.params);
        const duration = Date.now() - startTime;
        
        results.totalQueries++;
        results.averageResponseTime = (results.averageResponseTime + duration) / 2;
        
        if (result.cached) {
          results.cacheHitRate = (results.cacheHitRate + 100) / 2;
        } else {
          results.cacheHitRate = results.cacheHitRate / 2;
        }
        
        // Check for truncation
        if (result.rows.length < 10000 && query.type === 'large') {
          results.truncatedQueries++;
        }
        
      } catch (error) {
        console.error(`Query failed: ${query.type}`, error);
      }
    }

    results.connectionPoolStats = this.db.getMetrics();
    results.memoryPressure = this.getMemoryPressure();
    
    return results;
  }

  private getMemoryPressure(): number {
    try {
      const memUsage = process.memoryUsage();
      const totalMem = require('os').totalmem();
      const usedMem = totalMem - require('os').freemem();
      return usedMem / totalMem;
    } catch {
      return 0.5;
    }
  }
}

interface DatabaseBenchmarkResult {
  totalQueries: number;
  averageResponseTime: number;
  cacheHitRate: number;
  truncatedQueries: number;
  memoryPressure: number;
  connectionPoolStats: any;
}
```

## Production Deployment Configuration

### Environment Variables
```bash
# Memory Pressure Configuration
export QTESTS_MEMORY_CHECK_INTERVAL=5000
export QTESTS_MEMORY_LOW_THRESHOLD=0.7
export QTESTS_MEMORY_HIGH_THRESHOLD=0.85
export QTESTS_MEMORY_CRITICAL_THRESHOLD=0.95

# Cache Configuration
export QTESTS_CACHE_MAX_SIZE=1000
export QTESTS_CACHE_DEFAULT_TTL=300000
export QTESTS_CACHE_MEMORY_THRESHOLD=50000000

# Database Configuration
export QTESTS_DB_MAX_CONNECTIONS=20
export QTESTS_DB_MIN_CONNECTIONS=2
export QTESTS_DB_QUERY_TIMEOUT=5000
export QTESTS_DB_MAX_RESULT_ROWS=10000

# Connection Pool Configuration
export QTESTS_POOL_MAX_WAITING_QUEUE=1000
export QTESTS_POOL_ACQUIRE_TIMEOUT=3000
export QTESTS_POOL_IDLE_TIMEOUT=15000

# Circuit Breaker Configuration
export QTESTS_CIRCUIT_FAILURE_THRESHOLD=5
export QTESTS_CIRCUIT_RESET_TIMEOUT=30000
export QTESTS_CIRCUIT_TIMEOUT=10000
```

### Docker Configuration
```dockerfile
# Dockerfile with scalability optimizations
FROM node:18-alpine

# Set environment variables for scalability
ENV QTESTS_MEMORY_CHECK_INTERVAL=5000
ENV QTESTS_MEMORY_LOW_THRESHOLD=0.7
ENV QTESTS_MEMORY_HIGH_THRESHOLD=0.85
ENV QTESTS_MEMORY_CRITICAL_THRESHOLD=0.95

ENV NODE_OPTIONS=--max-old-space-size=1024

# Install with memory-efficient settings
RUN npm ci --only=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

EXPOSE 3000

CMD ["node", "--max-old-space-size=1024", "index.js"]
```

### Kubernetes Deployment
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qtests-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: qtests-api
  template:
    metadata:
      labels:
        app: qtests-api
    spec:
      containers:
      - name: qtests
        image: qtests:latest
        ports:
        - containerPort: 3000
        env:
        - name: QTESTS_MEMORY_HIGH_THRESHOLD
          value: "0.85"
        - name: QTESTS_MEMORY_CRITICAL_THRESHOLD
          value: "0.95"
        - name: NODE_OPTIONS
          value: "--max-old-space-size=1024"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: qtests-service
spec:
  selector:
    app: qtests-api
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

## Monitoring and Alerting

### Prometheus Metrics
```typescript
// metrics.ts - Custom metrics for scalability monitoring
import { register, Counter, Histogram, Gauge } from 'prom-client';

export const scalabilityMetrics = {
  // Memory metrics
  memoryPressure: new Gauge({
    name: 'qtests_memory_pressure_ratio',
    help: 'Current memory pressure (0-1)'
  }),
  
  cacheEvictions: new Counter({
    name: 'qtests_cache_evictions_total',
    help: 'Total number of cache evictions'
  }),
  
  adaptiveScalingActions: new Counter({
    name: 'qtests_adaptive_scaling_actions_total',
    help: 'Total adaptive scaling actions by type',
    labelNames: ['action_type', 'component']
  }),

  // Database metrics
  queryTruncations: new Counter({
    name: 'qtests_query_truncations_total',
    help: 'Total number of query truncations'
  }),
  
  connectionPoolUtilization: new Gauge({
    name: 'qtests_connection_pool_utilization_ratio',
    help: 'Connection pool utilization (0-1)'
  }),

  // Circuit breaker metrics
  circuitBreakerState: new Gauge({
    name: 'qtests_circuit_breaker_state',
    help: 'Circuit breaker state (0=closed, 1=open, 2=half-open)',
    labelNames: ['circuit_name']
  }),

  // Performance metrics
  responseTime: new Histogram({
    name: 'qtests_response_time_seconds',
    help: 'Response time in seconds',
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10]
  }),

  throughput: new Counter({
    name: 'qtests_throughput_total',
    help: 'Total requests processed'
  })
};

// Register metrics
register.registerMetric(scalabilityMetrics);
```

### Grafana Dashboard Configuration
```json
{
  "dashboard": {
    "title": "qtests Scalability Monitoring",
    "tags": ["qtests", "scalability"],
    "timezone": "browser",
    "panels": [
      {
        "title": "Memory Pressure",
        "type": "stat",
        "targets": [
          {
            "expr": "qtests_memory_pressure_ratio",
            "legendFormat": "{{__name__}}"
          }
        ]
      },
      {
        "title": "Cache Evictions",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(qtests_cache_evictions_total[5m])",
            "legendFormat": "{{__name__}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(qtests_response_time_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.50, rate(qtests_response_time_seconds_bucket[5m]))",
            "legendFormat": "50th percentile"
          }
        ]
      },
      {
        "title": "Connection Pool Utilization",
        "type": "gauge",
        "targets": [
          {
            "expr": "qtests_connection_pool_utilization_ratio",
            "legendFormat": "{{__name__}}"
          }
        ]
      }
    ]
  }
}
```

## Automated Testing Pipeline

### GitHub Actions
```yaml
# .github/workflows/scalability-tests.yml
name: Scalability Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  scalability-tests:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16, 18, 20]
        
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run memory benchmarks
      run: npm run test:scalability:memory
      
    - name: Run database benchmarks
      run: npm run test:scalability:database
      
    - name: Run connection pool tests
      run: npm run test:scalability:pool
      
    - name: Run circuit breaker tests
      run: npm run test:scalability:circuit
      
    - name: Generate scalability report
      run: npm run test:scalability:report
      
    - name: Upload results
      uses: actions/upload-artifact@v3
      with:
        name: scalability-results-${{ matrix.node-version }}
        path: scalability-report.json
```

### NPM Scripts
```json
{
  "scripts": {
    "test:scalability": "node scripts/run-scalability-benchmarks.js",
    "test:scalability:memory": "node scripts/benchmarks/memory-benchmark.js",
    "test:scalability:database": "node scripts/benchmarks/database-benchmark.js",
    "test:scalability:pool": "node scripts/benchmarks/connection-pool-benchmark.js",
    "test:scalability:circuit": "node scripts/benchmarks/circuit-breaker-benchmark.js",
    "test:scalability:report": "node scripts/benchmarks/generate-report.js",
    "monitor:scalability": "node scripts/monitoring/scalability-monitor.js"
  }
}
```

## Success Criteria

### Performance Targets
- **Memory Usage**: < 70% of available memory under normal load
- **Response Time**: P95 < 500ms under 80% load
- **Cache Hit Rate**: > 75% under normal load
- **Connection Pool**: < 5ms average acquire time
- **Circuit Breaker**: < 30s recovery time
- **Scaling Actions**: < 10 per minute under stable load

### Reliability Targets
- **Memory Leaks**: Zero memory leaks over 24h period
- **Resource Cleanup**: All background tasks cleaned up properly
- **Error Recovery**: Automatic recovery from transient failures
- **Graceful Degradation**: Fallback mechanisms active under stress

### Monitoring Targets
- **Alert Coverage**: All critical metrics monitored
- **Dashboard Latency**: < 5s dashboard update time
- **Metrics Retention**: 30 days of detailed metrics
- **Health Checks**: All components report healthy status

This comprehensive benchmark suite ensures that all scalability improvements work correctly in production environments with proper monitoring and alerting.