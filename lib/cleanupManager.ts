/**
 * Centralized Cleanup Manager
 * 
 * Manages cleanup intervals and background tasks across all components
 * to prevent memory leaks and ensure proper resource management.
 */

import { EventEmitter } from 'events';

export interface CleanupTask {
  id: string;
  name: string;
  interval: NodeJS.Timeout;
  cleanup: () => void | Promise<void>;
  frequency: number;
  lastRun: number;
  runCount: number;
  enabled: boolean;
  component: string;
}

export interface CleanupManagerConfig {
  defaultCleanupInterval?: number;  // Default interval for cleanup tasks (ms)
  maxTaskAge?: number;              // Maximum age for tasks before forced cleanup (ms)
  enableMetrics?: boolean;          // Enable cleanup metrics tracking
  healthCheckInterval?: number;     // Interval for health checks (ms)
}

export interface CleanupMetrics {
  totalTasks: number;
  activeTasks: number;
  completedCleanups: number;
  failedCleanups: number;
  averageCleanupTime: number;
  lastCleanupTime: number;
  memoryFreed: number;
}

/**
 * Centralized cleanup manager for all background tasks
 */
export class CleanupManager extends EventEmitter {
  private config: Required<CleanupManagerConfig>;
  private tasks = new Map<string, CleanupTask>();
  private metrics: CleanupMetrics;
  private healthCheckInterval?: NodeJS.Timeout;
  private isShutdown = false;
  
  // Task registry for different component types
  private componentTasks = new Map<string, Set<string>>();

  constructor(config: CleanupManagerConfig = {}) {
    super();
    
    this.config = {
      defaultCleanupInterval: config.defaultCleanupInterval || 60000, // 1 minute
      maxTaskAge: config.maxTaskAge || 300000, // 5 minutes
      enableMetrics: config.enableMetrics !== false,
      healthCheckInterval: config.healthCheckInterval || 30000 // 30 seconds
    };
    
    this.metrics = {
      totalTasks: 0,
      activeTasks: 0,
      completedCleanups: 0,
      failedCleanups: 0,
      averageCleanupTime: 0,
      lastCleanupTime: 0,
      memoryFreed: 0
    };
    
    this.startHealthChecks();
  }

  /**
   * Register a cleanup task
   */
  registerTask(
    id: string,
    name: string,
    cleanup: () => void | Promise<void>,
    options: {
      frequency?: number;
      component?: string;
      enabled?: boolean;
    } = {}
  ): void {
    if (this.isShutdown) {
      throw new Error('Cleanup manager is shutdown');
    }
    
    if (this.tasks.has(id)) {
      this.unregisterTask(id); // Clean up existing task
    }
    
    const frequency = options.frequency || this.config.defaultCleanupInterval;
    const enabled = options.enabled !== false;
    const component = options.component || 'unknown';
    
    // Create the interval task
    const interval = setInterval(async () => {
      await this.executeTask(id);
    }, frequency);
    
    // Register the task
    const task: CleanupTask = {
      id,
      name,
      interval,
      cleanup,
      frequency,
      lastRun: 0,
      runCount: 0,
      enabled,
      component
    };
    
    this.tasks.set(id, task);
    
    // Track component tasks
    if (!this.componentTasks.has(component)) {
      this.componentTasks.set(component, new Set());
    }
    this.componentTasks.get(component)!.add(id);
    
    // Update metrics
    this.metrics.totalTasks++;
    if (enabled) {
      this.metrics.activeTasks++;
    }
    
    this.emit('task:registered', { id, name, component, frequency });
    console.debug(`Registered cleanup task: ${name} (${id}) for component: ${component}`);
  }

  /**
   * Unregister a cleanup task
   */
  unregisterTask(id: string): void {
    const task = this.tasks.get(id);
    if (!task) {
      return;
    }
    
    // Clear the interval
    clearInterval(task.interval);
    
    // Remove from component tracking
    const componentTasks = this.componentTasks.get(task.component);
    if (componentTasks) {
      componentTasks.delete(id);
      if (componentTasks.size === 0) {
        this.componentTasks.delete(task.component);
      }
    }
    
    // Remove from tasks
    this.tasks.delete(id);
    
    // Update metrics
    this.metrics.totalTasks--;
    if (task.enabled) {
      this.metrics.activeTasks--;
    }
    
    this.emit('task:unregistered', { id, name: task.name });
    console.debug(`Unregistered cleanup task: ${task.name} (${id})`);
  }

