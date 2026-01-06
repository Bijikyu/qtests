// jest.config.mjs - TypeScript ES Module configuration (React-enabled)
// Use ESM export to avoid CommonJS issues under "type": "module"
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

export default {
  preset: 'ts-jest/presets/default-esm',
  rootDir: PROJECT_ROOT,
  testEnvironment: 'node',
  // Ensure CommonJS require() exists in ESM tests
  setupFiles: [path.join(PROJECT_ROOT, 'config', 'jest-require-polyfill.cjs')],
  setupFilesAfterEnv: [path.join(PROJECT_ROOT, 'config', 'jest-setup.ts')],
  roots: [PROJECT_ROOT],
  testMatch: [
  "**/integration/**/*.test.ts",
  "**/integration/**/*.test.tsx",
  "**/integration/**/*.test.js",
  "**/integration/**/*.test.jsx"
],
  testPathIgnorePatterns: [
  "/node_modules/",
  "/dist/",
  "/build/",
  "/__mocks__/",
  "/manual-tests/",
  "/generated-tests/"
],
  // Harden ignores to avoid duplicate manual mocks and compiled artifacts
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/build/', '<rootDir>/.cache/'],
  watchPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/build/', '<rootDir>/.cache/'],
  haste: {
    retainAllFiles: false,
    throwOnModuleCollision: false
  },
  moduleFileExtensions: ["ts","tsx","js","jsx","json"],
  transform: {
  "^.+\\.(ts|tsx)$": [
    "ts-jest",
    {
      "useESM": true,
      "tsconfig": "<rootDir>/config/tsconfig.jest.json"
    }
  ],
  "^.+\\.(js|jsx)$": [
    "babel-jest",
    {
      "presets": [
        [
          "@babel/preset-env",
          {
            "targets": {
              "node": "current"
            }
          }
        ]
      ]
    }
  ]
},
  extensionsToTreatAsEsm: [".ts",".tsx"],
  transformIgnorePatterns: ['node_modules/(?!(?:qtests|qerrors|@tanstack|@radix-ui|lucide-react|react-resizable-panels|cmdk|vaul|@langchain|openai)/)'],
   moduleNameMapper: {
   // Removed problematic qgenutils mappings to fix Jest module resolution
   // Individual files should handle their own imports properly
   // Then handle qtests-specific mappings
   "^\\./index\\.js$": "<rootDir>/index.ts",
   "^\\./setup\\.js$": "<rootDir>/setup.ts",
    "^\\./lib/(.*)\\.js$": "<rootDir>/lib/$1.ts",
    "^\\./lib/(circuitBreaker|connectionPool|performanceMonitor|rateLimiter|cache|security|memory|fileSystem|httpMock|polyfills|testIsolation|errorHandling|validation|templates|utils|stubs|setup|coreUtils|envUtils|routeTestUtils)(.*)$": "<rootDir>/lib/$1$2.ts",

"^\\./lib/(.*)/utils/httpTest\\.shim\\.js$": "<rootDir>/utils/httpTest.shim.ts",
    "^\\./utils/httpTest\\.js$": "<rootDir>/utils/httpTest.ts",
    "^\\./utils/(.*)\\.js$": "<rootDir>/utils/$1.ts",
    // Remove problematic module mapper for better compatibility
    // "^(.*/httpTest\\.shim)\\.js$": "$1.ts",
   "^external-service-client$": "<rootDir>/utils/jest-proxies/external-service-client.cjs",
   "^feature-x$": "<rootDir>/utils/jest-proxies/feature-x.cjs",
   // Remove problematic mapping that interferes with react-is
    // "^\\.{1,2}/(.*)\\.js$": "$1",
   "^qtests/lib/(.*)$": "<rootDir>/lib/$1.ts",
   "^qtests/utils/(.*)$": "<rootDir>/utils/$1.ts",
   "^qtests/setup$": "<rootDir>/setup.ts",
   "^qtests$": "<rootDir>/index.ts",
   "^mongoose$": "<rootDir>/__mocks__/mongoose.js",
   "^\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/fileMock.js",
   "^\\.(png|jpg|jpeg|gif|svg|webp|avif|ico|bmp)$": "<rootDir>/__mocks__/fileMock.js",
   // Fix for security module imports
   "^\\./lib/security/(.*)$": "<rootDir>/lib/security/$1.ts",
   "^\\.\\/lib\\/security\\/(.*)$": "<rootDir>/lib/security/$1.ts",

   }
};