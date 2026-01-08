/**
 * File System Configuration
 * 
 * This module defines file system paths, limits, and patterns used throughout
 * the qtests framework for file operations, test discovery, and build processes.
 */

// Directory paths relative to project root
export const libDirectory = './lib';
export const utilsDirectory = './utils';
export const configDirectory = './config';
export const testsDirectory = './tests';
export const stubsDirectory = './stubs';
export const distDirectory = './dist';
export const buildDirectory = './build';

// File size and path limits
export const maxInputLength = 1000; // Maximum input string length in characters
export const maxFilePathLength = 255; // Maximum file path length in characters

// Allowed file extensions for processing
export const allowedFileExtensions = [
    '.js',    // JavaScript files
    '.ts',    // TypeScript files
    '.mjs',   // ES Module JavaScript files
    '.cjs'    // CommonJS JavaScript files
];

// Patterns to exclude from file processing and test discovery
export const blockedPatterns = [
    /node_modules/,  // Node.js dependencies directory
    /\.git/,         // Git version control directory
    /coverage/,      // Test coverage reports directory
    /dist/,          // Distribution/build output directory
    /build/          // Build output directory
];