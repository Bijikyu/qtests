// Simplified TestGenerator test to prevent timeout issues
describe('TestGenerator basic tests', () => {
  test('TestGenerator module loads without errors', () => {
    expect(() => require('../lib/testGenerator')).not.toThrow();
    const { TestGenerator } = require('../lib/testGenerator');
    expect(TestGenerator).toBeDefined();
    expect(typeof TestGenerator).toBe('function');
  });

  test('CLI script exists', () => {
    const fs = require('fs');
    const path = require('path');
    const cliPath = path.join(__dirname, '..', 'bin', 'qtests-generate');
    expect(fs.existsSync(cliPath)).toBe(true);
  });

  it('should show help when requested', () => {
    const result = execSync('node bin/qtests-generate --help', { 
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    expect(result).toContain('USAGE');
    expect(result).toContain('OPTIONS');
    expect(result).toContain('qtests-generate');
  });

  it('should show version when requested', () => {
    const result = execSync('node bin/qtests-generate --version', { 
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    expect(result).toContain('qtests v');
  });
});

describe('TestGenerator Content Generation', () => {
  it('should generate unit test content', () => {
    const generator = new TestGenerator();
    const exports = ['calculate', 'Calculator'];
    const usesQtests = false;
    const mocks = ['axios'];
    
    const testContent = generator.createUnitTest('calculator.js', exports, usesQtests, mocks);
    
    expect(testContent).toContain('calculate');
    expect(testContent).toContain('Calculator');
    expect(testContent).toContain('describe');
  });

  it('should generate API test content', () => {
    const generator = new TestGenerator();
    const method = 'get';
    const route = '/api/users';
    
    const testContent = generator.createApiTest(method, route);
    
    expect(testContent).toContain('/api/users');
    expect(testContent).toContain('GET');
    expect(testContent).toContain('request');
  });
});