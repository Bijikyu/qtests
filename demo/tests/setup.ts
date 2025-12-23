import { beforeAll, afterAll } from '@jest/globals';

/**
 * Test Server Setup and Teardown Utilities
 * 
 * Purpose: Test server setup and teardown utilities for integration testing.
 * 
 * This module provides standardized test server lifecycle management for integration
 * tests. It solves the common problem of setting up and tearing down test servers across
 * different projects, ensuring proper resource cleanup. The module is reusable across
 * any Node.js project that needs a test server for integration testing, providing
 * consistent server startup/shutdown with proper logging. It handles the server
 * lifecycle automatically, preventing resource leaks and test interference.
 */

let server: any;

beforeAll(async () => {
  const app = require('../server/app.js');
  if (!app) {
    throw new Error('Failed to load Express app from ../server/app.js');
  }
  server = app.listen(4000, () => {
    // Use structured logging for test server startup
    if (process.env.NODE_ENV === 'test') {
      // Simple test logging - avoid heavy dependencies during tests
      console.log('Test server started on port 4000');
    }
  });
});

afterAll(async () => {
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    if (process.env.NODE_ENV === 'test') {
      console.log('Test server stopped');
    }
  }
});
