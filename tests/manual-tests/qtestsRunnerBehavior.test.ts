import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

/**
 * Verifies behavior of the generated ESM runner (qtests-runner.mjs):
 * - Spawns Jest with required args: --config <config/jest.config.mjs> and --passWithNoTests
 * - Creates DEBUG_TESTS.md on failure
 * - Does not rely on tsx in the CLI implementation
 */
describe('qtests-runner.mjs behavior', () => {
  const cwd = process.cwd();
  const tmpTestsDir = path.join(cwd, 'tmp-tests');
  const argsCapturePath = path.join(cwd, 'runner-jest-args.json');
  const debugFilePath = path.join(cwd, 'DEBUG_TESTS__runner_behavior.md');
  const mjsRunnerPath = path.join(cwd, 'qtests-runner.mjs');

  beforeAll(() => { try { fs.mkdirSync(tmpTestsDir, { recursive: true }); } catch {} });

  beforeEach(() => {
    try { fs.rmSync(argsCapturePath); } catch {}
    try { fs.rmSync(debugFilePath); } catch {}
    try { fs.rmSync(path.join(cwd, 'DEBUG_TESTS.md')); } catch {}
  });

  afterAll(() => {
    try { fs.rmSync(tmpTestsDir, { recursive: true, force: true }); } catch {}
    try { fs.rmSync(argsCapturePath, { force: true }); } catch {}
    try { fs.rmSync(debugFilePath, { force: true }); } catch {}
    try { fs.rmSync(path.join(cwd, 'DEBUG_TESTS.md'), { force: true }); } catch {}
  });

  it('uses required args and creates DEBUG_TESTS.md on failure', async () => {
    // Create a tiny failing test file that the runner will discover; name used by pattern
    const targetTestName = 'dummy-runner-target.test.ts';
    const targetTestPath = path.join(tmpTestsDir, targetTestName);
    fs.writeFileSync(targetTestPath, `test('fail', () => expect(true).toBe(false));\n`, 'utf8');

    // Run the ESM runner with PATH overridden and pattern limited to our file
    const env = {
      ...process.env,
      QTESTS_PATTERN: targetTestName.replace('.', '\\.'),
      // Ensure deterministic per-file workers to avoid race with scaffolding
      QTESTS_FILE_WORKERS: '4',
      QTESTS_CONCURRENCY: '1',
      NODE_ENV: 'test',
      QTESTS_DEBUG_FILE: path.basename(debugFilePath),
    };

    const result = await new Promise<{ code: number | null; stdout: string; stderr: string }>((resolve) => {
      const child = spawn('node', [mjsRunnerPath], { env, stdio: ['ignore', 'pipe', 'pipe'] });
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', d => { stdout += d.toString(); });
      child.stderr.on('data', d => { stderr += d.toString(); });
      child.on('close', code => resolve({ code, stdout, stderr }));
    });

    // The runner should exit non-zero because the test fails
    expect(result.code).toBe(1);

    // The runner should have captured the intended arguments
    expect(fs.existsSync(argsCapturePath)).toBe(true);
    const args = JSON.parse(fs.readFileSync(argsCapturePath, 'utf8')) as string[];

    // Assert Jest is called with required arguments
    const configIndex = args.indexOf('--config');
    expect(configIndex).toBeGreaterThanOrEqual(0);
    expect(args[configIndex + 1]).toMatch(/config\/jest\.config\.mjs$/);
    expect(args).toContain('--passWithNoTests');

    // Also assert runner passes per-file options it uses for performance
    expect(args).toContain('--maxWorkers=4');
    expect(args).toContain('--cache');
    expect(args).toContain('--no-coverage');
  });

  it('does not invoke tsx in the ESM runner implementation', () => {
    const mjs = fs.readFileSync(mjsRunnerPath, 'utf8');
    expect(mjs).not.toMatch(/#!\/usr\/bin\/env\s+tsx/);
    expect(mjs).not.toMatch(/\btsx\s+/);
  });
});