  /**
   * Enable or disable a task
   */
  setTaskEnabled(id: string, enabled: boolean): void {
    const task = this.tasks.get(id);
    if (!task) {
      return;
    }
    
    const wasEnabled = task.enabled;
    task.enabled = enabled;
    
    // Update metrics
    if (wasEnabled && !enabled) {
      this.metrics.activeTasks--;
    } else if (!wasEnabled && enabled) {
      this.metrics.activeTasks++;
    }
    
    this.emit('task:updated', { id, enabled });
  }

  /**
   * Execute a specific cleanup task
   */
  async executeTask(id: string): Promise<void> {
    const task = this.tasks.get(id);
    if (!task || !task.enabled) {
      return;
    }
    
    const startTime = Date.now();
    let memoryBefore = 0;
    
    try {
      // Track memory before cleanup if metrics are enabled
      if (this.config.enableMetrics) {
        memoryBefore = process.memoryUsage().heapUsed;
      }
      
      // Execute the cleanup
      await task.cleanup();
      
      // Update task metrics
      task.lastRun = Date.now();
      task.runCount++;
      
      // Update global metrics
      const duration = Date.now() - startTime;
      this.updateCleanupMetrics(duration, true, memoryBefore);
      
      this.emit('task:completed', { id, duration, success: true });
      
    } catch (error) {
      // Update error metrics
      task.lastRun = Date.now();
      this.updateCleanupMetrics(Date.now() - startTime, false, memoryBefore);
      
      this.emit('task:error', { id, error });
      console.error(`Cleanup task failed: ${task.name} (${id})`, error);
    }
  }

  /**
   * Execute all tasks for a specific component
   */
  async executeComponentTasks(component: string): Promise<void> {
    const taskIds = this.componentTasks.get(component);
    if (!taskIds) {
      return;
    }
    
    const promises = Array.from(taskIds).map(id => this.executeTask(id));
    await Promise.allSettled(promises);
    
    this.emit('component:cleaned', { component, taskCount: taskIds.size });
  }

  /**
   * Execute all enabled tasks
   */
  async executeAllTasks(): Promise<void> {
    const promises = Array.from(this.tasks.values())
      .filter(task => task.enabled)
      .map(task => this.executeTask(task.id));
    
    await Promise.allSettled(promises);
    
    this.emit('all:cleaned', { taskCount: this.metrics.activeTasks });
  }

  /**
   * Get task information
   */
  getTask(id: string): CleanupTask | undefined {
    const task = this.tasks.get(id);
    return task ? { ...task } : undefined;
  }

  /**
   * Get all tasks
   */
  getAllTasks(): CleanupTask[] {
    return Array.from(this.tasks.values()).map(task => ({ ...task }));
  }

  /**
   * Get tasks for a specific component
   */
  getComponentTasks(component: string): CleanupTask[] {
    const taskIds = this.componentTasks.get(component);
    if (!taskIds) {
      return [];
    }
    
    return Array.from(taskIds)
      .map(id => this.tasks.get(id))
      .filter(task => task !== undefined)
      .map(task => ({ ...task! }));
  }

  /**
   * Get cleanup metrics
   */
  getMetrics(): CleanupMetrics {
    return { ...this.metrics };
  }

  /**
   * Get component summary
   */
  getComponentSummary(): Record<string, { taskCount: number; activeTasks: number; lastRun: number }> {
    const summary: Record<string, { taskCount: number; activeTasks: number; lastRun: number }> = {};
    
    for (const [component, taskIds] of this.componentTasks) {
      const tasks = Array.from(taskIds)
        .map(id => this.tasks.get(id))
        .filter(task => task !== undefined);
      
      const activeTasks = tasks.filter(task => task!.enabled).length;
      const lastRun = Math.max(...tasks.map(task => task!.lastRun), 0);
      
      summary[component] = {
        taskCount: tasks.length,
        activeTasks,
        lastRun
      };
    }
    
    return summary;
  }

