/**
 * Integration tests for qtests module system detection and test generation
 * Tests the complete workflow from project analysis to test file creation
 */

const fs = require('fs');
const path = require('path');
const { TestGenerator } = require('../lib/testGenerator');

describe('qtests Module System Integration Tests', () => {
  let testProjectDir;
  let originalCwd;

  beforeEach(() => {
    // Save original working directory
    originalCwd = process.cwd();
    
    // Create UNIQUE temporary project directory for parallel safety
    const uniqueId = `${process.hrtime.bigint()}-${Math.random().toString(36).substr(2, 9)}`;
    testProjectDir = path.join(__dirname, `temp_integration_project_${uniqueId}`);
    if (fs.existsSync(testProjectDir)) {
      fs.rmSync(testProjectDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testProjectDir, { recursive: true });
    
    // Change to test project directory
    process.chdir(testProjectDir);
    
    // Ensure clean environment with no package.json initially
    const packagePath = path.join(testProjectDir, 'package.json');
    if (fs.existsSync(packagePath)) {
      fs.unlinkSync(packagePath);
    }
  });

  afterEach(() => {
    // Restore original working directory
    process.chdir(originalCwd);
    
    // Cleanup test project
    if (fs.existsSync(testProjectDir)) {
      fs.rmSync(testProjectDir, { recursive: true, force: true });
    }
  });

  describe('CommonJS Project Integration', () => {
    beforeEach(() => {
      // Create package.json for CommonJS project (no "type": "module")
      const packageJson = {
        name: 'test-commonjs-project',
        version: '1.0.0',
        main: 'index.js'
      };
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    });

    it('should detect CommonJS project and generate appropriate tests', () => {
      // Create source directory and files
      fs.mkdirSync('src');
      
      const mathUtilsCode = `
const fs = require('fs');

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

class Calculator {
  constructor() {
    this.result = 0;
  }
  
  calculate(operation, a, b) {
    switch(operation) {
      case 'add': return add(a, b);
      case 'multiply': return multiply(a, b);
      default: return 0;
    }
  }
}

module.exports = {
  add,
  multiply,
  Calculator
};
`;
      fs.writeFileSync('src/mathUtils.js', mathUtilsCode);
      
      const stringUtilsCode = `
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function reverse(str) {
  return str.split('').reverse().join('');
}

exports.capitalize = capitalize;
exports.reverse = reverse;
`;
      fs.writeFileSync('src/stringUtils.js', stringUtilsCode);
      
      // Run qtests generator
      const generator = new TestGenerator({ SRC_DIR: 'src' });
      
      // Verify module system detection
      expect(generator.isESModule).toBe(false);
      
      // Generate tests
      const results = generator.generate();
      
      // Verify tests were generated
      expect(results.length).toBeGreaterThan(0);
      
      // Check that generated tests use CommonJS syntax
      const mathUtilsTestPath = generator.getRelativeTestPath('src/mathUtils.js', 'unit');
      if (fs.existsSync(mathUtilsTestPath)) {
        const testContent = fs.readFileSync(mathUtilsTestPath, 'utf8');
        expect(testContent).toContain('const mod = require(');
        expect(testContent).not.toContain('import');
        expect(testContent).toContain("test('add works'");
        expect(testContent).toContain("test('multiply works'");
        expect(testContent).toContain("test('Calculator works'");
      }
    });

    it('should handle mixed CommonJS patterns in the same project', () => {
      fs.mkdirSync('lib');
      
      // File with module.exports object
      const file1Code = `
function helper1() { return 'helper1'; }
function helper2() { return 'helper2'; }

module.exports = { helper1, helper2 };
`;
      fs.writeFileSync('lib/helpers.js', file1Code);
      
      // File with exports.property
      const file2Code = `
function util1() { return 'util1'; }
function util2() { return 'util2'; }

exports.util1 = util1;
exports.util2 = util2;
`;
      fs.writeFileSync('lib/utils.js', file2Code);
      
      // File with single module.exports
      const file3Code = `
class Manager {
  constructor() {}
  manage() { return 'managing'; }
}

module.exports = Manager;
`;
      fs.writeFileSync('lib/manager.js', file3Code);
      
      const generator = new TestGenerator({ SRC_DIR: 'lib' });
      const results = generator.generate();
      
      // Should generate tests for all three files
      expect(results.length).toBe(3);
      
      // Verify each test file contains expected exports
      results.forEach(result => {
        expect(result.type).toBe('unit');
        const testPath = result.file;
        if (fs.existsSync(testPath)) {
          const testContent = fs.readFileSync(testPath, 'utf8');
          expect(testContent).toContain('const mod = require(');
        }
      });
    });
  });

  describe('ES Module Project Integration', () => {
    beforeEach(() => {
      // Create package.json for ES module project
      const packageJson = {
        name: 'test-esmodule-project',
        version: '1.0.0',
        type: 'module',
        main: 'index.js'
      };
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    });

    it('should detect ES module project and generate appropriate tests', () => {
      fs.mkdirSync('src');
      
      const dataProcessorCode = `
import fs from 'fs';

export function processData(data) {
  return data.filter(item => item.active);
}

export function saveData(data, filename) {
  fs.writeFileSync(filename, JSON.stringify(data));
}

export class DataManager {
  constructor() {
    this.data = [];
  }
  
  add(item) {
    this.data.push(item);
  }
  
  process() {
    return processData(this.data);
  }
}
`;
      fs.writeFileSync('src/dataProcessor.js', dataProcessorCode);
      
      const validatorCode = `
export const EMAIL_REGEX = /^[^@]+@[^@]+\\.[^@]+$/;

export function validateEmail(email) {
  return EMAIL_REGEX.test(email);
}

export function validateRequired(value) {
  return value !== null && value !== undefined && value !== '';
}
`;
      fs.writeFileSync('src/validator.js', validatorCode);
      
      // Run qtests generator
      const generator = new TestGenerator({ SRC_DIR: 'src' });
      
      // Verify module system detection
      expect(generator.isESModule).toBe(true);
      
      // Generate tests
      const results = generator.generate();
      
      // Verify tests were generated
      expect(results.length).toBeGreaterThan(0);
      
      // Check that generated tests use ES module syntax
      const dataProcessorTestPath = generator.getRelativeTestPath('src/dataProcessor.js', 'unit');
      if (fs.existsSync(dataProcessorTestPath)) {
        const testContent = fs.readFileSync(dataProcessorTestPath, 'utf8');
        expect(testContent).toContain('import * as mod from');
        expect(testContent).not.toContain('require(');
        expect(testContent).toContain("test('processData works'");
        expect(testContent).toContain("test('saveData works'");
        expect(testContent).toContain("test('DataManager works'");
      }
    });
  });

  describe('Mixed Project Detection', () => {
    it('should handle projects without package.json by analyzing source code', () => {
      // No package.json file, so detection relies on source code analysis
      fs.mkdirSync('src');
      
      // Create files with mostly ES module patterns
      const esFile1 = `
export function func1() {}
export const CONST1 = 'value';
`;
      fs.writeFileSync('src/esFile1.js', esFile1);
      
      const esFile2 = `
export class MyClass {}
export function func2() {}
`;
      fs.writeFileSync('src/esFile2.js', esFile2);
      
      // One CommonJS file
      const cjsFile = `
function func3() {}
module.exports = func3;
`;
      fs.writeFileSync('src/cjsFile.js', cjsFile);
      
      const generator = new TestGenerator({ SRC_DIR: 'src' });
      
      // Should detect ES modules due to prevalence
      expect(generator.isESModule).toBe(true);
      
      const results = generator.generate();
      expect(results.length).toBe(3); // All files should have tests generated
    });

    it('should default to CommonJS when no clear pattern emerges', () => {
      fs.mkdirSync('src');
      
      // Create a package.json explicitly without "type": "module"
      fs.writeFileSync('package.json', JSON.stringify({
        name: 'test-project',
        version: '1.0.0',
        main: 'index.js'
      }, null, 2));
      
      // Files without clear module patterns - no import/export/require/module.exports
      const ambiguousFile = `
function utilityFunction() {
  return 'result';
}

// No clear export pattern - just a plain function
const helper = function() {
  return 'helper';
};
`;
      fs.writeFileSync('src/ambiguous.js', ambiguousFile);
      
      const generator = new TestGenerator({ SRC_DIR: 'src' });
      
      // Should default to CommonJS when no package.json "type": "module" and no clear ES patterns
      expect(generator.isESModule).toBe(false);
    });
  });

  describe('API Route Detection Integration', () => {
    it('should generate API tests regardless of module system', () => {
      fs.mkdirSync('routes');
      
      // CommonJS style API routes
      const commonJSApiCode = `
const express = require('express');
const router = express.Router();

router.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

router.post('/api/users', (req, res) => {
  res.json({ success: true });
});

module.exports = router;
`;
      fs.writeFileSync('routes/users.js', commonJSApiCode);
      
      const generator = new TestGenerator({ SRC_DIR: 'routes' });
      const results = generator.generate();
      
      // Should generate both unit tests and API tests
      const apiTests = results.filter(r => r.type === 'api');
      expect(apiTests.length).toBeGreaterThan(0);
      
      // Check API test content
      apiTests.forEach(test => {
        if (fs.existsSync(test.file)) {
          const testContent = fs.readFileSync(test.file, 'utf8');
          expect(testContent).toContain('describe(');
          expect(testContent).toContain('httpTest');
        }
      });
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle large projects efficiently', () => {
      fs.mkdirSync('large-project');
      
      // Create multiple directories and files
      for (let i = 0; i < 10; i++) {
        const dirName = `module${i}`;
        fs.mkdirSync(path.join('large-project', dirName));
        
        for (let j = 0; j < 5; j++) {
          const fileName = `file${j}.js`;
          const code = `
export function func${i}_${j}() {
  return ${i} + ${j};
}

export const CONST${i}_${j} = 'value_${i}_${j}';
`;
          fs.writeFileSync(path.join('large-project', dirName, fileName), code);
        }
      }
      
      const startTime = Date.now();
      const generator = new TestGenerator({ SRC_DIR: 'large-project' });
      const results = generator.generate();
      const endTime = Date.now();
      
      // Should complete in reasonable time (less than 5 seconds)
      expect(endTime - startTime).toBeLessThan(5000);
      
      // Should generate tests for all files
      expect(results.length).toBe(50); // 10 dirs * 5 files each
    });

    it('should gracefully handle files with syntax errors', () => {
      fs.mkdirSync('problematic');
      
      const syntaxErrorCode = `
function valid() {
  return 'valid';
}

// Syntax error below
export function broken( {
  return 'broken';
}

module.exports = valid;
`;
      fs.writeFileSync('problematic/broken.js', syntaxErrorCode);
      
      const generator = new TestGenerator({ SRC_DIR: 'problematic' });
      
      // Should not crash
      expect(() => {
        const results = generator.generate();
      }).not.toThrow();
    });
  });
});