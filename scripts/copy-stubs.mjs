// scripts/copy-stubs.mjs
// Purpose: Ensure CommonJS stub files exist in dist/ so ESM entrypoints can `createRequire()` them
// and the CommonJS require hook can return API-compatible stubs.
// Design: Cross-platform, deterministic, and only touches this package's build output.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..');
const distStubsDir = path.join(repoRoot, 'dist', 'stubs');
const srcStubsDir = path.join(repoRoot, 'stubs');

const CJS_STUBS = ['axios.cjs', 'winston.cjs'];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyIfPresent(srcPath, destPath) {
  if (!fs.existsSync(srcPath)) {
    throw new Error(`Missing required stub file: ${srcPath}`);
  }
  fs.copyFileSync(srcPath, destPath);
}

try {
  ensureDir(distStubsDir);
  for (const fileName of CJS_STUBS) {
    copyIfPresent(path.join(srcStubsDir, fileName), path.join(distStubsDir, fileName));
  }
} catch (error) {
  // Fail the build so we never publish a broken package entrypoint.
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`qtests build error: failed to copy CommonJS stubs into dist/: ${message}\n`);
  process.exit(1);
}

