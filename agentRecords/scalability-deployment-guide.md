# Scalability Deployment Guide

## Overview
This guide provides production deployment instructions for the qtests scalability improvements, ensuring optimal performance and reliability under varying load conditions.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm/yarn package manager
- Redis (optional, for distributed features)
- Monitoring tools (Prometheus/Grafana recommended)

### Environment Setup

#### 1. Memory Configuration
```bash
# Core memory pressure thresholds
export QTESTS_MEMORY_LOW_THRESHOLD=0.7
export QTESTS_MEMORY_HIGH_THRESHOLD=0.85
export QTESTS_MEMORY_CRITICAL_THRESHOLD=0.95
export QTESTS_MEMORY_CHECK_INTERVAL=5000

# Memory cleanup settings
export QTESTS_ENABLE_AUTO_GC=true
export QTESTS_GC_TRIGGER_THRESHOLD=0.8
```

#### 2. Cache Configuration
```bash
# Cache sizing and cleanup
export QTESTS_CACHE_MAX_SIZE=1000
export QTESTS_CACHE_DEFAULT_TTL=300000
export QTESTS_CACHE_MEMORY_THRESHOLD=50000000
export QTESTS_CACHE_EVICT_BATCH_SIZE=100
```

#### 3. Database Configuration
```bash
# Connection pooling
export QTESTS_DB_MAX_CONNECTIONS=20
export QTESTS_DB_MIN_CONNECTIONS=2
export QTESTS_DB_QUERY_TIMEOUT=5000
export QTESTS_DB_ACQUIRE_TIMEOUT=3000

# Query optimization
export QTESTS_DB_MAX_RESULT_ROWS=10000
export QTESTS_DB_ENABLE_QUERY_CACHE=true
```

#### 4. Circuit Breaker Configuration
```bash
# Fault tolerance
export QTESTS_CIRCUIT_FAILURE_THRESHOLD=5
export QTESTS_CIRCUIT_RESET_TIMEOUT=30000
export QTESTS_CIRCUIT_HALF_OPEN_MAX_CALLS=3
export QTESTS_CIRCUIT_TIMEOUT=10000
```

## 🏗️ Production Deployment

### 1. Application Configuration

#### Core Settings
```javascript
// config/production.ts
export const productionConfig = {
  // Memory pressure monitoring
  memoryMonitor: {
    checkInterval: 5000,
    lowMemoryThreshold: 0.7,
    highMemoryThreshold: 0.85,
    criticalMemoryThreshold: 0.95,
    enableAutoScaling: true,
    enableGarbageCollection: true,
    scalingFactor: 0.6
  },

  // Cache configuration
  cache: {
    maxSize: 1000,
    defaultTTL: 300000, // 5 minutes
    enableMetrics: true,
    enableCompression: false,
    serializationFormat: 'json'
  },

  // Database optimization
  database: {
    maxConnections: 20,
    minConnections: 2,
    acquireTimeout: 3000,
    idleTimeout: 15000,
    enableConnectionPool: true,
    maxResultRows: 10000,
    enableQueryCache: true
  },

  // Circuit breaker settings
  circuitBreaker: {
    failureThreshold: 5,
    resetTimeout: 30000,
    monitoringPeriod: 300000,
    timeout: 10000,
    halfOpenMaxCalls: 3
  },

  // Cleanup management
  cleanup: {
    defaultInterval: 60000, // 1 minute
    maxTaskAge: 300000, // 5 minutes
    enableMetrics: true,
    healthCheckInterval: 30000 // 30 seconds
  }
};
```

#### Scalability Initialization
```javascript
// index.ts - Production initialization
import { 
  globalMemoryPressureMonitor, 
  globalCleanupManager,
  globalPerformanceMonitor,
  DistributedCache,
  AdvancedConnectionPool
} from './lib';

// Initialize scalability components
export function initializeScalability(config: typeof productionConfig) {
  // Start memory pressure monitoring
  globalMemoryPressureMonitor.start();
  globalMemoryPressureMonitor.registerComponent(
    'main-cache',
    'cache',
    () => mainCache.getCurrentSize(),
    (size) => mainCache.setMaxSize(size),
    () => mainCache.getCurrentLoad()
  );

  // Register cleanup tasks
  globalCleanupManager.registerTask(
    'cache-cleanup',
    'Cache cleanup',
    () => mainCache.cleanup(),
    { frequency: config.cleanup.defaultInterval, component: 'cache' }
  );

  globalCleanupManager.registerTask(
    'connection-pool-cleanup',
    'Connection pool cleanup',
    () => connectionPool.cleanup(),
    { frequency: config.cleanup.defaultInterval, component: 'connection_pool' }
  );

  // Start performance monitoring
  globalPerformanceMonitor.start();

  console.log('🚀 Scalability components initialized');
}
```

