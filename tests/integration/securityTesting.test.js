/**
 * SecurityTestingFramework Regression Tests
 *
 * Regression-locks the security TESTING utilities:
 * PenetrationTester, SecurityRegressionTester, and the Joi-based
 * validateJSON NoSQL injection detection.
 */

const {
  PenetrationTester,
  SecurityRegressionTester,
  runFullSecurityTest,
  generateSecurityTestReport,
} = require('../../dist/lib/security/SecurityTestingFramework.js');

const {
  JoiSecurityValidator,
} = require('../../dist/lib/security/JoiSecurityValidator.js');

// ─── Fix: sanitize() strips javascript: URIs ─────────────────────────────────

describe('Fix — SecurityValidator.sanitize strips javascript: URIs', () => {
  test('testXSS string-template mode with sanitize=true passes for all built-in payloads', () => {
    const pt = new PenetrationTester();
    const r = pt.testXSS('input={{payload}}', true);
    expect(r.passed).toBe(true);
    expect(r.vulnerabilities).toHaveLength(0);
  });

  test('testXSS callback mode with sanitizing callback: no vulnerabilities', () => {
    const pt = new PenetrationTester();
    const r = pt.testXSS(p =>
      p.replace(/<[^>]+>/g, '')
       .replace(/javascript\s*:/gi, '')
       .replace(/onerror=/gi, '')
    );
    expect(r.passed).toBe(true);
  });

  test('testXSS callback mode with identity callback: detects raw payloads', () => {
    const pt = new PenetrationTester();
    const r = pt.testXSS(p => p);
    expect(r.passed).toBe(false);
    expect(r.vulnerabilities.length).toBeGreaterThan(0);
  });
});

// ─── Fix: validateJSON rejects NoSQL injection operators ─────────────────────

describe('Fix — validateJSON rejects NoSQL injection operators', () => {
  let validator;
  beforeEach(() => { validator = new JoiSecurityValidator(); });

  test('rejects $where operator', () => {
    const r = validator.validateJSON('{"$where":"this.username==\'admin\'"}');
    expect(r.valid).toBe(false);
  });

  test('rejects $gt operator', () => {
    const r = validator.validateJSON('{"age":{"$gt":0}}');
    expect(r.valid).toBe(false);
  });

  test('rejects $ne operator', () => {
    const r = validator.validateJSON('{"password":{"$ne":""}}');
    expect(r.valid).toBe(false);
  });

  test('rejects $or operator', () => {
    const r = validator.validateJSON('{"$or":[{"user":"admin"},{"pass":"x"}]}');
    expect(r.valid).toBe(false);
  });

  test('rejects $regex operator', () => {
    const r = validator.validateJSON('{"username":{"$regex":".*"}}');
    expect(r.valid).toBe(false);
  });

  test('rejects nested $expr operator', () => {
    const r = validator.validateJSON('{"$expr":{"$eq":["$username","admin"]}}');
    expect(r.valid).toBe(false);
  });

  test('still rejects __proto__ prototype pollution', () => {
    const r = validator.validateJSON('{"__proto__":{"isAdmin":true}}');
    expect(r.valid).toBe(false);
  });

  test('still rejects invalid JSON', () => {
    const r = validator.validateJSON('{bad json}');
    expect(r.valid).toBe(false);
  });

  test('accepts clean JSON with no operators or pollution', () => {
    const r = validator.validateJSON('{"name":"Alice","age":30}');
    expect(r.valid).toBe(true);
  });

  test('accepts JSON with dollar sign in values (not keys)', () => {
    const r = validator.validateJSON('{"price":"$100","desc":"$10 off"}');
    expect(r.valid).toBe(true);
  });
});

// ─── PenetrationTester — regression-lock correct behaviours ──────────────────

