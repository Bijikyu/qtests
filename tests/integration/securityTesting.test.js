/**
 * SecurityTestingFramework / SecurityAnalytics Regression Tests — Round 5
 *
 * Bugs found by dogfooding:
 *
 * 1. SecurityValidator.sanitize() — javascript: URI not stripped by removeScriptTags
 *    testXSS() in string-template mode claimed payloads were sanitized but
 *    `javascript:alert("xss")` passed through unchanged, causing the built-in
 *    XSS check to correctly flag it as a vulnerability. Fix: strip javascript:
 *    and vbscript: URI schemes when removeScriptTags is set.
 *
 * 2. SecurityRegressionTester rate-limit test — wrong options for assertion calls
 *    The setup call used { windowMs: 100, maxRequests: 2 } but the assertion calls
 *    used no options → defaults → maxRequests: 100 → result3 was never blocked.
 *    Fix: use consistent { windowMs: 60000, maxRequests: 3 } on all calls.
 *
 * 3. SecurityRegressionTester rate-limit test — shared global state between runs
 *    The static identifier 'test-rate-limit' accumulated counts on the global
 *    securityMonitor across multiple runAllTests() invocations. Fix: use a
 *    per-invocation unique identifier (Date.now() suffix).
 *
 * 4. JoiSecurityValidator jsonContent schema — NoSQL injection operators not detected
 *    {"$where":"..."}, {"$gt":""}, etc. passed validateJSON() unchallenged.
 *    Fix: added recursive operator scan for MongoDB $ operators before returning.
 */

const {
  PenetrationTester,
  SecurityRegressionTester,
  runFullSecurityTest,
  generateSecurityTestReport,
} = require('../../dist/lib/security/SecurityTestingFramework.js');

const {
  SecurityAnalytics,
} = require('../../dist/lib/security/SecurityAnalytics.js');

const {
  JoiSecurityValidator,
} = require('../../dist/lib/security/JoiSecurityValidator.js');

// ─── Fix 1: sanitize() strips javascript: URIs ───────────────────────────────

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

// ─── Fix 2 & 3: rate-limit test uses correct options and unique identifier ────

describe('Fix — SecurityRegressionTester rate-limit test works on repeated calls', () => {
  test('runAllTests() rate-limiting-test passes on first call', () => {
    const srt = new SecurityRegressionTester();
    const results = srt.runAllTests();
    const rl = results[4]; // rate-limiting-test is index 4
    expect(rl.passed).toBe(true);
    expect(rl.vulnerabilities).toHaveLength(0);
  });

  test('runAllTests() rate-limiting-test passes on second consecutive call', () => {
    const srt = new SecurityRegressionTester();
    srt.runAllTests(); // first call — burns through one identifier
    const results = srt.runAllTests(); // second call — must use a fresh identifier
    const rl = results[4];
    expect(rl.passed).toBe(true);
    expect(rl.vulnerabilities).toHaveLength(0);
  });

  test('runAllTests() rate-limiting-test passes on third consecutive call', () => {
    const srt = new SecurityRegressionTester();
    srt.runAllTests();
    srt.runAllTests();
    const results = srt.runAllTests();
    const rl = results[4];
    expect(rl.passed).toBe(true);
    expect(rl.vulnerabilities).toHaveLength(0);
  });
});

// ─── Fix 4: jsonContent schema rejects NoSQL injection operators ──────────────

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

  test('security-headers-check passes', () => {
    const results = srt.runAllTests();
    expect(results[3].passed).toBe(true);
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

// ─── SecurityAnalytics ────────────────────────────────────────────────────────

describe('SecurityAnalytics', () => {
  let sa;
  beforeEach(() => { sa = new SecurityAnalytics(); });
  afterEach(() => { sa.destroy(); });

  test('analyzeEvent increments totalRequests', () => {
    sa.analyzeEvent({ type: 'injection_attack', severity: 'high', blocked: false });
    expect(sa.getAnalyticsSummary().totalRequests).toBe(1);
  });

  test('analyzeEvent increments blockedRequests only for blocked events', () => {
    sa.analyzeEvent({ type: 'x', severity: 'low', blocked: true });
    sa.analyzeEvent({ type: 'x', severity: 'low', blocked: false });
    const s = sa.getAnalyticsSummary();
    expect(s.blockedRequests).toBe(1);
    expect(s.totalRequests).toBe(2);
  });

  test('analyzeEvent accumulates threatScore correctly (high=7, critical=15, low=1, medium=3)', () => {
    sa.analyzeEvent({ type: 'x', severity: 'high', blocked: false });    // +7
    sa.analyzeEvent({ type: 'x', severity: 'critical', blocked: false }); // +15
    sa.analyzeEvent({ type: 'x', severity: 'low', blocked: false });      // +1
    sa.analyzeEvent({ type: 'x', severity: 'medium', blocked: false });   // +3
    expect(sa.getAnalyticsSummary().threatScore).toBe(26);
  });

  test('getRiskLevel starts at low', () => {
    expect(sa.getRiskLevel()).toBe('low');
  });

  test('getRiskLevel escalates to at least medium when blocked rate > 10%', () => {
    sa.analyzeEvent({ type: 'x', severity: 'low', blocked: true });
    sa.analyzeEvent({ type: 'x', severity: 'low', blocked: true });
    sa.analyzeEvent({ type: 'x', severity: 'low', blocked: false });
    expect(['medium', 'high', 'critical']).toContain(sa.getRiskLevel());
  });

  test('getRiskLevel escalates to high when threatScore > 50', () => {
    for (let i = 0; i < 4; i++) {
      sa.analyzeEvent({ type: 'x', severity: 'critical', blocked: false }); // 4×15=60
    }
    expect(sa.getRiskLevel()).toBe('high');
  });

  test('getAnalyticsSummary includes blockedRate', () => {
    sa.analyzeEvent({ type: 'x', severity: 'low', blocked: true });
    sa.analyzeEvent({ type: 'x', severity: 'low', blocked: false });
    expect(sa.getAnalyticsSummary().blockedRate).toBe(0.5);
  });

  test('generateReport returns object with riskAssessment', () => {
    sa.analyzeEvent({ type: 'x', severity: 'medium', blocked: true });
    const r = sa.generateReport();
    expect(r).toHaveProperty('riskAssessment');
    expect(r).toHaveProperty('analytics');
  });

  test('logIncident does not throw', () => {
    expect(() => sa.logIncident({
      type: 'injection_attack', severity: 'high', source: 'test',
      details: { input: 'bad' }, blocked: true, remediation: 'block'
    })).not.toThrow();
  });
});
