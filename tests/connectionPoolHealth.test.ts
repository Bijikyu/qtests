/**
 * Tests for connection pool health monitoring
 */

import { AdvancedConnectionPool } from '../lib/connectionPool';
import { addHealthMonitoring, createHealthMonitoredPool } from '../lib/connectionPoolHealth';

describe('Connection Pool Health Monitoring', () => {
  let pool: AdvancedConnectionPool;
  let mockConnections: any[] = [];

  beforeEach(() => {
    mockConnections = [];
    
    // Mock connection factory
    const mockFactory = async () => {
      const connection = { id: Math.random(), valid: true, created: Date.now() };
      mockConnections.push(connection);
      return connection;
    };

    // Mock connection destroyer
    const mockDestroy = async (connection: any) => {
      const index = mockConnections.indexOf(connection);
      if (index >= 0) {
        mockConnections.splice(index, 1);
      }
    };

    // Mock connection validator
    const mockValidate = async (connection: any) => {
      return connection && connection.valid;
    };

    pool = new AdvancedConnectionPool({
      host: 'localhost',
      maxConnections: 5,
      minConnections: 2,
      acquireTimeout: 1000,
      idleTimeout: 5000,
      healthCheckInterval: 1000,
      factory: mockFactory,
      destroy: mockDestroy,
      validate: mockValidate
    });
  });

  afterEach(async () => {
    if (pool) {
      await (pool as any).shutdown();
    }
  });

  describe('addHealthMonitoring', () => {
    it('should create health monitor for existing pool', () => {
      const monitor = addHealthMonitoring(pool);
      
      expect(monitor).toBeDefined();
      expect(monitor.getLastHealthStatus()).toBeUndefined();
      
      // Clean up
      monitor.stopHealthMonitoring();
    });

    it('should start health monitoring automatically', (done) => {
      const monitor = addHealthMonitoring(pool, {
        healthCheckInterval: 100
      });

      let healthCheckCount = 0;
      monitor.on('health-check-completed', (status) => {
        healthCheckCount++;
        if (healthCheckCount >= 2) {
          monitor.stopHealthMonitoring();
          done();
        }
      });
    });

    it('should emit health monitoring events', (done) => {
      const monitor = addHealthMonitoring(pool, {
        healthCheckInterval: 50
      });

      const events: string[] = [];
      
      monitor.on('health-monitoring-started', () => {
        events.push('started');
      });
      
      monitor.on('health-check-completed', () => {
        events.push('completed');
      });

      setTimeout(() => {
        expect(events).toContain('started');
        expect(events).toContain('completed');
        monitor.stopHealthMonitoring();
        done();
      }, 200);
    });
  });

  describe('createHealthMonitoredPool', () => {
    it('should create pool and monitor together', () => {
      const { pool: newPool, monitor } = createHealthMonitoredPool({
        host: 'localhost',
        maxConnections: 3,
        minConnections: 1,
        factory: async () => ({ id: 1 }),
        destroy: async () => {},
        validate: async () => true
      });

      expect(newPool).toBeDefined();
      expect(monitor).toBeDefined();
      
      // Clean up
      monitor.stopHealthMonitoring();
    });
  });

  describe('Health Status', () => {
    it('should track health status correctly', async () => {
      const monitor = addHealthMonitoring(pool);
      
      const status = await monitor.performHealthCheck();
      
      expect(status).toBeDefined();
      expect(status.timestamp).toBeInstanceOf(Date);
      expect(status.totalConnections).toBeGreaterThanOrEqual(0);
      expect(status.healthyConnections).toBeGreaterThanOrEqual(0);
      expect(status.unhealthyConnections).toBeGreaterThanOrEqual(0);
      expect(status.validationErrors).toBeInstanceOf(Array);
      expect(status.memoryUsage).toBeDefined();
      
      // Should store last health status
      const lastStatus = monitor.getLastHealthStatus();
      expect(lastStatus).toBe(status);
      
      monitor.stopHealthMonitoring();
    });
  });

  describe('Connection Validation', () => {
    it('should handle unhealthy connections', async () => {
      // Add an unhealthy connection
      const unhealthyConnection = { id: 'bad', valid: false };
      mockConnections.push(unhealthyConnection);

      const monitor = addHealthMonitoring(pool, {
        unhealthyConnectionThreshold: 1,
        healthCheckInterval: 50
      });

      let unhealthyEventFired = false;
      monitor.on('connection-unhealthy', () => {
        unhealthyEventFired = true;
      });

      // Wait for health check to run
      await new Promise(resolve => setTimeout(resolve, 150));
      
      expect(unhealthyEventFired).toBe(true);
      
      monitor.stopHealthMonitoring();
    });
  });

  describe('Lifecycle Management', () => {
    it('should start and stop monitoring correctly', () => {
      const monitor = addHealthMonitoring(pool);
      
      // Should start active
      expect(monitor.getLastHealthStatus()).toBeUndefined();
      
      // Stop monitoring
      monitor.stopHealthMonitoring();
      
      // Should be able to start again
      monitor.startHealthMonitoring();
      
      // Clean up
      monitor.stopHealthMonitoring();
    });

    it('should handle shutdown correctly', async () => {
      const monitor = addHealthMonitoring(pool);
      
      await monitor.shutdown(false); // Don't shutdown pool
      
      // Should not emit health events after shutdown
      let eventFired = false;
      monitor.on('health-check-completed', () => {
        eventFired = true;
      });

      await new Promise(resolve => setTimeout(resolve, 100));
      expect(eventFired).toBe(false);
    });
  });
});