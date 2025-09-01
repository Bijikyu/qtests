// Generated qtests runner - TypeScript ES module compatible
import { spawn } from 'child_process';
import path from 'path';

// Run tests with TypeScript support and correct Jest arguments
const args = process.argv.slice(2);
const testProcess = spawn('jest', args, {
  stdio: 'inherit',
  shell: true
});

testProcess.on('exit', (code) => {
  process.exit(code || 0);
});