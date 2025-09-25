import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

describe('qtests-runner.mjs env tuning', () => {
  const cwd = process.cwd();
  const tmpBinDir = path.join(cwd, '.tmp-runner-bin-2');
  const argsCapturePath = path.join(cwd, 'runner-jest-args-2.json');
  const mjsRunnerPath = path.join(cwd, 'qtests-runner.mjs');
  const tmpTestsDir = path.join(cwd, 'tmp-tests-env');

  beforeAll(() => {
    try { fs.mkdirSync(tmpBinDir, { recursive: true }); } catch {}
    try { fs.mkdirSync(tmpTestsDir, { recursive: true }); } catch {}
  });
  beforeEach(() => {
    try { fs.rmSync(argsCapturePath); } catch {}
    try { fs.mkdirSync(tmpTestsDir, { recursive: true }); } catch {}
    const target = path.join(tmpTestsDir, 'env-runner-a.test.ts');
    fs.writeFileSync(target, `test('noop', () => expect(true).toBe(true));\n`, 'utf8');
  });
  afterEach(() => {
    try { fs.rmSync(tmpTestsDir, { recursive: true, force: true }); } catch {}
  });

  function writeFakeJest() {
    const fakeJestPath = path.join(tmpBinDir, 'jest');
    const fakeJestContent = `#!/usr/bin/env node\n` +
      `import fs from 'fs';\n` +
      `import path from 'path';\n` +
      `try { fs.writeFileSync(path.join(process.cwd(), 'runner-jest-args-2.json'), JSON.stringify(process.argv.slice(2)), 'utf8'); } catch { }\n` +
      `process.exit(1);\n`;
    fs.writeFileSync(fakeJestPath, fakeJestContent, 'utf8');
    fs.chmodSync(fakeJestPath, 0o755);
  }

  it('honors QTESTS_INBAND=1 to use --runInBand', async () => {
    writeFakeJest();
    const env = {
      ...process.env,
      PATH: `${tmpBinDir}:${process.env.PATH || ''}`,
      QTESTS_PATTERN: 'env-runner-a.test.ts',
      QTESTS_INBAND: '1',
      QTESTS_CONCURRENCY: '1', // ensure single spawn
    };
    const res = await new Promise<{ code: number | null }>((resolve) => {
      const child = spawn('node', [mjsRunnerPath], { env, stdio: ['ignore', 'ignore', 'ignore'] });
      child.on('close', code => resolve({ code }));
    });
    expect(res.code).toBe(1);
    const args = JSON.parse(fs.readFileSync(argsCapturePath, 'utf8')) as string[];
    expect(args).toContain('--runInBand');
    expect(args.join(' ')).not.toMatch(/--maxWorkers=\d+/);
  });

  it('honors QTESTS_FILE_WORKERS to set per-file workers', async () => {
    writeFakeJest();
    const env = {
      ...process.env,
      PATH: `${tmpBinDir}:${process.env.PATH || ''}`,
      QTESTS_PATTERN: 'env-runner-a.test.ts',
      QTESTS_FILE_WORKERS: '1',
      QTESTS_CONCURRENCY: '1',
    };
    const res = await new Promise<{ code: number | null }>((resolve) => {
      const child = spawn('node', [mjsRunnerPath], { env, stdio: ['ignore', 'ignore', 'ignore'] });
      child.on('close', code => resolve({ code }));
    });
    expect(res.code).toBe(1);
    const args = JSON.parse(fs.readFileSync(argsCapturePath, 'utf8')) as string[];
    expect(args).toContain('--maxWorkers=1');
  });
});
