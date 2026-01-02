/**
 * Load Testing Framework
 * 
 * Provides comprehensive load testing capabilities with configurable scenarios,
 * real-time monitoring, and detailed performance analysis.
 */

import { EventEmitter } from 'events';
import { monitoringSystem } from './monitoring.js';

export interface LoadTestConfig {
  name: string;
  duration: number;              // Test duration in seconds
  concurrentUsers: number;       // Number of concurrent users
  rampUpTime?: number;          // Time to ramp up users (seconds)
  requestInterval?: number;       // Interval between requests (ms)
  endpoint?: string;             // Target endpoint URL
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;              // Request timeout (ms)
  thinkTime?: number;            // User think time between requests (ms)
}

export interface LoadTestScenario extends LoadTestConfig {
  scenarios: LoadTestStep[];
}

export interface LoadTestStep {
  name: string;
  weight?: number;              // Relative weight (0-100)
  config: LoadTestConfig;
}

export interface LoadTestResults {
  testName: string;
  startTime: number;
  endTime: number;
  duration: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  errorRate: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  p50: number;                 // 50th percentile
  p95: number;                 // 95th percentile
  p99: number;                 // 99th percentile
  throughput: number;           // Requests per second
  errors: Array<{
    error: string;
    count: number;
    firstOccurrence: number;
  }>;
  timeline: Array<{
    timestamp: number;
    activeUsers: number;
    requestsPerSecond: number;
    avgResponseTime: number;
    errorRate: number;
  }>;
}

interface RequestResult {
  timestamp: number;
  responseTime: number;
  success: boolean;
  error?: string;
  statusCode?: number;
}

interface ActiveUser {
  id: number;
  startTime: number;
  lastActivity: number;
  requests: number;
  errors: number;
}

/**
 * Advanced load testing framework
 */
export class LoadTestRunner extends EventEmitter {
  private results: LoadTestResults[] = [];
  private activeUsers: ActiveUser[] = [];
  private requestResults: RequestResult[] = [];
  private isRunning = false;
  private startTime = 0;
  private endTime = 0;
  private timelineInterval?: NodeJS.Timeout;
  
  // Adaptive memory management
  private maxResultHistory = 1000; // Limit result history
  private maxActiveUsers = 10000; // Limit concurrent active users
  private memoryThreshold = 500 * 1024 * 1024; // 500MB memory threshold
  private adaptiveMode = 'normal'; // 'normal', 'reduced', 'minimal'
  private lastMemoryCheck = 0;

  constructor() {
    super();
  }

  /**
   * Run a simple load test
   */
  async runLoadTest(config: LoadTestConfig): Promise<LoadTestResults> {
    this.isRunning = true;
    this.startTime = Date.now();
    this.requestResults = [];
    this.activeUsers = [];

    try {
      console.log(`Starting load test: ${config.name}`);
      console.log(`Concurrent users: ${config.concurrentUsers}, Duration: ${config.duration}s`);

      // Check available memory and adjust test parameters
      this.checkMemoryUsage();
      
      // Apply adaptive limits based on memory
      const adjustedConfig = this.applyAdaptiveLimits(config);
      
      // Start timeline monitoring
      this.startTimelineMonitoring();

      // Ramp up users with adaptive configuration
      await this.rampUpUsers(adjustedConfig);
      await this.rampUpUsers(config);

      // Run test for specified duration
      await this.runTestDuration(config);

      // Ramp down users
      await this.rampDownUsers();

      this.endTime = Date.now();
      
      const results = this.analyzeResults(config);
      this.results.push(results);
      
      console.log(`Load test completed: ${config.name}`);
      console.log(`Total requests: ${results.totalRequests}, Error rate: ${results.errorRate.toFixed(2)}%`);
      console.log(`Avg response time: ${results.avgResponseTime.toFixed(2)}ms, Throughput: ${results.throughput.toFixed(2)} req/s`);

      return results;
    } finally {
      this.isRunning = false;
      this.stopTimelineMonitoring();
    }
  }

  /**
   * Run a complex scenario test
   */
  async runScenario(scenario: LoadTestScenario): Promise<LoadTestResults> {
    // For now, treat as simple test
    return this.runLoadTest(scenario);
  }

