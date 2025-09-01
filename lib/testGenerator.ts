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
import { getModuleDirname } from '../utils/esm-globals.js';

// ES Module __dirname equivalent - lazy initialization to avoid Jest issues
let moduleDirname: string | undefined;
function getModuleDirnameForTestGenerator(): string {
  if (moduleDirname === undefined) {
    // Use a try-catch to handle Jest environment gracefully
    try {
      // Use eval to hide import.meta from Jest's static parser
      const importMetaUrl = (0, eval)('import.meta.url');
      moduleDirname = getModuleDirname(importMetaUrl);
    } catch (error) {
      // Fallback for Jest environment
      moduleDirname = process.cwd();
    }
  }
  return moduleDirname;
}

// Type definitions
interface TestGeneratorConfig {
  SRC_DIR: string;
  TEST_DIR: string;
  KNOWN_MOCKS: string[];
  VALID_EXTS: string[];
  mode?: 'heuristic' | 'ast';
  unit?: boolean;
  integration?: boolean;
  dryRun?: boolean;
  force?: boolean;
  include?: string[];
  exclude?: string[];
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
  // Precompiled include/exclude regexes for fast filtering
  private includeRegexes: RegExp[] = [];
  private excludeRegexes: RegExp[] = [];

  constructor(options: Partial<TestGeneratorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...options };
    this.scanned = [];
    this.isESModule = this.detectESModule(); // Detect module type once during initialization
    // Compile include/exclude glob patterns to regex for matching
    this.includeRegexes = (this.config.include || []).map(this.globToRegExp);
    this.excludeRegexes = (this.config.exclude || []).map(this.globToRegExp);
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
      '.replit_cache', '.config', '.npm', 'logs',
      'examples', 'demo', 'demos', 'samples', 'bin',  // Skip demo/example directories
      'manual-tests', 'fixtures', 'test-fixtures'      // Skip manual test directories
    ];
    return skipPatterns.includes(dirName) || dirName.startsWith('.');
  }

  /**
   * Walk entire project directory structure, respecting skip patterns
   */
  private walkProject(): string[] {
    const root = this.config.SRC_DIR
      ? path.resolve(process.cwd(), this.config.SRC_DIR)
      : process.cwd();
    return this.walkRecursive(root);
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
   * Convert a glob pattern (supports *, **, ?) into a RegExp
   * - *  matches any sequence except path separator
   * - ** matches any sequence including path separators
   * - ?  matches a single character except path separator
   */
  private globToRegExp(pattern: string): RegExp {
    // Normalize to posix style for matching
    let pat = pattern.replace(/\\/g, '/');
    // Escape regex special chars, except our glob tokens * ?
    pat = pat.replace(/([.+^${}()|\[\]\\])/g, '\\$1');
    // Convert ** to a special token first to avoid conflict with *
    pat = pat.replace(/\*\*/g, '::GLOBSTAR::');
    // Convert remaining * and ?
    pat = pat.replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]');
    // Convert GLOBSTAR
    pat = pat.replace(/::GLOBSTAR::/g, '.*');
    // Anchor pattern
    pat = '^' + pat + '$';
    return new RegExp(pat);
  }

  /**
   * Check include/exclude patterns against a path (posix normalized)
   */
  private pathMatchesFilters(filePath: string): boolean {
    const posixPath = filePath.replace(/\\/g, '/');
    // Apply exclude first
    if (this.excludeRegexes.some(rx => rx.test(posixPath))) {
      return false;
    }
    // If includes provided, must match at least one include
    if (this.includeRegexes.length > 0) {
      return this.includeRegexes.some(rx => rx.test(posixPath));
    }
    return true; // No includes means include all (after excludes)
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
   * Check if file should be skipped as a source file (config, setup, etc.)
   */
  private shouldSkipSourceFile(file: string): boolean {
    const basename = path.basename(file);
    const dirname = path.dirname(file);
    
    // Skip files in test-related directories
    if (dirname.includes('manual-tests') || dirname.includes('fixtures')) {
      return true;
    }
    
    const skipPatterns = [
      /^jest\.config\./,          // Jest config files
      /^jest-setup\./,            // Jest setup files
      /^setup\./,                 // Setup files
      /^config\./,                // Config files  
      /-demo\./,                  // Demo files
      /-example\./,               // Example files
      /\.config\./,               // Any config files
      /^example\./,               // Files named "example.*"
      /^demo\./,                  // Files named "demo.*"
      /qtests-runner\./,          // Generated runner files
      /setupMultiple/,            // Test setup helpers
      /reloadCheck/,              // Test utilities
      /testSetup/,                // Test setup files
    ];
    
    return skipPatterns.some(pattern => pattern.test(basename));
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

      // Apply CLI include/exclude filters against project-relative path
      const relFromCwd = path.relative(process.cwd(), file);
      if (!this.pathMatchesFilters(relFromCwd)) {
        return;
      }

      // Skip config, demo, and setup files
      if (this.shouldSkipSourceFile(file)) {
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
      `${basename}.GenerateTest.test.ts`,  // Updated generated unit test pattern  
      `${basename}GeneratedTest.test.ts`,  // Legacy pattern for backwards compatibility
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
      return path.join(dir, `${basename}.GenerateTest.test.ts`);
    } else {
      // For API/integration tests, use the configured test directory with .ts extension
      const rel = path.relative(process.cwd(), file);
      return path.join(this.config.TEST_DIR, rel.replace(/\.[tj]sx?$/, '.GenerateTest.test.ts').replace(/[\\/]/g, '__'));
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
   * Write file only if it doesn't already exist, unless force flag is set
   * Supports dry-run mode for previewing planned files
   */
  private writeIfMissing(p: string, content: string, dryRun: boolean = false): boolean {
    const exists = fs.existsSync(p);
    // Allow overwrite only for files generated by this tool (contain ".GenerateTest")
    const isGeneratedTest = p.includes('.GenerateTest');
    const canWrite = !exists || (Boolean(this.config.force) && isGeneratedTest);
    
    if (dryRun) {
      // In dry-run mode, just log what would be written
      console.log(`${exists ? '[WOULD OVERWRITE]' : '[WOULD CREATE]'} ${path.relative('.', p)}`);
      return canWrite;
    }
    
    if (canWrite) {
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
   * Detect if code uses Date or Math.random for deterministic test helpers
   * 🚩AI: DETERMINISM_HELPERS — fake timers and seeded randomness scaffolding
   */
  private detectNonDeterministicCode(content: string): { usesDate: boolean; usesRandom: boolean } {
    const usesDate = /new Date\(|Date\.now\(|\.getTime\(/.test(content);
    const usesRandom = /Math\.random\(/.test(content);
    return { usesDate, usesRandom };
  }

  /**
   * Optional TypeScript AST analysis for better type inference
   * 🚩AI: TYPE_INFERENCE_OPTION — dynamic import('typescript') with heuristics fallback
   */
  private async tryTypeScriptAnalysis(file: string, content: string): Promise<{ functions: Array<{ name: string; params: Array<{ name: string; type: string }> }> } | null> {
    try {
      // Dynamic import of TypeScript - only if available
      const ts = await import('typescript').catch(() => null);
      if (!ts) {
        return null;
      }

      // Parse the TypeScript source
      const sourceFile = ts.createSourceFile(
        file,
        content,
        ts.ScriptTarget.Latest,
        true
      );

      const functions: Array<{ name: string; params: Array<{ name: string; type: string }> }> = [];

      // Visitor function to extract function declarations with types
      const visit = (node: any) => {
        if (ts.isFunctionDeclaration(node) && node.name) {
          const funcName = node.name.getText();
          const params = node.parameters.map((param: any) => ({
            name: param.name.getText(),
            type: param.type ? param.type.getText() : 'any'
          }));
          
          functions.push({ name: funcName, params });
        }
        
        ts.forEachChild(node, visit);
      };

      visit(sourceFile);
      return { functions };

    } catch (error: any) {
      // Fallback gracefully if TypeScript analysis fails
      console.log(`TypeScript analysis failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Generate sample values based on TypeScript types
   */
  private generateSampleValue(type: string): string {
    const cleanType = type.toLowerCase().trim();
    
    switch (cleanType) {
      case 'string':
        return `'test-string'`;
      case 'number':
        return '42';
      case 'boolean':
        return 'true';
      case 'array':
      case 'string[]':
        return `['item1', 'item2']`;
      case 'number[]':
        return '[1, 2, 3]';
      case 'object':
        return `{ key: 'value' }`;
      default:
        if (cleanType.endsWith('[]')) {
          return '[]';
        }
        if (cleanType.includes('|')) {
          // Union type - pick first option
          const firstType = cleanType.split('|')[0].trim();
          return this.generateSampleValue(firstType);
        }
        return 'undefined';
    }
  }

  /**
   * Detect if function has parameterized logic suitable for table-driven tests
   */
  private detectParameterizedLogic(content: string, functionName: string): boolean {
    // Look for the function definition
    const funcRegex = new RegExp(`function\\s+${functionName}\\s*\\([^)]*\\)\\s*\\{([^}]+)\\}`, 'i');
    const match = content.match(funcRegex);
    
    if (!match) return false;
    
    const functionBody = match[1];
    
    // Heuristics for parameterized logic
    const hasConditionals = /if\s*\(|switch\s*\(|case\s+/.test(functionBody);
    const hasArithmetic = /[+\-*/%]/.test(functionBody);
    const hasComparisons = /[<>=!]+/.test(functionBody);
    const hasStringOps = /\.split\(|\.substring\(|\.slice\(/.test(functionBody);
    
    return hasConditionals || hasArithmetic || hasComparisons || hasStringOps;
  }

  /**
   * Generate realistic test inputs based on function parameters
   */
  private generateRealisticInputs(functionName: string, params: Array<{ name: string; type: string }>): { inputs: string[]; expectedPattern: string } {
    const inputs: string[] = [];
    const paramNames: string[] = [];
    
    params.forEach(param => {
      paramNames.push(param.name);
      
      // Generate contextually appropriate values based on parameter name
      const paramName = param.name.toLowerCase();
      const paramType = param.type.toLowerCase();
      
      if (paramName.includes('id') || paramName.includes('uuid')) {
        inputs.push(paramType === 'string' ? `'user-123'` : '123');
      } else if (paramName.includes('name') || paramName.includes('title')) {
        inputs.push(`'TestName'`);
      } else if (paramName.includes('email')) {
        inputs.push(`'test@example.com'`);
      } else if (paramName.includes('age') || paramName.includes('count')) {
        inputs.push('25');
      } else if (paramName.includes('url') || paramName.includes('path')) {
        inputs.push(`'/api/test'`);
      } else if (paramName.includes('data') || paramName.includes('payload')) {
        inputs.push(`{ test: 'data' }`);
      } else {
        inputs.push(this.generateSampleValue(param.type));
      }
    });
    
    const expectedPattern = `// Expected: meaningful result based on ${paramNames.join(', ')}`;
    return { inputs, expectedPattern };
  }

  /**
   * Generate deterministic helpers for tests that need them
   */
  private generateDeterministicHelpers(usesDate: boolean, usesRandom: boolean): string[] {
    const helpers: string[] = [];
    
    if (usesDate || usesRandom) {
      helpers.push(`// Deterministic test helpers`);
      helpers.push(`beforeEach(() => {`);
      
      if (usesDate) {
        helpers.push(`  // Fix time for deterministic Date behavior`);
        helpers.push(`  jest.useFakeTimers().setSystemTime(new Date('2023-01-01T00:00:00Z'));`);
      }
      
      if (usesRandom) {
        helpers.push(`  // Seed Math.random for deterministic behavior`);
        helpers.push(`  let seed = 12345;`);
        helpers.push(`  Math.random = jest.fn(() => {`);
        helpers.push(`    seed = (seed * 9301 + 49297) % 233280;`);
        helpers.push(`    return seed / 233280;`);
        helpers.push(`  });`);
      }
      
      helpers.push(`});`);
      helpers.push(``);
      
      if (usesDate) {
        helpers.push(`afterEach(() => {`);
        helpers.push(`  jest.useRealTimers();`);
        helpers.push(`});`);
        helpers.push(``);
      }
    }
    
    return helpers;
  }

  /**
   * Generate unit test content for a file - TypeScript ES module only
   * 🚩AI: ENTRY_POINT_FOR_GENERATED_TEST_IMPORTS — insert `import 'qtests/setup'` first
   * 🚩AI: UNIT_TEMPLATE_SECTION — write per-export describe/it with positive + edge
   */
  private createUnitTest(file: string, exports: string[], usesQtests: boolean, mocks: string[], content: string = ''): string {
    const basename = path.basename(file, path.extname(file));
    const ext = path.extname(file);
    
    const lines = [
      `// Generated unit test for ${path.basename(file)} - TypeScript ES module`,
      `// 🚩AI: ENTRY_POINT_FOR_GENERATED_TEST_IMPORTS`,
      `import 'qtests/setup';`, // Always import qtests/setup first
      ``
    ];
    
    // Import the module being tested
    lines.push(`import * as testModule from './${basename}${ext}';`);
    
    // Add console capture if needed
    if (usesQtests) {
      lines.push(`import { mockConsole } from 'qtests';`);
    }
    
    lines.push(``);
    
    // Replace jest.mock with qtests stub comments for known libraries
    if (mocks.length > 0) {
      lines.push(`// External dependencies automatically stubbed by qtests/setup:`);
      mocks.forEach(lib => {
        lines.push(`// - ${lib}: stubbed by qtests (no jest.mock needed)`);
      });
      lines.push(``);
    }
    
    // Add deterministic helpers if the source code uses Date or Math.random
    if (content) {
      const { usesDate, usesRandom } = this.detectNonDeterministicCode(content);
      const deterministicHelpers = this.generateDeterministicHelpers(usesDate, usesRandom);
      deterministicHelpers.forEach(helper => lines.push(helper));
    }
    
    // Generate tests per export with realistic test cases
    if (exports.length > 0) {
      exports.forEach(exportName => {
        lines.push(`describe('${exportName}', () => {`);
        
        // Check if this looks like a function that could benefit from table-driven tests
        const hasParameterizedLogic = this.detectParameterizedLogic(content, exportName);
        
        if (hasParameterizedLogic) {
          // Generate table-driven test for parameterized logic
          lines.push(`  // Table-driven test for parameterized logic`);
          lines.push(`  test.each([`);
          lines.push(`    ['valid input', 'expected output'],`);
          lines.push(`    ['edge case', 'edge result'],`);
          lines.push(`    // Add more test cases as needed`);
          lines.push(`  ])('should handle %s correctly', (input, expected) => {`);
          lines.push(`    const result = testModule.${exportName}(input);`);
          lines.push(`    expect(result).toEqual(expected);`);
          lines.push(`  });`);
        } else {
          // Generate individual test cases
          // Happy path test with realistic inputs
          lines.push(`  it('should work with valid inputs', () => {`);
          lines.push(`    // TODO: Replace with realistic inputs based on function signature`);
          lines.push(`    const result = testModule.${exportName};`);
          lines.push(`    expect(result).toBeDefined();`);
          lines.push(`    `);
          lines.push(`    // Example: expect(testModule.${exportName}('realistic-input')).toEqual(expectedOutput);`);
          lines.push(`  });`);
          lines.push(``);
          
          // Edge case test with better examples
          lines.push(`  it('should handle edge cases appropriately', () => {`);
          lines.push(`    // Test boundary conditions and error cases:`);
          lines.push(`    // - Empty strings: testModule.${exportName}('')`);
          lines.push(`    // - Null/undefined: testModule.${exportName}(null)`);
          lines.push(`    // - Invalid types: testModule.${exportName}(123) when string expected`);
          lines.push(`    // - Boundary values: testModule.${exportName}(Number.MAX_SAFE_INTEGER)`);
          lines.push(`    expect(testModule.${exportName}).toBeDefined();`);
          lines.push(`  });`);
        }
        
        lines.push(`});`);
        lines.push(``);
      });
    } else {
      // Fallback test when no exports detected
      lines.push(`describe('${path.basename(file)} module', () => {`);
      lines.push(`  it('should load without errors', async () => {`);
      lines.push(`    expect(testModule).toBeDefined();`);
      lines.push(`    expect(typeof testModule).toBe('object');`);
      lines.push(`  });`);
      lines.push(`});`);
      lines.push(``);
    }
    
    return lines.join('\n');
  }

  /**
   * Generate API test content for an endpoint - TypeScript ES module only
   * 🚩AI: INTEGRATION_TEMPLATE_SECTION — createMockApp + supertest + failure path
   */
  private createApiTest(method: string, route: string): string {
    const lines = [
      `// Generated integration test for ${method.toUpperCase()} ${route} - TypeScript ES module`,
      `// 🚩AI: ENTRY_POINT_FOR_GENERATED_TEST_IMPORTS`,
      `import 'qtests/setup';`, // Always import qtests/setup first
      ``
    ];
    
    // Import testing utilities
    lines.push(`import { createMockApp, supertest } from '../utils/httpTest.js';`);
    lines.push(``);
    
    // 🚩AI: DETERMINISM_HELPERS — fake timers and seeded randomness scaffolding
    lines.push(`// Deterministic test helpers`);
    lines.push(`beforeEach(() => {`);
    lines.push(`  // Use fake timers for deterministic time-based behavior`);
    lines.push(`  jest.useFakeTimers().setSystemTime(new Date('2023-01-01T00:00:00Z'));`);
    lines.push(`});`);
    lines.push(``);
    lines.push(`afterEach(() => {`);
    lines.push(`  jest.useRealTimers();`);
    lines.push(`});`);
    lines.push(``);
    
    // Generate unique test session for API isolation
    lines.push(`// Deterministic unique route for parallel test safety`);
    lines.push(`const testHash = require('crypto').createHash('md5').update('${route}').digest('hex').slice(0, 8);`);
    lines.push(`const uniqueRoute = '${route}' + ('${route}'.includes('?') ? '&' : '?') + 'testId=' + testHash;`);
    lines.push(``);
    
    // TypeScript test suite
    lines.push(`describe('${method.toUpperCase()} ${route}', () => {`);
    lines.push(`  let app: ReturnType<typeof createMockApp>;`);
    lines.push(``);
    lines.push(`  beforeEach(() => {`);
    lines.push(`    app = createMockApp();`);
    lines.push(`  });`);
    lines.push(``);
    
    // Success test case
    lines.push(`  it('should return success response', async () => {`);
    lines.push(`    // Setup route handler`);
    lines.push(`    app.${method.toLowerCase()}(uniqueRoute, (req, res) => {`);
    lines.push(`      res.statusCode = 200;`);
    lines.push(`      res.setHeader('content-type', 'application/json');`);
    lines.push(`      res.end(JSON.stringify({`);
    lines.push(`        success: true,`);
    lines.push(`        message: 'Request processed successfully'`);
    lines.push(`      }));`);
    lines.push(`    });`);
    lines.push(``);
    lines.push(`    // Execute test`);
    lines.push(`    const res = await supertest(app)`);
    lines.push(`      .${method.toLowerCase()}(uniqueRoute)`);
    if (method.toLowerCase() !== 'get') {
      lines.push(`      .send({ testData: 'valid input' })`);
    }
    lines.push(`      .expect(200);`);
    lines.push(``);
    lines.push(`    // Verify response`);
    lines.push(`    expect(res.body.success).toBe(true);`);
    lines.push(`    expect(res.body.message).toBe('Request processed successfully');`);
    lines.push(`  });`);
    lines.push(``);
    
    // Failure test case  
    lines.push(`  it('should handle not found case', async () => {`);
    lines.push(`    // Don't setup any route handlers to simulate 404`);
    lines.push(``);
    lines.push(`    // Execute test`);
    lines.push(`    const res = await supertest(app)`);
    lines.push(`      .${method.toLowerCase()}('/nonexistent-route')`);
    if (method.toLowerCase() !== 'get') {
      lines.push(`      .send({ testData: 'any data' })`);
    }
    lines.push(`      .expect(404);`);
    lines.push(``);
    lines.push(`    // Verify error response`);
    lines.push(`    expect(res.body.error).toBe('Not Found');`);
    lines.push(`  });`);
    lines.push(`});`);
    lines.push('');
    
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
  async analyze(file: string, dryRun: boolean = false): Promise<void> {
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
    let exports = this.extractExports(content);
    // If AST mode requested, attempt to augment exports via TypeScript parser
    if (this.config.mode === 'ast') {
      try {
        const astInfo = await this.tryTypeScriptAnalysis(file, content);
        if (astInfo && Array.isArray(astInfo.functions)) {
          const astExports = astInfo.functions.map(fn => fn.name).filter(Boolean);
          exports = Array.from(new Set([...(exports || []), ...astExports]));
        }
      } catch {
        // Swallow AST errors and proceed with heuristic
      }
    }
    if (exports.length > 0 && (!this.config.integration)) {
      const testPath = this.getRelativeTestPath(file, 'unit');
      const created = this.writeIfMissing(
        testPath, 
        this.createUnitTest(file, exports, usesQtests, mockTargets, content),
        dryRun
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
    if (apis.length > 0 && (!this.config.unit)) {
      for (const [, , method, route] of apis) {
        const testPath = this.getRelativeTestPath(file, 'api')
          .replace(/\.GenerateTest\.test\.ts$/, `.GenerateTest__${method.toLowerCase()}.test.ts`);
        const created = this.writeIfMissing(
          testPath, 
          this.createApiTest(method, route),
          dryRun
        );
        if (created) {
          this.scanned.push({ 
            type: 'api', 
            file: path.relative('.', testPath) 
          });
        }
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
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^qtests/(.*)$': '<rootDir>/$1'  // Allow qtests to import from itself during testing
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
      // Read the existing qtests-ts-runner.ts as template
      const templatePath = path.join(getModuleDirnameForTestGenerator(), '..', 'qtests-ts-runner.ts');
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

      // Always overwrite qtests-ts-runner.ts to ensure latest functionality and TypeScript compliance
      const outputPath = path.join(process.cwd(), 'qtests-ts-runner.ts');
      fs.writeFileSync(outputPath, template, 'utf8');
      
      console.log('✅ Generated qtests-ts-runner.ts for TypeScript ES modules');
    } catch (error: any) {
      console.error('Failed to generate qtests-ts-runner.ts:', error.message);
    }
  }

  /**
   * Update package.json test script to use qtests-ts-runner.ts
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
      
      packageJson.scripts.test = 'npx tsx qtests-ts-runner.ts';
      
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
      console.log('✅ Updated package.json test script to use qtests-ts-runner.ts');
    } catch (error: any) {
      console.log('⚠️  Could not update package.json:', error.message);
    }
  }

  /**
   * Scan for files without tests and generate them - TypeScript ES module only
   */
  async generateTestFiles(dryRun: boolean = false): Promise<void> {
    console.log('🔍 Scanning for files that need TypeScript tests...');
    
    const allFiles = this.walkProject();
    const { sourceFiles } = this.categorizeFiles(allFiles);
    
    console.log(`📁 Found ${sourceFiles.length} source files without tests`);
    
    // Generate tests for each source file
    for (const file of sourceFiles) {
      await this.analyze(file, dryRun);
    }

    // On non-dry runs, always scaffold Jest and runner even if there were no new files
    if (!dryRun) {
      this.scaffoldJestSetup();
      this.generateQtestsRunner();
      this.updatePackageJsonTestScript();
    } else {
      console.log('ℹ️ Dry run: Skipping Jest config and runner generation');
    }
    
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
