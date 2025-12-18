// scripts/clean-dist.mjs
// Remove compiled test files and __mocks__ from dist/ to prevent duplicate mock warnings.
import { cleanDist } from '../../scripts/sharedUtils.mjs';

cleanDist();
