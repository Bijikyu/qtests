import { describe, it, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const PROJECT_ROOT = process.cwd();
const BIN_PATH = path.join(PROJECT_ROOT, 'bin', 'qtests-generate.mjs');

function makeTempDir(): string {
  const base = path.join(PROJECT_ROOT, 'tests', '.tmp');
  fs.mkdirSync(base, { recursive: true });
  return fs.mkdtempSync(path.join(base, 'qtests-gen-'));
}

function runGenerator(
  args: string[],
  env: Record<string, string> = {},
): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync(process.execPath, [BIN_PATH, ...args], {
    cwd: PROJECT_ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...env },
    timeout: 15000,
  });
  return {
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    status: result.status,
  };
}

describe('qtests-generate — integration', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = makeTempDir();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('exits 0, scaffolds runner and config, and reports source file count', () => {
    fs.mkdirSync(path.join(tmpDir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'src', 'index.ts'), 'export const hello = () => "world";\n', 'utf8');

    const { status, stdout } = runGenerator([], {
      INIT_CWD: tmpDir,
      QTESTS_SUPPRESS_PROMPT: '1',
      QTESTS_SILENT: '1',
    });

    expect(status).toBe(0);
    expect(stdout).toContain('done');
    expect(stdout).toContain('sources');
    expect(fs.existsSync(path.join(tmpDir, 'qtests-runner.mjs'))).toBe(true);
  });

  it('exits 1 when run from inside node_modules (invalid source directory)', () => {
    const invalidCwd = path.join(PROJECT_ROOT, 'node_modules', 'jest');
    const env = { ...process.env, QTESTS_SUPPRESS_PROMPT: '1', QTESTS_SILENT: '1' };
    delete env.INIT_CWD;

    const result = spawnSync(process.execPath, [BIN_PATH], {
      cwd: invalidCwd,
      encoding: 'utf8',
      env,
      timeout: 15000,
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('node_modules');
  });
});
