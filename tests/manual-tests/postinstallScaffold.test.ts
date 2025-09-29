import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

describe('postinstall-scaffold', () => {
  const cwd = process.cwd();
  const tmpClient = path.join(cwd, 'tmp-client-project');
  const runnerPath = path.join(tmpClient, 'qtests-runner.mjs');

  beforeEach(() => {
    try { fs.rmSync(tmpClient, { recursive: true, force: true }); } catch {}
    fs.mkdirSync(tmpClient, { recursive: true });
    try { fs.rmSync(runnerPath, { force: true }); } catch {}
  });

  afterEach(() => {
    try { fs.rmSync(tmpClient, { recursive: true, force: true }); } catch {}
  });

  it('creates qtests-runner.mjs in INIT_CWD when missing', async () => {
    const env = { ...process.env, INIT_CWD: tmpClient, QTESTS_SILENT: '1' };
    await new Promise<void>((resolve) => {
      const child = spawn('node', [path.join(cwd, 'scripts', 'postinstall-scaffold.mjs')], { env, stdio: ['ignore', 'ignore', 'ignore'] });
      child.on('close', () => resolve());
    });
    expect(fs.existsSync(runnerPath)).toBe(true);
    const content = fs.readFileSync(runnerPath, 'utf8');
    expect(content).toMatch(/GENERATED RUNNER: qtests-runner.mjs/);
    expect(content).toMatch(/API Mode/);
  });
});

