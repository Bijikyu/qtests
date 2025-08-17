# qtests - Node.js Testing Framework

## Overview
qtests is a comprehensive Node.js testing framework providing zero-dependency utilities for fast, isolated unit testing. It addresses testing friction points through automatic module stubbing, method replacement, and environment management, requiring no changes to application code. Its business vision is to simplify testing in Node.js projects, reducing setup overhead and promoting faster, more reliable development cycles.

## User Preferences
- Preferred communication style: Simple, everyday language
- Keep functionality simple - avoid unnecessary flags or options
- Don't add complexity unless explicitly requested

## System Architecture

### Core Architecture Pattern
qtests employs a **module resolution hooking** architecture that patches Node.js's global `Module._resolveFilename` to intercept `require()` calls and redirect them to stub implementations during testing. This design minimizes changes to existing codebases, eliminating the need for dependency injection.

### Technology Stack
- **Runtime**: Node.js 20+ with module resolution patching.
- **Testing**: Jest-compatible with fallback for vanilla Node.js.
- **Module System**: CommonJS with dynamic `require` interception.

### Key Components
- **Module Resolution System (`setup.js`)**: Globally modifies Node.js module resolution to automatically substitute stubs, enabling testing without altering application code.
- **Method Stubbing (`stubMethod`)**: Temporarily replaces object methods with test implementations using a closure-based restoration pattern.
- **Console Mocking (`mockConsole`)**: Captures console output during tests to prevent pollution, with Jest compatibility and manual mock fallback.
- **Environment Management (`testEnv`)**: Provides isolated environment variable management for predictable tests, including save/restore cycles and default mock values.
- **Enhanced Offline Mode (`offlineMode`)**: An environment-aware adapter system for testing application behavior across online/offline scenarios, with `CODEX`/`OFFLINE_MODE` support and mock axios factory.
- **HTTP Integration Testing (`httpTest`)**: A lightweight, zero-dependency alternative to supertest for integration testing HTTP endpoints, supporting method chaining, JSON parsing, and Express-compatible mock applications.
- **In-Memory Database Models (`mockModels`)**: Mongoose-compatible in-memory models for testing data-dependent applications without database setup, supporting CRUD operations and query chaining.
- **Enhanced Test Helper Utilities (`testHelpers`)**: Centralized utilities for shared testing logic across test suites, supporting both Jest and vanilla Node.js, with selective environment management and thread-safe module reloading.
- **Email Mock System (`sendEmail`)**: Lightweight email mocking for testing notification systems without external mail service dependencies, featuring structured data return and history tracking.
- **Comprehensive Test Suite Utilities (`testSuite`)**: Eliminates duplicate patterns across test suites by centralizing setup, teardown, mocking, and assertion patterns through a class-based utility with a builder pattern.
- **Automatic Test Generator (`TestGenerator`)**: Automatically generates unit and API tests by scanning JavaScript/TypeScript source code, acting as a CLI tool (`qtests-generate`) for rapid test scaffolding.
- **Lightweight Test Runner (`runTestSuite`)**: A simple, zero-dependency test execution engine for quick testing scenarios, providing pass/fail tracking and formatted console output.

## External Dependencies

### Production Dependencies
- `@types/node`: TypeScript definitions for Node.js APIs.
- `axios`: Real HTTP client (referenced for stub implementation).

### Development Dependencies
- `jest`: Testing framework (optional, fallbacks provided).
- `winston`: Logging library (referenced for stub implementation).

### Optional Dependencies
- `qerrors`: Error reporting module (gracefully handled if missing).