/**
 * Jest Setup Helper Utility
 * Provides common Jest configuration patterns used across setup files
 */

/**
 * Configures Jest global settings with safe method checking
 * This replaces the common pattern of manual jest method validation
 * 
 * @param jestRef - Jest reference (global or from @jest/globals)
 * @param timeout - Optional timeout value in milliseconds (default: 10000)
 */
export function configureJestGlobals(jestRef: any, timeout: number = 10000): void {
  if (jestRef && typeof jestRef.setTimeout === 'function') {
    jestRef.setTimeout(timeout);
  }
}

/**
 * Safely clears all Jest mocks with method validation
 * This replaces the common pattern of manual jest method validation
 * 
 * @param jestRef - Jest reference (global or from @jest/globals)
 */
export function clearJestMocks(jestRef: any): void {
  if (jestRef && typeof jestRef.clearAllMocks === 'function') {
    jestRef.clearAllMocks();
  }
}

/**
 * Gets Jest reference safely from multiple sources
 * @param globalJest - Global jest reference
 * @param jestFromGlobals - Jest from @jest/globals
 * @returns Safe Jest reference or null
 */
export function getJestRef(globalJest: any, jestFromGlobals: any): any {
  return (typeof jestFromGlobals !== 'undefined' && jestFromGlobals)
    ? jestFromGlobals
    : globalJest;
}