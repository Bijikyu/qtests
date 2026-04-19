/**
 * Test Generator Demo
 * 
 * This example shows how to use the qtests TestGenerator both programmatically
 * and via the CLI to automatically generate unit tests and API tests from source code.
 */

const { TestGenerator } = require('../index');
const fs = require('fs');
const path = require('path');

console.log('🧪 qtests Test Generator Demo\n');

// Example 1: Programmatic usage
console.log('--- Example 1: Programmatic Usage ---');

// Create a test generator with custom configuration
const generator = new TestGenerator({
  SRC_DIR: 'demo/src',
  TEST_DIR: 'demo/tests',
  KNOWN_MOCKS: ['axios', 'express', 'mongoose']
});

console.log('Configuration:');
console.log(`  Source directory: ${generator.config.SRC_DIR}`);
console.log(`  Test directory: ${generator.config.TEST_DIR}`);
console.log(`  Known mocks: ${generator.config.KNOWN_MOCKS.join(', ')}`);

// Generate tests programmatically
try {
  const results = generator.generate();
  
  console.log('\nGeneration Results:');
  console.log(`  Total files generated: ${results.length}`);
  
  const unitTests = results.filter(r => r.type === 'unit');
  const apiTests = results.filter(r => r.type === 'api');
  
  console.log(`  Unit tests: ${unitTests.length}`);
  console.log(`  API tests: ${apiTests.length}`);
  
  if (results.length > 0) {
    console.log('\nGenerated files:');
    results.forEach(result => {
      const icon = result.type === 'unit' ? '📦' : '🌐';
      console.log(`  ${icon} ${result.file}`);
    });
  }
  
} catch (error) {
  console.error('Generation failed:', error.message);
}

// Example 2: Code analysis features
console.log('\n--- Example 2: Code Analysis Features ---');

// Analyze a specific file
const sampleFile = path.join(__dirname, '..', 'demo', 'src', 'calculator.js');
if (fs.existsSync(sampleFile)) {
  const content = fs.readFileSync(sampleFile, 'utf8');
  
  // Extract exports
  const { PATTERNS } = require('../lib/testGenerator');
  const exports = [...content.matchAll(PATTERNS.exports)].map(m => m[1]);
  console.log(`Detected exports: ${exports.join(', ')}`);
  
  // Extract imports
  const modules = generator.getUsedModules(content);
  console.log(`Detected imports: ${modules.join(', ')}`);
  
  // Check for qtests usage
  const usesQtests = PATTERNS.qtests.test(content);
  console.log(`Uses qtests framework: ${usesQtests}`);
}

// Example 3: CLI usage examples
console.log('\n--- Example 3: CLI Usage Examples ---');

console.log('Generate tests with default settings:');
console.log('  qtests-generate');
console.log('');

console.log('Generate tests for custom source directory:');
console.log('  qtests-generate --src lib');
console.log('');

console.log('Generate tests with custom source and test directories:');
console.log('  qtests-generate --src app --test-dir spec');
console.log('');

console.log('Show help:');
console.log('  qtests-generate --help');
console.log('');

console.log('Show version:');
console.log('  qtests-generate --version');

// Example 4: Generated test structure
console.log('\n--- Example 4: Generated Test Structure ---');

console.log('Unit Test Example:');
console.log(`
// Auto-generated unit test for calculator.js
jest.mock('axios');
import * as mod from './calculator.js';

describe('calculator.js', () => {
  test('add works', () => {
    // TODO: test mod.add
  });
  test('Calculator works', () => {
    // TODO: test mod.Calculator
  });
});
`);

console.log('API Test Example:');
console.log(`
// Auto-generated API test for GET /api/users
import request from '../../src/app';

describe('GET /api/users', () => {
  test('should succeed', async () => {
    const res = await request.get('/api/users');
    expect(res.status).toBe(200);
  });

  test('should handle failure', async () => {
    const res = await request.get('/api/users').send({ bad: true });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
`);

// Example 5: Integration with qtests utilities
console.log('--- Example 5: Integration with qtests ---');

console.log('Generated tests work seamlessly with qtests utilities:');
console.log(`
import { TestGenerator, stubMethod, mockConsole } from 'qtests';

// Generate tests
const generator = new TestGenerator();
generator.generate();

// Use qtests utilities in generated tests
const restore = stubMethod(myObject, 'method', () => 'mocked');
const mockLog = mockConsole();

// Your test code here...

restore(); // Clean up stub
mockLog.restore(); // Restore console
`);

console.log('\n✅ Demo completed! Check the demo/ directory for generated test files.');
console.log('💡 Tip: Run the generated tests with "npm test" in the demo directory.');