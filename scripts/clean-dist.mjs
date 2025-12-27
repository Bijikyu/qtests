// scripts/clean-dist.mjs
// Remove compiled test files and __mocks__ from dist/ to prevent duplicate mock warnings.
import { cleanDist } from './sharedUtils.mjs';
import qerrors from 'qerrors';

try {
  cleanDist();
} catch (error) {
  qerrors(error, 'clean-dist: failed to clean distribution directory', { 
    cwd: process.cwd()
  });
  process.exit(1);
}
