module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/test/testSetup.js'], // (invoke exported setup for jest)
  
  // Advanced Performance optimizations
  maxWorkers: '100%', // Use all available CPU cores for maximum speed
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  clearMocks: true,
  resetMocks: false,
  restoreMocks: false,
  
  // Conservative memory optimizations for stability
  workerIdleMemoryLimit: '1GB', // Conservative worker memory to prevent hanging
  detectLeaks: false, // Skip leak detection for speed
  logHeapUsage: false, // Disable heap logging for speed
  forceExit: false, // Let Jest handle cleanup properly in parallel mode
  
  // Fast test execution (balanced for stability)
  verbose: false,
  silent: false, // Keep some output for debugging, qtests-runner handles display
  bail: false, // Don't stop on first failure for parallel efficiency
  passWithNoTests: true, // Don't fail on empty test suites
  
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
      isolatedModules: true, // Faster TypeScript compilation
      tsconfig: {
        compilerOptions: {
          sourceMap: false, // Skip source maps for speed
          declaration: false,
          declarationMap: false,
          skipLibCheck: true // Skip lib checking for speed
        }
      }
    }],
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'lib/**/*.js',
    'utils/**/*.js',
    'index.js',
    '!lib/stubs.js',
    '!utils/*Stub.js'
  ]
};
