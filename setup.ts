/**
 * qtests Setup Module - Global Node.js Module Resolution Modification - TypeScript Implementation
 * 
 * This module modifies Node.js's global module resolution behavior to automatically
 * substitute stub implementations for real modules during testing. It's a critical
 * piece of the qtests framework that enables seamless testing without changing
 * application code.
 * 
 * Core functionality:
 * When this module is required, it patches Node.js's Module._resolveFilename method
 * to intercept require() calls and redirect them to stub implementations when
 * appropriate. This allows test code to use the same require() statements as
 * production code while getting test-appropriate implementations.
 * 
 * Design philosophy:
 * - Transparent operation: Application code doesn't need to change
 * - Automatic stub resolution: No manual require() path changes needed
 * - Safe operation: Only affects specific modules, others work normally
 * - Performance conscious: Minimal overhead on module resolution
 * 
 * Security and safety considerations:
 * - Only affects modules in the predefined stub registry
 * - Original Node.js behavior preserved for unlisted modules
 * - Changes are temporary and isolated to test execution
 * - No permanent modifications to Node.js installation
 * - Easy to disable by not requiring this module
 */

// Import Node.js Module constructor for accessing module resolution internals
// This gives us access to the private _resolveFilename method that controls
// how Node.js resolves module names to file paths
import { mockRegistry, installMocking, registerDefaultMocks } from './lib/mockSystem.js';

// Install clean, registry-based mocking for module ids
registerDefaultMocks();
installMocking();

// Honor CI silence toggle to reduce noise
const QTESTS_SILENT = String(process.env.QTESTS_SILENT || '').toLowerCase();
const shouldLog = !(QTESTS_SILENT === '1' || QTESTS_SILENT === 'true');
if (shouldLog) {
  console.log('qtests: Global module resolution patching activated');
  console.log(`qtests: Stub registry contains: ${mockRegistry.list().join(', ')}`);
}

// Export setup completion indicator
export const setupComplete = true;
