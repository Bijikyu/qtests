import { logStart, logReturn, setLogging } from '../../lib/logUtils.js';
import { withErrorLogging } from '../../lib/errorHandling/index.js';
import { nodeEnv } from '../../config/localVars.js';

// Set logging based on environment using localVars pattern
if (nodeEnv !== 'test') {
  setLogging(false);
}

import dotenv from 'dotenv';

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

export function setTestEnv(): boolean {
  logStart('setTestEnv', 'default values');
  
  return withErrorLogging(() => {
    // Use dotenv directly instead of wrapper
    const result = dotenv.config();
    if (result.error) {
      console.warn('dotenv config error:', result.error);
    }
    
    const sanitizedEnv: Record<string, string> = {};
    for (const [key, value] of Object.entries(defaultEnv)) {
      if (validateEnvKey(key)) {
        const sanitizedValue = sanitizeEnvValue(value);
        if (sanitizedValue) {
          sanitizedEnv[key] = sanitizedValue;
        }
      }
    }
    
    Object.assign(process.env, sanitizedEnv);
    logReturn('setTestEnv', true);
    return true;
  }, 'setTestEnv');
}

export function saveEnv(): Record<string, string | undefined> {
  logStart('saveEnv');
  
  return withErrorLogging(() => {
    const savedEnv = { ...process.env };
    logReturn('saveEnv', `${Object.keys(savedEnv).length} env vars`);
    return savedEnv;
  }, 'saveEnv');
}

export function restoreEnv(savedEnv: Record<string, string | undefined>): boolean {
  logStart('restoreEnv', savedEnv);

  return withErrorLogging(() => {
    if (!savedEnv || typeof savedEnv !== 'object') {
      console.log(`restoreEnv: invalid saved environment`);
      return false;
    }

    const currentKeys = new Set(Object.keys(process.env));
    const backupKeys = new Set(Object.keys(savedEnv));

    currentKeys.forEach(key => {
      if (!backupKeys.has(key)) delete process.env[key];
    });

    for (const [key, value] of Object.entries(savedEnv)) {
      if (value !== undefined) process.env[key] = value; else delete process.env[key];
    }

    logReturn('restoreEnv', true);
    return true;
  }, 'restoreEnv');
}

export { defaultEnv };