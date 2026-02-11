// Ensures qtests-runner.mjs exists at project root by copying a valid shipped template.
import { ensureRunner } from './sharedUtils.mjs';
let qerrors;
try {
  const mod = await import('../dist/lib/qerrorsFallback.js');
  qerrors = mod.default || mod;
} catch {
  try {
    const mod = await import('@bijikyu/qerrors');
    qerrors = mod.default || mod;
  } catch {
    qerrors = (error, message, context) => {
      console.error('[QERRORS]', JSON.stringify({ message: message || error.message, context: context || {} }));
    };
  }
}

try {
  ensureRunner();
} catch (error) {
  qerrors(error, 'ensure-runner: failed to ensure runner file', { 
    cwd: process.cwd(),
    errorCode: error.code,
    errno: error.errno,
    syscall: error.syscall,
    errorMessage: error.message
  });
  process.exit(1);
}
