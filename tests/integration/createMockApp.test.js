/**
 * Regression tests for utils/httpTest.shim.ts — createMockApp
 *
 * Bug fixed: createMockApp did not expose a .use() method.
 *
 * Any test that registered middleware with app.use(fn) would immediately
 * receive "TypeError: app.use is not a function". This is a fundamental gap
 * for a test-app mock: middleware patterns (authentication, logging, body
 * parsing, error handling) are the primary use of .use() in Express and
 * cannot be tested without it.
 *
 * Fix: added a middleware stack to createMockApp. app.use(fn) pushes fn onto
 * the stack. Each request dispatches through all middleware in registration
 * order before reaching the route handler. Each middleware receives (req, res,
 * next) where calling next() advances to the next middleware or the route.
 * Not calling next() short-circuits the chain (useful for auth guards).
 * Errors thrown inside middleware are caught and return a 500 response.
 *
 * MockApp interface was also updated to declare .use() so TypeScript callers
 * don't receive a type error.
 */

let createMockApp, supertest;

beforeAll(async () => {
  ({ createMockApp, supertest } = await import('../../dist/utils/httpTest.shim.js'));
});

describe('createMockApp — .use() method exists (bug fix)', () => {
  test('app.use is a function', () => {
    const app = createMockApp();
    expect(typeof app.use).toBe('function');
  });

  test('app.use returns app for chaining', () => {
    const app = createMockApp();
    const result = app.use((req, res, next) => next());
    expect(result).toBe(app);
  });
});

describe('createMockApp — middleware execution order', () => {
  test('middleware runs before route handler', async () => {
    const order = [];
    const app = createMockApp();
    app.use((req, res, next) => { order.push('mw1'); next(); });
    app.use((req, res, next) => { order.push('mw2'); next(); });
    app.get('/test', (req, res) => { order.push('route'); res.statusCode = 200; res.setHeader('content-type', 'application/json'); res.end('{}'); });
    await supertest(app).get('/test').end();
    expect(order).toEqual(['mw1', 'mw2', 'route']);
  });

  test('multiple middleware run in registration order', async () => {
    const order = [];
    const app = createMockApp();
    for (let i = 1; i <= 4; i++) {
      const n = i;
      app.use((req, res, next) => { order.push(n); next(); });
    }
    app.get('/order', (req, res) => { res.statusCode = 200; res.end('{}'); });
    await supertest(app).get('/order').end();
    expect(order).toEqual([1, 2, 3, 4]);
  });
});

describe('createMockApp — middleware short-circuit (auth guard pattern)', () => {
  test('middleware that does not call next() blocks the route', async () => {
    const routeCalled = { value: false };
    const app = createMockApp();
    app.use((req, res, next) => {
      res.statusCode = 401;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      // intentionally NOT calling next()
    });
    app.get('/guarded', (req, res) => { routeCalled.value = true; res.statusCode = 200; res.end('{}'); });
    const resp = await supertest(app).get('/guarded').end();
    expect(resp.status).toBe(401);
    expect(routeCalled.value).toBe(false);
  });

  test('middleware can inspect headers and conditionally allow', async () => {
    const app = createMockApp();
    app.use((req, res, next) => {
      if (!(req.headers || {})['x-token']) {
        res.statusCode = 403; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ error: 'Forbidden' })); return;
      }
      next();
    });
    app.get('/secure', (req, res) => { res.statusCode = 200; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ ok: true })); });
    const denied = await supertest(app).get('/secure').end();
    const granted = await supertest(app).get('/secure').set('x-token', 'abc').end();
    expect(denied.status).toBe(403);
    expect(granted.status).toBe(200);
    expect(granted.body?.ok).toBe(true);
  });
});

describe('createMockApp — middleware error handling', () => {
  test('middleware that throws returns 500 without crashing', async () => {
    const app = createMockApp();
    app.use((req, res, next) => { throw new Error('middleware boom'); });
    app.get('/boom', (req, res) => { res.statusCode = 200; res.end('{}'); });
    const resp = await supertest(app).get('/boom').end();
    expect(resp.status).toBe(500);
  });

  test('middleware can mutate request before route sees it', async () => {
    const app = createMockApp();
    app.use((req, res, next) => { req.headers = { ...req.headers, 'x-user': 'alice' }; next(); });
    let seenUser;
    app.get('/whoami', (req, res) => {
      seenUser = (req.headers || {})['x-user'];
      res.statusCode = 200; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ user: seenUser }));
    });
    await supertest(app).get('/whoami').end();
    expect(seenUser).toBe('alice');
  });
});

describe('createMockApp — existing behaviour still works after fix', () => {
  test('GET route responds correctly', async () => {
    const app = createMockApp();
    app.get('/ping', (req, res) => { res.statusCode = 200; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ pong: true })); });
    const resp = await supertest(app).get('/ping').end();
    expect(resp.status).toBe(200);
    expect(resp.body?.pong).toBe(true);
  });

  test('POST route receives body', async () => {
    const app = createMockApp();
    app.post('/echo', (req, res) => { res.statusCode = 200; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ received: req.body })); });
    const resp = await supertest(app).post('/echo').send({ msg: 'hello' }).end();
    expect(resp.status).toBe(200);
    expect(resp.body?.received?.msg).toBe('hello');
  });

  test('unknown route returns 404', async () => {
    const app = createMockApp();
    const resp = await supertest(app).get('/nonexistent').end();
    expect(resp.status).toBe(404);
  });

  test('route handler that throws returns 500', async () => {
    const app = createMockApp();
    app.get('/crash', (req, res) => { throw new Error('handler crash'); });
    const resp = await supertest(app).get('/crash').end();
    expect(resp.status).toBe(500);
  });

  test('no middleware runs fine (no regression)', async () => {
    const app = createMockApp();
    app.get('/plain', (req, res) => { res.statusCode = 200; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ plain: true })); });
    const resp = await supertest(app).get('/plain').end();
    expect(resp.status).toBe(200);
    expect(resp.body?.plain).toBe(true);
  });

  test('query string is stripped for route matching', async () => {
    const app = createMockApp();
    app.get('/search', (req, res) => { res.statusCode = 200; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ matched: true })); });
    const resp = await supertest(app).get('/search?q=hello&page=2').end();
    expect(resp.status).toBe(200);
    expect(resp.body?.matched).toBe(true);
  });
});
