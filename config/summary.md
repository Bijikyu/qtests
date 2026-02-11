# config/ Directory Summary

## Overview
Houses shared tooling configuration for qtests, including Jest setup, path resolution helpers, and polyfills that align the test runner with project-wide stubbing rules.

## Files and Their Roles

### jest.config.mjs
**Role**: Primary Jest configuration consumed by `qtests-runner.mjs` for all suites  
**Responsibilities**: Enables ts-jest ESM pipeline, installs require polyfills, ignores `dist/` and `build/`, and preserves qtests setup ordering for stub resolution  
**Request/Response Flows**: Receives test discovery from the runner → forwards transforms/ignores to Jest → produces executed test plans

### ts-jest-resolver.cjs
**Role**: Custom resolver that retries TypeScript sources when a `.js` path is missing  
**Responsibilities**: Swaps `.js` requests to `.ts` for in-repo files and approved dependencies (notably `@bijikyu/qerrors`) to avoid brittle missing-artifact errors during tests  
**Edge Cases & Caveats**: Fallback applies only to allow-listed packages to prevent unintended node_modules resolution; keep the allow-list minimal to avoid masking packaging issues

## Known Side Effects
- Resolver fallback runs inside Jest only and does not affect production builds or runtime module resolution

## Scaling & Maintenance Notes
- Update the resolver allow-list cautiously and document any new dependency that ships TypeScript-only modules
- Keep ignores aligned with runner policies to avoid duplicate mocks from compiled artifacts
