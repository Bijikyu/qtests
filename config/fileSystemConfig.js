/**
 * File System Configuration
 * 
 * This module provides configuration for file system paths
 * and directory structure used throughout the qtests module.
 */

// ==================== FILE SYSTEM PATHS ====================
export const libDirectory = './lib';
export const utilsDirectory = './utils';
export const configDirectory = './config';
export const testsDirectory = './tests';
export const stubsDirectory = './stubs';
export const distDirectory = './dist';
export const buildDirectory = './build';

// ==================== FILE VALIDATION CONSTANTS ====================
export const maxInputLength = 1000;
export const maxFilePathLength = 255;
export const allowedFileExtensions = ['.js', '.ts', '.mjs', '.cjs'];
export const blockedPatterns = [
  /node_modules/,
  /\.git/,
  /coverage/,
  /dist/,
  /build/
];