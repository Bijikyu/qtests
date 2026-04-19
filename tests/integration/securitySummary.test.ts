/**
 * Tests for the security-summary display feature added in Task #8.
 *
 * Covers:
 *  - SecurityTestRunner.writeSummaryFile() — JSON structure written on success
 *  - TestRunner.printSummary() — security line for skip / fail / pass paths
 *  - TestRunner.formatSecurityCategory() — ✓/✗ marks and pass/fail counts
 *  - TestRunner.readSecuritySummary() — returns null for absent or corrupt JSON
 *
 * All TestRunner tests are subprocess-based (spawn qtests-runner.mjs) so we
 * avoid importing the .mjs file directly into Jest's module system.
 * writeSummaryFile() is tested by running the real security runner standalone.
 */

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const PROJECT_ROOT = process.cwd();
const RUNNER_PATH = path.join(PROJECT_ROOT, 'qtests-runner.mjs');
const SECURITY_RUNNER_PATH = path.join(PROJECT_ROOT, 'scripts', 'security-test-runner.js');
const SUMMARY_PATH = path.join(PROJECT_ROOT, 'security-summary.json');

// Strip ANSI escape codes from a string so we can do text assertions.
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

// Spawn qtests-runner.mjs in `cwd` with optional extra env vars.
// Returns stripped combined output and the exit status.
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

// ESM-compatible fake security runner that writes a known summary JSON then exits 0.
function fakePassing(summary: Record<string, unknown>): string {
  return [
    'import fs from "fs";',
    'import path from "path";',
    `const summary = ${JSON.stringify(summary)};`,
    'fs.writeFileSync(path.join(process.cwd(), "security-summary.json"), JSON.stringify(summary), "utf8");',
    'process.exit(0);',
  ].join('\n');
}

// ── SecurityTestRunner.writeSummaryFile() ────────────────────────────────────

describe('SecurityTestRunner.writeSummaryFile()', () => {
  beforeEach(() => {
    try { fs.unlinkSync(SUMMARY_PATH); } catch { /* absent is fine */ }
  });

  test('writes security-summary.json after a successful run', () => {
    const result = spawnSync(process.execPath, [SECURITY_RUNNER_PATH], {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      timeout: 20000,
    });
    expect(result.status).toBe(0);
    expect(fs.existsSync(SUMMARY_PATH)).toBe(true);
  });

  test('written JSON contains regression, penetration, and configuration keys', () => {
    spawnSync(process.execPath, [SECURITY_RUNNER_PATH], {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      timeout: 20000,
    });
    const data = JSON.parse(fs.readFileSync(SUMMARY_PATH, 'utf8'));
    expect(data).toHaveProperty('regression');
    expect(data).toHaveProperty('penetration');
    expect(data).toHaveProperty('configuration');
  });

  test('each category entry has numeric passed and total fields', () => {
    spawnSync(process.execPath, [SECURITY_RUNNER_PATH], {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      timeout: 20000,
    });
    const data = JSON.parse(fs.readFileSync(SUMMARY_PATH, 'utf8'));
    for (const key of ['regression', 'penetration', 'configuration'] as const) {
      expect(typeof data[key].passed).toBe('number');
      expect(typeof data[key].total).toBe('number');
    }
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

// ── printSummary() + formatSecurityCategory() — happy path ───────────────────

describe('TestRunner printSummary() + formatSecurityCategory() — security passes', () => {
  let tmpDir: string;

  beforeEach(() => { tmpDir = makeTempDir(); });
  afterEach(() => { fs.rmSync(tmpDir, { recursive: true, force: true }); });

  const PASSING_SUMMARY = {
    regression: { passed: 3, total: 3 },
    penetration: { passed: 4, total: 4 },
    configuration: { passed: 3, total: 3 },
  };

  test('TEST SUMMARY shows per-category counts', () => {
    writeFile(path.join(tmpDir, 'scripts', 'security-test-runner.js'), fakePassing(PASSING_SUMMARY));
    const { out } = runRunner(tmpDir);
    expect(out).toContain('3/3 regression');
    expect(out).toContain('4/4 pentest');
    expect(out).toContain('3/3 config');
  });

  test('formatSecurityCategory shows ✓ when passed === total', () => {
    writeFile(path.join(tmpDir, 'scripts', 'security-test-runner.js'), fakePassing(PASSING_SUMMARY));
    const { out } = runRunner(tmpDir);
    expect(out).toMatch(/3\/3 regression ✓/);
    expect(out).toMatch(/4\/4 pentest ✓/);
    expect(out).toMatch(/3\/3 config ✓/);
  });

  test('exits 0 when security passes', () => {
    writeFile(path.join(tmpDir, 'scripts', 'security-test-runner.js'), fakePassing(PASSING_SUMMARY));
    const { status } = runRunner(tmpDir);
    expect(status).toBe(0);
  });
});

// ── formatSecurityCategory() — failure mark ──────────────────────────────────

describe('TestRunner formatSecurityCategory() — failure mark', () => {
  let tmpDir: string;

  beforeEach(() => { tmpDir = makeTempDir(); });
  afterEach(() => { fs.rmSync(tmpDir, { recursive: true, force: true }); });

  test('formatSecurityCategory shows ✗ when passed < total', () => {
    const FAILING_SUMMARY = {
      regression: { passed: 2, total: 3 },
      penetration: { passed: 4, total: 4 },
      configuration: { passed: 3, total: 3 },
    };
    writeFile(
      path.join(tmpDir, 'scripts', 'security-test-runner.js'),
      fakePassing(FAILING_SUMMARY),
    );
    const { out } = runRunner(tmpDir);
    expect(out).toMatch(/2\/3 regression ✗/);
    expect(out).toMatch(/4\/4 pentest ✓/);
  });
});

// ── readSecuritySummary() — null / corrupt ───────────────────────────────────

describe('TestRunner readSecuritySummary() — null / corrupt JSON', () => {
  let tmpDir: string;

  beforeEach(() => { tmpDir = makeTempDir(); });
  afterEach(() => { fs.rmSync(tmpDir, { recursive: true, force: true }); });

  test('falls back to "passed" label when summary JSON is corrupt', () => {
    // Fake runner exits 0 but writes unparseable content
    const corruptRunner = [
      'import fs from "fs";',
      'import path from "path";',
      'fs.writeFileSync(path.join(process.cwd(), "security-summary.json"), "not-valid-json", "utf8");',
      'process.exit(0);',
    ].join('\n');
    writeFile(path.join(tmpDir, 'scripts', 'security-test-runner.js'), corruptRunner);
    const { out } = runRunner(tmpDir);
    // readSecuritySummary() returns null → parts is empty → label is "passed"
    expect(out).toContain('Security:');
    expect(out).toMatch(/Security:.*passed/);
  });
});
