/**
 * Round 5 Dogfood — SecurityTestingFramework + SecurityAnalytics
 *
 * Run: node dogfood-testing-analytics.mjs
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const {
  PenetrationTester,
  SecurityRegressionTester,
  runFullSecurityTest,
  generateSecurityTestReport,
} = require('./dist/lib/security/SecurityTestingFramework.js');

const {
  SecurityAnalytics,
} = require('./dist/lib/security/SecurityAnalytics.js');

// ─── Harness ──────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

async function check(label, fn) {
  try {
    const result = await fn();
    if (result === true) {
      console.log(`  OK    ${label}`);
      passed++;
    } else {
      console.log(`  FAIL  ${label} — ${result}`);
      failed++;
    }
  } catch (e) {
    console.log(`  CRASH ${label} — ${e.message}`);
    failed++;
  }
}

// ─── PenetrationTester ────────────────────────────────────────────────────────

console.log('\n── PenetrationTester ────────────────────────────────────────────');

await check('testXSS with string template returns SecurityTestResult shape', () => {
  const pt = new PenetrationTester();
  const r = pt.testXSS('input={{payload}}');
  return typeof r.passed === 'boolean' && Array.isArray(r.vulnerabilities)
    ? true : `shape=${JSON.stringify(Object.keys(r))}`;
});

await check('testXSS string-template mode with sanitizer: no raw script tags pass', () => {
  const pt = new PenetrationTester();
  const r = pt.testXSS('input={{payload}}', true);
  return r.passed === true ? true : `vulns=${JSON.stringify(r.vulnerabilities)}`;
});

await check('testXSS callback mode with sanitizing callback: passes', () => {
  const pt = new PenetrationTester();
  const r = pt.testXSS(p => p.replace(/<[^>]+>/g, '').replace(/javascript:/gi, '').replace(/onerror=/gi, ''));
  return r.passed === true ? true : `vulns=${JSON.stringify(r.vulnerabilities)}`;
});

await check('testXSS callback mode with identity callback: reports vulnerabilities', () => {
  const pt = new PenetrationTester();
  const r = pt.testXSS(p => p); // no sanitization → payloads pass through raw
  return r.passed === false && r.vulnerabilities.length > 0
    ? true : `passed=${r.passed} vulns=${r.vulnerabilities.length}`;
});

await check('testXSS result has executionTime number', () => {
  const pt = new PenetrationTester();
  const r = pt.testXSS(p => p.replace(/<[^>]+>/g, ''));
  return typeof r.executionTime === 'number' ? true : `type=${typeof r.executionTime}`;
});

await check('testSQLInjection parametrize=true: no vulnerabilities', () => {
  const pt = new PenetrationTester();
  const r = pt.testSQLInjection('SELECT * FROM t WHERE id = {{param}}', true);
  return r.passed === true ? true : `vulns=${JSON.stringify(r.vulnerabilities)}`;
});

await check('testSQLInjection parametrize=false: detects SQL keywords', () => {
  const pt = new PenetrationTester();
  const r = pt.testSQLInjection('SELECT * FROM t WHERE id = {{param}}', false);
  return r.passed === false && r.vulnerabilities.length > 0
    ? true : `passed=${r.passed} vulns=${r.vulnerabilities.length}`;
});

await check('testSQLInjection callback mode clean handler: no vulnerabilities', () => {
  const pt = new PenetrationTester();
  // In callback mode the check scans the RETURNED STRING for SQL keywords.
  // A correct handler returns only the sanitized parameter placeholder — no SQL keywords.
  const r = pt.testSQLInjection(() => '$1');
  return r.passed === true ? true : `vulns=${JSON.stringify(r.vulnerabilities)}`;
});

await check('testSQLInjection callback mode echo handler: reports vulnerabilities', () => {
  const pt = new PenetrationTester();
  const r = pt.testSQLInjection(p => `SELECT * FROM t WHERE id = '${p}'`);
  return r.passed === false && r.vulnerabilities.length > 0
    ? true : `passed=${r.passed} vulns=${r.vulnerabilities.length}`;
});

await check('testPathTraversal validate=true: no vulnerabilities for built-in validator', () => {
  const pt = new PenetrationTester();
  const r = pt.testPathTraversal('serve/{{path}}', true);
  return r.passed === true ? true : `vulns=${JSON.stringify(r.vulnerabilities)}`;
});

await check('testPathTraversal callback mode clean handler: no vulnerabilities', () => {
  const pt = new PenetrationTester();
  // Robust clean handler: strip ALL ".." occurrences (including "....") so that
  // evasion variants like "....//....//etc//passwd" are also neutralised.
  const r = pt.testPathTraversal(p => p.replace(/\.\./g, ''));
  return r.passed === true ? true : `vulns=${JSON.stringify(r.vulnerabilities)}`;
});

await check('testPathTraversal callback mode echo handler: reports vulnerabilities', () => {
  const pt = new PenetrationTester();
  const r = pt.testPathTraversal(p => p); // raw payload echoed
  return r.passed === false && r.vulnerabilities.length > 0
    ? true : `passed=${r.passed} vulns=${r.vulnerabilities.length}`;
});

await check('testCommandInjection validate=true: no vulnerabilities', () => {
  const pt = new PenetrationTester();
  const r = pt.testCommandInjection('grep {{arg}} /var/log/app.log', true);
  return r.passed === true ? true : `vulns=${JSON.stringify(r.vulnerabilities)}`;
});

await check('testCommandInjection callback mode clean handler: no vulnerabilities', () => {
  const pt = new PenetrationTester();
  // Clean handler: reject anything with shell metacharacters
  const r = pt.testCommandInjection(p => /[;&|`$(){}\[\]]/.test(p) ? '' : p);
  return r.passed === true ? true : `vulns=${JSON.stringify(r.vulnerabilities)}`;
});

await check('testCommandInjection callback mode echo handler: reports vulnerabilities', () => {
  const pt = new PenetrationTester();
  const r = pt.testCommandInjection(p => `run ${p}`); // unsanitized
  return r.passed === false && r.vulnerabilities.length > 0
    ? true : `passed=${r.passed} vulns=${r.vulnerabilities.length}`;
});

await check('runPenetrationTest with inputEndpoint returns array of results', () => {
  const pt = new PenetrationTester();
  const results = pt.runPenetrationTest({ inputEndpoint: 'test={{payload}}' });
  return Array.isArray(results) && results.length >= 2
    ? true : `length=${results.length}`;
});

await check('runPenetrationTest with no endpoints returns empty array', () => {
  const pt = new PenetrationTester();
  const results = pt.runPenetrationTest({});
  return Array.isArray(results) && results.length === 0
    ? true : `length=${results.length}`;
});

// ─── SecurityRegressionTester ─────────────────────────────────────────────────

console.log('\n── SecurityRegressionTester ─────────────────────────────────────');

await check('runAllTests returns array of results', () => {
  const srt = new SecurityRegressionTester();
  const results = srt.runAllTests();
  return Array.isArray(results) && results.length > 0
    ? true : `length=${results.length}`;
});

await check('runAllTests: module-id-validation test passes', () => {
  const srt = new SecurityRegressionTester();
  const results = srt.runAllTests();
  const r = results[0];
  return r.passed === true ? true : `vulns=${JSON.stringify(r.vulnerabilities)}`;
});

await check('runAllTests: file-path-security test passes', () => {
  const srt = new SecurityRegressionTester();
  const results = srt.runAllTests();
  const r = results[1];
  return r.passed === true ? true : `vulns=${JSON.stringify(r.vulnerabilities)}`;
});

await check('runAllTests: json-injection-security test passes', () => {
  const srt = new SecurityRegressionTester();
  const results = srt.runAllTests();
  const r = results[2];
  return r.passed === true ? true : `vulns=${JSON.stringify(r.vulnerabilities)}`;
});

await check('runAllTests: security-headers-check passes', () => {
  const srt = new SecurityRegressionTester();
  const results = srt.runAllTests();
  const r = results[3];
  return r.passed === true ? true : `vulns=${JSON.stringify(r.vulnerabilities)}`;
});

await check('runAllTests: rate-limiting-test passes (checks rate limit works correctly)', () => {
  const srt = new SecurityRegressionTester();
  const results = srt.runAllTests();
  const r = results[4];
  return r.passed === true ? true : `vulns=${JSON.stringify(r.vulnerabilities)}`;
});

await check('runTestsByCategory("input_validation") returns only input_validation tests', () => {
  const srt = new SecurityRegressionTester();
  const results = srt.runTestsByCategory('input_validation');
  return Array.isArray(results) && results.length >= 1
    ? true : `length=${results.length}`;
});

await check('runTestsByCategory with unknown category returns empty array', () => {
  const srt = new SecurityRegressionTester();
  const results = srt.runTestsByCategory('does_not_exist');
  return Array.isArray(results) && results.length === 0
    ? true : `length=${results.length}`;
});

await check('generateReport returns string containing Summary', () => {
  const srt = new SecurityRegressionTester();
  const results = srt.runAllTests();
  const report = srt.generateReport(results);
  return typeof report === 'string' && report.includes('Summary')
    ? true : `report=${report.slice(0, 100)}`;
});

await check('runFullSecurityTest convenience function returns array', () => {
  const results = runFullSecurityTest();
  return Array.isArray(results) && results.length > 0
    ? true : `length=${results.length}`;
});

await check('generateSecurityTestReport convenience function returns string', () => {
  const report = generateSecurityTestReport();
  return typeof report === 'string' && report.length > 0
    ? true : `type=${typeof report}`;
});

// ─── SecurityAnalytics ────────────────────────────────────────────────────────

console.log('\n── SecurityAnalytics ────────────────────────────────────────────');

await check('analyzeEvent increments totalRequests', () => {
  const sa = new SecurityAnalytics();
  sa.analyzeEvent({ type: 'injection_attack', severity: 'high', blocked: false });
  const s = sa.getAnalyticsSummary();
  sa.destroy();
  return s.totalRequests === 1 ? true : `totalRequests=${s.totalRequests}`;
});

await check('analyzeEvent increments blockedRequests for blocked events', () => {
  const sa = new SecurityAnalytics();
  sa.analyzeEvent({ type: 'injection_attack', severity: 'high', blocked: true });
  sa.analyzeEvent({ type: 'xss_attempt', severity: 'medium', blocked: false });
  const s = sa.getAnalyticsSummary();
  sa.destroy();
  return s.blockedRequests === 1 ? true : `blockedRequests=${s.blockedRequests}`;
});

await check('analyzeEvent accumulates threatScore by severity', () => {
  const sa = new SecurityAnalytics();
  sa.analyzeEvent({ type: 'x', severity: 'high', blocked: false });    // +7
  sa.analyzeEvent({ type: 'x', severity: 'critical', blocked: false }); // +15
  sa.analyzeEvent({ type: 'x', severity: 'low', blocked: false });      // +1
  sa.analyzeEvent({ type: 'x', severity: 'medium', blocked: false });   // +3
  const s = sa.getAnalyticsSummary();
  sa.destroy();
  return s.threatScore === 26 ? true : `threatScore=${s.threatScore} (expected 26)`;
});

await check('getRiskLevel returns low initially', () => {
  const sa = new SecurityAnalytics();
  const level = sa.getRiskLevel();
  sa.destroy();
  return level === 'low' ? true : `level=${level}`;
});

await check('getRiskLevel escalates to medium when blocked rate > 10%', () => {
  const sa = new SecurityAnalytics();
  // 2 blocked out of 3 total → 66% blocked rate → medium
  sa.analyzeEvent({ type: 'x', severity: 'low', blocked: true });
  sa.analyzeEvent({ type: 'x', severity: 'low', blocked: true });
  sa.analyzeEvent({ type: 'x', severity: 'low', blocked: false });
  const level = sa.getRiskLevel();
  sa.destroy();
  return level === 'medium' || level === 'high'
    ? true : `level=${level}`;
});

await check('getRiskLevel escalates to high when threatScore > 50', () => {
  const sa = new SecurityAnalytics();
  // 4 critical events = 60 threat score → high
  for (let i = 0; i < 4; i++) {
    sa.analyzeEvent({ type: 'x', severity: 'critical', blocked: false });
  }
  const level = sa.getRiskLevel();
  sa.destroy();
  return level === 'high' ? true : `level=${level} (expected high)`;
});

await check('getAnalyticsSummary includes blockedRate', () => {
  const sa = new SecurityAnalytics();
  sa.analyzeEvent({ type: 'x', severity: 'low', blocked: true });
  sa.analyzeEvent({ type: 'x', severity: 'low', blocked: false });
  const s = sa.getAnalyticsSummary();
  sa.destroy();
  return typeof s.blockedRate === 'number' && s.blockedRate === 0.5
    ? true : `blockedRate=${s.blockedRate}`;
});

await check('generateReport returns object with riskAssessment and analytics', () => {
  const sa = new SecurityAnalytics();
  sa.analyzeEvent({ type: 'x', severity: 'medium', blocked: true });
  const r = sa.generateReport();
  sa.destroy();
  return r && r.riskAssessment && typeof r.analytics === 'object'
    ? true : `report=${JSON.stringify(Object.keys(r || {}))}`;
});

await check('logIncident does not throw', () => {
  const sa = new SecurityAnalytics();
  let threw = false;
  try {
    sa.logIncident({
      type: 'injection_attack',
      severity: 'high',
      source: 'test',
      details: { input: 'bad' },
      blocked: true,
      remediation: 'block'
    });
  } catch { threw = true; }
  sa.destroy();
  return !threw ? true : 'threw exception';
});

await check('destroy/cleanup does not throw when called twice', () => {
  const sa = new SecurityAnalytics();
  let threw = false;
  try {
    sa.destroy();
    sa.cleanup(); // already cleaned up
  } catch { threw = true; }
  return !threw ? true : 'threw exception';
});

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${passed + failed} checks   ✓ ${passed} passed   ✗ ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
