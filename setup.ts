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
import Module from 'module';
import path from 'path';
import { getModuleDirname } from './utils/esm-globals.js';

// Get current directory for ES modules - lazy initialization for Jest compatibility
let moduleDirname: string | undefined;
function getModuleDirnameForSetup(): string {
  if (moduleDirname === undefined) {
    try {
      // Use eval to hide import.meta from Jest's static parser
      const importMetaUrl = (0, eval)('import.meta.url');
      moduleDirname = getModuleDirname(importMetaUrl);
    } catch (error) {
      // Fallback for Jest environment
      moduleDirname = process.cwd();
    }
  }
  return moduleDirname;
}

const stubsPath = path.join(getModuleDirnameForSetup(), 'stubs');

/**
 * Module stub registry - defines which modules should be replaced with stubs
 * 
 * This object maps real module names to their stub implementation paths.
 * When Node.js attempts to resolve a module listed in this registry,
 * the stub path will be returned instead of the real module path.
 */
interface StubRegistry {
  [moduleName: string]: string;
}

const STUB_REGISTRY: StubRegistry = {
  axios: 'axios.js', // HTTP client library stub file name for quick lookup
  winston: 'winston.js' // logging library stub file name for quick lookup
};

// Preserve existing NODE_PATH if it exists
const currentNodePath = process.env.NODE_PATH || '';

// Determine correct path separator for current platform
const separator = process.platform === 'win32' ? ';' : ':';

// Prepend our stubs directory to NODE_PATH
process.env.NODE_PATH = stubsPath + (currentNodePath ? separator + currentNodePath : '');

// Force Node.js to recognize the updated NODE_PATH for dynamic module resolution
(Module as any)._initPaths();

// Store original Module._load function for delegation to maintain normal module loading behavior
const origLoad = (Module as any)._load;

/**
 * Enhanced Module._load replacement that handles stub substitution
 * 
 * This function intercepts all module loading requests and redirects known
 * modules to their stub implementations when appropriate.
 */
(Module as any)._load = function(id: string, parent: any, isMain?: boolean): any {
  // Check if this module should be stubbed
  if (STUB_REGISTRY[id]) {
    const stubPath = path.join(stubsPath, STUB_REGISTRY[id]);
    try {
      // Load the stub module instead of the real one
      return origLoad.call(this, stubPath, parent, isMain);
    } catch (error) {
      console.log(`qtests: Failed to load stub for ${id} from ${stubPath}, falling back to original`);
      // Fall back to original module if stub loading fails
      return origLoad.call(this, id, parent, isMain);
    }
  }
  
  // For non-stubbed modules, use original behavior
  return origLoad.call(this, id, parent, isMain);
};

console.log('qtests: Global module resolution patching activated');
console.log(`qtests: Stub registry contains: ${Object.keys(STUB_REGISTRY).join(', ')}`);
console.log(`qtests: Stubs directory: ${stubsPath}`);

// Export setup completion indicator
export const setupComplete = true;