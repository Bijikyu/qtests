# qtests - Node.js Testing Framework

## Overview

qtests is a comprehensive Node.js testing framework that provides zero-dependency utilities for fast, isolated unit testing. The framework focuses on solving specific testing friction points by enabling automatic module stubbing, method replacement, and environment management without requiring changes to existing application code.

## System Architecture

### Core Architecture Pattern
The qtests framework uses a **module resolution hooking** architecture that patches Node.js's global `Module._resolveFilename` method to intercept `require()` calls and redirect them to stub implementations during testing. This approach was chosen over dependency injection to minimize changes to existing codebases.

### Directory Structure
- `lib/` - Core framework modules organized by functionality and purpose:
  - `coreUtils.js` - Core testing utilities (stubMethod, mockConsole)
  - `envUtils.js` - Environment management and main entry point
  - `httpUtils.js` - HTTP testing utilities (mockAxios, httpTest, offlineMode)
  - `dataUtils.js` - Data and database utilities (mockModels, sendEmail)
  - `testUtils.js` - Advanced testing utilities (testHelpers, testSuite)
  - `logUtils.js` - Logging utilities for function tracing
  - `setup.js` - Framework initialization and setup
  - `stubs.js` - Stub library registry
- `utils/` - Individual utility implementations 
- `stubs/` - Drop-in replacements for common libraries (axios, winston)
- `bin/` - CLI executables for global npm installation (qtests-runner, qtests-generate)
- `test/` - Comprehensive test suite with integration and edge case coverage

### Technology Stack
- **Runtime**: Node.js 20+ with module resolution patching
- **Testing**: Jest-compatible with fallback for vanilla Node.js
- **Module System**: CommonJS with dynamic require interception

## Key Components

### 1. Module Resolution System (`setup.js`)
**Purpose**: Globally modifies Node.js module resolution to automatically substitute stubs
**Implementation**: Patches `Module._resolveFilename` to redirect specific modules to stub implementations
**Rationale**: Enables testing without changing application code - maintains production `require()` statements in tests

### 2. Method Stubbing (`stubMethod`)
**Purpose**: Temporarily replace object methods with test implementations
**Pattern**: Closure-based restoration with explicit cleanup functions
**Benefits**: Zero dependencies, framework-agnostic, predictable behavior

### 3. Console Mocking (`mockConsole`)
**Purpose**: Capture console output during tests to prevent pollution
**Implementation**: Jest-compatible with fallback for other frameworks
**Strategy**: Automatic detection of Jest environment with manual mock fallback

### 4. Environment Management (`testEnv`)
**Purpose**: Isolated environment variable management for predictable tests
**Features**: Save/restore cycles, mock creation, standard test environments
**Default Values**: Provides fake API keys (GOOGLE_API_KEY, OPENAI_TOKEN, etc.)

### 5. Enhanced Offline Mode (`offlineMode`)
**Purpose**: Environment-aware adapter system with automatic configuration
**Use Case**: Testing application behavior across online/offline environments
**Architecture**: Environment variable detection with configurable mock factories
**New Features**: CODEX/OFFLINE_MODE environment variable support, enhanced mock axios factory, comprehensive adapter creation

### 6. HTTP Integration Testing (`httpTest`)
**Purpose**: Lightweight supertest alternative without external dependencies
**Use Case**: Integration testing of HTTP endpoints and applications
**Architecture**: Node.js core http module with Express-compatible mock applications
**Features**: Method chaining, automatic JSON parsing, route parameters, status expectations

### 7. In-Memory Database Models (`mockModels`)
**Purpose**: Mongoose-compatible models without database dependencies for unit testing
**Use Case**: Testing data-dependent applications without database setup
**Architecture**: In-memory collections with comprehensive Mongoose API compatibility
**Features**: CRUD operations, query chaining, pre-built models (ApiKey, ApiLog), custom model factory

