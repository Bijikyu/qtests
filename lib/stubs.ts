
/**
 * Stub Library Registry
 * 
 * This module provides a centralized registry of all available stubs
 * in the qtests framework. Stubs are organized under a namespace to
 * prevent naming conflicts and make it clear these are replacement modules.
 * 
 * Design philosophy:
 * - Centralized registry for easy discovery
 * - Namespace organization to prevent conflicts
 * - Clear separation between real and stub modules
 * - Easy to extend with new stubs
 * 
 * Why a centralized registry is important:
 * 1. Provides single source of truth for all available stubs
 * 2. Makes it easy for developers to discover what stubs are available
 * 3. Prevents naming conflicts with real modules in user code
 * 4. Enables consistent patterns for adding new stubs
 * 5. Groups related functionality for better organization
 * 
 * Alternative approaches considered:
 * - Individual stub exports at top level: Rejected due to namespace pollution
 * - Automatic stub discovery: Rejected due to complexity and unpredictability
 * - Category-based organization: Current approach is simpler for small stub count
 * 
 * Registry pattern benefits:
 * - Clear separation of concerns (registry vs individual stubs)
 * - Easy to understand what stubs are available
 * - Consistent access patterns for all stubs
 * - Simple to extend with new stub categories
 */

/**
 * Export stub library registry
 * 
 * All stubs are organized under the stubs namespace to:
 * 1. Group related mock implementations together
 * 2. Prevent naming conflicts with real modules in user code
 * 3. Make it clear these are replacement/mock implementations
 * 4. Provide consistent access patterns: stubs.axios, stubs.winston
 * 
 * Namespace design rationale:
 * - Using property names that match the real module names for intuitive access
 * - Each property points to a complete stub module that can replace the real one
 * - Stub modules provide the same API surface as their real counterparts
 * - Registry acts as a discovery mechanism and access point
 * 
 * Extension pattern:
 * To add new stubs, simply add them to this registry:
 * - Create the stub module in ../stubs/[module-name]
 * - Add the require statement and property to this exports object
 * - The stub becomes available as stubs.[module-name]
 */
// Import stub modules
// Use require() for CommonJS modules (.cjs) for compatibility in ESM-type packages
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create require function for importing CJS modules
const require = createRequire(import.meta.url);

// Load stubs using require (they are CommonJS modules)
const axios = require('../stubs/axios.cjs').default;
const winston = require('../stubs/winston.cjs').default;

// Export stub library registry using ES module syntax
const stubs = {
  axios, // http client library stub
  winston // logging library stub
};

export default stubs;
