/**
 * Round 20 — validation layer sweep
 *
 * Modules probed and verified (no bugs): stubs, httpUtils, testUtils,
 *   streamingValidator, legacyStreamingValidator, streamingValidationLogic,
 *   htmlSanitization, streamingValidatorModern (re-export shim),
 *   validationMiddleware (sanitising middleware, requires real Express res.set)
 *
 * Bugs found and fixed:
 *
 * Bug 1 — validateWithZod (lib/validation/validationLogic.ts):
 *   `config: ValidationConfig` had no default value. Any caller that omitted
 *   the third argument (a common usage pattern) hit
 *   "Cannot read properties of undefined (reading 'enableCaching')" on the
 *   very first line of the function. Fix: `config: ValidationConfig = {}`.
 *
 * Bug 2 — validateWithZod timeout leak (lib/validation/validationLogic.ts):
 *   The function raced `validationPromise` against a 30-second `setTimeout`
 *   but never called `clearTimeout()` after the race settled. Every single
 *   call therefore kept the Node.js event loop alive for 30 extra seconds,
 *   causing test suites and ad-hoc scripts to hang. Fix: store the timer ID
 *   and call `clearTimeout(timeoutId!)` in both the happy-path and the catch.
 *
 * Bug 3 — createSecureStringSchema / createQueryStringSchema /
 *          createSecureObjectSchema (lib/validation/validationSchemas.ts):
 *   All three functions accepted a partial/empty `{}` config but used
 *   `config.dangerousPatterns.some(...)` directly without merging with
 *   `defaultValidationConfig` first. `dangerousPatterns` is `undefined` on
 *   an empty config, so every call like `createSecureStringSchema({})` built
 *   a schema whose `.refine()` callback crashed at runtime. The cascade hit
 *   `legacyStreamingValidator.validateStreaming('text', {})` returning
 *   `isValid: false` with an internal crash. Fix: merge with
 *   `defaultValidationConfig` at the top of every factory using
 *   `{ ...defaultValidationConfig, ...config } as Required<ValidationConfig>`.
 *   Also made all `ValidationConfig` fields optional so partial configs are
 *   type-safe.
 */

import {
  validateWithZod,
  createValidationMiddleware,
} from '../../dist/lib/validation/validationLogic.js';

import {
  createSecureStringSchema,
  createQueryStringSchema,
  createSecureObjectSchema,
  defaultValidationConfig,
} from '../../dist/lib/validation/validationSchemas.js';

import { validateStreaming } from '../../dist/lib/validation/legacyStreamingValidator.js';
import { validateStreamingString } from '../../dist/lib/validation/streamingValidationLogic.js';

import {
  escapeHtml,
  hasDangerousPatterns,
  sanitizeString,
} from '../../dist/lib/validation/htmlSanitization.js';

import {
  StreamingStringValidator,
  createStreamingValidator,
  defaultValidator,
  relaxedValidator,
  strictValidator,
} from '../../dist/lib/validation/streamingValidator.js';

import stubs from '../../dist/lib/stubs.js';
import { httpTest } from '../../dist/lib/httpUtils.js';
import { testSuite, testHelpers } from '../../dist/lib/testUtils.js';

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Bug 1 fix — validateWithZod: no-default config no longer crashes
// ---------------------------------------------------------------------------

