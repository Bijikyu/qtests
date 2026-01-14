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
 * Safely remove a directory and all its contents (async version)
 * @param dirPath - Directory path to remove
 * @param options - Removal options
 */
export async function rmDirSafeAsync(dirPath, options = { recursive: true, force: true }) {
  try {
    await fs.promises.rm(dirPath, options);
  } catch (error) {
    qerrors(error, 'sharedUtils.rmDirSafeAsync: directory removal failed', {
      dirPath,
      options,
      operation: 'rm'
    });
    // Silent failure for expected scenarios
    console.debug(`Failed to remove directory ${dirPath}: ${error.message}`);
  }
}

/**
 * Safely remove a directory and all its contents (sync version - DEPRECATED: use async version)
 * @param dirPath - Directory path to remove
 * @param options - Removal options
 * @deprecated Use rmDirSafeAsync for better scalability
 */
export function rmDirSafe(dirPath, options = { recursive: true, force: true }) {
  console.warn('rmDirSafe is deprecated - use rmDirSafeAsync for better scalability');
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
 * Safely remove a file (async version)
 * @param filePath - File path to remove
 * @param options - Removal options
 */
export async function rmFileSafeAsync(filePath, options = { force: true }) {
  try {
    await fs.promises.rm(filePath, options);
  } catch (error) {
    qerrors(error, 'sharedUtils.rmFileSafeAsync: file removal failed', {
      filePath,
      options,
      operation: 'rm'
    });
    // Silent failure for expected scenarios
    console.debug(`Failed to remove file ${filePath}: ${error.message}`);
  }
}

/**
 * Safely remove a file (sync version - DEPRECATED: use async version)
 * @param filePath - File path to remove
 * @param options - Removal options
 * @deprecated Use rmFileSafeAsync for better scalability
 */
export function rmFileSafe(filePath, options = { force: true }) {
  console.warn('rmFileSafe is deprecated - use rmFileSafeAsync for better scalability');
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
 * Safely check if path exists (async version)
 * @param filePath - Path to check
 * @returns true if path exists, false otherwise
 */
export async function pathExistsAsync(filePath) {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely check if path exists (sync version - use only in initialization)
 * @param filePath - Path to check
 * @returns true if path exists, false otherwise
 */
export function pathExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Safely read file contents (async version)
 * @param filePath - Path to read
 * @param encoding - File encoding (default: utf8)
 * @returns File contents as string, or null if failed
 */
export async function readFileSafeAsync(filePath, encoding = 'utf8') {
  try {
    return await fs.promises.readFile(filePath, encoding);
  } catch (error) {
    qerrors(error, 'sharedUtils.readFileSafeAsync: file read failed', {
      filePath,
      encoding,
      operation: 'readFile'
    });
    console.debug(`Failed to read file ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Safely read file contents (sync version - use only in initialization)
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
 * Safely write file contents with directory creation (async version)
 * @param filePath - Path to write
 * @param content - Content to write
 * @param encoding - File encoding (default: utf8)
 * @returns true if successful, false otherwise
 */
export async function writeFileSafeAsync(filePath, content, encoding = 'utf8') {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!await pathExistsAsync(dir)) {
      try {
        await fs.promises.mkdir(dir, { recursive: true });
      } catch (mkdirError) {
        qerrors(mkdirError, 'sharedUtils.ensureDirectory: directory creation failed', {
          dir,
          filePath,
          operation: 'mkdir'
        });
        console.debug(`Failed to create directory ${dir}: ${mkdirError.message}`);
        return false;
      }
    }
    
    try {
      await fs.promises.writeFile(filePath, content, encoding);
      return true;
    } catch (writeError) {
      qerrors(writeError, 'sharedUtils.ensureDirectory: file write failed', {
        filePath,
        encoding,
        contentLength: content.length,
        operation: 'writeFile'
      });
      console.debug(`Failed to write file ${filePath}: ${writeError.message}`);
      return false;
    }
  } catch (error) {
    qerrors(error, 'sharedUtils.writeFileSafeAsync: unexpected error', {
      filePath,
      encoding,
      contentLength: content.length,
      operation: 'writeFile'
    });
    console.debug(`Unexpected error writing file ${filePath}: ${error.message}`);
    return false;
  }
}

/**
 * Safely write file contents with directory creation (sync version - use only in initialization)
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
 * Clean distribution directory of test files and mocks (async version)
 * @param root - Root directory path
 */
export async function cleanDistAsync(root = process.cwd()) {
  const dist = path.join(root, 'dist');
  
  // Check if dist directory exists
  if (!await pathExistsAsync(dist)) {
    return;
  }

  const stack = [dist];
  
  while (stack.length) {
    const dir = stack.pop();
    let entries = [];
    
    try {
      entries = await fs.promises.readdir(dir, { withFileTypes: true });
    } catch (error) {
      qerrors(error, 'sharedUtils.cleanDistAsync: directory read failed', {
        dir,
        operation: 'readdir'
      });
      console.debug(`Failed to read directory ${dir}: ${error.message}`);
      continue;
    }
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Remove __mocks__ directories
        if (entry.name === '__mocks__') {
          await rmDirSafeAsync(fullPath);
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
        await rmFileSafeAsync(fullPath);
      }
    }
  }
}

/**
 * Clean distribution directory of test files and mocks (sync version - DEPRECATED: use async version)
 * @param root - Root directory path
 * @deprecated Use cleanDistAsync for better scalability
 */
export function cleanDist(root = process.cwd()) {
  console.warn('cleanDist is deprecated - use cleanDistAsync for better scalability');
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
 * Clean debug files (async version)
 * @param root - Root directory path
 * @param debugFileName - Name of debug file to remove (default: DEBUG_TESTS.md)
 */
export async function cleanDebugAsync(root = process.cwd(), debugFileName = 'DEBUG_TESTS.md') {
  const debugFilePath = path.join(root, debugFileName);
  await rmFileSafeAsync(debugFilePath);
}

/**
 * Clean debug files (sync version - DEPRECATED: use async version)
 * @param root - Root directory path
 * @param debugFileName - Name of debug file to remove (default: DEBUG_TESTS.md)
 * @deprecated Use cleanDebugAsync for better scalability
 */
export function cleanDebug(root = process.cwd(), debugFileName = 'DEBUG_TESTS.md') {
  console.warn('cleanDebug is deprecated - use cleanDebugAsync for better scalability');
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
 * Find first valid template from candidate paths (async version)
 * @param candidates - Array of candidate file paths
 * @param validator - Function to validate file content
 * @returns Valid template content or null if not found
 */
export async function findValidTemplateAsync(candidates, validator) {
  for (const candidatePath of candidates) {
    try {
      if (await pathExistsAsync(candidatePath)) {
        const content = await readFileSafeAsync(candidatePath);
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
 * Find first valid template from candidate paths (sync version - DEPRECATED: use async version)
 * @param candidates - Array of candidate file paths
 * @param validator - Function to validate file content
 * @returns Valid template content or null if not found
 * @deprecated Use findValidTemplateAsync for better scalability
 */
export function findValidTemplate(candidates, validator) {
  console.warn('findValidTemplate is deprecated - use findValidTemplateAsync for better scalability');
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
 * Ensure runner file exists by copying from template (async version)
 * @param root - Root directory path
 * @param runnerFileName - Name of runner file to ensure (default: qtests-runner.mjs)
 */
export async function ensureRunnerAsync(root = process.cwd(), runnerFileName = 'qtests-runner.mjs') {
  const targetPath = path.join(root, runnerFileName);
  
  // Skip if runner already exists
  if (await pathExistsAsync(targetPath)) {
    return;
  }

  // Define candidate template paths in order of preference
  const candidates = [
    path.join(root, 'lib', 'templates', 'qtests-runner.mjs.template'),
    path.join(root, 'templates', 'qtests-runner.mjs.template'),
    path.join(root, 'node_modules', '@bijikyu/qtests', 'lib', 'templates', 'qtests-runner.mjs.template'),
    path.join(root, 'node_modules', '@bijikyu/qtests', 'templates', 'qtests-runner.mjs.template'),
  ];

  // Validate template content for essential features
  const validator = (content) => validateContent(content, [/runCLI/, /API Mode/]);
  
  // Find and copy valid template
  const templateContent = await findValidTemplateAsync(candidates, validator);
  
  if (templateContent) {
    await writeFileSafeAsync(targetPath, templateContent);
  }
}

/**
 * Ensure runner file exists by copying from template (sync version - DEPRECATED: use async version)
 * @param root - Root directory path
 * @param runnerFileName - Name of runner file to ensure (default: qtests-runner.mjs)
 * @deprecated Use ensureRunnerAsync for better scalability
 */
export function ensureRunner(root = process.cwd(), runnerFileName = 'qtests-runner.mjs') {
  console.warn('ensureRunner is deprecated - use ensureRunnerAsync for better scalability');
  const targetPath = path.join(root, runnerFileName);
  
  // Skip if runner already exists
  if (pathExists(targetPath)) {
    return;
  }

  // Define candidate template paths in order of preference
  const candidates = [
    path.join(root, 'lib', 'templates', 'qtests-runner.mjs.template'),
    path.join(root, 'templates', 'qtests-runner.mjs.template'),
    path.join(root, 'node_modules', '@bijikyu/qtests', 'lib', 'templates', 'qtests-runner.mjs.template'),
    path.join(root, 'node_modules', '@bijikyu/qtests', 'templates', 'qtests-runner.mjs.template'),
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
 * Get package.json content (async version)
 * @param root - Root directory path
 * @returns Package.json content as object, or null if failed
 */
export async function getPackageJsonAsync(root = process.cwd()) {
  const packagePath = path.join(root, 'package.json');
  const content = await readFileSafeAsync(packagePath);
  
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
 * Get package.json content (sync version - DEPRECATED: use async version)
 * @param root - Root directory path
 * @returns Package.json content as object, or null if failed
 * @deprecated Use getPackageJsonAsync for better scalability
 */
export function getPackageJson(root = process.cwd()) {
  console.warn('getPackageJson is deprecated - use getPackageJsonAsync for better scalability');
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
    
    // Enhanced command validation with detailed configurations
    const allowedCommands = new Map([
      ['npm', { maxArgs: 10, allowedFlags: ['--version', '--help', 'install', 'run', 'test', 'start'], allowedPrefixes: ['--'] }],
      ['node', { maxArgs: 5, allowedFlags: ['--version', '--help'], allowedPrefixes: ['--'] }],
      ['jest', { maxArgs: 8, allowedFlags: ['--version', '--help', '--config', '--runInBand', '--passWithNoTests'], allowedPrefixes: ['--'] }],
      ['git', { maxArgs: 6, allowedFlags: ['--version', '--help', 'status', 'log', 'add', 'commit', 'push'], allowedPrefixes: ['--', '-'] }],
      ['tsc', { maxArgs: 3, allowedFlags: ['--version', '--help', '--build'], allowedPrefixes: ['--'] }],
      ['rm', { maxArgs: 2, allowedFlags: ['-r', '-f'], allowedPrefixes: ['-'] }],
      ['mkdir', { maxArgs: 2, allowedFlags: ['-p'], allowedPrefixes: ['-'] }],
      ['cp', { maxArgs: 3, allowedFlags: ['-r', '-f'], allowedPrefixes: ['-'] }],
      ['mv', { maxArgs: 2, allowedFlags: ['-f'], allowedPrefixes: ['-'] }]
    ]);
    
    if (!allowedCommands.has(command)) {
      throw new Error(`Command not allowed: ${command}`);
    }
    
    const commandConfig = allowedCommands.get(command);
    
    // Enhanced argument validation
    const sanitizedArgs = args.map((arg, index) => {
      if (typeof arg !== 'string') {
        throw new Error(`Argument ${index} must be a string, got ${typeof arg}`);
      }
      
      // Check argument count limit
      if (index >= commandConfig.maxArgs) {
        throw new Error(`Too many arguments for command ${command} (max: ${commandConfig.maxArgs})`);
      }
      
      // Validate flag arguments
      if (arg.startsWith('--')) {
        if (!commandConfig.allowedPrefixes.includes('--')) {
          throw new Error(`Double-dash flags not allowed for command ${command}`);
        }
        const flagName = arg.slice(2);
        if (!commandConfig.allowedFlags.includes(flagName) && !commandConfig.allowedFlags.some(f => flagName.startsWith(f + '='))) {
          throw new Error(`Flag not allowed: ${arg}`);
        }
      } else if (arg.startsWith('-')) {
        if (!commandConfig.allowedPrefixes.includes('-')) {
          throw new Error(`Single-dash flags not allowed for command ${command}`);
        }
        const flagName = arg.slice(1);
        if (!commandConfig.allowedFlags.includes(flagName)) {
          throw new Error(`Flag not allowed: ${arg}`);
        }
      } else {
        // For non-flag arguments, perform stricter sanitization
        if (arg.includes(';') || arg.includes('&') || arg.includes('|') || 
            arg.includes('`') || arg.includes('$') || arg.includes('(') || 
            arg.includes(')') || arg.includes('{') || arg.includes('}') || 
            arg.includes('[') || arg.includes(']')) {
          throw new Error(`Dangerous characters detected in argument: ${arg}`);
        }
      }
      
      return arg;
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
 * Create directory structure if it doesn't exist (async version)
 * @param dirPath - Directory path to create
 * @returns true if directory exists or was created, false otherwise
 */
export async function ensureDirectoryAsync(dirPath) {
  try {
    if (!await pathExistsAsync(dirPath)) {
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
    return true;
  } catch (error) {
    console.debug(`Failed to ensure directory ${dirPath}: ${error.message}`);
    return false;
  }
}

/**
 * Create directory structure if it doesn't exist (sync version - DEPRECATED: use async version)
 * @param dirPath - Directory path to create
 * @returns true if directory exists or was created, false otherwise
 * @deprecated Use ensureDirectoryAsync for better scalability
 */
export function ensureDirectory(dirPath) {
  console.warn('ensureDirectory is deprecated - use ensureDirectoryAsync for better scalability');
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
 * List files in directory matching pattern (async version)
 * @param dirPath - Directory to search
 * @param pattern - Regex pattern to match filenames
 * @param recursive - Whether to search recursively (default: false)
 * @returns Array of matching file paths
 */
export async function listFilesAsync(dirPath, pattern, recursive = false) {
  const results = [];
  
  if (!await pathExistsAsync(dirPath)) {
    return results;
  }

  const stack = [dirPath];
  
  while (stack.length) {
    const currentDir = stack.pop();
    let entries = [];
    
    try {
      entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
    } catch (error) {
      qerrors(error, 'sharedUtils.listFilesAsync: directory read failed', {
        currentDir,
        pattern: pattern.toString(),
        recursive,
        operation: 'readdir'
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

/**
 * List files in directory matching pattern (sync version - DEPRECATED: use async version)
 * @param dirPath - Directory to search
 * @param pattern - Regex pattern to match filenames
 * @param recursive - Whether to search recursively (default: false)
 * @returns Array of matching file paths
 * @deprecated Use listFilesAsync for better scalability
 */
export function listFiles(dirPath, pattern, recursive = false) {
  console.warn('listFiles is deprecated - use listFilesAsync for better scalability');
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
  rmDirSafeAsync,
  rmFileSafe,
  rmFileSafeAsync,
  pathExists,
  pathExistsAsync,
  readFileSafe,
  readFileSafeAsync,
  writeFileSafe,
  writeFileSafeAsync,
  cleanDist,
  cleanDistAsync,
  cleanDebug,
  cleanDebugAsync,
  validateContent,
  findValidTemplate,
  findValidTemplateAsync,
  ensureRunner,
  ensureRunnerAsync,
  getPackageJson,
  getPackageJsonAsync,
  commandExists,
  executeCommand,
  ensureDirectory,
  ensureDirectoryAsync,
  listFiles,
  listFilesAsync,
};

// Export default for convenience
export default sharedUtils;