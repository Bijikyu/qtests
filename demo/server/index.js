// Server entrypoint that binds the Express app to a port.
// Not used by tests directly; kept for completeness and local manual checks.
const app = require('./app');
const qerrors = require('qerrors');

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

// Start the server and handle common errors. Comments inline per guidelines.
const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[demo] server listening on :${PORT}`);
});

// Basic hardening: ensure unhandled rejections don't crash silently.
process.on('unhandledRejection', (err) => {
  qerrors(err, 'demo.server: unhandled rejection', { type: 'unhandledRejection', port: PORT });
  // eslint-disable-next-line no-console
  console.error('[demo] unhandledRejection', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  qerrors(err, 'demo.server: uncaught exception', { type: 'uncaughtException', port: PORT });
  // eslint-disable-next-line no-console
  console.error('[demo] uncaughtException', err);
  server.close(() => process.exit(1));
});

