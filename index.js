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

/**
 * Main module exports
 * 
 * Structure rationale:
 * - Top-level utilities (stubMethod, mockConsole, testEnv) are the most commonly used
 * - setup is separate because it modifies global Node.js behavior and should be explicit
 * - stubs are grouped under a namespace to avoid naming conflicts and provide clarity
 * 
 * This structure allows both simple usage (require('qtests').stubMethod) and
 * organized access to related functionality (require('qtests').stubs.axios)
 */
module.exports = {
  // Core utilities - most frequently used testing functions
  stubMethod,      // Method replacement utility for isolating dependencies
  mockConsole,     // Console output capture for testing logging behavior

  // Environment management utilities
  testEnv,         // Environment and mock management for complex test scenarios
  offlineMode,     // Offline/online mode utility with automatic axios and qerrors switching
  testHelpers,     // Advanced testing utilities for module reloading and mocking

  // Setup utility - separated because it modifies global Node.js module resolution
  // Users must explicitly invoke this function to enable stub resolution
  setup,           // Call this to activate stubs when desired

  // Stub library - organized under namespace to group related mock implementations
  // This prevents naming conflicts and makes it clear these are replacement modules
  stubs
};