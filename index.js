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
const { stubMethod, mockConsole } = require('./lib/coreUtils');
const { testEnv, offlineMode, testHelpers } = require('./lib/envUtils');
const { setup } = require('./lib/setup');
const stubs = require('./lib/stubs');
const { TestGenerator } = require('./lib/testGenerator');
const { runTestSuite, runTestSuites, createAssertions } = require('./utils/runTestSuite');


// export main module utilities at bottom per requirements
module.exports = {
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