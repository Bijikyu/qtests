// Express application setup used by tests and the server entrypoint.
// Rationale: keep app creation separate from network binding to allow supertest usage.
const express = require('express');
const winston = require('winston');
const qerrors = require('qerrors');

// Configure a minimal logger; qtests will stub winston to a no-op in tests.
// Inline comments explain decisions to align with repo guidelines.
const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console({ silent: false })]
});

// Create the express app instance.
const app = express();

// JSON parsing middleware with error handling
app.use(express.json({
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf.toString());
    } catch (error) {
      qerrors(error, 'express.json: parsing request body', { url: req.url, method: req.method });
      throw error;
    }
  }
}));

// Simple request logging for visibility; won't pollute test output with qtests stubs.
app.use((req, _res, next) => {
  try { logger.info(`REQ ${req.method} ${req.url}`); } catch (e) { /* qtests stubs keep this safe */ }
  next();
});

// Mount routes.
const helloRouter = require('./routes/hello');
const calculatorRouter = require('./routes/calculator');
const statusRouter = require('./routes/status');
const rootRouter = require('./routes/root');
const usersRouter = require('./routes/users');

// API routes
app.use('/api', helloRouter);
app.use('/api', calculatorRouter);
app.use('/api', statusRouter);
app.use('/api', usersRouter);

// Root level routes
app.use('/', rootRouter);

// Health endpoint for quick sanity.
app.get('/health', (_req, res) => {
  return res.status(200).json({ ok: true });
});

// API health endpoint to match frontend expectations
app.get('/api/health', (_req, res) => {
  return res.status(200).json({ ok: true, status: 'healthy', timestamp: new Date().toISOString() });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  qerrors(error, 'express.global: unhandled error', { url: req.url, method: req.method });
  res.status(500).json({ error: 'Internal server error' });
});

// Always export at bottom per repo conventions.
module.exports = app;

