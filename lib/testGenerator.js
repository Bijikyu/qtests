/**
 * Test Generator for qtests Framework
 * 
 * Automatically generates unit tests and API tests by scanning source code.
 * Analyzes JavaScript/TypeScript files to detect exports, imports, and API routes,
 * then creates appropriate test files with proper structure and mocking.
 * 
 * Features:
 * - Unit test generation for exported functions/classes
 * - API test generation for Express routes
 * - Automatic mock setup for known libraries
 * - Jest configuration scaffolding
 * - Support for qtests framework integration
 */

const fs = require('fs');
const path = require('path');

// Configuration constants
const DEFAULT_CONFIG = {
  SRC_DIR: 'src',
  TEST_DIR: 'tests/integration',
  KNOWN_MOCKS: ['axios', 'node-fetch', 'pg', 'mongoose', 'fs', 'redis'],
  VALID_EXTS: ['.ts', '.js', '.tsx', '.jsx']
};

// Regex patterns for code analysis
const PATTERNS = {
  qtests: /from ['"]qtests['"]/,
  api: /\b(app|router)\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/gi,
  exports: /^\s*export\s+(?:const|function|class)\s+([a-zA-Z0-9_]+)/gm,
  imports: /from ['"]([^'"]+)['"]/g
};

class TestGenerator {
  constructor(options = {}) {
    this.config = { ...DEFAULT_CONFIG, ...options };
    this.scanned = [];
  }

  /**
   * Recursively walk directory and return all file paths
   */
  walk(dir) {
    if (!fs.existsSync(dir)) {
      return [];
    }
    
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
      const full = path.resolve(dir, entry.name);
      return entry.isDirectory() ? this.walk(full) : full;
    });
  }

  /**
   * Generate test file path based on source file and test type
   */
  getRelativeTestPath(file, type = 'unit') {
    const rel = path.relative(this.config.SRC_DIR, file);
    return type === 'unit'
      ? path.join(path.dirname(file), `${path.basename(file, path.extname(file))}.test${path.extname(file)}`)
      : path.join(this.config.TEST_DIR, rel.replace(/\.[tj]sx?$/, `.test.ts`).replace(/[\\/]/g, '__'));
  }

  /**
   * Create directory if it doesn't exist
   */
  createDir(p) {
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Write file only if it doesn't already exist
   */
  writeIfMissing(p, content) {
    if (!fs.existsSync(p)) {
      this.createDir(p);
      fs.writeFileSync(p, content, 'utf8');
      return true;
    }
    return false;
  }

  /**
   * Extract imported modules from file content
   */
  getUsedModules(content) {
    return [...content.matchAll(PATTERNS.imports)]
      .map(m => m[1])
      .filter(x => !x.startsWith('.') && !x.startsWith('/'));
  }

  /**
   * Generate unit test content for a file
   */
  createUnitTest(file, exports, usesQtests, mocks) {
    const lines = [`// Auto-generated unit test for ${path.basename(file)}`];
    
    if (usesQtests) {
      lines.push(`import { test } from 'qtests';`);
    }
    
    mocks.forEach(lib => {
      lines.push(`jest.mock('${lib}');`);
    });
    
    lines.push(`import * as mod from './${path.basename(file)}';`, '');
    lines.push(`describe('${path.basename(file)}', () => {`);
    
    for (const fn of exports) {
      lines.push(`  test('${fn} works', () => {`);
      lines.push(`    // TODO: test mod.${fn}`);
      lines.push('  });');
    }
    
    lines.push('});\n');
    return lines.join('\n');
  }

  /**
   * Generate API test content for an endpoint
   */
  createApiTest(method, route) {
    const lines = [`// Auto-generated API test for ${method.toUpperCase()} ${route}`];
    lines.push(`import request from '../../src/app';`, '');
    lines.push(`describe('${method.toUpperCase()} ${route}', () => {`);
    lines.push(`  test('should succeed', async () => {`);
    lines.push(`    const res = await request.${method.toLowerCase()}('${route}');`);
    lines.push(`    expect(res.status).toBe(200);`);
    lines.push('  });', '');
    lines.push('  test(\'should handle failure\', async () => {');
    lines.push(`    const res = await request.${method.toLowerCase()}('${route}').send({ bad: true });`);
    lines.push(`    expect(res.status).toBeGreaterThanOrEqual(400);`);
    lines.push('  });');
    lines.push('});\n');
    return lines.join('\n');
  }

  /**
   * Analyze a single file and generate appropriate tests
   */
  analyze(file) {
    const ext = path.extname(file);
    if (!this.config.VALID_EXTS.includes(ext)) {
      return;
    }

    const content = fs.readFileSync(file, 'utf8');
    const usesQtests = PATTERNS.qtests.test(content);
    const imports = this.getUsedModules(content);
    const mockTargets = imports.filter(i => 
      this.config.KNOWN_MOCKS.includes(i) && i !== 'qtests'
    );

    // Generate unit tests for exported functions/classes
    const exports = [...content.matchAll(PATTERNS.exports)].map(m => m[1]);
    if (exports.length > 0) {
      const testPath = this.getRelativeTestPath(file, 'unit');
      const created = this.writeIfMissing(
        testPath, 
        this.createUnitTest(file, exports, usesQtests, mockTargets)
      );
      if (created) {
        this.scanned.push({ 
          type: 'unit', 
          file: path.relative('.', testPath) 
        });
      }
    }

    // Generate API tests for detected routes
    const apis = [...content.matchAll(PATTERNS.api)];
    for (const [, , method, route] of apis) {
      const testPath = this.getRelativeTestPath(file, 'api')
        .replace(/\.test\.ts$/, `__${method.toLowerCase()}.test.ts`);
      const created = this.writeIfMissing(
        testPath, 
        this.createApiTest(method, route)
      );
      if (created) {
        this.scanned.push({ 
          type: 'api', 
          file: path.relative('.', testPath) 
        });
      }
    }
  }

  /**
   * Create Jest configuration and setup files
   */
  scaffoldJestSetup() {
    const config = `
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/src', '<rootDir>/tests'],
};
`.trim();

    const setup = `
// tests/setup.ts
let server;

beforeAll(async () => {
  const app = require('../src/app').default || require('../src/app');
  server = app.listen(4000, () => console.log('Test server started'));
});

afterAll(async () => {
  if (server) server.close();
});
`.trim();

    this.writeIfMissing('jest.config.js', config);
    this.writeIfMissing('tests/setup.ts', setup);
  }

  /**
   * Main generator function - scans source directory and generates tests
   */
  generate() {
    console.log(`Scanning ${this.config.SRC_DIR} directory for test generation...`);
    
    const files = this.walk(this.config.SRC_DIR);
    files.forEach(file => this.analyze(file));
    
    this.scaffoldJestSetup();

    if (this.scanned.length === 0) {
      console.log('✅ All tests already exist. Nothing to generate.');
    } else {
      console.log(`✅ Generated ${this.scanned.length} new test files:`);
      this.scanned.forEach(({ type, file }) => {
        const label = type === 'unit' ? '📦 Unit' : '🌐 API';
        console.log(`  ${label} → ${file}`);
      });
    }

    return this.scanned;
  }

  /**
   * Get generation results
   */
  getResults() {
    return this.scanned;
  }
}

module.exports = { TestGenerator, DEFAULT_CONFIG, PATTERNS };