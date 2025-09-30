// Remove stale DEBUG_TESTS.md before a new test run to avoid confusion.
import fs from 'fs';
import path from 'path';
try {
  const p = path.join(process.cwd(), 'DEBUG_TESTS.md');
  if (fs.existsSync(p)) fs.rmSync(p, { force: true });
} catch {}

