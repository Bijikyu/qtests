/**
 * Response Object Mocking Utility
 * 
 * This module provides utilities for creating mock Express-style response objects
 * for API testing. It focuses solely on response object creation and management.
 */

/**
 * Create minimal response object with json spy for API testing
 * 
 * This function creates a minimal Express-style response object with a
 * spied json method, enabling verification of API response behavior.
 * 
 * @returns {Object} Mock response object with spied json method
 */
function createJsonRes() {
  console.log(`createJsonRes is running with none`);
  
  try {
    let jsonSpy;
    
    // Check if Jest is available for superior spy functionality
    if (typeof jest !== 'undefined' && jest.fn) {
      jsonSpy = jest.fn();
    } else {
      // Create manual spy implementation for non-Jest environments
      const calls = [];
      
      jsonSpy = function(...args) {
        calls.push(args);
      };
      
      // Add Jest-compatible mock property for consistent API
      jsonSpy.mock = { calls: calls };
    }
    
    console.log(`createJsonRes is returning response object`);
    return { json: jsonSpy };
    
  } catch (err) {
    console.log(`createJsonRes error ${err.message}`);
    throw err;
  }
}

/**
 * Create comprehensive Express-style response mock for integration testing
 * 
 * This function creates a more complete Express-style response object
 * suitable for comprehensive API testing scenarios.
 * 
 * @returns {Object} Comprehensive response mock with multiple spied methods
 */
function createRes() {
  console.log(`createRes is running with none`);
  
  try {
    let responseMock;
    
    // Check for Jest availability
    if (typeof jest !== 'undefined' && jest.fn) {
      // Create Jest-based response mock with spied methods
      responseMock = {
        status: jest.fn().mockImplementation(function(code) {
          this.statusCode = code;
          return this;
        }),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnThis()
      };
    } else {
      // Create manual implementation for non-Jest environments
      const statusCalls = [];
      const jsonCalls = [];
      const sendCalls = [];
      const endCalls = [];
      
      responseMock = {
        status: function(...args) {
          statusCalls.push(args);
          if (args.length > 0) {
            this.statusCode = args[0];
          }
          return this;
        },
        json: function(...args) {
          jsonCalls.push(args);
          return this;
        },
        send: function(...args) {
          sendCalls.push(args);
          return this;
        },
        end: function(...args) {
          endCalls.push(args);
          return this;
        }
      };
      
      // Add Jest-compatible mock properties
      responseMock.status.mock = { calls: statusCalls };
      responseMock.json.mock = { calls: jsonCalls };
      responseMock.send.mock = { calls: sendCalls };
      responseMock.end.mock = { calls: endCalls };
    }
    
    console.log(`createRes is returning response object`);
    return responseMock;
    
  } catch (err) {
    console.log(`createRes error ${err.message}`);
    throw err;
  }
}

module.exports = {
  createJsonRes,
  createRes
};