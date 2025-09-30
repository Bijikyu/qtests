// Express application setup used by tests and the server entrypoint.
// Rationale: keep app creation separate from network binding to allow supertest usage.
const express = require('express');
const winston = require('winston');

// Configure a minimal logger; qtests will stub winston to a no-op in tests.
// Inline comments explain decisions to align with repo guidelines.
const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console({ silent: false })]
});

// Create the express app instance.
const app = express();
app.use(express.json());

// Simple request logging for visibility; won't pollute test output with qtests stubs.
app.use((req, _res, next) => {
  try { logger.info(`REQ ${req.method} ${req.url}`); } catch (e) { /* qtests stubs keep this safe */ }
  next();
});

// Mount routes.
const helloRouter = require('./routes/hello');
app.use('/api', helloRouter);

// Health endpoint for quick sanity.
app.get('/health', (_req, res) => {
  return res.status(200).json({ ok: true });
});

// Always export at bottom per repo conventions.
module.exports = app;

