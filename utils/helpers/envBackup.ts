/**
 * Environment Variable Backup Operations
 * 
 * This module provides functionality for backing up environment variables
 * during testing to ensure test isolation and prevent side effects.
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
export function backupEnvVars(keys?: string[]): EnvBackup {
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

export type { EnvBackup };