describe('PenetrationTester — core methods', () => {
  let pt;
  beforeEach(() => { pt = new PenetrationTester(); });

  test('testXSS result has correct shape', () => {
    const r = pt.testXSS('input={{payload}}');
    expect(typeof r.passed).toBe('boolean');
    expect(Array.isArray(r.vulnerabilities)).toBe(true);
    expect(Array.isArray(r.recommendations)).toBe(true);
    expect(typeof r.executionTime).toBe('number');
  });

  test('testSQLInjection parametrize=true: no vulnerabilities', () => {
    const r = pt.testSQLInjection('SELECT * FROM t WHERE id = {{param}}', true);
    expect(r.passed).toBe(true);
  });

  test('testSQLInjection parametrize=false: reports vulnerabilities', () => {
    const r = pt.testSQLInjection('SELECT * FROM t WHERE id = {{param}}', false);
    expect(r.passed).toBe(false);
    expect(r.vulnerabilities.length).toBeGreaterThan(0);
  });

  test('testSQLInjection callback returning placeholder: no vulnerabilities', () => {
    const r = pt.testSQLInjection(() => '$1');
    expect(r.passed).toBe(true);
  });

  test('testSQLInjection callback echoing payload: reports vulnerabilities', () => {
    const r = pt.testSQLInjection(p => `SELECT * FROM t WHERE id = '${p}'`);
    expect(r.passed).toBe(false);
    expect(r.vulnerabilities.length).toBeGreaterThan(0);
  });

  test('testPathTraversal validate=true: no vulnerabilities', () => {
    const r = pt.testPathTraversal('serve/{{path}}', true);
    expect(r.passed).toBe(true);
  });

  test('testPathTraversal callback echoing payload: reports vulnerabilities', () => {
    const r = pt.testPathTraversal(p => p);
    expect(r.passed).toBe(false);
    expect(r.vulnerabilities.length).toBeGreaterThan(0);
  });

  test('testCommandInjection validate=true: no vulnerabilities', () => {
    const r = pt.testCommandInjection('grep {{arg}} /var/log/app.log', true);
    expect(r.passed).toBe(true);
  });

  test('testCommandInjection callback echoing payload: reports vulnerabilities', () => {
    const r = pt.testCommandInjection(p => `run ${p}`);
    expect(r.passed).toBe(false);
    expect(r.vulnerabilities.length).toBeGreaterThan(0);
  });

  test('runPenetrationTest with inputEndpoint returns >= 2 results', () => {
    const results = pt.runPenetrationTest({ inputEndpoint: 'test={{payload}}' });
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  test('runPenetrationTest with no endpoints returns empty array', () => {
    expect(pt.runPenetrationTest({})).toHaveLength(0);
  });
});

// ─── SecurityRegressionTester — regression-lock correct behaviours ────────────

describe('SecurityRegressionTester — all built-in tests pass', () => {
  let srt;
  beforeEach(() => { srt = new SecurityRegressionTester(); });

  test('module-id-validation test passes', () => {
    const results = srt.runAllTests();
    expect(results[0].passed).toBe(true);
  });

  test('file-path-security test passes', () => {
    const results = srt.runAllTests();
    expect(results[1].passed).toBe(true);
  });

  test('json-injection-security test passes', () => {
    const results = srt.runAllTests();
    expect(results[2].passed).toBe(true);
  });

  test('runTestsByCategory returns results for known category', () => {
    const results = srt.runTestsByCategory('input_validation');
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  test('runTestsByCategory returns empty array for unknown category', () => {
    expect(srt.runTestsByCategory('does_not_exist')).toHaveLength(0);
  });

  test('generateReport returns string with Summary section', () => {
    const report = srt.generateReport(srt.runAllTests());
    expect(typeof report).toBe('string');
    expect(report).toContain('Summary');
  });
});

// ─── Convenience functions ────────────────────────────────────────────────────

describe('runFullSecurityTest and generateSecurityTestReport', () => {
  test('runFullSecurityTest returns non-empty array', () => {
    const results = runFullSecurityTest();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  test('generateSecurityTestReport returns non-empty string', () => {
    const report = generateSecurityTestReport();
    expect(typeof report).toBe('string');
    expect(report.length).toBeGreaterThan(0);
  });
});
