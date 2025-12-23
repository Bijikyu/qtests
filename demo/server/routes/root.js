// Root level hello endpoint
// Rationale: provide /hello endpoint expected by frontend (separate from /api/hello)
const express = require('express');
const router = express.Router();

// GET /hello - Simple hello endpoint at root level
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from QTests Demo!', timestamp: new Date().toISOString() });
});

module.exports = router;