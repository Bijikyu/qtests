# qtests - Node.js Testing Framework

## Overview
qtests is a comprehensive Node.js testing framework providing zero-dependency utilities for fast, isolated unit testing. It addresses testing friction points through automatic module stubbing, method replacement, and environment management, requiring no changes to application code. Its business vision is to simplify testing in Node.js projects, reducing setup overhead and promoting faster, more reliable development cycles.

## User Preferences
- Preferred communication style: Simple, everyday language
- Keep functionality simple - avoid unnecessary flags or options
- Don't add complexity unless explicitly requested
- Performance Priority: High - Test execution speed is critical for developer productivity
- Truth and functionality over lies - prefer errors over mock data or fallbacks
- Functions declared via function declaration
- Single line per functional operation for debugging
- Smallest practical number of lines with DRY principles
- Strings in JavaScript written with backticks (`) for future extensibility
- camelCase naming conventions
- Inline comments preferred over above-the-line comments

## System Architecture

### Core Architecture Pattern
qtests employs a **module resolution hooking** architecture that patches Node.js's global `Module._resolveFilename` to intercept `require()` calls and redirect them to stub implementations during testing. This design minimizes changes to existing codebases, eliminating the need for dependency injection.

### Technology Stack
- **Runtime**: Node.js 20+ with module resolution patching.
- **Testing**: Jest-compatible with fallback for vanilla Node.js.
- **Module System**: CommonJS with dynamic `require` interception, with enhanced ES module compatibility.
- **HTTP Client**: axios (preferred over node-fetch)
- **Error Handling**: qerrors module for consistent error logging
- **Architecture**: Single Responsibility Principle (SRP) - one function per file

### Key Components
- **Module Resolution System**: Globally modifies Node.js module resolution to automatically substitute stubs.
- **Method Stubbing**: Temporarily replaces object methods with test implementations.
- **Console Mocking**: Captures console output during tests.
- **Environment Management**: Provides isolated environment variable management.
- **Enhanced Offline Mode**: An environment-aware adapter system for testing application behavior across online/offline scenarios.
- **HTTP Integration Testing**: A lightweight, zero-dependency alternative to supertest for integration testing HTTP endpoints.
- **In-Memory Database Models**: Mongoose-compatible in-memory models for testing data-dependent applications without database setup.
- **Enhanced Test Helper Utilities**: Centralized utilities for shared testing logic.
- **Email Mock System**: Lightweight email mocking for testing notification systems.
- **Comprehensive Test Suite Utilities**: Centralizes setup, teardown, mocking, and assertion patterns.
- **Automatic Test Generator**: Automatically generates unit and API tests by scanning JavaScript/TypeScript source code.
- **Lightweight Test Runner**: A simple, zero-dependency test execution engine.

### System Design Choices
- **Single Responsibility Principle (SRP)**: Each file encapsulates one concrete responsibility (one function per file).
- **Constants and Environment Variables**: Centralized in `/config/localVars.js` as the single source of truth.
- **Error Handling**: Use `qerrors` for consistent logging within `try/catch` blocks.
- **Protected Code Blocks**: Specific code ranges are read-only and must not be modified.
- **Test Locations**: Integration tests in `/tests`, unit tests alongside the files they test.
- **No External API Calls in Tests**: All external services must be mocked.
- **Frontend Requirements**: Client-side and server-side validation, WCAG 2.1 AA accessibility, UX best practices, AJAX interactions.

## External Dependencies

### Production Dependencies
- `@types/node`: TypeScript definitions for Node.js APIs.
- `axios`: Real HTTP client (referenced for stub implementation).

### Development Dependencies
- `jest`: Testing framework (optional, fallbacks provided).
- `winston`: Logging library (referenced for stub implementation).
- `ts-jest`: For TypeScript Jest integration.

### Optional Dependencies
- `qerrors`: Error reporting module.
- `agentsqripts`: Code analysis and quality tools.
- `arqitect`: AI-powered planning and architecture analysis.
- `quantumagent`: Specialized reasoning and analysis subagent.
- `fileflows`: Data flow visualization and documentation.

## Recent Bug Fixes (August 2025)

### Critical Jest Configuration Bug Fix (August 19, 2025)
- **Client-Reported Issue Resolution**: Fixed critical typo in Jest configuration generation where `moduleNameMapping` was incorrectly used instead of `moduleNameMapper`
- **Root Cause Identified**: Bug was in `lib/testGenerator.js` line 626 within the ES module Jest configuration template
- **Impact Assessment**: Affected all clients using `npx qtests-generate` to scaffold Jest setups for ES module projects, causing Jest configuration errors
- **Fix Verification**: Confirmed fix with 100% test success rate (75/75 tests passing) and proper Jest property naming
- **Quality Assurance**: This demonstrates the importance of thorough testing of generated configurations and responsiveness to client feedback