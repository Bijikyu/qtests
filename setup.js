/**
 * qtests Setup - Node.js Module Resolution Modifier
 * 
 * This module modifies Node.js's module resolution behavior to automatically
 * redirect common dependencies to our test stubs. This allows existing code
 * to work unchanged in test environments while using harmless stub implementations.
 * 
 * Technical approach:
 * - Modifies NODE_PATH environment variable to include our stubs directory
 * - Calls Module._initPaths() to reload Node's module resolution paths
 * - This makes Node.js check our stubs directory before node_modules
 * 
 * Design rationale:
 * - Automatic stubbing reduces test setup boilerplate
 * - No code changes required in modules under test
 * - Stubs are only active when this setup is explicitly required
 * - Uses Node.js's built-in module resolution rather than monkey-patching require()
 * 
 * Why this approach over alternatives:
 * - More reliable than hooking require() function
 * - Doesn't interfere with existing mocking libraries
 * - Works with any module loading pattern (require, import, dynamic imports)
 * - Easily reversible by not including this setup
 */

const path = require('path');

// Add our stubs directory to Node's module search path
// This makes Node.js look in qtests/stubs before node_modules when resolving modules
// Using path.join ensures cross-platform compatibility for directory separators
process.env.NODE_PATH = path.join(__dirname, 'stubs');

// Force Node.js to reload its module resolution paths with our new NODE_PATH
// _initPaths() is a private method but stable across Node.js versions
// This is the official way to update module paths after changing NODE_PATH
require('module').Module._initPaths();

/**
 * After this setup runs:
 * - require('axios') will resolve to ./stubs/axios.js instead of node_modules/axios
 * - require('winston') will resolve to ./stubs/winston.js instead of node_modules/winston
 * - Other modules continue to resolve normally from node_modules
 * 
 * This allows test code to use the same require() statements as production code
 * while automatically getting harmless stub implementations.
 */