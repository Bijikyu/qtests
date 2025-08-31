/**
 * Axios HTTP Client Stub for Testing - TypeScript Implementation
 *
 * This module provides a minimal, side-effect-free replacement for the axios
 * HTTP client library. When tests require('axios') after qtests/setup, they
 * get this stub instead of the real axios, preventing actual network requests.
 */
// Enhanced axios stub with all HTTP methods and response structure
const mockResponse = {
    status: 200,
    statusText: 'OK',
    data: {},
    headers: {},
    config: {}
};
const axiosStub = {
    get: async () => mockResponse,
    post: async () => mockResponse,
    put: async () => mockResponse,
    delete: async () => mockResponse,
    patch: async () => mockResponse,
    head: async () => mockResponse,
    options: async () => mockResponse,
    request: async () => mockResponse
};
// Export axios stub using ES module syntax
export default axiosStub;