### 2. Docker Deployment

#### Optimized Dockerfile
```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install only production dependencies
WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Production environment variables
ENV NODE_ENV=production
ENV QTESTS_MEMORY_HIGH_THRESHOLD=0.85
ENV QTESTS_MEMORY_CRITICAL_THRESHOLD=0.95
ENV QTESTS_MEMORY_CHECK_INTERVAL=5000
ENV QTESTS_CACHE_MAX_SIZE=1000
ENV QTESTS_DB_MAX_CONNECTIONS=20
ENV QTESTS_CIRCUIT_FAILURE_THRESHOLD=5

# Memory optimization
ENV NODE_OPTIONS=--max-old-space-size=1024

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "
    const http = require('http');
    http.get('http://localhost:3000/health', (res) => {
      process.exit(res.statusCode === 200 ? 0 : 1);
    });
  "

# Security: Run as non-root user
USER node

# Expose port
EXPOSE 3000

# Optimized CMD
CMD ["node", "--max-old-space-size=1024", "dist/index.js"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  qtests-api:
    build: .
    ports:
      - "3000:3000"
    environment:
      # Memory settings
      - QTESTS_MEMORY_HIGH_THRESHOLD=0.85
      - QTESTS_MEMORY_CRITICAL_THRESHOLD=0.95
      - QTESTS_MEMORY_CHECK_INTERVAL=5000
      # Cache settings
      - QTESTS_CACHE_MAX_SIZE=1000
      - QTESTS_CACHE_DEFAULT_TTL=300000
      # Database settings
      - QTESTS_DB_MAX_CONNECTIONS=20
      - QTESTS_DB_MIN_CONNECTIONS=2
      # Circuit breaker settings
      - QTESTS_CIRCUIT_FAILURE_THRESHOLD=5
      - QTESTS_CIRCUIT_RESET_TIMEOUT=30000
      # Performance
      - NODE_OPTIONS=--max-old-space-size=1024
    volumes:
      # Logs
      - ./logs:/app/logs
      # Metrics
      - ./metrics:/app/metrics
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'

  # Redis for distributed features (optional)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.25'
```

### 3. Kubernetes Deployment

#### Production Deployment Manifest
```yaml
# k8s-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qtests-api
  labels:
    app: qtests-api
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
          # Memory pressure thresholds
          - name: QTESTS_MEMORY_LOW_THRESHOLD
            value: "0.7"
          - name: QTESTS_MEMORY_HIGH_THRESHOLD
            value: "0.85"
          - name: QTESTS_MEMORY_CRITICAL_THRESHOLD
            value: "0.95"
          - name: QTESTS_MEMORY_CHECK_INTERVAL
            value: "5000"
          # Cache settings
          - name: QTESTS_CACHE_MAX_SIZE
            value: "1000"
          - name: QTESTS_CACHE_DEFAULT_TTL
            value: "300000"
          # Database optimization
          - name: QTESTS_DB_MAX_CONNECTIONS
            value: "20"
          - name: QTESTS_DB_MIN_CONNECTIONS
            value: "2"
          # Circuit breaker
          - name: QTESTS_CIRCUIT_FAILURE_THRESHOLD
            value: "5"
          # Node.js optimization
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
          timeoutSeconds: 3
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 2
          successThreshold: 1
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
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: qtests-config
data:
  # Memory monitoring config
  memory-low-threshold: "0.7"
  memory-high-threshold: "0.85"
  memory-critical-threshold: "0.95"
  # Cache config
  cache-max-size: "1000"
  cache-default-ttl: "300000"
  # Database config
  db-max-connections: "20"
  db-min-connections: "2"
```

