// jest.config.mjs - TypeScript ES Module configuration (React-enabled)
// Use ESM export to avoid CommonJS issues under "type": "module"
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  roots: ['<rootDir>'],
  testMatch: [
  "**/*.test.ts",
  "**/*.test.tsx",
  "**/*.spec.ts",
  "**/*.spec.tsx",
  "**/*.GenerateTest.test.ts",
  "**/*.GenerateTest.test.tsx",
  "**/manual-tests/**/*.test.ts",
  "**/generated-tests/**/*.test.ts"
],
  moduleFileExtensions: ["ts","tsx","js","jsx","json"],
  transform: {
  "^.+\\.(ts|tsx)$": [
    "ts-jest",
    {
      "useESM": true,
      "isolatedModules": true,
      "tsconfig": {
        "jsx": "react-jsx"
      }
    }
  ]
},
  extensionsToTreatAsEsm: [".ts",".tsx"],
  transformIgnorePatterns: ['node_modules/(?!(?:qtests|@tanstack|@radix-ui|lucide-react|react-resizable-panels|cmdk|vaul)/)'],
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1',
    '^qtests/(.*)$': '<rootDir>/node_modules/qtests/$1'
  }
};