# Architecture Overview

This npm module provides utility functions for (TBD). 

## Single Responsibility Principle
The module architecture obeys SRP (Single Responsibility Principle),
each file encapsulates one concrete responsibility:
* One function per file so that any change in that behavior only ever touches that one file.
* Clear naming.
* Minimal imports/exports so that a file’s public interface is singular and dependencies stay tight.
* Easier reasoning for devs and LLM agents.
* Simpler testing (one test per file).
* Lower coupling (changes in “createUser” never ripple into “sendEmail”).
* Better AI‐friendliness (LLMs only load the 30 lines they need, not a 500-line blob), lowering token use.
* Easier assignment of parallel LLM editing that avoids merge conflicts

## Global Constants & Environment Variable Exporting
Theres a file `/config/localVars.js`, this file stores all hardcoded constants in the app so we have a single source of truth for variable names, 
and LLMs cannot mutate variable names. New values may be added, but existing values must not be modified, deleted, or moved. 
Values are grouped by category when first introduced. They are grouped under existing categories if they exists, or a new section 
(with a new comment header) if it’s a new category. Do not move or re-categorize existing values. 
Ensure that no duplicates or slight variations of existing values are added. All environment variables are defined here 
(example: export const envVar = process.env.ENV_VAR) and exported for use from here on the same line using the export keyword. 
No where else in the codebase should cite and use environment variables directly but should import them from here. 
Don't move or re-categorize existing values. If a variable/value is a duplicate or unused you may not delete it but may flag it & uncomment with a comment "REMOVE?". 
Remember in all this, never edit a constant once it resides in localVars.js; never create a section whose header already exists. 
When importing these variables into other files that use them, import the entire object and not just the variable needed 
(What I mean is import as: const localVars = require('../config/localVars'); and use as localVars.variable in context that use a variable. 
DO NOT import as: require const { variable } = require('../config/localVars'); as this becomes a huge and messy list.); 
this avoids merge conflicts that are huge and confusing to analyze the many imported variables from localVars.js. 
When you use a value in a file, doublecheck what that value is called in localVars.js EXACTLY to avoid hallucinating the variable name.

## Architectural Components
This architecture consists of:
1. **Entry Point**: `index.js`
   - Exports public functions from the library
2. **Core Library**: `lib/` directory
   - Contains utility implementations
   - `index.js`: Aggregates exports from library files
3. **Configuration**: `config/` directory
   - `localVars.js`: Environment variables loader and Constants definer

The module follows a simple export pattern where all public functionality is exposed through the main `index.js` file.