#### Horizontal Pod Autoscaler
```yaml
# k8s-hpa.yml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: qtests-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: qtests-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 75
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 50
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 25
```

## 📊 Monitoring and Observability

### Prometheus Metrics Export
```javascript
// metrics/exporter.js
const client = require('prom-client');
const register = new client.Registry();

// Memory pressure metrics
const memoryPressureGauge = new client.Gauge({
  name: 'qtests_memory_pressure_ratio',
  help: 'Current memory pressure (0-1)',
  registers: [register]
});

const adaptiveScalingCounter = new client.Counter({
  name: 'qtests_adaptive_scaling_actions_total',
  help: 'Total adaptive scaling actions',
  labelNames: ['action_type', 'component'],
  registers: [register]
});

// Cache performance metrics
const cacheHitRateGauge = new client.Gauge({
  name: 'qtests_cache_hit_rate_ratio',
  help: 'Cache hit rate (0-1)',
  registers: [register]
});

const cacheEvictionsCounter = new client.Counter({
  name: 'qtests_cache_evictions_total',
  help: 'Total cache evictions',
  registers: [register]
});

// Database connection metrics
const connectionPoolUtilizationGauge = new client.Gauge({
  name: 'qtests_connection_pool_utilization_ratio',
  help: 'Connection pool utilization (0-1)',
  registers: [register]
});

// Circuit breaker metrics
const circuitBreakerStateGauge = new client.Gauge({
  name: 'qtests_circuit_breaker_state',
  help: 'Circuit breaker state (0=closed, 1=open, 2=half-open)',
  labelNames: ['circuit_name'],
  registers: [register]
});

// Performance metrics
const responseTimeHistogram = new client.Histogram({
  name: 'qtests_response_time_seconds',
  help: 'Response time in seconds',
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
  registers: [register]
});

module.exports = {
  register,
  memoryPressureGauge,
  adaptiveScalingCounter,
  cacheHitRateGauge,
  cacheEvictionsCounter,
  connectionPoolUtilizationGauge,
  circuitBreakerStateGauge,
  responseTimeHistogram
};
```

### Grafana Dashboard Configuration
```json
{
  "dashboard": {
    "id": null,
    "title": "qtests Scalability Dashboard",
    "tags": ["qtests", "scalability"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Memory Pressure",
        "type": "stat",
        "targets": [
          {
            "expr": "qtests_memory_pressure_ratio",
            "legendFormat": "{{__name__}}"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "min": 0,
            "max": 1
          },
          "mappings": [
            {
              "options": {
                "0": {
                  "color": "green",
                  "index": 0,
                  "text": "Normal"
                },
                "0.7": {
                  "color": "yellow",
                  "index": 1,
                  "text": "Low Pressure"
                },
                "0.85": {
                  "color": "red",
                  "index": 2,
                  "text": "High Pressure"
                },
                "0.95": {
                  "color": "dark-red",
                  "index": 3,
                  "text": "Critical"
                }
              },
              "type": "value"
            }
          ]
        }
      },
      {
        "id": 2,
        "title": "Cache Performance",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(qtests_cache_evictions_total[5m])",
            "legendFormat": "Evictions/s"
          },
          {
            "expr": "qtests_cache_hit_rate_ratio",
            "legendFormat": "Hit Rate"
          }
        ]
      },
      {
        "id": 3,
        "title": "Connection Pool",
        "type": "graph",
        "targets": [
          {
            "expr": "qtests_connection_pool_utilization_ratio",
            "legendFormat": "Utilization"
          }
        ]
      },
      {
        "id": 4,
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
        "id": 5,
        "title": "Adaptive Scaling",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(qtests_adaptive_scaling_actions_total[5m])",
            "legendFormat": "Actions/min"
          }
        ]
      }
    ]
  }
}
```

## 🔧 Performance Optimization

### Node.js Runtime Optimization

#### Production Node.js Flags
```bash
# Optimized Node.js startup
NODE_OPTIONS="--max-old-space-size=1024 --optimize-for-size --expose-gc --gc-global" node dist/index.js

# Additional flags for high-load environments
NODE_OPTIONS="--max-old-space-size=1536 --max-semi-space-size=512 --optimize-for-size --no-lazy --trace-warnings" node dist/index.js
```

