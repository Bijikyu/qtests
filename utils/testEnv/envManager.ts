/**
 * Environment Manager - Consolidated Environment Variable Utilities
 * Replaced with dotenv and unified environment management from utils/helpers/envManager.ts
 * 
 * This module now re-exports functionality from the consolidated environment manager
 * to eliminate code duplication while maintaining backward compatibility.
 */

import { 
  backupEnvVars, 
  restoreEnvVars, 
  withSavedEnv, 
  loadEnv, 
  configureEnv 
} from '../helpers/envManager.js';
import { logStart, logReturn, setLogging } from '../../lib/logUtils.js';
import { withErrorLogging } from '../../lib/errorHandling/index.js';
import { nodeEnv } from '../../config/localVars.js';

// Set logging based on environment using localVars pattern
if (nodeEnv !== 'test') {
  setLogging(false);
}

interface DefaultEnv {
  GOOGLE_API_KEY: string;
  GOOGLE_CX: string;
  OPENAI_TOKEN: string;
}

// Abstracted configuration management - centralizes env var access
const getEnvConfig = (): DefaultEnv => {
  // Get configuration from environment variables with fallbacks
  const googleApiKey = process.env.GOOGLE_API_KEY || '';
  const googleCx = process.env.GOOGLE_CX || '';
  const openaiToken = process.env.OPENAI_TOKEN || '';

  const config = {
    GOOGLE_API_KEY: googleApiKey,
    GOOGLE_CX: googleCx,
    OPENAI_TOKEN: openaiToken
  };
  
  return config;
};

const defaultEnv: DefaultEnv = getEnvConfig();

function validateEnvKey(key: string): boolean {
  return /^[A-Z_][A-Z0-9_]*$/.test(key);
}

function sanitizeEnvValue(value: string): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

/**
 * Set test environment using consolidated environment manager
 */
export function setTestEnv(): boolean {
  logStart('setTestEnv', 'default values');
  
  return withErrorLogging(() => {
    // Use consolidated environment manager
    try {
      loadEnv(); // Load from .env file
    } catch (error) {
      console.warn('Failed to load .env file:', error);
    }
    
    // Configure with defaults - convert DefaultEnv to Record<string, string>
    const defaultsAsRecord: Record<string, string> = {};
    Object.entries(defaultEnv).forEach(([key, value]) => {
      defaultsAsRecord[key] = value || '';
    });
    configureEnv(defaultsAsRecord, {});
    
    logReturn('setTestEnv', true);
    return true;
  }, 'setTestEnv');
}

/**
 * Save environment using consolidated environment manager
 */
export function saveEnv(): Record<string, string | undefined> {
  logStart('saveEnv');
  
  return withErrorLogging(() => {
    const savedEnv = backupEnvVars();
    logReturn('saveEnv', `${Object.keys(savedEnv).length} env vars`);
    return savedEnv;
  }, 'saveEnv');
}

/**
 * Restore environment using consolidated environment manager
 */
export function restoreEnv(savedEnv: Record<string, string | undefined>): boolean {
  logStart('restoreEnv', savedEnv);

  return withErrorLogging(() => {
    if (!savedEnv || typeof savedEnv !== 'object') {
      console.log(`restoreEnv: invalid saved environment`);
      return false;
    }

    restoreEnvVars(savedEnv);
    logReturn('restoreEnv', true);
    return true;
  }, 'restoreEnv');
}

// Re-export consolidated environment manager functions for direct use
export {
  backupEnvVars,
  restoreEnvVars,
  withSavedEnv,
  loadEnv,
  configureEnv
};

export { defaultEnv };