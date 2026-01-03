/**
 * qtests - Main Entry Point
 * 
 * This module serves as a unified export point for all qtests functionality.
 * Focuses on core testing utilities: method stubbing, console mocking, environment management,
 * module stubbing, HTTP testing utilities, resilience patterns, and test execution scaffolding.
 */

// Core utilities for isolated testing
import { stubMethod, mockConsole } from './lib/coreUtils.js';
import { testEnv, offlineMode, testHelpers } from './lib/envUtils.js';
import { setup } from './lib/setup.js';

// HTTP testing utilities  
import { createMockApp, supertest } from './utils/httpTest.js';

// Test execution utilities
import { runTestSuite, runTestSuites, createAssertions } from './utils/runTestSuite.js';

// Module stubs
import stubs from './lib/stubs.js';

// Resilience patterns - Circuit breaker functionality removed during SRP compliance
// TODO: Re-implement circuit breaker pattern if needed using focused modules

import {
  DistributedRateLimiter,
  InMemoryRateLimiter,
  createDistributedRateLimiter,
  distributedRateLimit,
} from './lib/rateLimiter.js';

import {
  StreamingStringValidator,
  createStreamingValidator,
  streamingValidationMiddleware,
  defaultValidator,
  strictValidator,
  relaxedValidator,
  type ValidationConfig,
  type ValidationResult
} from './lib/streamingValidatorModern.js';

// Error wrapper utilities
import {
  createAsyncErrorWrapper,
  createSyncErrorWrapper,
  createRouteErrorWrapper,
  createDatabaseErrorWrapper,
  createApiErrorWrapper,
  createFileErrorWrapper,
  createBatchErrorWrapper,
  createTimeoutErrorWrapper,
  transformMongoError,
  type AsyncErrorWrapperOptions,
  type RouteErrorWrapperOptions,
  type DatabaseErrorWrapperOptions,
  type ApiErrorWrapperOptions,
  type BatchErrorWrapperOptions,
  type TimeoutErrorWrapperOptions,
  type TransformedError,
  type BatchProcessingResult
} from './lib/errorHandling/index.js';

// Memory monitoring utilities
import {
  memoryMonitor,
  detectMemoryLeaks,
  startMemoryMonitoring,
  checkpointMemory,
  endMemoryMonitoring,
  type MemorySnapshot,
  type MemoryDelta
} from './lib/memory/index.js';

// Memory cleanup utilities
import {
  aggressiveCleanup,
} from './lib/memory/index.js';

// Test isolation utilities
import {
  backupEnvironment,
  restoreEnvironment,
  registerMockRestore,
  restoreAllMocks,
  trackServer,
  closeAllServers,
  trackDbConnection,
  closeAllDbConnections,
  setupTestIsolation,
} from './lib/testIsolation/index.js';

// Wait for condition utility
import {
  waitForCondition,
  type WaitForConditionOptions,
} from './lib/waitForCondition.js';

// Test polyfills
import {
  setupClipboard,
  setupIntersectionObserver,
  setupMatchMedia,
  setupResizeObserver,
  setupAllPolyfills,
} from './lib/polyfills/index.js';

// Re-export types
export type {
  RateLimitConfig,
  type RateLimitResult,
  type RateLimitStats,
  type ValidationConfig,
  type ValidationResult
  MemorySnapshot,
  type MemoryDelta,
  AsyncErrorWrapperOptions,
  RouteErrorWrapperOptions,
  DatabaseErrorWrapperOptions,
  ApiErrorWrapperOptions,
  BatchErrorWrapperOptions,
  TimeoutErrorWrapperOptions,
  TransformedError,
  BatchProcessingResult,
  MemoryStats,
  AdaptiveScalingConfig,
  PerformanceMetrics
  CleanupManagerConfig,
  CleanupMetrics,
} from './lib/memoryPressure';

