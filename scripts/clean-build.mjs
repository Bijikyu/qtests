// scripts/clean-build.mjs
// Purpose: Ensure `dist/` is clean before `tsc` runs so `npm pack` does not ship stale artifacts.
// Design: Cross-platform (no `rm -rf`), quiet, and safe (only deletes this package's `dist/`).
import fs from 'fs';
import path from 'path';

const distPath = path.join(process.cwd(), 'dist');

try {
  fs.rmSync(distPath, { recursive: true, force: true });
} catch {
  // Best-effort: if the directory can't be removed, let `tsc` surface the real error.
}

