
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
const offlineMode = require('./utils/offlineMode');
const testHelpers = require('./utils/testHelpers');

function setup(){ // (function exported so stubs activate only when called)
  console.log(`setup is running with none`); // (debug start log)
  try{ // (error handling wrapper)
    require('./setup'); // (load setup side effect on demand)
    console.log(`setup is returning undefined`); // (debug return log)
  }catch(error){ // (catch any require failure)
    console.log(`setup encountered ${error.message}`); // (error log)
    throw error; // (propagate error)
  }
} // (end setup function)

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
  offlineMode,     // Offline/online mode utility with automatic axios and qerrors switching
  testHelpers,     // Advanced testing utilities for module reloading and mocking
  
  // Setup utility - separated because it modifies global Node.js module resolution
  // Users must explicitly invoke this function to enable stub resolution
  setup, // (call this to activate stubs when desired)
  
  // Stub library - organized under namespace to group related mock implementations
  // This prevents naming conflicts and makes it clear these are replacement modules
  stubs: {
    axios: require('./stubs/axios'),      // HTTP client stub for network-free testing
    winston: require('./stubs/winston')   // Logging library stub for output-free testing
  }
};
