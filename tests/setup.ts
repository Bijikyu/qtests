import { beforeAll, afterAll } from '@jest/globals';

let server: any;

beforeAll(async () => {
  try {
    const app = require('../src/app').default || require('../src/app');
    if (app && typeof app.listen === 'function') {
      server = app.listen(4000, () => {
        process.env.NODE_ENV === 'test' && console.log('Test server started on port 4000');
      });
    }
  } catch (error) {
    // App module not found, skip server setup (unit tests don't need it)
  }
});

afterAll(async () => {
  if (server) {
    server.close();
    process.env.NODE_ENV === 'test' && console.log('Test server stopped');
  }
});
