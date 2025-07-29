/**
 * Demo Calculator Module
 * Simple math operations for test generation demonstration
 */

import axios from 'axios';

/**
 * Add two numbers
 */
export const add = (a, b) => {
  return a + b;
};

/**
 * Subtract two numbers
 */
export const subtract = (a, b) => {
  return a - b;
};

/**
 * Multiply two numbers
 */
export const multiply = (a, b) => {
  return a * b;
};

/**
 * Divide two numbers
 */
export const divide = (a, b) => {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
};

/**
 * Fetch calculation from remote API
 */
export const fetchCalculation = async (operation, a, b) => {
  try {
    const response = await axios.post('/api/calculate', {
      operation,
      operands: [a, b]
    });
    return response.data.result;
  } catch (error) {
    throw new Error('Failed to fetch calculation');
  }
};

/**
 * Calculator class for more complex operations
 */
export class Calculator {
  constructor() {
    this.history = [];
  }

  calculate(operation, a, b) {
    let result;
    switch (operation) {
      case 'add':
        result = add(a, b);
        break;
      case 'subtract':
        result = subtract(a, b);
        break;
      case 'multiply':
        result = multiply(a, b);
        break;
      case 'divide':
        result = divide(a, b);
        break;
      default:
        throw new Error('Unknown operation');
    }
    
    this.history.push({ operation, a, b, result });
    return result;
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }
}