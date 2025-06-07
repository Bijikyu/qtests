
/**
 * qtests - Main Entry Point
 * 
 * This module serves as the unified export point for all qtests functionality.
 * The architecture is designed to provide a clean, intuitive API where users
 * can access all testing utilities through a single import.
 * 
 * Design rationale:
 * - Single entry point reduces cognitive load for users
 * - Organized by functionality (utils, stubs, setup) for clarity
 * - Each utility is kept in separate files for maintainability
 * - Setup is separate to allow optional inclusion in test environments
 */

// Import individual utilities - kept separate for modularity and testing
const stubMethod = require('./utils/stubMethod');
const { mockConsole } = require('./utils/mockConsole');
const testEnv = require('./utils/testEnv');

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
  testEnv,         // Environment and mock management for complex test scenarios
  
  // Setup utility - separated because it modifies global Node.js module resolution
  // Users must explicitly require this to enable automatic stub resolution
  setup: require('./setup'),
  
  // Stub library - organized under namespace to group related mock implementations
  // This prevents naming conflicts and makes it clear these are replacement modules
  stubs: {
    axios: require('./stubs/axios'),      // HTTP client stub for network-free testing
    winston: require('./stubs/winston')   // Logging library stub for output-free testing
  }
};
