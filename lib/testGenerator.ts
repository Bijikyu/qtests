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
  // When true, generator will not create tests for React components (hooks still allowed)
  skipReactComponents?: boolean;
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
  // Default location for generated (non-unit) tests: under tests/generated-tests
  // This keeps integration-like artifacts scoped within the standard tests folder.
  TEST_DIR: 'tests/generated-tests',
  KNOWN_MOCKS: ['axios', 'node-fetch', 'pg', 'mongoose', 'fs', 'redis'],
  VALID_EXTS: ['.ts', '.js', '.tsx', '.jsx'],
  // Default behavior: do NOT generate tests for React components to avoid noise
  skipReactComponents: true
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
      'examples', 'demo', 'demos', 'samples', 'bin',
      // Skip common test and generated directories
      '__mocks__', '__tests__', 'tests', 'test', 'generated-tests',
      // Skip manual test directories and fixtures
      'manual-tests', 'fixtures', 'test-fixtures'
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
        // Expanded to avoid scanning dependencies or build artifacts which can
        // incorrectly trigger React detection (e.g., node_modules containing React)
        if (this.shouldSkipDirectory(entry.name) ||
            entry.name === 'node_modules' ||
            entry.name === 'dist' ||
            entry.name === 'build' ||
            entry.name === '.git' ||
            entry.name === 'demo' ||
            entry.name === 'examples' ||
            entry.name === 'docs') {
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
    
    // Skip files in test-related or excluded directories (path-wise guard)
    const excludedDirs = [
      '__mocks__',
      '__tests__',
      `${path.sep}test${path.sep}`,
      `${path.sep}tests${path.sep}`,
      'generated-tests',
      'manual-tests',
      'node_modules',
      `${path.sep}dist${path.sep}`,
      `${path.sep}build${path.sep}`,
      `${path.sep}.git${path.sep}`,
      'fixtures',
      `${path.sep}demo${path.sep}`,
      `${path.sep}examples${path.sep}`,
      `${path.sep}docs${path.sep}`
    ];
    if (excludedDirs.some(seg => dirname.includes(seg))) {
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
      // Backward-compat: old typo form
      `${basename}.GenerateTest.test.ts`,
      `${basename}.GenerateTest.test${ext}`,
      // New correct form
      `${basename}.GeneratedTest.test.ts`,
      `${basename}.GeneratedTest.test${ext}`,
      // Legacy alternate naming without dot retained for safety
      `${basename}GeneratedTest.test.ts`,
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
   * Detect if source file or content indicates React usage
   */
  private detectReactUsage(file: string, content: string = ''): boolean {
    // Check file extension
    if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      return true;
    }
    
    // Check for React imports
    const reactImports = /import.*(?:react|React|@types\/react)/i.test(content);
    if (reactImports) return true;
    
    // Check for JSX patterns
    const jsxPatterns = [
      /<[A-Z][a-zA-Z0-9]*[\s\/>]/, // Component tags like <MyComponent
      /<[a-z]+[\s\/>]/, // HTML tags like <div>
      /React\.createElement/, // React.createElement calls
      /jsx.*:/,  // JSX pragma
    ];
    
    return jsxPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Detect files that use top-level await or import.meta which can break Jest parsing.
   * Uses a lightweight brace-depth scanner to find 'await' at top-level and a simple
   * substring check for 'import.meta'. This avoids heavy AST parsing while being robust enough.
   */
  private detectTLAorImportMeta(content: string): boolean {
    try {
      if (content.includes('import.meta')) return true;
      // Remove single-line and block comments to reduce false positives
      const src = content
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '');
      let depth = 0;
      let inStr: false | '"' | "'" | '`' = false;
      for (let i = 0; i < src.length; i++) {
        const ch = src[i];
        const prev = i > 0 ? src[i - 1] : '';
        if (inStr) {
          if (ch === inStr && prev !== '\\') inStr = false;
          continue;
        }
        if (ch === '"' || ch === '\'' || ch === '`') { inStr = ch as any; continue; }
        if (ch === '{') depth++;
        else if (ch === '}') depth = Math.max(0, depth - 1);
        // crude token check for 'await' at depth 0
        if (depth === 0 && ch === 'a' && src.slice(i, i + 5) === 'await') {
          // ensure it's a standalone token boundary
          const before = i === 0 ? '' : src[i - 1];
          const after = src[i + 5] || '';
          const isWord = /[A-Za-z0-9_\$]/;
          if (!isWord.test(before) && !isWord.test(after)) {
            return true;
          }
        }
      }
      return false;
    } catch {
      // On failure, be conservative and do not flag
      return false;
    }
  }

  /**
   * Detect if export name is likely a React hook
   */
  private isReactHook(exportName: string): boolean {
    return exportName.startsWith('use') && exportName.length > 3;
  }

  /**
   * Detect if export name is likely a React component
   */
  private isReactComponent(exportName: string, content: string = ''): boolean {
    // Check if it starts with uppercase (component convention)
    if (!/^[A-Z]/.test(exportName)) return false;
    
    // Check if it's defined as a function that might return JSX
    const componentPatterns = [
      new RegExp(`function\\s+${exportName}\\s*\\(`),
      new RegExp(`const\\s+${exportName}\\s*=\\s*\\(`),
      new RegExp(`export\\s+function\\s+${exportName}\\s*\\(`),
      new RegExp(`${exportName}\\s*=\\s*\\(.*\\)\\s*=>`) // Arrow function
    ];
    
    return componentPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Heuristically detect if a React component likely requires props.
   * - TS inline prop types without ?: required (e.g., props: { id: string })
   * - Destructured props without defaults (e.g., function C({ id }: { id: string }))
   * - propTypes with isRequired
   */
  private componentRequiresProps(exportName: string, content: string = ''): boolean {
    try {
      // 1) propTypes isRequired
      const propTypesReq = new RegExp(`${exportName}\.propTypes\s*=\s*\{[\s\S]*?isRequired`, 'm');
      if (propTypesReq.test(content)) return true;

      // 2) TS inline type with required fields (no ?)
      // Simple conservative detection for inline typed props/destructuring with inline types
      const tsInlineSimple = new RegExp(`${exportName}[\\s\\S]*\\(\\s*props\\s*:\\s*\\{[^}]+\\}`, 'm');
      const tsDestructuredSimple = new RegExp(`${exportName}[\\s\\S]*\\(\\s*\\{[^}]+\\}\\s*:\\s*\\{[^}]+\\}`, 'm');
      if (tsInlineSimple.test(content) || tsDestructuredSimple.test(content)) {
        return true;
      }
      const tsInline1 = new RegExp(`(?:export\\s+)?function\\s+${exportName}\\s*\\(\\s*props\\s*:\\s*\\{([\\n\\r\\t \\w:<>\\|\\[\\]\\n\\r,?]+)\\}\\s*\\)`, 'm');
      const tsInline2 = new RegExp(`(?:export\s+)?const\s+${exportName}\s*=\s*\(\s*props\s*:\s*\{([\n\r\t \w:<>\|\[\]\n\r,?]+)\}\s*\)`, 'm');
      const tsDestructured = new RegExp(`(?:export\s+)?function\s+${exportName}\s*\(\s*\{([^}=]+)\}\s*:\s*\{([^}]+)\}\s*\)`, 'm');
      const tsArrowDestructured = new RegExp(`(?:export\s+)?const\s+${exportName}\s*=\s*\(\s*\{([^}=]+)\}\s*:\s*\{([^}]+)\}\s*\)`, 'm');

      const matches = [tsInline1.exec(content), tsInline2.exec(content), tsDestructured.exec(content), tsArrowDestructured.exec(content)];
      for (const m of matches) {
        if (!m) continue;
        const typeBlock = (m[1] || m[2] || '').trim();
        if (!typeBlock) continue;
        // If any field lacks ?, assume required
        const fields = typeBlock.split(',');
        for (const f of fields) {
          const field = f.trim();
          if (!field) continue;
          // Example: id?: string vs id: string
          if (/^[A-Za-z_$][\w$]*\s*:\s*[^?]/.test(field)) {
            return true;
          }
        }
      }

      // 3) Destructured props without default object for param (no = {})
      const destructuredNoDefaultFn = new RegExp(`(?:export\s+)?function\s+${exportName}\s*\(\s*\{([^}]+)\}\s*\)`, 'm');
      const destructuredNoDefaultArrow = new RegExp(`(?:export\s+)?const\s+${exportName}\s*=\s*\(\s*\{([^}]+)\}\s*\)`, 'm');
      if (destructuredNoDefaultFn.test(content) || destructuredNoDefaultArrow.test(content)) {
        // If the param includes = {}, it's optional; otherwise assume required
        const paramWithDefault = new RegExp(`${exportName}[^\n]*\(\s*\{[^}]+\}\s*=\s*\{\}\s*\)`);
        if (!paramWithDefault.test(content)) return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Generate test file path based on source file and test type
   * React-aware: generates .tsx for React components/hooks, .ts otherwise
   */
  private getRelativeTestPath(file: string, type: 'unit' | 'api' = 'unit', content: string = ''): string {
    const dir = path.dirname(file);
    const basename = path.basename(file, path.extname(file));
    
    // Prefer JSX-free tests: choose .tsx ONLY when emitting JSX (we do not)
    const testExt = '.ts';
    
    if (type === 'unit') {
      // For unit tests, place them alongside the source file with GeneratedTest naming
      return path.join(dir, `${basename}.GeneratedTest.test${testExt}`);
    } else {
      // For API/integration tests, use the configured test directory with appropriate extension
      const rel = path.relative(process.cwd(), file);
      return path.join(this.config.TEST_DIR, rel.replace(/\.[tj]sx?$/, `.GeneratedTest.test${testExt}`).replace(/[\\/]/g, '__'));
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
    // Do not overwrite existing tests unless explicitly forced for generator-owned files
    const isGeneratedTest = p.includes('.GeneratedTest') || p.includes('.GenerateTest');
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
   * Ensure a local copy of API test utilities exists at tests/generated-tests/utils/httpTest.js
   * so that generated integration tests work without extra project wiring.
   * Idempotent: only writes if missing.
   */
  private ensureLocalHttpTestUtils(): void {
    try {
      // Respect configured TEST_DIR with a sensible default inside tests/
      const targetDir = path.join(process.cwd(), this.config.TEST_DIR || 'tests/generated-tests', 'utils');
      const tsFile = path.join(targetDir, 'httpTest.ts');
      const shimFile = path.join(targetDir, 'httpTest.shim.js');

      // Ensure directory exists
      fs.mkdirSync(targetDir, { recursive: true });

      // TypeScript shim simply re-exports the working JS shim to avoid module mapper recursion
      const tsContent = `// Re-export the JS shim so tests work in TS/ESM\nexport { createMockApp, supertest } from './httpTest.shim.js';\n`;

      // Minimal, dependency-free supertest-like shim and express-style matcher with .send()
      const jsContent = `// tests/generated-tests/utils/httpTest.shim.js - minimal local test http helpers (ESM)\n// Provides a tiny Express-like app and a supertest-like client with .send()\n\nexport function createMockApp() {\n  const routes = new Map();\n  const add = (m, p, h) => { routes.set(m.toUpperCase() + ' ' + p, h); };\n\n  function app(req, res) {\n    const key = String(req?.method || '').toUpperCase() + ' ' + String(req?.url || '');\n    const handler = routes.get(key);\n\n    if (!handler) {\n      res.statusCode = 404;\n      res.setHeader('content-type', 'application/json');\n      res.end(JSON.stringify({ error: 'Not Found' }));\n      return;\n    }\n\n    try {\n      res.statusCode = 200; // default\n      handler(req, res);\n    } catch (err) {\n      res.statusCode = 500;\n      res.setHeader('content-type', 'application/json');\n      res.end(JSON.stringify({ error: 'Internal Error', message: String(err && err.message || err) }));\n    }\n  }\n\n  app.get = (p, h) => add('GET', p, h);\n  app.post = (p, h) => add('POST', p, h);\n  app.put = (p, h) => add('PUT', p, h);\n  app.patch = (p, h) => add('PATCH', p, h);\n  app.delete = (p, h) => add('DELETE', p, h);\n\n  return app;\n}\n\nexport function supertest(app) {\n  function makeReq(method, url) {\n    const state = { expected: null, body: undefined, headers: {} };\n\n    function finish(resState) {\n      const { statusCode, headers, text } = resState;\n      let body = undefined;\n      if (typeof text === 'string') {\n        try { body = JSON.parse(text); } catch {}\n      }\n      const out = { status: statusCode, headers, text, body };\n      if (typeof state.expected === 'number' && statusCode !== state.expected) {\n        throw new Error(\`Expected status \${state.expected} but got \${statusCode}\`);\n      }\n      return out;\n    }\n\n    return {\n      set(name, value) {\n        state.headers[String(name).toLowerCase()] = String(value);\n        return this;\n      },\n      send(payload) {\n        const isObject = payload !== null && typeof payload === 'object';\n        state.body = isObject ? JSON.stringify(payload) : String(payload ?? '');\n        if (!state.headers['content-type']) {\n          state.headers['content-type'] = isObject ? 'application/json' : 'text/plain';\n        }\n        return this;\n      },\n      expect(status) { state.expected = status; return this.end(); },\n      end() {\n        return new Promise((resolve) => {\n          const headers = {};\n          let bodyText = '';\n          const res = {\n            statusCode: 200,\n            setHeader: (k, v) => { headers[String(k).toLowerCase()] = String(v); },\n            end: (txt) => {\n              bodyText = typeof txt === 'string' ? txt : (txt == null ? '' : String(txt));\n              resolve(finish({ statusCode: res.statusCode, headers, text: bodyText }));\n            }\n          };\n\n          const req = { method, url, headers: { ...state.headers } };\n          if (state.body !== undefined) {\n            const ct = state.headers['content-type'] || '';\n            req.body = ct.includes('application/json') ? (() => { try { return JSON.parse(state.body); } catch { return state.body; } })() : state.body;\n          }\n          try {\n            const qs = url.includes('?') ? url.split('?')[1] : '';\n            req.query = Object.fromEntries(new URLSearchParams(qs));\n          } catch {}\n\n          app(req, res);\n        });\n      }\n    };\n  }\n\n  return {\n    get: (p) => makeReq('GET', p),\n    post: (p) => makeReq('POST', p),\n    put: (p) => makeReq('PUT', p),\n    patch: (p) => makeReq('PATCH', p),\n    delete: (p) => makeReq('DELETE', p),\n  };\n}\n`;

      // Write files only if missing to remain idempotent
      if (!fs.existsSync(tsFile)) fs.writeFileSync(tsFile, tsContent, 'utf8');
      if (!fs.existsSync(shimFile)) fs.writeFileSync(shimFile, jsContent, 'utf8');
      console.log(`✅ Scaffolded local API test utils at ${path.relative(process.cwd(), tsFile)} and shim ${path.relative(process.cwd(), shimFile)}`);
    } catch (err: any) {
      console.warn('⚠️  Could not scaffold local httpTest utils:', err?.message || String(err));
    }
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
   * Generate React component test using React.createElement (no JSX)
   */
  private createReactComponentTest(exportName: string, basename: string, useProviders: boolean): string[] {
    const renderLine = useProviders
      ? `const { container } = render(React.createElement(Providers as any, {}, React.createElement(Component as any, {})));`
      : `const { container } = render(React.createElement(Component as any, {}));`;
    return [
      `describe('${exportName} Component', () => {`,
      `  it('renders without crashing', () => {`,
      `    // Resolve component from exports`,
      `    const Component = (testModule as any).default ?? (testModule as any)['${exportName}'];`,
      `    expect(Component).toBeDefined();`,
      `    // Smoke render using React.createElement (no JSX)`,
      `    ${renderLine}`,
      `    expect(container).toBeDefined();`,
      `  });`,
      `});`,
      ``
    ];
  }

  /**
   * Generate React hook test using wrapper component
   */
  private createReactHookTest(exportName: string, basename: string, useProviders: boolean): string[] {
    const probeRender = useProviders
      ? `render(React.createElement(Providers as any, {}, React.createElement(HookProbe)))`
      : `render(React.createElement(HookProbe))`;
    return [
      `describe('${exportName} Hook', () => {`,
      `  it('mounts via probe without errors', () => {`,
      `    // Create hook probe component (never call hooks outside a component)`,
      `    function HookProbe() {`,
      `      const hookResult = (testModule as any)['${exportName}']();`,
      `      return React.createElement('div', { 'data-testid': 'hook-result' }, String(!!hookResult));`,
      `    }`,
      `    const { getByTestId } = ${probeRender};`,
      `    expect(getByTestId('hook-result')).toBeInTheDocument();`,
      `  });`,
      `});`,
      ``
    ];
  }

  /**
   * Generate unit test content for a file - TypeScript ES module with React support
   * 🚩AI: ENTRY_POINT_FOR_GENERATED_TEST_IMPORTS — insert `import 'qtests/setup'` first
   * 🚩AI: UNIT_TEMPLATE_SECTION — write per-export describe/it with positive + edge
   */
  private createUnitTest(file: string, exports: string[], usesQtests: boolean, mocks: string[], content: string = '', skipDueToTLA: boolean = false): string {
    const basename = path.basename(file, path.extname(file));
    const ext = path.extname(file);
    
    const lines = [
      `// Generated unit test for ${path.basename(file)} - TypeScript ES module`,
      `// 🚩AI: ENTRY_POINT_FOR_GENERATED_TEST_IMPORTS`,
      `import 'qtests/setup';`, // Always import qtests/setup first
      ``
    ];

    if (skipDueToTLA) {
      lines.push(`describe.skip('${path.basename(file)} (skipped due to TLA/import.meta)', () => {`);
      lines.push(`  it('skipped: source uses top-level await or import.meta which Jest cannot parse by default', () => {`);
      lines.push(`    expect(true).toBe(true);`);
      lines.push(`  });`);
      lines.push(`});`);
      lines.push('');
      return lines.join('\n');
    }
    
    // Detect if this is a React file and whether it uses common providers
    const isReactFile = this.detectReactUsage(file, content);
    const usesReactQuery = /@tanstack\/react-query/.test(content);
    const usesReactHookForm = /react-hook-form/.test(content) || /useFormContext|FormProvider/.test(content);
    const wantsRouter = Boolean((this.config as any).withRouter);
    const detectsRouter = /react-router(?:-dom)?/.test(content);
    const usesReactRouter = isReactFile && wantsRouter && detectsRouter;
    
    // Import the module being tested lazily to avoid TLA/import.meta parse issues under Jest
    // Use dynamic import in beforeAll so modules with top-level await are handled correctly
    lines.push(`let testModule: any;`);
    lines.push(`beforeAll(async () => {`);
    lines.push(`  testModule = await import('./${basename}');`);
    lines.push(`});`);
    
    // Add React imports if needed
    if (isReactFile) {
      lines.push(`import * as React from 'react';`);
      lines.push(`import { render } from '@testing-library/react';`);
      if (usesReactRouter) {
        // Prefer matching the imported module from source when possible
        const routerModule = content.includes('react-router-dom') ? 'react-router-dom' : 'react-router';
        lines.push(`import { MemoryRouter } from '${routerModule}';`);
      }
      if (usesReactQuery) {
        lines.push(`import { QueryClient, QueryClientProvider } from '@tanstack/react-query';`);
      }
      if (usesReactHookForm) {
        lines.push(`import { FormProvider, useForm } from 'react-hook-form';`);
      }
      if (usesReactQuery || usesReactRouter || usesReactHookForm) {
        // Compose providers deterministically: MemoryRouter (outer) -> QueryClientProvider -> FormProvider (inner)
        lines.push(`// Minimal provider composition for tests`);
        lines.push(`const Providers: React.FC<{ children?: React.ReactNode }> = ({ children }) => {`);
        if (usesReactQuery) {
          lines.push(`  const client = new QueryClient();`);
        }
        if (usesReactHookForm) {
          lines.push(`  const methods = useForm();`);
        }
        // Build nested providers without JSX using React.createElement
        if (usesReactRouter && usesReactQuery && usesReactHookForm) {
          lines.push(`  return React.createElement(MemoryRouter as any, {},`);
          lines.push(`    React.createElement(QueryClientProvider as any, { client },`);
          lines.push(`      React.createElement(FormProvider as any, methods as any, children as any)`);
          lines.push(`    )`);
          lines.push(`  );`);
        } else if (usesReactRouter && usesReactQuery) {
          lines.push(`  return React.createElement(MemoryRouter as any, {},`);
          lines.push(`    React.createElement(QueryClientProvider as any, { client }, children as any)`);
          lines.push(`  );`);
        } else if (usesReactRouter && usesReactHookForm) {
          lines.push(`  return React.createElement(MemoryRouter as any, {},`);
          lines.push(`    React.createElement(FormProvider as any, methods as any, children as any)`);
          lines.push(`  );`);
        } else if (usesReactQuery && usesReactHookForm) {
          lines.push(`  return React.createElement(QueryClientProvider as any, { client },`);
          lines.push(`    React.createElement(FormProvider as any, methods as any, children as any)`);
          lines.push(`  );`);
        } else if (usesReactRouter) {
          lines.push(`  return React.createElement(MemoryRouter as any, {}, children as any);`);
        } else if (usesReactQuery) {
          lines.push(`  return React.createElement(QueryClientProvider as any, { client }, children as any);`);
        } else if (usesReactHookForm) {
          lines.push(`  return React.createElement(FormProvider as any, methods as any, children as any);`);
        }
        lines.push(`};`);
      }
    }
    
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
    
    // Validate export names for safety; skip reserved or falsy/non-identifiers
    const reserved = new Set(['default', 'function', 'undefined', 'null', 'NaN', 'Infinity']);
    const isValidIdent = (name: string) => /^[A-Za-z_$][\w$]*$/.test(name) && !reserved.has(name);
    const safeExports = (exports || []).filter(isValidIdent);

    // If React file: test only React hooks (and components only when explicitly enabled);
    // avoid generic "is defined" blocks for React modules.
    if (safeExports.length > 0) {
      const reactTargets: string[] = [];
      const includeComponentTests = (this.config as any).skipReactComponents === false;
      if (isReactFile) {
        for (const exportName of safeExports) {
          // Always allow hook tests
          if (this.isReactHook(exportName)) {
            reactTargets.push(exportName);
            continue;
          }
          // Only include component tests when explicitly enabled
          if (includeComponentTests && this.isReactComponent(exportName, content)) {
            reactTargets.push(exportName);
          }
        }
      }

      if (isReactFile && reactTargets.length > 0) {
        // Emit only React-related tests; skip generic tests
        for (const exportName of reactTargets) {
          if (this.isReactHook(exportName)) {
            const hookTestLines = this.createReactHookTest(exportName, basename, (usesReactQuery || usesReactRouter || usesReactHookForm));
            lines.push(...hookTestLines);
          } else if (includeComponentTests && this.isReactComponent(exportName, content)) {
            if (this.componentRequiresProps(exportName, content)) {
              lines.push(`describe('${exportName} Component', () => {`);
              lines.push(`  it('is defined (fallback: required props detected)', () => {`);
              lines.push(`    const Component = (testModule as any).default ?? (testModule as any)['${exportName}'];`);
              lines.push(`    expect(Component).toBeDefined();`);
              lines.push(`  });`);
              lines.push(`});`);
              lines.push('');
            } else {
              const componentTestLines = this.createReactComponentTest(exportName, basename, (usesReactQuery || usesReactRouter || usesReactHookForm));
              lines.push(...componentTestLines);
            }
          }
        }
      } else if (!isReactFile) {
        // Non-React path: generate safe existence tests
        safeExports.forEach(exportName => {
          lines.push(`describe('${exportName}', () => {`);
          lines.push(`  it('is defined', () => {`);
          lines.push(`    const target = (testModule as any)['${exportName}'];`);
          lines.push(`    if (typeof target === 'undefined') {`);
          lines.push(`      // Skip: export not found on module at runtime`);
          lines.push(`      expect(true).toBe(true);`);
          lines.push(`      return;`);
          lines.push(`    }`);
          lines.push(`    expect(target).toBeDefined();`);
          lines.push(`  });`);
          lines.push(`});`);
          lines.push('');
        });
      } else {
        // React file with no eligible React targets (e.g., components only and components disabled):
        // Return empty content to signal caller to skip writing a test.
        return '';
      }
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
    
    // Import testing utilities (omit extension for ts-jest compatibility)
    lines.push(`import { createMockApp, supertest } from '../utils/httpTest';`);
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
      const testPath = this.getRelativeTestPath(file, 'unit', content);
      const skipTLA = this.detectTLAorImportMeta(content);
      const unitContent = this.createUnitTest(file, exports, usesQtests, mockTargets, content, skipTLA);
      // Skip writing when generator intentionally returned empty content (e.g., React component-only files)
      if (unitContent && unitContent.trim().length > 0) {
        const created = this.writeIfMissing(
          testPath,
          unitContent,
          dryRun
        );
        if (created) {
          this.scanned.push({
            type: 'unit',
            file: path.relative('.', testPath)
          });
        }
      }
    }

    // Generate API tests for detected routes - TypeScript only
    const apis = [...content.matchAll(PATTERNS.api)];
    if (apis.length > 0 && (!this.config.unit)) {
      for (const [, , method, route] of apis) {
        const testPath = this.getRelativeTestPath(file, 'api', content)
          .replace(/\.GeneratedTest\.test\.(ts|tsx)$/, `.GeneratedTest__${method.toLowerCase()}.test.$1`);
        const created = this.writeIfMissing(
          testPath, 
          this.createApiTest(method, route),
          dryRun
        );
        // If an API test was created, ensure local httpTest utilities exist (idempotent)
        if (created && !dryRun) {
          this.ensureLocalHttpTestUtils();
        }
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
   * Detect if project uses React based on dependencies and source files
   */
  private detectReactProject(): boolean {
    try {
      // Honor forced React mode if provided via CLI
      if ((this.config as any).react) return true;
      // Check package.json for React dependencies
      const packagePath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        const allDeps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
          ...packageJson.peerDependencies
        };
        
        const reactDeps = ['react', '@types/react', 'react-dom', '@types/react-dom', 
                          '@testing-library/react', '@tanstack/react-query'];
        if (reactDeps.some(dep => allDeps[dep])) {
          return true;
        }
      }
      
      // Scan for .tsx files or React imports in source code
      const allFiles = this.walkProject();
      return allFiles.some(file => {
        if (file.endsWith('.tsx') || file.endsWith('.jsx')) return true;
        
        try {
          const content = fs.readFileSync(file, 'utf8');
          return this.detectReactUsage(file, content);
        } catch {
          return false;
        }
      });
    } catch {
      return false;
    }
  }

  /**
   * Create Jest configuration and setup files - React-aware TypeScript ES Module
   */
  scaffoldJestSetup(): void {
    const isReactProject = this.detectReactProject();
    // Generate Jest config for TypeScript ES modules with React support
    // Derive moduleNameMapper from tsconfig paths if present (supports config/tsconfig.json)
    let tsPathsMapper: Record<string, string> = {};
    try {
      const configTs = path.join(process.cwd(), 'config', 'tsconfig.json');
      const rootTs = path.join(process.cwd(), 'tsconfig.json');
      const tsconfigPath = fs.existsSync(configTs) ? configTs : rootTs;
      const tsconfigDir = path.dirname(tsconfigPath);
      if (fs.existsSync(tsconfigPath)) {
        const tsjson = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8')) || {};
        const baseUrl = tsjson.compilerOptions?.baseUrl || '.';
        const paths = tsjson.compilerOptions?.paths || {};
        for (const [alias, targets] of Object.entries(paths)) {
          // Skip overly broad wildcard mapping "*" to avoid clobbering all imports in Jest
          if (alias === '*') continue;
          const pattern = String(alias);
          const hasWildcard = pattern.includes('*');
          const jestKey = hasWildcard
            ? '^' + pattern.replace('*', '(.*)') + '$'
            : '^' + pattern + '$';
          const firstTarget = Array.isArray(targets) ? (targets as any[])[0] : (targets as any);
          if (!firstTarget) continue;
          // Resolve absolute path from tsconfig location, then convert to <rootDir>/relative
          const absolute = path.resolve(tsconfigDir, baseUrl, String(firstTarget).replace('*', '$1'));
          const relativeFromRoot = path.relative(process.cwd(), absolute).replace(/\\/g, '/');
          const resolved = `<rootDir>/${relativeFromRoot}`;
          tsPathsMapper[jestKey] = resolved;
        }
      }
    } catch {
      // ignore optional tsconfig mapping errors
    }
    // Fallback for '@/': map to client/src when not provided by tsconfig
    if (!Object.keys(tsPathsMapper).some(k => k.startsWith('^@/'))) {
      const clientSrc = path.join(process.cwd(), 'client', 'src');
      if (fs.existsSync(clientSrc)) {
        tsPathsMapper['^@/(.*)$'] = '<rootDir>/client/src/$1';
      }
    }
    // Fallback for '@shared/': map to shared when present
    if (!Object.keys(tsPathsMapper).some(k => k.startsWith('^@shared/'))) {
      const sharedDir = path.join(process.cwd(), 'shared');
      if (fs.existsSync(sharedDir)) {
        tsPathsMapper['^@shared/(.*)$'] = '<rootDir>/shared/$1';
      }
    }
    // Keep ESM treatment to TS/TSX; Jest infers .js from nearest package.json
    const extensionsToTreatAsEsm = isReactProject ? ['.ts', '.tsx'] : ['.ts'];
    const moduleFileExtensions = isReactProject ? ['ts', 'tsx', 'js', 'jsx', 'json'] : ['ts', 'js', 'json'];
    // Prefer jsdom for React, but fall back to node if jest-environment-jsdom is not installed
    let testEnvironment = isReactProject ? 'jsdom' : 'node';
    try {
      const hasJsdomEnv = fs.existsSync(path.join(process.cwd(), 'node_modules', 'jest-environment-jsdom'));
      if (isReactProject && !hasJsdomEnv) {
        testEnvironment = 'node';
      }
    } catch {}
    const testMatchPatterns = isReactProject
      ? [
          '**/*.test.ts',
          '**/*.test.tsx',
          '**/*.spec.ts',
          '**/*.spec.tsx',
          // Support both old and new generated naming in source dirs
          '**/*.GenerateTest.test.ts',
          '**/*.GenerateTest.test.tsx',
          '**/*.GeneratedTest.test.ts',
          '**/*.GeneratedTest.test.tsx',
          '**/manual-tests/**/*.test.ts',
          // In generated-tests, only pick files that follow GeneratedTest naming to avoid stale old tests
          '**/generated-tests/**/*GeneratedTest*.test.ts',
          '**/generated-tests/**/*GeneratedTest*.test.tsx'
        ]
      : [
          '**/*.test.ts',
          '**/*.spec.ts',
          '**/*.GenerateTest.test.ts',
          '**/*.GeneratedTest.test.ts',
          '**/manual-tests/**/*.test.ts',
          '**/generated-tests/**/*GeneratedTest*.test.ts'
        ];

    // Build transform config with ESM + isolatedModules. For React, provide JSX setting inline.
    // Avoid duplicate keys; prefer inline tsconfig override only when necessary.
    // Prefer project tsconfig from config/ when present; fall back to inline override
    const configTsJestPath = path.join(process.cwd(), 'config', 'tsconfig.jest.json');
    const configTsPath = path.join(process.cwd(), 'config', 'tsconfig.json');
    const usePathTsconfig = fs.existsSync(configTsJestPath)
      ? configTsJestPath
      : (fs.existsSync(configTsPath) ? configTsPath : null);
    const transformOptions: any = isReactProject
      ? (usePathTsconfig
          ? { useESM: true, tsconfig: '<rootDir>/config/tsconfig.jest.json' }
          : { useESM: true, tsconfig: { jsx: 'react-jsx' } })
      : (usePathTsconfig
          ? { useESM: true, tsconfig: '<rootDir>/config/tsconfig.jest.json' }
          : { useESM: true });
    // Build transform config for TS and JS. Prefer babel-jest for JS if available, otherwise ts-jest with allowJs.
    const hasBabelJest = fs.existsSync(path.join(process.cwd(), 'node_modules', 'babel-jest'));
    const hasBabelPresetEnv = fs.existsSync(path.join(process.cwd(), 'node_modules', '@babel', 'preset-env'));
    const transformConfig: Record<string, any> = {
      '^.+\\.(ts|tsx)$': ['ts-jest', transformOptions]
    };
    if (hasBabelJest) {
      const babelOpts = hasBabelPresetEnv ? { presets: [["@babel/preset-env", { targets: { node: 'current' } }]] } : {};
      transformConfig['^.+\\.(js|jsx)$'] = ['babel-jest', babelOpts];
    } else {
      const jsTsOptions: any = { ...transformOptions };
      // Ensure JS files are allowed through ts-jest
      if (typeof jsTsOptions.tsconfig === 'string') {
        // keep as-is, rely on project tsconfig allowJs if set
      } else {
        jsTsOptions.tsconfig = { ...(jsTsOptions.tsconfig || {}), allowJs: true };
      }
      transformConfig['^.+\\.(js|jsx)$'] = ['ts-jest', jsTsOptions];
    }

    // Allow transforming specific ESM-heavy libs and qtests
    const transformIgnore = 'node_modules/(?!(?:qtests|@tanstack|@radix-ui|lucide-react|react-resizable-panels|cmdk|vaul)/)';

    // Build moduleNameMapper with specific rules first, then generic fallbacks
    const moduleNameMapperObj: Record<string, string> = {
      // Manual-tests relative imports to project root
      '^\\.\\./index\\.js$': '<rootDir>/index.ts',
      '^\\.\\./setup\\.js$': '<rootDir>/setup.ts',
      '^\\.\\./lib/(.*)\\.js$': '<rootDir>/lib/$1.ts',
      '^\\.\\./lib/(.*)$': '<rootDir>/lib/$1.ts',
      '^\\.\\./utils/httpTest\\.shim\\.js$': '<rootDir>/utils/httpTest.shim.js',
      '^\\.\\./utils/(.*)\\.js$': '<rootDir>/utils/$1.ts',
      // Keep shim .js files as-is (do not strip extension)
      '^(.*/httpTest\\.shim)\\.js$': '$1.js',
      // Custom-stubbed external module proxies
      '^external-service-client$': '<rootDir>/utils/jest-proxies/external-service-client.cjs',
      '^feature-x$': '<rootDir>/utils/jest-proxies/feature-x.cjs',
      // Generic: strip .js from relative imports so ts-jest can resolve TS
      '^(\\.{1,2}/.*)\\.js$': '$1',
      // Other mappers
      '^qtests/(.*)$': '<rootDir>/node_modules/qtests/$1',
      '^mongoose$': '<rootDir>/__mocks__/mongoose.js',
      '^.+\\\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/fileMock.js',
      '^.+\\\\.(png|jpg|jpeg|gif|svg|webp|avif|ico|bmp)$': '<rootDir>/__mocks__/fileMock.js',
    };
    // Merge tsconfig paths and user aliases after core rules to avoid clobbering
    Object.assign(moduleNameMapperObj, tsPathsMapper, ((this.config as any).aliases || {}));

    const config = `
// jest.config.mjs - TypeScript ES Module configuration${isReactProject ? ' (React-enabled)' : ''}
// Use ESM export to avoid CommonJS issues under \"type\": \"module\"
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

export default {
  preset: 'ts-jest/presets/default-esm',
  rootDir: PROJECT_ROOT,
  testEnvironment: '${testEnvironment}',
  // Ensure CommonJS require() exists in ESM tests
  setupFiles: [path.join(PROJECT_ROOT, 'config', 'jest-require-polyfill.cjs')],
  setupFilesAfterEnv: [path.join(PROJECT_ROOT, 'config', 'jest-setup.ts')],
  roots: [PROJECT_ROOT],
  testMatch: ${JSON.stringify(testMatchPatterns, null, 2)},
  testPathIgnorePatterns: ${JSON.stringify(['/node_modules/', '/dist/', '/build/', '/__mocks__/'], null, 2)},
  moduleFileExtensions: ${JSON.stringify(moduleFileExtensions)},
  transform: ${JSON.stringify(transformConfig, null, 2)},
  extensionsToTreatAsEsm: ${JSON.stringify(extensionsToTreatAsEsm)},
  transformIgnorePatterns: ['${transformIgnore}'],
  moduleNameMapper: ${JSON.stringify(moduleNameMapperObj, null, 2)}
};
`.trim();

    // Generate TypeScript ES module setup with React support
    // Only apply DOM polyfills when using jsdom environment
    const domPolyfills = (isReactProject && testEnvironment === 'jsdom') ? `

// DOM polyfills for React Testing Library
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ResizeObserver polyfill
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// IntersectionObserver polyfill
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Clipboard polyfill
Object.assign(global.navigator, { clipboard: { writeText: jest.fn().mockResolvedValue(undefined) } });

// URL.createObjectURL polyfill
// Note: keep deterministic
global.URL.createObjectURL = jest.fn().mockReturnValue('blob:stub');` : '';
    
    const hasJestDom = (() => {
      try {
        const p1 = path.join(process.cwd(), 'node_modules', '@testing-library', 'jest-dom');
        return fs.existsSync(p1);
      } catch { return false; }
    })();
    const setup = `
// jest-setup.ts - Jest setup for TypeScript ESM${isReactProject ? ' with React support' : ''}
// Keep qtests setup FIRST to ensure global stubbing is active
import 'qtests/setup';
import { jest as jestFromGlobals } from '@jest/globals';${isReactProject && hasJestDom ? "\nimport '@testing-library/jest-dom';" : ''}

// Set test environment early
process.env.NODE_ENV = 'test';

// Resolve jest reference safely and expose globally for tests using jest.*
const J = (typeof jestFromGlobals !== 'undefined' && jestFromGlobals)
  ? jestFromGlobals
  : (globalThis as any).jest;
if (!(globalThis as any).jest && J) {
  (globalThis as any).jest = J as any;
}

// Provide CommonJS-like require for ESM tests that call require()
// Avoid top-level await to satisfy stricter Jest transform pipelines.
try {
  if (!(globalThis as any).require && typeof require === 'function') {
    (globalThis as any).require = require as any;
  }
} catch {}

beforeAll(() => {
  const j = (globalThis as any).jest || J;
  if (j && typeof j.setTimeout === 'function') {
    j.setTimeout(10000);
  }
});

afterEach(() => {
  const j = (globalThis as any).jest || J;
  if (j && typeof j.clearAllMocks === 'function') {
    j.clearAllMocks();
  }
});${domPolyfills}
`.trim();

    // Safely write or update generated files. If an existing file appears to be
    // managed by qtests (has our header), overwrite to fix prior mistakes.
    const writeOrUpdate = (file: string, content: string, headerMarker: string) => {
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, content, 'utf8');
        return;
      }
      try {
        const existing = fs.readFileSync(file, 'utf8');
        if (existing.includes(headerMarker)) {
          fs.writeFileSync(file, content, 'utf8');
        }
      } catch {
        // If we cannot read, do nothing to avoid destructive changes
      }
    };

    // Write to config/jest.config.mjs (create directory if missing)
    try {
      if (!fs.existsSync('config')) {
        fs.mkdirSync('config', { recursive: true });
      }
    } catch {}
    writeOrUpdate(path.join('config', 'jest.config.mjs'), config, 'jest.config.mjs - TypeScript ES Module configuration');
    // Write jest-setup.ts under config/
    try {
      if (!fs.existsSync('config')) {
        fs.mkdirSync('config', { recursive: true });
      }
    } catch {}
    writeOrUpdate(path.join('config', 'jest-setup.ts'), setup, 'jest-setup.ts - Jest setup for TypeScript ESM');

    // Write jest-require-polyfill.cjs under config/
    const requirePolyfill = `
// Ensure a global require exists for ESM tests that use CommonJS require().
// Executed by Jest via setupFiles BEFORE test files are evaluated.
try {
  if (typeof global.require === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createRequire } = require('module');
    let req;
    try {
      req = createRequire(process.cwd() + '/package.json');
    } catch {
      req = createRequire(__filename);
    }
    Object.defineProperty(global, 'require', {
      value: req,
      writable: false,
      configurable: true,
      enumerable: false,
    });
  }
} catch {}
`.trim();
    try {
      if (!fs.existsSync('config')) {
        fs.mkdirSync('config', { recursive: true });
      }
    } catch {}
    writeOrUpdate(path.join('config', 'jest-require-polyfill.cjs'), requirePolyfill, 'Ensure a global require exists for ESM tests');

    // If React-mode is active, advise on jsdom dependency if missing.
    if (isReactProject) {
      try {
        const pkgPath = path.join(process.cwd(), 'package.json');
        const pkgJson = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')) : {};
        const hasJsdomEnv = Boolean((pkgJson.devDependencies && pkgJson.devDependencies['jest-environment-jsdom']) ||
                                    (pkgJson.dependencies && pkgJson.dependencies['jest-environment-jsdom']));
        if (!hasJsdomEnv) {
          console.log('ℹ️ React detected: ensure devDependency "jest-environment-jsdom" is installed to satisfy Jest env.');
        }
      } catch {
        // Non-fatal; best-effort advisory only.
      }
    }
  }

  /**
   * Generate qtests test runner file as ESM: qtests-runner.mjs
   *
   * Policy alignment:
   * - Generator may only scaffold `qtests-runner.mjs` (ESM)
   * - Must not depend on `tsx`; invoke Jest directly with project config
   */
  generateQtestsRunner(): void {
    try {
      // Prefer embedded template shipped with the module; fallback to our packaged bin copy.
      // This must work when qtests is installed as a dependency in a client app.
      const modDir = getModuleDirnameForTestGenerator();
      const moduleRoot = path.resolve(modDir, '..');
      const packageRoot = path.resolve(moduleRoot, '..');

      // Try multiple candidate locations to account for different publish layouts
      const candidateTemplates = [
        path.join(modDir, 'templates', 'qtests-runner.mjs.template'),
        path.join(moduleRoot, 'templates', 'qtests-runner.mjs.template'),
        path.join(moduleRoot, 'lib', 'templates', 'qtests-runner.mjs.template'),
        path.join(moduleRoot, 'dist', 'templates', 'qtests-runner.mjs.template'),
        // When running from compiled dist/, templates typically reside at package root
        path.join(packageRoot, 'templates', 'qtests-runner.mjs.template'),
        path.join(packageRoot, 'lib', 'templates', 'qtests-runner.mjs.template')
      ];
      const templatePath = candidateTemplates.find(p => { try { return fs.existsSync(p); } catch { return false; } });
      if (templatePath) {
        const content = fs.readFileSync(templatePath, 'utf8');
        fs.writeFileSync('qtests-runner.mjs', content, 'utf8');
        console.log('✅ Generated qtests-runner.mjs (ESM) with full features');
        return;
      }

      // Fallback: read the authoritative runner from our packaged bin directory (inside node_modules/qtests)
      const binRunnerCandidates = [
        path.join(moduleRoot, 'bin', 'qtests-ts-runner'),
        path.join(packageRoot, 'bin', 'qtests-ts-runner'),
        // Dev-repo fallback for local workspaces
        path.join(process.cwd(), 'bin', 'qtests-ts-runner')
      ];
      const binRunnerPath = binRunnerCandidates.find(p => { try { return fs.existsSync(p); } catch { return false; } });
      if (binRunnerPath) {
        const binRunnerContent = fs.readFileSync(binRunnerPath, 'utf8');
        // Transform sacrosanct bin into a generated ESM runner file with a clear header
        const generatedRunnerContent = binRunnerContent
          .replace(/^#!\/usr\/bin\/env node/m, '#!/usr/bin/env node')
          .replace(
            /\/\/ IMPORTANT: This CLI is sacrosanct and not generated\. Do not overwrite\./,
            '// GENERATED RUNNER: qtests-runner.mjs - auto-created by qtests TestGenerator\n// Safe to delete; will be recreated as needed.\n// Mirrors bin/qtests-ts-runner behavior (batching, DEBUG_TESTS.md, stable exits).'
          );
        const header = `// GENERATED RUNNER: qtests-runner.mjs\n`;
        const finalContent = generatedRunnerContent.includes('GENERATED RUNNER: qtests-runner.mjs')
          ? generatedRunnerContent
          : header + generatedRunnerContent;
        fs.writeFileSync('qtests-runner.mjs', finalContent, 'utf8');
        console.log('✅ Generated qtests-runner.mjs (ESM) with full features');
        return;
      }

      // If all else fails, emit a clear warning for the user; do not throw.
      console.warn('⚠️  No runner template found; expected one of: lib/templates, templates/, dist/templates/, or bin/qtests-ts-runner within the qtests package.');
      console.warn('   Please ensure the qtests package includes templates or bin assets.');
    } catch (error: any) {
      console.error('Failed to generate qtests-runner.mjs:', error.message);
    }
  }

  /**
  * Update package.json scripts to use the unified API-only runner
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

      // Ensure pretest runs runner scaffolding + dist cleanup before tests
      const existingPre = typeof packageJson.scripts.pretest === 'string' ? packageJson.scripts.pretest : '';
      const ensureCmd = 'node scripts/ensure-runner.mjs';
      const cleanCmd = 'node scripts/clean-dist.mjs';
      const needEnsure = !existingPre.includes('scripts/ensure-runner.mjs');
      const needClean = !existingPre.includes('scripts/clean-dist.mjs');
      let newPre = existingPre.trim();
      const prepend: string[] = [];
      if (needClean) prepend.push(cleanCmd);
      if (needEnsure) prepend.push(ensureCmd);
      if (prepend.length) {
        newPre = (prepend.join(' && ')) + (newPre ? (' && ' + newPre) : '');
        packageJson.scripts.pretest = newPre;
      }

      // Use the unified API-only runner as the standard test command
      packageJson.scripts.test = 'node qtests-runner.mjs';
      
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
      console.log('✅ Updated package.json scripts: pretest + unified qtests runner');
    } catch (error: any) {
      console.log('⚠️  Could not update package.json:', error.message);
    }
  }

  /**
   * Ensure local runner helper scripts exist in the client repo
   */
  private ensureRunnerScripts(): void {
    try {
      const scriptsDir = path.join(process.cwd(), 'scripts');
      try { if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir, { recursive: true }); } catch {}

      // clean-dist.mjs
      const cleanPath = path.join(scriptsDir, 'clean-dist.mjs');
      const cleanContent = `// scripts/clean-dist.mjs\n// Remove compiled test files and __mocks__ from dist/ to prevent duplicate mock warnings.\nimport fs from 'fs';\nimport path from 'path';\nfunction rmDirSafe(p){try{fs.rmSync(p,{recursive:true,force:true})}catch{}}\nfunction cleanDist(root){const dist=path.join(root,'dist');try{if(!fs.existsSync(dist))return;}catch{return;}const stack=[dist];while(stack.length){const dir=stack.pop();let entries=[];try{entries=fs.readdirSync(dir,{withFileTypes:true})}catch{continue}for(const ent of entries){const full=path.join(dir,ent.name);if(ent.isDirectory()){if(ent.name==='__mocks__'){rmDirSafe(full);continue}stack.push(full);continue}if(!ent.isFile())continue;if(/\\.(test|spec)\\.[cm]?jsx?$/.test(ent.name)||/GeneratedTest/.test(ent.name)){try{fs.rmSync(full,{force:true})}catch{}}}}}\ncleanDist(process.cwd());\n`;
      try { fs.writeFileSync(cleanPath, cleanContent, 'utf8'); } catch {}

      // ensure-runner.mjs
      const ensurePath = path.join(scriptsDir, 'ensure-runner.mjs');
      const ensureContent = `// Ensures qtests-runner.mjs exists at project root by copying the shipped template.\nimport fs from 'fs';\nimport path from 'path';\nimport { fileURLToPath } from 'url';\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = path.dirname(__filename);\nconst cwd = process.cwd();\nfunction firstExisting(paths){for(const p of paths){try{if(fs.existsSync(p))return p}catch{}}return null}\ntry{const target=path.join(cwd,'qtests-runner.mjs');if(!fs.existsSync(target)){const candidates=[path.join(cwd,'templates','qtests-runner.mjs.template'),path.join(cwd,'lib','templates','qtests-runner.mjs.template'),path.join(cwd,'node_modules','qtests','templates','qtests-runner.mjs.template'),path.join(cwd,'node_modules','qtests','lib','templates','qtests-runner.mjs.template')];const template=firstExisting(candidates);if(!template){process.stderr.write('ensure-runner: no runner template found; skipped\\n');process.exit(0)}const content=fs.readFileSync(template,'utf8');fs.writeFileSync(target,content,'utf8');process.stdout.write('ensure-runner: created qtests-runner.mjs from template\\n')}}catch(err){process.stderr.write('ensure-runner error: '+(err&& (err.stack||err.message) || String(err))+'\\n');process.exit(0)}\n`;
      try { fs.writeFileSync(ensurePath, ensureContent, 'utf8'); } catch {}
    } catch {}
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
      this.ensureRunnerScripts();
      // Always update package.json so everyone runs tests the same way
      this.updatePackageJsonTestScript();
      // Optional migration for legacy generated test files when flag is set via CLI
      if ((this.config as any).migrateGeneratedTests) {
        this.migrateLegacyGeneratedTests();
      }
    } else {
      console.log('ℹ️ Dry run: Skipping Jest config and runner generation');
    }
    
    console.log(`📝 Generated ${this.scanned.length} TypeScript test files:`);
    this.scanned.forEach(test => {
      console.log(`   ${test.type}: ${test.file}`);
    });
  }

  /**
   * Migrate legacy generated test files in tests/generated-tests/ to the new naming and local utils.
   */
  private migrateLegacyGeneratedTests(): void {
    try {
      const genRoot = path.join(process.cwd(), this.config.TEST_DIR || 'tests/generated-tests');
      if (!fs.existsSync(genRoot)) return;
      // Ensure local httpTest utils exist prior to migration
      this.ensureLocalHttpTestUtils();

      const walk = (dir: string) => {
        fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) return walk(full);
          if (!/\.test\.ts$/.test(entry.name)) return;
          if (/GeneratedTest/.test(entry.name)) return; // already migrated

          const basename = path.basename(entry.name, '.test.ts');
          // Do not migrate or recreate tests for example.* files; remove them if present
          if (/^example(\.|$)/i.test(basename)) {
            try { fs.rmSync(full, { force: true }); } catch {}
            return;
          }
          let targetName: string | null = null;
          // example__get.test.ts -> example.GeneratedTest__get.test.ts
          const apiMatch = basename.match(/^(.*)__([a-z]+)$/i);
          if (apiMatch) {
            targetName = `${apiMatch[1]}.GeneratedTest__${apiMatch[2].toLowerCase()}.test.ts`;
          } else if (/\.GenerateTest$/.test(basename)) {
            // foo.GenerateTest.test.ts -> foo.GeneratedTest.test.ts
            targetName = `${basename.replace(/\.GenerateTest$/, '.GeneratedTest')}.test.ts`;
          }
          if (!targetName) return;

          const content = fs.readFileSync(full, 'utf8');
          let updated = content;
          // Normalize import of local http utilities (drop extension)
          updated = updated.replace(/from ['"]\.\.\/utils\/httpTest(?:\.js)?['"];?/g, "from '../utils/httpTest';");
          // Replace namespace import with named helpers when present
          updated = updated.replace(/import\s+\*\s+as\s+httpTest\s+from\s+['"][^'"]+['"];?/g,
            "import { createMockApp, supertest } from '../utils/httpTest';");

          const targetPath = path.join(dir, targetName);
          fs.writeFileSync(targetPath, updated, 'utf8');
          fs.rmSync(full, { force: true });
          this.scanned.push({ type: 'api', file: path.relative('.', targetPath) });
        });
      };
      walk(genRoot);
      // Normalize any lingering namespace usage after migration and remove unwanted example.* tests
      this.normalizeGeneratedTests(genRoot);
      this.removeUnwantedExampleTests(genRoot);
    } catch (err: any) {
      console.warn('⚠️  Migration of legacy generated tests failed:', err?.message || String(err));
    }
  }

  /**
   * Normalize generated test contents to use named httpTest helpers and correct imports.
   */
  private normalizeGeneratedTests(root: string): void {
    try {
      const files: string[] = [];
      const collect = (dir: string) => {
        fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
          const p = path.join(dir, e.name);
          if (e.isDirectory()) return collect(p);
          if (/\.test\.ts$/.test(e.name)) files.push(p);
        });
      };
      collect(root);
      files.forEach(p => {
        try {
          let c = fs.readFileSync(p, 'utf8');
          const before = c;
          c = c.replace(/import\s+\*\s+as\s+httpTest\s+from\s+['"][^'"]+['"];?/g,
                        "import { createMockApp, supertest } from '../utils/httpTest';");
          c = c.replace(/from ['"]\.\.\/utils\/httpTest(?:\.js)?['"];?/g, "from '../utils/httpTest';");
          c = c.replace(/\bhttpTest\./g, '');
          if (c !== before) {
            fs.writeFileSync(p, c, 'utf8');
          }
        } catch {}
      });
    } catch {}
  }

  /**
   * Remove any generated tests named after example.* to respect default skip policy.
   */
  private removeUnwantedExampleTests(root: string): void {
    try {
      const files: string[] = [];
      const collect = (dir: string) => {
        fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
          const p = path.join(dir, e.name);
          if (e.isDirectory()) return collect(p);
          if (/\.test\.ts$/.test(e.name) && /^example\./i.test(e.name)) files.push(p);
        });
      };
      collect(root);
      files.forEach(p => { try { fs.rmSync(p, { force: true }); } catch {} });
    } catch {}
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
