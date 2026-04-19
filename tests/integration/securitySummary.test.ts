/**
 * Tests for the security-summary display feature added in Task #8.
 *
 * Covers:
 *  - writeSummaryFile()          — spy-based (scripts/writeSummaryFile.js)
 *  - formatSecurityCategory()    — direct unit tests (lib/security/summaryHelpers.ts)
 *  - readSecuritySummary()       — direct unit tests with fs.readFileSync spy
 *  - TestRunner.printSummary()   — subprocess tests (class lives in qtests-runner.mjs)
 *
 * formatSecurityCategory and readSecuritySummary are now imported directly from the
 * shared TypeScript module, replacing the slow subprocess tests used before Task #15.
 */

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { formatSecurityCategory, readSecuritySummary } from '../../lib/security/summaryHelpers.js';
// writeSummaryFile is now TypeScript compiled to dist — import the compiled output
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { writeSummaryFile } = require('../../dist/scripts/writeSummaryFile.js');

const PROJECT_ROOT = process.cwd();
const RUNNER_PATH = path.join(PROJECT_ROOT, 'qtests-runner.mjs');
const SECURITY_RUNNER_PATH = path.join(PROJECT_ROOT, 'dist', 'scripts', 'security-test-runner.js');
const SUMMARY_PATH = path.join(PROJECT_ROOT, 'security-summary.json');

function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

function makeTempDir(): string {
  const base = path.join(PROJECT_ROOT, 'tests', '.tmp');
  fs.mkdirSync(base, { recursive: true });
  return fs.mkdtempSync(path.join(base, 'sec-summary-'));
}

function runRunner(
  cwd: string,
  extraEnv: Record<string, string> = {},
  timeoutMs = 20000,
): { out: string; status: number | null } {
  const result = spawnSync(process.execPath, [RUNNER_PATH], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, ...extraEnv },
    timeout: timeoutMs,
  });
  const raw = (result.stdout ?? '') + (result.stderr ?? '');
  return { out: stripAnsi(raw), status: result.status };
}

// ── writeSummaryFile() — spy-based unit tests ────────────────────────────────

describe('writeSummaryFile() — spy-based', () => {
  const RESULTS = [
    { type: 'regression_tests',        summary: { passed: 3, total: 3 } },
    { type: 'penetration_tests',       summary: { passed: 4, total: 4 } },
    { type: 'configuration_validation', summary: { passed: 3, total: 3 } },
  ];

  let writeSpy: jest.SpyInstance;

  beforeEach(() => {
    writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined);
  });

  afterEach(() => {
    writeSpy.mockRestore();
  });

  test('calls fs.writeFileSync once with the security-summary.json path', () => {
    writeSummaryFile(RESULTS);

    expect(writeSpy).toHaveBeenCalledTimes(1);
    const [calledPath] = writeSpy.mock.calls[0] as [string, ...unknown[]];
    expect(calledPath).toContain('security-summary.json');
  });

  test('written JSON contains regression, penetration, and configuration keys', () => {
    writeSummaryFile(RESULTS);

    const [, calledData] = writeSpy.mock.calls[0] as [string, string, ...unknown[]];
    const parsed = JSON.parse(calledData);
    expect(parsed).toHaveProperty('regression');
    expect(parsed).toHaveProperty('penetration');
    expect(parsed).toHaveProperty('configuration');
  });

  test('each category entry has correct passed and total counts', () => {
    writeSummaryFile(RESULTS);

    const [, calledData] = writeSpy.mock.calls[0] as [string, string, ...unknown[]];
    const parsed = JSON.parse(calledData);
    expect(parsed.regression).toEqual({ passed: 3, total: 3 });
    expect(parsed.penetration).toEqual({ passed: 4, total: 4 });
    expect(parsed.configuration).toEqual({ passed: 3, total: 3 });
  });

  test('missing result type produces null entry in JSON', () => {
    writeSummaryFile([RESULTS[0]]);

    const [, calledData] = writeSpy.mock.calls[0] as [string, string, ...unknown[]];
    const parsed = JSON.parse(calledData);
    expect(parsed.regression).not.toBeNull();
    expect(parsed.penetration).toBeNull();
    expect(parsed.configuration).toBeNull();
  });

  test('does not throw when fs.writeFileSync fails (best-effort write)', () => {
    writeSpy.mockImplementation(() => { throw new Error('disk full'); });
    expect(() => writeSummaryFile(RESULTS)).not.toThrow();
  });
});

// ── SecurityTestRunner.writeSummaryFile() — real subprocess (integration) ────

describe('SecurityTestRunner.writeSummaryFile() — real security runner subprocess', () => {
  beforeEach(() => {
    try { fs.unlinkSync(SUMMARY_PATH); } catch { /* absent is fine */ }
  });

  test('security runner writes security-summary.json with all three keys', () => {
    const result = spawnSync(process.execPath, [SECURITY_RUNNER_PATH], {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      timeout: 20000,
    });
    expect(result.status).toBe(0);
    expect(fs.existsSync(SUMMARY_PATH)).toBe(true);
    const data = JSON.parse(fs.readFileSync(SUMMARY_PATH, 'utf8'));
    expect(data).toHaveProperty('regression');
    expect(data).toHaveProperty('penetration');
    expect(data).toHaveProperty('configuration');
  });

  test('passed counts equal total counts when all security tests pass', () => {
    spawnSync(process.execPath, [SECURITY_RUNNER_PATH], {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      timeout: 20000,
    });
    const data = JSON.parse(fs.readFileSync(SUMMARY_PATH, 'utf8'));
    expect(data.regression.passed).toBe(data.regression.total);
    expect(data.penetration.passed).toBe(data.penetration.total);
    expect(data.configuration.passed).toBe(data.configuration.total);
  });
});

