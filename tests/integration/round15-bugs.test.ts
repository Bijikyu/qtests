/**
 * Round 15 dogfood regression tests
 *
 * Bug-1: utils/fileSystemFramework.ts — static methods lost `this` context
 *   when exported as plain function references.
 *   `FileSystemOperations.readFile` (and the other static methods) use
 *   `this.DEFAULT_MAX_SIZE` and `this.DEFAULT_ENCODING` inside the method
 *   body. When the module exported them as bare references:
 *     export const safeReadFile = FileSystemOperations.readFile;
 *   calling `safeReadFile(path)` detached `this` from the class, making
 *   it `undefined` in strict mode and throwing:
 *     "Cannot read properties of undefined (reading 'DEFAULT_MAX_SIZE')"
 *   Same problem in the `fileSystemUtils` convenience object.
 *   Fixed: added `.bind(FileSystemOperations)` to every exported alias and
 *   every entry in the `fileSystemUtils` object.
 *
 * Modules probed and found clean (no bugs): utils/memoryManagement
 *   (MemoryMonitor, getMemorySnapshot, calculateMemoryDelta, formatMemorySnapshot),
 *   utils/jsonUtils (safeJSONParse, safeJSONStringify, safeJSONClone,
 *   validateJSONStructure, batchJSONOperation, extractJSONFields),
 *   utils/testIsolationFramework (TestIsolationManager, testIsolation,
 *   memoryTracker, createTestIsolation, withIsolation),
 *   utils/streamingUtils (FileTransform, readFileStream, writeFileStream, etc.),
 *   utils/validationSchemas, utils/commonPatterns, utils/importExportUtils.
 */

import * as path from 'path';
import * as os from 'os';
import * as fsp from 'fs/promises';

const load = (rel: string) => import(path.resolve(__dirname, rel));

