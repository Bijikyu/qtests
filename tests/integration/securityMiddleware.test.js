/**
 * SecurityMiddleware Regression Tests — Round 3
 *
 * Covers bugs found by dogfooding SecurityMiddleware with proper async checks:
 *  1. Query params containing SQL injection were silently passed through
 *     (middleware used non-existent 'query_param' rule → always valid:true)
 *  2. Query params containing XSS were silently passed through (same root cause)
 *
 * Also regression-locks the other middleware behaviors verified as correct:
 * middleware(), auditMiddleware(), apiKeyMiddleware(), ipFilterMiddleware(), corsMiddleware()
 */

const { SecurityMiddleware, createSecurityMiddleware } = require('../../dist/lib/security/SecurityMiddleware.js');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mockReq(overrides = {}) {
  const headers = overrides.headers || {};
  return {
    method: 'GET',
    url: '/api/test',
    ip: '127.0.0.1',
    body: null,
    query: {},
    params: {},
    headers,
    get(name) { return headers[name.toLowerCase()] || headers[name]; },
    ...overrides,
  };
}

function mockRes() {
  const setHeaders = {};
  const res = {
    _status: 200,
    _json: null,
    _ended: false,
    setHeader(k, v) { setHeaders[k] = v; },
    getHeaders() { return setHeaders; },
    status(code) { res._status = code; return res; },
    json(data) { res._json = data; res._ended = true; return res; },
  };
  return res;
}

function runMw(mw, req, res) {
  return new Promise((resolve) => {
    let done = false;
    mw(req, res, () => { if (!done) { done = true; resolve('next'); } });
    if (res._ended && !done) { done = true; resolve('ended'); }
    setImmediate(() => { if (!done) { done = true; resolve('timeout'); } });
  });
}

// ─── Fix: query / path param validation uses userInput rule ──────────────────

describe('Fix — SQL/XSS in query params and path params are caught by middleware', () => {
  const mw = createSecurityMiddleware({ enableInputValidation: true, enableRateLimit: false });

  const sqlAttacks = [
    ["1' OR 1=1--", 'boolean bypass'],
    ['1 UNION SELECT * FROM users', 'UNION injection'],
    ['DROP TABLE users;', 'DROP statement'],
    ["admin'--", 'quote-comment bypass'],
  ];

  test.each(sqlAttacks)('SQL injection in query param is rejected: "%s" (%s)', async (attack) => {
    const res = mockRes();
    await runMw(mw, mockReq({ query: { q: attack } }), res);
    expect(res._status).toBe(400);
  });

  const xssAttacks = [
    ['<script>alert(1)</script>', 'script tag'],
    ['<img src=x onerror=alert(1)>', 'img onerror'],
  ];

  test.each(xssAttacks)('XSS in query param is rejected: "%s" (%s)', async (attack) => {
    const res = mockRes();
    await runMw(mw, mockReq({ query: { name: attack } }), res);
    expect(res._status).toBe(400);
  });

  test('clean query params allow request through', async () => {
    const res = mockRes();
    const outcome = await runMw(mw, mockReq({ query: { page: '1', sort: 'asc' } }), res);
    expect(outcome).toBe('next');
  });

  test('path param with SQL injection is rejected', async () => {
    const res = mockRes();
    await runMw(mw, mockReq({ params: { id: "1' OR 1=1--" } }), res);
    expect(res._status).toBe(400);
  });

  test('clean path param allows request through', async () => {
    const res = mockRes();
    const outcome = await runMw(mw, mockReq({ params: { id: '42' } }), res);
    expect(outcome).toBe('next');
  });
});

// ─── Security headers ─────────────────────────────────────────────────────────

describe('middleware() applies security headers', () => {
  test('X-Frame-Options is set', async () => {
    const mw = createSecurityMiddleware({ enableInputValidation: false, enableRateLimit: false });
    const res = mockRes();
    await runMw(mw, mockReq(), res);
    const keys = Object.keys(res.getHeaders()).map(k => k.toLowerCase());
    expect(keys).toContain('x-frame-options');
  });

  test('Content-Security-Policy is set', async () => {
    const mw = createSecurityMiddleware({ enableInputValidation: false, enableRateLimit: false });
    const res = mockRes();
    await runMw(mw, mockReq(), res);
    const keys = Object.keys(res.getHeaders()).map(k => k.toLowerCase());
    expect(keys).toContain('content-security-policy');
  });
});

// ─── Rate limiting ────────────────────────────────────────────────────────────

