/**
 * Demo API Routes
 * Express routes for test generation demonstration
 */

import express from 'express';
import { Calculator } from './calculator.js';

const router = express.Router();
const calculator = new Calculator();

/**
 * Setup API routes for calculator service
 */
export const setupRoutes = (app) => {
  // Basic calculation endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.post('/api/calculate', (req, res) => {
    try {
      const { operation, operands } = req.body;
      const [a, b] = operands;
      const result = calculator.calculate(operation, a, b);
      res.json({ result, operation, operands });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/history', (req, res) => {
    const history = calculator.getHistory();
    res.json({ history, count: history.length });
  });

  app.delete('/api/history', (req, res) => {
    calculator.clearHistory();
    res.json({ message: 'History cleared' });
  });

  // Advanced calculation endpoints
  app.put('/api/calculate/:operation', (req, res) => {
    try {
      const { operation } = req.params;
      const { a, b } = req.body;
      const result = calculator.calculate(operation, a, b);
      res.json({ result, operation, operands: [a, b] });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch('/api/settings', (req, res) => {
    const { precision } = req.body;
    res.json({ message: 'Settings updated', precision });
  });
};

/**
 * Error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
};

/**
 * Router for modular route organization
 */
export const calculatorRouter = () => {
  router.get('/status', (req, res) => {
    res.json({ service: 'calculator', version: '1.0.0' });
  });

  router.post('/batch', (req, res) => {
    try {
      const { operations } = req.body;
      const results = operations.map(op => {
        return calculator.calculate(op.operation, op.a, op.b);
      });
      res.json({ results, count: results.length });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};