/**
 * Regression tests for lib/rateLimiter.ts
 *
 * Bug fixed: RateLimiterAbstract was imported as a named value from
 * 'rate-limiter-flexible' but that package doesn't export it as a runtime
 * value — it's a TypeScript-only abstract class. The ESM named import caused
 * the entire module to fail to load with:
 *   "The requested module does not provide an export named 'RateLimiterAbstract'"
 *
 * Fix: changed to `import type { RateLimiterAbstract }` so it is erased at
 * compile time and never appears in the emitted JS. Removed it from the
 * value re-export and default export object as well.
 */

let rl;

beforeAll(async () => {
  rl = await import('../../dist/lib/rateLimiter.js');
});

describe('rateLimiter module load', () => {
  test('module loads without error (RateLimiterAbstract import bug fixed)', () => {
    expect(rl).toBeDefined();
  });

  test('exports concrete classes and factory functions', () => {
    expect(typeof rl.createInMemoryRateLimiter).toBe('function');
    expect(typeof rl.createDistributedRateLimiter).toBe('function');
    expect(typeof rl.checkRateLimit).toBe('function');
    expect(typeof rl.resetRateLimitKey).toBe('function');
    expect(typeof rl.getRateLimitStats).toBe('function');
    expect(typeof rl.InMemoryRateLimiter).toBe('function');
    expect(typeof rl.DistributedRateLimiter).toBe('function');
    expect(typeof rl.RateLimiterMemory).toBe('function');
    expect(typeof rl.RateLimiterRedis).toBe('function');
  });
});

describe('createInMemoryRateLimiter', () => {
  test('creates a limiter using maxRequests as points', () => {
    const limiter = rl.createInMemoryRateLimiter({ windowMs: 1000, maxRequests: 3 });
    expect(limiter).toBeDefined();
    expect(limiter.points).toBe(3);
  });

  test('explicit points field overrides maxRequests', () => {
    const limiter = rl.createInMemoryRateLimiter({ windowMs: 1000, maxRequests: 3, points: 7 });
    expect(limiter.points).toBe(7);
  });
});

describe('checkRateLimit', () => {
  let limiter;
  const config = { windowMs: 5000, maxRequests: 2 };
  const req = { ip: '1.2.3.4', path: '/api' };

  beforeEach(() => {
    limiter = rl.createInMemoryRateLimiter(config);
  });

  test('allows requests up to the limit', async () => {
    const r1 = await rl.checkRateLimit(limiter, req, config);
    const r2 = await rl.checkRateLimit(limiter, req, config);
    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
  });

  test('blocks request exceeding the limit', async () => {
    await rl.checkRateLimit(limiter, req, config);
    await rl.checkRateLimit(limiter, req, config);
    const r3 = await rl.checkRateLimit(limiter, req, config);
    expect(r3.allowed).toBe(false);
  });

  test('blocked response includes retryAfter number', async () => {
    await rl.checkRateLimit(limiter, req, config);
    await rl.checkRateLimit(limiter, req, config);
    const blocked = await rl.checkRateLimit(limiter, req, config);
    expect(typeof blocked.retryAfter).toBe('number');
  });

  test('remaining decrements with each allowed request', async () => {
    const r1 = await rl.checkRateLimit(limiter, req, config);
    const r2 = await rl.checkRateLimit(limiter, req, config);
    expect(r1.remaining).toBeGreaterThan(r2.remaining);
  });

  test('resetTime is a future timestamp', async () => {
    const before = Date.now();
    const r = await rl.checkRateLimit(limiter, req, config);
    expect(r.resetTime).toBeGreaterThanOrEqual(before);
  });

  test('different IPs have independent limits', async () => {
    const reqA = { ip: '10.0.0.1', path: '/a' };
    const reqB = { ip: '10.0.0.2', path: '/a' };
    await rl.checkRateLimit(limiter, reqA, config);
    await rl.checkRateLimit(limiter, reqA, config);
    const blockedA = await rl.checkRateLimit(limiter, reqA, config);
    const allowedB = await rl.checkRateLimit(limiter, reqB, config);
    expect(blockedA.allowed).toBe(false);
    expect(allowedB.allowed).toBe(true);
  });

  test('custom keyGenerator is used for rate limiting', async () => {
    const cfgWithKey = { ...config, keyGenerator: (r) => r.userId };
    const limiterK = rl.createInMemoryRateLimiter(cfgWithKey);
    const rA1 = await rl.checkRateLimit(limiterK, { userId: 'alice' }, cfgWithKey);
    const rA2 = await rl.checkRateLimit(limiterK, { userId: 'alice' }, cfgWithKey);
    const rA3 = await rl.checkRateLimit(limiterK, { userId: 'alice' }, cfgWithKey);
    const rB1 = await rl.checkRateLimit(limiterK, { userId: 'bob' }, cfgWithKey);
    expect(rA1.allowed).toBe(true);
    expect(rA2.allowed).toBe(true);
    expect(rA3.allowed).toBe(false);
    expect(rB1.allowed).toBe(true);
  });
});