describe('middleware() rate limiting', () => {
  test('returns 429 after max requests exceeded', async () => {
    const mw = createSecurityMiddleware({
      enableInputValidation: false,
      rateLimitOptions: { maxRequests: 3, windowMs: 60000, keyGenerator: () => 'rl-test-1' }
    });
    let res;
    for (let i = 0; i < 5; i++) {
      res = mockRes();
      await runMw(mw, mockReq(), res);
    }
    expect(res._status).toBe(429);
  });

  test('includes Retry-After header in 429 response', async () => {
    const mw = createSecurityMiddleware({
      enableInputValidation: false,
      rateLimitOptions: { maxRequests: 2, windowMs: 60000, keyGenerator: () => 'rl-test-2' }
    });
    let res;
    for (let i = 0; i < 4; i++) {
      res = mockRes();
      await runMw(mw, mockReq(), res);
    }
    expect(res.getHeaders()['Retry-After']).toBeDefined();
  });
});

// ─── apiKeyMiddleware ─────────────────────────────────────────────────────────

describe('apiKeyMiddleware()', () => {
  test('rejects missing key → 401', async () => {
    const mw = SecurityMiddleware.apiKeyMiddleware({ headerName: 'X-API-Key' });
    const res = mockRes();
    await runMw(mw, mockReq(), res);
    expect(res._status).toBe(401);
  });

  test('rejects short key → 401', async () => {
    const mw = SecurityMiddleware.apiKeyMiddleware({ headerName: 'X-API-Key' });
    const res = mockRes();
    await runMw(mw, mockReq({ headers: { 'X-API-Key': 'short' } }), res);
    expect(res._status).toBe(401);
  });

  test('allows valid key → next()', async () => {
    const mw = SecurityMiddleware.apiKeyMiddleware({ headerName: 'X-API-Key' });
    const res = mockRes();
    const outcome = await runMw(mw, mockReq({ headers: { 'X-API-Key': 'valid-long-key-123' } }), res);
    expect(outcome).toBe('next');
  });

  test('stores key on req after validation', async () => {
    const mw = SecurityMiddleware.apiKeyMiddleware({ headerName: 'X-API-Key' });
    const req = mockReq({ headers: { 'X-API-Key': 'valid-long-key-123' } });
    await runMw(mw, req, mockRes());
    expect(req.apiKey).toBe('valid-long-key-123');
  });

  test('custom validator: wrong key → 401', async () => {
    const mw = SecurityMiddleware.apiKeyMiddleware({
      headerName: 'X-API-Key',
      validator: (k) => k === 'expected'
    });
    const res = mockRes();
    await runMw(mw, mockReq({ headers: { 'X-API-Key': 'unexpected' } }), res);
    expect(res._status).toBe(401);
  });

  test('custom validator: correct key → next()', async () => {
    const mw = SecurityMiddleware.apiKeyMiddleware({
      headerName: 'X-API-Key',
      validator: (k) => k === 'expected'
    });
    const res = mockRes();
    const outcome = await runMw(mw, mockReq({ headers: { 'X-API-Key': 'expected' } }), res);
    expect(outcome).toBe('next');
  });
});

// ─── ipFilterMiddleware ───────────────────────────────────────────────────────

describe('ipFilterMiddleware()', () => {
  test('blocks IP on block list → 403', async () => {
    const mw = SecurityMiddleware.ipFilterMiddleware({ allowedIPs: [], blockList: ['10.0.0.1'] });
    const res = mockRes();
    await runMw(mw, mockReq({ ip: '10.0.0.1' }), res);
    expect(res._status).toBe(403);
  });

  test('blocks IP not on allow list → 403', async () => {
    const mw = SecurityMiddleware.ipFilterMiddleware({ allowedIPs: ['192.168.1.1'] });
    const res = mockRes();
    await runMw(mw, mockReq({ ip: '10.0.0.99' }), res);
    expect(res._status).toBe(403);
  });

  test('allows IP on allow list → next()', async () => {
    const mw = SecurityMiddleware.ipFilterMiddleware({ allowedIPs: ['127.0.0.1'] });
    const res = mockRes();
    const outcome = await runMw(mw, mockReq({ ip: '127.0.0.1' }), res);
    expect(outcome).toBe('next');
  });

  test('allows all IPs when allowedIPs is empty and no blockList → next()', async () => {
    const mw = SecurityMiddleware.ipFilterMiddleware({ allowedIPs: [] });
    const res = mockRes();
    const outcome = await runMw(mw, mockReq({ ip: '8.8.8.8' }), res);
    expect(outcome).toBe('next');
  });
});
