/**
 * Round 4 Dogfood — SecurityMonitor, SecurityPolicyManager, SecurityUtils
 *
 * Run: node dogfood-utils.mjs
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const {
  SecurityMonitor,
  SecuritySeverity,
  SecurityEventType,
  validateSecurityHeaders: monitorValidateHeaders,
} = require('./dist/lib/security/SecurityMonitor.js');

const {
  SecurityPolicyManager,
  securityPolicyManager,
  getSecurityHeaders,
  getCSP,
  getCORSConfig,
} = require('./dist/lib/security/SecurityPolicyManager.js');

const {
  SecurityUtils,
  validateFilePath,
  validateJSON,
  containsSuspiciousPatterns,
  createRateLimiter,
  validateApiKey,
  generateSecureToken,
  generateSecureHash,
  createSecureHeaders,
  getSecureEnvVar,
} = require('./dist/lib/security/SecurityUtils.js');

// ─── Test harness ────────────────────────────────────────────────────────────

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

// ─── SecurityMonitor ─────────────────────────────────────────────────────────

console.log('\n── SecurityMonitor ──────────────────────────────────────────────');

await check('logEvent stores event with id and timestamp', () => {
  const m = new SecurityMonitor();
  m.logEvent({
    type: SecurityEventType.INJECTION_ATTACK,
    severity: SecuritySeverity.HIGH,
    source: 'test',
    details: { input: 'bad' },
    blocked: true,
    remediation: 'block',
  });
  const events = m.getEventsByType(SecurityEventType.INJECTION_ATTACK);
  m.destroy();
  return events.length === 1 && !!events[0].id && !!events[0].timestamp
    ? true : `got ${JSON.stringify(events[0])}`;
});

await check('checkRateLimit allows requests under limit', () => {
  const m = new SecurityMonitor();
  const r = m.checkRateLimit('rl-allow', { maxRequests: 10, windowMs: 60000 });
  m.destroy();
  return r.allowed === true ? true : `allowed=${r.allowed}`;
});

await check('checkRateLimit returns correct remaining count', () => {
  const m = new SecurityMonitor();
  m.checkRateLimit('rl-remain', { maxRequests: 5, windowMs: 60000 });
  m.checkRateLimit('rl-remain', { maxRequests: 5, windowMs: 60000 });
  const r = m.checkRateLimit('rl-remain', { maxRequests: 5, windowMs: 60000 });
  m.destroy();
  // 3 requests used, remaining should be 2
  return r.remaining === 2 ? true : `remaining=${r.remaining} (expected 2)`;
});

await check('checkRateLimit blocks after limit exceeded', () => {
  const m = new SecurityMonitor();
  for (let i = 0; i < 5; i++) m.checkRateLimit('rl-block', { maxRequests: 3, windowMs: 60000 });
  const r = m.checkRateLimit('rl-block', { maxRequests: 3, windowMs: 60000 });
  m.destroy();
  return r.allowed === false ? true : `allowed=${r.allowed}`;
});

await check('checkRateLimit blocked result has retryAfter', () => {
  const m = new SecurityMonitor();
  for (let i = 0; i < 5; i++) m.checkRateLimit('rl-retry', { maxRequests: 2, windowMs: 60000 });
  const r = m.checkRateLimit('rl-retry', { maxRequests: 2, windowMs: 60000 });
  m.destroy();
  return typeof r.retryAfter === 'number' && r.retryAfter > 0
    ? true : `retryAfter=${r.retryAfter}`;
});

await check('checkRateLimit on destroyed monitor returns not-allowed', () => {
  const m = new SecurityMonitor();
  m.destroy();
  const r = m.checkRateLimit('rl-dead', { maxRequests: 10, windowMs: 60000 });
  return r.allowed === false ? true : `allowed=${r.allowed}`;
});

await check('getEventsBySeverity returns events by severity', () => {
  const m = new SecurityMonitor();
  m.logEvent({ type: SecurityEventType.XSS_ATTEMPT, severity: SecuritySeverity.CRITICAL,
    source: 'test', details: {}, blocked: true, remediation: '' });
  const evts = m.getEventsBySeverity(SecuritySeverity.CRITICAL);
  m.destroy();
  return evts.length >= 1 ? true : `length=${evts.length}`;
});

await check('getMetrics counts blocked events correctly', () => {
  const m = new SecurityMonitor();
  m.logEvent({ type: SecurityEventType.INJECTION_ATTACK, severity: SecuritySeverity.HIGH,
    source: 'test', details: {}, blocked: true, remediation: '' });
  m.logEvent({ type: SecurityEventType.XSS_ATTEMPT, severity: SecuritySeverity.LOW,
    source: 'test', details: {}, blocked: false, remediation: '' });
  const metrics = m.getMetrics();
  m.destroy();
  return metrics.blockedEvents === 1 && metrics.totalEvents === 2
    ? true : `blocked=${metrics.blockedEvents} total=${metrics.totalEvents}`;
});

await check('getRecentEvents returns events logged within the window', () => {
  const m = new SecurityMonitor();
  m.logEvent({ type: SecurityEventType.INJECTION_ATTACK, severity: SecuritySeverity.HIGH,
    source: 'test', details: {}, blocked: true, remediation: '' });
  const evts = m.getRecentEvents(5); // last 5 minutes
  m.destroy();
  return evts.length >= 1 ? true : `length=${evts.length}`;
});

await check('clearOldEvents removes old events (cutoff 0h = all events)', () => {
  const m = new SecurityMonitor();
  m.logEvent({ type: SecurityEventType.INJECTION_ATTACK, severity: SecuritySeverity.HIGH,
    source: 'test', details: {}, blocked: true, remediation: '' });
  // cutoff = 0 hours → cutoff time is now → all events are "old"
  m.clearOldEvents(0);
  const metrics = m.getMetrics();
  m.destroy();
  return metrics.totalEvents === 0 ? true : `totalEvents=${metrics.totalEvents} (expected 0)`;
});

await check('generateReport returns a non-empty string containing Summary', () => {
  const m = new SecurityMonitor();
  m.logEvent({ type: SecurityEventType.INJECTION_ATTACK, severity: SecuritySeverity.HIGH,
    source: 'test', details: { input: 'x' }, blocked: true, remediation: '' });
  const report = m.generateReport();
  m.destroy();
  return typeof report === 'string' && report.includes('Summary') ? true : `report=${report.slice(0, 100)}`;
});

// validateSecurityHeaders (module-level in SecurityMonitor.ts) — has NODE_ENV gate
await check('module-level validateSecurityHeaders: CSP without default-src is flagged', () => {
  const result = monitorValidateHeaders({ 'Content-Security-Policy': 'script-src self' });
  // Should flag missing default-src
  return result.errors.some(e => e.includes('default-src'))
    ? true : `errors=${JSON.stringify(result.errors)}`;
});

await check('module-level validateSecurityHeaders: valid CSP passes', () => {
  const result = monitorValidateHeaders({ 'Content-Security-Policy': "default-src 'self'" });
  return result.valid === true ? true : `errors=${JSON.stringify(result.errors)}`;
});

await check('module-level validateSecurityHeaders: invalid HSTS is flagged', () => {
  const result = monitorValidateHeaders({ 'Strict-Transport-Security': 'include-all' });
  return result.errors.some(e => e.includes('max-age'))
    ? true : `errors=${JSON.stringify(result.errors)}`;
});

// ─── SecurityPolicyManager ───────────────────────────────────────────────────

console.log('\n── SecurityPolicyManager ────────────────────────────────────────');

await check('generateSecurityHeaders includes X-Frame-Options', () => {
  const spm = new SecurityPolicyManager();
  const h = spm.generateSecurityHeaders();
  return !!h['X-Frame-Options'] ? true : `got ${JSON.stringify(h)}`;
});

await check('generateSecurityHeaders includes Content-Security-Policy', () => {
  const spm = new SecurityPolicyManager();
  const h = spm.generateSecurityHeaders();
  return !!h['Content-Security-Policy'] ? true : `missing CSP`;
});

await check('generateCSP output contains default-src', () => {
  const spm = new SecurityPolicyManager();
  const csp = spm.generateCSP();
  return csp.includes('default-src') ? true : `CSP=${csp}`;
});

await check('generateCSP with custom config merges correctly', () => {
  const spm = new SecurityPolicyManager();
  const csp = spm.generateCSP({ 'script-src': ["'self'", 'cdn.example.com'] });
  return csp.includes('cdn.example.com') ? true : `CSP=${csp}`;
});

await check('validateSecurityHeaders passes for default-generated headers', () => {
  const spm = new SecurityPolicyManager();
  const h = spm.generateSecurityHeaders();
  const v = spm.validateSecurityHeaders(h);
  return v.valid === true ? true : `errors=${JSON.stringify(v.errors)}`;
});

await check('validateSecurityHeaders fails when X-Frame-Options missing', () => {
  const spm = new SecurityPolicyManager();
  const v = spm.validateSecurityHeaders({ 'X-Content-Type-Options': 'nosniff', 'X-XSS-Protection': '1' });
  return v.errors.some(e => e.includes('X-Frame-Options'))
    ? true : `errors=${JSON.stringify(v.errors)}`;
});

await check('validateCSP passes when default-src is defined', () => {
  const spm = new SecurityPolicyManager();
  const v = spm.validateCSP({ 'default-src': ["'self'"] });
  return v.valid === true ? true : `errors=${JSON.stringify(v.errors)}`;
});

await check('validateCSP fails when no src directives present', () => {
  const spm = new SecurityPolicyManager();
  const v = spm.validateCSP({ 'report-uri': 'https://example.com' });
  return v.valid === false ? true : `unexpected valid`;
});

await check('generateCORSConfig default has no wildcard origin', () => {
  const spm = new SecurityPolicyManager();
  const cors = spm.generateCORSConfig();
  return cors.origin !== '*' && cors.origin !== true ? true : `origin=${cors.origin}`;
});

await check('getExpressSecurityHeaders returns plain string values only', () => {
  const spm = new SecurityPolicyManager();
  const h = spm.getExpressSecurityHeaders();
  const allStrings = Object.values(h).every(v => typeof v === 'string');
  return allStrings ? true : `not all strings`;
});

await check('applyCORSHeaders sets Access-Control-Allow-Origin for boolean true', () => {
  const spm = new SecurityPolicyManager();
  const setHeaders = {};
  const res = { setHeader(k, v) { setHeaders[k] = v; } };
  const req = { headers: { origin: 'https://example.com' } };
  spm.applyCORSHeaders(res, req, { origin: true });
  return setHeaders['Access-Control-Allow-Origin'] === '*'
    ? true : `got ${setHeaders['Access-Control-Allow-Origin']}`;
});

await check('applyCORSHeaders allows specific origin in array', () => {
  const spm = new SecurityPolicyManager();
  const setHeaders = {};
  const res = { setHeader(k, v) { setHeaders[k] = v; } };
  const req = { headers: { origin: 'https://trusted.com' } };
  spm.applyCORSHeaders(res, req, { origin: ['https://trusted.com', 'https://other.com'] });
  return setHeaders['Access-Control-Allow-Origin'] === 'https://trusted.com'
    ? true : `got ${setHeaders['Access-Control-Allow-Origin']}`;
});

await check('applyCORSHeaders does not set ACAO for unlisted origin', () => {
  const spm = new SecurityPolicyManager();
  const setHeaders = {};
  const res = { setHeader(k, v) { setHeaders[k] = v; } };
  const req = { headers: { origin: 'https://evil.com' } };
  spm.applyCORSHeaders(res, req, { origin: ['https://trusted.com'] });
  return !setHeaders['Access-Control-Allow-Origin']
    ? true : `got ${setHeaders['Access-Control-Allow-Origin']}`;
});

// ─── SecurityUtils ───────────────────────────────────────────────────────────

console.log('\n── SecurityUtils ────────────────────────────────────────────────');

await check('generateSecureToken returns hex string of correct length', () => {
  const tok = SecurityUtils.generateSecureToken(16);
  return typeof tok === 'string' && tok.length === 32 ? true : `tok=${tok}`;
});

await check('generateSecureHash returns consistent SHA-256 hex', () => {
  const h1 = SecurityUtils.generateSecureHash('hello');
  const h2 = SecurityUtils.generateSecureHash('hello');
  return h1 === h2 && h1.length === 64 ? true : `h1=${h1}`;
});

await check('validateFilePath rejects path traversal', () => {
  const r = SecurityUtils.validateFilePath('../../../etc/passwd');
  return r.valid === false ? true : `got valid=true`;
});

await check('validateFilePath rejects null bytes', () => {
  const r = SecurityUtils.validateFilePath('file\0.txt');
  return r.valid === false ? true : `got valid=true`;
});

await check('validateFilePath accepts a normal relative path', () => {
  const r = SecurityUtils.validateFilePath('uploads/photo.jpg');
  return r.valid === true ? true : `error=${r.error}`;
});

await check('validateFilePath rejects path outside allowedDirs', () => {
  const r = SecurityUtils.validateFilePath('/tmp/evil.txt', ['/var/www']);
  return r.valid === false ? true : `got valid=true`;
});

await check('validateFilePath accepts path inside allowedDirs', () => {
  const r = SecurityUtils.validateFilePath('/var/www/index.html', ['/var/www']);
  return r.valid === true ? true : `error=${r.error}`;
});

await check('validateJSON returns parsed data for valid JSON', () => {
  const r = SecurityUtils.validateJSON('{"key":"value"}');
  return r.valid === true && r.data.key === 'value' ? true : `r=${JSON.stringify(r)}`;
});

await check('validateJSON rejects malformed JSON', () => {
  const r = SecurityUtils.validateJSON('{bad json}');
  return r.valid === false ? true : `got valid=true`;
});

await check('validateJSON blocks prototype pollution', () => {
  const r = SecurityUtils.validateJSON('{"__proto__":{"injected":true}}');
  const polluted = r.data && r.data.__proto__ && r.data.__proto__.injected;
  return !polluted ? true : `prototype was polluted`;
});

await check('validateApiKey rejects empty key', () => {
  const r = SecurityUtils.validateApiKey('');
  return r.valid === false ? true : `got valid=true`;
});

await check('validateApiKey rejects key shorter than 8 chars', () => {
  const r = SecurityUtils.validateApiKey('abc123');
  return r.valid === false ? true : `got valid=true`;
});

await check('validateApiKey rejects repeated-character key', () => {
  const r = SecurityUtils.validateApiKey('aaaaaaaaaa');
  return r.valid === false ? true : `got valid=true`;
});

await check('validateApiKey rejects key starting with "test"', () => {
  const r = SecurityUtils.validateApiKey('testkey123456');
  return r.valid === false ? true : `got valid=true`;
});

await check('validateApiKey accepts a strong key', () => {
  const r = SecurityUtils.validateApiKey('xK9!mP2@qR5#nL8');
  return r.valid === true ? true : `error=${r.error}`;
});

await check('createSecureHeaders contains X-Frame-Options DENY', () => {
  const h = SecurityUtils.createSecureHeaders();
  return h['X-Frame-Options'] === 'DENY' ? true : `got ${h['X-Frame-Options']}`;
});

await check('getSecureEnvVar returns undefined for lowercase key', () => {
  const v = SecurityUtils.getSecureEnvVar('path');
  return v === undefined ? true : `got ${v}`;
});

await check('getSecureEnvVar returns value for valid uppercase key', () => {
  process.env.TEST_SECURE_VAR = 'hello';
  const v = SecurityUtils.getSecureEnvVar('TEST_SECURE_VAR');
  delete process.env.TEST_SECURE_VAR;
  return v === 'hello' ? true : `got ${v}`;
});

await check('secureDelete allows absolute path inside CWD (attempts real unlink)', async () => {
  const cwd = process.cwd();
  const absPath = `${cwd}/nonexistent-temp-file-dogfood.txt`;
  const r = await SecurityUtils.secureDelete(absPath);
  // File doesn't exist, so unlink fails — but with a filesystem error, NOT "Unsafe deletion path"
  return r.success === false && r.error !== 'Unsafe deletion path'
    ? true : `success=${r.success} error=${r.error}`;
});

await check('secureDelete rejects absolute path outside CWD', async () => {
  const r = await SecurityUtils.secureDelete('/etc/passwd');
  return r.success === false && r.error === 'Unsafe deletion path'
    ? true : `success=${r.success} error=${r.error}`;
});

await check('secureDelete rejects path traversal', async () => {
  const r = await SecurityUtils.secureDelete('../secret.txt');
  return r.success === false ? true : `success=${r.success}`;
});

// createRateLimiter
await check('createRateLimiter allows requests under limit', () => {
  const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 5 });
  const r = limiter.checkLimit('rl-utils-1');
  return r.allowed === true ? true : `allowed=${r.allowed}`;
});

await check('createRateLimiter blocks after maxRequests exceeded', () => {
  const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 3 });
  for (let i = 0; i < 3; i++) limiter.checkLimit('rl-utils-2');
  const r = limiter.checkLimit('rl-utils-2');
  return r.allowed === false ? true : `allowed=${r.allowed}`;
});

await check('createRateLimiter.reset clears identifier state', () => {
  const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 2 });
  limiter.checkLimit('rl-reset');
  limiter.checkLimit('rl-reset');
  limiter.reset('rl-reset');
  const r = limiter.checkLimit('rl-reset');
  return r.allowed === true ? true : `allowed=${r.allowed}`;
});

// containsSuspiciousPatterns
await check('containsSuspiciousPatterns detects script tags', () => {
  const r = containsSuspiciousPatterns('<script>alert(1)</script>');
  return r.suspicious === true ? true : `suspicious=${r.suspicious}`;
});

await check('containsSuspiciousPatterns detects javascript: protocol', () => {
  const r = containsSuspiciousPatterns('javascript:void(0)');
  return r.suspicious === true ? true : `suspicious=${r.suspicious}`;
});

await check('containsSuspiciousPatterns flags the word "process" (known over-detection)', () => {
  // "process" alone is a false positive for any server code mentioning process.env
  const r = containsSuspiciousPatterns('process.env.NODE_ENV');
  // Document that this is flagged as suspicious — a known over-broad pattern
  return r.suspicious === true ? true : `suspicious=${r.suspicious}`;
});

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${passed + failed} checks   ✓ ${passed} passed   ✗ ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
