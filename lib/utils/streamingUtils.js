/**
 * Comprehensive Streaming File Utilities
 * Provides memory-efficient file operations using streams for large files
 */

import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { Transform, Readable } from 'stream';
import qerrors from 'qerrors';

/**
 * Read large file in chunks using streams
 * @param {string} filePath - Path to file
 * @param {number} chunkSize - Size of each chunk in bytes (default: 1MB)
 * @param {Object} options - Stream options
 * @returns {AsyncIterable} Async iterable of file chunks
 */
async function* readFileChunks(filePath, chunkSize = 1024 * 1024, options = {}) {
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
            const chunkInfo = {
                data: options.encoding ? chunk.toString(options.encoding) : chunk,
                size: chunk.length,
                offset,
                isLast
            };
            offset += chunk.length;
            yield chunkInfo;
        }
    } catch (error) {
        qerrors(error, 'streamingUtils.readFileChunks: stream failed', {
            filePath,
            chunkSize,
            options,
            operation: 'readStream'
        });
        throw error;
    } finally {
        readStream.destroy();
    }
}

/**
 * Read file using streams with better memory efficiency
 * @param {string} filePath - Path to file
 * @param {Object} options - Stream options
 * @returns {Promise<string>} File content as string
 */
async function readFileStream(filePath, options = {}) {
    const readStream = fs.createReadStream(filePath, options);
    const chunks = [];
    try {
        for await (const chunk of readStream) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks).toString(options.encoding || 'utf8');
    } catch (error) {
        qerrors(error, 'streamingUtils.readFileStream: read failed', {
            filePath,
            options,
            operation: 'readStream'
        });
        throw error;
    } finally {
        readStream.destroy();
    }
}

/**
 * Write data to file using streams
 * @param {string} filePath - Path to destination file
 * @param {string|Buffer|Readable} data - Data to write
 * @param {Object} options - Stream options
 * @returns {Promise<void>}
 */
async function writeFileStream(filePath, data, options = {}) {
    const writeStream = fs.createWriteStream(filePath, options);
    try {
        if (data instanceof Readable) {
            await pipeline(data, writeStream);
        } else {
            writeStream.write(data);
            writeStream.end();
            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });
        }
    } catch (error) {
        qerrors(error, 'streamingUtils.writeFileStream: write failed', {
            filePath,
            options,
            operation: 'writeStream'
        });
        throw error;
    } finally {
        writeStream.destroy();
    }
}

/**
 * Transform file content using custom transform function
 * @param {string} sourcePath - Path to source file
 * @param {string} destPath - Path to destination file
 * @param {Function} transformFn - Transform function
 * @param {Object} options - Stream options
 * @returns {Promise<void>}
 */
async function transformFile(sourcePath, destPath, transformFn, options = {}) {
    const readStream = fs.createReadStream(sourcePath, options);
    const writeStream = fs.createWriteStream(destPath, options);
    const transformStream = new Transform({
        objectMode: false,
        transform(chunk, encoding, callback) {
            try {
                const transformed = transformFn(chunk, encoding);
                callback(null, transformed);
            } catch (error) {
                callback(error);
            }
        }
    });
    try {
        await pipeline(readStream, transformStream, writeStream);
    } catch (error) {
        qerrors(error, 'streamingUtils.transformFile: transform failed', {
            sourcePath,
            destPath,
            options,
            operation: 'pipeline'
        });
        throw error;
    }
}

/**
 * Count lines in large file efficiently
 * @param {string} filePath - Path to file
 * @param {Object} options - Stream options
 * @returns {Promise<number>} Number of lines
 */
async function countLines(filePath, options = {}) {
    let lineCount = 0;
    const readStream = fs.createReadStream(filePath, options);
    try {
        for await (const chunk of readStream) {
            const chunkStr = chunk.toString(options.encoding || 'utf8');
            lineCount += (chunkStr.match(/\n/g) || []).length;
        }
        return lineCount;
    } catch (error) {
        qerrors(error, 'streamingUtils.countLines: count failed', {
            filePath,
            options,
            operation: 'readStream'
        });
        throw error;
    } finally {
        readStream.destroy();
    }
}

/**
 * Search for pattern in large file efficiently
 * @param {string} filePath - Path to file
 * @param {RegExp|string} pattern - Pattern to search for
 * @param {Object} options - Stream options
 * @returns {Promise<Array>} Array of matches with line numbers
 */
async function searchInFile(filePath, pattern, options = {}) {
    const matches = [];
    let lineNumber = 0;
    const readStream = fs.createReadStream(filePath, options);
    const regex = new RegExp(pattern);
    try {
        for await (const chunk of readStream) {
            const lines = chunk.toString(options.encoding || 'utf8').split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (i === lines.length - 1 && lines[i] === '') break; // Skip empty last line
                lineNumber++;
                if (regex.test(lines[i])) {
                    matches.push({
                        line: lineNumber,
                        content: lines[i],
                        match: lines[i].match(regex)
                    });
                }
            }
        }
        return matches;
    } catch (error) {
        qerrors(error, 'streamingUtils.searchInFile: search failed', {
            filePath,
            pattern,
            options,
            operation: 'readStream'
        });
        throw error;
    } finally {
        readStream.destroy();
    }
}

/**
 * Copy file using streams for better memory efficiency
 * @param {string} sourcePath - Path to source file
 * @param {string} destPath - Path to destination file
 * @param {Object} options - Stream options
 * @returns {Promise<void>}
 */
async function copyFileStream(sourcePath, destPath, options = {}) {
    const readStream = fs.createReadStream(sourcePath, options);
    const writeStream = fs.createWriteStream(destPath, options);
    try {
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
 * @param {string} filePath - Path to file
 * @returns {Promise<number>} File size in bytes
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

/**
 * Check if file should use streaming based on size
 * @param {string} filePath - Path to the file
 * @param {number} threshold - Size threshold in bytes (default: 10MB)
 * @returns {Promise<boolean>} True if should stream
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

export {
    readFileChunks,
    readFileStream,
    writeFileStream,
    transformFile,
    countLines,
    searchInFile,
    copyFileStream,
    getFileSize,
    shouldUseStreaming
};