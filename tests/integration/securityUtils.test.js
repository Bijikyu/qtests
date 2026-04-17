/**
 * SecurityUtils / SecurityMonitor / SecurityPolicyManager Regression Tests — Round 4
 *
 * Bug found by dogfooding:
 *  1. SecurityUtils.secureDelete() — `safePath.includes(process.cwd())` is inverted:
 *     it blocked deletion of absolute paths INSIDE the project while allowing
 *     those OUTSIDE it. Fixed to: block absolute paths that do NOT start with CWD.
 *
 * Also regression-locks all other behaviours verified correct by dogfood-utils.mjs.
 */

const path = require('path');
const {
  SecurityMonitor,
  SecuritySeverity,
  SecurityEventType,
  validateSecurityHeaders: monitorValidateHeaders,
} = require('../../dist/lib/security/SecurityMonitor.js');

const {
  SecurityPolicyManager,
} = require('../../dist/lib/security/SecurityPolicyManager.js');

const {
  SecurityUtils,
  validateFilePath,
  validateJSON,
  containsSuspiciousPatterns,
  createRateLimiter,
  validateApiKey,
} = require('../../dist/lib/security/SecurityUtils.js');

// ─── SecurityMonitor ──────────────────────────────────────────────────────────

describe('SecurityMonitor — logEvent', () => {
  let monitor;
  beforeEach(() => { monitor = new SecurityMonitor(); });
  afterEach(() => { monitor.destroy(); });

  test('logEvent stores event with generated id and timestamp', () => {
    monitor.logEvent({
      type: SecurityEventType.INJECTION_ATTACK,
      severity: SecuritySeverity.HIGH,
      source: 'test',
      details: { input: 'bad' },
      blocked: true,
      remediation: 'block',
    });
    const events = monitor.getEventsByType(SecurityEventType.INJECTION_ATTACK);
    expect(events).toHaveLength(1);
    expect(events[0].id).toBeDefined();
    expect(events[0].timestamp).toBeDefined();
  });

  test('logEvent on a destroyed monitor is a no-op (does not throw)', () => {
    monitor.destroy();
    expect(() => monitor.logEvent({
      type: SecurityEventType.XSS_ATTEMPT,
      severity: SecuritySeverity.LOW,
      source: 'test',
      details: {},
      blocked: false,
      remediation: '',
    })).not.toThrow();
  });
});

describe('SecurityMonitor — checkRateLimit', () => {
  let monitor;
  beforeEach(() => { monitor = new SecurityMonitor(); });
  afterEach(() => { monitor.destroy(); });

  test('allows requests under the limit', () => {
    const r = monitor.checkRateLimit('rl-allow', { maxRequests: 10, windowMs: 60000 });
    expect(r.allowed).toBe(true);
  });

  test('returns correct remaining count', () => {
    monitor.checkRateLimit('rl-remain', { maxRequests: 5, windowMs: 60000 });
    monitor.checkRateLimit('rl-remain', { maxRequests: 5, windowMs: 60000 });
    const r = monitor.checkRateLimit('rl-remain', { maxRequests: 5, windowMs: 60000 });
    expect(r.remaining).toBe(2);
  });

  test('blocks requests after limit exceeded', () => {
    for (let i = 0; i < 5; i++) monitor.checkRateLimit('rl-block', { maxRequests: 3, windowMs: 60000 });
    const r = monitor.checkRateLimit('rl-block', { maxRequests: 3, windowMs: 60000 });
    expect(r.allowed).toBe(false);
  });

  test('blocked result includes retryAfter', () => {
    for (let i = 0; i < 5; i++) monitor.checkRateLimit('rl-retry', { maxRequests: 2, windowMs: 60000 });
    const r = monitor.checkRateLimit('rl-retry', { maxRequests: 2, windowMs: 60000 });
    expect(typeof r.retryAfter).toBe('number');
    expect(r.retryAfter).toBeGreaterThan(0);
  });

  test('destroyed monitor returns not-allowed immediately', () => {
    monitor.destroy();
    const r = monitor.checkRateLimit('rl-dead', { maxRequests: 10, windowMs: 60000 });
    expect(r.allowed).toBe(false);
  });
});

