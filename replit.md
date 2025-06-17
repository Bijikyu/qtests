# qtests - Node.js Testing Framework

## Overview

qtests is a comprehensive Node.js testing framework that provides zero-dependency utilities for fast, isolated unit testing. The framework focuses on solving specific testing friction points by enabling automatic module stubbing, method replacement, and environment management without requiring changes to existing application code.

## System Architecture

### Core Architecture Pattern
The qtests framework uses a **module resolution hooking** architecture that patches Node.js's global `Module._resolveFilename` method to intercept `require()` calls and redirect them to stub implementations during testing. This approach was chosen over dependency injection to minimize changes to existing codebases.

### Directory Structure
- `lib/` - Core framework modules organized by functionality
- `utils/` - Individual utility implementations 
- `stubs/` - Drop-in replacements for common libraries (axios, winston)
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

## User Preferences

Preferred communication style: Simple, everyday language.