/**
 * Advanced Testing Helper Utilities (Refactored)
 * 
 * This module has been refactored to follow Single Responsibility Principle.
 * It now coordinates between focused helper utilities for better maintainability.
 * 
 * Components:
 * - helpers/moduleReloader.js - Module cache management and reloading
 * - helpers/qerrorsStub.js - QErrors stubbing functionality
 * - helpers/consoleMocker.js - Console mocking utilities
 * - helpers/responseMocker.js - Response object mocking for API testing
 */

// Import focused helper utilities
const { reload } = require('./helpers/moduleReloader');
const { stubQerrors } = require('./helpers/qerrorsStub');
const { withMockConsole } = require('./helpers/consoleMocker');
const { createJsonRes, createRes } = require('./helpers/responseMocker');

// Export all helper utilities following qtests framework patterns
module.exports = {
  reload,
  stubQerrors,
  withMockConsole,
  createJsonRes,
  createRes
};