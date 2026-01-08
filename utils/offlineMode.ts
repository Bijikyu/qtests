/**
 * Offline Mode Utility - TypeScript Implementation
 * 
 * This module provides offline mode functionality for the qtests framework,
 * allowing tests to run without network dependencies by automatically switching
 * to stub implementations when offline mode is detected or explicitly enabled.
 * 
 * Key features:
 * - Automatic offline detection based on environment variables
 * - Dynamic module resolution (real vs stub implementations)
 * - Secure path validation to prevent directory traversal attacks
 * - Fallback mechanisms for robust operation
 * - Cached module loading for performance optimization
 * 
 * Security considerations:
 * - Path validation prevents directory traversal attacks
 * - Explicit stub directory checking ensures module safety
 * - Error handling prevents information leakage
 * 
 * Performance optimizations:
 * - Module caching reduces repeated imports
 * - Lazy loading only loads modules when needed
 * - Conditional imports based on offline mode state
 */

import { CODEX, OFFLINE_MODE, NODE_ENV } from '../config/localVars.js';
import qerrors from 'qerrors';
import path from 'path';

/**
 * Interface representing the current environment state
 * Used to track and report offline mode detection and configuration
 */
interface EnvironmentState {
  codexFlag: boolean;           // Whether CODEX environment flag is set
  offlineFlagExplicit: boolean; // Whether OFFLINE_MODE is explicitly enabled
  testEnvironment: boolean;     // Whether running in test environment
  isOffline: boolean;           // Current offline mode state
  environmentDetected: boolean; // Whether offline environment was detected
}

/**
 * Interface representing environment adapters for external dependencies
 * Provides unified access to both real and stub implementations
 */
interface EnvironmentAdapters {
  isOffline: boolean;  // Current offline mode state
  axios: any;         // Axios HTTP client (real or stub)
  qerrors: any;       // Error logging utility (real or stub)
}

// Global state management for offline mode
let isOfflineFlag = false;     // Current offline mode state
let cachedAxios: any = null;   // Cached axios module instance
let cachedQerrors: any = null; // Cached qerrors module instance

/**
 * Set offline mode state and clear cached modules
 * 
 * This function updates the offline mode flag and clears any cached
 * module instances to ensure the correct implementations are loaded
 * on next access.
 * 
 * @param offline - Whether to enable offline mode
 */
function setOfflineMode(offline: boolean): void {
  const changed = isOfflineFlag !== offline;
  isOfflineFlag = offline;
  
  // Clear cache when offline mode changes to ensure correct module loading
  if (changed) {
    clearOfflineCache();
  }
}

/**
 * Get current offline mode state
 * 
 * @returns Current offline mode flag value
 */
function isOfflineMode(): boolean {
  return isOfflineFlag;
}

/**
 * Clear cached module instances
 * 
 * Forces reloading of modules on next access by clearing the cache.
 * This is typically called when offline mode state changes.
 */
function clearOfflineCache(): void {
  cachedAxios = null;
  cachedQerrors = null;
}

/**
 * Get appropriate axios module based on offline mode state
 * 
 * This function dynamically loads either the real axios module or
 * the stub implementation based on the current offline mode state.
 * It includes comprehensive security validation and fallback mechanisms.
 * 
 * Security features:
 * - Path validation to prevent directory traversal
 * - Explicit directory checking for stub modules
 * - Error handling with fallback to safe defaults
 * 
 * @returns Promise resolving to axios module (real or stub)
 * @throws Error when module loading fails and no fallback is available
 */
