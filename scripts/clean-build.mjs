// scripts/clean-build.mjs
// Purpose: Ensure `dist/` is clean before `tsc` runs so `npm pack` does not ship stale artifacts.
//          Also removes any stale pre-compiled JS / declaration files that may have accumulated
//          inside TypeScript-only source directories (e.g. lib/security/) or mixed
//          TypeScript+JS directories where a .js file shadows its .ts counterpart (lib/utils/).
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
//    Any .js / .d.ts / .d.ts.map file found here is by definition a stale artifact
//    because these directories contain only .ts source files.
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

// 3. Remove stale compiled artefacts from directories that are TypeScript-only or
//    mixed TypeScript+JS. A .js file is stale only when a .ts file with the same
//    basename also exists — meaning the .js was an old pre-compiled artefact, now
//    superseded by the TS source. Intentional .js-only files (no .ts counterpart)
//    are left untouched.
const mixedDirs = [
  path.join(root, 'lib'),
  path.join(root, 'lib', 'utils'),
];

for (const dir of mixedDirs) {
  let entries;
  try {
    entries = fs.readdirSync(dir);
  } catch {
    continue;
  }
  for (const entry of entries) {
    const isCompiled =
      entry.endsWith('.js') ||
      entry.endsWith('.d.ts') ||
      entry.endsWith('.d.ts.map');
    if (!isCompiled) continue;

    // Derive basename (strip .js / .d.ts / .d.ts.map)
    let base = entry;
    if (base.endsWith('.d.ts.map')) base = base.slice(0, -9);
    else if (base.endsWith('.d.ts')) base = base.slice(0, -5);
    else if (base.endsWith('.js')) base = base.slice(0, -3);

    const tsCounterpart = path.join(dir, base + '.ts');
    if (fs.existsSync(tsCounterpart)) {
      try {
        fs.rmSync(path.join(dir, entry), { force: true });
      } catch {
        // best-effort
      }
    }
  }
}
