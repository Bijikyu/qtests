// Ensures qtests-runner.mjs exists at project root by copying a valid shipped template.
import { ensureRunner } from './sharedUtils.mjs';
import qerrors from 'qerrors';

try {
  ensureRunner();
} catch (error) {
  qerrors(error, 'ensure-runner: failed to ensure runner file', { 
    cwd: process.cwd()
  });
  process.exit(1);
}
