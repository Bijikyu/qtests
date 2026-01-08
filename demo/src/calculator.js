/**
 * Demo Calculator Module
 * 
 * Provides basic arithmetic operations and a Calculator class
 * for demonstration purposes in the qtests testing framework.
 */

import axios from 'axios';

/**
 * Basic arithmetic operations
 */

/**
 * Add two numbers
 * @param {number} a - First operand
 * @param {number} b - Second operand
 * @returns {number} Sum of a and b
 */
export const add = (a, b) => a + b;

/**
 * Subtract two numbers
 * @param {number} a - First operand
 * @param {number} b - Second operand
 * @returns {number} Difference of a and b
 */
export const subtract = (a, b) => a - b;

/**
 * Multiply two numbers
 * @param {number} a - First operand
 * @param {number} b - Second operand
 * @returns {number} Product of a and b
 */
export const multiply = (a, b) => a * b;

/**
 * Divide two numbers
 * @param {number} a - First operand
 * @param {number} b - Second operand
 * @returns {number} Quotient of a and b
 * @throws {Error} If division by zero is attempted
 */
export const divide = (a, b) => {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
};

/**
 * Fetch calculation from remote API
 * @param {string} operation - Operation type ('add', 'subtract', 'multiply', 'divide')
 * @param {number} a - First operand
 * @param {number} b - Second operand
 * @returns {Promise<number>} Result of the calculation
 * @throws {Error} If API request fails
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
 * Calculator class with history tracking
 */
export class Calculator {
    /**
     * Create a new calculator instance
     */
    constructor() {
        this.history = [];
    }

    /**
     * Perform a calculation and store in history
     * @param {string} operation - Operation type
     * @param {number} a - First operand
     * @param {number} b - Second operand
     * @returns {number} Result of the calculation
     * @throws {Error} If operation is unknown
     */
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
        
        // Store calculation in history
        this.history.push({
            operation,
            a,
            b,
            result,
            timestamp: new Date().toISOString()
        });
        
        return result;
    }

    /**
     * Get calculation history
     * @returns {Array} Array of past calculations
     */
    getHistory() {
        return this.history;
    }

    /**
     * Clear calculation history
     */
    clearHistory() {
        this.history = [];
    }
}