// ─── Bug-1: fileSystemFramework safeReadFile/safeWriteFile binding ────────────
describe('Bug-1: fileSystemFramework — exported aliases are bound to class', () => {
  let fsf: any;
  let tmpDir: string;

  beforeAll(async () => {
    fsf = await load('../../dist/lib/utils/fileSystemFramework.js');
    tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'qtests-r15-'));
  });

  afterAll(async () => {
    await fsp.rm(tmpDir, { recursive: true, force: true });
  });

  it('safeWriteFile (bound alias) does not throw "DEFAULT_MAX_SIZE" error', async () => {
    const file = path.join(tmpDir, 'write.txt');
    const result = await fsf.safeWriteFile(file, 'hello');
    expect(result.success).toBe(true);
    expect(result.operation).toBe('writeFile');
  });

  it('safeReadFile (bound alias) reads back written content', async () => {
    const file = path.join(tmpDir, 'readback.txt');
    await fsf.safeWriteFile(file, 'readback content');
    const result = await fsf.safeReadFile(file);
    expect(result.success).toBe(true);
    expect(result.data).toBe('readback content');
  });

  it('safeReadFile returns success:false for missing file (no crash)', async () => {
    const result = await fsf.safeReadFile(path.join(tmpDir, 'nonexistent.txt'));
    expect(result.success).toBe(false);
    expect(typeof result.error).toBe('string');
  });

  it('ensureDir (bound alias) creates a directory', async () => {
    const dir = path.join(tmpDir, 'created');
    const result = await fsf.ensureDir(dir);
    expect(result.success).toBe(true);
  });

  it('fileSystemUtils.readFile (bound) reads a file', async () => {
    const file = path.join(tmpDir, 'fsu-read.txt');
    await fsf.safeWriteFile(file, 'fsu content');
    const result = await fsf.fileSystemUtils.readFile(file);
    expect(result.success).toBe(true);
    expect(result.data).toBe('fsu content');
  });

  it('fileSystemUtils.writeFile (bound) writes a file', async () => {
    const file = path.join(tmpDir, 'fsu-write.txt');
    const result = await fsf.fileSystemUtils.writeFile(file, 'fsu write');
    expect(result.success).toBe(true);
  });

  it('fileSystemUtils.deleteFile removes a file', async () => {
    const file = path.join(tmpDir, 'fsu-delete.txt');
    await fsf.fileSystemUtils.writeFile(file, 'bye');
    const result = await fsf.fileSystemUtils.deleteFile(file);
    expect(result.success).toBe(true);
  });

  it('fileSystemUtils.getFileStats returns stats for existing file', async () => {
    const file = path.join(tmpDir, 'stats.txt');
    await fsf.fileSystemUtils.writeFile(file, 'stats data');
    const result = await fsf.fileSystemUtils.getFileStats(file);
    expect(result.success).toBe(true);
    expect(result.data.exists).toBe(true);
    expect(result.data.isFile).toBe(true);
    expect(typeof result.data.size).toBe('number');
  });

  it('fileSystemUtils.listDirectory returns files in directory', async () => {
    const dir = path.join(tmpDir, 'listing');
    await fsp.mkdir(dir, { recursive: true });
    await fsp.writeFile(path.join(dir, 'a.txt'), '');
    await fsp.writeFile(path.join(dir, 'b.txt'), '');
    const result = await fsf.fileSystemUtils.listDirectory(dir);
    expect(result.success).toBe(true);
    expect(result.data).toContain('a.txt');
    expect(result.data).toContain('b.txt');
  });

  it('fileSystemUtils.appendFile appends to existing file', async () => {
    const file = path.join(tmpDir, 'append.txt');
    await fsf.fileSystemUtils.writeFile(file, 'line1\n');
    await fsf.fileSystemUtils.appendFile(file, 'line2\n');
    const result = await fsf.fileSystemUtils.readFile(file);
    expect(result.data).toContain('line1');
    expect(result.data).toContain('line2');
  });

  it('FileSystemOperations.readFile called as static method still works', async () => {
    const file = path.join(tmpDir, 'static.txt');
    await fsf.fileSystemUtils.writeFile(file, 'static call');
    const result = await fsf.FileSystemOperations.readFile(file);
    expect(result.success).toBe(true);
    expect(result.data).toBe('static call');
  });
});

// ─── Regression: utils/memoryManagement ──────────────────────────────────────
describe('Regression: memoryManagement', () => {
  let mm: any;

  beforeAll(async () => {
    mm = await load('../../dist/lib/utils/memoryManagement.js');
  });

  it('getMemorySnapshot returns object with heapUsed', () => {
    const snap = mm.getMemorySnapshot();
    expect(typeof snap.heapUsed).toBe('number');
    expect(typeof snap.heapTotal).toBe('number');
    expect(typeof snap.rss).toBe('number');
    expect(typeof snap.timestamp).toBe('number');
  });

  it('MemoryMonitor.takeSnapshot captures a snapshot', () => {
    const monitor = new mm.MemoryMonitor();
    const snap = monitor.takeSnapshot();
    expect(snap).toBeDefined();
    expect(typeof snap.heapUsed).toBe('number');
  });

  it('MemoryMonitor.getSnapshots returns array with snapshot', () => {
    const monitor = new mm.MemoryMonitor();
    monitor.takeSnapshot();
    expect(monitor.getSnapshots().length).toBeGreaterThanOrEqual(1);
  });

  it('MemoryMonitor.analyze returns isLeaking and growthRate', () => {
    const monitor = new mm.MemoryMonitor();
    monitor.takeSnapshot();
    monitor.takeSnapshot();
    const analysis = monitor.analyze();
    expect(typeof analysis.isLeaking).toBe('boolean');
    expect(typeof analysis.growthRate).toBe('number');
  });

  it('MemoryMonitor.clearSnapshots empties the snapshot list', () => {
    const monitor = new mm.MemoryMonitor();
    monitor.takeSnapshot();
    monitor.clearSnapshots();
    expect(monitor.getSnapshots().length).toBe(0);
  });

  it('calculateMemoryDelta returns heap/rss/external/timeSpan', () => {
    const s1 = mm.getMemorySnapshot();
    const s2 = mm.getMemorySnapshot();
    const delta = mm.calculateMemoryDelta(s1, s2);
    expect(typeof delta.heap).toBe('number');
    expect(typeof delta.rss).toBe('number');
    expect(typeof delta.timeSpan).toBe('number');
  });

  it('formatMemorySnapshot returns a non-empty string', () => {
    const snap = mm.getMemorySnapshot();
    const formatted = mm.formatMemorySnapshot(snap);
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });

  it('performGarbageCollection does not throw', () => {
    expect(() => mm.performGarbageCollection()).not.toThrow();
  });
});

