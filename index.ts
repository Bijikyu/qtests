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
  relaxedValidator
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
  ValidationResult
};

// Default export for backward compatibility
export default qtests;
