/**
 * Secure Path Validation Utility
 * 
 * Provides centralized, robust path validation to prevent directory traversal
 * and other path-based security vulnerabilities. Replaces scattered validation
 * logic throughout the codebase.
 */

import * as path from 'path';
import * as fs from 'fs';
import { createRequire } from 'module';
import { validateArray } from '../../utils/helpers/validation.js';

export interface PathValidationOptions {
  allowedExtensions?: string[];
  mustExist?: boolean;
  allowRelative?: boolean;
  checkSymlinks?: boolean;
}

/**
 * Validates a path against security constraints and business rules
 * @param inputPath - Path to validate
 * @param allowedBase - Base directory that path must be within
 * @param options - Additional validation options
 * @returns Sanitized absolute path if valid, throws error if invalid
 */
export const validateSecurePath = (
  inputPath: string,
  allowedBase: string = process.cwd(),
  options: PathValidationOptions = {}
): string => {
  if (typeof inputPath !== 'string' || !inputPath.trim()) {
    throw new Error('Invalid path: path must be a non-empty string');
  }

  // Prevent null byte injection attacks
  if (inputPath.includes('\0')) {
    throw new Error('Security error: null bytes not allowed in paths');
  }

  const normalizedInput = path.normalize(inputPath.trim());
  const allowRelative = options.allowRelative !== false;
  if (!allowRelative && !path.isAbsolute(normalizedInput)) {
    throw new Error('Invalid path: relative paths are not allowed');
  }

  let absolutePath: string;
  try {
    const absoluteBase = path.resolve(path.normalize(allowedBase));
    absolutePath = path.isAbsolute(normalizedInput)
      ? path.resolve(normalizedInput)
      : path.resolve(absoluteBase, normalizedInput);
  } catch (error) {
    throw new Error(`Path resolution failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  const normalizedBase = path.normalize(allowedBase);
  const absoluteBase = path.resolve(normalizedBase);
  const relativePath = path.relative(absoluteBase, absolutePath);
  
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error('Path security violation: path is outside allowed directory');
  }

  if (options.mustExist) {
    try {
      const stats = fs.statSync(absolutePath);
      
      if (options.checkSymlinks && stats.isSymbolicLink()) {
        throw new Error('Security violation: symbolic links are not allowed');
      }
    } catch (error) {
      throw new Error(`Path does not exist or is inaccessible: ${absolutePath}`);
    }
  }

  if (options.allowedExtensions && options.allowedExtensions.length > 0) {
    const extension = path.extname(absolutePath);
    if (!options.allowedExtensions.includes(extension)) {
      throw new Error(`File extension not allowed: ${extension}`);
    }
  }

  return absolutePath;
};

/**
 * Validates multiple paths using the same criteria
 * @param paths - Array of paths to validate
 * @param allowedBase - Base directory that all paths must be within
 * @param options - Additional validation options
 * @returns Array of validated absolute paths
 */
export const validateSecurePaths = (
  paths: string[],
  allowedBase: string = process.cwd(),
  options: PathValidationOptions = {}
): string[] => {
  validateArray(paths, 'paths');

  return paths.map(path => validateSecurePath(path, allowedBase, options));
};

export const createPathValidator = (
  allowedBase: string,
  options: PathValidationOptions = {}
) => (path: string, overrideOptions: PathValidationOptions = {}) => 
    validateSecurePath(path, allowedBase, { ...options, ...overrideOptions });

// Common validation configurations
const STUBS_BASE = (() => {
  try {
    const require = createRequire(path.resolve(process.cwd(), 'package.json'));
    const entryPath = require.resolve('@bijikyu/qtests');
    const packageRoot = path.resolve(path.dirname(entryPath), '..');
    const candidates = [
      path.join(packageRoot, 'dist', 'stubs'),
      path.join(packageRoot, 'stubs')
    ];
    for (const candidate of candidates) {
      try {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) return candidate;
      } catch {
        /* ignore */
      }
    }
    return path.resolve(process.cwd(), 'stubs');
  } catch {
    return path.resolve(process.cwd(), 'stubs');
  }
})();
export const VALIDATORS = {
  stubFile: createPathValidator(STUBS_BASE, {
    allowedExtensions: ['.js', '.ts', '.mjs', '.cjs'],
    mustExist: true,
    checkSymlinks: true
  }),
  
  mockFile: createPathValidator(path.resolve(process.cwd(), '__mocks__'), {
    allowedExtensions: ['.js', '.ts'],
    mustExist: true,
    checkSymlinks: false
  }),
  
  configFile: createPathValidator(process.cwd(), {
    allowedExtensions: ['.js', '.ts', '.mjs', '.json'],
    mustExist: false,
    checkSymlinks: false
  }),
  
  testData: createPathValidator(path.resolve(process.cwd(), 'tests'), {
    allowedExtensions: ['.js', '.ts', '.mjs'],
    mustExist: false,
    checkSymlinks: false
  })
};
