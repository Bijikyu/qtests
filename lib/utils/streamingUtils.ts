/**
 * Streaming File Utilities
 * Provides memory-efficient file operations using streams for large files
 */

import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import { Transform, Readable } from 'stream';
import qerrors from '../qerrorsFallback.js';

/**
 * Adaptive buffer management for optimal memory usage
 */
class AdaptiveBufferManager {
  private systemMemory = 0;
  private availableMemory = 0;
  private bufferSizes = new Map<string, number>();
  private lastAdjustment = 0;
  
  constructor() {
    this.updateSystemMemory();
  }
  
  /**
   * Update system memory information
   */
  private updateSystemMemory(): void {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      this.systemMemory = memUsage.heapTotal;
      this.availableMemory = this.systemMemory - memUsage.heapUsed;
    }
  }
  
  /**
   * Calculate optimal buffer size based on available memory and file type
   */
  calculateOptimalBufferSize(filePath: string, defaultSize: number = 64 * 1024): number {
    this.updateSystemMemory();
    
    // Adjust based on available memory
    let memoryBasedSize = defaultSize;
    const memoryUsageRatio = this.availableMemory / this.systemMemory;
    
    if (memoryUsageRatio < 0.3) {
      // Low memory available - reduce buffer size
      memoryBasedSize = Math.max(8 * 1024, Math.floor(defaultSize * 0.5));
    } else if (memoryUsageRatio > 0.7) {
      // Plenty of memory available - can increase buffer size
      memoryBasedSize = Math.min(1024 * 1024, Math.floor(defaultSize * 1.5));
    }
    
    // File-type based adjustments
    const ext = path.extname(filePath).toLowerCase();
    let fileTypeMultiplier = 1.0;
    
    switch (ext) {
      case '.json':
      case '.txt':
      case '.csv':
        // Text files compress well, can use smaller buffers
        fileTypeMultiplier = 0.5;
        break;
      case '.mp4':
      case '.avi':
      case '.mov':
        // Video files - use larger buffers for efficiency
        fileTypeMultiplier = 2.0;
        break;
      case '.zip':
      case '.tar':
      case '.gz':
        // Compressed files - larger buffers for better decompression
        fileTypeMultiplier = 1.5;
        break;
    }
    
    const optimalSize = Math.floor(memoryBasedSize * fileTypeMultiplier);
    
    // Cache the result for this file type
    this.bufferSizes.set(ext, optimalSize);
    
    return optimalSize;
  }
  
  /**
   * Get recommended highWaterMark for streams
   */
  getHighWaterMark(filePath: string, options: StreamOptions = {}): number {
    const optimalSize = this.calculateOptimalBufferSize(filePath);
    
    // Respect explicit highWaterMark option if provided
    if (options.highWaterMark && options.highWaterMark > 0) {
      return Math.min(optimalSize, options.highWaterMark);
    }
    
    return optimalSize;
  }
}

const bufferManager = new AdaptiveBufferManager();

/**
 * Stream configuration options
 */
export interface StreamOptions {
  highWaterMark?: number;
  encoding?: BufferEncoding;
  autoClose?: boolean;
  emitClose?: boolean;
  start?: number;
  end?: number;
}

/**
 * File chunk information
 */
export interface FileChunk {
  data: Buffer | string;
  size: number;
  offset: number;
  isLast: boolean;
}

/**
 * Read large file in chunks using streams
 * @param filePath - Path to file
 * @param chunkSize - Size of each chunk in bytes (default: 1MB)
 * @param options - Stream options
 * @returns Async iterable of file chunks
 */
