// Re-export from focused modules for backward compatibility
export {
  backupEnvVars,
  type EnvBackup
} from './envBackup.js';

export {
  restoreEnvVars
} from './envRestore.js';

export {
  withSavedEnv
} from './envWrapper.js';