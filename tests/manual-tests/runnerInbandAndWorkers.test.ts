import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

describe('qtests-runner.mjs env tuning', () => {
  const cwd = process.cwd();
  const argsCapturePath = path.join(cwd, 'runner-jest-args.json');
  const mjsRunnerPath = path.join(cwd, 'qtests-runner.mjs');
  const tmpTestsDir = path.join(cwd, 'tmp-tests-env');

  beforeAll(() => { try { fs.mkdirSync(tmpTestsDir, { recursive: true }); } catch {} });
  beforeEach(() => {
    try { fs.rmSync(argsCapturePath); } catch {}
    try { fs.mkdirSync(tmpTestsDir, { recursive: true }); } catch {}
    const target = path.join(tmpTestsDir, 'env-runner-a.test.ts');
    fs.writeFileSync(target, `test('noop', () => expect(true).toBe(true));\n`, 'utf8');
  });
  afterEach(() => {
    try { fs.rmSync(tmpTestsDir, { recursive: true, force: true }); } catch {}
    // Ensure any debug artifact created by the runner is removed to avoid confusion for developers
    try { fs.rmSync(path.join(cwd, 'DEBUG_TESTS.md'), { force: true }); } catch {}
  });

  it('honors QTESTS_INBAND=1 to use --runInBand', async () => {
    const env = {
      ...process.env,
      QTESTS_PATTERN: 'env-runner-a.test.ts',
      QTESTS_INBAND: '1',
      QTESTS_SUPPRESS_DEBUG: '1',
      QTESTS_CONCURRENCY: '1',
    };
    const res = await new Promise<{ code: number | null }>((resolve) => {
      const child = spawn('node', [mjsRunnerPath], { env, stdio: ['ignore', 'ignore', 'ignore'] });
      child.on('close', code => resolve({ code }));
    });
    expect(res.code).toBe(0);
    const args = JSON.parse(fs.readFileSync(argsCapturePath, 'utf8')) as string[];
    expect(args).toContain('--runInBand');
    expect(args.join(' ')).not.toMatch(/--maxWorkers=\d+/);
  });

  it('honors QTESTS_FILE_WORKERS to set per-file workers', async () => {
    const env = {
      ...process.env,
      QTESTS_PATTERN: 'env-runner-a.test.ts',
      QTESTS_FILE_WORKERS: '1',
      QTESTS_SUPPRESS_DEBUG: '1',
      QTESTS_CONCURRENCY: '1',
    };
    const res = await new Promise<{ code: number | null }>((resolve) => {
      const child = spawn('node', [mjsRunnerPath], { env, stdio: ['ignore', 'ignore', 'ignore'] });
      child.on('close', code => resolve({ code }));
    });
    expect(res.code).toBe(0);
    const args = JSON.parse(fs.readFileSync(argsCapturePath, 'utf8')) as string[];
    expect(args).toContain('--maxWorkers=1');
  });
});
