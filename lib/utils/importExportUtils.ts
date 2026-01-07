/**
 * Shared Import/Export Utilities
 * 
 * Provides common re-export patterns and module aggregation
 * utilities to reduce duplication across qtests codebase.
 */

// Utility function to create re-export modules
export function createReExport<T extends Record<string, any>>(
  exports: T,
  modulePath: string
): T {
  return exports;
}

// Utility to create grouped exports
export function createGroupedExports<T extends Record<string, Record<string, any>>>(
  groups: T
): T {
  return groups;
}

// Utility to merge multiple export objects
export function mergeExports<T extends Record<string, any>[]>(...exports: T): T[0] {
  return exports.reduce((merged, current) => ({ ...merged, ...current }), {} as T[0]);
}

// Utility to create conditional exports
export function createConditionalExports<T extends Record<string, any>>(
  exports: T,
  condition: boolean
): Partial<T> {
  return condition ? exports : {};
}

// Utility to create namespace exports
export function createNamespace<T extends Record<string, any>>(
  namespace: string,
  exports: T
): Record<string, any> {
  const namespaced: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(exports)) {
    namespaced[`${namespace}.${key}`] = value;
  }
  
  return namespaced;
}

// Common re-export patterns
export const commonReExports = {
  // Re-export all functions from a module
  reExportAll: (module: any) => {
    const exports: Record<string, any> = {};
    for (const [key, value] of Object.entries(module)) {
      if (typeof value === 'function') {
        exports[key] = value;
      }
    }
    return exports;
  },
  
  // Re-export only named exports
  reExportNamed: (module: any, names: string[]) => {
    const exports: Record<string, any> = {};
    for (const name of names) {
      if (module[name] !== undefined) {
        exports[name] = module[name];
      }
    }
    return exports;
  },
  
  // Re-export with alias
  reExportWithAlias: (module: any, aliasMap: Record<string, string>) => {
    const exports: Record<string, any> = {};
    for (const [original, alias] of Object.entries(aliasMap)) {
      if (module[original] !== undefined) {
        exports[alias] = module[original];
      }
    }
    return exports;
  }
};

// Module aggregation utilities
export const moduleAggregators = {
  // Aggregate security-related modules
  aggregateSecurity: (modules: Record<string, any>) => ({
    validator: modules.validator,
    monitor: modules.monitor,
    utils: modules.utils,
    middleware: modules.middleware,
    ...modules
  }),
  
  // Aggregate validation-related modules
  aggregateValidation: (modules: Record<string, any>) => ({
    schemas: modules.schemas,
    middleware: modules.middleware,
    helpers: modules.helpers,
    ...modules
  }),
  
  // Aggregate memory-related modules
  aggregateMemory: (modules: Record<string, any>) => ({
    monitor: modules.monitor,
    cleanup: modules.cleanup,
    leakDetector: modules.leakDetector,
    ...modules
  }),
  
  // Aggregate logging-related modules
  aggregateLogging: (modules: Record<string, any>) => ({
    core: modules.core,
    wrappers: modules.wrappers,
    decorators: modules.decorators,
    ...modules
  })
};

// Utility functions for dynamic imports
export const importUtils = {
  // Safe dynamic import with error handling
  safeImport: async (modulePath: string) => {
    try {
      return await import(modulePath);
    } catch (error) {
      console.error(`Failed to import module ${modulePath}:`, error);
      return null;
    }
  },
  
  // Import with fallback
  importWithFallback: async (primaryPath: string, fallbackPath: string) => {
    try {
      return await import(primaryPath);
    } catch (primaryError) {
      try {
        console.warn(`Primary import failed for ${primaryPath}, trying fallback ${fallbackPath}`);
        return await import(fallbackPath);
      } catch (fallbackError) {
        console.error(`Both primary and fallback imports failed:`, { primaryError, fallbackError });
        throw new Error(`Failed to import both ${primaryPath} and ${fallbackPath}`);
      }
    }
  },
  
  // Import multiple modules in parallel
  importMany: async (modulePaths: string[]) => {
    const results = await Promise.allSettled(
      modulePaths.map(path => importUtils.safeImport(path))
    );
    
    const successful: Record<string, any> = {};
    const failed: string[] = [];
    
    results.forEach((result, index) => {
      const path = modulePaths[index];
      if (result.status === 'fulfilled' && result.value) {
        successful[path] = result.value;
      } else {
        failed.push(path);
      }
    });
    
    return { successful, failed };
  }
};

// Export configuration utilities
export const exportConfig = {
  // Create default export configuration
  createDefaultExport: (value: any) => ({
    default: value,
    __esModule: true
  }),
  
  // Create named export configuration
  createNamedExport: (exports: Record<string, any>) => ({
    ...exports,
    __esModule: true
  }),
  
  // Create mixed export configuration
  createMixedExport: (defaultExport: any, namedExports: Record<string, any>) => ({
    default: defaultExport,
    ...namedExports,
    __esModule: true
  })
};

// Type utilities for exports
export const exportTypes = {
  // Export function type
  exportFunction: <T extends (...args: any[]) => any>(fn: T) => fn,
  
  // Export class type
  exportClass: <T extends new (...args: any[]) => any>(cls: T) => cls,
  
  // Export object type
  exportObject: <T extends Record<string, any>>(obj: T) => obj,
  
  // Export array type
  exportArray: <T>(arr: T[]) => arr,
  
  // Export promise type
  exportPromise: <T>(promise: Promise<T>) => promise
};

// Utility to create barrel exports (index.ts files)
export const barrelExports = {
  // Create barrel export from directory
  fromDirectory: (exports: Record<string, any>, directoryName: string) => {
    console.log(`📦 Creating barrel export for directory: ${directoryName}`);
    return exports;
  },
  
  // Create categorized barrel export
  categorized: (categories: Record<string, Record<string, any>>) => {
    const combined: Record<string, any> = {};
    
    for (const [category, exports] of Object.entries(categories)) {
      for (const [name, value] of Object.entries(exports)) {
        combined[name] = value;
      }
    }
    
    return combined;
  },
  
  // Create nested barrel export
  nested: (structure: Record<string, any>) => {
    const exports: Record<string, any> = {};
    
    const flatten = (obj: any, prefix: string = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          flatten(value, newKey);
        } else {
          exports[newKey] = value;
        }
      }
    };
    
    flatten(structure);
    return exports;
  }
};