import { discoverTestFiles, getDefaultTestPatterns } from './lib/runner/loader.js';

console.log('Current directory:', process.cwd());
console.log('Default patterns:', getDefaultTestPatterns());

const testFiles = discoverTestFiles({
  cwd: process.cwd(),
  patterns: getDefaultTestPatterns(),
  ignore: ['**/node_modules/**']
});

console.log('Discovered files:', testFiles);