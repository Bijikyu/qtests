import fs from 'fs';
import path from 'path';

describe('qtests-generate CLI is Node-native', () => {
  it('uses a node shebang and no tsx', () => {
    const cliPath = path.join(process.cwd(), 'bin', 'qtests-generate.mjs');
    const content = fs.readFileSync(cliPath, 'utf8');
    expect(content.startsWith('#!/usr/bin/env node')).toBe(true);
    expect(content).not.toMatch(/#!\/usr\/bin\/env\s+tsx/);
    expect(content).not.toMatch(/\btsx\b/);
  });
});