export async function* readFileChunks(
  filePath: string,
  chunkSize: number = 1024 * 1024,
  options: StreamOptions = {}
): AsyncIterable<FileChunk> {
  const stats = await fs.promises.stat(filePath);
  const fileSize = stats.size;
  let offset = options.start || 0;
  const end = options.end || fileSize;
  
  // Adaptive chunk sizing based on file size and available memory
  const adaptiveChunkSize = calculateAdaptiveChunkSize(fileSize, chunkSize);
  
  const readStream = fs.createReadStream(filePath, {
    highWaterMark: adaptiveChunkSize,
    start: offset,
    end,
    ...options
  });

  function calculateAdaptiveChunkSize(fileSize: number, requestedChunkSize: number): number {
    const memUsage = process.memoryUsage();
    const availableHeap = memUsage.heapTotal - memUsage.heapUsed;
    
    // For very large files with limited memory, use smaller chunks
    if (fileSize > 100 * 1024 * 1024 && availableHeap < 100 * 1024 * 1024) {
      return Math.min(256 * 1024, requestedChunkSize); // 256KB max
    }
    
    // For medium files, moderate chunk size
    if (fileSize > 10 * 1024 * 1024) {
      return Math.min(512 * 1024, requestedChunkSize); // 512KB max
    }
    
    // For small files, use requested size
    return requestedChunkSize;
  }

  try {
    for await (const chunk of readStream) {
      const isLast = offset + chunk.length >= end;
      const chunkInfo: FileChunk = {
        data: options.encoding ? chunk.toString(options.encoding) : chunk,
        size: chunk.length,
        offset,
        isLast
      };
      
      offset += chunk.length;
      yield chunkInfo;
      
      if (isLast) break;
    }
  } catch (error) {
    qerrors(error as Error, 'streamingUtils.readFileChunks: stream read failed', {
      filePath,
      chunkSize,
      offset,
      operation: 'createReadStream'
    });
    throw error;
  } finally {
    readStream.destroy();
  }
}

/**
 * Read large file as stream for memory efficiency
 * @param filePath - Path to file
 * @param chunkSize - Size of each chunk in bytes (default: 1MB)
 * @param options - Stream options
 * @returns Readable stream
 */
export function readFileStream(
  filePath: string,
  chunkSize: number = 1024 * 1024,
  options: StreamOptions = {}
): fs.ReadStream {
  try {
    return fs.createReadStream(filePath, {
      highWaterMark: chunkSize,
      ...options
    });
  } catch (error) {
    qerrors(error as Error, 'streamingUtils.readFileStream: stream creation failed', {
      filePath,
      chunkSize,
      operation: 'createReadStream'
    });
    throw error;
  }
}

/**
 * Write data to file using streams for memory efficiency
 * @param filePath - Path to output file
 * @param source - Source stream or async iterable
 * @param options - Stream options
 * @returns Promise that resolves when write is complete
 */
export async function writeFileStream(
  filePath: string,
  source: NodeJS.ReadableStream | AsyncIterable<any>,
  options: StreamOptions = {}
): Promise<void> {
  try {
    // Ensure directory exists
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    
    let readable: NodeJS.ReadableStream;
    
    if (Symbol.asyncIterator in source) {
      // Convert async iterable to stream
      readable = Readable.from(source);
    } else {
      readable = source as NodeJS.ReadableStream;
    }
    
    const writable = fs.createWriteStream(filePath, options);
    await pipeline(readable, writable);
  } catch (error) {
    qerrors(error as Error, 'streamingUtils.writeFileStream: stream write failed', {
      filePath,
      options,
      operation: 'createWriteStream'
    });
    throw error;
  }
}

/**
 * Transform stream for processing file data
 */
export class FileTransform extends Transform {
  private transformFn: (chunk: Buffer, encoding: BufferEncoding) => Buffer | string;
  private encoding: BufferEncoding;

  constructor(
    transformFn: (chunk: Buffer, encoding: BufferEncoding) => Buffer | string,
    options: { encoding?: BufferEncoding } = {}
  ) {
    super({ encoding: options.encoding || 'utf8' });
    this.transformFn = transformFn;
    this.encoding = options.encoding || 'utf8';
  }

