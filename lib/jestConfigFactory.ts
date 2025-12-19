/**
 * Jest Configuration Factory
 * Eliminates duplication across multiple Jest configuration files
 * Provides standardized, configurable Jest setups for different project types
 */

import type { Config } from '@jest/types';

// ==================== CONFIGURATION INTERFACES ====================

/**
 * Options for creating Jest configurations
 */
export interface JestConfigOptions {
  /** Jest preset to use */
  preset?: string;
  /** Test environment */
  testEnvironment?: string;
  /** Additional module file extensions */
  moduleFileExtensions?: string[];
  /** Root directories for tests */
  roots?: string[];
  /** Test path patterns */
  testMatch?: string[];
  /** Paths to ignore during test discovery */
  testPathIgnorePatterns?: string[];
  /** Module name mapping for mocks */
  moduleNameMapper?: Record<string, string>;
  /** Setup files to run before tests */
  setupFiles?: string[];
  /** Setup files to run after environment is established */
  setupFilesAfterEnv?: string[];
  /** Coverage collection settings */
  collectCoverage?: boolean;
  /** Coverage directory */
  coverageDirectory?: string;
  /** Coverage report formats */
  coverageReporters?: any[];
  /** Transform configurations */
  transform?: Record<string, string>;
  /** Module path ignore patterns */
  modulePathIgnorePatterns?: string[];
  /** Watch path ignore patterns */
  watchPathIgnorePatterns?: string[];
  /** Coverage collection patterns */
  collectCoverageFrom?: string[];
  /** Additional configuration overrides */
  overrides?: Partial<Config.InitialOptions>;
}

/**
 * Project type presets for common configurations
 */
export type ProjectType = 'typescript-esm' | 'typescript-cjs' | 'javascript-cjs' | 'react-typescript' | 'demo';

// ==================== DEFAULT CONFIGURATIONS ====================

/**
 * Default module file extensions for most projects
 */
const DEFAULT_MODULE_EXTENSIONS = ['ts', 'tsx', 'js', 'jsx', 'json'];

/**
 * Default test path ignore patterns
 */
const DEFAULT_TEST_IGNORE_PATTERNS = [
  '/node_modules/',
  '/dist/',
  '/build/',
  '/manual-tests/',
  '/generated-tests/'
];

/**
 * Default module path ignore patterns
 */
const DEFAULT_MODULE_IGNORE_PATTERNS = [
  '<rootDir>/dist/',
  '<rootDir>/build/'
];

/**
 * Default coverage report formats
 */
const DEFAULT_COVERAGE_REPORTERS: any[] = ['text', 'lcov', 'html'];

// ==================== PROJECT TYPE CONFIGURATIONS ====================

/**
 * Configuration presets for different project types
 */
const PROJECT_CONFIGS: Record<ProjectType, Partial<Config.InitialOptions>> = {
  'typescript-esm': {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    globals: {
      'ts-jest': {
        useESM: true,
        tsconfig: {
          tsconfig: 'tsconfig.json'
        }
      }
    },
    moduleFileExtensions: DEFAULT_MODULE_EXTENSIONS,
    testPathIgnorePatterns: DEFAULT_TEST_IGNORE_PATTERNS,
    modulePathIgnorePatterns: DEFAULT_MODULE_IGNORE_PATTERNS,
    watchPathIgnorePatterns: DEFAULT_MODULE_IGNORE_PATTERNS,
    setupFilesAfterEnv: ['<rootDir>/config/jest-setup.ts']
  },

  'typescript-cjs': {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: DEFAULT_MODULE_EXTENSIONS,
    testPathIgnorePatterns: DEFAULT_TEST_IGNORE_PATTERNS,
    modulePathIgnorePatterns: DEFAULT_MODULE_IGNORE_PATTERNS,
    watchPathIgnorePatterns: DEFAULT_MODULE_IGNORE_PATTERNS,
    setupFilesAfterEnv: ['<rootDir>/config/jest-setup.ts']
  },

  'javascript-cjs': {
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'jsx', 'json'],
    testPathIgnorePatterns: DEFAULT_TEST_IGNORE_PATTERNS,
    modulePathIgnorePatterns: DEFAULT_MODULE_IGNORE_PATTERNS,
    watchPathIgnorePatterns: DEFAULT_MODULE_IGNORE_PATTERNS
  },

  'react-typescript': {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/config/jest-setup.ts', '@testing-library/jest-dom'],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    testPathIgnorePatterns: DEFAULT_TEST_IGNORE_PATTERNS,
    modulePathIgnorePatterns: DEFAULT_MODULE_IGNORE_PATTERNS,
    watchPathIgnorePatterns: DEFAULT_MODULE_IGNORE_PATTERNS
  },

  'demo': {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    globals: {
      'ts-jest': {
        useESM: true,
        tsconfig: {
          tsconfig: 'tsconfig.json'
        }
      }
    },
    moduleFileExtensions: DEFAULT_MODULE_EXTENSIONS,
    testPathIgnorePatterns: [
      '/node_modules/',
      '/dist/',
      '/build/',
      '/manual-tests/',
      '/generated-tests/'
    ],
    modulePathIgnorePatterns: DEFAULT_MODULE_IGNORE_PATTERNS,
    watchPathIgnorePatterns: DEFAULT_MODULE_IGNORE_PATTERNS,
    setupFilesAfterEnv: ['<rootDir>/config/jest-setup.ts'],
    collectCoverage: false,
    coverageDirectory: 'coverage',
    coverageReporters: DEFAULT_COVERAGE_REPORTERS
  }
};

// ==================== MAIN FACTORY FUNCTION ====================

/**
 * Create a Jest configuration based on project type and custom options
 * 
 * @param projectType - Type of project configuration
 * @param options - Additional configuration options
 * @returns Complete Jest configuration object
 */
export function createJestConfig(
  projectType: ProjectType = 'typescript-esm',
  options: JestConfigOptions = {}
): Config.InitialOptions {
  // Get base configuration for project type
  const baseConfig = PROJECT_CONFIGS[projectType];
  
  // Merge with custom options
  const config: Config.InitialOptions = {
    ...baseConfig,
    ...options.overrides,
    
    // Apply custom options with defaults
    preset: options.preset || baseConfig.preset,
    testEnvironment: options.testEnvironment || baseConfig.testEnvironment || 'node',
    moduleFileExtensions: options.moduleFileExtensions || baseConfig.moduleFileExtensions || DEFAULT_MODULE_EXTENSIONS,
    roots: options.roots || baseConfig.roots || ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: options.testMatch || baseConfig.testMatch || [
      '**/__tests__/**/*.+(ts|tsx|js)',
      '**/*.(test|spec).+(ts|tsx|js)'
    ],
    testPathIgnorePatterns: options.testPathIgnorePatterns || baseConfig.testPathIgnorePatterns || DEFAULT_TEST_IGNORE_PATTERNS,
    moduleNameMapper: options.moduleNameMapper || baseConfig.moduleNameMapper || {},
    setupFiles: options.setupFiles || baseConfig.setupFiles || [],
    setupFilesAfterEnv: options.setupFilesAfterEnv || baseConfig.setupFilesAfterEnv || [],
    collectCoverage: options.collectCoverage ?? baseConfig.collectCoverage ?? false,
    coverageDirectory: options.coverageDirectory || baseConfig.coverageDirectory || 'coverage',
    coverageReporters: options.coverageReporters || baseConfig.coverageReporters || DEFAULT_COVERAGE_REPORTERS as any,
    transform: options.transform || baseConfig.transform,
    modulePathIgnorePatterns: options.modulePathIgnorePatterns || baseConfig.modulePathIgnorePatterns || DEFAULT_MODULE_IGNORE_PATTERNS,
    watchPathIgnorePatterns: options.watchPathIgnorePatterns || baseConfig.watchPathIgnorePatterns || DEFAULT_MODULE_IGNORE_PATTERNS
  };

  // Remove undefined values
  Object.keys(config).forEach(key => {
    if (config[key as keyof Config.InitialOptions] === undefined) {
      delete config[key as keyof Config.InitialOptions];
    }
  });

  return config;
}

// ==================== SPECIALIZED CONFIGURATIONS ====================

/**
 * Create a Jest configuration for TypeScript ESM projects (most common)
 */
export function createTypeScriptESMConfig(options: JestConfigOptions = {}): Config.InitialOptions {
  return createJestConfig('typescript-esm', options);
}

/**
 * Create a Jest configuration for TypeScript CommonJS projects
 */
export function createTypeScriptCJSConfig(options: JestConfigOptions = {}): Config.InitialOptions {
  return createJestConfig('typescript-cjs', options);
}

/**
 * Create a Jest configuration for JavaScript projects
 */
export function createJavaScriptConfig(options: JestConfigOptions = {}): Config.InitialOptions {
  return createJestConfig('javascript-cjs', options);
}

/**
 * Create a Jest configuration for React TypeScript projects
 */
export function createReactConfig(options: JestConfigOptions = {}): Config.InitialOptions {
  return createJestConfig('react-typescript', options);
}

/**
 * Create a Jest configuration for demo projects
 */
export function createDemoConfig(options: JestConfigOptions = {}): Config.InitialOptions {
  return createJestConfig('demo', options);
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Create a minimal Jest configuration for quick testing
 */
export function createMinimalConfig(testEnvironment: string = 'node'): Config.InitialOptions {
  return {
    testEnvironment,
    moduleFileExtensions: ['js', 'json'],
    testMatch: ['**/*.test.js'],
    testPathIgnorePatterns: ['/node_modules/'],
    collectCoverage: false
  };
}

/**
 * Create a Jest configuration with coverage enabled
 */
export function createCoverageConfig(
  projectType: ProjectType = 'typescript-esm',
  options: JestConfigOptions = {}
): Config.InitialOptions {
  return createJestConfig(projectType, {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: DEFAULT_COVERAGE_REPORTERS,
    
    ...options
  });
}

// ==================== EXPORTS ====================

/**
 * Jest configuration factory interface
 */
export const jestConfigFactory = {
  create: createJestConfig,
  createTypeScriptESM: createTypeScriptESMConfig,
  createTypeScriptCJS: createTypeScriptCJSConfig,
  createJavaScript: createJavaScriptConfig,
  createReact: createReactConfig,
  createDemo: createDemoConfig,
  createMinimal: createMinimalConfig,
  createCoverage: createCoverageConfig,
  
  // Constants for easy reference
  projectTypes: {
    TYPESCRIPT_ESM: 'typescript-esm',
    TYPESCRIPT_CJS: 'typescript-cjs',
    JAVASCRIPT: 'javascript-cjs',
    REACT_TYPESCRIPT: 'react-typescript',
    DEMO: 'demo'
  } as const
};

// Default export
export default jestConfigFactory;