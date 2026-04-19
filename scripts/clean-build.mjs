// scripts/clean-build.mjs
// Purpose: Ensure `dist/` is clean before `tsc` runs so `npm pack` does not ship stale artifacts.
//          Also removes any stale pre-compiled JS / declaration files that may have accumulated
//          inside TypeScript-only source directories (e.g. lib/security/).
// Design: Cross-platform (no `rm -rf`), quiet, and safe (only deletes this package's `dist/`
//         and explicitly enumerated source-dir artifacts).
import fs from 'fs';
import path from 'path';

const root = process.cwd();

// 1. Wipe dist/ so tsc starts from a clean slate.
const distPath = path.join(root, 'dist');
try {
  fs.rmSync(distPath, { recursive: true, force: true });
} catch {
  // Best-effort: if the directory can't be removed, let `tsc` surface the real error.
}

// 2. Remove stale compiled artefacts from TypeScript-only source directories.
//    These accumulate when old tsc invocations used a different outDir, or when
//    pre-compiled files were committed before the TypeScript pipeline was set up.
//    Only .js and .d.ts / .d.ts.map files are removed; .ts source files are untouched.
const sourceOnlyDirs = [
  path.join(root, 'lib', 'security'),
];

for (const dir of sourceOnlyDirs) {
  let entries;
  try {
    entries = fs.readdirSync(dir);
  } catch {
    continue; // directory doesn't exist — nothing to clean
  }
  for (const entry of entries) {
    const isStale =
      entry.endsWith('.js') ||
      entry.endsWith('.d.ts') ||
      entry.endsWith('.d.ts.map');
    if (isStale) {
      try {
        fs.rmSync(path.join(dir, entry), { force: true });
      } catch {
        // best-effort
      }
    }
  }
}
