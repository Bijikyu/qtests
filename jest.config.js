export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/setup.ts'],

  // Advanced Performance optimizations
  maxWorkers: '100%',
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  clearMocks: true,
  resetMocks: false,
  restoreMocks: false,

  // Conservative memory optimizations for stability
  workerIdleMemoryLimit: '1GB',
  detectLeaks: false,
  logHeapUsage: false,
  forceExit: false,

  // Fast test execution (balanced for stability)
  verbose: false,
  silent: false,
  bail: false,
  passWithNoTests: true,

  testPathIgnorePatterns: [
    '/node_modules/',
    '/demo/',
    '/examples/',
    '/docs/',
    '/stubs/',
    '/utils/axiosStub.js',
    '/utils/winstonStub.js'
  ],
  testMatch: [
    '<rootDir>/test/**/*.test.js',
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/**/*.test.js',
    '<rootDir>/**/*.test.ts'
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: './tsconfig.json'
    }]
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'lib/**/*.ts',
    'utils/**/*.ts',
    'index.ts',
    '!lib/stubs.ts',
    '!utils/*Stub.ts'
  ]
};
