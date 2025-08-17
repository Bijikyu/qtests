/**
 * Test Suite for Test Generator
 * 
 * Comprehensive testing of the TestGenerator class and CLI functionality.
 * Tests file scanning, code analysis, test generation, and CLI interface.
 */

const { runTestSuite, createAssertions } = require('../utils/runTestSuite');
const { TestGenerator, DEFAULT_CONFIG, PATTERNS } = require('../lib/testGenerator');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const assert = createAssertions();

// Test Generator Configuration Tests
const configTests = [
  ['uses default configuration', () => {
    const defaultGen = new TestGenerator();
    assert.equal(defaultGen.config.SRC_DIR, 'src', 'Should use default src directory');
    assert.equal(defaultGen.config.TEST_DIR, 'tests/integration', 'Should use default test directory');
    assert.truthy(defaultGen.config.KNOWN_MOCKS.includes('axios'), 'Should include axios in known mocks');
    assert.truthy(defaultGen.config.VALID_EXTS.includes('.js'), 'Should include .js extension');
  }],

  ['accepts custom configuration', () => {
    const customGen = new TestGenerator({
      SRC_DIR: 'lib',
      TEST_DIR: 'spec',
      KNOWN_MOCKS: ['custom-lib']
    });
    
    assert.equal(customGen.config.SRC_DIR, 'lib', 'Should use custom src directory');
    assert.equal(customGen.config.TEST_DIR, 'spec', 'Should use custom test directory');
    assert.truthy(customGen.config.KNOWN_MOCKS.includes('custom-lib'), 'Should include custom mock');
  }]
];

// File System Operations Tests
const fileSystemTests = [
  ['walks directory structure', () => {
    const tempDir = path.join(__dirname, 'temp-test-' + Date.now());
    fs.mkdirSync(tempDir, { recursive: true });
    
    try {
      // Create test files
      const srcDir = path.join(tempDir, 'src');
      fs.mkdirSync(srcDir, { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'utils.js'), 'export const helper = () => {};');
      fs.mkdirSync(path.join(srcDir, 'components'), { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'components', 'Button.tsx'), 'export const Button = () => {};');
      
      const originalCwd = process.cwd();
      process.chdir(tempDir);
      
      try {
        const generator = new TestGenerator({ SRC_DIR: 'src', TEST_DIR: 'tests' });
        const files = generator.walk('src');
        
        assert.truthy(files.length >= 2, 'Should find multiple files');
        assert.truthy(files.some(f => f.endsWith('utils.js')), 'Should find utils.js');
        assert.truthy(files.some(f => f.endsWith('Button.tsx')), 'Should find Button.tsx');
      } finally {
        process.chdir(originalCwd);
      }
    } finally {
      // Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }]
];

// CLI Tests
const cliTests = [
  ['CLI script exists and is executable', () => {
    const cliPath = path.join(__dirname, '..', 'bin', 'qtests-generate');
    assert.truthy(fs.existsSync(cliPath), 'CLI script should exist');
    
    const stats = fs.statSync(cliPath);
    assert.truthy(stats.mode & 0o111, 'CLI script should be executable'); // Check executable bit
  }],

  ['CLI shows help when requested', () => {
    const result = execSync('node bin/qtests-generate --help', { 
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    assert.truthy(result.includes('USAGE'), 'Help should include usage information');
    assert.truthy(result.includes('OPTIONS'), 'Help should include options');
    assert.truthy(result.includes('qtests-generate'), 'Help should include command name');
  }],

  ['CLI shows version when requested', () => {
    const result = execSync('node bin/qtests-generate --version', { 
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    assert.truthy(result.includes('qtests v'), 'Version should include qtests version');
  }]
];

// Test Generation Tests  
const generationTests = [
  ['generates unit test content', () => {
    const generator = new TestGenerator();
    const exports = ['calculate', 'Calculator'];
    const usesQtests = false;
    const mocks = ['axios'];
    
    const testContent = generator.createUnitTest('calculator.js', exports, usesQtests, mocks);
    
    assert.truthy(testContent.includes('calculate'), 'Should include function name');
    assert.truthy(testContent.includes('Calculator'), 'Should include class name');
    assert.truthy(testContent.includes('describe'), 'Should include describe statements');
  }],

  ['generates API test content', () => {
    const generator = new TestGenerator();
    const method = 'get';
    const route = '/api/users';
    
    const testContent = generator.createApiTest(method, route);
    
    assert.truthy(testContent.includes('/api/users'), 'Should include route path');
    assert.truthy(testContent.includes('GET'), 'Should include GET method');
    assert.truthy(testContent.includes('request'), 'Should include request statements');
  }]
];

// Run all test suites
async function runAllTests() {
  console.log('🧪 Running Test Generator Tests...\n');
  
  await runTestSuite('Configuration Tests', configTests);
  await runTestSuite('File System Tests', fileSystemTests);
  await runTestSuite('CLI Tests', cliTests);
  await runTestSuite('Generation Tests', generationTests);
  
  console.log('\n✅ All Test Generator tests completed!');
}

// Run tests if this is the main module
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };