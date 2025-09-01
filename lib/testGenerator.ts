/**
 * Test Generator for qtests Framework - TypeScript Implementation
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
 * - TypeScript ES module only (no version duplication)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Type definitions
interface TestGeneratorConfig {
  SRC_DIR: string;
  TEST_DIR: string;
  KNOWN_MOCKS: string[];
  VALID_EXTS: string[];
}

interface ScannedTest {
  type: 'unit' | 'api';
  file: string;
}

interface FileCategorization {
  sourceFiles: string[];
  existingTests: string[];
}

// Configuration constants - TypeScript ES module only
const DEFAULT_CONFIG: TestGeneratorConfig = {
  SRC_DIR: '.',
  TEST_DIR: 'generated-tests',
  KNOWN_MOCKS: ['axios', 'node-fetch', 'pg', 'mongoose', 'fs', 'redis'],
  VALID_EXTS: ['.ts', '.js', '.tsx', '.jsx']
};

// Regex patterns for code analysis - Enhanced for both ES modules and CommonJS
const PATTERNS = {
  qtests: /from ['"]qtests['"]|require\(['"]qtests['"]\)/,
  api: /\b(app|router)\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/gi,
  // ES module exports: export const, export function, export class
  exportsES: /^\s*export\s+(?:const|function|class)\s+([a-zA-Z0-9_]+)/gm,
  // ES module named exports: export { name1, name2, name3 }
  exportsNamed: /export\s*\{\s*([^}]+)\s*\}/g,
  // ES module default exports: export default SomeName
  exportsDefault: /export\s+default\s+([a-zA-Z0-9_]+)/g,
  // CommonJS exports: module.exports = {}, module.exports.name =, exports.name =
  exportsCommonJS: /(?:module\.exports\.([a-zA-Z0-9_]+)\s*=|exports\.([a-zA-Z0-9_]+)\s*=|module\.exports\s*=\s*([a-zA-Z0-9_]+))/gm,
  // Function declarations that might be exported
  functionDeclarations: /^\s*(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(/gm,
  // Class declarations that might be exported
  classDeclarations: /^\s*class\s+([a-zA-Z0-9_]+)/gm,
  imports: /from ['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\)/g
};

class TestGenerator {
  private config: TestGeneratorConfig;
  private scanned: ScannedTest[];
  private isESModule: boolean;

  constructor(options: Partial<TestGeneratorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...options };
    this.scanned = [];
    this.isESModule = this.detectESModule(); // Detect module type once during initialization
  }

  /**
   * Detect if the current project uses ES modules or CommonJS
   * Since we're now "TypeScript ES module only", this defaults to true for TypeScript projects
   */
  private detectESModule(): boolean {
    try {
      // Check package.json for explicit "type": "module"
      const packagePath = path.resolve(process.cwd(), 'package.json');
      if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        if (packageJson.type === 'module') {
          return true;
        }
        // For TypeScript ES module only approach, prefer ES modules when TypeScript is detected
        if (packageJson.devDependencies?.typescript || packageJson.dependencies?.typescript) {
          return true;
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
          // Look for ES module patterns (import OR export statements)
          if (content.includes('import ') || content.includes('export ')) {
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
      
      // For TypeScript ES module only approach, prefer ES modules when equal or when TypeScript files are present
      if (esModuleCount === 0 && commonJSCount === 0) {
        return true; // Default to ES modules for TypeScript ES module only approach
      }
      if (esModuleCount === 0) {
        return false; // No ES module patterns found, default to CommonJS
      }
      return esModuleCount >= commonJSCount; // Changed from > to >= to prefer ES modules
    } catch (error) {
      // Default to ES modules for TypeScript ES module only approach
      return true;
    }
  }

  /**
   * Check if directory should be skipped during discovery
   */
  private shouldSkipDirectory(dirName: string): boolean {
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
  private walkProject(): string[] {
    const currentDir = process.cwd();
    return this.walkRecursive(currentDir);
  }

  /**
   * Recursively walk directory and return all file paths, skipping irrelevant directories
   */
  private walkRecursive(dir: string): string[] {
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
  private walk(dir: string): string[] {
    if (!fs.existsSync(dir)) {
      return [];
    }
    
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
      const full = path.resolve(dir, entry.name);
      return entry.isDirectory() ? this.walk(full) : [full];
    });
  }

  /**
   * Categorize discovered files into source files and existing tests
   */
  private categorizeFiles(files: string[]): FileCategorization {
    const sourceFiles: string[] = [];
    const existingTests: string[] = [];
    
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
  private isTestFile(filename: string): boolean {
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
  private hasCorrespondingTest(sourceFile: string, allFiles: string[]): boolean {
    const dir = path.dirname(sourceFile);
    const basename = path.basename(sourceFile, path.extname(sourceFile));
    const ext = path.extname(sourceFile);
    
    // Common test file patterns to look for - TypeScript ES module only
    const testPatterns = [
      `${basename}.test.ts`,
      `${basename}GeneratedTest.test.ts`,  // Generated unit tests  
      `${basename}.spec.ts`,
      `${basename}_test.ts`,
      `${basename}_spec.ts`,
      `${basename}.test${ext}`,
      `${basename}.spec${ext}`
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
    
    // Normalize paths for comparison - convert both to absolute paths
    const normalizedAllFiles = allFiles.map(file => path.resolve(file));
    const normalizedTestPaths = allTestPaths.map(testPath => path.resolve(testPath));
    
    return normalizedTestPaths.some(testPath => 
      normalizedAllFiles.includes(testPath)
    );
  }

  /**
   * Generate test file path based on source file and test type
   * TypeScript ES module only - always generates .ts test files
   */
  private getRelativeTestPath(file: string, type: 'unit' | 'api' = 'unit'): string {
    const dir = path.dirname(file);
    const basename = path.basename(file, path.extname(file));
    
    if (type === 'unit') {
      // For unit tests, place them alongside the source file with GeneratedTest naming
      return path.join(dir, `${basename}GeneratedTest.test.ts`);
    } else {
      // For API/integration tests, use the configured test directory with .ts extension
      const rel = path.relative(process.cwd(), file);
      return path.join(this.config.TEST_DIR, rel.replace(/\.[tj]sx?$/, '.test.ts').replace(/[\\/]/g, '__'));
    }
  }

  /**
   * Create directory if it doesn't exist
   */
  private createDir(p: string): void {
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Write file only if it doesn't already exist
   */
  private writeIfMissing(p: string, content: string): boolean {
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
  private getUsedModules(content: string): string[] {
    return [...content.matchAll(PATTERNS.imports)]
      .map(m => m[1] || m[2]) // m[1] for ES modules, m[2] for CommonJS
      .filter(x => x && !x.startsWith('.') && !x.startsWith('/'));
  }

  /**
   * Generate unit test content for a file - TypeScript ES module only
   */
  private createUnitTest(file: string, exports: string[], usesQtests: boolean, mocks: string[]): string {
    const basename = path.basename(file, path.extname(file));
    const ext = path.extname(file);
    
    const lines = [
      `// Lightweight unit test for ${path.basename(file)} - TypeScript ES module`,
      ``
    ];
    
    // TypeScript ES module imports
    if (usesQtests) {
      lines.push(`import { test, mockConsole } from 'qtests';`);
      lines.push(`// NOTE: Use mockConsole directly, avoid complex async patterns`);
    }
    
    // Lightweight mock setup for TypeScript
    if (mocks.length > 0) {
      lines.push(`// Lightweight mock setup - TypeScript compatible`);
      mocks.forEach(lib => {
        lines.push(`jest.mock('${lib}', () => ({`);
        lines.push(`  __esModule: true,`);
        lines.push(`  default: jest.fn(() => 'mock-${lib}'),`);
        lines.push(`}));`);
      });
      lines.push(``);
    }
    
    // TypeScript test suite
    lines.push(`describe('${path.basename(file)} basic exports', () => {`);
    
    // Single lightweight test for TypeScript ES modules
    lines.push(`  test('module loads without errors', async () => {`);
    lines.push(`    // TypeScript ES module dynamic import`);
    lines.push(`    const module = await import('./${basename}${ext}');`);
    lines.push(`    expect(module).toBeDefined();`);
    lines.push(`    expect(typeof module).toBe('object');`);
    if (exports.length > 0) {
      lines.push(`    // Check for expected exports`);
      exports.slice(0, 3).forEach(exportName => {
        lines.push(`    expect(module.${exportName}).toBeDefined();`);
      });
    }
    lines.push(`  });`);
    lines.push(`});`);
    lines.push('');
    
    return lines.join('\n');
  }

  /**
   * Generate API test content for an endpoint - TypeScript ES module only
   */
  private createApiTest(method: string, route: string): string {
    const lines = [
      `// Auto-generated API test for ${method.toUpperCase()} ${route} - TypeScript ES module`,
      `// PARALLEL-SAFE DESIGN: This test avoids race conditions`,
      ``
    ];
    
    // Generate unique test session for API isolation
    lines.push(`// Unique API test session for parallel execution safety`);
    lines.push(`const apiTestSession = \`\${process.hrtime.bigint()}-\${Math.random().toString(36).substr(2, 9)}\`;`);
    lines.push(`const uniqueRoute = '${route}' + (${route}.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;`);
    lines.push(``);
    
    // TypeScript ES module import
    lines.push(`import { httpTest } from '../../utils/httpTest.js';`, '');
    
    // TypeScript test suite
    lines.push(`describe(\`${method.toUpperCase()} ${route} [API-\${apiTestSession}]\`, () => {`);
    lines.push(`  // Test data factory for unique request/response data`);
    lines.push(`  const createUniqueTestData = () => ({`);
    lines.push(`    sessionId: apiTestSession,`);
    lines.push(`    requestId: \`req-\${Date.now()}-\${Math.random().toString(36).substr(2, 6)}\`,`);
    lines.push(`    timestamp: new Date().toISOString(),`);
    lines.push(`  });`);
    lines.push(``);
    
    lines.push(`  test('should succeed with unique test data', async () => {`);
    lines.push(`    const testData = createUniqueTestData();`);
    lines.push(`    const app = httpTest.createMockApp();`);
    lines.push(`    `);
    lines.push(`    app.${method.toLowerCase()}(uniqueRoute, (req, res) => {`);
    lines.push(`      res.statusCode = 200;`);
    lines.push(`      res.setHeader('content-type', 'application/json');`);
    lines.push(`      res.end(JSON.stringify({ `);
    lines.push(`        success: true, `);
    lines.push(`        testSession: apiTestSession,`);
    lines.push(`        requestId: testData.requestId`);
    lines.push(`      }));`);
    lines.push(`    });`);
    lines.push(`    `);
    lines.push(`    const res = await httpTest.supertest(app)`);
    lines.push(`      .${method.toLowerCase()}(uniqueRoute)`);
    lines.push(`      .send(testData)`);
    lines.push(`      .expect(200);`);
    lines.push(`    `);
    lines.push(`    expect(res.body.success).toBe(true);`);
    lines.push(`    expect(res.body.testSession).toBe(apiTestSession);`);
    lines.push('  });');
    lines.push('});\n');
    
    return lines.join('\n');
  }

  /**
   * Intelligently extract exports from both ES modules and CommonJS
   */
  private extractExports(content: string): string[] {
    const exports = new Set<string>();
    
    // Remove comments to avoid false positives
    const cleanContent = content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
      .replace(/\/\/.*$/gm, ''); // Remove // comments
    
    // Extract ES module exports (export const/function/class)
    const esExports = [...cleanContent.matchAll(PATTERNS.exportsES)];
    esExports.forEach(match => {
      if (match[1]) exports.add(match[1]);
    });
    
    // Extract ES module named exports: export { name1, name2, name3 }
    const namedExports = [...cleanContent.matchAll(PATTERNS.exportsNamed)];
    namedExports.forEach(match => {
      if (match[1]) {
        // Parse the named exports list
        const exportList = match[1].split(',').map(name => name.trim());
        exportList.forEach(name => {
          // Handle potential aliases: "name as alias" -> use "name"
          const cleanName = name.split(' as ')[0].trim();
          if (cleanName && /^[a-zA-Z0-9_]+$/.test(cleanName)) {
            exports.add(cleanName);
          }
        });
      }
    });
    
    // Extract ES module default exports: export default SomeName
    const defaultExports = [...cleanContent.matchAll(PATTERNS.exportsDefault)];
    defaultExports.forEach(match => {
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
      const propertyMatches = objectContent.matchAll(/\b(\w+)(?:\s*:\s*\w+)?\s*[,}]/g);
      for (const match of propertyMatches) {
        if (match[1]) exports.add(match[1]);
      }
    }
    
    return Array.from(exports).filter(name => name && name.length > 0);
  }

  /**
   * Analyze a single file and generate appropriate tests - TypeScript ES module only
   */
  analyze(file: string): void {
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

    // Generate API tests for detected routes - TypeScript only
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
   * Create Jest configuration and setup files - TypeScript ES Module only
   */
  scaffoldJestSetup(): void {
    // Generate Jest config for TypeScript ES modules
    const config = `
// jest.config.js - TypeScript ES Module configuration
export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>'],
  testMatch: [
    '**/*.test.ts',           // Standard tests anywhere
    '**/*.GeneratedTest.test.ts', // Generated unit tests next to source files  
    '**/manual-tests/**/*.test.ts',     // Manual framework tests
    '**/generated-tests/**/*.test.ts'   // Generated integration tests
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      isolatedModules: true
    }]
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
};
`.trim();

    // Generate TypeScript ES module setup
    const setup = `
// setup.ts - TypeScript ES Module setup (PARALLEL-SAFE)
import 'jest';

// Global test configuration for TypeScript ES modules
beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Configure test timeouts
  jest.setTimeout(10000);
});

// Cleanup after each test to prevent interference
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks();
});
`.trim();

    this.writeIfMissing('jest.config.js', config);
    this.writeIfMissing('setup.ts', setup);
  }

  /**
   * Generate qtests test runner file - TypeScript ES module compatible
   */
  generateQtestsRunner(): void {
    try {
      // Read the existing qtests-runner.ts as template
      const templatePath = path.join(__dirname, '..', 'qtests-runner.ts');
      let template = '';
      
      if (fs.existsSync(templatePath)) {
        template = fs.readFileSync(templatePath, 'utf8');
      } else {
        // Fallback template for TypeScript ES modules with correct Jest configuration
        template = `
// Generated qtests runner - TypeScript ES module compatible
import { spawn } from 'child_process';
import path from 'path';

// Run tests with TypeScript support and correct Jest arguments
const args = process.argv.slice(2);
const testProcess = spawn('jest', args, {
  stdio: 'inherit',
  shell: true
});

testProcess.on('exit', (code) => {
  process.exit(code || 0);
});
`.trim();
      }

      // Always overwrite qtests-runner.ts to ensure latest functionality and TypeScript compliance
      const outputPath = path.join(process.cwd(), 'qtests-runner.ts');
      fs.writeFileSync(outputPath, template, 'utf8');
      
      console.log('✅ Generated qtests-runner.ts for TypeScript ES modules');
    } catch (error: any) {
      console.error('Failed to generate qtests-runner.ts:', error.message);
    }
  }

  /**
   * Update package.json test script to use qtests-runner.ts
   */
  updatePackageJsonTestScript(): void {
    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      if (!fs.existsSync(packagePath)) {
        console.log('⚠️  package.json not found, skipping test script update');
        return;
      }

      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }
      
      packageJson.scripts.test = 'npx tsx qtests-runner.ts';
      
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
      console.log('✅ Updated package.json test script to use qtests-runner.ts');
    } catch (error: any) {
      console.log('⚠️  Could not update package.json:', error.message);
    }
  }

  /**
   * Scan for files without tests and generate them - TypeScript ES module only
   */
  async generateTestFiles(): Promise<void> {
    console.log('🔍 Scanning for files that need TypeScript tests...');
    
    const allFiles = this.walkProject();
    const { sourceFiles } = this.categorizeFiles(allFiles);
    
    console.log(`📁 Found ${sourceFiles.length} source files without tests`);
    
    if (sourceFiles.length === 0) {
      console.log('✅ All source files already have corresponding tests');
      return;
    }
    
    // Generate tests for each source file
    for (const file of sourceFiles) {
      this.analyze(file);
    }
    
    // Always set up Jest configuration and runner to ensure they're up-to-date
    this.scaffoldJestSetup();
    this.generateQtestsRunner();
    this.updatePackageJsonTestScript();
    
    console.log(`📝 Generated ${this.scanned.length} TypeScript test files:`);
    this.scanned.forEach(test => {
      console.log(`   ${test.type}: ${test.file}`);
    });
  }

  /**
   * Get scan results
   */
  getResults(): ScannedTest[] {
    return this.scanned;
  }
}

// Export the TestGenerator class using ES module syntax
export { TestGenerator };
export default TestGenerator;