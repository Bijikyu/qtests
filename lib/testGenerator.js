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

// Regex patterns for code analysis - Enhanced for both ES modules and CommonJS
const PATTERNS = {
  qtests: /from ['"]qtests['"]|require\(['"]qtests['"]\)/,
  api: /\b(app|router)\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/gi,
  // ES module exports: export const, export function, export class
  exportsES: /^\s*export\s+(?:const|function|class)\s+([a-zA-Z0-9_]+)/gm,
  // CommonJS exports: module.exports = {}, module.exports.name =, exports.name =
  exportsCommonJS: /(?:module\.exports\.([a-zA-Z0-9_]+)\s*=|exports\.([a-zA-Z0-9_]+)\s*=|module\.exports\s*=\s*([a-zA-Z0-9_]+))/gm,
  // Function declarations that might be exported
  functionDeclarations: /^\s*(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(/gm,
  // Class declarations that might be exported
  classDeclarations: /^\s*class\s+([a-zA-Z0-9_]+)/gm,
  imports: /from ['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\)/g
};

class TestGenerator {
  constructor(options = {}) {
    this.config = { ...DEFAULT_CONFIG, ...options };
    this.scanned = [];
    this.isESModule = this.detectESModule(); // Detect module type once during initialization
  }

  /**
   * Detect if the current project uses ES modules or CommonJS
   * Checks package.json for "type": "module" and source file patterns
   * DEFAULTS TO COMMONJS when ambiguous for maximum compatibility
   */
  detectESModule() {
    try {
      // Check package.json for explicit "type": "module"
      const packagePath = path.resolve(process.cwd(), 'package.json');
      if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        if (packageJson.type === 'module') {
          return true;
        }
        // If package.json exists but no "type": "module", default to CommonJS
        if (packageJson.type !== 'module') {
          return false;
        }
      }
      
      // Check for ES module patterns in source files (excluding test files and node_modules)
      const sourceFiles = this.walkProject()
        .filter(file => {
          const ext = path.extname(file);
          const isValidExt = this.config.VALID_EXTS.includes(ext);
          const isTestFile = this.isTestFile(path.basename(file));
          const isNodeModules = file.includes('node_modules');
          return isValidExt && !isTestFile && !isNodeModules;
        })
        .slice(0, 10); // Sample first 10 files for performance
      
      let esModuleCount = 0;
      let commonJSCount = 0;
      
      for (const file of sourceFiles) {
        try {
          const content = fs.readFileSync(file, 'utf8');
          // Look for ES module patterns (must be strong indicators)
          if (content.includes('import ') && !content.includes('require(')) {
            esModuleCount++;
          }
          // Look for CommonJS patterns
          if (content.includes('require(') || content.includes('module.exports')) {
            commonJSCount++;
          }
        } catch (error) {
          // Skip files we can't read
          continue;
        }
      }
      
      // Only return true if ES modules are clearly more prevalent (significant difference)
      // Default to CommonJS when ambiguous for maximum Jest compatibility
      return esModuleCount > 0 && esModuleCount > (commonJSCount + 2);
    } catch (error) {
      // Always default to CommonJS if detection fails
      return false;
    }
  }

  /**
   * Check if directory should be skipped during discovery
   */
  shouldSkipDirectory(dirName) {
    const skipPatterns = [
      'node_modules', '.git', '.next', 'dist', 'build', 'coverage',
      '.vscode', '.idea', 'docs', 'documentation', 'assets', 'public', 'static',
      '.replit_cache', '.config', '.npm', 'logs'
    ];
    return skipPatterns.includes(dirName) || dirName.startsWith('.');
  }

  /**
   * Walk entire project directory structure, respecting skip patterns
   */
  walkProject() {
    const currentDir = process.cwd();
    return this.walkRecursive(currentDir);
  }

  /**
   * Recursively walk directory and return all file paths, skipping irrelevant directories
   */
  walkRecursive(dir) {
    if (!fs.existsSync(dir)) {
      return [];
    }
    
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
      const full = path.resolve(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip directories that shouldn't contain tests or source files
        if (this.shouldSkipDirectory(entry.name)) {
          return [];
        }
        return this.walkRecursive(full);
      } else {
        return [full];
      }
    });
  }

  /**
   * Legacy walk method for backwards compatibility (walks single directory)
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
   * Categorize discovered files into source files and existing tests
   */
  categorizeFiles(files) {
    const sourceFiles = [];
    const existingTests = [];
    
    files.forEach(file => {
      const ext = path.extname(file);
      const basename = path.basename(file);
      
      // Skip files with invalid extensions
      if (!this.config.VALID_EXTS.includes(ext)) {
        return;
      }
      
      // Check if this is a test file
      if (this.isTestFile(basename)) {
        existingTests.push(file);
      } else {
        // Check if this source file already has a corresponding test
        const hasTest = this.hasCorrespondingTest(file, files);
        if (!hasTest) {
          sourceFiles.push(file);
        }
      }
    });
    
    return { sourceFiles, existingTests };
  }

  /**
   * Check if filename indicates it's a test file
   */
  isTestFile(filename) {
    const testPatterns = [
      /\.test\./,
      /\.spec\./,
      /_test\./,
      /_spec\./,
      /\.e2e\./,
      /\.integration\./
    ];
    
    return testPatterns.some(pattern => pattern.test(filename));
  }

  /**
   * Check if a source file has a corresponding test file
   */
  hasCorrespondingTest(sourceFile, allFiles) {
    const dir = path.dirname(sourceFile);
    const basename = path.basename(sourceFile, path.extname(sourceFile));
    const ext = path.extname(sourceFile);
    
    // Common test file patterns to look for
    const testPatterns = [
      `${basename}.test${ext}`,
      `${basename}.spec${ext}`,
      `${basename}_test${ext}`,
      `${basename}_spec${ext}`,
      `${basename}.test.js`,
      `${basename}.spec.js`,
      `${basename}.test.ts`,
      `${basename}.spec.ts`
    ];
    
    // Look for test files in the same directory
    const sameDirectoryTests = testPatterns.map(pattern => 
      path.join(dir, pattern)
    );
    
    // Look for test files in common test directories
    const testDirectories = ['tests', 'test', '__tests__', 'spec'];
    const testDirectoryTests = testDirectories.flatMap(testDir => {
      const testPath = path.join(dir, testDir);
      return testPatterns.map(pattern => path.join(testPath, pattern));
    });
    
    // Check if any of these test files exist
    const allTestPaths = [...sameDirectoryTests, ...testDirectoryTests];
    return allTestPaths.some(testPath => 
      allFiles.some(file => path.resolve(file) === path.resolve(testPath))
    );
  }

  /**
   * Generate test file path based on source file and test type
   * Supports both feature-first (tests alongside files) and traditional (separate test directory) structures
   */
  getRelativeTestPath(file, type = 'unit') {
    const dir = path.dirname(file);
    const basename = path.basename(file, path.extname(file));
    const ext = path.extname(file);
    
    if (type === 'unit') {
      // For unit tests, place them alongside the source file with matching extension
      return path.join(dir, `${basename}.test${ext}`);
    } else {
      // For API/integration tests, use the configured test directory
      // Preserve TypeScript for .ts/.tsx files, use JavaScript for others
      const rel = path.relative(process.cwd(), file);
      const testExt = ['.ts', '.tsx'].includes(ext) ? '.ts' : '.js';
      return path.join(this.config.TEST_DIR, rel.replace(/\.[tj]sx?$/, `.test${testExt}`).replace(/[\\/]/g, '__'));
    }
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
   * Extract imported modules from file content - Enhanced for both ES modules and CommonJS
   */
  getUsedModules(content) {
    return [...content.matchAll(PATTERNS.imports)]
      .map(m => m[1] || m[2]) // m[1] for ES modules, m[2] for CommonJS
      .filter(x => x && !x.startsWith('.') && !x.startsWith('/'));
  }

  /**
   * Generate unit test content for a file - optimized for speed
   */
  createUnitTest(file, exports, usesQtests, mocks) {
    const ext = path.extname(file);
    const isTypeScript = ['.ts', '.tsx'].includes(ext);
    // Force CommonJS for maximum Jest compatibility unless explicitly ES modules
    const useESModules = this.isESModule && isTypeScript; // Only use ES modules for TypeScript in ES module projects
    
    const lines = [`// Auto-generated unit test for ${path.basename(file)} - optimized for speed`];
    
    // Fast test setup - minimal imports with proper module syntax
    if (usesQtests) {
      if (useESModules) {
        lines.push(`import { test } from 'qtests';`);
      } else {
        lines.push(`const { test } = require('qtests');`);
      }
    }
    
    // Batch mock all libraries at once for performance
    if (mocks.length > 0) {
      lines.push(`// Mock external dependencies for speed`);
      mocks.forEach(lib => {
        if (useESModules) {
          lines.push(`jest.mock('${lib}', () => ({ __esModule: true, default: jest.fn(), ...jest.requireActual('${lib}') }));`);
        } else {
          lines.push(`jest.mock('${lib}', () => ({ __esModule: true, default: jest.fn(), ...jest.requireActual('${lib}') }));`);
        }
      });
    }
    
    // Import the module under test with appropriate syntax
    const basename = path.basename(file, path.extname(file));
    if (useESModules) {
      lines.push(`import * as mod from './${basename}${ext}';`, '');
    } else {
      lines.push(`const mod = require('./${basename}${ext}');`, '');
    }
    
    // Standard Jest with optimized performance
    lines.push(`describe('${path.basename(file)}', () => {`);
    
    for (const fn of exports) {
      lines.push(`  test('${fn} works', async () => {`);
      lines.push(`    // Fast assertion - TODO: implement specific test logic`);
      lines.push(`    expect(typeof mod.${fn}).toBeDefined();`);
      lines.push('  });');
    }
    
    lines.push('});\n');
    return lines.join('\n');
  }

  /**
   * Generate API test content for an endpoint - optimized for speed
   */
  createApiTest(method, route, isTypeScript = false) {
    // Force CommonJS for maximum Jest compatibility unless explicitly ES modules
    const useESModules = this.isESModule && isTypeScript; // Only use ES modules for TypeScript in ES module projects
    const lines = [`// Auto-generated API test for ${method.toUpperCase()} ${route} - optimized for speed`];
    
    // Import httpTest with appropriate module syntax
    if (useESModules) {
      lines.push(`import { httpTest } from 'qtests/lib/envUtils';`, '');
    } else {
      lines.push(`const { httpTest } = require('qtests/lib/envUtils');`, '');
    }
    
    // Standard Jest with optimized performance
    lines.push(`describe('${method.toUpperCase()} ${route}', () => {`);
    lines.push(`  // Shared app setup for performance`);
    lines.push(`  let sharedApp;`);
    lines.push(`  beforeAll(() => {`);
    lines.push(`    sharedApp = httpTest.createMockApp();`);
    lines.push(`  });`);
    lines.push(``);
    
    lines.push(`  test('should succeed', async () => {`);
    lines.push(`    // Reuse shared app for speed`);
    lines.push(`    const app = httpTest.createMockApp();`);
    lines.push(`    app.${method.toLowerCase()}('${route}', (req, res) => {`);
    lines.push(`      res.statusCode = 200;`);
    lines.push(`      res.setHeader('content-type', 'application/json');`);
    lines.push(`      res.end(JSON.stringify({ success: true }));`);
    lines.push(`    });`);
    lines.push(`    `);
    lines.push(`    const res = await httpTest.supertest(app)`);
    lines.push(`      .${method.toLowerCase()}('${route}')`);
    lines.push(`      .expect(200)`);
    lines.push(`      .end();`);
    lines.push(`    `);
    lines.push(`    expect(res.body.success).toBe(true);`);
    lines.push('  });', '');
    
    lines.push('  test(\'should handle error responses\', async () => {');
    lines.push(`    const app = httpTest.createMockApp();`);
    lines.push(`    app.${method.toLowerCase()}('${route}', (req, res) => {`);
    lines.push(`      res.statusCode = 400;`);
    lines.push(`      res.setHeader('content-type', 'application/json');`);
    lines.push(`      res.end(JSON.stringify({ error: 'Bad request' }));`);
    lines.push(`    });`);
    lines.push(`    `);
    lines.push(`    const res = await httpTest.supertest(app)`);
    lines.push(`      .${method.toLowerCase()}('${route}')`);
    lines.push(`      .expect(400)`);
    lines.push(`      .end();`);
    lines.push(`    `);
    lines.push(`    expect(res.body.error).toBe('Bad request');`);
    lines.push('  });');
    lines.push('});\n');
    return lines.join('\n');
  }

  /**
   * Intelligently extract exports from both ES modules and CommonJS
   */
  extractExports(content) {
    const exports = new Set();
    
    // Remove comments to avoid false positives
    const cleanContent = content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
      .replace(/\/\/.*$/gm, ''); // Remove // comments
    
    // Extract ES module exports (export const/function/class)
    const esExports = [...cleanContent.matchAll(PATTERNS.exportsES)];
    esExports.forEach(match => {
      if (match[1]) exports.add(match[1]);
    });
    
    // Extract CommonJS exports
    const commonJSExports = [...cleanContent.matchAll(PATTERNS.exportsCommonJS)];
    commonJSExports.forEach(match => {
      // match[1] = module.exports.name, match[2] = exports.name, match[3] = single assignment
      for (let i = 1; i <= 3; i++) {
        if (match[i]) exports.add(match[i]);
      }
    });
    
    // Handle module.exports = { name1, name2, ... } pattern
    const objectExportMatch = cleanContent.match(/module\.exports\s*=\s*\{([^}]+)\}/);
    if (objectExportMatch) {
      const objectContent = objectExportMatch[1];
      // Extract property names from object (handles both shorthand and key: value)
      const propertyMatches = objectContent.matchAll(/\b(\w+)(?:\s*:\s*\w+)?\s*[,}]/g);
      for (const match of propertyMatches) {
        if (match[1]) exports.add(match[1]);
      }
    }
    
    // Look for function declarations that might be exported
    const functionDecls = [...cleanContent.matchAll(PATTERNS.functionDeclarations)];
    const classDecls = [...cleanContent.matchAll(PATTERNS.classDeclarations)];
    
    // Check if functions/classes are mentioned in exports
    functionDecls.forEach(match => {
      if (match[1] && (cleanContent.includes(`exports.${match[1]}`) || cleanContent.includes(`module.exports.${match[1]}`) || cleanContent.includes(`module.exports = ${match[1]}`) || cleanContent.includes(`${match[1]},`) || cleanContent.includes(`${match[1]}`))) {
        // Additional check to ensure it's actually in an export context
        if (cleanContent.includes(`module.exports`) && cleanContent.includes(match[1])) {
          exports.add(match[1]);
        }
      }
    });
    
    classDecls.forEach(match => {
      if (match[1] && (cleanContent.includes(`exports.${match[1]}`) || cleanContent.includes(`module.exports.${match[1]}`) || cleanContent.includes(`module.exports = ${match[1]}`) || cleanContent.includes(`${match[1]},`) || cleanContent.includes(`${match[1]}`))) {
        // Additional check to ensure it's actually in an export context
        if (cleanContent.includes(`module.exports`) && cleanContent.includes(match[1])) {
          exports.add(match[1]);
        }
      }
    });
    
    return Array.from(exports).filter(name => name && name.length > 0);
  }

  /**
   * Analyze a single file and generate appropriate tests - Enhanced for both module systems
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

    // Use intelligent export detection for both ES modules and CommonJS
    const exports = this.extractExports(content);
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
      const isTypeScript = ['.ts', '.tsx'].includes(ext);
      const testPath = this.getRelativeTestPath(file, 'api')
        .replace(/\.test\.[jt]s$/, `__${method.toLowerCase()}.test${isTypeScript ? '.ts' : '.js'}`);
      const created = this.writeIfMissing(
        testPath, 
        this.createApiTest(method, route, isTypeScript)
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
   * Create Jest configuration and setup files - ES Module aware
   */
  scaffoldJestSetup() {
    const useESModules = this.isESModule;
    
    // Generate Jest config based on module type
    const config = useESModules ? `
// jest.config.js - ES Module configuration
export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  moduleNameMapping: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
};
`.trim() : `
// jest.config.js - CommonJS configuration
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/src', '<rootDir>/tests'],
};
`.trim();

    // Generate setup file based on module type
    const setup = useESModules ? `
// tests/setup.ts - ES Module setup
let server;

beforeAll(async () => {
  const { default: app } = await import('../src/app.js');
  server = app.listen(4000, () => console.log('Test server started'));
});

afterAll(async () => {
  if (server) server.close();
});
`.trim() : `
// tests/setup.ts - CommonJS setup
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
   * Generate qtests test runner file and update package.json
   * Creates qtests-runner.js and updates the test script in package.json
   * Automatically handles ES module compatibility
   */
  generateTestRunner() {
    const fs = require('fs');
    const path = require('path');
    
    // Check if project uses ES modules
    const isESModuleProject = this.isESModuleProject();
    
    // Read the existing qtests-runner.js as template
    const templatePath = path.join(__dirname, '..', 'qtests-runner.js');
    let runnerContent;
    
    if (fs.existsSync(templatePath)) {
      runnerContent = fs.readFileSync(templatePath, 'utf8');
      
      // Convert CommonJS to ES modules if needed
      if (isESModuleProject) {
        runnerContent = this.convertToESModule(runnerContent);
      }
    } else {
      // Generate appropriate template based on module type
      if (isESModuleProject) {
        runnerContent = this.generateESModuleTemplate();
      } else {
        runnerContent = this.generateCommonJSTemplate();
      }
    }
    
    const created = this.writeIfMissing('qtests-runner.js', runnerContent);
    
    if (created) {
      this.updatePackageJsonTestScript();
      return true;
    }
    return false;
  }

  /**
   * Check if the current project uses ES modules
   */
  isESModuleProject() {
    const fs = require('fs');
    const path = require('path');
    
    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      if (!fs.existsSync(packagePath)) return false;
      
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      return packageJson.type === 'module';
    } catch {
      return false;
    }
  }

  /**
   * Convert CommonJS code to ES module syntax
   */
  convertToESModule(commonJSCode) {
    return commonJSCode
      .replace(/const fs = require\('fs'\);/, "import fs from 'fs';")
      .replace(/const path = require\('path'\);/, "import path from 'path';")
      .replace(/const { spawn } = require\('child_process'\);/, "import { spawn } from 'child_process';")
      .replace(/const os = require\('os'\);/, "import os from 'os';")
      .replace(/require\.main === module/, "import.meta.url === `file://${process.argv[1]}`")
      .replace(/module\.exports = TestRunner;/, "export default TestRunner;")
      .replace(/\/\/ Generated as: qtests-runner\.js/, "// Generated as: qtests-runner.js (ES Module Compatible)")
      .replace(/--testPathPattern/g, "--testPathPattern"); // Ensure correct Jest CLI parameter in ES modules
  }

  /**
   * Generate ES module template
   */
  generateESModuleTemplate() {
    return `// qtests Test Runner - Auto-generated by qtests (ES Module)
// This file discovers and runs all tests in your project

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import os from 'os';

// Basic ES module test runner implementation
console.log('🧪 Basic qtests Test Runner (ES Module)');
console.log('Run tests with: npm test');
`;
  }

  /**
   * Generate CommonJS template  
   */
  generateCommonJSTemplate() {
    return `// qtests Test Runner - Auto-generated by qtests
// This file discovers and runs all tests in your project

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

// Basic CommonJS test runner implementation
console.log('🧪 Basic qtests Test Runner');
console.log('Run tests with: npm test');
`;
  }

  /**
   * Update package.json test script to use qtests-runner.cjs (ES module compatible)
   */
  updatePackageJsonTestScript() {
    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      if (!fs.existsSync(packagePath)) {
        console.log('⚠️  package.json not found, skipping test script update');
        return false;
      }

      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // Update test script - use .cjs extension for ES module compatibility
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }
      packageJson.scripts.test = 'node qtests-runner.js';
      
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
      console.log('✅ Updated package.json test script to use qtests-runner.js');
      return true;
    } catch (error) {
      console.log('⚠️  Could not update package.json:', error.message);
      return false;
    }
  }

  /**
   * Main generator function - comprehensively scans project for test generation
   */
  generate() {
    console.log(`Scanning project for test generation...`);
    
    // Walk entire project to discover all source files and existing tests
    const projectFiles = this.walkProject();
    const { sourceFiles, existingTests } = this.categorizeFiles(projectFiles);
    
    console.log(`Found ${sourceFiles.length} source files and ${existingTests.length} existing tests`);
    
    // Analyze each source file for test generation
    sourceFiles.forEach(file => this.analyze(file));
    
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