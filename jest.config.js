module.exports = {
  setupFiles: ['<rootDir>/test/testSetup.js'], // (invoke exported setup for jest)
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
    '<rootDir>/test/**/*.test.js'
  ],
  collectCoverageFrom: [
    'lib/**/*.js',
    'utils/**/*.js',
    'index.js',
    '!lib/stubs.js',
    '!utils/*Stub.js'
  ]
};