  /**
   * Run a stress test (gradually increasing load)
   */
  async runStressTest(baseConfig: LoadTestConfig, maxUsers: number, stepSize: number = 10): Promise<LoadTestResults[]> {
    const results: LoadTestResults[] = [];
    let currentUsers = baseConfig.concurrentUsers;

    console.log(`Starting stress test: ${baseConfig.name}`);
    console.log(`Users: ${currentUsers} -> ${maxUsers} (step: ${stepSize})`);

    while (currentUsers <= maxUsers && this.isRunning) {
      const config = { ...baseConfig, name: `${baseConfig.name}_${currentUsers}users`, concurrentUsers: currentUsers };
      
      const result = await this.runLoadTest(config);
      results.push(result);

      // Check if we should stop (high error rate)
      if (result.errorRate > 10 || result.avgResponseTime > 5000) {
        console.log(`Stress test stopped at ${currentUsers} users due to high error rate or response time`);
        break;
      }

      currentUsers += stepSize;
    }

    return results;
  }

  /**
   * Get all test results
   */
  getResults(): LoadTestResults[] {
    return [...this.results];
  }

  /**
   * Clear all results
   */
  clearResults(): void {
    this.results = [];
  }

  /**
   * Stop current test
   */
  stopTest(): void {
    this.isRunning = false;
    console.log('Load test stop requested');
  }

  private async rampUpUsers(config: LoadTestConfig): Promise<void> {
    const rampUpTime = config.rampUpTime || 0;
    const interval = rampUpTime > 0 ? rampUpTime * 1000 / config.concurrentUsers : 0;

    for (let i = 0; i < config.concurrentUsers && this.isRunning; i++) {
      const user: ActiveUser = {
        id: i,
        startTime: Date.now(),
        lastActivity: Date.now(),
        requests: 0,
        errors: 0
      };

      this.activeUsers.push(user);
      this.startUserActivity(user, config);

      if (interval > 0) {
        await this.sleep(interval);
      }
    }
  }

  private async runTestDuration(config: LoadTestConfig): Promise<void> {
    const endTime = this.startTime + (config.duration * 1000);
    
    while (Date.now() < endTime && this.isRunning) {
      await this.sleep(1000); // Check every second
    }
  }

  private async rampDownUsers(): Promise<void> {
    // Stop all users
    const promises = this.activeUsers.map(user => this.stopUserActivity(user));
    await Promise.allSettled(promises);
    this.activeUsers = [];
  }

  private startUserActivity(user: ActiveUser, config: LoadTestConfig): void {
    let requestCount = 0;
    const maxRequestsPerUser = 10000; // Prevent infinite loops
    
    const runActivity = async () => {
      while (this.isRunning && requestCount < maxRequestsPerUser) {
        try {
          const requestStart = Date.now();
          const result = await this.makeRequest(config);
          const responseTime = Date.now() - requestStart;

          this.recordRequest({
            timestamp: requestStart,
            responseTime,
            success: result.success,
            error: result.error,
            statusCode: result.statusCode
          });

          user.requests++;
          user.lastActivity = Date.now();
          requestCount++;

          // Update monitoring
          monitoringSystem.recordRequest(responseTime, result.success);

        } catch (error) {
          user.errors++;
          requestCount++;
          this.recordRequest({
            timestamp: Date.now(),
            responseTime: 0,
            success: false,
            error: (error as Error).message
          });

          monitoringSystem.recordRequest(0, false);
        }

        // Think time
        if (config.thinkTime && config.thinkTime > 0) {
          await this.sleep(config.thinkTime);
        } else if (config.requestInterval && config.requestInterval > 0) {
          await this.sleep(config.requestInterval);
        }
      }
    };

    runActivity().catch(error => {
      console.error(`User ${user.id} activity error:`, error);
    });
  }

  private async stopUserActivity(user: ActiveUser): Promise<void> {
    // Users will stop naturally when this.isRunning becomes false
    return Promise.resolve();
  }

