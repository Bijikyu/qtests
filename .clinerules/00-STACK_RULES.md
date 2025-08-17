# NPM & JAVASCRIPT STACK RULES

<!--┌── 🚫 PROTECTED: DO NOT EDIT (READ ONLY) BELOW THIS LINE-->
## ADDITIONAL SPECIFIC GUIDANCE
Beyond the general rules here, rules and guidance for specific areas can be found at these locations.
- **Architecture patterns** → see `.roo/rules/01-NPM_architecture.md` for details on SRP, etc

## AGENT CLI TOOLS
You can use the command line to activate scripts that will assist you:
npm test - this runs all tests.

## POLICIES

### DEVELOPMENT & CHANGES:
Devs & AI agents working with this library should:
Include detailed JSDoc/TSDoc with clear @param/@returns tags and TypeScript interfaces.
Implement tests for files or functionality created. Integration tests live in a tests folder at root. Other tests live with the file/s they test. All tests are ran by `test-runner.js`.

### ERROR HANDLING:
Use the npm module named "qerrors" for error logging in try/catch blocks:
qerrors(error, 'error context', req, res, next);, if it is not an express req/res function use 
qerrors(error, 'error context', {param1, param2, etc}); 
Include error type in JSDoc `@throws` declarations

### TESTING:
Use the exported functionality of npm module qtests in testing.
A top level test file `test-runner.js` should import all these tests & run them via test script in package.json.
In each *.test.ts[x], include a test-to-function mapping comment at the top:
```
// 🔗 Tests: createUserCtrl → createUserSvc → userMdl
```
This lets an LLM quickly reason about test coverage and impact.

### DEPENDENCY UTILIZATION & DEDUPLICATION
Use the module dependencies if they're useful! 
Don't duplicate modules' exported functionality - if an npm module provides functionality use that to keep our code DRY & lean.

### CODE WRITING
Other than in locarVars.js, all module exports at the bottom of a file, separate from function definitions. 
Strings in javascript will be written with ` as opposed to ' or  ", this is so it is easier to extend them later as string literals, do this unless there is a technical reason otherwise.
Naming Conventions: Function & variable names should describe their use and reveal their purpose; use js camelCase. 

## CONSTRAINTS

**Modules & Libraries**:
	 - I prefer axios to node fetch, use that always instead.
	 - I prefer isomorphic-git to simple-git, use that always instead.
	 - Do not remove repomix, loqatevars, unqommented or madge, they are CLI tools.

**You will not ever implement**:
	 - JQuery.
	 - p-limit.

<!--└── END PROTECTED RANGE 🚫-->

<!--AI Can write contraints from here on-->

