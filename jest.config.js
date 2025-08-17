module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/test/testSetup.js'], // (invoke exported setup for jest)
  
  // Performance optimizations
  maxWorkers: '50%', // Use half available CPU cores for parallel execution
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  clearMocks: true,
  resetMocks: false,
  restoreMocks: false,
  
  // Fast test execution
  verbose: false,
  silent: false,
  bail: false, // Don't stop on first failure for parallel efficiency
  
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
