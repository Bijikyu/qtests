/**
 * Setup and Initialization Utilities - TypeScript ES Module Implementation
 * 
 * This module provides setup functionality for the qtests framework.
 * The setup function modifies global Node.js behavior to enable automatic
 * stub resolution, which is essential for seamless testing.
 * 
 * Design philosophy:
 * - Explicit setup to avoid unintended side effects
 * - Clear separation of setup from other utilities
 * - Comprehensive error handling and logging
 * - Safe to call multiple times
 * 
 * Why explicit setup is necessary:
 * 1. Modifying Node.js module resolution is a global side effect
 * 2. Users should explicitly opt-in to this behavior modification
 * 3. Setup timing is critical - must happen before module requires
 * 4. Clear separation makes it obvious when global behavior is being changed
 * 
 * Alternative approaches considered:
 * - Automatic setup on require: Rejected due to hidden side effects
 * - Setup in individual utilities: Rejected due to timing complexity
 * - Multiple setup functions: Rejected for simplicity
 * 
 * Current approach benefits:
 * - Clear, explicit user intent required
 * - Single point of global behavior modification
 * - Easy to understand and debug
 * - Follows principle of least surprise
 */

// Note: qerrors is imported dynamically in setup() to avoid loading winston before mocks are installed

/**
 * Initialize qtests framework with automatic stub resolution
 * 
 * This function modifies Node.js module resolution to automatically
 * substitute stub implementations for real modules during testing.
 * 
 * Implementation rationale:
 * 1. Function wrapper provides explicit call syntax for users
 * 2. Lazy loading of setup module prevents accidental side effects
 * 3. Error handling ensures setup failures are clearly reported
 * 4. Logging provides visibility into setup process for debugging
 * 
 * Why a function wrapper instead of direct require:
 * - Makes setup intention explicit in user code
 * - Allows error handling and logging at the API level
 * - Provides a clear point for future enhancement (parameters, options)
 * - Follows common Node.js patterns for initialization functions
 * 
 * Critical timing requirement:
 * This function MUST be called before requiring any modules that need stubbing.
 * If axios or winston are required before setup(), they will be the real modules.
 */
async function setup(): Promise<void> {
  console.log(`setup is running with none`); // logging function start per requirements
  
  try {
    // Import mock system directly to avoid circular import
    // Root setup.js performs side effects on import, but that would create circular dependency
    const { mockRegistry, installMocking, registerDefaultMocks } = await import('./mockSystem.js');
    const { qtestsSilent } = await import('../config/localVars.js');
    
    // Perform the same setup as root setup.js
    registerDefaultMocks();
    await installMocking();
    
    // Honor CI silence toggle to reduce noise
    const shouldLog = !((qtestsSilent || 'false') === '1' || (qtestsSilent || 'false') === 'true');
    if (shouldLog) {
      console.log('qtests: Global module resolution patching activated');
      try {
        console.log(`qtests: Stub registry contains: ${mockRegistry.list().join(', ')}`);
      } catch (logError) {
        console.log('qtests: Stub registry listing failed, but setup continuing');
      }
    }
    
    console.log(`setup has run resulting in module resolution modification`); // logging completion per requirements
  } catch (error: any) {
    // Import qerrors dynamically to avoid loading it before mocks are installed
    try {
      const qerrors = (await import('qerrors')).default;
      qerrors(error, 'setup.ts: module resolution setup failed', { 
        setupModule: 'direct mockSystem import',
        errorMessage: error.message,
        errorType: error.constructor.name,
        nodeVersion: process.version,
        platform: process.platform,
        cwd: process.cwd(),
        timestamp: new Date().toISOString()
      });
    } catch {
      // qerrors import failed, just log the error
    }
    console.log(`setup error: ${error.message}`); // error logging per requirements
    throw error;
  }
}

// export setup utilities using ES module syntax
export {
  setup // call this to activate stubs when desired
};