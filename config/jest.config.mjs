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
    "^@bijikyu/qtests$": "<rootDir>/dist/index.js",
    "^@bijikyu/qtests/(.*)$": "<rootDir>/dist/$1",
   // Essential mocks only - avoid broad patterns that interfere with node_modules
    "^mongoose$": "<rootDir>/__mocks__/mongoose.js",
    "^\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/fileMock.js",
    "^\\.(png|jpg|jpeg|gif|svg|webp|avif|ico|bmp)$": "<rootDir>/__mocks__/fileMock.js",
    // Custom stubs - only when explicitly needed
    "^external-service-client$": "<rootDir>/utils/jest-proxies/external-service-client.cjs",
    "^feature-x$": "<rootDir>/utils/jest-proxies/feature-x.cjs"

    }
};
