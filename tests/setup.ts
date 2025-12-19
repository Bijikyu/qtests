// 🔗 Tests: setup → Jest global setup hooks
import { beforeAll, afterAll } from '@jest/globals';

let server: any;

beforeAll(async () => {
  const app = require('../src/app').default || require('../src/app');
  server = app.listen(4000, () => {
    process.env.NODE_ENV === 'test' && console.log('Test server started on port 4000');
  });
});

afterAll(async () => {
  if (server) {
    server.close();
    process.env.NODE_ENV === 'test' && console.log('Test server stopped');
  }
});
