
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
 */

/**
 * Export stub library registry
 * 
 * All stubs are organized under the stubs namespace to group related
 * mock implementations and prevent naming conflicts with real modules.
 */
module.exports = {
  axios: require('../stubs/axios'),      // HTTP client stub for network-free testing
  winston: require('../stubs/winston')   // Logging library stub for output-free testing
};
