/**
 * Shared Script Utilities
 * Consolidates common utility functions used across various scripts
 * Provides safe file operations and project management helpers
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import qerrors from 'qerrors';

/**
 * Get the current directory (ESM compatible)
 */
export function getCurrentDir(importMetaUrl) {
  const __filename = fileURLToPath(importMetaUrl);
  return path.dirname(__filename);
}

/**
 * Get the current working directory
 */
export function getCwd() {
  return process.cwd();
}

/**
 * Safely remove a directory and all its contents
 * @param dirPath - Directory path to remove
 * @param options - Removal options
 */
export function rmDirSafe(dirPath, options = { recursive: true, force: true }) {
  try {
    fs.rmSync(dirPath, options);
  } catch (error) {
    qerrors(error, 'sharedUtils.rmDirSafe: directory removal failed', {
      dirPath,
      options,
      operation: 'rmSync'
    });
    // Silent failure for expected scenarios
    console.debug(`Failed to remove directory ${dirPath}: ${error.message}`);
  }
}

/**
 * Safely remove a file
 * @param filePath - File path to remove
 * @param options - Removal options
 */
export function rmFileSafe(filePath, options = { force: true }) {
  try {
    fs.rmSync(filePath, options);
  } catch (error) {
    qerrors(error, 'sharedUtils.rmFileSafe: file removal failed', {
      filePath,
      options,
      operation: 'rmSync'
    });
    // Silent failure for expected scenarios
    console.debug(`Failed to remove file ${filePath}: ${error.message}`);
  }
}

/**
 * Safely check if a path exists
 * @param filePath - Path to check
 * @returns true if exists, false otherwise
 */
export function pathExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Safely read file contents
 * @param filePath - Path to read
 * @param encoding - File encoding (default: utf8)
 * @returns File contents as string, or null if failed
 */
export function readFileSafe(filePath, encoding = 'utf8') {
  try {
    return fs.readFileSync(filePath, encoding);
  } catch (error) {
    qerrors(error, 'sharedUtils.readFileSafe: file read failed', {
      filePath,
      encoding,
      operation: 'readFileSync'
    });
    console.debug(`Failed to read file ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Safely write file contents with directory creation
 * @param filePath - Path to write
 * @param content - Content to write
 * @param encoding - File encoding (default: utf8)
 * @returns true if successful, false otherwise
 */
export function writeFileSafe(filePath, content, encoding = 'utf8') {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!pathExists(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (mkdirError) {
        qerrors(mkdirError, 'sharedUtils.ensureDirectory: directory creation failed', {
          dir,
          filePath,
          operation: 'mkdirSync'
        });
        console.debug(`Failed to create directory ${dir}: ${mkdirError.message}`);
        return false;
      }
    }
    
    try {
      fs.writeFileSync(filePath, content, encoding);
      return true;
    } catch (writeError) {
      qerrors(writeError, 'sharedUtils.ensureDirectory: file write failed', {
        filePath,
        encoding,
        contentLength: content.length,
        operation: 'writeFileSync'
      });
      console.debug(`Failed to write file ${filePath}: ${writeError.message}`);
      return false;
    }
  } catch (error) {
    qerrors(error, 'sharedUtils.ensureDirectory: unexpected error', {
      filePath,
      encoding
    });
    console.debug(`Failed to write file ${filePath}: ${error.message}`);
    return false;
  }
}

/**
 * Clean distribution directory of test files and mocks
 * @param root - Root directory path
 */
export function cleanDist(root = process.cwd()) {
  const dist = path.join(root, 'dist');
  
  // Check if dist directory exists
  if (!pathExists(dist)) {
    return;
  }

  const stack = [dist];
  
  while (stack.length) {
    const dir = stack.pop();
    let entries = [];
    
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (error) {
      qerrors(error, 'sharedUtils.cleanDist: directory read failed', {
        dir,
        operation: 'readdirSync'
      });
      console.debug(`Failed to read directory ${dir}: ${error.message}`);
      continue;
    }
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Remove __mocks__ directories
        if (entry.name === '__mocks__') {
          rmDirSafe(fullPath);
          continue;
        }
        
        // Process subdirectories - prevent infinite loops with depth tracking
        if (stack.length >= 20) { // Reasonable depth limit
          console.warn(`Directory traversal depth exceeded for ${fullPath}, skipping...`);
          continue;
        }
        stack.push(fullPath);
        continue;
      }
      
      if (!entry.isFile()) {
        continue;
      }
      
      // Remove test and generated test files
      if (/\.(test|spec)\.[cm]?jsx?$/.test(entry.name) || /GeneratedTest/.test(entry.name)) {
        rmFileSafe(fullPath);
      }
    }
  }
}

/**
 * Clean debug files
 * @param root - Root directory path
 * @param debugFileName - Name of debug file to remove (default: DEBUG_TESTS.md)
 */
export function cleanDebug(root = process.cwd(), debugFileName = 'DEBUG_TESTS.md') {
  const debugFilePath = path.join(root, debugFileName);
  rmFileSafe(debugFilePath);
}

/**
 * Validate file content against expected patterns
 * @param content - File content to validate
 * @param patterns - Array of regex patterns that must match
 * @returns true if all patterns match, false otherwise
 */
export function validateContent(content, patterns) {
  try {
    return patterns.every(pattern => pattern.test(content));
  } catch {
    return false;
  }
}

/**
 * Find first valid template from candidate paths
 * @param candidates - Array of candidate file paths
 * @param validator - Function to validate file content
 * @returns Valid template content or null if not found
 */
export function findValidTemplate(candidates, validator) {
  for (const candidatePath of candidates) {
    try {
      if (pathExists(candidatePath)) {
        const content = readFileSafe(candidatePath);
        if (content && validator(content)) {
          return content;
        }
      }
    } catch (error) {
      console.debug(`Failed to check template ${candidatePath}: ${error.message}`);
    }
  }
  
  return null;
}

/**
 * Ensure runner file exists by copying from template
 * @param root - Root directory path
 * @param runnerFileName - Name of runner file to ensure (default: qtests-runner.mjs)
 */
export function ensureRunner(root = process.cwd(), runnerFileName = 'qtests-runner.mjs') {
  const targetPath = path.join(root, runnerFileName);
  
  // Skip if runner already exists
  if (pathExists(targetPath)) {
    return;
  }

  // Define candidate template paths in order of preference
  const candidates = [
    path.join(root, 'lib', 'templates', 'qtests-runner.mjs.template'),
    path.join(root, 'templates', 'qtests-runner.mjs.template'),
    path.join(root, 'node_modules', 'qtests', 'lib', 'templates', 'qtests-runner.mjs.template'),
    path.join(root, 'node_modules', 'qtests', 'templates', 'qtests-runner.mjs.template'),
  ];

  // Validate template content for essential features
  const validator = (content) => validateContent(content, [/runCLI/, /API Mode/]);
  
  // Find and copy valid template
  const templateContent = findValidTemplate(candidates, validator);
  
  if (templateContent) {
    writeFileSafe(targetPath, templateContent);
  }
}

/**
 * Get package.json content
 * @param root - Root directory path
 * @returns Package.json content as object, or null if failed
 */
export function getPackageJson(root = process.cwd()) {
  const packagePath = path.join(root, 'package.json');
  const content = readFileSafe(packagePath);
  
  if (content) {
    try {
      return JSON.parse(content);
    } catch (error) {
      console.debug(`Failed to parse package.json: ${error.message}`);
    }
  }
  
  return null;
}

/**
 * Check if command exists in PATH
 * @param command - Command name to check
 * @returns true if command exists, false otherwise
 */
export function commandExists(command) {
  try {
    // Simple check by trying to run the command
    const { spawnSync } = require('child_process');
    const result = spawnSync(command, ['--version'], { stdio: 'ignore' });
    return result.status === 0;
  } catch {
    return false;
  }
}

/**
 * Execute command and return result
 * @param command - Command to execute
 * @param args - Command arguments
 * @param options - Execution options
 * @returns Execution result object
 */
export function executeCommand(command, args = [], options = {}) {
  try {
    const { spawnSync } = require('child_process');
    
    // Validate command against allowlist to prevent command injection
    const allowedCommands = ['npm', 'node', 'jest', 'git', 'tsc', 'rm', 'mkdir', 'cp', 'mv'];
    if (!allowedCommands.includes(command)) {
      throw new Error(`Command not allowed: ${command}`);
    }
    
    // Validate arguments to prevent injection
    const sanitizedArgs = args.map(arg => {
      if (typeof arg !== 'string') return arg;
      // Remove dangerous characters and patterns
      return arg.replace(/[;&|`$(){}[\]]/g, '');
    });
    
    const result = spawnSync(command, sanitizedArgs, {
      stdio: 'pipe',
      encoding: 'utf8',
      shell: false, // CRITICAL: Remove shell to prevent command injection
      ...options
    });
    
    return {
      success: result.status === 0,
      status: result.status,
      stdout: result.stdout,
      stderr: result.stderr,
    };
  } catch (error) {
    return {
      success: false,
      status: -1,
      stdout: '',
      stderr: error.message,
    };
  }
}

