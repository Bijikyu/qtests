/**
 * Offline Mode Utility - TypeScript Implementation
 */

// Type definitions
interface EnvironmentState {
  codexFlag: boolean;
  offlineFlagExplicit: boolean;
  testEnvironment: boolean;
  isOffline: boolean;
  environmentDetected: boolean;
}

interface EnvironmentAdapters {
  isOffline: boolean;
  axios: any;
  qerrors: any;
}

// Simple offline state management
let isOfflineFlag = false;
let cachedAxios: any = null;
let cachedQerrors: any = null;

/**
 * Set offline mode
 */
function setOfflineMode(offline: boolean): void {
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
function isOfflineMode(): boolean {
  return isOfflineFlag;
}

/**
 * Get axios (stub or real)
 */
async function getAxios(): Promise<any> {
  if (!cachedAxios) {
    if (isOfflineFlag) {
      // Use stub axios
      const stubAxios = await import('../stubs/axios.js');
      cachedAxios = stubAxios.default || stubAxios;
    } else {
      // Try real axios, fallback to stub
      try {
        const axios = await import('axios');
        cachedAxios = axios.default || axios;
      } catch (e) {
        const stubAxios = await import('../stubs/axios.js');
        cachedAxios = stubAxios.default || stubAxios;
      }
    }
  }
  return cachedAxios;
}

/**
 * Get qerrors (stub or real)
 */
async function getQerrors(): Promise<any> {
  if (!cachedQerrors) {
    if (isOfflineFlag) {
      // Use stub qerrors
      cachedQerrors = { qerrors: () => {} };
    } else {
      // Try real qerrors, fallback to stub
      try {
        // Note: This would need to be converted to dynamic import for ES modules
        // For now, using the stub version as qerrors may not be available
        cachedQerrors = { qerrors: () => {} };
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
function getEnvironmentState(): EnvironmentState {
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
async function createEnvironmentAdapters(): Promise<EnvironmentAdapters> {
  return {
    isOffline: isOfflineFlag,
    axios: await getAxios(),
    qerrors: await getQerrors()
  };
}

/**
 * Clear offline cache
 */
function clearOfflineCache(): void {
  cachedAxios = null;
  cachedQerrors = null;
}

// Export offline mode utilities using ES module syntax
export {
  setOfflineMode,
  isOfflineMode,
  getAxios,
  getQerrors,
  getEnvironmentState,
  createEnvironmentAdapters,
  clearOfflineCache
};