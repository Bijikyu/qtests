// scripts/clean-dist.mjs
// Remove compiled test files and __mocks__ from dist/ to prevent duplicate mock warnings.
import { cleanDist } from './sharedUtils.mjs';
let qerrors;
try {
  const mod = await import('qerrors');
  qerrors = mod.default || mod;
} catch {
  qerrors = (error, message, context) => {
    console.error('[QERRORS]', JSON.stringify({ message: message || error.message, context: context || {} }));
  };
}

try {
  cleanDist();
} catch (error) {
  qerrors(error, 'clean-dist: failed to clean distribution directory', { 
    cwd: process.cwd()
  });
  process.exit(1);
}
