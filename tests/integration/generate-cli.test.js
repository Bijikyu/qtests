import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';

function makeIsolatedTempDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qtests-generate-'));
  return dir;
}

function makeRepoTempDir() {
  const base = path.join(process.cwd(), 'tests', '.tmp');
  fs.mkdirSync(base, { recursive: true });
  return fs.mkdtempSync(path.join(base, 'qtests-generate-'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function runGenerate(cwd, extraEnv = {}) {
  const generatorPath = path.join(process.cwd(), 'bin', 'qtests-generate.mjs');
  const env = { ...process.env, INIT_CWD: cwd, ...extraEnv };
  return spawnSync(process.execPath, [generatorPath], {
    cwd,
    env,
    encoding: 'utf8'
  });
}

test('qtests-generate produces JS-only setup (.cjs) when ts-jest/typescript are not available', () => {
  const cwd = makeIsolatedTempDir();
  try {
    writeJson(path.join(cwd, 'package.json'), { name: 'tmp-qtests-generate', private: true });

    const res = runGenerate(cwd, { QTESTS_SILENT: '1', NODE_PATH: '' });
    if (res.status !== 0) {
      throw new Error(`qtests-generate failed (status=${res.status})\nstdout:\n${res.stdout}\nstderr:\n${res.stderr}`);
    }

    const jestConfigPath = path.join(cwd, 'config', 'jest.config.mjs');
    const jestSetupCjsPath = path.join(cwd, 'config', 'jest-setup.cjs');
    const jestSetupTsPath = path.join(cwd, 'config', 'jest-setup.ts');

    expect(fs.existsSync(jestConfigPath)).toBe(true);
    expect(fs.existsSync(jestSetupCjsPath)).toBe(true);
    expect(fs.existsSync(jestSetupTsPath)).toBe(false);

    const jestConfig = fs.readFileSync(jestConfigPath, 'utf8');
    expect(jestConfig.includes('jest-setup.cjs')).toBe(true);

    const setupCjs = fs.readFileSync(jestSetupCjsPath, 'utf8');
    expect(setupCjs.includes("require('qtests/setup')")).toBe(true);
    expect(setupCjs.includes("j.mock('axios'")).toBe(true);
    expect(setupCjs.includes("j.mock('winston'")).toBe(true);
    // Ensure it's not an ESM "import ..." statement (comments may contain the word "import").
    expect(/^\s*import\s+/m.test(setupCjs)).toBe(false);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test('qtests-generate produces TS setup (.ts) when ts-jest/typescript are available (workspace/monorepo style)', () => {
  const cwd = makeRepoTempDir();
  try {
    writeJson(path.join(cwd, 'package.json'), { name: 'tmp-qtests-generate-repo', private: true });

    const res = runGenerate(cwd, { QTESTS_SILENT: '1' });
    if (res.status !== 0) {
      throw new Error(`qtests-generate failed (status=${res.status})\nstdout:\n${res.stdout}\nstderr:\n${res.stderr}`);
    }

    const jestConfigPath = path.join(cwd, 'config', 'jest.config.mjs');
    const jestSetupTsPath = path.join(cwd, 'config', 'jest-setup.ts');

    expect(fs.existsSync(jestConfigPath)).toBe(true);
    expect(fs.existsSync(jestSetupTsPath)).toBe(true);

    const jestConfig = fs.readFileSync(jestConfigPath, 'utf8');
    expect(jestConfig.includes('jest-setup.ts')).toBe(true);

    const setupTs = fs.readFileSync(jestSetupTsPath, 'utf8');
    expect(setupTs.includes("j.mock('axios'")).toBe(true);
    expect(setupTs.includes("j.mock('winston'")).toBe(true);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});
