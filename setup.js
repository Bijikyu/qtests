/**
 * qtests Setup Module - Global Node.js Module Resolution Modification
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
 * Why global module resolution modification is necessary:
 * 1. Application code uses standard require() statements (require('axios'))
 * 2. Tests need different implementations (stub instead of real axios)
 * 3. Changing application code to use different requires breaks production
 * 4. Manual injection is complex and error-prone
 * 5. Automatic substitution enables testing without code changes
 * 
 * Alternative approaches considered:
 * - Dependency injection: Too complex, requires major application changes
 * - Manual stub imports: Error-prone, doesn't test real require paths
 * - Test-specific builds: Complex tooling, maintenance overhead
 * - Proxy objects: Performance impact, incomplete API coverage
 * 
 * Current approach benefits:
 * - Zero application code changes required
 * - Tests verify actual require() paths used in production
 * - Simple setup and configuration
 * - High compatibility with existing codebases
 * - Minimal performance overhead
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
const Module = require('module');

// Import path utilities for robust path manipulation and comparison
// Path operations must be cross-platform compatible and handle edge cases
// like symbolic links, relative paths, and case sensitivity
const path = require('path');
const stubsPath = path.join(__dirname, 'stubs'); // (single absolute path for stub modules after duplicate removal)

// path to stubs directory resolved above //(single comment after removal)

/**
 * Module stub registry - defines which modules should be replaced with stubs
 * 
 * This object maps real module names to their stub implementation paths.
 * When Node.js attempts to resolve a module listed in this registry,
 * the stub path will be returned instead of the real module path.
 * 
 * Registry design rationale:
 * - Explicit mapping provides clear control over which modules are stubbed
 * - Relative paths ensure stubs are loaded from qtests directory structure
 * - Simple object structure is easy to understand and modify
 * - No regex or pattern matching reduces complexity and potential errors
 * 
 * Path resolution strategy:
 * - Stub paths are relative to this setup.js file location
 * - This ensures stubs are found regardless of where qtests is installed
 * - Relative paths prevent absolute path brittleness across environments
 * - Path normalization handles cross-platform differences automatically
 * 
 * Module selection criteria:
 * - axios: Most common HTTP client library, frequently needs stubbing
 * - winston: Popular logging library, often needs silencing in tests
 * - Easy to extend with additional modules as needed
 * 
 * Why not automatic discovery:
 * - Explicit registry prevents accidental stubbing of unexpected modules
 * - Clear intention - developers can see exactly what gets stubbed
 * - No file system scanning overhead during module resolution
 * - Prevents security issues from auto-discovering and loading arbitrary stubs
 */
const STUB_REGISTRY = {
  axios: 'axios.js', // HTTP client library stub file name for quick lookup
  winston: 'winston.js' // logging library stub file name for quick lookup
}; //(close registry mapping)
// (registry end for stub mappings)

  // Additional stubs can be added here following the same pattern:
  // 'module-name': './stubs/module-name'


// Preserve existing NODE_PATH if it exists
// Some environments or tools may have already set NODE_PATH
const currentNodePath = process.env.NODE_PATH || '';

// Determine correct path separator for current platform
// Windows uses semicolons, Unix-like systems use colons
const separator = process.platform === 'win32' ? ';' : ':';

// Prepend our stubs directory to NODE_PATH
// Prepending (not appending) ensures our stubs take precedence
// Only add separator if there's existing NODE_PATH content
process.env.NODE_PATH = stubsPath + (currentNodePath ? separator + currentNodePath : '');

// Force Node.js to recognize the updated NODE_PATH for dynamic module resolution
// _initPaths() is Node.js internal function that reads NODE_PATH and updates module search paths
// Normally NODE_PATH is only read at Node.js startup, but we need to apply changes mid-execution
// This updates Module._nodeModulePaths and other internal resolution state to include our stubs directory
require('module')._initPaths();

// Store original Module._load function for delegation to maintain normal module loading behavior
// _load is the core module loading function that handles actual file reading and module instantiation
// We preserve this to ensure non-stubbed modules load exactly as they would without qtests
const origLoad = Module._load;

// STUB_REGISTRY lookup used below for quick stub resolution on every require

