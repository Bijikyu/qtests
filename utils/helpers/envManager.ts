/**
 * Environment Manager - Unified Environment Variable Utilities
 * Replaced with dotenv and native Node.js environment management
 * 
 * Migration Guide:
 * - backupEnvVars() -> Custom implementation using process.env snapshot
 * - restoreEnvVars() -> Custom implementation using saved snapshot
 * - withSavedEnv() -> Higher-order function with dotenv
 */

import dotenv from 'dotenv';

export interface EnvBackup {
  [key: string]: string | undefined;
}

/**
 * Backup current environment variables
 * @param keys - Specific keys to backup, or all if undefined
 * @returns Backup object with current values
 */
export function backupEnvVars(keys?: string[]): EnvBackup {
  const backup: EnvBackup = {};
  
  if (keys) {
    keys.forEach(key => {
      backup[key] = process.env[key];
    });
  } else {
    // Backup all environment variables
    Object.keys(process.env).forEach(key => {
      backup[key] = process.env[key];
    });
  }
  
  return backup;
}

/**
 * Restore environment variables from backup
 * @param backup - Backup object to restore from
 * @param keys - Specific keys to restore, or all if undefined
 */
export function restoreEnvVars(backup: EnvBackup, keys?: string[]): void {
  if (keys) {
    keys.forEach(key => {
      if (key in backup) {
        process.env[key] = backup[key];
      } else {
        delete process.env[key];
      }
    });
  } else {
    // Restore all environment variables from backup
    Object.keys(backup).forEach(key => {
      if (backup[key] !== undefined) {
        process.env[key] = backup[key];
      } else {
        delete process.env[key];
      }
    });
  }
}

/**
 * Execute function with saved environment
 * @param fn - Function to execute
 * @param envVars - Environment variables to set during execution
 * @returns Function result
 */
export function withSavedEnv<T>(fn: () => T, envVars: Record<string, string | undefined> = {}): T {
  const backup = backupEnvVars(Object.keys(envVars));
  
  try {
    // Set new environment variables
    Object.entries(envVars).forEach(([key, value]) => {
      if (value !== undefined) {
        process.env[key] = value;
      } else {
        delete process.env[key];
      }
    });
    
    return fn();
  } finally {
    restoreEnvVars(backup);
  }
}

/**
 * Load environment variables from .env file
 * @param path - Path to .env file
 * @returns Parsed environment variables
 */
export function loadEnv(path?: string): Record<string, string> {
  const result = dotenv.config({ path });
  if (result.error) {
    throw result.error;
  }
  return result.parsed || {};
}

/**
 * Configure environment with defaults and overrides
 * @param defaults - Default environment variables
 * @param overrides - Override values
 * @param envPath - Path to .env file
 */
export function configureEnv(
  defaults: Record<string, string> = {},
  overrides: Record<string, string> = {},
  envPath?: string
): void {
  // Load from .env file if specified
  if (envPath) {
    try {
      const envVars = loadEnv(envPath);
      Object.assign(defaults, envVars);
    } catch (error) {
      console.warn('Failed to load .env file:', error);
    }
  }
  
  // Apply defaults
  Object.entries(defaults).forEach(([key, value]) => {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
  
  // Apply overrides
  Object.entries(overrides).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

// Re-export dotenv for direct usage
export { dotenv };