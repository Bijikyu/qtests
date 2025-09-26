import fs from 'fs';
import path from 'path';

describe('package.json bin mappings', () => {
  it('includes qtests-generate alias for generator CLI', () => {
    const pkgPath = path.join(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    expect(pkg.bin).toBeTruthy();
    expect(typeof pkg.bin['qtests-generate']).toBe('string');
    expect(pkg.bin['qtests-generate']).toMatch(/bin\/qtests-ts-generate$/);
  });
});

