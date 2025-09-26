import fs from 'fs';
import path from 'path';
import { TestGenerator } from '../../lib/testGenerator.ts';

// Sanity test: when template file is missing in primary location, generator
// still attempts bin-based fallback and does not throw. We do not assert the
// actual content source, only that a file is created with the expected header.
describe('generator runner fallback', () => {
  const cwd = process.cwd();
  const mjsPath = path.join(cwd, 'qtests-runner.mjs');

  beforeEach(() => { try { fs.rmSync(mjsPath); } catch {} });
  afterAll(() => { try { fs.rmSync(mjsPath); } catch {} });

  it('creates qtests-runner.mjs with header', async () => {
    const gen = new TestGenerator({});
    gen.generateQtestsRunner();
    expect(fs.existsSync(mjsPath)).toBe(true);
    const content = fs.readFileSync(mjsPath, 'utf8');
    expect(content).toContain('GENERATED RUNNER: qtests-runner.mjs');
  });
});