// Scalability and performance components
import {
  PerformanceMonitor,
  createPerformanceMonitor,
  globalPerformanceMonitor,
  type PerformanceMetrics,
  type AlertRule,
  type Alert,
  type MonitorConfig
} from './lib/performanceMonitor.js';

import {
  DistributedCache,
  createCache,
  CacheManager,
  type CacheOptions,
  type CacheItem,
  type CacheStats,
  type CacheMetrics
} from './lib/cache.ts';

import {
  ScalableDatabaseClient,
  createScalableDatabaseClient,
  type DatabaseConfig,
  type QueryOptions,
  type QueryResult,
  type DatabaseMetrics
} from './lib/scalableDatabase.ts';

import {
  AdvancedConnectionPool,
  createDatabasePool,
  type ConnectionConfig,
  type ConnectionStats,
  type PoolOptions
} from './lib/connectionPool.ts';

import {
  CircuitBreaker,
  createCircuitBreaker,
  withCircuitBreaker,
  type CircuitBreakerOptions,
  type CircuitBreakerStats,
  type CircuitState
} from './lib/circuitBreaker.ts';

// Memory pressure detection and adaptive scaling
import {
  MemoryPressureMonitor,
  createMemoryPressureMonitor,
  globalMemoryPressureMonitor,
  type MemoryPressureConfig,
  type MemoryStats,
  type ScalingAction,
  type AdaptiveScalingConfig,
} from './lib/memoryPressure.ts';

// Cleanup management
import {
  CleanupManager,
  createCleanupManager,
  type CleanupManagerConfig,
  type CleanupMetrics,
} from './lib/cleanupManager.ts';

// Scalable API client
import {
  ScalableApiClient,
  createScalableApiClient,
  api,
  defaultApiClient,
  type ApiRequestConfig,
  type ApiResponse,
  type ApiMetrics
} from './lib/scalableApi.ts';

// Enhanced rate limiting
import {
  DistributedRateLimiter,
  InMemoryRateLimiter,
  createDistributedRateLimiter,
  distributedRateLimit,
  type RateLimitResult,
  type RateLimitConfig,
  type RateLimitStats
} from './lib/rateLimiter.ts';

// Advanced connection pooling
import {
  AdvancedConnectionPool,
  createDatabasePool,
  type ConnectionConfig,
  type ConnectionStats,
  type PoolOptions,
} from './lib/connectionPool.ts';

// Enhanced caching
import {
  DistributedCache,
  createCache,
  CacheManager,
  type CacheOptions,
  type CacheItem,
  type CacheStats,
  type CacheMetrics,
} from './lib/cache.ts';

// Database optimization
import {
  ScalableDatabaseClient,
  createScalableDatabaseClient,
  type DatabaseConfig,
  type QueryOptions,
  type QueryResult,
  type DatabaseMetrics
} from './lib/scalableDatabase.ts';

// Circuit breaker with enhanced timeout handling
import {
  CircuitBreaker,
  createCircuitBreaker,
  withCircuitBreaker,
  type CircuitBreakerOptions,
  type CircuitBreakerStats,
  type CircuitState,
} from './lib/circuitBreaker.ts';

// Cleanup manager
import {
  CleanupManager,
  createCleanupManager,
  type CleanupManagerConfig,
  type CleanupMetrics,
} from './lib/cleanupManager.ts';

// Memory monitoring with adaptive scaling
import {
  MemoryPressureMonitor,
  createMemoryPressureMonitor,
  globalMemoryPressureMonitor,
  type MemoryPressureConfig,
  type MemoryStats,
  type ScalingAction,
  type AdaptiveScalingConfig,
} from './lib/memoryPressure.ts';

// Performance monitoring with adaptive sampling
import {
  PerformanceMonitor,
  createPerformanceMonitor,
  globalPerformanceMonitor,
  type PerformanceMetrics,
  type AlertRule,
  type Alert,
  type MonitorConfig
} from './lib/performanceMonitor.ts';

// Wait for condition utility
import {
  waitForCondition,
  type WaitForConditionOptions,
} from './lib/waitForCondition.js';

