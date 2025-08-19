/**
 * Offline Mode Utility - Working Implementation
 */

// Simple offline state management
let isOfflineFlag = false;
let cachedAxios = null;
let cachedQerrors = null;

/**
 * Set offline mode
 */
function setOfflineMode(offline) {
  const changed = isOfflineFlag !== offline;
  isOfflineFlag = offline;
  
  // Clear cache when mode changes
  if (changed) {
    clearOfflineCache();
  }
}

/**
 * Check if offline mode is enabled
 */
function isOfflineMode() {
  return isOfflineFlag;
}

/**
 * Get axios (stub or real)
 */
function getAxios() {
  if (!cachedAxios) {
    if (isOfflineFlag) {
      // Use stub axios
      cachedAxios = require('../stubs/axios');
    } else {
      // Try real axios, fallback to stub
      try {
        cachedAxios = require('axios');
      } catch (e) {
        cachedAxios = require('../stubs/axios');
      }
    }
  }
  return cachedAxios;
}

/**
 * Get qerrors (stub or real)
 */
function getQerrors() {
  if (!cachedQerrors) {
    if (isOfflineFlag) {
      // Use stub qerrors
      cachedQerrors = { qerrors: () => {} };
    } else {
      // Try real qerrors, fallback to stub
      try {
        cachedQerrors = require('qerrors');
      } catch (e) {
        cachedQerrors = { qerrors: () => {} };
      }
    }
  }
  return cachedQerrors;
}

/**
 * Get environment state
 */
function getEnvironmentState() {
  const codexFlag = process.env.CODEX?.toLowerCase() === 'true';
  const offlineFlagExplicit = process.env.OFFLINE_MODE?.toLowerCase() === 'true';
  const testEnvironment = process.env.NODE_ENV === 'test';
  
  return {
    codexFlag,
    offlineFlagExplicit,
    testEnvironment,
    isOffline: isOfflineFlag,
    environmentDetected: codexFlag || offlineFlagExplicit
  };
}

/**
 * Create environment adapters
 */
function createEnvironmentAdapters() {
  return {
    isOffline: isOfflineFlag,
    axios: getAxios(),
    qerrors: getQerrors()
  };
}

/**
 * Clear offline cache
 */
function clearOfflineCache() {
  cachedAxios = null;
  cachedQerrors = null;
}

module.exports = {
  setOfflineMode,
  isOfflineMode,
  getAxios,
  getQerrors,
  getEnvironmentState,
  createEnvironmentAdapters,
  clearOfflineCache
};