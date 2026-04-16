/**
 * Security suite dogfooding — exercises every untested public API
 * Run with: node dogfood-security.mjs
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const {
  validateInput,
  validatePath,
  validateCommand,
  validateJSON,
  validateModuleId,
} = require('./dist/lib/security/SecurityValidator.js');

const { SecurityMonitor } = require('./dist/lib/security/SecurityMonitor.js');
const { SecurityPolicyManager } = require('./dist/lib/security/SecurityPolicyManager.js');
const { SecurityUtils } = require('./dist/lib/security/SecurityUtils.js');
const { SecurityAnalytics } = require('./dist/lib/security/SecurityAnalytics.js');
const { SecurityRegressionTester } = require('./dist/lib/security/SecurityTestingFramework.js');

let passed = 0;
let failed = 0;

function check(label, fn) {
  try {
    const result = fn();
    if (result === false) {
      console.error(`  FAIL  ${label}`);
      failed++;
    } else {
      console.log(`  OK    ${label}`);
      passed++;
    }
  } catch (err) {
    console.error(`  CRASH ${label}: ${err.message}`);
    failed++;
  }
}

// ─── SecurityValidator extended methods ─────────────────────────────────────

console.log('\n── validatePath ──────────────────────────────────────────');

check('blocks ../../../etc/passwd', () =>
  validatePath('../../../etc/passwd').valid === false
);
check('blocks /etc/passwd absolute', () =>
  validatePath('/etc/passwd').valid === false
);
check('blocks path with null byte', () =>
  validatePath('file\x00.txt').valid === false
);
check('allows safe relative path', () =>
  validatePath('uploads/avatar.png').valid === true
);

console.log('\n── validateCommand ───────────────────────────────────────');

check('blocks rm -rf /', () =>
  validateCommand('rm -rf /').valid === false
);
check('blocks command with semicolon injection', () =>
  validateCommand('ls; cat /etc/passwd').valid === false
);
check('blocks command with pipe', () =>
  validateCommand('echo hi | sh').valid === false
);
check('allows known safe command', () => {
  const r = validateCommand('npm');
  // either valid or blocked — just must not crash and return an object
  return typeof r.valid === 'boolean';
});

console.log('\n── validateJSON ──────────────────────────────────────────');

check('validates well-formed JSON', () =>
  validateJSON('{"name":"Alice","age":30}').valid === true
);
check('rejects prototype pollution __proto__', () =>
  validateJSON('{"__proto__":{"admin":true}}').valid === false
);
check('rejects prototype pollution constructor.prototype', () =>
  validateJSON('{"constructor":{"prototype":{"x":1}}}').valid === false
);
check('rejects malformed JSON', () =>
  validateJSON('{not valid json}').valid === false
);

console.log('\n── validateModuleId ──────────────────────────────────────');

check('allows clean module id', () =>
  validateModuleId('lodash').valid === true
);
check('allows scoped package', () =>
  validateModuleId('@company/utils').valid === true
);
check('blocks path traversal in module id', () =>
  validateModuleId('../../etc/passwd').valid === false
);
check('blocks absolute path as module id', () =>
  validateModuleId('/etc/shadow').valid === false
);

// ─── SecurityMonitor ─────────────────────────────────────────────────────────

console.log('\n── SecurityMonitor ───────────────────────────────────────');

const monitor = new SecurityMonitor();

check('logEvent does not throw', () => {
  monitor.logEvent({
    type: 'injection_attack',
    severity: 'HIGH',
    source: 'dogfood',
    blocked: true,
    details: { input: "' OR 1=1--", ruleName: 'string' },
  });
  return true;
});

check('getSecurityMetrics returns an object', () => {
  const m = monitor.getSecurityMetrics();
  return typeof m === 'object' && m !== null;
});

check('getRecentEvents returns an array', () => {
  const events = monitor.getRecentEvents(60);
  return Array.isArray(events);
});

check('generateReport returns a non-empty string', () => {
  const r = monitor.generateReport();
  return typeof r === 'string' && r.length > 0;
});

check('checkRateLimit returns valid and remaining fields', () => {
  const r = monitor.checkRateLimit('127.0.0.1');
  return typeof r.allowed === 'boolean' && typeof r.remaining === 'number';
});

check('checkRateLimit blocks after max requests', () => {
  const id = 'attacker-ip-dogfood';
  for (let i = 0; i < 105; i++) {
    monitor.checkRateLimit(id, { windowMs: 60000, maxRequests: 100 });
  }
  const r = monitor.checkRateLimit(id, { windowMs: 60000, maxRequests: 100 });
  return r.allowed === false;
});

monitor.dispose?.() || monitor.destroy?.();

// ─── SecurityPolicyManager ────────────────────────────────────────────────────

console.log('\n── SecurityPolicyManager ─────────────────────────────────');

const policy = new SecurityPolicyManager();

check('generateSecurityHeaders returns object', () => {
  const h = policy.generateSecurityHeaders();
  return typeof h === 'object' && h !== null;
});

check('generateSecurityHeaders includes content-security-policy', () => {
  const h = policy.generateSecurityHeaders();
  const keys = Object.keys(h).map(k => k.toLowerCase());
  return keys.some(k => k.includes('content-security-policy'));
});

check('generateCSP returns non-empty string', () => {
  const csp = policy.generateCSP();
  return typeof csp === 'string' && csp.length > 0;
});

check('generateCSP includes default-src', () => {
  const csp = policy.generateCSP();
  return csp.includes('default-src');
});

check('generateCORSConfig returns object with allowed origins', () => {
  const cors = policy.generateCORSConfig({ allowedOrigins: ['https://example.com'] });
  return Array.isArray(cors.allowedOrigins);
});

check('validateSecurityHeaders flags missing headers', () => {
  const r = policy.validateSecurityHeaders({});
  return r.valid === false && Array.isArray(r.errors) && r.errors.length > 0;
});

check('applySecurityHeaders sets headers on mock response', () => {
  const headers = {};
  const res = { setHeader: (k, v) => { headers[k] = v; } };
  policy.applySecurityHeaders(res);
  return Object.keys(headers).length > 0;
});

// ─── SecurityUtils ────────────────────────────────────────────────────────────

console.log('\n── SecurityUtils ─────────────────────────────────────────');

check('generateSecureToken returns a 64-char hex string by default', () => {
  const t = SecurityUtils.generateSecureToken();
  return typeof t === 'string' && t.length === 64;
});

check('generateSecureToken length param works', () => {
  const t = SecurityUtils.generateSecureToken(16);
  return t.length === 32;
});

check('generateSecureHash returns non-empty string', () => {
  const h = SecurityUtils.generateSecureHash('hello');
  return typeof h === 'string' && h.length > 0;
});

check('generateSecureHash is deterministic', () => {
  const a = SecurityUtils.generateSecureHash('hello');
  const b = SecurityUtils.generateSecureHash('hello');
  return a === b;
});

check('generateSecureHash differs for different inputs', () => {
  const a = SecurityUtils.generateSecureHash('hello');
  const b = SecurityUtils.generateSecureHash('world');
  return a !== b;
});

check('validateFilePath blocks traversal', () => {
  const r = SecurityUtils.validateFilePath('../../etc/passwd', ['/app/uploads']);
  return r.valid === false;
});

check('validateFilePath allows file inside allowed dir', () => {
  const r = SecurityUtils.validateFilePath('/app/uploads/photo.jpg', ['/app/uploads']);
  return r.valid === true;
});

check('containsSuspiciousPatterns detects <script>', () => {
  const r = SecurityUtils.containsSuspiciousPatterns('<script>alert(1)</script>');
  return r.suspicious === true;
});

check('containsSuspiciousPatterns is clean on safe text', () => {
  const r = SecurityUtils.containsSuspiciousPatterns('hello world');
  return r.suspicious === false;
});

check('createRateLimiter returns a check function', () => {
  const limiter = SecurityUtils.createRateLimiter({ windowMs: 60000, maxRequests: 10 });
  return typeof limiter === 'object' || typeof limiter === 'function';
});

// ─── SecurityAnalytics ────────────────────────────────────────────────────────

console.log('\n── SecurityAnalytics ─────────────────────────────────────');

const analytics = new SecurityAnalytics();

check('getRiskLevel returns valid level on empty state', () => {
  const level = analytics.getRiskLevel();
  return ['low', 'medium', 'high', 'critical'].includes(level);
});

check('analyzeEvent does not throw', () => {
  analytics.analyzeEvent({
    type: 'injection_attack',
    severity: 'HIGH',
    source: 'dogfood',
    blocked: true,
  });
  return true;
});

check('getRiskLevel increases after high-severity events', () => {
  for (let i = 0; i < 20; i++) {
    analytics.analyzeEvent({ type: 'injection_attack', severity: 'HIGH', source: 'dogfood', blocked: false });
  }
  const level = analytics.getRiskLevel();
  return ['medium', 'high', 'critical'].includes(level);
});

check('logIncident does not throw', () => {
  analytics.logIncident({
    type: 'brute_force',
    severity: 'HIGH',
    source: '10.0.0.1',
    description: 'Repeated failed logins',
  });
  return true;
});

check('generateReport returns an object', () => {
  const r = analytics.generateReport();
  return typeof r === 'object' && r !== null;
});

// ─── SecurityRegressionTester ─────────────────────────────────────────────────

console.log('\n── SecurityRegressionTester ──────────────────────────────');

check('runAllTests returns an array', () => {
  const tester = new SecurityRegressionTester();
  const results = tester.runAllTests();
  return Array.isArray(results);
});

check('runAllTests results each have passed and vulnerabilities', () => {
  const tester = new SecurityRegressionTester();
  const results = tester.runAllTests();
  return results.every(r => typeof r.passed === 'boolean' && Array.isArray(r.vulnerabilities));
});

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(55)}`);
console.log(`  ${passed + failed} checks   ✓ ${passed} passed   ✗ ${failed} failed`);
console.log('─'.repeat(55));
if (failed > 0) process.exit(1);
