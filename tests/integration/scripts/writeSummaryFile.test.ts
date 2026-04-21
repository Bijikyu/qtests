import { describe, it, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { writeSummaryFile } from '../../../scripts/writeSummaryFile.js';

const PROJECT_ROOT = process.cwd();

const RESULTS = [
  { type: 'regression_tests' as const, summary: { passed: 3, total: 3 } },
  { type: 'penetration_tests' as const, summary: { passed: 4, total: 4 } },
  { type: 'configuration_validation' as const, summary: { passed: 3, total: 3 } },
];

function makeTempDir(): string {
  const base = path.join(PROJECT_ROOT, 'tests', '.tmp');
  fs.mkdirSync(base, { recursive: true });
  return fs.mkdtempSync(path.join(base, 'write-summary-'));
}

describe('writeSummaryFile — integration', () => {
  let tmpDir: string;
  let cwdSpy: jest.SpiedFunction<typeof process.cwd>;

  beforeEach(() => {
    tmpDir = makeTempDir();
    // Worker-based Jest execution forbids process.chdir(), so point writeSummaryFile at the temp dir via cwd().
    cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(tmpDir);
  });

  afterEach(() => {
    cwdSpy.mockRestore();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('writes security-summary.json to the current working directory', () => {
    writeSummaryFile(RESULTS);

    const summaryPath = path.join(tmpDir, 'security-summary.json');
    expect(fs.existsSync(summaryPath)).toBe(true);
  });

  it('written file contains regression, penetration, and configuration keys with correct counts', () => {
    writeSummaryFile(RESULTS);

    const summaryPath = path.join(tmpDir, 'security-summary.json');
    const parsed = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    expect(parsed).toHaveProperty('regression');
    expect(parsed).toHaveProperty('penetration');
    expect(parsed).toHaveProperty('configuration');
    expect(parsed.regression).toEqual({ passed: 3, total: 3 });
    expect(parsed.penetration).toEqual({ passed: 4, total: 4 });
    expect(parsed.configuration).toEqual({ passed: 3, total: 3 });
  });

  it('does not throw when the security-summary.json file is not writable (best-effort write)', () => {
    const summaryPath = path.join(tmpDir, 'security-summary.json');
    fs.writeFileSync(summaryPath, '{}', 'utf8');
    fs.chmodSync(summaryPath, 0o444);

    expect(() => writeSummaryFile(RESULTS)).not.toThrow();
  });
});
