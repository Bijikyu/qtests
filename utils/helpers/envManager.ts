/** Environment Manager - Unified Environment Variable Utilities */
import dotenv from 'dotenv';

export interface EnvBackup {
  [key: string]: string | undefined;
}

/**
 * Backup current environment variables
 * @param keys - Optional array of specific keys to backup (defaults to all)
 * @returns Object containing backed up environment variables
 */
export const backupEnvVars = (keys?: string[]): EnvBackup => {
  const backup: EnvBackup = {};
  const keysToBackup = keys || Object.keys(process.env);
  
  keysToBackup.forEach(key => {
    backup[key] = process.env[key];
  });
  
  return backup;
};

/**
 * Restore environment variables from backup
 * @param backup - Backup object created by backupEnvVars
 * @param keys - Optional array of specific keys to restore (defaults to all keys in backup)
 */
export const restoreEnvVars = (backup: EnvBackup, keys?: string[]): void => {
  const keysToRestore = keys || Object.keys(backup);
  
  keysToRestore.forEach(key => {
    if (key in backup) {
      if (backup[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = backup[key];
      }
    } else {
      // Only delete if we're restoring specific keys and they weren't in backup
      if (keys && keys.includes(key)) {
        delete process.env[key];
      }
    }
  });
};

/**
 * Execute function with saved environment state
 * @param fn - Function to execute
 * @param envVars - Environment variables to set during execution
 * @returns Result of the function execution
 */
export const withSavedEnv = <T>(fn: () => T, envVars: Record<string, string | undefined> = {}): T => {
  const backup = backupEnvVars(Object.keys(envVars));
  
  try {
    // Set temporary environment variables
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
};

/**
 * Load environment variables from .env file
 * @param path - Optional path to .env file
 * @returns Parsed environment variables
 */
export const loadEnv = (path?: string): Record<string, string> => {
  const result = dotenv.config({ path });
  if (result.error) throw result.error;
  return result.parsed || {};
};

/**
 * Configure environment with defaults and overrides
 * @param defaults - Default environment variables
 * @param overrides - Override environment variables
 * @param envPath - Optional path to .env file
 */
export const configureEnv = (
  defaults: Record<string, string> = {},
  overrides: Record<string, string> = {},
  envPath?: string
): void => {
  if (defaults === null || overrides === null) {
    throw new Error('configureEnv: defaults and overrides must be objects');
  }
  
  if (envPath) {
    try {
      Object.assign(defaults, loadEnv(envPath));
    } catch (error) {
      console.warn('Failed to load .env file:', error);
    }
  }
  
  // Set defaults only if not already set
  Object.entries(defaults).forEach(([key, value]) => {
    if (process.env[key] === undefined && value !== undefined) {
      process.env[key] = value;
    }
  });
  
  // Apply overrides
  Object.entries(overrides).forEach(([key, value]) => {
    if (value !== undefined) {
      process.env[key] = value;
    }
  });
};

/**
 * Initialize dotenv configuration with simple interface
 * This function matches the pattern used across config files
 */
export const initializeDotenv = (): void => {
  dotenv.config();
};

/**
 * Gets an environment variable with a default fallback value
 * @param key - Environment variable name
 * @param defaultValue - Default value if variable is not set
 * @returns Environment variable value or default
 */
export const getEnvVar = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

export { dotenv };