#### Process Manager Configuration
```bash
# PM2 configuration
{
  "name": "qtests",
  "script": "dist/index.js",
  "instances": "max",
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "production",
    "QTESTS_MEMORY_HIGH_THRESHOLD": "0.85",
    "QTESTS_MEMORY_CRITICAL_THRESHOLD": "0.95",
    "QTESTS_MEMORY_CHECK_INTERVAL": "3000"
  },
  "max_memory_restart": "512M",
  "node_args": [
    "--max-old-space-size=1024",
    "--optimize-for-size"
  ],
  "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
  "error_file": "./logs/err.log",
  "out_file": "./logs/out.log",
  "log_file": "./logs/combined.log",
  "merge_logs": true
}
```

### Load Balancer Configuration

#### Nginx Configuration
```nginx
# nginx.conf
upstream qtests_backend {
    least_conn;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    listen 80;
    server_name your-domain.com;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=10m rate=10r/s;

    location / {
        # Health checks
        location /health {
            proxy_pass http://qtests_backend/health;
            access_log off;
        }

        # API routes
        proxy_pass http://qtests_backend;
        
        # Headers for proper load balancing
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout settings
        proxy_connect_timeout 5s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        
        # Rate limiting
        limit_req zone=one burst=20 nodelay;
        limit_req_status 429;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}
```

## 🔒 Security Considerations

### Input Validation
```javascript
// Input validation with scalability considerations
import { z } from 'zod';

const scalabilityConfigSchema = z.object({
  memoryHighThreshold: z.number().min(0.5).max(0.9),
  memoryCriticalThreshold: z.number().min(0.9).max(0.99),
  cacheMaxSize: z.number().min(100).max(10000),
  maxConnections: z.number().min(5).max(100),
  maxResultRows: z.number().min(100).max(100000)
});

// Validate configuration before startup
function validateConfig(config) {
  try {
    const result = scalabilityConfigSchema.parse(config);
    console.log('✅ Scalability configuration validated');
    return result;
  } catch (error) {
    console.error('❌ Invalid scalability configuration:', error);
    process.exit(1);
  }
}
```

### Resource Isolation
```javascript
// Resource isolation to prevent interference
const isolationConfig = {
  // Memory isolation per request
  maxRequestMemory: 50 * 1024 * 1024, // 50MB per request
  
  // CPU time limits
  maxRequestCpuTime: 5000, // 5 seconds
  
  // Connection limits
  maxConcurrentRequests: 100,
  requestTimeout: 30000, // 30 seconds
  
  // Queue isolation
  maxQueueSize: 1000,
  queueTimeout: 60000 // 1 minute
};
```

## 📋 Operational Procedures

### Health Checks
```javascript
// health/check.js
const http = require('http');

function performHealthCheck() {
  const checks = {
    memory: checkMemoryHealth(),
    cache: checkCacheHealth(),
    database: checkDatabaseHealth(),
    circuitBreaker: checkCircuitBreakerHealth()
  };

  const overallHealth = Object.values(checks).every(result => result.healthy);
  
  return {
    status: overallHealth ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks
  };
}

function checkMemoryHealth() {
  const memUsage = process.memoryUsage();
  const totalMem = require('os').totalmem();
  const usedMem = totalMem - require('os').freemem();
  const memoryPressure = usedMem / totalMem;
  
  return {
    healthy: memoryPressure < 0.85,
    memoryPressure,
    heapUsed: memUsage.heapUsed,
    heapTotal: memUsage.heapTotal
  };
}

module.exports = { performHealthCheck };
```

### Scaling Actions
```javascript
// scaling/actions.js
const { globalMemoryPressureMonitor } = require('../lib/memoryPressure');

const scalingActions = {
  // Emergency scaling actions
  EMERGENCY_CACHE_REDUCTION: {
    threshold: 0.95,
    action: 'reduce_cache_size',
    severity: 'critical'
  },
  
  // Performance optimization actions
  PERFORMANCE_TUNING: {
    threshold: 0.8,
    action: 'optimize_cache_settings',
    severity: 'warning'
  },
  
  // Resource management actions
  RESOURCE_CLEANUP: {
    threshold: 0.9,
    action: 'force_garbage_collection',
    severity: 'high'
  }
};

function executeScalingAction(action, metrics) {
  switch (action) {
    case 'reduce_cache_size':
      console.log('🔧 Reducing cache sizes due to memory pressure');
      globalMemoryPressureMonitor.emit('scaling:cache-reduction', { metrics });
      break;
      
    case 'optimize_cache_settings':
      console.log('⚡ Optimizing cache settings for performance');
      break;
      
    case 'force_garbage_collection':
      console.log('🗑️ Forcing garbage collection');
      if (global.gc) {
        global.gc();
      }
      break;
  }
}

module.exports = { scalingActions, executeScalingAction };
```