/**
 * Create directory structure if it doesn't exist
 * @param dirPath - Directory path to create
 * @returns true if directory exists or was created, false otherwise
 */
export function ensureDirectory(dirPath) {
  try {
    if (!pathExists(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch (error) {
    console.debug(`Failed to ensure directory ${dirPath}: ${error.message}`);
    return false;
  }
}

/**
 * List files in directory matching pattern
 * @param dirPath - Directory to search
 * @param pattern - Regex pattern to match filenames
 * @param recursive - Whether to search recursively (default: false)
 * @returns Array of matching file paths
 */
export function listFiles(dirPath, pattern, recursive = false) {
  const results = [];
  
  if (!pathExists(dirPath)) {
    return results;
  }

  const stack = [dirPath];
  
  while (stack.length) {
    const currentDir = stack.pop();
    let entries = [];
    
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch (error) {
      qerrors(error, 'sharedUtils.listFiles: directory read failed', {
        currentDir,
        pattern: pattern.toString(),
        recursive,
        operation: 'readdirSync'
      });
      console.debug(`Failed to read directory ${currentDir}: ${error.message}`);
      continue;
    }
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && recursive) {
        stack.push(fullPath);
      } else if (entry.isFile() && pattern.test(entry.name)) {
        results.push(fullPath);
      }
    }
  }
  
  return results;
}

// Export utilities as object for easy importing
export const sharedUtils = {
  getCurrentDir,
  getCwd,
  rmDirSafe,
  rmFileSafe,
  pathExists,
  readFileSafe,
  writeFileSafe,
  cleanDist,
  cleanDebug,
  validateContent,
  findValidTemplate,
  ensureRunner,
  getPackageJson,
  commandExists,
  executeCommand,
  ensureDirectory,
  listFiles,
};

// Export default for convenience
export default sharedUtils;