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
  const tmpBinDir = path.join(cwd, '.tmp-runner-bin');
  const tmpTestsDir = path.join(cwd, 'tmp-tests');
  const argsCapturePath = path.join(cwd, 'runner-jest-args.json');
  const debugFilePath = path.join(cwd, 'DEBUG_TESTS.md');
  const mjsRunnerPath = path.join(cwd, 'qtests-runner.mjs');

  beforeAll(() => {
    try { fs.mkdirSync(tmpBinDir, { recursive: true }); } catch {}
    try { fs.mkdirSync(tmpTestsDir, { recursive: true }); } catch {}
  });

  beforeEach(() => {
    try { fs.rmSync(argsCapturePath); } catch {}
    try { fs.rmSync(debugFilePath); } catch {}
  });

  afterAll(() => {
    // Leave artifacts for debugging if needed
  });

  it('spawns jest with required args and creates DEBUG_TESTS.md on failure', async () => {
    // Create a fake `jest` binary early in PATH to capture args and fail intentionally
    const fakeJestPath = path.join(tmpBinDir, 'jest');
    const fakeJestContent = `#!/usr/bin/env node\n` +
      `import fs from 'fs';\n` +
      `import path from 'path';\n` +
      `try {\n` +
      `  fs.writeFileSync(path.join(process.cwd(), 'runner-jest-args.json'), JSON.stringify(process.argv.slice(2)), 'utf8');\n` +
      `} catch (e) { /* ignore */ }\n` +
      `process.exit(1);\n`;
    fs.writeFileSync(fakeJestPath, fakeJestContent, 'utf8');
    fs.chmodSync(fakeJestPath, 0o755);

    // Create a tiny test file that the runner will discover; name used by pattern
    const targetTestName = 'dummy-runner-target.test.ts';
    const targetTestPath = path.join(tmpTestsDir, targetTestName);
    fs.writeFileSync(targetTestPath, `test('noop', () => expect(true).toBe(true));\n`, 'utf8');

    // Run the ESM runner with PATH overridden and pattern limited to our file
    const env = {
      ...process.env,
      PATH: `${tmpBinDir}:${process.env.PATH || ''}`,
      QTESTS_PATTERN: targetTestName.replace('.', '\\.'),
      NODE_ENV: 'test',
    };

    const result = await new Promise<{ code: number | null; stdout: string; stderr: string }>((resolve) => {
      const child = spawn('node', [mjsRunnerPath], { env, stdio: ['ignore', 'pipe', 'pipe'] });
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', d => { stdout += d.toString(); });
      child.stderr.on('data', d => { stderr += d.toString(); });
      child.on('close', code => resolve({ code, stdout, stderr }));
    });

    // The runner should exit non-zero because our fake jest exits 1
    expect(result.code).toBe(1);

    // DEBUG_TESTS.md should be generated on failure
    expect(fs.existsSync(debugFilePath)).toBe(true);

    // The fake jest should have captured arguments
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
