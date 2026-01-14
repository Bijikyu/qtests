// Jest configuration for the demo project following qtests runner policies.
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  // Force project root regardless of this file’s location.
  rootDir: '..',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/tests/**/*.test.[jt]s?(x)'],
  setupFiles: ['<rootDir>/config/jest-require-polyfill.cjs'],
  // Ensure @bijikyu/qtests/setup runs first; then local setup.
  setupFilesAfterEnv: ['@bijikyu/qtests/setup', '<rootDir>/config/jest-setup.js'],
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/build/'],
  watchPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/build/'],
  testPathIgnorePatterns: ['<rootDir>/src/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // Transform:
  // - TS with ts-jest (for any TS sources, including potential qtests TS if mapped)
  // - JS/JSX via babel-jest to support ESM + JSX in tests and client components
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.json', isolatedModules: true }
    ],
    '^.+\\.[j]sx?$': [
      'babel-jest',
      { presets: ['@babel/preset-env', '@babel/preset-react'] }
    ]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(qtests)/)'
  ],
  // Map qtests source imports to the built dist to avoid TS resolution issues.
  moduleNameMapper: {
    '^@bijikyu/qtests/setup$': '<rootDir>/../dist/setup.js',
    '^qtests/(.*)$': '<rootDir>/../dist/$1'
  },
  // The runner enforces coverage=false and cache=true; we leave them to the runner.
};

export default config;
