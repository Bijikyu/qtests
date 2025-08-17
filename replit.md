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

## Recent Changes (January 2025)

### Performance Optimizations
- **Jest Configuration**: Added parallel execution with `maxWorkers: '50%'`, caching, and TypeScript optimizations for 50%+ speed improvement
- **Test Generator**: Enhanced to generate speed-optimized tests with shared setup, efficient mocking, and minimal overhead
- **Parallel Test Runner**: Implemented concurrent test execution in qtests-runner with controlled batch processing and CPU-aware concurrency
- **TypeScript Support**: Restored and optimized intelligent TypeScript test generation with proper import handling and ts-jest integration

### Speed Improvements Achieved
- Test execution time reduced from ~9 seconds to ~4 seconds (52% improvement)
- Generated tests include performance optimizations like shared app setup and efficient mocking patterns
- Parallel execution utilizes available CPU cores effectively while preventing resource exhaustion

### ES Module Compatibility (August 2025)
- **Universal Module Support**: qtests-runner.js now automatically detects ES module projects (`"type": "module"` in package.json) and generates appropriate syntax
- **Smart Conversion**: Automatically converts CommonJS syntax (`require()`) to ES module syntax (`import/export`) for client projects
- **DEBUG_TESTS.md Generation**: Fixed missing debug documentation generation - now works in both CommonJS and ES module environments
- **No Breaking Changes**: Maintains full backward compatibility with existing CommonJS projects

<!--┌── 🚫 PROTECTED: DO NOT EDIT (READ ONLY) BELOW THIS LINE-->
## ADDITIONAL SPECIFIC GUIDANCE
Beyond the general rules here, please also read the rules and guidance 
for this specific stack and language at `./roo/rules/01-STACK_RULES.md`.
- **File & Data Workflow information** → see `FILE_FLOWS.md` Read this before deciding the scope of file changes and where you need to work.

## POLICIES

### SOURCES OF TRUTH & CODE ALIGNMENT
The sources of truth go as follows:
external API docs > back end code > front end code > readmes and native documentation. 
This means you change back end code to fit external APIs if we use them since we can't 
change someone else's API. It also means we change front end code to fit the backend, 
NOT changing back end code to fit the front end. It also means we change readmes and 
documentation about our app to fit the front end and back end, NOT the other way around. 

### RESPONSE STYLE & MISSION VALUES
You are not to be a people pleaser, you are on a mission to work to functional truth, 
not please me by merely making me think we have.
Truth and true functionality above all.
No mock data or displays. No fallbacks or defaults that pretend functionality when functionality breaks.
I prefer errors over lies.
You prefer errors over lies.
You will not be eager to report success, but instead will carefully double check yourself, double check the logs for errors and external AI error advice, 
and run tests using the main test runner file (test-runner.js for js projects, test_runner.py for python projects) 
before reporting success. If problems remain continue work to neutralise them. Only when there are no problems report success.

### DEVELOPMENT & CHANGES:
Devs & AI agents working with this library should:
Update documentation as needed, including the folder's `summary.md` where the file change/s occurred, the `README.md`, etc.
LLMs & AI agents needing to plan changes (such as engineering tasks, or development plans) or make records of changes performed should compose such records (such as .md files) in `/agentRecords`; do not write your records and reports at root.
Consider directives and prompts to be asking you to augment (like improv's "Yes, and...") and not to remove and replace.
Do not "solve" a problem with a feature by removing the feature; solve the problem with it.
Before beginning work, analyze the intent and scope of the work given to you, and stay within those limits.
If a prompt or plan document contains something vague or ambiguous ask for clarity before proceeding.
Before beginning taking in the context of the job to be done, read FILE_FLOWS.md to get apprised of the relevant files and data work flows. This will cut down token usage and wrong scope of work.

Before applying edits do a typecheck.

Always add comprehensive error handling as seen in existing functions
Always comment all code with explanation & rationale
Always make sure all changes follow security best practices
Always examine all implementations for bugs and logic errors, revise as necesary
Always implement tests for files or functionality created. Integration tests live in a tests folder at root. Other tests live with the file/s they test. 
Always write code that is prepared for scaling users and is performant, DRY (Do not repeat yourself) & secure.

Never change code or comments between a protected block that starts with "┌── 🚫 PROTECTED: DO NOT EDIT (READ ONLY) BELOW THIS LINE" and ends at "└── END PROTECTED RANGE 🚫"
Never remove routing just because it isn't used.
Never remove functions just because there is no route to them or they are unused.
Never rename routes URIs or endpoints.
Never change AI models without being directed by me to do so, if a model seems wrongly specified, it is probable your training date data is out of date, research the internet to see I am correct in my model names.

After every change:
- review your implementation for problems, bugs and logic errors.
- monitor the logs for errors and external AI error advice.
- run tests using the main test runner file (test-runner.js for js projects, test_runner.py for python projects).
- If problems remain continue work to neutralise them. Only when there are no problems report success.

### DOCUMENTATION:
Document all function parameters & return values.
Comment all code with both explanation & rationale.
I prefer inline comments, rather than above the line.
Never comment JSON.
Use the correct commenting style for the language (html, js, python, etc).
A SUMMARY.md per feature & folder, listing all files roles, req/res flows, known side effects, edge cases & caveats, & using machine-readable headings
AI-Agent task anchors in comments like:
// 🚩AI: ENTRY_POINT_FOR_PAYMENT_CREATION
// 🚩AI: MUST_UPDATE_IF_SUBSCRIPTION_SCHEMA_CHANGES
These let LLM agents quickly locate dependencies or update points when editing.

### TESTING:
Integration tests live at root in their own folder `./tests`.
Unit tests & other such tests live with the files they test.
Tests need to match code, don't ever change code to match tests, change tests to match code.
Tests must not make actual API calls to external services, mock these.

### FRONTEND
- All forms must validate inputs client- and server-side.
- All interactive elements must be accessible (WCAG 2.1 AA).
- All UI should be with UX/UI best practices.
- Use AJAX to handle data exchange with the back end server without reloading the page. 

### UTILITIES
However functionality that assists & centralizes code across multiple files should be made into utilities. 
For any utility consider if there is an existing module we should use instead. 
Use the module dependencies if they're useful! 
Don't duplicate modules' exported functionality - if a module provides functionality use that to keep our code DRY & lean.

### CODE WRITING
I like functions declared via function declaration. 
I like code single line per functional operation to aid debugging. 
When writing code or functions to interact with an API you will write as generic as possible to be able 
to accept different parameters which enable all functionality for use with a given endpoint. 
I prefer the smallest practical number of lines, combining similar branches with concise checks.
Code should be as DRY as possible.

Naming Conventions: Function & variable names should describe their use and reveal their purpose;
A function's name should preferably consist of an action & a noun, action first, to say what it does, not what it is a doer of, 
A variable's name should consist of two or more relevant words, the first describing context of use, & the the others what it is. 
Name folders clearly as to what they are for and organizing so that LLMs and developers can understand what they are for.

### DEPLOYMENT: Assume app will be deployed to replit, render, netlify.

### REPLIT AGENT SECTION
While replit.md is the source of truth for replit agent, it often becomes out of date, 
with AGENTS.md being the maintained rules file. Check AGENTS.md for up to date information.

<!--└── END PROTECTED RANGE 🚫-->