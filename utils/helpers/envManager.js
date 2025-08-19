/**
 * Environment Variable Management Utility
 * 
 * This module focuses solely on environment variable backup, restoration, and management
 * for testing scenarios. It provides selective and complete environment variable control.
 */

/**
 * Backup environment variables (selective or complete)
 * 
 * @param {...string} varNames - Specific variable names to backup (if provided)
 * @returns {Object} Backup object containing environment variable state
 */
function backupEnvVars(...varNames) {
  console.log(`backupEnvVars is running with ${varNames.length} variables`);
  
  try {
    let backup = {};
    
    if (varNames.length > 0) {
      // Selective backup - only specified variables
      varNames.forEach(varName => {
        backup[varName] = process.env[varName];
      });
    } else {
      // Complete backup - all environment variables
      backup = { ...process.env };
    }
    
    console.log(`backupEnvVars is returning backup with ${Object.keys(backup).length} variables`);
    return backup;
  } catch (error) {
    console.log(`backupEnvVars error ${error.message}`);
    throw error;
  }
}

/**
 * Restore environment variables from backup
 * 
 * @param {Object} backup - Backup object from backupEnvVars
 */
function restoreEnvVars(backup) {
  console.log(`restoreEnvVars is running with ${backup ? 'backup' : 'null'}`);
  
  try {
    if (!backup || typeof backup !== 'object') {
      console.log(`restoreEnvVars skipping invalid backup`);
      return;
    }
    
    const backupKeys = Object.keys(backup);
    const isSelectiveRestore = backupKeys.length < 50; // Heuristic for selective vs complete
    
    if (isSelectiveRestore) {
      // Selective restoration - only restore specified variables
      backupKeys.forEach(key => {
        if (backup[key] === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = backup[key];
        }
      });
    } else {
      // Complete restoration - remove added variables and restore all
      const currentKeys = Object.keys(process.env);
      const addedKeys = currentKeys.filter(key => !(key in backup));
      
      // Remove variables that weren't in the backup
      addedKeys.forEach(key => {
        delete process.env[key];
      });
      
      // Restore all backed up variables
      Object.entries(backup).forEach(([key, value]) => {
        if (value === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = value;
        }
      });
    }
    
    console.log(`restoreEnvVars completed restoration`);
  } catch (error) {
    console.log(`restoreEnvVars error ${error.message}`);
    throw error;
  }
}

/**
 * Execute a function with saved environment that is automatically restored
 * 
 * @param {Function} fn - Function to execute with saved environment
 * @returns {any} Result of the function execution
 */
function withSavedEnv(fn) {
  console.log(`withSavedEnv is running with function`);
  
  try {
    const backup = backupEnvVars();
    
    try {
      const result = fn();
      console.log(`withSavedEnv is returning result`);
      return result;
    } finally {
      restoreEnvVars(backup);
    }
  } catch (error) {
    console.log(`withSavedEnv error ${error.message}`);
    throw error;
  }
}

module.exports = {
  backupEnvVars,
  restoreEnvVars,
  withSavedEnv
};