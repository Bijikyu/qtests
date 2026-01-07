/**
 * Shared Common Patterns Utility
 * 
 * Consolidates the most frequently repeated small patterns
 * to eliminate final DRY opportunities across the codebase.
 */

import { handleError } from './errorHandling.js';

/**
 * Common logging patterns
 */
export const logging = {
  /**
   * Standardized debug logging
   */
  debug: (message: string, ...args: any[]) => {
    console.log(`🔍 ${message}`, ...args);
  },

  /**
   * Standardized info logging  
   */
  info: (message: string, ...args: any[]) => {
    console.log(`ℹ️ ${message}`, ...args);
  },

  /**
   * Standardized warning logging
   */
  warn: (message: string, ...args: any[]) => {
    console.warn(`⚠️ ${message}`, ...args);
  },

  /**
   * Standardized error logging
   */
  error: (message: string, error?: any) => {
    if (error) {
      handleError(error, 'logging.error', { context: { message } });
    } else {
      console.error(`❌ ${message}`);
    }
  },

  /**
   * Standardized success logging
   */
  success: (message: string, ...args: any[]) => {
    console.log(`✅ ${message}`, ...args);
  }
};

/**
 * Common validation patterns
 */
export const validation = {
  /**
   * Check if value is defined
   */
  isDefined: <T>(value: T | undefined): value is T => {
    return value !== undefined && value !== null;
  },

  /**
   * Check if string is not empty
   */
  nonEmpty: (value: string | null | undefined): boolean => {
    return validation.isDefined(value) && value!.trim().length > 0;
  },

  /**
   * Check if array has elements
   */
  hasElements: <T>(array: T[] | null | undefined): boolean => {
    return validation.isDefined(array) && array!.length > 0;
  },

  /**
   * Check if object has properties
   */
  hasProperties: (obj: object | null | undefined): boolean => {
    return validation.isDefined(obj) && Object.keys(obj!).length > 0;
  },

  /**
   * Validate string length
   */
  validLength: (str: string, min: number, max?: number): boolean => {
    const len = str ? str.length : 0;
    if (max !== undefined) {
      return len >= min && len <= max;
    }
    return len >= min;
  },

  /**
   * Validate number range
   */
  inRange: (num: number, min: number, max: number): boolean => {
    return num >= min && num <= max;
  }
};

/**
 * Common async patterns
 */
export const asyncCommon = {
  /**
   * Create resolved promise
   */
  resolved: <T>(value: T): Promise<T> => {
    return Promise.resolve(value);
  },

  /**
   * Create rejected promise with error
   */
  rejected: <T>(message: string, code?: string): Promise<T> => {
    const error = new Error(message);
    if (code) {
      (error as any).code = code;
    }
    return Promise.reject(error);
  },

  /**
   * Create rejected promise with any type
   */
  rejectedAny: (error: any): Promise<any> => {
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  },

  /**
   * Execute with fallback
   */
  withFallback: async <T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>
  ): Promise<T> => {
    try {
      return await primary();
    } catch {
      return await fallback();
    }
  },

  /**
   * Wait for specified time
   */
  wait: (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

/**
 * Common object patterns
 */
export const objects = {
  /**
   * Deep clone object
   */
  clone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Merge objects
   */
  merge: <T extends object>(...objects: T[]): T => {
    return objects.reduce((acc, obj) => ({ ...acc, ...obj }), {} as T);
  },

  /**
   * Pick properties from object
   */
  pick: <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  /**
   * Omit properties from object
   */
  omit: <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => {
      delete (result as any)[key];
    });
    return result;
  }
};

/**
 * Common array patterns
 */
export const arrays = {
  /**
   * Remove duplicates from array
   */
  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)];
  },

  /**
   * Group array by key
   */
  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  /**
   * Check if array contains value
   */
  includes: <T>(array: T[], value: T): boolean => {
    return array.some(item => item === value);
  },

  /**
   * Find first matching item
   */
  find: <T>(array: T[], predicate: (item: T) => boolean): T | undefined => {
    return array.find(predicate);
  }
};

/**
 * Common string patterns
 */
export const strings = {
  /**
   * Capitalize first letter
   */
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Convert to camelCase
   */
  camelCase: (str: string): string => {
    return str.replace(/[_-]([a-z])/g, (_, letter) => letter.toUpperCase());
  },

  /**
   * Convert to kebab-case
   */
  kebabCase: (str: string): string => {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  },

  /**
   * Truncate string with ellipsis
   */
  truncate: (str: string, maxLength: number): string => {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
  }
};

/**
 * Common type utilities
 */
export const types = {
  /**
   * Check if value is a string
   */
  isString: (value: any): value is string => {
    return typeof value === 'string';
  },

  /**
   * Check if value is a number
   */
  isNumber: (value: any): value is number => {
    return typeof value === 'number' && !isNaN(value);
  },

  /**
   * Check if value is a boolean
   */
  isBoolean: (value: any): value is boolean => {
    return typeof value === 'boolean';
  },

  /**
   * Check if value is an object
   */
  isObject: (value: any): value is object => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  },

  /**
   * Check if value is an array
   */
  isArray: (value: any): value is any[] => {
    return Array.isArray(value);
  },

  /**
   * Check if value is a function
   */
  isFunction: (value: any): value is Function => {
    return typeof value === 'function';
  }
};

/**
 * Common conditional patterns
 */
export const conditionals = {
  /**
   * Execute function if condition is true
   */
  ifTrue: <T>(condition: boolean, fn: () => T, fallback: T): T => {
    return condition ? fn() : fallback;
  },

  /**
   * Execute function if value is defined
   */
  ifDefined: <T, R>(value: T | undefined, fn: (val: T) => R, fallback: R): R => {
    return validation.isDefined(value) ? fn(value) : fallback;
  },

  /**
   * Execute function based on string comparison
   */
  when: <T>(value: string, cases: Record<string, () => T>, fallback: () => T): T => {
    return cases[value] ? cases[value]() : fallback();
  }
};

/**
 * Common performance patterns
 */
export const performance = {
  /**
   * Create a performance monitor
   */
  monitor: (name: string) => {
    const start = Date.now();
    return {
      end: () => {
        const duration = Date.now() - start;
        logging.debug(`Performance: ${name} took ${duration}ms`);
        return duration;
      }
    };
  },

  /**
   * Create a simple profiler
   */
  profile: async <T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<{ result: T; duration: number }> => {
    const monitor = performance.monitor(name);
    const result = await fn();
    const duration = monitor.end();
    return { result, duration };
  }
};

/**
 * Common environment patterns
 */
export const environment = {
  /**
   * Get environment variable with default
   */
  getVar: (name: string, defaultValue: string = ''): string => {
    return process.env[name] || defaultValue;
  },

  /**
   * Check if running in development
   */
  isDev: (): boolean => {
    return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  },

  /**
   * Check if running in production
   */
  isProd: (): boolean => {
    return process.env.NODE_ENV === 'production';
  },

  /**
   * Check if running in test
   */
  isTest: (): boolean => {
    return process.env.NODE_ENV === 'test' || !!process.env.TEST;
  }
};

// Export all utilities as a grouped object
export const common = {
  logging,
  validation,
  asyncCommon,
  objects,
  arrays,
  strings,
  types,
  conditionals,
  performance,
  environment
};