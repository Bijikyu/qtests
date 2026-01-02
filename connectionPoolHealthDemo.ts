/**
 * Demo of Connection Pool Health Monitoring Usage
 * 
 * This file demonstrates how to use the connection pool health monitoring
 * functionality that was implemented in connectionPoolHealth.ts
 */

import { AdvancedConnectionPool } from './lib/connectionPool';
import { addHealthMonitoring, createHealthMonitoredPool } from './lib/connectionPoolHealth';

// Example 1: Add health monitoring to an existing pool
async function demoHealthMonitoringExistingPool() {
  console.log('=== Demo 1: Adding health monitoring to existing pool ===');
  
  // Create a basic connection pool
  const pool = new AdvancedConnectionPool({
    host: 'localhost',
    port: 5432,
    maxConnections: 10,
    minConnections: 2,
    acquireTimeout: 3000,
    idleTimeout: 15000,
    factory: async () => {
      // Simulate creating a database connection
      return {
        id: Math.random().toString(36),
        connected: true,
        createdAt: new Date(),
        query: async (sql: string) => {
          // Mock query execution
          console.log(`Executing query: ${sql}`);
          return { rows: [] };
        }
      };
    },
    destroy: async (connection) => {
      // Simulate closing connection
      console.log(`Closing connection: ${connection.id}`);
    },
    validate: async (connection) => {
      // Validate connection is still alive
      return connection.connected;
    }
  });

  // Add health monitoring with custom configuration
  const healthMonitor = addHealthMonitoring(pool, {
    healthCheckInterval: 30000, // Check every 30 seconds
    validationTimeout: 5000, // Connection validation timeout
    maxConcurrentValidations: 5, // Max parallel validations
    unhealthyConnectionThreshold: 3, // Mark unhealthy after 3 failures
    enableDetailedLogging: true // Enable verbose logging
  });

  // Listen to health events
  healthMonitor.on('health-monitoring-started', (data) => {
    console.log('Health monitoring started:', data);
  });

  healthMonitor.on('health-check-completed', (status) => {
    console.log('Health check completed:', {
      timestamp: status.timestamp,
      totalConnections: status.totalConnections,
      healthyConnections: status.healthyConnections,
      unhealthyConnections: status.unhealthyConnections,
      replacedConnections: status.replacedConnections
    });
  });

  healthMonitor.on('connection-unhealthy', (data) => {
    console.warn('Unhealthy connection detected:', {
      connectionId: data.connection.id,
      error: data.error,
      timestamp: data.timestamp
    });
  });

  healthMonitor.on('connection-replaced', (data) => {
    console.log('Connection replaced:', {
      oldConnectionId: data.oldConnection.id,
      newConnectionId: data.newConnection.id,
      timestamp: data.timestamp
    });
  });

  // Use the pool normally
  try {
    const connection = await pool.acquire();
    console.log('Acquired connection:', connection.id);
    
    // Simulate some work
    await connection.query('SELECT 1');
    
    await pool.release(connection);
    console.log('Released connection');
    
    // Get current health status
    const healthStatus = healthMonitor.getLastHealthStatus();
    if (healthStatus) {
      console.log('Current health status:', healthStatus);
    }
    
  } catch (error) {
    console.error('Error using pool:', error);
  } finally {
    // Cleanup
    await healthMonitor.shutdown(true); // Shutdown both monitor and pool
  }
}

