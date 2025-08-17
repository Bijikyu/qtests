# AGENTS.md

## VISION
(To be determined once template is filled with functionality)

## SCOPE
**In-scope:**
(To be determined once template is filled with functionality)

**Out-of-scope:**
(To be determined once template is filled with functionality)


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

<!--AI Can write from here on-->