describe('SecurityMonitor — event queries', () => {
  let monitor;
  beforeEach(() => { monitor = new SecurityMonitor(); });
  afterEach(() => { monitor.destroy(); });

  test('getEventsBySeverity returns matching events', () => {
    monitor.logEvent({ type: SecurityEventType.XSS_ATTEMPT, severity: SecuritySeverity.CRITICAL,
      source: 'test', details: {}, blocked: true, remediation: '' });
    expect(monitor.getEventsBySeverity(SecuritySeverity.CRITICAL)).toHaveLength(1);
  });

  test('getMetrics counts blocked events correctly', () => {
    monitor.logEvent({ type: SecurityEventType.INJECTION_ATTACK, severity: SecuritySeverity.HIGH,
      source: 'test', details: {}, blocked: true, remediation: '' });
    monitor.logEvent({ type: SecurityEventType.XSS_ATTEMPT, severity: SecuritySeverity.LOW,
      source: 'test', details: {}, blocked: false, remediation: '' });
    const m = monitor.getMetrics();
    expect(m.blockedEvents).toBe(1);
    expect(m.totalEvents).toBe(2);
  });

  test('getRecentEvents returns events logged within the window', () => {
    monitor.logEvent({ type: SecurityEventType.INJECTION_ATTACK, severity: SecuritySeverity.HIGH,
      source: 'test', details: {}, blocked: true, remediation: '' });
    expect(monitor.getRecentEvents(5)).toHaveLength(1);
  });

  test('clearOldEvents with 0-hour cutoff removes all events', () => {
    monitor.logEvent({ type: SecurityEventType.INJECTION_ATTACK, severity: SecuritySeverity.HIGH,
      source: 'test', details: {}, blocked: true, remediation: '' });
    monitor.clearOldEvents(0);
    expect(monitor.getMetrics().totalEvents).toBe(0);
  });

  test('generateReport is a non-empty string containing Summary', () => {
    monitor.logEvent({ type: SecurityEventType.INJECTION_ATTACK, severity: SecuritySeverity.HIGH,
      source: 'test', details: { input: 'x' }, blocked: true, remediation: '' });
    const report = monitor.generateReport();
    expect(typeof report).toBe('string');
    expect(report).toContain('Summary');
  });
});

describe('SecurityMonitor — module-level validateSecurityHeaders', () => {
  test('flags CSP without default-src directive', () => {
    const r = monitorValidateHeaders({ 'Content-Security-Policy': 'script-src self' });
    expect(r.errors.some(e => e.includes('default-src'))).toBe(true);
  });

  test('passes valid CSP with default-src', () => {
    const r = monitorValidateHeaders({ 'Content-Security-Policy': "default-src 'self'" });
    expect(r.valid).toBe(true);
  });

  test('flags HSTS without max-age', () => {
    const r = monitorValidateHeaders({ 'Strict-Transport-Security': 'include-all' });
    expect(r.errors.some(e => e.includes('max-age'))).toBe(true);
  });
});

// ─── SecurityPolicyManager ────────────────────────────────────────────────────

describe('SecurityPolicyManager — header generation', () => {
  let spm;
  beforeEach(() => { spm = new SecurityPolicyManager(); });

  test('generateSecurityHeaders includes X-Frame-Options', () => {
    expect(spm.generateSecurityHeaders()['X-Frame-Options']).toBeDefined();
  });

  test('generateSecurityHeaders includes Content-Security-Policy', () => {
    expect(spm.generateSecurityHeaders()['Content-Security-Policy']).toBeDefined();
  });

  test('generateCSP contains default-src', () => {
    expect(spm.generateCSP()).toContain('default-src');
  });

  test('generateCSP merges custom config', () => {
    expect(spm.generateCSP({ 'script-src': ["'self'", 'cdn.example.com'] })).toContain('cdn.example.com');
  });

  test('getExpressSecurityHeaders returns only string values', () => {
    const h = spm.getExpressSecurityHeaders();
    expect(Object.values(h).every(v => typeof v === 'string')).toBe(true);
  });
});

