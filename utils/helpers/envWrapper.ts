/**
 * Environment Variable Wrapper Operations
 * 
 * This module provides a convenient wrapper that automatically backs up
 * the current environment, executes a function, and restores the environment
 * afterward, ensuring no side effects leak between tests.
 */

import { backupEnvVars } from './envBackup.js';
import { restoreEnvVars } from './envRestore.js';

/**
 * Execute function with saved environment state
 * 
 * This function provides a convenient wrapper that automatically backs up
 * the current environment, executes a function, and restores the environment
 * afterward, ensuring no side effects leak between tests.
 * 
 * @param fn - Function to execute with saved environment
 * @param keys - Optional array of specific keys to backup/restore
 * @returns Result of the function execution
 */
export function withSavedEnv<T>(fn: () => T, keys?: string[]): T {
  console.log(`withSavedEnv is running with function and ${keys ? keys.length : 'all'} keys`);
  
  try {
    // Backup current environment
    const backup = backupEnvVars(keys);
    
    try {
      // Execute the function
      const result = fn();
      
      // Restore environment
      restoreEnvVars(backup);
      
      console.log(`withSavedEnv is returning function result`);
      return result;
      
    } catch (fnError) {
      // Ensure environment is restored even if function throws
      restoreEnvVars(backup);
      throw fnError;
    }
    
  } catch (err: any) {
    console.log(`withSavedEnv error ${err.message}`);
    throw err;
  }
}