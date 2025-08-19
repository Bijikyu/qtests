# qtests - Node.js Testing Framework

## Overview
qtests is a comprehensive Node.js testing framework providing zero-dependency utilities for fast, isolated unit testing. It addresses testing friction points through automatic module stubbing, method replacement, and environment management, requiring no changes to application code. Its business vision is to simplify testing in Node.js projects, reducing setup overhead and promoting faster, more reliable development cycles.

## User Preferences
- Preferred communication style: Simple, everyday language
- Keep functionality simple - avoid unnecessary flags or options
- Don't add complexity unless explicitly requested
- Performance Priority: High - Test execution speed is critical for developer productivity

## System Architecture

### Core Architecture Pattern
qtests employs a **module resolution hooking** architecture that patches Node.js's global `Module._resolveFilename` to intercept `require()` calls and redirect them to stub implementations during testing. This design minimizes changes to existing codebases, eliminating the need for dependency injection.

### Technology Stack
- **Runtime**: Node.js 20+ with module resolution patching.
- **Testing**: Jest-compatible with fallback for vanilla Node.js.
- **Module System**: CommonJS with dynamic `require` interception, with enhanced ES module compatibility.

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

## External Dependencies

### Production Dependencies
- `@types/node`: TypeScript definitions for Node.js APIs.
- `axios`: Real HTTP client (referenced for stub implementation).

### Development Dependencies
- `jest`: Testing framework (optional, fallbacks provided).
- `winston`: Logging library (referenced for stub implementation).
- `ts-jest`: For TypeScript Jest integration.

### Optional Dependencies
- `qerrors`: Error reporting module (gracefully handled if missing).

## Recent Changes (August 2025)

### Universal CommonJS and ES Module Support (August 19, 2025)
- **Enhanced Export Detection**: Test generator now intelligently detects both CommonJS (`module.exports`, `exports.name`) and ES module (`export const/function/class`) patterns in source code
- **Dual Pattern Recognition**: Added comprehensive regex patterns to extract exports from both module systems without changing qtests' CommonJS architecture
- **Object Export Handling**: Fixed `module.exports = { name1, name2 }` pattern recognition with proper property extraction
- **Comment Filter Enhancement**: Added robust comment filtering to prevent false positive export detection from commented code
- **Smart Function Mapping**: Automatically identifies function declarations and class definitions that are exported in CommonJS style
- **Robust Import Handling**: Enhanced import detection to handle both `require()` and `import` statements without null reference errors
- **Intelligent Test Generation**: Generates appropriate test syntax based on detected project module type while maintaining qtests' CommonJS core
- **Comprehensive Test Coverage**: Created dual module system tests that verify CommonJS object exports, ES module exports, mixed patterns, and edge cases
- **Jest Compatibility Fix**: Fixed test generator to default to CommonJS syntax for maximum Jest compatibility, preventing ES module parse errors in test environments
- **Root Cause Resolution**: Enhanced module detection logic to properly handle ambiguous scenarios and avoid auto-generating incompatible test syntax
- **Zero Test Failures Achievement**: Successfully resolved all 3 failing tests with comprehensive fixes that prevent recurrence while maintaining dual module system capabilities