/**
 * Environment Variable Restore Operations
 * 
 * This module provides functionality for restoring environment variables
 * from a previously created backup, ensuring that tests don't interfere with
 * each other's environment state.
 */

import { EnvBackup } from './envBackup.js';

/**
 * Restore environment variables from backup
 * 
 * This function restores environment variables from a previously created backup,
 * ensuring that tests don't interfere with each other's environment state.
 * 
 * @param backup - Backup object created by backupEnvVars
 * @param clearOthers - Whether to clear variables not in backup (default: false)
 */
export function restoreEnvVars(backup: EnvBackup, clearOthers: boolean = false): void {
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