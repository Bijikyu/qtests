/**
 * Environment Variable Management Utility - TypeScript Implementation
 * 
 * This module provides functionality for backing up and restoring environment
 * variables during testing to ensure test isolation and prevent side effects.
 */

// Type definitions
interface EnvBackup {
  [key: string]: string | undefined;
}

/**
 * Backup current environment variables
 * 
 * This function creates a snapshot of the current environment variables
 * that can be restored later to ensure test isolation.
 * 
 * @param keys - Optional array of specific keys to backup (defaults to all)
 * @returns Object containing backed up environment variables
 */
function backupEnvVars(keys?: string[]): EnvBackup {
  console.log(`backupEnvVars is running with ${keys ? keys.join(', ') : 'all keys'}`);
  
  try {
    const backup: EnvBackup = {};
    
    if (keys && keys.length > 0) {
      // Backup only specific keys
      for (const key of keys) {
        backup[key] = process.env[key];
      }
    } else {
      // Backup all environment variables
      Object.assign(backup, process.env);
    }
    
    console.log(`backupEnvVars is returning backup with ${Object.keys(backup).length} keys`);
    return backup;
    
  } catch (err: any) {
    console.log(`backupEnvVars error ${err.message}`);
    throw err;
  }
}

/**
 * Restore environment variables from backup
 * 
 * This function restores environment variables from a previously created backup,
 * ensuring that tests don't interfere with each other's environment state.
 * 
 * @param backup - Backup object created by backupEnvVars
 * @param clearOthers - Whether to clear variables not in backup (default: false)
 */
function restoreEnvVars(backup: EnvBackup, clearOthers: boolean = false): void {
  console.log(`restoreEnvVars is running with backup containing ${Object.keys(backup).length} keys`);
  
  try {
    if (clearOthers) {
      // Clear all current environment variables first
      const currentKeys = Object.keys(process.env);
      for (const key of currentKeys) {
        if (!(key in backup)) {
          delete process.env[key];
        }
      }
    }
    
    // Restore backed up variables
    for (const [key, value] of Object.entries(backup)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
    
    console.log(`restoreEnvVars completed restoration`);
    
  } catch (err: any) {
    console.log(`restoreEnvVars error ${err.message}`);
    throw err;
  }
}

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
function withSavedEnv<T>(fn: () => T, keys?: string[]): T {
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

// Export environment management utilities using ES module syntax
export {
  backupEnvVars,
  restoreEnvVars,
  withSavedEnv
};