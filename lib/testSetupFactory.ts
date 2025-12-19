/**
 * Shared Test Setup Utilities
 * Eliminates duplication across Jest setup files
 * Provides standardized test environment configuration
 */

import { jest as jestFromGlobals } from '@jest/globals';

// ==================== SETUP INTERFACES ====================

/**
 * Options for test setup configuration
 */
export interface TestSetupOptions {
  /** Set test environment variable */
  setTestEnvironment?: boolean;
  /** Configure jest global reference */
  configureJestGlobal?: boolean;
  /** Provide CommonJS require polyfill for ESM tests */
  provideRequirePolyfill?: boolean;
  /** Set default jest timeout */
  setJestTimeout?: number;
  /** Configure mock cleanup */
  configureMockCleanup?: boolean;
  /** Additional setup functions to run */
  additionalSetup?: (() => void)[];
  /** React-specific polyfills */
  reactPolyfills?: boolean;
}

/**
 * Test setup context for tracking setup state
 */
interface TestSetupContext {
  jestGlobalConfigured: boolean;
  requirePolyfillProvided: boolean;
  testEnvironmentSet: boolean;
  mockCleanupConfigured: boolean;
}

// ==================== GLOBAL SETUP STATE ====================

/**
 * Track setup state to avoid duplicate configuration
 */
const setupState: TestSetupContext = {
  jestGlobalConfigured: false,
  requirePolyfillProvided: false,
  testEnvironmentSet: false,
  mockCleanupConfigured: false
};

// ==================== CORE SETUP FUNCTIONS ====================

/**
 * Set test environment variable if not already set
 */
function setTestEnvironment(): void {
  if (!setupState.testEnvironmentSet) {
    // Set test environment using localVars pattern
    process.env.NODE_ENV = 'test';
    setupState.testEnvironmentSet = true;
  }
}

/**
 * Configure jest global reference safely
 */
function configureJestGlobal(): void {
  if (!setupState.jestGlobalConfigured) {
    // Resolve jest reference safely and expose globally for tests using jest.*
    const J = (typeof jestFromGlobals !== 'undefined' && jestFromGlobals)
      ? jestFromGlobals
      : (globalThis as any).jest;
    
    if (!(globalThis as any).jest && J) {
      (globalThis as any).jest = J as any;
    }
    
    setupState.jestGlobalConfigured = true;
  }
}

/**
 * Provide CommonJS-like require for ESM tests
 */
function provideRequirePolyfill(): void {
  if (!setupState.requirePolyfillProvided) {
    try {
      if (!(globalThis as any).require && typeof require === 'function') {
        (globalThis as any).require = require as any;
      }
    } catch {
      // Ignore errors in environments where require is not available
    }
    
    setupState.requirePolyfillProvided = true;
  }
}

/**
 * Configure default jest timeout
 */
function configureJestTimeout(timeout: number = 10000): void {
  const j = (globalThis as any).jest || jestFromGlobals;
  if (j && typeof j.setTimeout === 'function') {
    j.setTimeout(timeout);
  }
}

/**
 * Configure mock cleanup after each test
 */
function configureMockCleanup(_shouldConfigure: boolean = true): void {
  if (!setupState.mockCleanupConfigured) {
    const j = (globalThis as any).jest || jestFromGlobals;
    if (j && typeof j.clearAllMocks === 'function') {
      // This will be called in afterEach
      setupState.mockCleanupConfigured = true;
    }
  }
}

/**
 * React-specific polyfills for testing
 */
function setupReactPolyfills(): void {
  // Add React-specific setup if needed
  // For example: matchMedia polyfill, etc.
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
      }),
    });
  }
}

// ==================== MAIN SETUP FUNCTION ====================

/**
 * Create comprehensive Jest setup with all standard configurations
 * 
 * @param options - Setup configuration options
 */
