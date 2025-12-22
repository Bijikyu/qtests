import { logStart, logReturn, setLogging } from '../../lib/logUtils.js';
import { withErrorLogging } from '../../lib/errorHandling/index.js';
import { nodeEnv } from '../../config/localVars.js';

// Set logging based on environment using localVars pattern
if (nodeEnv !== 'test') {
  setLogging(false);
}
import * as dotenv from 'dotenv';

interface DefaultEnv {
  GOOGLE_API_KEY: string;
  GOOGLE_CX: string;
  OPENAI_TOKEN: string;
}

const defaultEnv: DefaultEnv = {
  GOOGLE_API_KEY: 'key',
  GOOGLE_CX: 'cx',
  OPENAI_TOKEN: 'token'
};

export function setTestEnv(): boolean {
  logStart('setTestEnv', 'default values');
  
  return withErrorLogging(() => {
    dotenv.config();
    Object.assign(process.env, defaultEnv);
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