### 8. Enhanced Test Helper Utilities (`testHelpers`)
**Purpose**: Centralized test utilities with Node.js test module integration and selective environment management
**Use Case**: Shared testing logic across test suites with framework-agnostic patterns
**Architecture**: Enhanced utilities supporting both Jest and vanilla Node.js testing environments
**Features**: Selective environment backup/restore, framework-agnostic response mocks, thread-safe module reloading, HTTP endpoint testing support

### 9. Email Mock System (`sendEmail`)
**Purpose**: Lightweight email mocking for testing notification systems without external mail service dependencies
**Use Case**: Testing user registration, password resets, and email-dependent workflows
**Architecture**: Zero-dependency email mock with structured data return and comprehensive history tracking
**Features**: Basic email sending, batch processing, template system, email validation, history management, error handling

### 10. Comprehensive Test Suite Utilities (`testSuite`)
**Purpose**: Eliminates duplicate patterns across test suites by centralizing setup, teardown, mocking, and assertion patterns
**Use Case**: Large projects requiring consistent testing patterns, reducing boilerplate code across test files
**Architecture**: Class-based utilities with builder pattern for flexible configuration, zero external dependencies
**Features**: Database testing helpers, mock management system, assertion helpers, test data factory, performance testing, fluent configuration API

### 11. Automatic Test Generator (`TestGenerator`)
**Purpose**: Automatically generates unit tests and API tests by scanning and analyzing JavaScript/TypeScript source code
**Use Case**: Rapid test scaffolding for existing codebases, maintaining test coverage as projects grow
**Architecture**: Static code analysis with pattern matching to detect exports, imports, and API routes
**Features**: CLI tool (qtests-generate), unit test generation for exported functions/classes, API test generation for Express routes, automatic mock setup for known libraries, Jest configuration scaffolding, TypeScript/JSX support

### 12. Lightweight Test Runner (`runTestSuite`)
**Purpose**: Simple test execution engine for quick testing scenarios without full framework overhead
**Use Case**: Rapid prototyping, educational examples, simple testing where Jest setup is unnecessary
**Architecture**: Zero-dependency test runner with pass/fail tracking and formatted console output
**Features**: Individual test suite execution, multiple suite orchestration, built-in assertion helpers, visual test result indicators, integration with other qtests utilities

## Data Flow

### Setup Phase
1. User calls `require('qtests/setup')` or `setup()` function
2. Node.js module resolution is patched globally
3. Subsequent `require()` calls are intercepted and redirected to stubs

### Testing Phase
1. Test imports modules normally (e.g., `require('axios')`)
2. Module resolution returns stub implementations instead of real modules
3. Test utilities (stubMethod, mockConsole) provide additional isolation
4. Environment utilities manage test state and cleanup

### Cleanup Phase
1. Explicit restoration functions return objects to original state
2. Environment variables are restored to pre-test values
3. Console methods are restored to original implementations

## External Dependencies

### Production Dependencies
- `@types/node` - TypeScript definitions for Node.js APIs
- `axios` - Real HTTP client (used as reference for stub implementation)

### Development Dependencies
- `jest` - Testing framework (optional, framework provides fallbacks)
- `winston` - Logging library (used as reference for stub implementation)

### Optional Dependencies
- `qerrors` - Error reporting module (gracefully handled when missing)

## Deployment Strategy

### Package Distribution
- **Target**: npm registry as `qtests` package
- **Entry Point**: `index.js` with organized utility exports
- **Setup**: Automatic via `require('qtests/setup')` or explicit `setup()` call

### Integration Patterns
1. **Jest Integration**: Automatic setup via `setupFiles` configuration
2. **Mocha Integration**: Manual setup in test files before other requires
3. **Vanilla Node.js**: Direct require of setup module

### Replit Configuration
- **Entry Point**: `index.js`
- **Runtime**: Node.js 20 module
- **Deployment**: Autoscale with port detection disabled