export function createJestSetup(options: TestSetupOptions = {}): void {
  const {
    setTestEnvironment: shouldSetTestEnv = true,
    configureJestGlobal: shouldConfigureJest = true,
    provideRequirePolyfill: shouldProvideRequire = true,
    setJestTimeout: timeout = 10000,
    configureMockCleanup: shouldConfigureCleanup = true,
    additionalSetup = [],
    reactPolyfills = false
  } = options;

  try {
    // Set test environment early
    if (shouldSetTestEnv) {
      setTestEnvironment();
    }

    // Configure jest global reference
    if (shouldConfigureJest) {
      configureJestGlobal();
    }

    // Provide CommonJS require polyfill for ESM tests
    if (shouldProvideRequire) {
      provideRequirePolyfill();
    }

    // Configure beforeAll hook
    beforeAll(() => {
      if (timeout > 0) {
        configureJestTimeout(timeout);
      }

      // Run additional setup functions
      additionalSetup.forEach(setupFn => {
        if (typeof setupFn === 'function') {
          setupFn();
        }
      });
    });

    // Configure afterEach hook for mock cleanup
    if (shouldConfigureCleanup) {
      configureMockCleanup(shouldConfigureCleanup);
      afterEach(() => {
        const j = (globalThis as any).jest || jestFromGlobals;
        if (j && typeof j.clearAllMocks === 'function') {
          j.clearAllMocks();
        }
      });
    }

    // Setup React polyfills if needed
    if (reactPolyfills) {
      setupReactPolyfills();
    }

  } catch (error: any) {
    console.error(`Jest setup error: ${error.message}`);
    throw error;
  }
}

// ==================== SPECIALIZED SETUP FUNCTIONS ====================

/**
 * Create minimal Jest setup for basic testing
 */
export function createMinimalJestSetup(): void {
  createJestSetup({
    setJestTimeout: 5000,
    configureMockCleanup: false,
    additionalSetup: []
  });
}

/**
 * Create Jest setup for TypeScript ESM projects
 */
export function createTypeScriptESMSetup(): void {
  createJestSetup({
    setTestEnvironment: true,
    configureJestGlobal: true,
    provideRequirePolyfill: true,
    setJestTimeout: 10000,
    configureMockCleanup: true,
    additionalSetup: [
      () => {
        // TypeScript ESM specific setup
        if (typeof globalThis !== 'undefined') {
          (globalThis as any).__TS_ESM_SETUP__ = true;
        }
      }
    ]
  });
}

/**
 * Create Jest setup for React projects
 */
export function createReactJestSetup(): void {
  createJestSetup({
    setTestEnvironment: true,
    configureJestGlobal: true,
    provideRequirePolyfill: true,
    setJestTimeout: 10000,
    configureMockCleanup: true,
    reactPolyfills: true,
    additionalSetup: [
      () => {
        // React-specific setup
        if (typeof window !== 'undefined') {
          (window as any).__REACT_SETUP__ = true;
        }
      }
    ]
  });
}

/**
 * Create Jest setup for demo projects
 */
export function createDemoJestSetup(): void {
  createJestSetup({
    setTestEnvironment: true,
    configureJestGlobal: true,
    provideRequirePolyfill: true,
    setJestTimeout: 10000,
    configureMockCleanup: true,
    additionalSetup: [
      () => {
        // Demo-specific setup
        if (typeof globalThis !== 'undefined') {
          (globalThis as any).__DEMO_SETUP__ = true;
        }
      }
    ]
  });
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Reset setup state (useful for testing)
 */
export function resetSetupState(): void {
  setupState.jestGlobalConfigured = false;
  setupState.requirePolyfillProvided = false;
  setupState.testEnvironmentSet = false;
  setupState.mockCleanupConfigured = false;
}

/**
 * Get current setup state (useful for debugging)
 */
export function getSetupState(): TestSetupContext {
  return { ...setupState };
}

/**
 * Check if setup is complete
 */
export function isSetupComplete(): boolean {
  return (
    setupState.testEnvironmentSet &&
    setupState.jestGlobalConfigured &&
    setupState.requirePolyfillProvided
  );
}

// ==================== EXPORTS ====================

/**
 * Test setup factory interface
 */
export const testSetupFactory = {
  create: createJestSetup,
  createMinimal: createMinimalJestSetup,
  createTypeScriptESM: createTypeScriptESMSetup,
  createReact: createReactJestSetup,
  createDemo: createDemoJestSetup,
  
  // Utility functions
  resetState: resetSetupState,
  getState: getSetupState,
  isComplete: isSetupComplete
};

// Default export
export default testSetupFactory;