describe('resetRateLimitKey', () => {
  test('resetting key allows subsequent request', async () => {
    const config = { windowMs: 5000, maxRequests: 1 };
    const limiter = rl.createInMemoryRateLimiter(config);
    const req = { ip: '5.5.5.5', path: '/reset-test' };
    await rl.checkRateLimit(limiter, req, config);
    const blocked = await rl.checkRateLimit(limiter, req, config);
    expect(blocked.allowed).toBe(false);
    await rl.resetRateLimitKey(limiter, 'rate_limit:5.5.5.5:/reset-test');
    const allowed = await rl.checkRateLimit(limiter, req, config);
    expect(allowed.allowed).toBe(true);
  });

  test('resetting a non-existent key does not throw', async () => {
    const limiter = rl.createInMemoryRateLimiter({ windowMs: 1000, maxRequests: 5 });
    await expect(rl.resetRateLimitKey(limiter, 'no-such-key')).resolves.toBeUndefined();
  });
});

describe('getRateLimitStats', () => {
  test('in-memory limiter reports isDistributed false', () => {
    const limiter = rl.createInMemoryRateLimiter({ windowMs: 1000, maxRequests: 5 });
    const stats = rl.getRateLimitStats(limiter);
    expect(stats.isDistributed).toBe(false);
    expect(stats.redisConnected).toBe(false);
  });
});

describe('InMemoryRateLimiter class', () => {
  test('isAllowed returns correct result', async () => {
    const il = new rl.InMemoryRateLimiter({ windowMs: 5000, maxRequests: 2 });
    const r1 = await il.isAllowed({ ip: '9.9.9.9', path: '/class' });
    expect(r1.allowed).toBe(true);
  });

  test('blocks after limit exceeded', async () => {
    const il = new rl.InMemoryRateLimiter({ windowMs: 5000, maxRequests: 1 });
    const req = { ip: '9.9.9.9', path: '/class-block' };
    await il.isAllowed(req);
    const blocked = await il.isAllowed(req);
    expect(blocked.allowed).toBe(false);
  });

  test('getStats returns isDistributed false', () => {
    const il = new rl.InMemoryRateLimiter({ windowMs: 1000, maxRequests: 5 });
    const stats = il.getStats();
    expect(stats.isDistributed).toBe(false);
  });

  test('resetKey re-allows blocked ip', async () => {
    const il = new rl.InMemoryRateLimiter({ windowMs: 5000, maxRequests: 1 });
    const req = { ip: '7.7.7.7', path: '/class-reset' };
    await il.isAllowed(req);
    const blocked = await il.isAllowed(req);
    expect(blocked.allowed).toBe(false);
    await il.resetKey('rate_limit:7.7.7.7:/class-reset');
    const allowed = await il.isAllowed(req);
    expect(allowed.allowed).toBe(true);
  });

  test('rateLimiter getter returns the underlying limiter', () => {
    const il = new rl.InMemoryRateLimiter({ windowMs: 1000, maxRequests: 5 });
    expect(il.rateLimiter).toBeDefined();
    expect(typeof il.rateLimiter.consume).toBe('function');
  });
});

describe('createDistributedRateLimiter falls back to memory without Redis', () => {
  test('falls back to RateLimiterMemory when no Redis configured', async () => {
    const limiter = await rl.createDistributedRateLimiter({ windowMs: 1000, maxRequests: 3 });
    expect(limiter).toBeInstanceOf(rl.RateLimiterMemory);
  });
});
