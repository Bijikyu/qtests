/**
 * qtests - Main Entry Point
 * 
 * This module serves as the unified export point for all qtests functionality.
 * The architecture is designed to provide a clean, intuitive API where users
 * can access all testing utilities through a single import.
 * 
 * Design rationale:
 * - Single entry point reduces cognitive load for users
 * - Organized by functionality (core, environment, setup, stubs) for clarity
 * - Each category is kept in separate lib files for maintainability
 * - Maintains backward compatibility with existing API
 */

// Import organized utility categories from lib directory
import { stubMethod, mockConsole } from './lib/coreUtils.js';
import { testEnv, offlineMode, testHelpers } from './lib/envUtils.js';
import { setup } from './lib/setup.js';
import stubs from './lib/stubs.js';
import { TestGenerator } from './lib/testGenerator.js';
import { runTestSuite, runTestSuites, createAssertions } from './utils/runTestSuite.js';

// Type definitions for the main module exports
export interface QtestsAPI {
  stubMethod: typeof stubMethod;
  mockConsole: typeof mockConsole;
  testEnv: typeof testEnv;
  offlineMode: typeof offlineMode;
  testHelpers: typeof testHelpers;
  TestGenerator: typeof TestGenerator;
  runTestSuite: typeof runTestSuite;
  runTestSuites: typeof runTestSuites;
  createAssertions: typeof createAssertions;
  setup: typeof setup;
  stubs: typeof stubs;
}

// Named exports for ES module compatibility
export {
  stubMethod, // method replacement utility for isolating dependencies
  mockConsole, // console output capture for testing logging behavior
  testEnv, // environment and mock management for complex test scenarios
  offlineMode, // offline/online mode utility with automatic switching
  testHelpers, // advanced testing utilities for module reloading and mocking
  TestGenerator, // automatic test generation from source code analysis
  runTestSuite, // lightweight test runner for simple test scenarios
  runTestSuites, // run multiple test suites with overall summary
  createAssertions, // basic assertion helpers for test writing
  setup, // call this to activate stubs when desired
  stubs // stub library organized under namespace
};

// Default export for backward compatibility
const qtests: QtestsAPI = {
  stubMethod,
  mockConsole,
  testEnv,
  offlineMode,
  testHelpers,
  TestGenerator,
  runTestSuite,
  runTestSuites,
  createAssertions,
  setup,
  stubs
};

export default qtests;