import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

function makeTempDir() {
  const base = path.join(process.cwd(), 'tests', '.tmp');
  fs.mkdirSync(base, { recursive: true });
  const dir = fs.mkdtempSync(path.join(base, 'runner-cli-'));
  return dir;
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function minimalJestConfigMjs() {
  return [
    "import path from 'path';",
    "import { fileURLToPath } from 'url';",
    'const __filename = fileURLToPath(import.meta.url);',
    'const __dirname = path.dirname(__filename);',
    'export default {',
    "  rootDir: path.resolve(__dirname, '..'),",
    "  testEnvironment: 'node',",
    "  testMatch: ['**/*.test.js']",
    '};'
  ].join('\n');
}

function runRunner(cwd, extraEnv = {}) {
  const runnerPath = path.join(process.cwd(), 'bin', 'qtests-ts-runner');
  const env = { ...process.env, ...extraEnv };
  return spawnSync(process.execPath, [runnerPath], {
    cwd,
    env,
    encoding: 'utf8'
  });
}

test('bin/qtests-ts-runner contains no tsx usage', () => {
  const runnerPath = path.join(process.cwd(), 'bin', 'qtests-ts-runner');
  const content = fs.readFileSync(runnerPath, 'utf8');
  const importsTsx = /from\s+['"]tsx['"]/.test(content) || /require\(\s*['"]tsx['"]\s*\)/.test(content);
  expect(importsTsx).toBe(false);
});

test('bin/qtests-ts-runner runs Jest with required config and emits DEBUG_TESTS.md on failures', () => {
  const cwd = makeTempDir();
  try {
    writeFile(
      path.join(cwd, 'config', 'jest.config.mjs'),
      minimalJestConfigMjs()
    );
    writeFile(
      path.join(cwd, 'failing.test.js'),
      "test('fails', () => { expect(1).toBe(2); });"
    );

    const res = runRunner(cwd, { QTESTS_SILENT: '1', QTESTS_FILE_WORKERS: '1' });
    expect(res.status).toBe(1);

    const argsPath = path.join(cwd, 'runner-jest-args.json');
    expect(fs.existsSync(argsPath)).toBe(true);
    const args = JSON.parse(fs.readFileSync(argsPath, 'utf8'));
    expect(args.includes('--passWithNoTests')).toBe(true);
    expect(args.includes('--config')).toBe(true);

    expect(fs.existsSync(path.join(cwd, 'DEBUG_TESTS.md'))).toBe(true);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test('bin/qtests-ts-runner exits 0 on success and does not require DEBUG_TESTS.md', () => {
  const cwd = makeTempDir();
  try {
    writeFile(
      path.join(cwd, 'config', 'jest.config.mjs'),
      minimalJestConfigMjs()
    );
    writeFile(path.join(cwd, 'passing.test.js'), "test('passes', () => { expect(1).toBe(1); });");

    const res = runRunner(cwd, { QTESTS_SILENT: '1', QTESTS_FILE_WORKERS: '1' });
    expect(res.status).toBe(0);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});