describe('SecurityPolicyManager — header validation', () => {
  let spm;
  beforeEach(() => { spm = new SecurityPolicyManager(); });

  test('validateSecurityHeaders passes for its own generated headers', () => {
    const h = spm.generateSecurityHeaders();
    expect(spm.validateSecurityHeaders(h).valid).toBe(true);
  });

  test('validateSecurityHeaders flags missing X-Frame-Options', () => {
    const v = spm.validateSecurityHeaders({ 'X-Content-Type-Options': 'nosniff', 'X-XSS-Protection': '1' });
    expect(v.errors.some(e => e.includes('X-Frame-Options'))).toBe(true);
  });

  test('validateCSP passes when default-src defined', () => {
    expect(spm.validateCSP({ 'default-src': ["'self'"] }).valid).toBe(true);
  });

  test('validateCSP fails when no src directives present', () => {
    expect(spm.validateCSP({ 'report-uri': 'https://example.com' }).valid).toBe(false);
  });
});

describe('SecurityPolicyManager — CORS', () => {
  let spm;
  beforeEach(() => { spm = new SecurityPolicyManager(); });

  test('default CORS config does not use wildcard origin', () => {
    const cors = spm.generateCORSConfig();
    expect(cors.origin).not.toBe('*');
    expect(cors.origin).not.toBe(true);
  });

  test('applyCORSHeaders sets * for boolean true origin', () => {
    const headers = {};
    spm.applyCORSHeaders(
      { setHeader(k, v) { headers[k] = v; } },
      { headers: { origin: 'https://example.com' } },
      { origin: true }
    );
    expect(headers['Access-Control-Allow-Origin']).toBe('*');
  });

  test('applyCORSHeaders echoes trusted origin from array', () => {
    const headers = {};
    spm.applyCORSHeaders(
      { setHeader(k, v) { headers[k] = v; } },
      { headers: { origin: 'https://trusted.com' } },
      { origin: ['https://trusted.com'] }
    );
    expect(headers['Access-Control-Allow-Origin']).toBe('https://trusted.com');
  });

  test('applyCORSHeaders does not set ACAO for untrusted origin', () => {
    const headers = {};
    spm.applyCORSHeaders(
      { setHeader(k, v) { headers[k] = v; } },
      { headers: { origin: 'https://evil.com' } },
      { origin: ['https://trusted.com'] }
    );
    expect(headers['Access-Control-Allow-Origin']).toBeUndefined();
  });
});

// ─── SecurityUtils ────────────────────────────────────────────────────────────

describe('SecurityUtils — tokens and hashes', () => {
  test('generateSecureToken returns hex string of correct length', () => {
    const tok = SecurityUtils.generateSecureToken(16);
    expect(typeof tok).toBe('string');
    expect(tok.length).toBe(32);
  });

  test('generateSecureHash returns consistent SHA-256 hex', () => {
    const h1 = SecurityUtils.generateSecureHash('hello');
    const h2 = SecurityUtils.generateSecureHash('hello');
    expect(h1).toBe(h2);
    expect(h1.length).toBe(64);
  });
});

