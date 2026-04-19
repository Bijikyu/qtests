import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const runnerPath = path.join(process.cwd(), 'qtests-runner.mjs');

function makeTempDir() {
  const base = path.join(process.cwd(), 'tests', '.tmp');
  fs.mkdirSync(base, { recursive: true });
  return fs.mkdtempSync(path.join(base, 'results-file-'));
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

function runMjsRunner(cwd, extraEnv = {}) {
  const env = {
    ...process.env,
    ...extraEnv,
    QTESTS_SILENT: '1',
    QTESTS_FILE_WORKERS: '1',
    QTESTS_SKIP_SECURITY: 'true'
  };
  return spawnSync(process.execPath, [runnerPath], { cwd, env, encoding: 'utf8' });
}

function scaffoldProject(cwd, testContent) {
  writeFile(path.join(cwd, 'config', 'jest.config.mjs'), minimalJestConfigMjs());
  if (testContent !== undefined) {
    writeFile(path.join(cwd, 'passing.test.js'), testContent);
  }
}

test('qtests-runner.mjs writes qtests-results.json with schemaVersion 1', () => {
  const cwd = makeTempDir();
  try {
    scaffoldProject(cwd, "test('passes', () => { expect(1).toBe(1); });");
    runMjsRunner(cwd);

    const resultsPath = path.join(cwd, 'qtests-results.json');
    expect(fs.existsSync(resultsPath)).toBe(true);

    const data = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    expect(data.schemaVersion).toBe(1);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test('qtests-runner.mjs results file contains correct passedFiles and failedFiles counts', () => {
  const cwd = makeTempDir();
  try {
    scaffoldProject(cwd, "test('passes', () => { expect(1).toBe(1); });");
    const res = runMjsRunner(cwd);
    expect(res.status).toBe(0);

    const data = JSON.parse(fs.readFileSync(path.join(cwd, 'qtests-results.json'), 'utf8'));
    expect(data.passedFiles).toBe(1);
    expect(data.failedFiles).toBe(0);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test('qtests-runner.mjs results file contains per-file entries with required fields', () => {
  const cwd = makeTempDir();
  try {
    scaffoldProject(cwd, "test('passes', () => { expect(1).toBe(1); });");
    const res = runMjsRunner(cwd);
    expect(res.status).toBe(0);

    const data = JSON.parse(fs.readFileSync(path.join(cwd, 'qtests-results.json'), 'utf8'));
    expect(Array.isArray(data.files)).toBe(true);
    expect(data.files).toHaveLength(1);

    const entry = data.files[0];
    expect(typeof entry.path).toBe('string');
    expect(entry.success).toBe(true);
    expect(typeof entry.durationMs).toBe('number');
    expect('failureMessage' in entry).toBe(true);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test('qtests-runner.mjs results file contains securitySummary key', () => {
  const cwd = makeTempDir();
  try {
    scaffoldProject(cwd, "test('passes', () => { expect(1).toBe(1); });");
    runMjsRunner(cwd);

    const data = JSON.parse(fs.readFileSync(path.join(cwd, 'qtests-results.json'), 'utf8'));
    expect('securitySummary' in data).toBe(true);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test('qtests-runner.mjs results file reflects failing tests in failedFiles count', () => {
  const cwd = makeTempDir();
  try {
    writeFile(path.join(cwd, 'config', 'jest.config.mjs'), minimalJestConfigMjs());
    writeFile(path.join(cwd, 'failing.test.js'), "test('fails', () => { expect(1).toBe(2); });");

    const res = runMjsRunner(cwd);
    expect(res.status).toBe(1);

    const data = JSON.parse(fs.readFileSync(path.join(cwd, 'qtests-results.json'), 'utf8'));
    expect(data.failedFiles).toBe(1);
    expect(data.passedFiles).toBe(0);
    expect(data.files).toHaveLength(1);

    const failedEntry = data.files[0];
    expect(failedEntry.success).toBe(false);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test('QTESTS_NO_RESULTS_FILE=1 suppresses qtests-results.json', () => {
  const cwd = makeTempDir();
  try {
    scaffoldProject(cwd, "test('passes', () => { expect(1).toBe(1); });");
    const res = runMjsRunner(cwd, { QTESTS_NO_RESULTS_FILE: '1' });
    expect(res.status).toBe(0);

    const resultsPath = path.join(cwd, 'qtests-results.json');
    expect(fs.existsSync(resultsPath)).toBe(false);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test('QTESTS_RESULTS_FILE redirects results output to a custom path', () => {
  const cwd = makeTempDir();
  try {
    scaffoldProject(cwd, "test('passes', () => { expect(1).toBe(1); });");
    const customPath = path.join(cwd, 'custom-output', 'my-results.json');
    fs.mkdirSync(path.dirname(customPath), { recursive: true });

    const res = runMjsRunner(cwd, { QTESTS_RESULTS_FILE: customPath });
    expect(res.status).toBe(0);

    expect(fs.existsSync(customPath)).toBe(true);
    expect(fs.existsSync(path.join(cwd, 'qtests-results.json'))).toBe(false);

    const data = JSON.parse(fs.readFileSync(customPath, 'utf8'));
    expect(data.schemaVersion).toBe(1);
    expect(data.passedFiles).toBe(1);
    expect(data.failedFiles).toBe(0);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});
