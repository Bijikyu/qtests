/**
 * Shared File System Framework
 * 
 * Provides common file system operations and utilities to reduce
 * duplication across file system modules.
 */

import fs from 'fs-extra';
import { handleError } from './errorHandling.js';
import { measureAsyncTime } from './timingUtils.js';

// File system operation options
export interface FileOperationOptions {
  encoding?: BufferEncoding;
  maxSize?: number;
  overwrite?: boolean;
  createDir?: boolean;
  backup?: boolean;
}

// File operation result interface
export interface FileOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  path?: string;
  operation?: string;
  duration?: number;
}

// File stats interface
export interface FileStats {
  exists: boolean;
  size: number;
  isFile: boolean;
  isDirectory: boolean;
  created?: Date;
  modified?: Date;
  accessed?: Date;
}

/**
 * Base file system operations class
 */
export class FileSystemOperations {
  private static DEFAULT_MAX_SIZE = 100 * 1024 * 1024; // 100MB
  private static DEFAULT_ENCODING = 'utf8';

  /**
   * Safely read file with comprehensive error handling
   */
  static async readFile(
    filePath: string, 
    options: FileOperationOptions = {}
  ): Promise<FileOperationResult<string>> {
    return measureAsyncTime(
      async () => {
        try {
          // Validate input
          if (!filePath || typeof filePath !== 'string') {
            throw new Error('Invalid file path provided');
          }

          // Check file size before reading
          const stats = await fs.stat(filePath);
          const maxSize = options.maxSize || this.DEFAULT_MAX_SIZE;
          
          if (stats.size > maxSize) {
            throw new Error(`File too large: ${stats.size} bytes (max: ${maxSize})`);
          }

          // Read file
          const encoding = options.encoding || this.DEFAULT_ENCODING;
          const buffer = await fs.readFile(filePath);
          const content = buffer.toString(encoding as BufferEncoding);
          
          return {
            success: true,
            data: content,
            path: filePath,
            operation: 'readFile'
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          return {
            success: false,
            error: errorMessage,
            path: filePath,
            operation: 'readFile'
          };
        }
      },
      'fileSystem.readFile'
    ).then(({ result, timing }) => ({
        ...result,
        duration: timing.duration
      }));
  }

  /**
   * Safely write file with directory creation
   */
  static async writeFile(
    filePath: string,
    content: string | Buffer,
    options: FileOperationOptions = {}
  ): Promise<FileOperationResult<void>> {
    return measureAsyncTime(
      async () => {
        try {
          // Validate input
          if (!filePath || typeof filePath !== 'string') {
            throw new Error('Invalid file path provided');
          }

          // Create directory if needed
          if (options.createDir !== false) {
            const dirPath = filePath.substring(0, filePath.lastIndexOf('/') + 1);
            if (dirPath) {
              await fs.ensureDir(dirPath);
            }
          }

          // Backup existing file if needed
          if (options.backup && await fs.pathExists(filePath)) {
            const backupPath = `${filePath}.backup.${Date.now()}`;
            await fs.copy(filePath, backupPath);
          }

          // Write file
          await fs.writeFile(filePath, content);
          
          return {
            success: true,
            path: filePath,
            operation: 'writeFile'
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          return {
            success: false,
            error: errorMessage,
            path: filePath,
            operation: 'writeFile'
          };
        }
      },
      'fileSystem.writeFile'
    ).then(({ result, timing }) => ({
        ...result,
        duration: timing.duration
      }));
  }

  /**
   * Safely append to file
   */
  static async appendFile(
    filePath: string,
    content: string | Buffer,
    options: FileOperationOptions = {}
  ): Promise<FileOperationResult<void>> {
    return measureAsyncTime(
      async () => {
        try {
          // Create directory if needed
          if (options.createDir !== false) {
            const dirPath = filePath.substring(0, filePath.lastIndexOf('/') + 1);
            if (dirPath) {
              await fs.ensureDir(dirPath);
            }
          }

          // Append to file
          await fs.appendFile(filePath, content);
          
          return {
            success: true,
            path: filePath,
            operation: 'appendFile'
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          return {
            success: false,
            error: errorMessage,
            path: filePath,
            operation: 'appendFile'
          };
        }
      },
      'fileSystem.appendFile'
    ).then(({ result, timing }) => ({
        ...result,
        duration: timing.duration
      }));
  }

  /**
   * Safely delete file
   */
  static async deleteFile(
    filePath: string,
    options: FileOperationOptions = {}
  ): Promise<FileOperationResult<void>> {
    return measureAsyncTime(
      async () => {
        try {
          // Check if file exists
          const exists = await fs.pathExists(filePath);
          
          if (!exists) {
            return {
              success: true,
              path: filePath,
              operation: 'deleteFile'
            };
          }

          // Delete file
          await fs.remove(filePath);
          
          return {
            success: true,
            path: filePath,
            operation: 'deleteFile'
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          return {
            success: false,
            error: errorMessage,
            path: filePath,
            operation: 'deleteFile'
          };
        }
      },
      'fileSystem.deleteFile'
    ).then(({ result, timing }) => ({
        ...result,
        duration: timing.duration
      }));
  }

  /**
   * Ensure directory exists
   */
  static async ensureDirectory(
    dirPath: string,
    options: FileOperationOptions = {}
  ): Promise<FileOperationResult<void>> {
    return measureAsyncTime(
      async () => {
        try {
          await fs.ensureDir(dirPath);
          
          return {
            success: true,
            path: dirPath,
            operation: 'ensureDirectory'
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          return {
            success: false,
            error: errorMessage,
            path: dirPath,
            operation: 'ensureDirectory'
          };
        }
      },
      'fileSystem.ensureDirectory'
    ).then(({ result, timing }) => ({
        ...result,
        duration: timing.duration
      }));
  }

  /**
   * Get file statistics
   */
  static async getFileStats(
    filePath: string
  ): Promise<FileOperationResult<FileStats>> {
    return measureAsyncTime(
      async () => {
        try {
          const exists = await fs.pathExists(filePath);
          
          if (!exists) {
            return {
              success: true,
              data: {
                exists: false,
                size: 0,
                isFile: false,
                isDirectory: false
              },
              path: filePath,
              operation: 'getFileStats'
            };
          }

          const stats = await fs.stat(filePath);
          
          return {
            success: true,
            data: {
              exists: true,
              size: stats.size,
              isFile: stats.isFile(),
              isDirectory: stats.isDirectory(),
              created: stats.birthtime,
              modified: stats.mtime,
              accessed: stats.atime
            },
            path: filePath,
            operation: 'getFileStats'
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          return {
            success: false,
            error: errorMessage,
            path: filePath,
            operation: 'getFileStats'
          };
        }
      },
      'fileSystem.getFileStats'
    ).then(({ result, timing }) => ({
        ...result,
        duration: timing.duration
      }));
  }

  /**
   * Copy file with directory creation
   */
  static async copyFile(
    sourcePath: string,
    destPath: string,
    options: FileOperationOptions = {}
  ): Promise<FileOperationResult<void>> {
    return measureAsyncTime(
      async () => {
        try {
          // Create destination directory if needed
          if (options.createDir !== false) {
            const dirPath = destPath.substring(0, destPath.lastIndexOf('/') + 1);
            if (dirPath) {
              await fs.ensureDir(dirPath);
            }
          }

          // Copy file
          await fs.copy(sourcePath, destPath, { overwrite: options.overwrite });
          
          return {
            success: true,
            path: `${sourcePath} -> ${destPath}`,
            operation: 'copyFile'
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          return {
            success: false,
            error: errorMessage,
            path: `${sourcePath} -> ${destPath}`,
            operation: 'copyFile'
          };
        }
      },
      'fileSystem.copyFile'
    ).then(({ result, timing }) => ({
        ...result,
        duration: timing.duration
      }));
  }

  /**
   * Move file with directory creation
   */
  static async moveFile(
    sourcePath: string,
    destPath: string,
    options: FileOperationOptions = {}
  ): Promise<FileOperationResult<void>> {
    return measureAsyncTime(
      async () => {
        try {
          // Create destination directory if needed
          if (options.createDir !== false) {
            const dirPath = destPath.substring(0, destPath.lastIndexOf('/') + 1);
            if (dirPath) {
              await fs.ensureDir(dirPath);
            }
          }

          // Move file
          await fs.move(sourcePath, destPath, { overwrite: options.overwrite });
          
          return {
            success: true,
            path: `${sourcePath} -> ${destPath}`,
            operation: 'moveFile'
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          return {
            success: false,
            error: errorMessage,
            path: `${sourcePath} -> ${destPath}`,
            operation: 'moveFile'
          };
        }
      },
      'fileSystem.moveFile'
    ).then(({ result, timing }) => ({
        ...result,
        duration: timing.duration
      }));
  }

  /**
   * List directory contents
   */
  static async listDirectory(
    dirPath: string,
    options: { includeHidden?: boolean; recursive?: boolean } = {}
  ): Promise<FileOperationResult<string[]>> {
    return measureAsyncTime(
      async () => {
        try {
          const files = await fs.readdir(dirPath);
          
          let filteredFiles = files;
          
          // Filter hidden files if needed
          if (!options.includeHidden) {
            filteredFiles = files.filter(file => !file.startsWith('.'));
          }
          
          // Sort files for consistent ordering
          filteredFiles.sort((a, b) => a.localeCompare(b));
          
          return {
            success: true,
            data: filteredFiles,
            path: dirPath,
            operation: 'listDirectory'
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          return {
            success: false,
            error: errorMessage,
            path: dirPath,
            operation: 'listDirectory'
          };
        }
      },
      'fileSystem.listDirectory'
    ).then(({ result, timing }) => ({
        ...result,
        duration: timing.duration
      }));
  }

  /**
   * Clean up temporary files
   */
  static async cleanupTemp(
    tempDir: string = '/tmp',
    maxAge: number = 24 * 60 * 60 * 1000 // 24 hours
  ): Promise<FileOperationResult<string[]>> {
    return measureAsyncTime(
      async () => {
        try {
          const files = await fs.readdir(tempDir);
          const now = Date.now();
          const deleted: string[] = [];
          
          for (const file of files) {
            const filePath = `${tempDir}/${file}`;
            try {
              const stats = await fs.stat(filePath);
              
              // Delete files older than maxAge
              if (now - stats.mtime.getTime() > maxAge) {
                await fs.remove(filePath);
                deleted.push(file);
              }
            } catch {
              // Skip files that can't be accessed
            }
          }
          
          return {
            success: true,
            data: deleted,
            path: tempDir,
            operation: 'cleanupTemp'
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          return {
            success: false,
            error: errorMessage,
            path: tempDir,
            operation: 'cleanupTemp'
          };
        }
      },
      'fileSystem.cleanupTemp'
    ).then(({ result, timing }) => ({
        ...result,
        duration: timing.duration
      }));
  }
}

// Convenience functions for backward compatibility
export const fileSystemUtils = {
  readFile: FileSystemOperations.readFile,
  writeFile: FileSystemOperations.writeFile,
  appendFile: FileSystemOperations.appendFile,
  deleteFile: FileSystemOperations.deleteFile,
  ensureDirectory: FileSystemOperations.ensureDirectory,
  getFileStats: FileSystemOperations.getFileStats,
  copyFile: FileSystemOperations.copyFile,
  moveFile: FileSystemOperations.moveFile,
  listDirectory: FileSystemOperations.listDirectory,
  cleanupTemp: FileSystemOperations.cleanupTemp
};

// Legacy function aliases for migration
export const safeReadFile = FileSystemOperations.readFile;
export const safeWriteFile = FileSystemOperations.writeFile;
export const ensureDir = FileSystemOperations.ensureDirectory;
export const ensureDirSync = () => {
  console.warn('ensureDirSync is deprecated - use ensureDirectory for better scalability');
  return false;
};