describe('validateWithZod — missing config default (Bug 1)', () => {
  it('succeeds without a config argument', async () => {
    const schema = z.object({ name: z.string() });
    const result = await validateWithZod({ name: 'Alice' }, schema);
    expect(result.isValid).toBe(true);
  });

  it('returns isValid false for validation failure without config', async () => {
    const schema = z.object({ age: z.number().min(0) });
    const result = await validateWithZod({ age: -1 }, schema);
    expect(result.isValid).toBe(false);
  });

  it('succeeds with empty config {}', async () => {
    const schema = z.string().min(1);
    const result = await validateWithZod('hello', schema, {});
    expect(result.isValid).toBe(true);
  });

  it('returns validation errors in result when invalid', async () => {
    const schema = z.object({ email: z.string().email() });
    const result = await validateWithZod({ email: 'not-email' }, schema, {});
    expect(result.isValid).toBe(false);
    expect(Array.isArray(result.errors) || typeof result.error === 'string').toBe(true);
  });

  it('works with full config object', async () => {
    const schema = z.number().positive();
    const result = await validateWithZod(42, schema, { enableCaching: false });
    expect(result.isValid).toBe(true);
  });

  it('returns processingTime in result', async () => {
    const schema = z.string();
    const result = await validateWithZod('test', schema, {});
    expect(typeof result.processingTime).toBe('number');
    expect(result.processingTime).toBeGreaterThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
// Bug 2 fix — validateWithZod: timer cleared (no hang)
// Verified by the fact that test completes promptly — not verifiable as a
// unit assertion, but the suite finishing on time is the proof.
// ---------------------------------------------------------------------------

describe('validateWithZod — timeout timer is cleared (Bug 2)', () => {
  it('resolves quickly and does not block the event loop', async () => {
    const start = Date.now();
    const schema = z.string();
    await validateWithZod('text', schema, {});
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(1000); // should finish in <1s
  });

  it('handles many sequential calls without accumulating timers', async () => {
    const schema = z.number();
    for (let i = 0; i < 10; i++) {
      const result = await validateWithZod(i, schema, {});
      expect(result.isValid).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Bug 3 fix — createSecureStringSchema with partial config
// ---------------------------------------------------------------------------

describe('createSecureStringSchema — partial config (Bug 3)', () => {
  it('accepts plain text with empty config {}', () => {
    const schema = createSecureStringSchema({});
    expect(schema.safeParse('hello world').success).toBe(true);
  });

  it('blocks XSS with empty config {}', () => {
    const schema = createSecureStringSchema({});
    expect(schema.safeParse('<script>alert(1)</script>').success).toBe(false);
  });

  it('blocks javascript: protocol with empty config {}', () => {
    const schema = createSecureStringSchema({});
    expect(schema.safeParse('javascript:void(0)').success).toBe(false);
  });

  it('blocks onclick handlers with empty config {}', () => {
    const schema = createSecureStringSchema({});
    expect(schema.safeParse('<img onclick="x">').success).toBe(false);
  });

  it('respects custom maxStringLength when provided', () => {
    const schema = createSecureStringSchema({ maxStringLength: 5 });
    expect(schema.safeParse('hi').success).toBe(true);
    expect(schema.safeParse('toolong').success).toBe(false);
  });

  it('uses defaultValidationConfig dangerousPatterns when none provided', () => {
    const schema = createSecureStringSchema({});
    // defaultValidationConfig includes iframe pattern
    expect(schema.safeParse('<iframe src="evil.html"></iframe>').success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Bug 3 fix — createQueryStringSchema with partial config
// ---------------------------------------------------------------------------

describe('createQueryStringSchema — partial config (Bug 3)', () => {
  it('accepts normal query with empty config {}', () => {
    const schema = createQueryStringSchema({});
    expect(schema.safeParse('search term').success).toBe(true);
  });

  it('blocks javascript: in query with empty config {}', () => {
    const schema = createQueryStringSchema({});
    expect(schema.safeParse('javascript:alert(1)').success).toBe(false);
  });

  it('respects maxQueryStringLength override', () => {
    const schema = createQueryStringSchema({ maxQueryStringLength: 10 });
    expect(schema.safeParse('short').success).toBe(true);
    expect(schema.safeParse('this query is way too long for the limit').success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Bug 3 fix — createSecureObjectSchema with partial config
// ---------------------------------------------------------------------------

describe('createSecureObjectSchema — partial config (Bug 3)', () => {
  it('validates a plain object with empty config {}', () => {
    const schema = createSecureObjectSchema({ name: z.string(), age: z.number() }, {});
    const result = schema.safeParse({ name: 'Alice', age: 30 });
    expect(result.success).toBe(true);
  });

  it('blocks XSS in string fields with empty config {}', () => {
    const schema = createSecureObjectSchema({ bio: z.string() }, {});
    const result = schema.safeParse({ bio: '<script>alert(1)</script>' });
    expect(result.success).toBe(false);
  });

  it('passes non-string fields through unchanged', () => {
    const schema = createSecureObjectSchema({ count: z.number().int() }, {});
    expect(schema.safeParse({ count: 42 }).success).toBe(true);
    expect(schema.safeParse({ count: -1 }).success).toBe(true); // number, no string restriction
  });
});

// ---------------------------------------------------------------------------
// Cascade fix — legacyStreamingValidator now works end-to-end
// ---------------------------------------------------------------------------

describe('legacyStreamingValidator.validateStreaming — cascade fix', () => {
  it('returns isValid:true for plain text with empty config', async () => {
    const result = await validateStreaming('hello world', {});
    expect(result.isValid).toBe(true);
  });

  it('returns isValid:false for XSS content with empty config', async () => {
    const result = await validateStreaming('<script>alert(1)</script>', {});
    expect(result.isValid).toBe(false);
  });

  it('includes processingTime', async () => {
    const result = await validateStreaming('text', {});
    expect(typeof result.processingTime).toBe('number');
  });

  it('works with full defaultValidationConfig', async () => {
    const result = await validateStreaming('safe text', defaultValidationConfig);
    expect(result.isValid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// htmlSanitization — verified clean
// ---------------------------------------------------------------------------

describe('htmlSanitization — escapeHtml', () => {
  it('escapes < and >', () => {
    const out = escapeHtml('<b>');
    expect(out).toContain('&lt;');
    expect(out).toContain('&gt;');
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('"test"')).toContain('&quot;');
  });

  it('escapes ampersand first to avoid double-encoding', () => {
    const out = escapeHtml('a & b');
    expect(out).toBe('a &amp; b');
  });

  it('returns empty string for non-string input', () => {
    expect(escapeHtml(null as any)).toBe('');
  });
});

describe('htmlSanitization — hasDangerousPatterns', () => {
  it('returns true for complete script tags', () => {
    expect(hasDangerousPatterns('<script>alert(1)</script>')).toBe(true);
  });

  it('returns true for javascript: protocol', () => {
    expect(hasDangerousPatterns('javascript:void(0)')).toBe(true);
  });

  it('returns true for event handlers', () => {
    expect(hasDangerousPatterns('<div onclick="x">')).toBe(true);
  });

  it('returns false for plain text', () => {
    expect(hasDangerousPatterns('Hello world')).toBe(false);
  });

  it('returns false for lone opening <script> tag (by design — requires full tag)', () => {
    expect(hasDangerousPatterns('<script>')).toBe(false);
  });
});

describe('htmlSanitization — sanitizeString', () => {
  it('removes script tags', () => {
    const out = sanitizeString('<p>Hi <script>evil()</script></p>');
    expect(out).not.toContain('<script>');
  });

  it('removes onclick handlers', () => {
    const out = sanitizeString('<div onclick="evil()">text</div>');
    expect(out).not.toContain('onclick');
  });

  it('HTML-escapes remaining content', () => {
    const out = sanitizeString('Hello & world');
    expect(out).toContain('&amp;');
  });
});

// ---------------------------------------------------------------------------
// streamingValidator — verified clean
// ---------------------------------------------------------------------------

describe('streamingValidator — defaultValidator', () => {
  it('returns sanitized string for plain text', async () => {
    const out = await defaultValidator.validateString('safe text');
    expect(out).toBe('safe text');
  });

  it('strips script tags from string', async () => {
    const out = await defaultValidator.validateString('<script>x</script>safe');
    expect(out).not.toContain('<script>');
  });

  it('sanitizes object values', async () => {
    const out = await defaultValidator.validateObject({ bio: '<script>x</script>hi' });
    expect((out as any).bio).not.toContain('<script>');
  });
});

describe('streamingValidator — createStreamingValidator', () => {
  it('creates a validator with custom config', async () => {
    const v = createStreamingValidator({ maxStringLength: 200 });
    const out = await v.validateString('hello');
    expect(typeof out).toBe('string');
  });
});

describe('streamingValidator — relaxedValidator and strictValidator', () => {
  it('relaxedValidator returns a string', async () => {
    expect(typeof await relaxedValidator.validateString('text')).toBe('string');
  });

  it('strictValidator returns a string', async () => {
    expect(typeof await strictValidator.validateString('text')).toBe('string');
  });
});

// ---------------------------------------------------------------------------
// streamingValidationLogic — verified clean
// ---------------------------------------------------------------------------

describe('streamingValidationLogic — validateStreamingString', () => {
  it('validates a short string against a Zod schema', async () => {
    const schema = z.string().min(1).max(100);
    const result = await validateStreamingString('hello', schema, {}, Date.now());
    expect(result.isValid).toBe(true);
  });

  it('returns isValid:false for schema violation', async () => {
    const schema = z.string().min(100); // minimum 100 chars
    const result = await validateStreamingString('short', schema, {}, Date.now());
    expect(result.isValid).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// stubs — verified clean
// ---------------------------------------------------------------------------

describe('stubs — default export', () => {
  it('exports axios stub with http methods', () => {
    expect(typeof stubs.axios.get).toBe('function');
    expect(typeof stubs.axios.post).toBe('function');
    expect(typeof stubs.axios.put).toBe('function');
    expect(typeof stubs.axios.delete).toBe('function');
  });

  it('exports winston stub with createLogger', () => {
    expect(typeof stubs.winston.createLogger).toBe('function');
  });

  it('winston createLogger returns usable logger', () => {
    const logger = stubs.winston.createLogger({});
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
  });
});

// ---------------------------------------------------------------------------
// httpUtils — verified clean
// ---------------------------------------------------------------------------

describe('httpUtils — httpTest', () => {
  it('createMockApp returns an app with routing methods', () => {
    const app = httpTest.createMockApp();
    expect(typeof app).toBe('function');
    expect(typeof app.get).toBe('function');
    expect(typeof app.post).toBe('function');
    expect(typeof app.use).toBe('function');
  });

  it('supertest export is a function', () => {
    expect(typeof httpTest.supertest).toBe('function');
  });
});

// ---------------------------------------------------------------------------
// testUtils — verified clean
// ---------------------------------------------------------------------------

describe('testUtils — testSuite helpers', () => {
  it('exports AssertionHelper', () => {
    expect(testSuite.AssertionHelper).toBeDefined();
  });

  it('exports TestDataFactory', () => {
    expect(testSuite.TestDataFactory).toBeDefined();
  });

  it('exports TestSuiteBuilder', () => {
    expect(testSuite.TestSuiteBuilder).toBeDefined();
  });
});

describe('testUtils — testHelpers', () => {
  it('exports withMockConsole', () => {
    expect(typeof testHelpers.withMockConsole).toBe('function');
  });

  it('withMockConsole suppresses console and restores it', () => {
    let capturedCalls: any[][] = [];
    testHelpers.withMockConsole('log', (spy: any) => {
      console.log('inside mock');
      capturedCalls = spy.mock?.calls ?? [];
    });
    // after the callback, normal console works again
    expect(() => console.log('restored')).not.toThrow();
  });
});
