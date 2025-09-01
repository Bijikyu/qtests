// tests/setup.ts
let server;

beforeAll(async () => {
  import app from '../src/app'.default || require('../src/app');
  server = app.listen(4000, () => console.log('Test server started'));
});

afterAll(async () => {
  if (server) server.close();
});