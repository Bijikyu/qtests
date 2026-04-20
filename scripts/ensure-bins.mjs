import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const binDir = path.join(root, 'node_modules', '.bin');

const BINS = {
  'qtests-generate':    '../../bin/qtests-generate.mjs',
  'qtests-ts-generate': '../../bin/qtests-generate.mjs',
  'qtests-ts-runner':   '../../bin/qtests-ts-runner',
};

try {
  fs.mkdirSync(binDir, { recursive: true });
  for (const [name, target] of Object.entries(BINS)) {
    const link = path.join(binDir, name);
    try { fs.unlinkSync(link); } catch {}
    fs.symlinkSync(target, link);
  }
} catch (err) {
  process.stderr.write('ensure-bins: ' + (err.message || String(err)) + '\n');
}