  /**
   * Force cleanup of old or stale tasks
   */
  async forceCleanup(): Promise<void> {
    const now = Date.now();
    const tasksToCleanup: CleanupTask[] = [];
    
    // Find tasks that haven't run recently or are too old
    for (const task of this.tasks.values()) {
      if (!task.enabled) {
        continue;
      }
      
      const age = now - task.lastRun;
      if (age > this.config.maxTaskAge) {
        tasksToCleanup.push(task);
      }
    }
    
    // Execute cleanup for stale tasks
    for (const task of tasksToCleanup) {
      try {
        await this.executeTask(task.id);
      } catch (error) {
        console.error(`Force cleanup failed for task: ${task.name}`, error);
      }
    }
    
    this.emit('force:cleanup', { cleanedCount: tasksToCleanup.length });
    
    if (tasksToCleanup.length > 0) {
      console.log(`Force cleanup completed for ${tasksToCleanup.length} stale tasks`);
    }
  }

  /**
   * Shutdown the cleanup manager
   */
  async shutdown(): Promise<void> {
    if (this.isShutdown) {
      return;
    }
    
    this.isShutdown = true;
    
    // Clear health check interval
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
    
    // Clear all task intervals
    for (const task of this.tasks.values()) {
      clearInterval(task.interval);
    }
    
    // Execute final cleanup for all tasks
    try {
      await this.executeAllTasks();
    } catch (error) {
      console.error('Final cleanup execution failed:', error);
    }
    
    // Clear all data
    this.tasks.clear();
    this.componentTasks.clear();
    
    this.emit('shutdown');
    console.log('Cleanup manager shutdown completed');
  }

  /**
   * Start health check monitoring
   */
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckInterval);
  }

  /**
   * Perform health check on all tasks
   */
  private performHealthCheck(): void {
    const now = Date.now();
    const staleTasks: string[] = [];
    const problematicTasks: string[] = [];
    
    for (const [id, task] of this.tasks) {
      if (!task.enabled) {
        continue;
      }
      
      // Check for stale tasks
      const timeSinceLastRun = now - task.lastRun;
      if (timeSinceLastRun > task.frequency * 3) {
        staleTasks.push(id);
      }
      
      // Check for tasks with high failure rates
      if (task.runCount > 10) {
        const recentTasks = this.getRecentTaskExecutions(id);
        const failureRate = recentTasks.filter(exec => !exec.success).length / recentTasks.length;
        
        if (failureRate > 0.5) {
          problematicTasks.push(id);
        }
      }
    }
    
    // Emit health check results
    if (staleTasks.length > 0 || problematicTasks.length > 0) {
      this.emit('health:warning', { staleTasks, problematicTasks });
    }
    
    this.emit('health:check', {
      totalTasks: this.tasks.size,
      activeTasks: this.metrics.activeTasks,
      staleTasks: staleTasks.length,
      problematicTasks: problematicTasks.length
    });
  }

  /**
   * Get recent task executions (simplified tracking)
   */
  private getRecentTaskExecutions(id: string): Array<{ success: boolean; timestamp: number }> {
    // This is a simplified implementation
    // In a real scenario, you'd track execution history
    return [{ success: true, timestamp: Date.now() }];
  }

  /**
   * Update cleanup metrics
   */
  private updateCleanupMetrics(duration: number, success: boolean, memoryBefore: number): void {
    if (!this.config.enableMetrics) {
      return;
    }
    
    this.metrics.lastCleanupTime = Date.now();
    
    if (success) {
      this.metrics.completedCleanups++;
      
      // Update average cleanup time
      const totalCleanups = this.metrics.completedCleanups;
      this.metrics.averageCleanupTime = 
        (this.metrics.averageCleanupTime * (totalCleanups - 1) + duration) / totalCleanups;
      
      // Track memory freed
      const memoryAfter = process.memoryUsage().heapUsed;
      const memoryFreed = Math.max(0, memoryBefore - memoryAfter);
      this.metrics.memoryFreed += memoryFreed;
    } else {
      this.metrics.failedCleanups++;
    }
  }
}

/**
 * Global cleanup manager instance
 */
export const globalCleanupManager = new CleanupManager();

/**
 * Create a cleanup manager with custom configuration
 */
export function createCleanupManager(config?: CleanupManagerConfig): CleanupManager {
  return new CleanupManager(config);
}

export default CleanupManager;