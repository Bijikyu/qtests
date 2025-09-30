// API route demonstrating external call usage with axios and logging via winston.
// qtests will stub both axios and winston during tests to avoid network/logs.
const express = require('express');
const router = express.Router();

const { fetchHello } = require('../services/externalService');

router.get('/hello', async (_req, res) => {
  try {
    // We await the result even though the axios stub returns a plain object; await on non-promises resolves immediately.
    const data = await fetchHello();
    const hasData = !!data;
    return res.status(200).json({ ok: true, hasData });
  } catch (err) {
    // Provide stable, safe errors for clients without leaking internals.
    const message = err && err.message ? err.message : 'unknown_error';
    return res.status(500).json({ ok: false, error: message });
  }
});

module.exports = router;

