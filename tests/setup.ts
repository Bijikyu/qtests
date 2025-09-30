// tests/setup.ts - ES Module setup
let server;

beforeAll(async () => {
  const { default: app } = await import('../src/app.js');
  server = app.listen(4000, () => console.log('Test server started'));
});

afterAll(async () => {
  if (server) server.close();
});