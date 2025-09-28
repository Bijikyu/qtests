import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// Verifies that setting QTESTS_SUPPRESS_DEBUG prevents DEBUG_TESTS.md creation
describe('qtests-runner.mjs suppress debug file', () => {
  const cwd = process.cwd();
  const tmpTestsDir = path.join(cwd, 'tmp-tests-env');
  const mjsRunnerPath = path.join(cwd, 'qtests-runner.mjs');
  const suppressedDebugPath = path.join(cwd, 'DEBUG_TESTS__suppressed.md');

  beforeAll(() => { try { fs.mkdirSync(tmpTestsDir, { recursive: true }); } catch {} });

  beforeEach(() => {
    // Ensure a simple test exists for discovery
    try { fs.mkdirSync(tmpTestsDir, { recursive: true }); } catch {}
    const target = path.join(tmpTestsDir, 'env-runner-a.test.ts');
    fs.writeFileSync(target, `test('noop', () => expect(true).toBe(true));\n`, 'utf8');
    // Remove any prior debug artifact
    try { fs.rmSync(path.join(cwd, 'DEBUG_TESTS.md'), { force: true }); } catch {}
    try { fs.rmSync(suppressedDebugPath, { force: true }); } catch {}
  });

  afterEach(() => {
    try { fs.rmSync(tmpTestsDir, { recursive: true, force: true }); } catch {}
    try { fs.rmSync(path.join(cwd, 'DEBUG_TESTS.md'), { force: true }); } catch {}
    try { fs.rmSync(suppressedDebugPath, { force: true }); } catch {}
  });

  it('does not create DEBUG_TESTS.md when suppressed', async () => {
    // Create a failing test to trigger runner failure without DEBUG file
    const target = path.join(tmpTestsDir, 'env-runner-a.test.ts');
    fs.writeFileSync(target, `test('fail', () => expect(true).toBe(false));\n`, 'utf8');
    const env = {
      ...process.env,
      QTESTS_PATTERN: 'env-runner-a.test.ts',
      QTESTS_SUPPRESS_DEBUG: '1',
      QTESTS_DEBUG_FILE: path.basename(suppressedDebugPath),
      QTESTS_CONCURRENCY: '1',
    };
    await new Promise<void>((resolve) => {
      const child = spawn('node', [mjsRunnerPath], { env, stdio: ['ignore', 'ignore', 'ignore'] });
      child.on('close', () => resolve());
    });
    const exists = fs.existsSync(suppressedDebugPath);
    expect(exists).toBe(false);
  });
});
