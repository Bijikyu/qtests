// Generated qtests runner - TypeScript ES module compatible
import { spawn } from 'child_process';
import path from 'path';

// Run tests with TypeScript support and correct Jest arguments
// Always point Jest at our ESM + ts-jest config and do not fail on empty matches
const args = process.argv.slice(2);
const jestArgs = [
  '--config',
  path.join(process.cwd(), 'config', 'jest.config.mjs'),
  '--passWithNoTests',
  ...args,
];

const testProcess = spawn('jest', jestArgs, {
  stdio: 'inherit',
  shell: true,
});

testProcess.on('exit', (code) => {
  process.exit(code || 0);
});