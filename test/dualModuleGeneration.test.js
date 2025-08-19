/**
 * Test qtests' ability to generate tests for both CommonJS and ES modules
 * Verifies the enhanced export detection and module-appropriate test generation
 */

const fs = require('fs');
const path = require('path');
const { TestGenerator } = require('../lib/testGenerator');

describe('qtests Dual Module System Test Generation', () => {
  let tempDir;
  let generator;

  beforeEach(() => {
    // Create UNIQUE temporary directory for parallel safety
    const uniqueId = `${process.hrtime.bigint()}-${Math.random().toString(36).substr(2, 9)}`;
    tempDir = path.join(__dirname, `temp_module_tests_${uniqueId}`);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    generator = new TestGenerator({
      SRC_DIR: tempDir,
      TEST_DIR: path.join(tempDir, 'tests')
    });
  });

  afterEach(() => {
    // Cleanup temporary files
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('CommonJS Export Detection', () => {
    it('should detect module.exports single function', () => {
      const commonJSCode = `
function calculateSum(a, b) {
  return a + b;
}

module.exports = calculateSum;
`;
      const exports = generator.extractExports(commonJSCode);
      expect(exports).toContain('calculateSum');
      expect(exports.length).toBe(1);
    });

    it('should detect module.exports object with multiple exports', () => {
      const commonJSCode = `
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }

class Calculator {
  constructor() {}
}

module.exports = {
  add,
  subtract,
  Calculator
};
`;
      const exports = generator.extractExports(commonJSCode);
      expect(exports).toContain('add');
      expect(exports).toContain('subtract');
      expect(exports).toContain('Calculator');
      expect(exports.length).toBe(3);
    });

    it('should detect exports.property assignments', () => {
      const commonJSCode = `
function helper1() {}
function helper2() {}

exports.helper1 = helper1;
exports.helper2 = helper2;
`;
      const exports = generator.extractExports(commonJSCode);
      expect(exports).toContain('helper1');
      expect(exports).toContain('helper2');
      expect(exports.length).toBe(2);
    });

    it('should detect module.exports.property assignments', () => {
      const commonJSCode = `
function utilityA() {}
function utilityB() {}

module.exports.utilityA = utilityA;
module.exports.utilityB = utilityB;
`;
      const exports = generator.extractExports(commonJSCode);
      expect(exports).toContain('utilityA');
      expect(exports).toContain('utilityB');
      expect(exports.length).toBe(2);
    });
  });

  describe('ES Module Export Detection', () => {
    it('should detect export const declarations', () => {
      const esModuleCode = `
export const API_URL = 'https://api.example.com';
export const MAX_RETRIES = 3;
`;
      const exports = generator.extractExports(esModuleCode);
      expect(exports).toContain('API_URL');
      expect(exports).toContain('MAX_RETRIES');
      expect(exports.length).toBe(2);
    });

    it('should detect export function declarations', () => {
      const esModuleCode = `
export function processData(data) {
  return data.map(item => item.value);
}

export function validateInput(input) {
  return typeof input === 'string';
}
`;
      const exports = generator.extractExports(esModuleCode);
      expect(exports).toContain('processData');
      expect(exports).toContain('validateInput');
      expect(exports.length).toBe(2);
    });

    it('should detect export class declarations', () => {
      const esModuleCode = `
export class DataProcessor {
  constructor() {}
}

export class ValidationEngine {
  validate() {}
}
`;
      const exports = generator.extractExports(esModuleCode);
      expect(exports).toContain('DataProcessor');
      expect(exports).toContain('ValidationEngine');
      expect(exports.length).toBe(2);
    });
  });

  describe('Mixed Module Pattern Detection', () => {
    it('should handle files with both ES and CommonJS patterns', () => {
      const mixedCode = `
// ES module style
export function esFunction() {
  return 'es';
}

// CommonJS style
function cjsFunction() {
  return 'cjs';
}

module.exports.cjsFunction = cjsFunction;
`;
      const exports = generator.extractExports(mixedCode);
      expect(exports).toContain('esFunction');
      expect(exports).toContain('cjsFunction');
      expect(exports.length).toBe(2);
    });
  });

  describe('Import Detection (CommonJS vs ES Modules)', () => {
    it('should detect CommonJS require statements', () => {
      const commonJSCode = `
const fs = require('fs');
const path = require('path');
const axios = require('axios');
`;
      const imports = generator.getUsedModules(commonJSCode);
      expect(imports).toContain('fs');
      expect(imports).toContain('path');
      expect(imports).toContain('axios');
    });

    it('should detect ES module import statements', () => {
      const esModuleCode = `
import fs from 'fs';
import { resolve } from 'path';
import axios from 'axios';
`;
      const imports = generator.getUsedModules(esModuleCode);
      expect(imports).toContain('fs');
      expect(imports).toContain('path');
      expect(imports).toContain('axios');
    });

    it('should filter out relative imports', () => {
      const codeWithRelative = `
const fs = require('fs');
const local = require('./localFile');
const parent = require('../parentFile');
import axios from 'axios';
import { util } from './utils';
`;
      const imports = generator.getUsedModules(codeWithRelative);
      expect(imports).toContain('fs');
      expect(imports).toContain('axios');
      expect(imports).not.toContain('./localFile');
      expect(imports).not.toContain('../parentFile');
      expect(imports).not.toContain('./utils');
    });
  });

  describe('Test Generation for Different Module Systems', () => {
    it('should generate CommonJS-style tests for CommonJS projects', () => {
      // Mock CommonJS project (no "type": "module" in package.json)
      generator.isESModule = false;
      
      const commonJSFile = path.join(tempDir, 'mathUtils.js');
      const commonJSCode = `
function add(a, b) {
  return a + b;
}

module.exports = { add };
`;
      fs.writeFileSync(commonJSFile, commonJSCode);
      
      const exports = generator.extractExports(commonJSCode);
      const testContent = generator.createUnitTest(commonJSFile, exports, false, []);
      
      // Should use require syntax
      expect(testContent).toContain('const mod = require(');
      expect(testContent).not.toContain('import');
      expect(testContent).toContain("describe('mathUtils.js'");
      expect(testContent).toContain("test('add works'");
    });

    it('should generate ES module-style tests for ES module projects', () => {
      // Mock ES module project
      generator.isESModule = true;
      
      const esModuleFile = path.join(tempDir, 'dataProcessor.js');
      const esModuleCode = `
export function process(data) {
  return data.filter(Boolean);
}
`;
      fs.writeFileSync(esModuleFile, esModuleCode);
      
      const exports = generator.extractExports(esModuleCode);
      const testContent = generator.createUnitTest(esModuleFile, exports, false, []);
      
      // Should use import syntax
      expect(testContent).toContain('import * as mod from');
      expect(testContent).not.toContain('require(');
      expect(testContent).toContain("describe('dataProcessor.js'");
      expect(testContent).toContain("test('process works'");
    });
  });

  describe('Real File Analysis and Test Generation', () => {
    it('should analyze and generate tests for CommonJS files', () => {
      const commonJSFile = path.join(tempDir, 'realCommonJS.js');
      const commonJSCode = `
const fs = require('fs');

function readConfig(filename) {
  return JSON.parse(fs.readFileSync(filename, 'utf8'));
}

class ConfigManager {
  constructor() {
    this.config = {};
  }
  
  load(file) {
    this.config = readConfig(file);
  }
}

module.exports = {
  readConfig,
  ConfigManager
};
`;
      fs.writeFileSync(commonJSFile, commonJSCode);
      
      // Analyze the file
      generator.analyze(commonJSFile);
      
      // Check if test was generated
      const expectedTestPath = generator.getRelativeTestPath(commonJSFile, 'unit');
      expect(generator.scanned.length).toBeGreaterThan(0);
      expect(generator.scanned[0].type).toBe('unit');
    });

    it('should analyze and generate tests for ES module files', () => {
      const esModuleFile = path.join(tempDir, 'realESModule.js');
      const esModuleCode = `
export function validateEmail(email) {
  return email.includes('@');
}

export class EmailValidator {
  constructor() {}
  
  isValid(email) {
    return validateEmail(email);
  }
}
`;
      fs.writeFileSync(esModuleFile, esModuleCode);
      
      // Analyze the file
      generator.analyze(esModuleFile);
      
      // Check if test was generated
      expect(generator.scanned.length).toBeGreaterThan(0);
      expect(generator.scanned[0].type).toBe('unit');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle files with no exports gracefully', () => {
      const noExportsCode = `
// Just some utility functions that aren't exported
function internal() {}
const PRIVATE_CONST = 'private';
`;
      const exports = generator.extractExports(noExportsCode);
      expect(exports).toEqual([]);
    });

    it('should handle malformed export patterns', () => {
      const malformedCode = `
module.exports = 
function incomplete() {}
exports. = 'invalid';
export 
`;
      const exports = generator.extractExports(malformedCode);
      // Should not crash and return valid exports only
      expect(Array.isArray(exports)).toBe(true);
    });

    it('should handle files with comments containing export-like patterns', () => {
      const commentCode = `
// This is not an export: module.exports = fake
/* 
 * export function commentedOut() {}
 */
function realFunction() {}
module.exports = realFunction;
`;
      const exports = generator.extractExports(commentCode);
      expect(exports).toContain('realFunction');
      expect(exports).not.toContain('fake');
      expect(exports).not.toContain('commentedOut');
    });
  });
});