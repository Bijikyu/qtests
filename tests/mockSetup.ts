/**
 * Early Mock Setup for Jest
 * 
 * This file runs before any test modules are loaded (via setupFiles).
 * It installs mock hooks to intercept module loading and provide stubs
 * for modules like winston that would otherwise cause issues during tests.
 */

import { registerDefaultMocks, installMocking } from '../lib/mockSystem';

registerDefaultMocks();
installMocking();