## 🚨 Alerting Configuration

### Alert Thresholds
```yaml
# alerts/rules.yml
groups:
- name: qtests-scalability-alerts
  rules:
  - alert: HighMemoryUsage
    expr: qtests_memory_pressure_ratio > 0.85
    for: 2m
    labels:
      severity: warning
      component: memory
    annotations:
      summary: "High memory usage detected"
      description: "Memory pressure > 85% for 2 minutes"
      
  - alert: CriticalMemoryUsage
    expr: qtests_memory_pressure_ratio > 0.95
    for: 1m
    labels:
      severity: critical
      component: memory
    annotations:
      summary: "Critical memory usage"
      description: "Memory pressure > 95% for 1 minute"
      
  - alert: HighCacheEvictions
    expr: rate(qtests_cache_evictions_total[5m]) > 10
    for: 3m
    labels:
      severity: warning
      component: cache
    annotations:
      summary: "High cache eviction rate"
      description: "Cache evictions > 10 per second for 3 minutes"
      
  - alert: CircuitBreakerOpen
    expr: qtests_circuit_breaker_state == 1
    for: 1m
    labels:
      severity: critical
      component: circuit_breaker
    annotations:
      summary: "Circuit breaker is open"
      description: "Circuit breaker has opened, blocking requests"
```

## 📈 Capacity Planning

### Resource Requirements
| Component | Minimum | Recommended | Maximum |
|-----------|---------|-------------|---------|
| Memory | 256MB | 512MB | 2GB |
| CPU | 0.25 cores | 0.5 cores | 2 cores |
| Connections | 10 | 20 | 100 |
| Cache | 100 items | 1000 items | 10000 items |

### Scaling Metrics
| Metric | Target | Acceptable Range |
|--------|--------|-----------------|
| Memory Pressure | < 0.7 | 0.5 - 0.85 |
| Cache Hit Rate | > 80% | 70% - 95% |
| Response Time | < 200ms | 100ms - 500ms |
| Error Rate | < 1% | 0.1% - 5% |
| Queue Utilization | < 70% | 50% - 85% |

## 🔧 Troubleshooting Guide

### Common Issues

#### Memory Pressure High
```
Symptoms:
- Slow response times
- Frequent cache evictions
- Out-of-memory errors

Solutions:
1. Check memory pressure thresholds
2. Reduce cache sizes
3. Enable garbage collection
4. Scale horizontally
```

#### Cache Performance Issues
```
Symptoms:
- Low hit rates
- High eviction rates
- Increased latency

Solutions:
1. Check TTL settings
2. Validate cache key patterns
3. Monitor memory usage
4. Adjust cache sizing
```

#### Connection Pool Exhaustion
```
Symptoms:
- Request timeouts
- Queue overflow
- Connection errors

Solutions:
1. Increase max connections
2. Reduce acquire timeout
3. Implement retry logic
4. Add circuit breaker
```

### Diagnostic Commands
```bash
# Memory diagnostics
node -e "
const memUsage = process.memoryUsage();
console.log('Memory Usage:', {
  heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
  heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
  external: Math.round(memUsage.external / 1024 / 1024) + 'MB'
});
"

# Cache diagnostics
node -e "
const cache = require('./lib/cache');
const stats = cache.getStats();
console.log('Cache Stats:', stats);
"

# Connection pool diagnostics
node -e "
const pool = require('./lib/connectionPool');
const stats = pool.getStats();
console.log('Connection Pool Stats:', stats);
"
```

This deployment guide ensures optimal scalability and reliability for qtests in production environments with comprehensive monitoring, alerting, and operational procedures.