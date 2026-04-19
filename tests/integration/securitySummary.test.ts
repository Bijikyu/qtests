/**
 * Tests for the security-summary display feature added in Task #8.
 *
 * Covers:
 *  - SecurityTestRunner.writeSummaryFile() — spy-based, verifies exact JSON written
 *  - TestRunner.printSummary() — security line for skip / fail / pass paths
 *  - TestRunner.formatSecurityCategory() — ✓/✗ marks, pass/fail counts, null input
 *  - TestRunner.readSecuritySummary() — returns null for absent file and corrupt JSON
 *
 * Spy-based unit tests (jest.spyOn) cover writeSummaryFile().
 * Subprocess tests cover the TestRunner methods whose class lives in qtests-runner.mjs,
 * an .mjs file that the Jest transform pipeline cannot transform directly.
 */

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
// writeSummaryFile.js has no import.meta.url, so Jest can import it directly
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { writeSummaryFile } = require('../../scripts/writeSummaryFile.js');

const PROJECT_ROOT = process.cwd();
const RUNNER_PATH = path.join(PROJECT_ROOT, 'qtests-runner.mjs');
const SECURITY_RUNNER_PATH = path.join(PROJECT_ROOT, 'scripts', 'security-test-runner.js');
const SUMMARY_PATH = path.join(PROJECT_ROOT, 'security-summary.json');

function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

function makeTempDir(): string {
  const base = path.join(PROJECT_ROOT, 'tests', '.tmp');
  fs.mkdirSync(base, { recursive: true });
  return fs.mkdtempSync(path.join(base, 'sec-summary-'));
}

function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
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

// ESM-compatible fake security runner that writes a known summary then exits 0.
function fakePassingRunner(summary: Record<string, unknown>): string {
  return [
    'import fs from "fs";',
    'import path from "path";',
    `const summary = ${JSON.stringify(summary)};`,
    'fs.writeFileSync(path.join(process.cwd(), "security-summary.json"), JSON.stringify(summary), "utf8");',
    'process.exit(0);',
  ].join('\n');
}

// ── writeSummaryFile() — spy-based unit tests ────────────────────────────────

describe('writeSummaryFile() — spy-based', () => {
  const RESULTS = [
    { type: 'regression_tests',       summary: { passed: 3, total: 3 } },
    { type: 'penetration_tests',      summary: { passed: 4, total: 4 } },
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
    writeSummaryFile([RESULTS[0]]);   // only regression present

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

// ── SecurityTestRunner.writeSummaryFile() — real file (integration) ───────────

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

// ── printSummary() — QTESTS_SKIP_SECURITY path ───────────────────────────────

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

// ── printSummary() — security runner not found ───────────────────────────────

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

// ── printSummary() + formatSecurityCategory() — all-pass path ────────────────

describe('TestRunner printSummary() + formatSecurityCategory() — security passes', () => {
  let tmpDir: string;

  beforeEach(() => { tmpDir = makeTempDir(); });
  afterEach(() => { fs.rmSync(tmpDir, { recursive: true, force: true }); });

  const PASSING = {
    regression: { passed: 3, total: 3 },
    penetration: { passed: 4, total: 4 },
    configuration: { passed: 3, total: 3 },
  };

  test('TEST SUMMARY shows per-category counts for all three categories', () => {
    writeFile(path.join(tmpDir, 'scripts', 'security-test-runner.js'), fakePassingRunner(PASSING));
    const { out } = runRunner(tmpDir);
    expect(out).toContain('3/3 regression');
    expect(out).toContain('4/4 pentest');
    expect(out).toContain('3/3 config');
  });

  test('formatSecurityCategory shows ✓ when passed === total', () => {
    writeFile(path.join(tmpDir, 'scripts', 'security-test-runner.js'), fakePassingRunner(PASSING));
    const { out } = runRunner(tmpDir);
    expect(out).toMatch(/3\/3 regression ✓/);
    expect(out).toMatch(/4\/4 pentest ✓/);
    expect(out).toMatch(/3\/3 config ✓/);
  });

  test('exits 0 when security passes', () => {
    writeFile(path.join(tmpDir, 'scripts', 'security-test-runner.js'), fakePassingRunner(PASSING));
    const { status } = runRunner(tmpDir);
    expect(status).toBe(0);
  });
});

// ── formatSecurityCategory() — failure mark ──────────────────────────────────

describe('TestRunner formatSecurityCategory() — failure mark', () => {
  let tmpDir: string;

  beforeEach(() => { tmpDir = makeTempDir(); });
  afterEach(() => { fs.rmSync(tmpDir, { recursive: true, force: true }); });

  test('shows ✗ for a category where passed < total', () => {
    const PARTIAL = {
      regression: { passed: 2, total: 3 },
      penetration: { passed: 4, total: 4 },
      configuration: { passed: 3, total: 3 },
    };
    writeFile(path.join(tmpDir, 'scripts', 'security-test-runner.js'), fakePassingRunner(PARTIAL));
    const { out } = runRunner(tmpDir);
    expect(out).toMatch(/2\/3 regression ✗/);
    expect(out).toMatch(/4\/4 pentest ✓/);
  });

  test('returns null for a null category entry (filtered from summary line)', () => {
    // All categories null → readSecuritySummary returns object with null values →
    // formatSecurityCategory called with null for each → all filtered → "passed" label
    const ALL_NULL = { regression: null, penetration: null, configuration: null };
    writeFile(path.join(tmpDir, 'scripts', 'security-test-runner.js'), fakePassingRunner(ALL_NULL));
    const { out } = runRunner(tmpDir);
    // null inputs → parts empty → falls back to "passed"
    expect(out).toMatch(/Security:.*passed/);
  });
});

// ── readSecuritySummary() — null paths ───────────────────────────────────────

describe('TestRunner readSecuritySummary() — null / absent / corrupt', () => {
  let tmpDir: string;

  beforeEach(() => { tmpDir = makeTempDir(); });
  afterEach(() => { fs.rmSync(tmpDir, { recursive: true, force: true }); });

  test('returns null when summary file is absent (fake runner exits 0 without writing)', () => {
    // Fake runner exits 0 but never writes security-summary.json
    const noFileRunner = [
      'process.exit(0);',
    ].join('\n');
    writeFile(path.join(tmpDir, 'scripts', 'security-test-runner.js'), noFileRunner);
    const { out } = runRunner(tmpDir);
    // categories null (file absent) → parts empty → label "passed"
    expect(out).toContain('Security:');
    expect(out).toMatch(/Security:.*passed/);
  });

  test('returns null for corrupt JSON (falls back to "passed" label)', () => {
    const corruptRunner = [
      'import fs from "fs";',
      'import path from "path";',
      'fs.writeFileSync(path.join(process.cwd(), "security-summary.json"), "not-valid-json", "utf8");',
      'process.exit(0);',
    ].join('\n');
    writeFile(path.join(tmpDir, 'scripts', 'security-test-runner.js'), corruptRunner);
    const { out } = runRunner(tmpDir);
    expect(out).toContain('Security:');
    expect(out).toMatch(/Security:.*passed/);
  });
});
