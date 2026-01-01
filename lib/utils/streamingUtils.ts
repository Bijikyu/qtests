/**
 * Streaming File Utilities
 * Provides memory-efficient file operations using streams for large files
 */

import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import { Transform } from 'stream';
import qerrors from '../qerrorsFallback.js';

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
  
  const readStream = fs.createReadStream(filePath, {
    highWaterMark: chunkSize,
    start: offset,
    end,
    ...options
  });

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
    qerrors(error, 'streamingUtils.readFileChunks: stream read failed', {
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
    qerrors(error, 'streamingUtils.readFileStream: stream creation failed', {
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
    qerrors(error, 'streamingUtils.writeFileStream: stream write failed', {
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
    qerrors(error, 'streamingUtils.transformFile: file transformation failed', {
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
    qerrors(error, 'streamingUtils.countLines: line counting failed', {
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
    qerrors(error, 'streamingUtils.searchInFile: search failed', {
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
    qerrors(error, 'streamingUtils.copyFileStream: copy failed', {
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
    qerrors(error, 'streamingUtils.getFileSize: stat failed', {
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
  shouldUseStreaming
};