// ─── Regression: utils/jsonUtils ─────────────────────────────────────────────
describe('Regression: jsonUtils', () => {
  let ju: any;

  beforeAll(async () => {
    ju = await load('../../dist/lib/utils/jsonUtils.js');
  });

  it('safeJSONParse returns parsed object for valid JSON', () => {
    expect(ju.safeJSONParse('{"a":1}')).toEqual({ a: 1 });
  });

  it('safeJSONParse returns null for invalid JSON', () => {
    expect(ju.safeJSONParse('not json')).toBeNull();
  });

  it('safeJSONParse returns custom fallback for invalid JSON', () => {
    expect(ju.safeJSONParse('bad', undefined, 'fallback')).toBe('fallback');
  });

  it('safeJSONParse returns null for non-string input', () => {
    expect(ju.safeJSONParse(null as any)).toBeNull();
  });

  it('safeJSONStringify returns JSON string for plain object', () => {
    expect(ju.safeJSONStringify({ b: 2 })).toBe('{"b":2}');
  });

  it('safeJSONStringify returns fallback for circular references', () => {
    const obj: any = {};
    obj.self = obj;
    expect(ju.safeJSONStringify(obj)).toBe('{}');
  });

  it('safeJSONStringify returns fallback for null/undefined', () => {
    expect(ju.safeJSONStringify(null)).toBe('{}');
  });

  it('safeJSONClone deep-clones an object', () => {
    const original = { x: { y: 1 } };
    const clone = ju.safeJSONClone(original);
    expect(clone).toEqual(original);
    expect(clone).not.toBe(original);
  });

  it('safeJSONEquals returns true for equal objects', () => {
    expect(ju.safeJSONEquals({ a: 1 }, { a: 1 })).toBe(true);
  });

  it('safeJSONEquals returns false for unequal objects', () => {
    expect(ju.safeJSONEquals({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('extractJSONFields extracts only specified fields', () => {
    const result = ju.extractJSONFields({ a: 1, b: 2, c: 3 }, ['a', 'c']);
    expect(result).toEqual({ a: 1, c: 3 });
    expect(result.b).toBeUndefined();
  });

  it('validateJSONStructure valid JSON with required fields passes', () => {
    const result = ju.validateJSONStructure('{"x":1}', { required: ['x'] });
    expect(result.valid).toBe(true);
    expect(result.data).toEqual({ x: 1 });
  });

  it('validateJSONStructure missing required field fails', () => {
    const result = ju.validateJSONStructure('{"y":2}', { required: ['x'] });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e: string) => e.includes('Missing required field'))).toBe(true);
  });

  it('validateJSONStructure invalid JSON string fails', () => {
    const result = ju.validateJSONStructure('not-json', {});
    expect(result.valid).toBe(false);
    expect(result.errors.some((e: string) => e.includes('Invalid JSON'))).toBe(true);
  });

  it('batchJSONOperation processes items in batches', async () => {
    const results = await ju.batchJSONOperation([1, 2, 3], async (n: number) => n * 10);
    expect(results).toEqual(expect.arrayContaining([10, 20, 30]));
  });
});
