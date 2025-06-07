/**
 * Setup Module for qtests - Module Resolution Hijacking
 * 
 * This module fundamentally alters Node.js's module resolution system to
 * automatically substitute stub modules for real dependencies during testing.
 * It works by manipulating the NODE_PATH environment variable and forcing
 * Node.js to re-initialize its module search paths.
 * 
 * Critical timing requirement:
 * - MUST be required before any modules that need stubbing
 * - If you require('axios') before this setup, you get real axios
 * - If you require('axios') after this setup, you get our stub
 * 
 * How module resolution hijacking works:
 * 1. Node.js searches for modules in a specific order:
 *    - Built-in modules (fs, path, etc.)
 *    - Local files (./myFile.js)
 *    - NODE_PATH directories (what we're manipulating)
 *    - node_modules directories
 * 2. We inject our stubs directory into NODE_PATH
 * 3. Our stubs are found before the real modules in node_modules
 * 4. Calling code gets our stubs transparently
 * 
 * Why this approach over manual imports:
 * - Zero changes required to existing test code
 * - Works with nested dependencies automatically
 * - Applies globally to entire test suite
 * - Simpler than mocking at the require() level
 * 
 * Alternative approaches considered:
 * - Module.prototype.require interception (too complex)
 * - Jest's module mocking (Jest-specific)
 * - Manual stub imports (requires code changes)
 * - Proxyquire/rewire (additional dependencies)
 * 
 * Trade-offs of this approach:
 * - Pro: Zero test code changes needed
 * - Pro: Works with any test runner
 * - Con: Global effect (all requires are affected)
 * - Con: Setup order is critical
 * - Con: May mask real dependency issues
 */

const path = require('path');

// Calculate absolute path to our stubs directory
// Using __dirname ensures this works regardless of where setup.js is called from
// path.join() handles cross-platform path separators correctly
const stubsPath = path.join(__dirname, 'stubs');

// Manipulate NODE_PATH environment variable for module resolution
// NODE_PATH is Node.js's official mechanism for additional module directories
// Format: colon-separated on Unix, semicolon-separated on Windows

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

// Force Node.js to recognize the updated NODE_PATH
// _initPaths() is Node.js internal function that reads NODE_PATH
// Normally NODE_PATH is only read at Node.js startup
// We must call this to apply our changes mid-execution
// This updates Module._nodeModulePaths and other internal state
require('module')._initPaths();

// No exports needed - this module works through side effects
// The act of requiring this file is what activates the stubbing system
// Tests should: require('qtests/setup') then require their modules normally