describe('SecurityUtils — validateFilePath', () => {
  test('rejects path traversal', () => {
    expect(SecurityUtils.validateFilePath('../../../etc/passwd').valid).toBe(false);
  });

  test('rejects null bytes', () => {
    expect(SecurityUtils.validateFilePath('file\0.txt').valid).toBe(false);
  });

  test('accepts normal relative path', () => {
    expect(SecurityUtils.validateFilePath('uploads/photo.jpg').valid).toBe(true);
  });

  test('rejects path outside allowedDirs', () => {
    expect(SecurityUtils.validateFilePath('/tmp/evil.txt', ['/var/www']).valid).toBe(false);
  });

  test('accepts path inside allowedDirs', () => {
    expect(SecurityUtils.validateFilePath('/var/www/index.html', ['/var/www']).valid).toBe(true);
  });
});

describe('SecurityUtils — validateJSON', () => {
  test('parses valid JSON', () => {
    const r = SecurityUtils.validateJSON('{"key":"value"}');
    expect(r.valid).toBe(true);
    expect(r.data.key).toBe('value');
  });

  test('rejects malformed JSON', () => {
    expect(SecurityUtils.validateJSON('{bad json}').valid).toBe(false);
  });

  test('strips __proto__ to prevent prototype pollution', () => {
    const r = SecurityUtils.validateJSON('{"__proto__":{"injected":true}}');
    expect(r.data?.__proto__?.injected).toBeUndefined();
  });
});

describe('SecurityUtils — validateApiKey', () => {
  test('rejects empty key', () => { expect(SecurityUtils.validateApiKey('').valid).toBe(false); });
  test('rejects key shorter than 8 chars', () => { expect(SecurityUtils.validateApiKey('abc123').valid).toBe(false); });
  test('rejects repeated-character key', () => { expect(SecurityUtils.validateApiKey('aaaaaaaaaa').valid).toBe(false); });
  test('rejects key starting with "test"', () => { expect(SecurityUtils.validateApiKey('testkey123456').valid).toBe(false); });
  test('accepts a strong key', () => { expect(SecurityUtils.validateApiKey('xK9!mP2@qR5#nL8').valid).toBe(true); });
});

describe('Fix — secureDelete no longer blocks absolute paths inside CWD', () => {
  test('absolute path inside CWD attempts real unlink (not blocked with Unsafe deletion path)', async () => {
    const absPath = path.join(process.cwd(), 'nonexistent-temp-file-dogfood-test.txt');
    const r = await SecurityUtils.secureDelete(absPath);
    // File doesn't exist so unlink fails, but NOT with "Unsafe deletion path"
    expect(r.success).toBe(false);
    expect(r.error).not.toBe('Unsafe deletion path');
  });

  test('absolute path outside CWD is rejected as Unsafe deletion path', async () => {
    const r = await SecurityUtils.secureDelete('/etc/passwd');
    expect(r.success).toBe(false);
    expect(r.error).toBe('Unsafe deletion path');
  });

  test('path traversal is rejected before the path check', async () => {
    const r = await SecurityUtils.secureDelete('../secret.txt');
    expect(r.success).toBe(false);
  });
});

describe('SecurityUtils — createRateLimiter', () => {
  test('allows requests under limit', () => {
    const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 5 });
    expect(limiter.checkLimit('u-1').allowed).toBe(true);
  });

  test('blocks after maxRequests exceeded', () => {
    const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 3 });
    for (let i = 0; i < 3; i++) limiter.checkLimit('u-2');
    expect(limiter.checkLimit('u-2').allowed).toBe(false);
  });

  test('reset clears identifier state', () => {
    const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 2 });
    limiter.checkLimit('u-3');
    limiter.checkLimit('u-3');
    limiter.reset('u-3');
    expect(limiter.checkLimit('u-3').allowed).toBe(true);
  });
});

describe('SecurityUtils — containsSuspiciousPatterns', () => {
  test('detects script tags', () => {
    expect(containsSuspiciousPatterns('<script>alert(1)</script>').suspicious).toBe(true);
  });

  test('detects javascript: protocol', () => {
    expect(containsSuspiciousPatterns('javascript:void(0)').suspicious).toBe(true);
  });
});
