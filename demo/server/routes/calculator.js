const express = require('express');
const router = express.Router();

let calculationHistory = [];

router.get('/calculator/health', (req, res) => {
  res.json({ status: 'ok', service: 'calculator', timestamp: new Date().toISOString() });
});

router.get('/history', (req, res) => {
  res.json({ history: calculationHistory, count: calculationHistory.length });
});

router.delete('/history', (req, res) => {
  calculationHistory = [];
  res.json({ message: 'History cleared' });
});

router.post('/calculate', (req, res) => {
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
    
    const calculation = { operation, operands: [a, b], result, timestamp: new Date().toISOString() };
    calculationHistory.push(calculation);
    
    res.json({ result, operation, operands: [a, b] });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/calculate/:operation', (req, res) => {
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
    
    const calculation = { operation, operands: [a, b], result, timestamp: new Date().toISOString() };
    calculationHistory.push(calculation);
    
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
