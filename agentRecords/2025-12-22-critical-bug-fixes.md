# Critical Bug Fixes - 2025-12-22

## ESM TypeScript Conversion - Post-Review Bug Corrections

After completing the ESM TypeScript conversion, code review identified **2 critical runtime bugs** in the HTTP test utilities that would cause undefined behavior and crashes.

## 🚨 Bug #1: Undefined URL Access in Query String Parsing

**Location**: `utils/httpTest.shim.ts`, line 160

**Problem**: 
```typescript
const qs = url.includes('?') ? url.split('?')[1] : '';
```

If `req.url` is `undefined` (allowed by `MockRequest.url?: string`), this code throws:
```
TypeError: Cannot read properties of undefined (reading 'includes')
```

**Fix Applied**:
```typescript
const qs = (url && url.includes('?')) ? url.split('?')[1] : '';
```

**Impact**: Prevents runtime crashes when requests have undefined URLs.

## 🚨 Bug #2: Route Matching Failure with Query Strings

**Location**: `utils/httpTest.shim.ts`, line 59

**Problem**:
```typescript
const key = String(req?.method || '').toUpperCase() + ' ' + String(req?.url || '');
```

Routes were registered as `'GET /test'` but requests came in as `'GET /test?foo=bar'`, causing 404 errors for any URL with query parameters.

**Fix Applied**:
```typescript
// Strip query string from URL for route matching
const url = req?.url || '';
const pathWithoutQuery = url.includes('?') ? url.split('?')[0] : url;
const key = String(req?.method || '').toUpperCase() + ' ' + pathWithoutQuery;
```

**Impact**: Enables proper route matching for URLs with query parameters while preserving query string parsing functionality.

## Verification

Both fixes have been verified to:
- ✅ Eliminate runtime crashes
- ✅ Enable correct query string parsing (`req.query`)
- ✅ Maintain route matching functionality
- ✅ Pass all existing tests
- ✅ Preserve full `req.url` (including query) for user code

## Test Results

All 3 test suites (7 tests) continue to pass after bug fixes:
- ✅ `resolveStubPaths.test.ts`
- ✅ `demo__server__app__get.test.js` 
- ✅ `demo__server__routes__hello__get.test.js`

Additional manual testing confirms:
- ✅ Query string parsing works: `/test?foo=bar&baz=qux` → `{foo: 'bar', baz: 'qux'}`
- ✅ Route matching works with and without query strings
- ✅ No crashes on undefined/null URLs

These fixes ensure the ESM TypeScript conversion is production-ready with robust HTTP testing utilities.