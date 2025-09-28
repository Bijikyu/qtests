import fs from 'fs';
import path from 'path';

// Ensures both templates contain the API-only invariants so regeneration can't regress
describe('runner templates invariants', () => {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, 'lib', 'templates', 'qtests-runner.mjs.template'),
    path.join(cwd, 'templates', 'qtests-runner.mjs.template')
  ];

  it('templates include runAllViaAPI, runCLI, and API Mode banner', () => {
    const found: string[] = [];
    for (const p of candidates) {
      if (!fs.existsSync(p)) continue;
      const content = fs.readFileSync(p, 'utf8');
      expect(content).toMatch(/runAllViaAPI\s*\(/);
      expect(content).toMatch(/runCLI/);
      expect(content).toMatch(/API Mode/);
      found.push(p);
    }
    expect(found.length).toBeGreaterThan(0);
  });
});

