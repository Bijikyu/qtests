import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

describe('qtests-generate CLI runner scaffolding', () => {
  it('ALWAYS writes and overwrites qtests-runner.mjs at client root (INIT_CWD)', () => {
    // Create a temporary client root under workspace
    const clientRoot = path.join(process.cwd(), 'tmp-tests-env-3');
    try { fs.mkdirSync(clientRoot, { recursive: true }); } catch {}

    const target = path.join(clientRoot, 'qtests-runner.mjs');
    // Pre-create a stale runner to ensure overwrite
    fs.writeFileSync(target, '// STALE RUNNER\n', 'utf8');
    const before = fs.readFileSync(target, 'utf8');
    expect(before).toContain('STALE RUNNER');

    // Invoke the CLI with INIT_CWD pointing to the client root
    const binPath = path.join(process.cwd(), 'bin', 'qtests-generate.mjs');
    const result = spawnSync('node', [binPath, '--dry-run'], {
      env: { ...process.env, INIT_CWD: clientRoot, QTESTS_SILENT: '1' },
      stdio: 'pipe',
      encoding: 'utf8'
    });

    // CLI should exit successfully even in dry-run
    expect(result.status).toBe(0);

    // The runner should be overwritten with the valid template
    expect(fs.existsSync(target)).toBe(true);
    const content = fs.readFileSync(target, 'utf8');
    expect(content).toContain('GENERATED RUNNER: qtests-runner.mjs');
    expect(content).toContain('API Mode');
  });
});

