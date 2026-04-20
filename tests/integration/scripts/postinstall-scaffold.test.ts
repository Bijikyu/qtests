import { describe, it, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const PROJECT_ROOT = process.cwd();
const SCRIPT_PATH = path.join(PROJECT_ROOT, 'scripts', 'postinstall-scaffold.mjs');

function makeTempDir(): string {
  const base = path.join(PROJECT_ROOT, 'tests', '.tmp');
  fs.mkdirSync(base, { recursive: true });
  return fs.mkdtempSync(path.join(base, 'postinstall-'));
}

function runPostinstall(
  env: Record<string, string> = {},
): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync(process.execPath, [SCRIPT_PATH], {
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

describe('postinstall-scaffold — integration', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = makeTempDir();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('scaffolds qtests-runner.mjs into INIT_CWD when runner is absent', () => {
    const { status } = runPostinstall({ INIT_CWD: tmpDir, QTESTS_SILENT: '1' });

    expect(status).toBe(0);
    const runnerPath = path.join(tmpDir, 'qtests-runner.mjs');
    expect(fs.existsSync(runnerPath)).toBe(true);

    const content = fs.readFileSync(runnerPath, 'utf8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('exits 0 silently and writes nothing when the target directory is not writable', () => {
    const readonlyDir = path.join(tmpDir, 'readonly');
    fs.mkdirSync(readonlyDir, { recursive: true });
    fs.chmodSync(readonlyDir, 0o444);

    const { status } = runPostinstall({ INIT_CWD: readonlyDir, QTESTS_SILENT: '1' });

    expect(status).toBe(0);
    const runnerPath = path.join(readonlyDir, 'qtests-runner.mjs');
    expect(fs.existsSync(runnerPath)).toBe(false);
  });
});
