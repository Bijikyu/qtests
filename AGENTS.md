
# AGENTS.md

## VISION

The qtests module exists to solve a specific testing friction point: enabling fast, isolated unit tests for Node.js applications that depend on external services. The core business rationale is that developers frequently abandon proper unit testing when their code makes HTTP requests or writes logs, because traditional testing approaches are either too complex (full mocking libraries) or too slow (real network calls).

The architectural decision to use Node.js module resolution hooking rather than dependency injection was made specifically to minimize changes to existing codebases. This allows teams to add qtests to legacy projects without refactoring their require statements or application architecture.

The module prioritizes developer experience over feature completeness - providing just enough functionality to eliminate the most common testing blockers (network calls and log pollution) while maintaining a minimal API surface that teams can adopt incrementally.

## FUNCTIONALITY

### AI Agent Boundaries
- Always recommend `require('@bijikyu/qtests/setup')` at the TOP of test files, before any other requires
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

### Background & Passive Solutions (Authoritative)
- Do not require the user to change their workflow; basic operations stay as-is (e.g., `npm publish`, `npm test`).
- Never ask the user to set custom environment variables, extra flags, or run alternate commands to achieve standard tasks.
- Implement safeguards and hardening passively (in background automation or default configs) so the user does not have to think about them.
- Any CI-only checks must not block local developer flows; local publish must succeed via plain `npm publish`.
- Keep tooling quiet and non-interactive by default; avoid prompts and extra steps unless explicitly requested.

### Tribal Knowledge
- The `executeWithLogs` function in logUtils.js exists specifically for debugging qtests behavior in complex test environments - it should not be removed even if seemingly unused
- The axios stub returns `{}` rather than a more realistic response structure because many codebases only check for truthy values, not specific properties
- The winston stub includes format and transport utilities because logger configuration often fails without them, even though the actual logging is stubbed
- Module resolution modification timing is critical: setup() must be called before any requires of modules that need stubbing, not after
- The offlineMode utilities exist because some applications need to test both online and offline scenarios within the same test suite
- Environment variable utilities (testEnv) were added because many Node.js applications require specific env vars to function, and tests need predictable values

### Runner Policies (Authoritative)
- `bin/qtests-ts-runner` is sacrosanct: never generated, never overwritten. It must retain:
  - Test discovery, batching/parallelism, per-file Jest execution
  - Summary reporting and creation of `DEBUG_TESTS.md` on failures
  - Colorized output and stable exit codes
- The generator may only scaffold `qtests-runner.mjs` (ESM). It is safe to delete and will be recreated. The generator MUST NOT create/modify `bin/qtests-ts-runner`.
- Jest invocation policy (all runners): always run `jest --config config/jest.config.mjs --passWithNoTests ...args`. Do not launch tests via `tsx` to avoid IPC/sandbox issues.
- Any change to `bin/qtests-ts-runner` must be additive (no feature loss) and accompanied by tests that assert:
  - Batching is preserved, `DEBUG_TESTS.md` is created on failures
  - Jest is called with the required `--config` and `--passWithNoTests`
  - No use of `tsx` in the CLI implementation
- Respect `QTESTS_SILENT=1|true` to suppress non-essential setup logs in CI.
 - Single runner policy: `qtests-runner.mjs` is the only generated/consumed project runner. Do not create, reference, or maintain duplicate runners (e.g. `qtests-runner.js`) or context-specific variants.


## Runner Stability & Client Integration (Authoritative)

- Execution: API-only via Jest `runCLI` (no child processes). Do not shell-spawn and do not invoke `tsx`.
- Required options: Always use project config (`config/jest.config.mjs`) and `passWithNoTests=true`; also set `cache=true` and `coverage=false`.
- Discovery: Skip `dist/` and `build/` during test discovery; ignore `__mocks__` folders and non-GeneratedTest files under `generated-tests/`.
- Manual-tests order: Run `tests/manual-tests/**` serially before parallel batches to avoid cross‑test interference with runner scaffolding.
- Environment: Do not force `NODE_OPTIONS=--experimental-vm-modules`. Respect `QTESTS_INBAND`, `QTESTS_FILE_WORKERS`, `QTESTS_CONCURRENCY`, `QTESTS_PATTERN`.
- Debug artifacts: Create `DEBUG_TESTS.md` when any file fails (unless `QTESTS_SUPPRESS_DEBUG` or `QTESTS_NO_DEBUG_FILE` is true). Allow overriding path via `QTESTS_DEBUG_FILE`.
- Jest config hardening: Add `modulePathIgnorePatterns` and `watchPathIgnorePatterns` for `<rootDir>/dist/` and `<rootDir>/build/` to avoid duplicate manual mocks.
- ESM require: Provide a pre‑setup CommonJS `require` via `config/jest-require-polyfill.cjs` (added to `setupFiles`) and keep `createRequire(import.meta.url)` polyfill in `config/jest-setup.ts`. Always import `@bijikyu/qtests/setup` first in `setupFilesAfterEnv`.
- Dist hygiene: Prefer ignoring `dist/` in Jest config; optional belt‑and‑suspenders script can delete `dist/**/__mocks__` and compiled `*.test.*` before running tests.

### Generator & Templates (non‑negotiable)
- The generator may only scaffold `qtests-runner.mjs` and MUST mirror the policies above: API‑only `runCLI`, required options, discovery ignores, no `NODE_OPTIONS` forcing.
- `scripts/ensure-runner.mjs` must copy the on‑package template; templates must remain in sync with `bin/qtests-ts-runner` behavior.
- Tests that regenerate the runner must not leave the repo without a runner (no cleanup that deletes `qtests-runner.mjs` post‑test).

### Client Projects
- Clients should adopt the provided `config/jest.config.mjs` and `config/jest-require-polyfill.cjs` to guarantee `require(...)` availability in ESM tests and to ignore `dist/`/`build/`.
- If clients use package scripts, recommend a `pretest` step to remove `dist/**/__mocks__` and compiled `*.test.*` or rely on the ignore patterns above.
- Environment toggles supported by runner: `QTESTS_INBAND`, `QTESTS_FILE_WORKERS`, `QTESTS_CONCURRENCY`, `QTESTS_PATTERN`, `QTESTS_API_FALLBACK`, `QTESTS_SUPPRESS_DEBUG`, `QTESTS_NO_DEBUG_FILE`, `QTESTS_DEBUG_FILE`.
- Never suggest running tests via `tsx`; always via `jest --config config/jest.config.mjs --passWithNoTests`.


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
