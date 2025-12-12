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
import { mockAPI } from './lib/mockSystem.js';

// HTTP testing utilities  
import { createMockApp, supertest } from './utils/httpTest.js';

// Test execution utilities
import { runTestSuite, runTestSuites, createAssertions } from './utils/runTestSuite.js';

// Module stubs
import stubs from './lib/stubs.js';

// Resilience patterns
import {
  CircuitBreaker,
  createCircuitBreaker,
  defaultCircuitBreaker,
  fastCircuitBreaker,
  slowCircuitBreaker,
  type CircuitState,
  type CircuitBreakerOptions,
  type CircuitBreakerStats
} from './lib/circuitBreaker.js';

import {
  DistributedRateLimiter,
  InMemoryRateLimiter,
  createDistributedRateLimiter,
  distributedRateLimit,
  type RateLimitConfig,
  type RateLimitResult,
  type RateLimitStats
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
} from './lib/streamingValidator.js';

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
  type BatchResult,
  type BatchProcessingResult
} from './lib/errorWrapper.js';

// Memory monitoring utilities
import {
  MemoryMonitor,
  memoryMonitor,
  detectMemoryLeaks,
  startMemoryMonitoring,
  checkpointMemory,
  endMemoryMonitoring,
  cleanupWithMemoryTracking,
  type MemorySnapshot,
  type MemoryDelta
} from './lib/memoryMonitor.js';

// Memory cleanup utilities
import {
  forceGC,
  clearGlobalRefs,
  clearModuleCache,
  aggressiveCleanup
} from './lib/memoryCleanup.js';

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
  teardownTestIsolation,
  setupJestIsolation
} from './lib/testIsolation.js';

// Wait for condition utility
import { waitForCondition, type WaitForConditionOptions } from './lib/waitForCondition.js';

// Test polyfills for browser APIs
import {
  setupClipboard,
  setupIntersectionObserver,
  setupMatchMedia,
  setupResizeObserver,
  setupAllPolyfills,
  MockIntersectionObserver,
  MockResizeObserver,
  type ClipboardSpies,
  type MockMediaQueryList
} from './lib/testPolyfills.js';

// Create httpTest namespace for backward compatibility
const httpTest = {
  createMockApp,
  supertest
};

// Create mock object for backward compatibility
const mock = {
  module: (name: string, factory: () => any) => mockAPI.module(name, factory),
  mockAPI
};

// Create qtests namespace object
const qtests = {
  stubMethod,
  mockConsole,
  testEnv,
  offlineMode,
  testHelpers,
  runTestSuite,
  runTestSuites,
  createAssertions,
  setup,
  stubs,
  mock,
  httpTest,
  createMockApp,
  supertest,
  CircuitBreaker,
  createCircuitBreaker,
  defaultCircuitBreaker,
  fastCircuitBreaker,
  slowCircuitBreaker,
  DistributedRateLimiter,
  InMemoryRateLimiter,
  createDistributedRateLimiter,
  distributedRateLimit,
  StreamingStringValidator,
  createStreamingValidator,
  streamingValidationMiddleware,
  defaultValidator,
  strictValidator,
  relaxedValidator,
  createAsyncErrorWrapper,
  createSyncErrorWrapper,
  createRouteErrorWrapper,
  createDatabaseErrorWrapper,
  createApiErrorWrapper,
  createFileErrorWrapper,
  createBatchErrorWrapper,
  createTimeoutErrorWrapper,
  transformMongoError,
  MemoryMonitor,
  memoryMonitor,
  detectMemoryLeaks,
  startMemoryMonitoring,
  checkpointMemory,
  endMemoryMonitoring,
  cleanupWithMemoryTracking,
  forceGC,
  clearGlobalRefs,
  clearModuleCache,
  aggressiveCleanup,
  backupEnvironment,
  restoreEnvironment,
  registerMockRestore,
  restoreAllMocks,
  trackServer,
  closeAllServers,
  trackDbConnection,
  closeAllDbConnections,
  setupTestIsolation,
  teardownTestIsolation,
  setupJestIsolation,
  waitForCondition,
  setupClipboard,
  setupIntersectionObserver,
  setupMatchMedia,
  setupResizeObserver,
  setupAllPolyfills,
  MockIntersectionObserver,
  MockResizeObserver
};

// Export all core functionality for easy access
export {
  // Core testing utilities
  stubMethod,
  mockConsole,
  testEnv,
  offlineMode,
  testHelpers,
  runTestSuite,
  runTestSuites,
  createAssertions,
  setup,
  stubs,
  mock,
  httpTest,
  createMockApp,
  supertest,
  
  // Circuit breaker
  CircuitBreaker,
  createCircuitBreaker,
  defaultCircuitBreaker,
  fastCircuitBreaker,
  slowCircuitBreaker,
  
  // Rate limiting
  DistributedRateLimiter,
  InMemoryRateLimiter,
  createDistributedRateLimiter,
  distributedRateLimit,
  
  // Streaming validation
  StreamingStringValidator,
  createStreamingValidator,
  streamingValidationMiddleware,
  defaultValidator,
  strictValidator,
  relaxedValidator,
  
  // Error wrappers
  createAsyncErrorWrapper,
  createSyncErrorWrapper,
  createRouteErrorWrapper,
  createDatabaseErrorWrapper,
  createApiErrorWrapper,
  createFileErrorWrapper,
  createBatchErrorWrapper,
  createTimeoutErrorWrapper,
  transformMongoError,
  
  // Memory monitoring
  MemoryMonitor,
  memoryMonitor,
  detectMemoryLeaks,
  startMemoryMonitoring,
  checkpointMemory,
  endMemoryMonitoring,
  cleanupWithMemoryTracking,
  
  // Memory cleanup
  forceGC,
  clearGlobalRefs,
  clearModuleCache,
  aggressiveCleanup,
  
  // Test isolation
  backupEnvironment,
  restoreEnvironment,
  registerMockRestore,
  restoreAllMocks,
  trackServer,
  closeAllServers,
  trackDbConnection,
  closeAllDbConnections,
  setupTestIsolation,
  teardownTestIsolation,
  setupJestIsolation,
  
  // Wait for condition
  waitForCondition,
  
  // Test polyfills
  setupClipboard,
  setupIntersectionObserver,
  setupMatchMedia,
  setupResizeObserver,
  setupAllPolyfills,
  MockIntersectionObserver,
  MockResizeObserver,
  
  // Namespace
  qtests
};

// Re-export types
export type {
  CircuitState,
  CircuitBreakerOptions,
  CircuitBreakerStats,
  RateLimitConfig,
  RateLimitResult,
  RateLimitStats,
  ValidationConfig,
  ValidationResult,
  AsyncErrorWrapperOptions,
  RouteErrorWrapperOptions,
  DatabaseErrorWrapperOptions,
  ApiErrorWrapperOptions,
  BatchErrorWrapperOptions,
  TimeoutErrorWrapperOptions,
  TransformedError,
  BatchResult,
  BatchProcessingResult,
  MemorySnapshot,
  MemoryDelta,
  WaitForConditionOptions,
  ClipboardSpies,
  MockMediaQueryList
};

// Default export for backward compatibility
export default qtests;
