/**
 * Security Validator Regression Tests — Round 2
 *
 * Regression-locks the three input-validation bugs found and fixed in round 2:
 *  1. validatePath now blocks absolute paths
 *  2. validateCommand is exported and correctly blocks injection
 *  3. validateModuleId blocks path traversal and absolute paths
 */

const {
  validatePath,
  validateCommand,
  validateModuleId,
} = require('../../dist/lib/security/SecurityValidator.js');

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
