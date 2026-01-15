const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/calculator/health', (req, res) => {
  res.json({ status: 'ok', service: 'calculator', timestamp: new Date().toISOString() });
});

router.get('/history', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, operation, operand_a, operand_b, result, created_at FROM calculation_history ORDER BY created_at DESC LIMIT 100'
    );
    const history = result.rows.map(row => ({
      id: row.id,
      operation: row.operation,
      operands: [parseFloat(row.operand_a), parseFloat(row.operand_b)],
      result: parseFloat(row.result),
      timestamp: row.created_at.toISOString()
    }));
    res.json({ history, count: history.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

router.delete('/history', async (req, res) => {
  try {
    await db.query('DELETE FROM calculation_history');
    res.json({ message: 'History cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

router.post('/calculate', async (req, res) => {
  try {
    const { operation, operands } = req.body;
    if (!operation || !Array.isArray(operands) || operands.length !== 2) {
      return res.status(400).json({ error: 'Invalid request format' });
    }
    
    const [a, b] = operands;
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
          return res.status(400).json({ error: 'Division by zero' });
        }
        result = a / b;
        break;
      default:
        return res.status(400).json({ error: 'Unknown operation' });
    }
    
    await db.query(
      'INSERT INTO calculation_history (operation, operand_a, operand_b, result) VALUES ($1, $2, $3, $4)',
      [operation, a, b, result]
    );
    
    res.json({ result, operation, operands: [a, b] });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/calculate/:operation', async (req, res) => {
  try {
    const { operation } = req.params;
    const { a, b } = req.body;
    
    if (a === undefined || b === undefined) {
      return res.status(400).json({ error: 'Missing operands' });
    }
    
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
          return res.status(400).json({ error: 'Division by zero' });
        }
        result = a / b;
        break;
      default:
        return res.status(400).json({ error: 'Unknown operation' });
    }
    
    await db.query(
      'INSERT INTO calculation_history (operation, operand_a, operand_b, result) VALUES ($1, $2, $3, $4)',
      [operation, a, b, result]
    );
    
    res.json({ result, operation, operands: [a, b] });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/settings', (req, res) => {
  const { precision } = req.body;
  res.json({ message: 'Settings updated', precision: precision || 2 });
});

module.exports = router;