  private async makeRequest(config: LoadTestConfig): Promise<{ success: boolean; error?: string; statusCode?: number }> {
    if (!config.endpoint) {
      return { success: false, error: 'No endpoint configured' };
    }

    try {
      const options: RequestInit = {
        method: config.method || 'GET',
        headers: config.headers
      };

      // Set timeout using AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout || 10000);
      options.signal = controller.signal;

      if (config.body && (config.method === 'POST' || config.method === 'PUT')) {
        options.body = typeof config.body === 'string' ? config.body : JSON.stringify(config.body);
      }

      const response = await fetch(config.endpoint, options);
      clearTimeout(timeoutId);
      
      return {
        success: response.status < 400,
        statusCode: response.status,
        error: response.status >= 400 ? `HTTP ${response.status}` : undefined
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  private recordRequest(result: RequestResult): void {
    this.requestResults.push(result);

    // Adaptive memory management based on test duration
    const maxResults = this.calculateMaxResults();
    if (this.requestResults.length > maxResults) {
      // Keep samples for percentile calculations while reducing memory
      const keepCount = Math.floor(maxResults * 0.6); // Keep 60%
      const sampleInterval = Math.floor(this.requestResults.length / keepCount);
      
      const sampled: RequestResult[] = [];
      for (let i = 0; i < this.requestResults.length; i += sampleInterval) {
        sampled.push(this.requestResults[i]);
      }
      
      // Always keep the most recent 20% of results
      const recentStart = Math.floor(this.requestResults.length * 0.8);
      const recent = this.requestResults.slice(recentStart);
      
      this.requestResults = [...sampled.slice(0, keepCount - recent.length), ...recent];
    }
  }

  private calculateMaxResults(): number {
    const duration = (this.endTime || Date.now()) - this.startTime;
    const durationMinutes = duration / (1000 * 60);
    
    // Scale memory usage based on test duration
    if (durationMinutes < 1) return 5000;      // Short tests
    if (durationMinutes < 10) return 10000;    // Medium tests  
    return 20000; // Long tests
  }

  private analyzeResults(config: LoadTestConfig): LoadTestResults {
    const duration = (this.endTime - this.startTime) / 1000;
    const totalRequests = this.requestResults.length;
    const successfulRequests = this.requestResults.filter(r => r.success).length;
    const failedRequests = totalRequests - successfulRequests;
    const errorRate = totalRequests > 0 ? (failedRequests / totalRequests) * 100 : 0;

    const responseTimes = this.requestResults
      .filter(r => r.success)
      .map(r => r.responseTime)
      .sort((a, b) => a - b);

    const avgResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;

    const minResponseTime = responseTimes.length > 0 ? responseTimes[0] : 0;
    const maxResponseTime = responseTimes.length > 0 ? responseTimes[responseTimes.length - 1] : 0;

    const p50 = this.getPercentile(responseTimes, 50);
    const p95 = this.getPercentile(responseTimes, 95);
    const p99 = this.getPercentile(responseTimes, 99);

    const throughput = duration > 0 ? totalRequests / duration : 0;

    // Analyze errors
    const errorCounts = new Map<string, number>();
    let firstErrorTime = 0;

    for (const result of this.requestResults) {
      if (!result.success && result.error) {
        errorCounts.set(result.error, (errorCounts.get(result.error) || 0) + 1);
        if (firstErrorTime === 0) {
          firstErrorTime = result.timestamp;
        }
      }
    }

    const errors = Array.from(errorCounts.entries())
      .map(([error, count]) => ({
        error,
        count,
        firstOccurrence: firstErrorTime
      }))
      .sort((a, b) => b.count - a.count);

    return {
      testName: config.name,
      startTime: this.startTime,
      endTime: this.endTime,
      duration,
      totalRequests,
      successfulRequests,
      failedRequests,
      errorRate,
      avgResponseTime,
      minResponseTime,
      maxResponseTime,
      p50,
      p95,
      p99,
      throughput,
      errors,
      timeline: [] // TODO: Generate timeline from timeline data
    };
  }

  private getPercentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0;
    
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, index)];
  }

