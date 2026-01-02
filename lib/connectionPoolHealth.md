# Connection Pool Health Monitoring

This directory contains health monitoring functionality for connection pools in the qtests library.

## Overview

The `connectionPoolHealth.ts` module provides comprehensive health monitoring capabilities for `AdvancedConnectionPool` instances. It includes periodic validation, automatic replacement of stale connections, and detailed health event reporting.

## Features

- **Periodic Health Checks**: Configurable interval-based validation of all connections (default: 30 seconds)
- **Automatic Connection Replacement**: Replaces unhealthy connections after configurable failure thresholds
- **Concurrent Validation**: Validates connections in parallel with configurable concurrency limits
- **Event-Driven Architecture**: Emits detailed health events for monitoring and alerting
- **Memory Monitoring**: Tracks memory usage and includes it in health reports
- **Flexible Configuration**: Extensive configuration options for different use cases

## Core Classes

### ConnectionPoolHealthMonitor

The main class that wraps an existing `AdvancedConnectionPool` instance and adds health monitoring capabilities.

#### Constructor

```typescript
new ConnectionPoolHealthMonitor(pool: AdvancedConnectionPool, config?: HealthMonitoringConfig)
```

#### Key Methods

- `startHealthMonitoring()`: Begin periodic health checks
- `stopHealthMonitoring()`: Stop periodic health checks
- `performHealthCheck()`: Execute an immediate health check
- `getLastHealthStatus()`: Get results of the most recent health check
- `shutdown(shutdownPool?: boolean)`: Clean shutdown with optional pool shutdown

## Configuration Options

```typescript
interface HealthMonitoringConfig {
  healthCheckInterval?: number;        // How often to run health checks (default: 30 seconds)
  validationTimeout?: number;          // Timeout for individual validation (default: 5 seconds)
  maxConcurrentValidations?: number;  // Max concurrent validation operations (default: 5)
  unhealthyConnectionThreshold?: number; // Max consecutive failures before marking unhealthy (default: 3)
  enableDetailedLogging?: boolean;      // Enable detailed health logging (default: false)
}
```

## Health Events

The health monitor emits the following events:

- `health-monitoring-started`: When monitoring begins
- `health-check-completed`: When a health check finishes
- `connection-unhealthy`: When a connection is detected as unhealthy
- `connection-replaced`: When an unhealthy connection is replaced
- `health-monitoring-error`: When an error occurs in monitoring
- `health-monitoring-stopped`: When monitoring stops

## Health Status

Each health check produces a `HealthStatus` object:

```typescript
interface HealthStatus {
  timestamp: Date;                    // When the check was performed
  totalConnections: number;           // Total connections in pool
  healthyConnections: number;         // Connections that passed validation
  unhealthyConnections: number;       // Connections that failed validation
  validatedConnections: number;        // Total connections validated
  replacedConnections: number;         // Connections replaced during check
  validationErrors: string[];         // Array of validation error messages
  averageResponseTime: number;         // Average time for validation operations
  memoryUsage: NodeJS.MemoryUsage;    // Current memory usage statistics
}
```

## Usage Examples

### Adding Health Monitoring to Existing Pool

```typescript
import { AdvancedConnectionPool } from './lib/connectionPool';
import { addHealthMonitoring } from './lib/connectionPoolHealth';

// Create a connection pool
const pool = new AdvancedConnectionPool({
  host: 'localhost',
  maxConnections: 10,
  factory: async () => ({ /* connection object */ }),
  destroy: async (conn) => { /* cleanup */ },
  validate: async (conn) => { /* validation logic */ }
});

// Add health monitoring
const monitor = addHealthMonitoring(pool, {
  healthCheckInterval: 30000, // 30 seconds
  unhealthyConnectionThreshold: 3,
  enableDetailedLogging: true
});

// Listen to health events
monitor.on('health-check-completed', (status) => {
  console.log('Health check results:', status);
});

// Use the pool normally
const connection = await pool.acquire();
// ... use connection
await pool.release(connection);
```

### Creating Pool with Built-in Health Monitoring

```typescript
import { createHealthMonitoredPool } from './lib/connectionPoolHealth';

const { pool, monitor } = createHealthMonitoredPool({
  host: 'localhost',
  maxConnections: 5,
  factory: async () => ({ /* connection */ }),
  destroy: async (conn) => { /* cleanup */ },
  validate: async (conn) => { /* validation */ }
}, {
  healthCheckInterval: 15000, // 15 seconds
  maxConcurrentValidations: 3
});

// Both pool and monitor are ready to use
```

### Advanced Event Handling

```typescript
monitor.on('connection-unhealthy', async (data) => {
  // Log to monitoring system
  await alertingService.sendAlert({
    level: 'warning',
    message: `Connection unhealthy: ${data.error}`,
    connectionId: data.connection.id,
    timestamp: data.timestamp
  });
});

monitor.on('connection-replaced', (data) => {
  console.log(`Replaced connection ${data.oldConnection.id} with ${data.newConnection.id}`);
});
```

## Integration with Monitoring Systems

The health monitoring system is designed to integrate well with external monitoring and alerting systems:

### Prometheus Metrics

```typescript
const prometheus = require('prom-client');

const healthGauge = new prometheus.Gauge({
  name: 'connection_pool_healthy_connections',
  help: 'Number of healthy connections in pool'
});

monitor.on('health-check-completed', (status) => {
  healthGauge.set(status.healthyConnections);
});
});
```

### Logging

```typescript
const winston = require('winston');

monitor.on('health-check-completed', (status) => {
  winston.info('Connection pool health check', {
    healthy: status.healthyConnections,
    unhealthy: status.unhealthyConnections,
    replaced: status.replacedConnections,
    duration: status.averageResponseTime
  });
});
```

## Performance Considerations

1. **Validation Frequency**: Balance between early detection and resource usage
2. **Concurrent Validations**: Limit concurrent validations to prevent overwhelming the database
3. **Timeout Settings**: Set appropriate timeouts based on your database response times
4. **Memory Usage**: The health monitor tracks memory usage but has minimal overhead

## Best Practices

1. **Start Early**: Enable health monitoring from the start of your application
2. **Monitor Events**: Set up proper event handling for health events
3. **Configure Appropriately**: Adjust intervals and thresholds based on your SLA requirements
4. **Handle Graceful Shutdown**: Always call `shutdown()` before application exit
5. **Integrate with Monitoring**: Connect health events to your monitoring and alerting systems

## Troubleshooting

### Common Issues

1. **High Memory Usage**: Reduce `maxConcurrentValidations` or increase `healthCheckInterval`
2. **Frequent Replacements**: Check `validate` function logic or increase `unhealthyConnectionThreshold`
3. **Timeout Errors**: Increase `validationTimeout` based on database performance
4. **Event Spam**: Set `enableDetailedLogging` to false in production

### Debug Mode

Enable detailed logging to troubleshoot issues:

```typescript
const monitor = addHealthMonitoring(pool, {
  enableDetailedLogging: true
});
```

## Files

- `connectionPoolHealth.ts`: Main health monitoring implementation
- `connectionPoolHealthDemo.ts`: Comprehensive usage examples
- `connectionPoolHealth.test.ts`: Test suite (if available)

## Dependencies

- Requires `AdvancedConnectionPool` from `connectionPool.ts`
- Uses Node.js EventEmitter for event handling
- No external dependencies beyond the core qtests library