  _transform(chunk: Buffer, encoding: BufferEncoding, callback: Function) {
    try {
      const result = this.transformFn(chunk, encoding);
      this.push(result);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

/**
 * Process large file with custom transformation
 * @param inputPath - Input file path
 * @param outputPath - Output file path
 * @param transformFn - Transformation function
 * @param options - Stream options
 * @returns Promise that resolves when processing is complete
 */
export async function transformFile(
  inputPath: string,
  outputPath: string,
  transformFn: (chunk: Buffer, encoding: BufferEncoding) => Buffer | string,
  options: StreamOptions = {}
): Promise<void> {
  try {
    const readStream = fs.createReadStream(inputPath, options);
    const writeStream = fs.createWriteStream(outputPath, options);
    const transform = new FileTransform(transformFn, options);
    
    await pipeline(readStream, transform, writeStream);
  } catch (error) {
    qerrors(error as Error, 'streamingUtils.transformFile: file transformation failed', {
      inputPath,
      outputPath,
      options,
      operation: 'pipeline'
    });
    throw error;
  }
}

/**
 * Count lines in large file efficiently
 * @param filePath - Path to file
 * @param encoding - File encoding (default: utf8)
 * @returns Promise that resolves to line count
 */
export async function countLines(
  filePath: string,
  encoding: BufferEncoding = 'utf8'
): Promise<number> {
  let lineCount = 0;
  
  try {
    const readStream = fs.createReadStream(filePath, { encoding });
    
    for await (const chunk of readStream) {
      const lines = (chunk as string).split('\n');
      lineCount += lines.length - 1; // -1 because split creates one extra
    }
    
    return lineCount;
  } catch (error) {
    qerrors(error as Error, 'streamingUtils.countLines: line counting failed', {
      filePath,
      encoding,
      operation: 'createReadStream'
    });
    throw error;
  }
}

/**
 * Search for pattern in large file efficiently
 * @param filePath - Path to file
 * @param pattern - Regular expression pattern to search for
 * @param maxMatches - Maximum number of matches (default: 100)
 * @param encoding - File encoding (default: utf8)
 * @returns Promise that resolves to array of line numbers and matches
 */
export async function searchInFile(
  filePath: string,
  pattern: RegExp,
  maxMatches: number = 100,
  encoding: BufferEncoding = 'utf8'
): Promise<Array<{ line: number; match: string; offset: number }>> {
  const matches: Array<{ line: number; match: string; offset: number }> = [];
  let lineNumber = 0;
  let offset = 0;
  
  try {
    const readStream = fs.createReadStream(filePath, { encoding });
    
    for await (const chunk of readStream) {
      const lines = (chunk as string).split('\n');
      
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i];
        lineNumber++;
        
        const match = line.match(pattern);
        if (match) {
          matches.push({
            line: lineNumber,
            match: match[0],
            offset: offset
          });
          
          if (matches.length >= maxMatches) {
            return matches;
          }
        }
        
        offset += line.length + 1; // +1 for newline
      }
    }
    
    return matches;
  } catch (error) {
    qerrors(error as Error, 'streamingUtils.searchInFile: search failed', {
      filePath,
      pattern: pattern.toString(),
      maxMatches,
      encoding,
      operation: 'createReadStream'
    });
    throw error;
  }
}

/**
 * Copy file using streams for memory efficiency
 * @param sourcePath - Source file path
 * @param destPath - Destination file path
 * @param options - Stream options
 * @returns Promise that resolves when copy is complete
 */
export async function copyFileStream(
  sourcePath: string,
  destPath: string,
  options: StreamOptions = {}
): Promise<void> {
  try {
    // Ensure destination directory exists
    await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
    
    const readStream = fs.createReadStream(sourcePath, options);
    const writeStream = fs.createWriteStream(destPath, options);
    await pipeline(readStream, writeStream);
  } catch (error) {
    qerrors(error as Error, 'streamingUtils.copyFileStream: copy failed', {
      sourcePath,
      destPath,
      options,
      operation: 'pipeline'
    });
    throw error;
  }
}

/**
 * Get file size without reading content
 * @param filePath - Path to file
 * @returns Promise that resolves to file size in bytes
 */
export async function getFileSize(filePath: string): Promise<number> {
  try {
    const stats = await fs.promises.stat(filePath);
    return stats.size;
  } catch (error) {
    qerrors(error as Error, 'streamingUtils.getFileSize: stat failed', {
      filePath,
      operation: 'stat'
    });
    throw error;
  }
}

/**
 * Check if file is large enough to require streaming
 * @param filePath - Path to file
 * @param threshold - Size threshold in bytes (default: 50MB)
 * @returns Promise that resolves to true if file is large
 */
export async function shouldUseStreaming(
  filePath: string,
  threshold: number = 50 * 1024 * 1024
): Promise<boolean> {
  try {
    const size = await getFileSize(filePath);
    return size > threshold;
  } catch {
    return false;
  }
}

// Export default with all utilities
export default {
  readFileChunks,
  readFileStream,
  writeFileStream,
  FileTransform,
  transformFile,
  countLines,
  searchInFile,
  copyFileStream,
  getFileSize,
  shouldUseStreaming,
  // Adaptive buffer management
  bufferManager,
  getAdaptiveHighWaterMark: bufferManager.getHighWaterMark.bind(bufferManager),
  calculateOptimalBufferSize: bufferManager.calculateOptimalBufferSize.bind(bufferManager)
};