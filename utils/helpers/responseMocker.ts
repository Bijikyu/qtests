/**
 * Response Mocking Utility - TypeScript Implementation
 * 
 * This module provides functionality for creating mock HTTP response objects
 * for API testing scenarios without requiring actual HTTP infrastructure.
 */

// Type definitions for HTTP response objects
interface MockResponse {
  status: (code: number) => MockResponse;
  json: (data: any) => MockResponse;
  send: (data: any) => MockResponse;
  end: (data?: any) => void;
  setHeader: (name: string, value: string) => MockResponse;
  statusCode?: number;
  headers?: Record<string, string>;
  _data?: any;
  _sent?: boolean;
}

/**
 * Create a mock JSON response object
 * 
 * This function creates a mock response object that mimics Express.js response
 * interface for testing API endpoints without requiring a full HTTP server.
 * 
 * @param data - JSON data to include in the response
 * @param statusCode - HTTP status code (default: 200)
 * @returns Mock response object with Express-like interface
 */
function createJsonRes(data: any = {}, statusCode: number = 200): MockResponse {
  console.log(`createJsonRes is running with data and status ${statusCode}`);
  
  try {
    let responseData = data;
    let currentStatus = statusCode;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    let sent = false;
    
    const mockResponse: MockResponse = {
      status: (code: number) => {
        currentStatus = code;
        mockResponse.statusCode = code;
        return mockResponse;
      },
      
      json: (jsonData: any) => {
        responseData = jsonData;
        mockResponse._data = jsonData; // Store raw data, stringify only when needed for output
        headers['Content-Type'] = 'application/json';
        return mockResponse;
      },
      
      send: (sendData: any) => {
        responseData = sendData;
        mockResponse._data = sendData; // Store raw data
        return mockResponse;
      },
      
      end: (endData?: any) => {
        if (endData !== undefined) {
          responseData = endData;
          mockResponse._data = endData; // Store raw data
        }
        sent = true;
        mockResponse._sent = true;
      },
      
      setHeader: (name: string, value: string) => {
        headers[name] = value;
        return mockResponse;
      },
      
      statusCode: currentStatus,
      headers: headers,
      _data: responseData,
      _sent: sent
    };
    
    console.log(`createJsonRes is returning mock response`);
    return mockResponse;
    
  } catch (err: any) {
    console.log(`createJsonRes error ${err.message}`);
    throw err;
  }
}

/**
 * Create a generic mock response object
 * 
 * This function creates a basic mock response object with common HTTP response
 * methods for testing scenarios that don't specifically require JSON responses.
 * 
 * @param statusCode - HTTP status code (default: 200)
 * @returns Mock response object with basic HTTP interface
 */
function createRes(statusCode: number = 200): MockResponse {
  console.log(`createRes is running with status ${statusCode}`);
  
  try {
    let currentStatus = statusCode;
    const headers: Record<string, string> = {};
    let responseData: any = '';
    let sent = false;
    
    const mockResponse: MockResponse = {
      status: (code: number) => {
        currentStatus = code;
        mockResponse.statusCode = code;
        return mockResponse;
      },
      
      json: (data: any) => {
        responseData = data;
        mockResponse._data = data; // Store raw data, stringify only when needed
        headers['Content-Type'] = 'application/json';
        return mockResponse;
      },
      
      send: (data: any) => {
        responseData = data;
        mockResponse._data = data; // Store raw data
        return mockResponse;
      },
      
      end: (data?: any) => {
        if (data !== undefined) {
          responseData = data;
          mockResponse._data = data; // Store raw data
        }
        sent = true;
        mockResponse._sent = true;
      },
      
      setHeader: (name: string, value: string) => {
        headers[name] = value;
        return mockResponse;
      },
      
      statusCode: currentStatus,
      headers: headers,
      _data: responseData,
      _sent: sent
    };
    
    console.log(`createRes is returning mock response`);
    return mockResponse;
    
  } catch (err: any) {
    console.log(`createRes error ${err.message}`);
    throw err;
  }
}

// Export response mocking utilities using ES module syntax
export {
  createJsonRes,
  createRes
};