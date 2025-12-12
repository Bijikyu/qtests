/**
 * qtests - Main Entry Point
 * 
 * This module serves as a unified export point for all qtests functionality.
 * Focuses on core testing utilities: method stubbing, console mocking, environment management,
 * module stubbing, HTTP testing utilities, and test execution scaffolding.
 */

// Core utilities for isolated testing
import { stubMethod, mockConsole, testEnv, offlineMode, testHelpers } from './lib/coreUtils.js';
import { setup } from './lib/setup.js';
import { mockAPI } from './lib/mockSystem.js';

// HTTP testing utilities  
import { httpTest } from './utils/httpTest';

// Test execution utilities
import { runTestSuite, runTestSuites, createAssertions } from './utils/runTestSuite.js';

// Module stubs
import stubs from './lib/stubs.js';

// Type definitions for main module exports
export interface QtestsAPI {
  // Core testing utilities
  stubMethod: typeof stubMethod;
  mockConsole: typeof mockConsole;
  testEnv: typeof testEnv;
  offlineMode: typeof offlineMode;
  testHelpers: typeof testHelpers;
  runTestSuite: typeof runTestSuite;
  runTestSuites: typeof runTestSuites;
  createAssertions: typeof createAssertions;
  setup: typeof setup;
  stubs: typeof stubs;
  mock: {
    module: (name: string, factory: () => any) => void;
    mockAPI: {
      module: (name: string, factory: () => any) => void;
      stubFn: (obj: any, methodName: string, stubFn: Function) => () => void;
      restore: () => void;
    };
  };
  httpTest: typeof httpTest;
}

// Export all core functionality for easy access
export {
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
  qtests
};

// Export all core functionality for easy access
export {
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
  mock: mock,
  qtests
};

// Default export for backward compatibility
export default {
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
  qtests
};