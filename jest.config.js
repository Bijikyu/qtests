// jest.config.js - ES Module configuration for integration tests only
export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  setupFiles: ['./tests/mockSetup.ts'], // Install mocks before any imports
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
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1.ts', // Map compiled .js imports back to TypeScript sources for ts-jest
    '^qerrors$': '<rootDir>/lib/qerrorsFallback.ts', // Use local fallback to avoid winston loading before mock hooks
    '^winston$': '<rootDir>/stubs/winston.ts' // Use mock winston to prevent real winston from loading
  }
};