// Override Node.js Module._load to intercept and redirect specific module loads
// _load is chosen over _resolveFilename because it handles the complete loading process
// Function signature must match Node.js internal API exactly for compatibility
Module._load = function(request, parent, isMain){
  // Look up stub file via shared registry to avoid duplicate maps
  const stubFile = STUB_REGISTRY[request]; // single source of truth for stubs

  if(stubFile){
    // Build absolute stub path and delegate load to Node's original loader
    return origLoad(path.join(stubsPath, stubFile), parent, isMain); // ensure cross platform path resolution
  }
  
  // Delegate to original loader for all non-stubbed modules
  // This ensures qtests doesn't interfere with normal Node.js module resolution
  // Maintains full compatibility with existing codebases and module ecosystem
  return origLoad(request, parent, isMain);
};

/**
 * Store reference to original Node.js module resolution function
 * 
 * We save the original _resolveFilename method before modifying it so that:
 * 1. We can call the original implementation for non-stubbed modules
 * 2. We can restore original behavior if needed (though qtests doesn't currently do this)
 * 3. We maintain proper Node.js resolution semantics for all other modules
 * 4. Our modification is transparent and doesn't break existing functionality
 * 
 * Why save before modification:
 * - Once we replace Module._resolveFilename, the original is lost
 * - We need the original to handle normal module resolution
 * - This pattern ensures we enhance rather than replace Node.js functionality
 * - Follows standard monkey-patching best practices
 */
const originalResolveFilename = Module._resolveFilename;

/**
 * Enhanced module resolution function with automatic stub substitution
 * 
 * This function replaces Node.js's Module._resolveFilename to intercept
 * module resolution and redirect specific modules to stub implementations.
 * For modules not in the stub registry, it delegates to the original
 * Node.js resolution function to maintain normal behavior.
 * 
 * Function signature matches Node.js Module._resolveFilename exactly:
 * - request: The module name being resolved (e.g., 'axios')
 * - parent: The module object that initiated the require call
 * - isMain: Boolean indicating if this is the main module
 * - options: Additional resolution options (Node.js internal)
 * 
 * Resolution algorithm:
 * 1. Check if requested module is in stub registry
 * 2. If yes, resolve stub path relative to this file and return it
 * 3. If no, delegate to original Node.js resolution function
 * 4. Handle any resolution errors gracefully
 * 
 * Why intercept at _resolveFilename level:
 * - This is the lowest level where module names are converted to paths
 * - Intercepting here catches all require() calls, including transitive ones
 * - We can modify path resolution without affecting other module loading steps
 * - This approach is used by other popular Node.js testing tools
 * 
 * Error handling strategy:
 * - Always delegate to original function for non-stub modules
 * - Let Node.js handle all error cases for non-stub modules
 * - Only handle stub-specific errors (missing stub files, etc.)
 * - Maintain full compatibility with Node.js error reporting
 * 
 * @param {string} request - Module name being resolved
 * @param {Object} parent - Parent module object that initiated the require
 * @param {boolean} isMain - Whether this is the main module
 * @param {Object} options - Additional Node.js resolution options
 * @returns {string} Resolved file path (either stub or original module)
 */
Module._resolveFilename = function(request, parent, isMain, options) {
  // Check if the requested module is in our stub registry
  // This is the key decision point - stub or delegate to original resolution
  if (STUB_REGISTRY.hasOwnProperty(request)) {
    // Module is in stub registry - resolve stub path

    // Get stub file name from registry and resolve using stubsPath directory
    const stubFile = STUB_REGISTRY[request];
    const resolvedStubPath = path.resolve(stubsPath, stubFile); // compute absolute stub path

    // Return the resolved stub path
    // Node.js will load this file instead of the real module
    return resolvedStubPath;
  }

  // Module is not in stub registry - use original Node.js resolution
  // This maintains normal Node.js behavior for all other modules
  // The original function handles all the complex resolution logic
  // including node_modules searching, file extension resolution, etc.
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

// Note: This module performs setup through side effects when required
// There is no explicit function to call - simply requiring this module
// activates the stub resolution behavior
// 
// This approach was chosen because:
// 1. Setup must happen before any modules are required
// 2. Side-effect-on-require is a common Node.js pattern for setup modules
// 3. It prevents timing issues where setup might be called too late
// 4. The behavior is predictable and follows Node.js conventions
//
// Usage pattern:
// require('qtests/setup'); // Must be first line in test files
// const myModule = require('./myModule'); // May use stubbed dependencies