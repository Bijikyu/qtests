/**
 * SecurityMiddleware dogfooding — exercises all 5 factory methods
 * Run with: node dogfood-middleware.mjs
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { SecurityMiddleware, createSecurityMiddleware } = require('./dist/lib/security/SecurityMiddleware.js');

let passed = 0;
let failed = 0;
const results = [];

async function check(label, fn) {
  try {
    const result = await fn();
    if (result === false) {
      results.push(`  FAIL  ${label}`);
      failed++;
    } else {
      results.push(`  OK    ${label}`);
      passed++;
    }
  } catch (err) {
    results.push(`  CRASH ${label}: ${err.message}`);
    failed++;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
    status(code) { this._status = code; return this; },
    json(data) { this._json = data; this._ended = true; return this; },
  };
  return res;
}

function runMiddleware(mw, req, res) {
  return new Promise((resolve) => {
    let resolved = false;
    mw(req, res, () => { if (!resolved) { resolved = true; resolve('next'); } });
    if (res._ended && !resolved) { resolved = true; resolve('ended'); }
    // Poll briefly for sync responses
    setImmediate(() => { if (!resolved) { resolved = true; resolve('timeout'); } });
  });
}

// ─── middleware() ─────────────────────────────────────────────────────────────

await check('middleware() factory returns a function', async () => {
  const sm = new SecurityMiddleware();
  return typeof sm.middleware() === 'function';
});

await check('createSecurityMiddleware convenience function returns a function', async () => {
  return typeof createSecurityMiddleware() === 'function';
});

await check('calls next() for a clean request', async () => {
  const mw = createSecurityMiddleware({ enableInputValidation: false });
  const req = mockReq();
  const res = mockRes();
  const outcome = await runMiddleware(mw, req, res);
  return outcome === 'next';
});

await check('applies security headers to response', async () => {
  const mw = createSecurityMiddleware({ enableInputValidation: false, enableRateLimit: false });
  const req = mockReq();
  const res = mockRes();
  await runMiddleware(mw, req, res);
  const keys = Object.keys(res.getHeaders());
  return keys.some(k => k.toLowerCase().includes('x-frame-options') ||
                        k.toLowerCase().includes('content-security-policy'));
});

await check('rate-limits excessive requests → 429', async () => {
  const mw = createSecurityMiddleware({
    enableInputValidation: false,
    rateLimitOptions: { maxRequests: 5, windowMs: 60000, keyGenerator: () => 'dogfood-burst' }
  });
  let res;
  for (let i = 0; i < 7; i++) {
    res = mockRes();
    await runMiddleware(mw, mockReq(), res);
  }
  return res._status === 429;
});

await check('rate-limited response includes Retry-After header', async () => {
  const mw = createSecurityMiddleware({
    enableInputValidation: false,
    rateLimitOptions: { maxRequests: 2, windowMs: 60000, keyGenerator: () => 'dogfood-retry-after' }
  });
  let res;
  for (let i = 0; i < 4; i++) {
    res = mockRes();
    await runMiddleware(mw, mockReq(), res);
  }
  return res.getHeaders()['Retry-After'] !== undefined;
});

await check('SQL injection in query param is caught → 400', async () => {
  const mw = createSecurityMiddleware({ enableInputValidation: true, enableRateLimit: false });
  const req = mockReq({ query: { q: "1' OR 1=1--" } });
  const res = mockRes();
  await runMiddleware(mw, req, res);
  return res._status === 400;
});

await check('XSS in query param is caught → 400', async () => {
  const mw = createSecurityMiddleware({ enableInputValidation: true, enableRateLimit: false });
  const req = mockReq({ query: { name: '<script>alert(1)</script>' } });
  const res = mockRes();
  await runMiddleware(mw, req, res);
  return res._status === 400;
});

await check('clean query params allow request through → next()', async () => {
  const mw = createSecurityMiddleware({ enableInputValidation: true, enableRateLimit: false });
  const req = mockReq({ query: { page: '1', sort: 'asc' } });
  const res = mockRes();
  const outcome = await runMiddleware(mw, req, res);
  return outcome === 'next';
});

// ─── auditMiddleware() ────────────────────────────────────────────────────────

await check('auditMiddleware() returns a function', async () => {
  return typeof SecurityMiddleware.auditMiddleware() === 'function';
});

await check('auditMiddleware calls next()', async () => {
  const mw = SecurityMiddleware.auditMiddleware();
  const outcome = await runMiddleware(mw, mockReq(), mockRes());
  return outcome === 'next';
});

await check('auditMiddleware patches res.json without throwing', async () => {
  const mw = SecurityMiddleware.auditMiddleware();
  const res = mockRes();
  await runMiddleware(mw, mockReq(), res);
  let threw = false;
  try { res.json({ ok: true }); } catch { threw = true; }
  return !threw;
});

// ─── apiKeyMiddleware() ───────────────────────────────────────────────────────

await check('returns 401 when no API key provided', async () => {
  const mw = SecurityMiddleware.apiKeyMiddleware({ headerName: 'X-API-Key' });
  const res = mockRes();
  await runMiddleware(mw, mockReq(), res);
  return res._status === 401;
});

await check('returns 401 when API key is too short (< 8 chars)', async () => {
  const mw = SecurityMiddleware.apiKeyMiddleware({ headerName: 'X-API-Key' });
  const res = mockRes();
  await runMiddleware(mw, mockReq({ headers: { 'X-API-Key': 'short' } }), res);
  return res._status === 401;
});

await check('calls next() when API key passes default length check', async () => {
  const mw = SecurityMiddleware.apiKeyMiddleware({ headerName: 'X-API-Key' });
  const res = mockRes();
  const outcome = await runMiddleware(mw, mockReq({ headers: { 'X-API-Key': 'valid-api-key-1234' } }), res);
  return outcome === 'next';
});

await check('custom validator rejects wrong key → 401', async () => {
  const mw = SecurityMiddleware.apiKeyMiddleware({
    headerName: 'X-API-Key',
    validator: (key) => key === 'secret-token'
  });
  const res = mockRes();
  await runMiddleware(mw, mockReq({ headers: { 'X-API-Key': 'wrong-key' } }), res);
  return res._status === 401;
});

await check('custom validator allows matching key → next()', async () => {
  const mw = SecurityMiddleware.apiKeyMiddleware({
    headerName: 'X-API-Key',
    validator: (key) => key === 'secret-token'
  });
  const res = mockRes();
  const outcome = await runMiddleware(mw, mockReq({ headers: { 'X-API-Key': 'secret-token' } }), res);
  return outcome === 'next';
});

await check('reads API key from query param when header missing', async () => {
  const mw = SecurityMiddleware.apiKeyMiddleware({ queryParam: 'api_key' });
  const res = mockRes();
  const outcome = await runMiddleware(mw, mockReq({ query: { api_key: 'valid-api-key-1234' } }), res);
  return outcome === 'next';
});

await check('stores validated API key on req', async () => {
  const mw = SecurityMiddleware.apiKeyMiddleware({ headerName: 'X-API-Key' });
  const req = mockReq({ headers: { 'X-API-Key': 'valid-api-key-1234' } });
  const res = mockRes();
  await runMiddleware(mw, req, res);
  return req.apiKey === 'valid-api-key-1234';
});

// ─── ipFilterMiddleware() ─────────────────────────────────────────────────────

await check('blocks IP on the block list → 403', async () => {
  const mw = SecurityMiddleware.ipFilterMiddleware({
    allowedIPs: [],
    blockList: ['10.0.0.1']
  });
  const res = mockRes();
  await runMiddleware(mw, mockReq({ ip: '10.0.0.1' }), res);
  return res._status === 403;
});

await check('blocks IP not on allow list → 403', async () => {
  const mw = SecurityMiddleware.ipFilterMiddleware({ allowedIPs: ['192.168.1.1'] });
  const res = mockRes();
  await runMiddleware(mw, mockReq({ ip: '10.0.0.99' }), res);
  return res._status === 403;
});

await check('allows IP on the allow list → next()', async () => {
  const mw = SecurityMiddleware.ipFilterMiddleware({ allowedIPs: ['127.0.0.1'] });
  const res = mockRes();
  const outcome = await runMiddleware(mw, mockReq({ ip: '127.0.0.1' }), res);
  return outcome === 'next';
});

await check('allows any IP when allowedIPs is empty and not on blockList → next()', async () => {
  const mw = SecurityMiddleware.ipFilterMiddleware({ allowedIPs: [] });
  const res = mockRes();
  const outcome = await runMiddleware(mw, mockReq({ ip: '8.8.8.8' }), res);
  return outcome === 'next';
});

await check('calls next() when req.ip is undefined', async () => {
  const mw = SecurityMiddleware.ipFilterMiddleware({ allowedIPs: ['127.0.0.1'] });
  const res = mockRes();
  const outcome = await runMiddleware(mw, mockReq({ ip: undefined }), res);
  return outcome === 'next';
});

// ─── corsMiddleware() ─────────────────────────────────────────────────────────

await check('corsMiddleware() returns a function', async () => {
  return typeof SecurityMiddleware.corsMiddleware() === 'function';
});

await check('corsMiddleware calls next()', async () => {
  const mw = SecurityMiddleware.corsMiddleware({ origin: 'https://example.com' });
  const req = mockReq({ headers: { origin: 'https://example.com' } });
  const outcome = await runMiddleware(mw, req, mockRes());
  return outcome === 'next';
});

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log('\n' + results.join('\n'));
console.log(`\n${'─'.repeat(55)}`);
console.log(`  ${passed + failed} checks   ✓ ${passed} passed   ✗ ${failed} failed`);
console.log('─'.repeat(55));
if (failed > 0) process.exit(1);