// ── formatSecurityCategory() — direct unit tests ─────────────────────────────

describe('formatSecurityCategory()', () => {
  test('returns null for null info', () => {
    expect(formatSecurityCategory('regression', null)).toBeNull();
  });

  test('returns null for undefined info', () => {
    expect(formatSecurityCategory('regression', undefined)).toBeNull();
  });

  test('includes passed/total counts in returned string', () => {
    const result = formatSecurityCategory('regression', { passed: 3, total: 3 });
    expect(result).toContain('3/3');
    expect(result).toContain('regression');
  });

  test('includes ✓ mark when passed === total', () => {
    const result = stripAnsi(formatSecurityCategory('regression', { passed: 3, total: 3 })!);
    expect(result).toBe('3/3 regression ✓');
  });

  test('includes ✗ mark when passed < total', () => {
    const result = stripAnsi(formatSecurityCategory('regression', { passed: 2, total: 3 })!);
    expect(result).toBe('2/3 regression ✗');
  });

  test('works for any label (pentest, config, etc.)', () => {
    expect(stripAnsi(formatSecurityCategory('pentest', { passed: 4, total: 4 })!))
      .toBe('4/4 pentest ✓');
    expect(stripAnsi(formatSecurityCategory('config', { passed: 3, total: 3 })!))
      .toBe('3/3 config ✓');
  });

  test('edge case: 0/0 counts — all passed (no tests)', () => {
    const result = stripAnsi(formatSecurityCategory('regression', { passed: 0, total: 0 })!);
    expect(result).toBe('0/0 regression ✓');
  });
});

// ── readSecuritySummary() — direct unit tests with fs spy ────────────────────

describe('readSecuritySummary()', () => {
  let readSpy: jest.SpyInstance;

  afterEach(() => {
    readSpy?.mockRestore();
  });

  test('returns parsed JSON when file is readable', () => {
    const payload = { regression: { passed: 3, total: 3 }, penetration: null, configuration: null };
    readSpy = jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(payload) as never);
    const result = readSecuritySummary('/fake/security-summary.json');
    expect(result).toEqual(payload);
  });

  test('returns null when file is absent (readFileSync throws ENOENT)', () => {
    readSpy = jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
    });
    expect(readSecuritySummary('/fake/security-summary.json')).toBeNull();
  });

  test('returns null when file content is not valid JSON', () => {
    readSpy = jest.spyOn(fs, 'readFileSync').mockReturnValue('not-valid-json' as never);
    expect(readSecuritySummary('/fake/security-summary.json')).toBeNull();
  });

  test('uses process.cwd()/security-summary.json as default path', () => {
    readSpy = jest.spyOn(fs, 'readFileSync').mockReturnValue('{}' as never);
    readSecuritySummary();
    expect(readSpy).toHaveBeenCalledWith(
      path.join(process.cwd(), 'security-summary.json'),
      'utf8',
    );
  });

  test('uses provided summaryPath argument', () => {
    readSpy = jest.spyOn(fs, 'readFileSync').mockReturnValue('{}' as never);
    readSecuritySummary('/custom/path/summary.json');
    expect(readSpy).toHaveBeenCalledWith('/custom/path/summary.json', 'utf8');
  });
});

// ── printSummary() subprocess tests — QTESTS_SKIP_SECURITY path ──────────────
// (printSummary is still a method on TestRunner in qtests-runner.mjs; integration
// tests remain the only practical way to verify its output.)

describe('TestRunner printSummary() — QTESTS_SKIP_SECURITY path', () => {
  let tmpDir: string;

  beforeEach(() => { tmpDir = makeTempDir(); });
  afterEach(() => { fs.rmSync(tmpDir, { recursive: true, force: true }); });

  test('TEST SUMMARY contains "skipped (QTESTS_SKIP_SECURITY)" line', () => {
    const { out } = runRunner(tmpDir, { QTESTS_SKIP_SECURITY: '1' });
    expect(out).toContain('skipped (QTESTS_SKIP_SECURITY)');
  });

  test('exits 0 when security is skipped', () => {
    const { status } = runRunner(tmpDir, { QTESTS_SKIP_SECURITY: '1' });
    expect(status).toBe(0);
  });
});

// ── printSummary() subprocess tests — security runner not found ───────────────

describe('TestRunner printSummary() — security runner not found', () => {
  let tmpDir: string;

  beforeEach(() => { tmpDir = makeTempDir(); });
  afterEach(() => { fs.rmSync(tmpDir, { recursive: true, force: true }); });

  test('TEST SUMMARY security line shows "FAILED" when runner is missing', () => {
    const { out } = runRunner(tmpDir);
    expect(out).toContain('Security:');
    expect(out).toContain('FAILED');
  });

  test('exits 1 when security runner is missing', () => {
    const { status } = runRunner(tmpDir);
    expect(status).toBe(1);
  });
});
