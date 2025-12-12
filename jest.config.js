// jest.config.js - ES Module configuration for integration tests only
export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/tests/integration'],
  testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/manual-tests/', '/generated-tests/'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  moduleNameMapping: {
    '^(\.{1,2}/.*)\.js$': '$1'
  }
};