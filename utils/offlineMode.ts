/**
 * Offline Mode Utility - TypeScript Implementation
 */

import { CODEX, OFFLINE_MODE, NODE_ENV } from '../config/localVars.js';
import qerrors from 'qerrors';
import path from 'path';

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
      // Use stub axios with secure path validation
      try {
        // Validate module path to prevent traversal using proper path resolution
        const axiosPath = require.resolve('../stubs/axios.js');
        const resolvedPath = path.normalize(path.resolve(axiosPath));
        const expectedDir = path.normalize(path.resolve(process.cwd(), 'stubs'));
        
        // Strict path validation to prevent directory traversal
        if (!resolvedPath.startsWith(expectedDir + path.sep) && resolvedPath !== expectedDir) {
          throw new Error('Invalid stub module path - outside expected directory');
        }
        
        // Additional safety check
        const relativePath = path.relative(expectedDir, resolvedPath);
        if (relativePath.startsWith('..') || relativePath.includes(path.sep + '..')) {
          throw new Error('Invalid stub module path - directory traversal detected');
        }
        
        const module = await import(axiosPath);
        cachedAxios = module.default || module;
      } catch (error) {
        qerrors(error instanceof Error ? error : new Error(String(error)), 'offlineMode.getEnvironment: stub axios import failed', {
          modulePath: '../stubs/axios.js',
          environment: 'offline'
        });
        throw error;
      }
    } else {
      // Try real axios, fallback to stub
      try {
        const axios = await import('axios');
        cachedAxios = axios.default || axios;
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        qerrors(errorObj, 'offlineMode.getEnvironment: real axios import failed', {
          modulePath: 'axios',
          errorType: errorObj.constructor?.name || 'unknown'
        });
        try {
          // Secure fallback with path validation
          const fallbackAxiosPath = require.resolve('../stubs/axios.js');
          const fallbackResolvedPath = path.normalize(path.resolve(fallbackAxiosPath));
          const fallbackExpectedDir = path.normalize(path.resolve(process.cwd(), 'stubs'));
          
          if (!fallbackResolvedPath.startsWith(fallbackExpectedDir + path.sep) && fallbackResolvedPath !== fallbackExpectedDir) {
            throw new Error('Invalid fallback stub path - outside expected directory');
          }
          
          const stubAxios = await import('../stubs/axios.js');
          cachedAxios = stubAxios.default || stubAxios;
        } catch (fallbackError) {
          const fallbackErrorObj = fallbackError instanceof Error ? fallbackError : new Error(String(fallbackError));
          qerrors(fallbackErrorObj as Error, 'offlineMode.getEnvironment: fallback axios import failed', {
            modulePath: '../stubs/axios.js',
            originalError: errorObj && errorObj instanceof Error ? errorObj.message : 'Unknown error'
          });
          // Return safe default instead of throwing to avoid crashes
          cachedAxios = { get: () => Promise.resolve({}), post: () => Promise.resolve({}) };
        }
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
  const codexFlag = CODEX?.toLowerCase() === 'true';
  const offlineFlagExplicit = OFFLINE_MODE?.toLowerCase() === 'true';
  const testEnvironment = NODE_ENV === 'test';
  
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