// Additional API routes to complete the backend endpoint set
// Rationale: provide all endpoints expected by the frontend demo
const express = require('express');
const router = express.Router();

// GET /status - Service status endpoint
router.get('/status', (req, res) => {
  res.json({ 
    service: 'calculator', 
    version: '1.0.0', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// POST /batch - Batch operations endpoint
router.post('/batch', (req, res) => {
  try {
    const { operations } = req.body;
    
    if (!Array.isArray(operations)) {
      return res.status(400).json({ error: 'Operations must be an array' });
    }
    
    const results = operations.map(op => {
      const { operation, a, b } = op;
      let result;
      
      switch (operation) {
        case 'add':
          result = a + b;
          break;
        case 'subtract':
          result = a - b;
          break;
        case 'multiply':
          result = a * b;
          break;
        case 'divide':
          if (b === 0) {
            return { error: 'Division by zero', operation, a, b };
          }
          result = a / b;
          break;
        default:
          return { error: 'Unknown operation', operation, a, b };
      }
      
      return { result, operation, a, b };
    });
    
    res.json({ results, count: results.length });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;