  /**
   * Check memory usage and adjust adaptive mode
   */
  private checkMemoryUsage(): void {
    const now = Date.now();
    if (now - this.lastMemoryCheck < 5000) return; // Check every 5 seconds
    
    this.lastMemoryCheck = now;
    
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      const memoryUsageMB = memUsage.heapUsed / 1024 / 1024;
      
      if (memoryUsageMB > this.memoryThreshold * 0.9) {
        this.adaptiveMode = 'minimal';
        console.warn(`High memory usage (${memoryUsageMB.toFixed(1)}MB), switching to minimal mode`);
      } else if (memoryUsageMB > this.memoryThreshold * 0.7) {
        this.adaptiveMode = 'reduced';
        console.info(`Moderate memory usage (${memoryUsageMB.toFixed(1)}MB), switching to reduced mode`);
      } else {
        this.adaptiveMode = 'normal';
      }
    }
  }

  /**
   * Apply adaptive limits based on current memory and mode
   */
  private applyAdaptiveLimits(config: LoadTestConfig): LoadTestConfig {
    const adjusted = { ...config };
    
    switch (this.adaptiveMode) {
      case 'minimal':
        adjusted.concurrentUsers = Math.min(config.concurrentUsers || 1, Math.floor(this.maxActiveUsers * 0.1));
        adjusted.requestInterval = (adjusted.requestInterval || 1000) * 4; // Slower requests
        break;
      case 'reduced':
        adjusted.concurrentUsers = Math.min(config.concurrentUsers || 1, Math.floor(this.maxActiveUsers * 0.3));
        adjusted.requestInterval = (adjusted.requestInterval || 1000) * 2; // Slower requests
        break;
    }
    
    return adjusted;
  }

  private startTimelineMonitoring(): void {
    this.timelineInterval = setInterval(() => {
      if (!this.isRunning) return;

      const now = Date.now();
      const recentResults = this.requestResults.filter(r => 
        r.timestamp > now - 10000 // Last 10 seconds
      );

      const requestsPerSecond = recentResults.length / 10;
      const avgResponseTime = recentResults.length > 0
        ? recentResults.reduce((sum, r) => sum + r.responseTime, 0) / recentResults.length
        : 0;
      const errorRate = recentResults.length > 0
        ? (recentResults.filter(r => !r.success).length / recentResults.length) * 100
        : 0;

      this.emit('timeline-update', {
        timestamp: now,
        activeUsers: this.activeUsers.length,
        requestsPerSecond,
        avgResponseTime,
        errorRate
      });
    }, 5000); // Update every 5 seconds
  }

  private stopTimelineMonitoring(): void {
    if (this.timelineInterval) {
      clearInterval(this.timelineInterval);
      this.timelineInterval = undefined;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Predefined load test scenarios
 */
export const LoadTestScenarios = {
  /**
   * Basic smoke test - low load for short duration
   */
  smokeTest: (name: string, endpoint: string): LoadTestConfig => ({
    name: `${name}_smoke`,
    duration: 30,
    concurrentUsers: 5,
    rampUpTime: 10,
    endpoint,
    method: 'GET',
    timeout: 5000,
    thinkTime: 1000
  }),

  /**
   * Load test - moderate load for extended duration
   */
  loadTest: (name: string, endpoint: string): LoadTestConfig => ({
    name: `${name}_load`,
    duration: 300,
    concurrentUsers: 50,
    rampUpTime: 60,
    endpoint,
    method: 'GET',
    timeout: 10000,
    thinkTime: 500
  }),

  /**
   * Stress test - gradually increasing load
   */
  stressTest: (name: string, endpoint: string): LoadTestConfig => ({
    name: `${name}_stress`,
    duration: 60,
    concurrentUsers: 100,
    rampUpTime: 30,
    endpoint,
    method: 'GET',
    timeout: 15000,
    thinkTime: 200
  }),

  /**
   * Spike test - sudden high load burst
   */
  spikeTest: (name: string, endpoint: string): LoadTestConfig => ({
    name: `${name}_spike`,
    duration: 120,
    concurrentUsers: 200,
    rampUpTime: 5, // Very fast ramp up
    endpoint,
    method: 'GET',
    timeout: 20000,
    thinkTime: 100
  })
};

export default LoadTestRunner;