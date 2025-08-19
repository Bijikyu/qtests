/**
 * Test Suite for Test Generator
 * 
 * Comprehensive testing of the TestGenerator class and CLI functionality.
 * Tests file scanning, code analysis, test generation, and CLI interface.
 */

const { TestGenerator } = require('../lib/testGenerator');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('TestGenerator Configuration', () => {
  it('should use default configuration', () => {
    const defaultGen = new TestGenerator();
    expect(defaultGen.config.SRC_DIR).toBe('src');
    expect(defaultGen.config.TEST_DIR).toBe('tests/integration');
    expect(defaultGen.config.KNOWN_MOCKS).toContain('axios');
    expect(defaultGen.config.VALID_EXTS).toContain('.js');
  });

  it('should accept custom configuration', () => {
    const customGen = new TestGenerator({
      SRC_DIR: 'lib',
      TEST_DIR: 'spec',
      KNOWN_MOCKS: ['custom-lib']
    });
    
    expect(customGen.config.SRC_DIR).toBe('lib');
    expect(customGen.config.TEST_DIR).toBe('spec');
    expect(customGen.config.KNOWN_MOCKS).toContain('custom-lib');
  });
});

describe('TestGenerator File System', () => {
  it('should walk directory structure', () => {
    // PARALLEL-SAFE: Use unique temp dir and absolute paths, no process.chdir()
    const uniqueId = `${process.hrtime.bigint()}-${Math.random().toString(36).substr(2, 9)}`;
    const tempDir = path.join(__dirname, `temp-test-${uniqueId}`);
    fs.mkdirSync(tempDir, { recursive: true });
    
    try {
      // Create test files with absolute paths
      const srcDir = path.join(tempDir, 'src');
      fs.mkdirSync(srcDir, { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'utils.js'), 'export const helper = () => {};');
      fs.mkdirSync(path.join(srcDir, 'components'), { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'components', 'Button.tsx'), 'export const Button = () => {};');
      
      // PARALLEL-SAFE: Use absolute paths instead of changing working directory
      const generator = new TestGenerator({ 
        SRC_DIR: srcDir, 
        TEST_DIR: path.join(tempDir, 'tests') 
      });
      const files = generator.walk(srcDir);
      
      expect(files.length).toBeGreaterThanOrEqual(2);
      expect(files.some(f => f.endsWith('utils.js'))).toBe(true);
      expect(files.some(f => f.endsWith('Button.tsx'))).toBe(true);
    } finally {
      // Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});

describe('TestGenerator CLI', () => {
  it('should have executable CLI script', () => {
    const cliPath = path.join(__dirname, '..', 'bin', 'qtests-generate');
    expect(fs.existsSync(cliPath)).toBe(true);
    
    const stats = fs.statSync(cliPath);
    expect(stats.mode & 0o111).toBeTruthy(); // Check executable bit
  });

  it('should show help when requested', () => {
    const result = execSync('node bin/qtests-generate --help', { 
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    expect(result).toContain('USAGE');
    expect(result).toContain('OPTIONS');
    expect(result).toContain('qtests-generate');
  });

  it('should show version when requested', () => {
    const result = execSync('node bin/qtests-generate --version', { 
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    expect(result).toContain('qtests v');
  });
});

describe('TestGenerator Content Generation', () => {
  it('should generate unit test content', () => {
    const generator = new TestGenerator();
    const exports = ['calculate', 'Calculator'];
    const usesQtests = false;
    const mocks = ['axios'];
    
    const testContent = generator.createUnitTest('calculator.js', exports, usesQtests, mocks);
    
    expect(testContent).toContain('calculate');
    expect(testContent).toContain('Calculator');
    expect(testContent).toContain('describe');
  });

  it('should generate API test content', () => {
    const generator = new TestGenerator();
    const method = 'get';
    const route = '/api/users';
    
    const testContent = generator.createApiTest(method, route);
    
    expect(testContent).toContain('/api/users');
    expect(testContent).toContain('GET');
    expect(testContent).toContain('request');
  });
});