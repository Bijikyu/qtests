import { describe, it, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { RunnerScaffolder } from '../../../lib/runnerScaffolder.js';

const PROJECT_ROOT = process.cwd();

function makeTempDir(): string {
  const base = path.join(PROJECT_ROOT, 'tests', '.tmp');
  fs.mkdirSync(base, { recursive: true });
  return fs.mkdtempSync(path.join(base, 'runner-scaffolder-'));
}

describe('runnerScaffolder — integration', () => {
  let tmpDir: string;
  let originalCwd: string;

  beforeEach(() => {
    tmpDir = makeTempDir();
    originalCwd = process.cwd();
    process.chdir(tmpDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('scaffolds a valid qtests-runner.mjs into the current working directory', async () => {
    const scaffolder = new RunnerScaffolder();
    await scaffolder.scaffoldRunner();

    const runnerPath = path.join(tmpDir, 'qtests-runner.mjs');
    expect(fs.existsSync(runnerPath)).toBe(true);

    const content = fs.readFileSync(runnerPath, 'utf8');
    expect(content).toContain('runCLI');
    expect(content.split('\n').length).toBeGreaterThan(10);
  });

  it('throws a meaningful error when the destination runner path cannot be written', async () => {
    // Pre-create a directory at the runner target path so writeFileSync fails.
    const blockerPath = path.join(tmpDir, 'qtests-runner.mjs');
    fs.mkdirSync(blockerPath, { recursive: true });

    const scaffolder = new RunnerScaffolder();
    await expect(scaffolder.scaffoldRunner()).rejects.toThrow();
  });
});