async function getAxiosModule(): Promise<any> {
  // Return cached instance if available
  if (!cachedAxios) {
    if (isOfflineFlag) {
      // Load stub axios in offline mode
      try {
        const axiosPath = require.resolve('../stubs/axios.js');
        const resolvedPath = path.normalize(path.resolve(axiosPath));
        const expectedDir = path.normalize(path.resolve(process.cwd(), 'stubs'));
        
        // Security validation: ensure path is within expected directory
        if (!resolvedPath.startsWith(expectedDir + path.sep) && resolvedPath !== expectedDir) {
          throw new Error('Invalid stub module path - outside expected directory');
        }
        
        // Additional security: check for directory traversal attempts
        const relativePath = path.relative(expectedDir, resolvedPath);
        if (relativePath.startsWith('..') || relativePath.includes(path.sep + '..')) {
          throw new Error('Invalid stub module path - directory traversal detected');
        }
        
        // Import the stub module
        const module = await import(axiosPath);
        cachedAxios = module.default || module;
        
      } catch (error) {
        qerrors(
          error instanceof Error ? error : new Error(String(error)),
          'offlineMode.getEnvironment: stub axios import failed',
          {
            modulePath: '../stubs/axios.js',
            environment: 'offline'
          }
        );
        throw error;
      }
    } else {
      // Load real axios in online mode
      try {
        const axios = await import('axios');
        cachedAxios = axios.default || axios;
        
      } catch (error) {
        // Fallback to stub if real axios fails to load
        const errorObj = error instanceof Error ? error : new Error(String(error));
        qerrors(errorObj, 'offlineMode.getEnvironment: real axios import failed', {
          modulePath: 'axios',
          errorType: errorObj.constructor?.name || 'unknown'
        });
        
        try {
          // Attempt to load stub as fallback
          const fallbackAxiosPath = require.resolve('../stubs/axios.js');
          const fallbackResolvedPath = path.normalize(path.resolve(fallbackAxiosPath));
          const fallbackExpectedDir = path.normalize(path.resolve(process.cwd(), 'stubs'));
          
          // Security validation for fallback path
          if (!fallbackResolvedPath.startsWith(fallbackExpectedDir + path.sep) && fallbackResolvedPath !== fallbackExpectedDir) {
            throw new Error('Invalid fallback stub path - outside expected directory');
          }
          
          const stubAxios = await import('../stubs/axios.js');
          cachedAxios = stubAxios.default || stubAxios;
          
        } catch (fallbackError) {
          // Ultimate fallback: minimal axios-like object
          const fallbackErrorObj = fallbackError instanceof Error ? fallbackError : new Error(String(fallbackError));
          qerrors(fallbackErrorObj as Error, 'offlineMode.getEnvironment: fallback axios import failed', {
            modulePath: '../stubs/axios.js',
            originalError: errorObj && errorObj instanceof Error ? errorObj.message : 'Unknown error'
          });
          
          // Safe fallback that provides basic axios-like interface
          cachedAxios = {
            get: () => Promise.resolve({}),
            post: () => Promise.resolve({})
          };
        }
      }
    }
  }
  
  return cachedAxios;
}

/**
 * Get appropriate qerrors module based on offline mode state
 * 
 * Currently returns a no-op implementation in both online and offline
 * modes, but provides the structure for future enhancement where
 * different error handling strategies might be needed.
 * 
 * @returns Promise resolving to qerrors module
 */
async function getQerrors(): Promise<any> {
  if (!cachedQerrors) {
    if (isOfflineFlag) {
      // No-op error handler for offline mode
      cachedQerrors = { qerrors: () => {} };
    } else {
      try {
        // Currently also no-op, but could be enhanced for online mode
        cachedQerrors = { qerrors: () => {} };
      } catch (e) {
        // Fallback to no-op error handler
        cachedQerrors = { qerrors: () => {} };
      }
    }
  }
  
  return cachedQerrors;
}

/**
 * Get current environment state information
 * 
 * This function analyzes environment variables and current state
 * to provide a comprehensive view of the offline mode configuration
 * and detection status.
 * 
 * @returns EnvironmentState object with current configuration
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
 * Create environment adapters for external dependencies
 * 
 * This function provides a unified interface for accessing external
 * dependencies with the appropriate implementations (real or stub)
 * based on the current offline mode state.
 * 
 * @returns Promise resolving to EnvironmentAdapters object
 */
async function createEnvironmentAdapters(): Promise<EnvironmentAdapters> {
  return {
    isOffline: isOfflineFlag,
    axios: await getAxiosModule(),
    qerrors: await getQerrors()
  };
}

// Export public API with clear naming
export {
  setOfflineMode,
  isOfflineMode,
  getAxiosModule as getAxios,
  getQerrors,
  getEnvironmentState,
  createEnvironmentAdapters,
  clearOfflineCache
};