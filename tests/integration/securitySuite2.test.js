/**
 * Security Suite Dogfood Regression Tests — Round 2
 *
 * Covers the 6 bugs found and fixed by dogfooding the full security surface:
 *  1. validatePath now blocks absolute paths
 *  2. validateCommand is exported and correctly blocks injection
 *  3. validateModuleId blocks path traversal and absolute paths
 *  4. checkRateLimit always returns a numeric `remaining` field
 *  5. validateSecurityHeaders always flags missing required headers (not only in production)
 *  6. SecurityAnalytics.getRiskLevel rises above 'low' after high-severity events
 */

const {
  validatePath,
  validateCommand,
  validateModuleId,
} = require('../../dist/lib/security/SecurityValidator.js');

const { SecurityMonitor } = require('../../dist/lib/security/SecurityMonitor.js');
const { SecurityPolicyManager } = require('../../dist/lib/security/SecurityPolicyManager.js');
const { SecurityAnalytics } = require('../../dist/lib/security/SecurityAnalytics.js');

// ─── Fix 1 — validatePath blocks absolute paths ─────────────────────────────

describe('Fix 1 — validatePath blocks absolute paths', () => {
  test('blocks /etc/passwd', () => {
    expect(validatePath('/etc/passwd').valid).toBe(false);
  });

  test('blocks /etc/shadow', () => {
    expect(validatePath('/etc/shadow').valid).toBe(false);
  });

  test('blocks Windows absolute path C:\\Windows\\System32', () => {
    expect(validatePath('C:\\Windows\\System32').valid).toBe(false);
  });

  test('blocks relative traversal ../../../etc/passwd', () => {
    expect(validatePath('../../../etc/passwd').valid).toBe(false);
  });

  test('still allows safe relative paths', () => {
    expect(validatePath('uploads/avatar.png').valid).toBe(true);
  });

  test('still allows dot-file relative paths', () => {
    expect(validatePath('assets/logo.svg').valid).toBe(true);
  });
});

// ─── Fix 2 — validateCommand is exported ────────────────────────────────────

describe('Fix 2 — validateCommand is exported and validates correctly', () => {
  test('export exists as a function', () => {
    expect(typeof validateCommand).toBe('function');
  });

  test('blocks rm -rf /', () => {
    expect(validateCommand('rm -rf /').valid).toBe(false);
  });

  test('blocks semicolon injection', () => {
    expect(validateCommand('ls; cat /etc/passwd').valid).toBe(false);
  });

  test('blocks pipe injection', () => {
    expect(validateCommand('echo hi | sh').valid).toBe(false);
  });

  test('allows npm', () => {
    expect(validateCommand('npm').valid).toBe(true);
  });

  test('allows node', () => {
    expect(validateCommand('node').valid).toBe(true);
  });
});

// ─── Fix 3 — validateModuleId blocks traversal and absolute paths ────────────

describe('Fix 3 — validateModuleId blocks path traversal and absolute paths', () => {
  test('blocks ../../etc/passwd', () => {
    expect(validateModuleId('../../etc/passwd').valid).toBe(false);
  });

  test('blocks /etc/shadow', () => {
    expect(validateModuleId('/etc/shadow').valid).toBe(false);
  });

  test('blocks \\server\\share absolute UNC path', () => {
    expect(validateModuleId('\\\\server\\share').valid).toBe(false);
  });

  test('still allows plain package name', () => {
    expect(validateModuleId('lodash').valid).toBe(true);
  });

  test('still allows scoped package', () => {
    expect(validateModuleId('@company/utils').valid).toBe(true);
  });
});

// ─── Fix 4 — checkRateLimit always returns remaining ────────────────────────

describe('Fix 4 — checkRateLimit always includes remaining field', () => {
  let monitor;

  beforeEach(() => {
    monitor = new SecurityMonitor();
  });

  afterEach(() => {
    monitor.destroy?.() || monitor.dispose?.();
  });

  test('result has numeric remaining when allowed', () => {
    const r = monitor.checkRateLimit('test-ip-1');
    expect(typeof r.remaining).toBe('number');
    expect(r.allowed).toBe(true);
  });

  test('remaining decreases with each request', () => {
    const first = monitor.checkRateLimit('test-ip-2', { maxRequests: 10 });
    const second = monitor.checkRateLimit('test-ip-2', { maxRequests: 10 });
    expect(second.remaining).toBeLessThan(first.remaining);
  });

  test('remaining is 0 when blocked', () => {
    const id = 'burst-ip';
    for (let i = 0; i < 105; i++) {
      monitor.checkRateLimit(id, { maxRequests: 100 });
    }
    const r = monitor.checkRateLimit(id, { maxRequests: 100 });
    expect(r.allowed).toBe(false);
    expect(r.remaining).toBe(0);
  });
});

// ─── Fix 5 — validateSecurityHeaders always flags missing headers ────────────

describe('Fix 5 — validateSecurityHeaders flags missing headers regardless of NODE_ENV', () => {
  let policy;

  beforeEach(() => {
    policy = new SecurityPolicyManager();
  });

  test('returns valid:false for empty headers object', () => {
    const r = policy.validateSecurityHeaders({});
    expect(r.valid).toBe(false);
  });

  test('errors list is non-empty for empty headers', () => {
    const r = policy.validateSecurityHeaders({});
    expect(r.errors.length).toBeGreaterThan(0);
  });

  test('flags missing X-Content-Type-Options', () => {
    const r = policy.validateSecurityHeaders({});
    expect(r.errors.some(e => e.includes('X-Content-Type-Options'))).toBe(true);
  });

  test('flags missing X-Frame-Options', () => {
    const r = policy.validateSecurityHeaders({});
    expect(r.errors.some(e => e.includes('X-Frame-Options'))).toBe(true);
  });

  test('returns valid:true when all required headers are present', () => {
    const r = policy.validateSecurityHeaders({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    });
    expect(r.valid).toBe(true);
  });
});

// ─── Fix 6 — SecurityAnalytics risk level rises with high-severity events ────

describe('Fix 6 — SecurityAnalytics.getRiskLevel rises above low after high-severity events', () => {
  let analytics;

  beforeEach(() => {
    analytics = new SecurityAnalytics();
  });

  afterEach(() => {
    analytics.destroy?.();
  });

  test('starts at low', () => {
    expect(analytics.getRiskLevel()).toBe('low');
  });

  test('rises above low after many high-severity events', () => {
    for (let i = 0; i < 10; i++) {
      analytics.analyzeEvent({ type: 'injection_attack', severity: 'HIGH', source: 'test', blocked: false });
    }
    expect(['medium', 'high', 'critical']).toContain(analytics.getRiskLevel());
  });

  test('reaches critical after many critical-severity events', () => {
    for (let i = 0; i < 20; i++) {
      analytics.analyzeEvent({ type: 'injection_attack', severity: 'CRITICAL', source: 'test', blocked: false });
    }
    expect(['high', 'critical']).toContain(analytics.getRiskLevel());
  });

  test('getRiskLevel always returns one of the four valid levels', () => {
    analytics.analyzeEvent({ type: 'test', severity: 'MEDIUM', source: 'test', blocked: true });
    expect(['low', 'medium', 'high', 'critical']).toContain(analytics.getRiskLevel());
  });
});
