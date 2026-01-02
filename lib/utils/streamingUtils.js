/**
 * Streaming File Utilities
 * Provides memory-efficient file operations using streams for large files
 */

const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');
const { Transform, Readable } = require('stream');
const qerrors = require('../qerrorsFallback.js');

/**
 * Stream configuration options
 */
// export interface StreamOptions {
//   highWaterMark?: number;
//   encoding?: BufferEncoding;
//   autoClose?: boolean;
//   emitClose?: boolean;
//   start?: number;
//   end?: number;
// }

/**
 * Check if file should use streaming based on size
 * @param filePath - Path to the file
 * @param threshold - Size threshold in bytes (default: 10MB)
 * @returns Promise that resolves to true if should stream
 */
async function shouldUseStreaming(filePath, threshold = 10 * 1024 * 1024) {
  try {
    const stats = await fs.promises.stat(filePath);
    return stats.size > threshold;
  } catch (error) {
    qerrors(error, 'streamingUtils.shouldUseStreaming: stat failed', {
      filePath,
      threshold,
      operation: 'stat'
    });
    return false;
  }
}

/**
 * Get file size safely
 * @param filePath - Path to the file
 * @returns Promise that resolves to file size in bytes
 */
async function getFileSize(filePath) {
  try {
    const stats = await fs.promises.stat(filePath);
    return stats.size;
  } catch (error) {
    qerrors(error, 'streamingUtils.getFileSize: stat failed', {
      filePath,
      operation: 'stat'
    });
    throw error;
  }
}

module.exports = {
  shouldUseStreaming,
  getFileSize
};