// Example 2: Create a new pool with health monitoring built-in
async function demoHealthMonitoredPool() {
  console.log('\n=== Demo 2: Creating pool with built-in health monitoring ===');
  
  const { pool, monitor } = createHealthMonitoredPool({
    host: 'localhost',
    port: 3306,
    maxConnections: 5,
    minConnections: 1,
    factory: async () => {
      return {
        id: `mysql-${Math.random().toString(36)}`,
        connected: true,
        serverVersion: '8.0.25'
      };
    },
    destroy: async (connection) => {
      console.log(`MySQL connection closed: ${connection.id}`);
    },
    validate: async (connection) => {
      return connection.connected && connection.serverVersion;
    }
  }, {
    healthCheckInterval: 15000, // 15 seconds
    unhealthyConnectionThreshold: 2, // Faster replacement threshold
    enableDetailedLogging: false // Less verbose for this demo
  });

  // Monitor health status changes
  monitor.on('health-check-completed', (status) => {
    if (status.unhealthyConnections > 0) {
      console.warn(`⚠️  Health check found ${status.unhealthyConnections} unhealthy connections`);
    }
    if (status.replacedConnections > 0) {
      console.log(`🔄 Replaced ${status.replacedConnections} connections`);
    }
  });

  try {
    // Simulate multiple connections being acquired and released
    const connections = [];
    
    for (let i = 0; i < 3; i++) {
      const conn = await pool.acquire();
      connections.push(conn);
      console.log(`Acquired connection ${i + 1}: ${conn.id}`);
    }
    
    // Release connections
    for (const conn of connections) {
      await pool.release(conn);
      console.log(`Released connection: ${conn.id}`);
    }
    
    // Get pool statistics
    const stats = pool.getStats();
    console.log('Pool statistics:', stats);
    
  } catch (error) {
    console.error('Error in demo:', error);
  } finally {
    await monitor.shutdown(true);
  }
}

// Example 3: Advanced health monitoring with custom logic
async function demoAdvancedHealthMonitoring() {
  console.log('\n=== Demo 3: Advanced health monitoring with custom logic ===');
  
  let connectionFailureCount = 0;
  
  const { pool, monitor } = createHealthMonitoredPool({
    host: 'redis.example.com',
    port: 6379,
    maxConnections: 8,
    minConnections: 2,
    factory: async () => {
      return {
        id: `redis-${Date.now()}-${Math.random()}`,
        connected: true,
        lastPing: Date.now(),
        ping: async () => {
          // Simulate ping that might fail
          if (Math.random() > 0.9) {
            connectionFailureCount++;
            throw new Error('Redis connection timeout');
          }
          return 'PONG';
        }
      };
    },
    destroy: async (connection) => {
      console.log(`Redis connection destroyed: ${connection.id}`);
    },
    validate: async (connection) => {
      try {
        await connection.ping();
        return true;
      } catch (error) {
        return false;
      }
    }
  }, {
    healthCheckInterval: 10000, // 10 seconds - more frequent for critical service
    validationTimeout: 2000, // 2 second timeout
    unhealthyConnectionThreshold: 1, // Replace immediately on failure
    enableDetailedLogging: true
  });

  // Advanced event handling
  monitor.on('connection-unhealthy', async (data) => {
    console.error(`🚨 Connection ${data.connection.id} is unhealthy: ${data.error}`);
    
    // Could trigger additional logic like:
    // - Send alerts to monitoring systems
    // - Log to external systems
    // - Trigger circuit breakers
    // - Notify operations teams
  });

  monitor.on('health-monitoring-error', (data) => {
    console.error('💥 Health monitoring error:', data.error.message);
  });

  // Periodic health status reporting
  const statusInterval = setInterval(() => {
    const status = monitor.getLastHealthStatus();
    if (status) {
      console.log(`📊 Health Report - Healthy: ${status.healthyConnections}, ` +
                  `Unhealthy: ${status.unhealthyConnections}, ` +
                  `Memory: ${Math.round(status.memoryUsage.heapUsed / 1024 / 1024)}MB`);
    }
  }, 30000); // Every 30 seconds

  try {
    // Simulate load on the Redis pool
    console.log('Simulating Redis operations...');
    
    for (let i = 0; i < 10; i++) {
      try {
        const conn = await pool.acquire();
        await conn.ping();
        await pool.release(conn);
        console.log(`Redis operation ${i + 1} completed`);
        
        // Small delay between operations
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Redis operation ${i + 1} failed:`, error);
      }
    }
    
    console.log('Final connection failure count:', connectionFailureCount);
    
  } catch (error) {
    console.error('Error in advanced demo:', error);
  } finally {
    clearInterval(statusInterval);
    await monitor.shutdown(true);
  }
}

// Run all demos if this file is executed directly
if (require.main === module) {
  (async () => {
    try {
      await demoHealthMonitoringExistingPool();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
      
      await demoHealthMonitoredPool();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await demoAdvancedHealthMonitoring();
      
      console.log('\n✅ All demos completed successfully!');
    } catch (error) {
      console.error('❌ Demo failed:', error);
      process.exit(1);
    }
  })();
}

export {
  demoHealthMonitoringExistingPool,
  demoHealthMonitoredPool,
  demoAdvancedHealthMonitoring
};