// Enhanced test polyfills
import {
  setupClipboard,
  setupIntersectionObserver,
  setupMatchMedia,
  setupResizeObserver,
  setupAllPolyfills,
} from './lib/polyfills/index.js';

// Enhanced streaming validator
import {
  StreamingStringValidator,
  createStreamingValidator,
  streamingValidationMiddleware,
  defaultValidator,
  strictValidator,
  relaxedValidator,
  type ValidationConfig,
  type ValidationResult
} from './lib/streamingValidatorModern.ts';

// Load testing
import {
  LoadTestSuite,
  createTestSuite,
  runLoadTests,
  createLoadTestSuite,
} from './lib/loadTest.ts';

// Mock server integration
import {
  testHelpers,
  trackServer,
  closeAllServers,
} from './lib/testIsolation/index.js';

// HTTP testing utilities
import {
  createMockApp,
  supertest,
} from './utils/httpTest.shim.ts';

// Error wrapper utilities
import {
  createAsyncErrorWrapper,
  createSyncErrorWrapper,
  createRouteErrorWrapper,
  createDatabaseErrorWrapper,
  createApiErrorWrapper,
  createFileErrorWrapper,
  createBatchErrorWrapper,
  createTimeoutErrorWrapper,
  transformMongoError,
  type AsyncErrorWrapperOptions,
  type RouteErrorWrapperOptions,
  type DatabaseErrorWrapperOptions,
  type ApiErrorWrapperOptions,
  type BatchErrorWrapperOptions,
  type TimeoutErrorWrapperOptions,
  type TransformedError,
  type BatchProcessingResult
} from './lib/errorHandling/index.js';

// Environment utilities
import {
  testEnv,
  offlineMode,
  testHelpers,
} from './lib/envUtils.js';

// Module stubbing
import {
  stubMethod,
  mockConsole,
} from './lib/stubMethod.js';

// Streaming validator modern
import {
  createStreamingValidator,
  streamingValidationMiddleware,
  defaultValidator,
  strictValidator,
  relaxedValidator,
} from './lib/streamingValidatorModern.ts';

// Test isolation
import {
  testHelpers,
  trackServer,
  closeAllServers,
} from './lib/testIsolation/index.js';

// Monitoring utilities
import {
  memoryMonitor,
  detectMemoryLeaks,
  startMemoryMonitoring,
  checkpointMemory,
  endMemoryMonitoring,
} from './lib/memory/index.js';

// Enhanced console mocking
import {
  mockConsole,
} from './lib/console/mockConsole.js';

// Wait for condition utility
import {
  waitForCondition,
} from './lib/waitForCondition.js';

// Performance monitor
import {
  performanceMonitor,
} from './lib/performanceMonitor.ts';

// Advanced database operations
import {
  ScalableDatabaseClient,
  createScalableDatabaseClient,
} from './lib/scalableDatabase.ts';

// Connection pool optimization
import {
  AdvancedConnectionPool,
  createDatabasePool,
} from './lib/connectionPool.ts';

// Enhanced rate limiting
import {
  DistributedRateLimiter,
  createDistributedRateLimiter,
  distributedRateLimit,
} from './lib/rateLimiter.ts';

// Cache system with advanced features
import {
  DistributedCache,
  createCache,
} from './lib/cache.ts';

// Database optimization with intelligent limits
import {
  ScalableDatabaseClient,
  createScalableDatabaseClient,
} from './lib/scalableDatabase.ts';

// Circuit breaker with enhanced timeouts
import {
  CircuitBreaker,
  createCircuitBreaker,
  withCircuitBreaker,
} from './lib/circuitBreaker.ts';

// Cleanup management
import {
  CleanupManager,
  createCleanupManager,
} from './lib/cleanupManager.ts';

// Scalability API
import {
  ScalableApiClient,
  createScalableApiClient,
  api,
  defaultApiClient,
} from './lib/scalableApi.ts';
}