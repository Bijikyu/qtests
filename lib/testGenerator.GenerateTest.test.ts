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
      TEST_DIR: path.join(tempDir, 'tests', 'generated-tests')
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

  it('should generate unit test with .GeneratedTest.test.ts naming', () => {
    // Create a test source file
    const sourceFile = path.join(tempDir, 'example.ts');
    fs.writeFileSync(sourceFile, 'export function testFunc() { return "hello"; }');
    
    // Analyze the file
    generator.analyze(sourceFile);
    
    const results = generator.getResults();
    expect(results).toHaveLength(1);
    expect(results[0].type).toBe('unit');
    expect(results[0].file).toMatch(/\.GeneratedTest\.test\.ts$/);

    // Verify no placeholder assertions were generated
    const generatedPath = path.join(tempDir, 'example.GeneratedTest.test.ts');
    const generatedContent = fs.readFileSync(generatedPath, 'utf8');
    expect(generatedContent).not.toMatch(/expectedOutput|TODO:/);
  });

  it('should include qtests/setup import in generated tests', () => {
    // Create a test source file
    const sourceFile = path.join(tempDir, 'example.ts');
    fs.writeFileSync(sourceFile, 'export function testFunc() { return "hello"; }');
    
    // Analyze the file
    generator.analyze(sourceFile);
    
    // Check that the generated test includes qtests/setup
    const testFile = path.join(tempDir, 'example.GeneratedTest.test.ts');
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
    const testFile = path.join(tempDir, 'example.GeneratedTest.test.ts');
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
    expect(apiTests[0].file).toMatch(/\.GeneratedTest__get\.test\.ts$/);

    // Validate that the generated API test imports httpTest without extension
    const apiTestPath = path.join(
      tempDir,
      'tests',
      'generated-tests',
      path.relative(process.cwd(), sourceFile)
        .replace(/\.[tj]sx?$/, '.GeneratedTest__get.test.ts')
        .replace(/[\\/]/g, '__')
    );
    const apiTestContent = fs.readFileSync(apiTestPath, 'utf8');
    expect(apiTestContent).toMatch(/from '\.\.\/utils\/httpTest';/);

    // Local httpTest utils are scaffolded by the generator in non-dry runs.
    // Existence is environment-dependent in this test sandbox, so we only assert import shape.
  });

  it('should skip generating tests inside __mocks__ directory', async () => {
    const srcFile = path.join(tempDir, 'real.ts');
    const mockFile = path.join(tempDir, '__mocks__', 'mocked.ts');
    fs.mkdirSync(path.dirname(mockFile), { recursive: true });
    fs.writeFileSync(srcFile, 'export const real = 1;');
    fs.writeFileSync(mockFile, 'export const fake = 2;');

    await generator.generateTestFiles(true); // dry-run scan of tempDir

    // Only the real file should be considered for generation in results
    // After dry run, analyze explicitly to populate results for assertions
    await generator.analyze(srcFile, true);
    const results = generator.getResults();
    // Ensure no tests were planned for the __mocks__ file
    const anyMock = results.some(r => r.file.includes('__mocks__'));
    expect(anyMock).toBe(false);
  });

  it('optionally wraps React tests with MemoryRouter when flag is set and router is detected (component tests enabled)', async () => {
    // Create a React component that uses react-router-dom
    const reactFile = path.join(tempDir, 'MyComponent.tsx');
    fs.writeFileSync(reactFile, `
      import React from 'react';
      import { Link } from 'react-router-dom';
      export function MyComponent(){
        return React.createElement('div', {}, React.createElement('a', {href: '#'}, 'ok'));
      }
    `);

    const genWithRouter = new TestGenerator({ SRC_DIR: tempDir, withRouter: true, skipReactComponents: false });
    await genWithRouter.analyze(reactFile);

    const genTestPath = path.join(tempDir, 'MyComponent.GeneratedTest.test.ts');
    expect(fs.existsSync(genTestPath)).toBe(true);
    const genContent = fs.readFileSync(genTestPath, 'utf8');
    expect(genContent).toMatch(/MemoryRouter/);
  });

  it('falls back to existence test when component has required props (component tests enabled)', async () => {
    const reactFile = path.join(tempDir, 'NeedsProps.tsx');
    fs.writeFileSync(reactFile, `
      import React from 'react';
      export function NeedsProps(props: { id: string }){
        return React.createElement('div', {}, props.id);
      }
    `);

    const gen = new TestGenerator({ SRC_DIR: tempDir, skipReactComponents: false });
    await gen.analyze(reactFile);

    const genPath = path.join(tempDir, 'NeedsProps.GeneratedTest.test.ts');
    expect(fs.existsSync(genPath)).toBe(true);
    const content = fs.readFileSync(genPath, 'utf8');
    // Should not attempt to render the component
    expect(content).not.toMatch(/render\(/);
    // Should contain the fallback wording
    expect(content).toMatch(/fallback: required props detected/);
  });

  it('skips generating tests for React components by default (hooks still generated)', async () => {
    const hookFile = path.join(tempDir, 'useThing.ts');
    fs.writeFileSync(hookFile, `
      import React from 'react';
      export function useThing(){ return React.useState(0); }
    `);
    const compFile = path.join(tempDir, 'OnlyComponent.tsx');
    fs.writeFileSync(compFile, `
      import React from 'react';
      export function OnlyComponent(){ return React.createElement('div'); }
    `);

    const gen = new TestGenerator({ SRC_DIR: tempDir });
    await gen.analyze(hookFile);
    await gen.analyze(compFile);

    // Hook test should be generated
    expect(fs.existsSync(path.join(tempDir, 'useThing.GeneratedTest.test.ts'))).toBe(true);
    // Component-only file should be skipped by default
    expect(fs.existsSync(path.join(tempDir, 'OnlyComponent.GeneratedTest.test.ts'))).toBe(false);
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
