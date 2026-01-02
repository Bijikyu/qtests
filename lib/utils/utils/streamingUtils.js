"use strict";
/**
 * Streaming File Utilities
 * Provides memory-efficient file operations using streams for large files
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTransform = void 0;
exports.readFileChunks = readFileChunks;
exports.readFileStream = readFileStream;
exports.writeFileStream = writeFileStream;
exports.transformFile = transformFile;
exports.countLines = countLines;
exports.searchInFile = searchInFile;
exports.copyFileStream = copyFileStream;
exports.getFileSize = getFileSize;
exports.shouldUseStreaming = shouldUseStreaming;
const fs = require("fs");
const path = require("path");
const promises_1 = require("stream/promises");
const stream_1 = require("stream");
const qerrorsFallback_js_1 = require("../qerrorsFallback.js");
/**
 * Read large file in chunks using streams
 * @param filePath - Path to file
 * @param chunkSize - Size of each chunk in bytes (default: 1MB)
 * @param options - Stream options
 * @returns Async iterable of file chunks
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
            if (isLast)
                break;
        }
    }
    catch (error) {
        (0, qerrorsFallback_js_1.default)(error, 'streamingUtils.readFileChunks: stream read failed', {
            filePath,
            chunkSize,
            offset,
            operation: 'createReadStream'
        });
        throw error;
    }
    finally {
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
function readFileStream(filePath, chunkSize = 1024 * 1024, options = {}) {
    try {
        return fs.createReadStream(filePath, {
            highWaterMark: chunkSize,
            ...options
        });
    }
    catch (error) {
        (0, qerrorsFallback_js_1.default)(error, 'streamingUtils.readFileStream: stream creation failed', {
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
async function writeFileStream(filePath, source, options = {}) {
    try {
        // Ensure directory exists
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        let readable;
        if (Symbol.asyncIterator in source) {
            // Convert async iterable to stream
            readable = stream_1.Readable.from(source);
        }
        else {
            readable = source;
        }
        const writable = fs.createWriteStream(filePath, options);
        await (0, promises_1.pipeline)(readable, writable);
    }
    catch (error) {
        (0, qerrorsFallback_js_1.default)(error, 'streamingUtils.writeFileStream: stream write failed', {
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
class FileTransform extends stream_1.Transform {
    constructor(transformFn, options = {}) {
        super({ encoding: options.encoding || 'utf8' });
        this.transformFn = transformFn;
        this.encoding = options.encoding || 'utf8';
    }
    _transform(chunk, encoding, callback) {
        try {
            const result = this.transformFn(chunk, encoding);
            this.push(result);
            callback();
        }
        catch (error) {
            callback(error);
        }
    }
}
exports.FileTransform = FileTransform;
/**
 * Process large file with custom transformation
 * @param inputPath - Input file path
 * @param outputPath - Output file path
 * @param transformFn - Transformation function
 * @param options - Stream options
 * @returns Promise that resolves when processing is complete
 */
async function transformFile(inputPath, outputPath, transformFn, options = {}) {
    try {
        const readStream = fs.createReadStream(inputPath, options);
        const writeStream = fs.createWriteStream(outputPath, options);
        const transform = new FileTransform(transformFn, options);
        await (0, promises_1.pipeline)(readStream, transform, writeStream);
    }
    catch (error) {
        (0, qerrorsFallback_js_1.default)(error, 'streamingUtils.transformFile: file transformation failed', {
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
async function countLines(filePath, encoding = 'utf8') {
    let lineCount = 0;
    try {
        const readStream = fs.createReadStream(filePath, { encoding });
        for await (const chunk of readStream) {
            const lines = chunk.split('\n');
            lineCount += lines.length - 1; // -1 because split creates one extra
        }
        return lineCount;
    }
    catch (error) {
        (0, qerrorsFallback_js_1.default)(error, 'streamingUtils.countLines: line counting failed', {
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
async function searchInFile(filePath, pattern, maxMatches = 100, encoding = 'utf8') {
    const matches = [];
    let lineNumber = 0;
    let offset = 0;
    try {
        const readStream = fs.createReadStream(filePath, { encoding });
        for await (const chunk of readStream) {
            const lines = chunk.split('\n');
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
    }
    catch (error) {
        (0, qerrorsFallback_js_1.default)(error, 'streamingUtils.searchInFile: search failed', {
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
async function copyFileStream(sourcePath, destPath, options = {}) {
    try {
        // Ensure destination directory exists
        await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
        const readStream = fs.createReadStream(sourcePath, options);
        const writeStream = fs.createWriteStream(destPath, options);
        await (0, promises_1.pipeline)(readStream, writeStream);
    }
    catch (error) {
        (0, qerrorsFallback_js_1.default)(error, 'streamingUtils.copyFileStream: copy failed', {
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
async function getFileSize(filePath) {
    try {
        const stats = await fs.promises.stat(filePath);
        return stats.size;
    }
    catch (error) {
        (0, qerrorsFallback_js_1.default)(error, 'streamingUtils.getFileSize: stat failed', {
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
async function shouldUseStreaming(filePath, threshold = 50 * 1024 * 1024) {
    try {
        const size = await getFileSize(filePath);
        return size > threshold;
    }
    catch {
        return false;
    }
}
// Export default with all utilities
exports.default = {
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
