import { TestGenerator } from '../lib/testGenerator.js';
import fs from 'fs';
import path from 'path';

describe('qtests runner scaffolding', () => {
  it('ensures qtests-runner.mjs is generated when missing', async () => {
    const mjsPath = path.join(process.cwd(), 'qtests-runner.mjs');
    try { fs.rmSync(mjsPath); } catch {}
    const gen = new TestGenerator({});
    gen.generateQtestsRunner();
    expect(fs.existsSync(mjsPath)).toBe(true);
    const contents = fs.readFileSync(mjsPath, 'utf8');
    expect(contents).toContain('GENERATED RUNNER: qtests-runner.mjs');
  });
});