## Changelog
- June 17, 2025. Initial setup
- June 17, 2025. Enhanced offline mode with environment variable detection (CODEX, OFFLINE_MODE)
- June 17, 2025. Added mock axios factory with configurable response behavior
- June 17, 2025. Implemented environment-aware adapter pattern for seamless online/offline testing
- June 17, 2025. Added comprehensive test coverage for new functionality
- June 17, 2025. Integrated lightweight HTTP testing client (supertest alternative) with zero dependencies
- June 17, 2025. Added Express-compatible mock application support with route parameters
- June 17, 2025. Enhanced integration testing capabilities with automatic JSON parsing and status validation
- June 17, 2025. Implemented in-memory Mongoose model replacements for database-free unit testing
- June 17, 2025. Added pre-built ApiKey and ApiLog models with comprehensive CRUD operations
- June 17, 2025. Created custom model factory and query chaining system with full Mongoose API compatibility
- June 17, 2025. Enhanced test helper utilities with Node.js test module integration and selective environment management
- June 17, 2025. Added framework-agnostic response mocks supporting both Jest and vanilla Node.js environments
- June 17, 2025. Implemented thread-safe module reloading and HTTP endpoint testing capabilities for shared test logic
- June 17, 2025. Created comprehensive sendEmail utility for lightweight email mocking without external mail service dependencies
- June 17, 2025. Added email template system with welcome, notification, and reset password templates
- June 17, 2025. Implemented batch email processing, history tracking, and comprehensive error handling for email workflows
- June 17, 2025. Developed comprehensive testSuite utilities for eliminating duplicate patterns across test suites
- June 17, 2025. Added database testing helpers, mock management system, assertion helpers, and test data factory
- June 17, 2025. Implemented performance testing utilities with timing constraints, concurrency testing, and memory measurement
- June 17, 2025. Reorganized /lib directory structure by functionality: coreUtils (core testing), httpUtils (HTTP testing), dataUtils (data/database), testUtils (advanced testing), envUtils (main entry point)
- July 29, 2025. Added automatic test generator functionality with CLI tool (qtests-generate) for scanning source code and generating unit tests and API tests
- July 29, 2025. Implemented TestGenerator class with support for JavaScript/TypeScript/JSX files, Express route detection, and automatic mock setup
- July 29, 2025. Created CLI interface with help/version commands, configurable source and test directories, and comprehensive test scaffolding
- July 29, 2025. Added integration with Jest configuration, automatic directory creation, and pattern-based code analysis for exports and imports
- August 8, 2025. Added lightweight test runner functionality (runTestSuite, runTestSuites, createAssertions) for simple testing scenarios
- August 8, 2025. Implemented zero-dependency test execution engine with pass/fail tracking and formatted console output
- August 8, 2025. Created comprehensive assertion helper library with equality, truthiness, error handling, and object/array validation
- August 8, 2025. Added integration between test runner and existing qtests utilities (stubMethod, mockConsole) for enhanced testing capabilities
- August 17, 2025. Successfully implemented qtests dogfooding - qtests now tests itself using its own utilities (mockConsole, testEnv, stubMethod, runTestSuite)
- August 17, 2025. Achieved 100% test suite success - all 25 test files passing with 0 failures, demonstrating qtests comprehensive testing capabilities
- August 17, 2025. Validated qtests can replace Jest for its own testing needs, proving the framework's maturity and self-sufficiency
- August 17, 2025. Renamed CLI test runner from 'runner' to 'make-qtester' for better naming convention and clarity
- August 17, 2025. Restructured CLI as proper npm module with bin/qtests-runner that works from any directory when installed globally
- August 17, 2025. Renamed test-runner.js to qtests-runner.js for consistent naming convention with CLI command
- August 17, 2025. Simplified qtests-generate to automatically create qtests-runner.js and update package.json test script
- August 17, 2025. Fixed testGenerator test by converting from Jest syntax to qtests' own testing framework - all 25/25 tests now passing

## User Preferences

- Preferred communication style: Simple, everyday language
- Keep functionality simple - avoid unnecessary flags or options
- Don't add complexity unless explicitly requested