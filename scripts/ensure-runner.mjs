// Ensures qtests-runner.mjs exists at project root by copying a valid shipped template.
import { ensureRunner } from './sharedUtils.mjs';
import qerrors from '../dist/lib/qerrorsFallback.js';

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
