// Generated unit test for testGenerator.ts - TypeScript ES module
// 🚩AI: ENTRY_POINT_FOR_GENERATED_TEST_IMPORTS
import 'qtests/setup';

import * as testModule from './testGenerator.js';
import { TestGenerator } from './testGenerator.js';
import fs from 'fs';
import path from 'path';

// External dependencies automatically stubbed by qtests/setup:
// - fs: stubbed by qtests (no jest.mock needed)

describe('TestGenerator', () => {
  let tempDir: string;
  let generator: TestGenerator;

  beforeEach(() => {
    // Create temporary directory for tests
    tempDir = path.join(process.cwd(), 'test-temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    generator = new TestGenerator({
      SRC_DIR: tempDir,
      TEST_DIR: path.join(tempDir, 'generated-tests')
    });
  });

  afterEach(() => {
    // Clean up temporary files
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should create generator with default config', () => {
    const gen = new TestGenerator();
    expect(gen).toBeDefined();
    expect(gen).toBeInstanceOf(TestGenerator);
  });

  it('should generate unit test with .GenerateTest.test.ts naming', () => {
    // Create a test source file
    const sourceFile = path.join(tempDir, 'example.ts');
    fs.writeFileSync(sourceFile, 'export function testFunc() { return "hello"; }');
    
    // Analyze the file
    generator.analyze(sourceFile);
    
    const results = generator.getResults();
    expect(results).toHaveLength(1);
    expect(results[0].type).toBe('unit');
    expect(results[0].file).toMatch(/\.GenerateTest\.test\.ts$/);
  });

  it('should include qtests/setup import in generated tests', () => {
    // Create a test source file
    const sourceFile = path.join(tempDir, 'example.ts');
    fs.writeFileSync(sourceFile, 'export function testFunc() { return "hello"; }');
    
    // Analyze the file
    generator.analyze(sourceFile);
    
    // Check that the generated test includes qtests/setup
    const testFile = path.join(tempDir, 'example.GenerateTest.test.ts');
    expect(fs.existsSync(testFile)).toBe(true);
    
    const testContent = fs.readFileSync(testFile, 'utf8');
    expect(testContent).toMatch(/import 'qtests\/setup';/);
  });

  it('should handle dry-run mode without writing files', () => {
    // Create a test source file
    const sourceFile = path.join(tempDir, 'example.ts');
    fs.writeFileSync(sourceFile, 'export function testFunc() { return "hello"; }');
    
    // Analyze in dry-run mode
    generator.analyze(sourceFile, true);
    
    // Check that no test file was actually written
    const testFile = path.join(tempDir, 'example.GenerateTest.test.ts');
    expect(fs.existsSync(testFile)).toBe(false);
    
    // But results should still be tracked
    const results = generator.getResults();
    expect(results).toHaveLength(1);
  });

  it('should detect API routes and generate integration tests', () => {
    // Create a file with API routes
    const sourceFile = path.join(tempDir, 'routes.ts');
    fs.writeFileSync(sourceFile, `
      import express from 'express';
      const router = express.Router();
      router.get('/api/users', (req, res) => res.json([]));
      export default router;
    `);
    
    // Analyze the file
    generator.analyze(sourceFile);
    
    const results = generator.getResults();
    const apiTests = results.filter(r => r.type === 'api');
    expect(apiTests).toHaveLength(1);
    expect(apiTests[0].file).toMatch(/\.GenerateTest__get\.test\.ts$/);
  });
});

describe('testModule exports', () => {
  it('should export TestGenerator class', () => {
    expect(testModule.TestGenerator).toBeDefined();
    expect(typeof testModule.TestGenerator).toBe('function');
  });

  it('should export default TestGenerator', () => {
    expect(testModule.default).toBeDefined();
    expect(testModule.default).toBe(testModule.TestGenerator);
  });
});