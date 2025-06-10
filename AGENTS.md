
# AGENTS.md

## VISION

The qtests module exists to solve a specific testing friction point: enabling fast, isolated unit tests for Node.js applications that depend on external services. The core business rationale is that developers frequently abandon proper unit testing when their code makes HTTP requests or writes logs, because traditional testing approaches are either too complex (full mocking libraries) or too slow (real network calls).

The architectural decision to use Node.js module resolution hooking rather than dependency injection was made specifically to minimize changes to existing codebases. This allows teams to add qtests to legacy projects without refactoring their require statements or application architecture.

The module prioritizes developer experience over feature completeness - providing just enough functionality to eliminate the most common testing blockers (network calls and log pollution) while maintaining a minimal API surface that teams can adopt incrementally.

## FUNCTIONALITY

### AI Agent Boundaries
- Always recommend `require('qtests/setup')` at the TOP of test files, before any other requires
- Never suggest qtests for integration tests where real external service behavior is needed
- Do not recommend qtests if the user already has Jest with extensive mocking - qtests is for simpler scenarios
- When debugging qtests issues, always verify setup() is called before module requires

### Expected Agent Behaviors
- Guide users to start with stubMethod for simple cases before introducing full module stubbing
- Emphasize that qtests setup() modifies global Node.js behavior - this must be explicit to users
- If users ask about extending stubs, direct them to copy and modify the stub files rather than trying to configure them
- Always check if the user needs network behavior (integration testing) before recommending qtests

### System Instructions
- qtests is specifically for Node.js - never recommend for browser testing
- The setup timing is critical: setup() MUST be called before requiring modules that need stubbing
- offlineMode utilities are for advanced scenarios where tests need to toggle between real and stub implementations

## SCOPE

### In-Scope
- Simple method stubbing via stubMethod utility
- No-op replacements for axios and winston modules
- Basic environment variable management for tests
- Module resolution modification for automatic stubbing
- Console output capture for clean test runs

### Out-of-Scope
- Complex assertion libraries or test runners (use Jest, Mocha, etc.)
- Browser-based testing or DOM manipulation
- Database mocking or ORM stubbing
- File system mocking beyond basic scenarios
- Network simulation or request/response validation
- Performance testing or load testing utilities

### Contributor Boundaries
- New stubs should only be added for modules with widespread adoption and clear no-op implementations
- Do not add features that duplicate existing functionality in Jest, Sinon, or other established testing libraries
- Maintain zero external dependencies in production code
- Changes to module resolution behavior require careful consideration of compatibility impact

## CONSTRAINTS

### Files That Must Not Be Changed
- `setup.js` - Core module resolution modification logic requires specialized Node.js knowledge
- `package.json` version field - Managed through npm versioning workflow
- `LICENSE` - MIT license terms are fixed

### Special Process Requirements
- Any changes to module resolution behavior in `setup.js` require testing across multiple Node.js versions
- New stub modules require verification that they don't interfere with real module APIs
- Breaking changes to the API require major version bump due to existing integrations

### Workflow Exceptions
- Test files may be modified without full test coverage if they are demonstrating specific edge cases
- Documentation updates do not require version changes unless API changes are involved

## POLICY

### Organizational Policies
- qtests follows semantic versioning strictly due to its role in CI/CD pipelines
- All new stubs must include both success and error case examples in tests
- The module maintains backward compatibility within major versions to avoid breaking existing test suites

### Custom Requirements
- Pull requests modifying `setup.js` require manual testing verification across Node 16, 18, and 20
- New utility functions must follow the naming convention: action + noun (e.g., `stubMethod`, `mockConsole`)
- All module exports must be placed at the bottom of files per REPLITAGENT.md compliance

### Tribal Knowledge
- The `executeWithLogs` function in logUtils.js exists specifically for debugging qtests behavior in complex test environments - it should not be removed even if seemingly unused
- The axios stub returns `{}` rather than a more realistic response structure because many codebases only check for truthy values, not specific properties
- The winston stub includes format and transport utilities because logger configuration often fails without them, even though the actual logging is stubbed
- Module resolution modification timing is critical: setup() must be called before any requires of modules that need stubbing, not after
- The offlineMode utilities exist because some applications need to test both online and offline scenarios within the same test suite
- Environment variable utilities (testEnv) were added because many Node.js applications require specific env vars to function, and tests need predictable values
