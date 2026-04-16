/**
 * Security Validator Fix Regression Tests
 *
 * Covers the four bugs fixed in JoiSecurityValidator, SecurityValidator,
 * and SecurityTestingFramework:
 *  1. validateInput(value, 'string') now catches SQL injection
 *  2. validateURL rejects javascript: and other non-http(s) protocols
 *  3. PenetrationTester methods accept callback functions
 *  4. sanitized field is always a cleaned string, never the raw attack
 */

const { validateInput, validateURL, validateUserInput } = require('../../dist/lib/security/SecurityValidator.js');
const { PenetrationTester } = require('../../dist/lib/security/SecurityTestingFramework.js');

describe('Fix 1 — validateInput with "string" rule catches SQL injection', () => {
  const sqlAttacks = [
    ["admin'--", 'quote-comment bypass'],
    ['1 OR 1=1', 'boolean bypass'],
    ['EXEC xp_cmdshell', 'DDL exec'],
    ["' OR '1'='1", 'quote equality bypass'],
    ['1 UNION SELECT * FROM users', 'UNION attack'],
    ['1; WAITFOR DELAY 0:0:5--', 'time-based blind'],
    ['SELECT * FROM passwords', 'SELECT statement'],
    ['DROP TABLE users;', 'DROP statement'],
  ];

  test.each(sqlAttacks)('rejects "%s" (%s)', (attack) => {
    const result = validateInput(attack, 'string');
    expect(result.valid).toBe(false);
  });

  const safeInputs = [
    ['John Smith', 'plain name'],
    ['Hello world', 'plain sentence'],
    ['normal text here', 'plain text'],
    ['12345', 'number string'],
  ];

  test.each(safeInputs)('allows clean input: "%s" (%s)', (safe) => {
    const result = validateInput(safe, 'string');
    expect(result.valid).toBe(true);
  });
});

describe('Fix 2 — validateURL blocks dangerous protocols', () => {
  const dangerous = [
    ['javascript:alert(1)', 'javascript protocol'],
    ['javascript:void(0)', 'javascript void'],
    ['ftp://files.example.com', 'ftp protocol'],
    ['data:text/html,<script>alert(1)</script>', 'data uri'],
    ['vbscript:msgbox(1)', 'vbscript protocol'],
  ];

  test.each(dangerous)('rejects "%s" (%s)', (url) => {
    const result = validateURL(url);
    expect(result.valid).toBe(false);
  });

  const safe = [
    ['https://example.com', 'https'],
    ['http://example.com', 'http'],
    ['https://api.example.com/v1/users?page=1', 'https with path'],
    ['http://localhost:3000', 'localhost'],
  ];

  test.each(safe)('allows "%s" (%s)', (url) => {
    const result = validateURL(url);
    expect(result.valid).toBe(true);
  });
});

describe('Fix 3 — PenetrationTester accepts callback functions', () => {
  let pt;

  beforeEach(() => {
    pt = new PenetrationTester();
  });

  test('testXSS does not throw when passed a callback', () => {
    expect(() => pt.testXSS((payload) => payload)).not.toThrow();
  });

  test('testXSS callback result has correct shape', () => {
    const result = pt.testXSS((payload) => payload);
    expect(result).toHaveProperty('passed');
    expect(result).toHaveProperty('vulnerabilities');
    expect(result).toHaveProperty('recommendations');
    expect(result).toHaveProperty('executionTime');
  });

  test('testXSS callback detects unfiltered payloads', () => {
    const result = pt.testXSS((payload) => payload);
    expect(result.passed).toBe(false);
    expect(result.vulnerabilities.length).toBeGreaterThan(0);
  });

  test('testXSS callback passes when handler strips dangerous content', () => {
    const result = pt.testXSS((payload) =>
      payload
        .replace(/<[^>]*>/g, '')
        .replace(/javascript:/gi, '')
        .replace(/onerror=/gi, '')
    );
    expect(result.passed).toBe(true);
  });

  test('testSQLInjection does not throw when passed a callback', () => {
    expect(() => pt.testSQLInjection((payload) => payload)).not.toThrow();
  });

  test('testSQLInjection callback detects unfiltered SQL payloads', () => {
    const result = pt.testSQLInjection((payload) => payload);
    expect(result.vulnerabilities.length).toBeGreaterThan(0);
  });

  test('testPathTraversal does not throw when passed a callback', () => {
    expect(() => pt.testPathTraversal((payload) => payload)).not.toThrow();
  });

  test('testPathTraversal callback detects unfiltered traversal payloads', () => {
    const result = pt.testPathTraversal((payload) => payload);
    expect(result.vulnerabilities.length).toBeGreaterThan(0);
  });

  test('testPathTraversal callback passes when handler always returns a safe path', () => {
    const result = pt.testPathTraversal(() => '/safe/allowed/file.txt');
    expect(result.passed).toBe(true);
  });

  test('testCommandInjection does not throw when passed a callback', () => {
    expect(() => pt.testCommandInjection((payload) => payload)).not.toThrow();
  });

  test('testCommandInjection callback detects unfiltered injection payloads', () => {
    const result = pt.testCommandInjection((payload) => payload);
    expect(result.vulnerabilities.length).toBeGreaterThan(0);
  });

  test('testCommandInjection callback passes when handler always returns a safe command', () => {
    const result = pt.testCommandInjection(() => 'npm');
    expect(result.passed).toBe(true);
  });

  test('testXSS still works with string template', () => {
    expect(() => pt.testXSS('hello {{payload}} world')).not.toThrow();
  });

  test('testSQLInjection still works with string template', () => {
    expect(() =>
      pt.testSQLInjection('SELECT * FROM users WHERE id = {{param}}')
    ).not.toThrow();
  });
});

describe('Fix 4 — sanitized field is always a cleaned string', () => {
  test('sanitized does not contain <script> tags even when valid is false', () => {
    const result = validateUserInput('<script>alert(1)</script>');
    expect(result.valid).toBe(false);
    expect(result.sanitized).toBeDefined();
    expect(result.sanitized).not.toContain('<script>');
  });

  test('sanitized does not contain onerror attributes even when valid is false', () => {
    const result = validateUserInput('<img src=x onerror=alert(1)>');
    expect(result.valid).toBe(false);
    expect(result.sanitized).not.toContain('onerror=');
  });

  test('sanitized is still set for valid clean input', () => {
    const result = validateUserInput('Hello world');
    expect(result.valid).toBe(true);
    expect(result.sanitized).toBe('Hello world');
  });

  test('sanitized field is a string type when input is a string', () => {
    const result = validateUserInput("'; DROP TABLE users;--");
    expect(result.valid).toBe(false);
    expect(typeof result.sanitized).toBe('string');
  });
});
