/**
 * Test Suite for Test Generator
 * 
 * Comprehensive testing of the TestGenerator class and CLI functionality.
 * Tests file scanning, code analysis, test generation, and CLI interface.
 */

const { TestGenerator, DEFAULT_CONFIG, PATTERNS } = require('../lib/testGenerator');
const { main, parseArgs } = require('../bin/qtests-generate');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('Test Generator', () => {
  let tempDir;
  let generator;

  beforeEach(() => {
    // Create temporary directory for testing
    tempDir = path.join(__dirname, 'temp-test-' + Date.now());
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Create a src directory structure for testing
    const srcDir = path.join(tempDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    
    // Change to temp directory for tests
    process.chdir(tempDir);
    
    generator = new TestGenerator({ 
      SRC_DIR: 'src',
      TEST_DIR: 'tests'
    });
  });

  afterEach(() => {
    // Clean up temp directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Configuration', () => {
    test('uses default configuration', () => {
      const defaultGen = new TestGenerator();
      expect(defaultGen.config.SRC_DIR).toBe('src');
      expect(defaultGen.config.TEST_DIR).toBe('tests/integration');
      expect(defaultGen.config.KNOWN_MOCKS).toContain('axios');
      expect(defaultGen.config.VALID_EXTS).toContain('.js');
    });

    test('accepts custom configuration', () => {
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

  describe('File System Operations', () => {
    test('walks directory structure', () => {
      // Create test files
      fs.writeFileSync(path.join(tempDir, 'src', 'utils.js'), 'export const helper = () => {};');
      fs.mkdirSync(path.join(tempDir, 'src', 'components'), { recursive: true });
      fs.writeFileSync(path.join(tempDir, 'src', 'components', 'Button.tsx'), 'export const Button = () => {};');
      
      const files = generator.walk('src');
      expect(files.length).toBe(2);
      expect(files.some(f => f.endsWith('utils.js'))).toBe(true);
      expect(files.some(f => f.endsWith('Button.tsx'))).toBe(true);
    });

    test('handles non-existent directory', () => {
      const files = generator.walk('non-existent');
      expect(files).toEqual([]);
    });

    test('creates directories when needed', () => {
      const testPath = path.join(tempDir, 'deep', 'nested', 'test.js');
      generator.createDir(testPath);
      expect(fs.existsSync(path.join(tempDir, 'deep', 'nested'))).toBe(true);
    });

    test('writes file only if missing', () => {
      const filePath = path.join(tempDir, 'test.js');
      const content = 'test content';
      
      // First write should succeed
      const created1 = generator.writeIfMissing(filePath, content);
      expect(created1).toBe(true);
      expect(fs.readFileSync(filePath, 'utf8')).toBe(content);
      
      // Second write should be skipped
      const created2 = generator.writeIfMissing(filePath, 'different content');
      expect(created2).toBe(false);
      expect(fs.readFileSync(filePath, 'utf8')).toBe(content);
    });
  });

  describe('Code Analysis', () => {
    test('detects exported functions', () => {
      const content = `
        export const helper = () => {};
        export function process() {}
        export class DataModel {}
      `;
      
      const exports = [...content.matchAll(PATTERNS.exports)].map(m => m[1]);
      expect(exports).toEqual(['helper', 'process', 'DataModel']);
    });

    test('detects imported modules', () => {
      const content = `
        import axios from 'axios';
        import { test } from 'qtests';
        import utils from './utils';
      `;
      
      const modules = generator.getUsedModules(content);
      expect(modules).toContain('axios');
      expect(modules).toContain('qtests');
      expect(modules).not.toContain('./utils'); // Relative imports filtered out
    });

    test('detects API routes', () => {
      const content = `
        app.get('/users', handler);
        router.post('/auth/login', authHandler);
        app.put('/users/:id', updateHandler);
      `;
      
      const apis = [...content.matchAll(PATTERNS.api)];
      expect(apis.length).toBe(3);
      expect(apis[0][2]).toBe('get');
      expect(apis[0][3]).toBe('/users');
      expect(apis[1][2]).toBe('post');
      expect(apis[1][3]).toBe('/auth/login');
    });

    test('detects qtests usage', () => {
      const withQtests = `import { test } from 'qtests';`;
      const withoutQtests = `import { test } from 'jest';`;
      
      expect(PATTERNS.qtests.test(withQtests)).toBe(true);
      expect(PATTERNS.qtests.test(withoutQtests)).toBe(false);
    });
  });

  describe('Test Generation', () => {
    test('generates unit test content', () => {
      const testContent = generator.createUnitTest(
        'src/utils.js',
        ['helper', 'process'],
        true,
        ['axios']
      );
      
      expect(testContent).toContain('Auto-generated unit test for utils.js');
      expect(testContent).toContain("import { test } from 'qtests';");
      expect(testContent).toContain("jest.mock('axios');");
      expect(testContent).toContain('test(\'helper works\', () => {');
      expect(testContent).toContain('test(\'process works\', () => {');
      expect(testContent).toContain('// TODO: test mod.helper');
    });

    test('generates unit test without qtests', () => {
      const testContent = generator.createUnitTest(
        'src/utils.js',
        ['helper'],
        false,
        []
      );
      
      expect(testContent).not.toContain("import { test } from 'qtests';");
      expect(testContent).toContain('describe(\'utils.js\', () => {');
    });

    test('generates API test content', () => {
      const testContent = generator.createApiTest('get', '/users');
      
      expect(testContent).toContain('Auto-generated API test for GET /users');
      expect(testContent).toContain('describe(\'GET /users\', () => {');
      expect(testContent).toContain('test(\'should succeed\', async () => {');
      expect(testContent).toContain('const res = await request.get(\'/users\');');
      expect(testContent).toContain('expect(res.status).toBe(200);');
      expect(testContent).toContain('test(\'should handle failure\', async () => {');
    });
  });

  describe('Full Generation Process', () => {
    test('generates tests for JavaScript files', () => {
      // Create source file with exports
      const srcFile = path.join(tempDir, 'src', 'calculator.js');
      fs.writeFileSync(srcFile, `
        import axios from 'axios';
        export const add = (a, b) => a + b;
        export const multiply = (a, b) => a * b;
      `);
      
      const results = generator.generate();
      
      expect(results.length).toBe(1);
      expect(results[0].type).toBe('unit');
      expect(results[0].file).toContain('calculator.test.js');
      
      // Check generated test file exists and has correct content
      const testFile = path.join(tempDir, 'src', 'calculator.test.js');
      expect(fs.existsSync(testFile)).toBe(true);
      
      const testContent = fs.readFileSync(testFile, 'utf8');
      expect(testContent).toContain('add works');
      expect(testContent).toContain('multiply works');
      expect(testContent).toContain("jest.mock('axios');");
    });

    test('generates tests for API files', () => {
      // Create source file with API routes
      const srcFile = path.join(tempDir, 'src', 'routes.js');
      fs.writeFileSync(srcFile, `
        export const setupRoutes = (app) => {
          app.get('/api/users', getUsers);
          app.post('/api/auth', authenticate);
        };
      `);
      
      const results = generator.generate();
      
      // Should generate both unit test (for export) and API tests (for routes)
      expect(results.length).toBe(3); // 1 unit + 2 API tests
      
      const unitTests = results.filter(r => r.type === 'unit');
      const apiTests = results.filter(r => r.type === 'api');
      
      expect(unitTests.length).toBe(1);
      expect(apiTests.length).toBe(2);
      
      expect(apiTests[0].file).toContain('__get.test.ts');
      expect(apiTests[1].file).toContain('__post.test.ts');
    });

    test('skips generation for existing files', () => {
      // Create source file
      const srcFile = path.join(tempDir, 'src', 'existing.js');
      fs.writeFileSync(srcFile, 'export const func = () => {};');
      
      // Create test file first
      const testFile = path.join(tempDir, 'src', 'existing.test.js');
      fs.writeFileSync(testFile, 'existing test');
      
      const results = generator.generate();
      
      expect(results.length).toBe(0); // No new files generated
      expect(fs.readFileSync(testFile, 'utf8')).toBe('existing test'); // Original content preserved
    });

    test('creates Jest configuration files', () => {
      generator.generate();
      
      expect(fs.existsSync(path.join(tempDir, 'jest.config.js'))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, 'tests', 'setup.ts'))).toBe(true);
      
      const jestConfig = fs.readFileSync(path.join(tempDir, 'jest.config.js'), 'utf8');
      expect(jestConfig).toContain('preset: \'ts-jest\'');
      expect(jestConfig).toContain('testEnvironment: \'node\'');
    });
  });

  describe('CLI Argument Parsing', () => {
    test('parses basic arguments', () => {
      const args = ['node', 'script', '--src', 'lib', '--test-dir', 'spec'];
      const options = parseArgs(args);
      
      expect(options.SRC_DIR).toBe('lib');
      expect(options.TEST_DIR).toBe('spec');
    });

    test('parses short arguments', () => {
      const args = ['node', 'script', '-s', 'app', '-t', 'tests'];
      const options = parseArgs(args);
      
      expect(options.SRC_DIR).toBe('app');
      expect(options.TEST_DIR).toBe('tests');
    });

    test('handles no arguments', () => {
      const args = ['node', 'script'];
      const options = parseArgs(args);
      
      expect(Object.keys(options).length).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    test('handles TypeScript files', () => {
      const srcFile = path.join(tempDir, 'src', 'types.ts');
      fs.writeFileSync(srcFile, `
        export interface User {}
        export const validateUser = (user: User): boolean => true;
      `);
      
      const results = generator.generate();
      expect(results.length).toBe(1);
      expect(results[0].file).toContain('types.test.ts');
    });

    test('handles React JSX files', () => {
      const srcFile = path.join(tempDir, 'src', 'Component.jsx');
      fs.writeFileSync(srcFile, `
        export const Component = () => <div>Hello</div>;
      `);
      
      const results = generator.generate();
      expect(results.length).toBe(1);
      expect(results[0].file).toContain('Component.test.jsx');
    });

    test('ignores non-JavaScript files', () => {
      fs.writeFileSync(path.join(tempDir, 'src', 'data.json'), '{}');
      fs.writeFileSync(path.join(tempDir, 'src', 'style.css'), 'body {}');
      fs.writeFileSync(path.join(tempDir, 'src', 'readme.md'), '# Readme');
      
      const results = generator.generate();
      expect(results.length).toBe(0);
    });

    test('handles files with no exports', () => {
      const srcFile = path.join(tempDir, 'src', 'config.js');
      fs.writeFileSync(srcFile, `
        const config = { api: 'localhost' };
        // No exports
      `);
      
      const results = generator.generate();
      expect(results.length).toBe(0);
    });

    test('handles complex API route patterns', () => {
      const srcFile = path.join(tempDir, 'src', 'complex-routes.js');
      fs.writeFileSync(srcFile, `
        app.get("/api/users/:id", handler);
        router.post('/auth/token', tokenHandler);
        app.delete(\`/api/posts/\${id}\`, deleteHandler);
      `);
      
      const results = generator.generate();
      const apiTests = results.filter(r => r.type === 'api');
      expect(apiTests.length).toBe(3);
    });
  });
});

describe('CLI Integration', () => {
  test('CLI script exists and is executable', () => {
    const cliPath = path.join(__dirname, '..', 'bin', 'qtests-generate');
    expect(fs.existsSync(cliPath)).toBe(true);
    
    const stats = fs.statSync(cliPath);
    expect(stats.mode & 0o111).toBeTruthy(); // Check executable bit
  });

  test('CLI shows help when requested', () => {
    try {
      const output = execSync('node bin/qtests-generate --help', { 
        cwd: path.join(__dirname, '..'),
        encoding: 'utf8',
        timeout: 5000
      });
      
      expect(output).toContain('qtests Test Generator');
      expect(output).toContain('USAGE:');
      expect(output).toContain('OPTIONS:');
      expect(output).toContain('--src');
      expect(output).toContain('--test-dir');
    } catch (error) {
      // Help command exits with code 0, so this shouldn't throw
      fail('CLI help command failed: ' + error.message);
    }
  });

  test('CLI shows version when requested', () => {
    try {
      const output = execSync('node bin/qtests-generate --version', { 
        cwd: path.join(__dirname, '..'),
        encoding: 'utf8',
        timeout: 5000
      });
      
      expect(output).toMatch(/qtests v\d+\.\d+\.\d+/);
    } catch (error) {
      // Version command exits with code 0, so this shouldn't throw
      fail('CLI version command failed: ' + error.message);
    }
  });
});