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
  
  // Memory cleanup
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
  waitForCondition,
  
  // Test polyfills
import {
  setupClipboard,
  setupIntersectionObserver,
  setupMatchMedia,
  setupResizeObserver,
  setupAllPolyfills,
  MockIntersectionObserver,
  MockResizeObserver,
} from './lib/polyfills/index.js';

// Re-export types
export type {
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
  WaitForConditionOptions
};


