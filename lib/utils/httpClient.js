/**
 * HTTP Client Utilities using Axios
 * 
 * Simplified HTTP client utilities that use axios directly with
 * recommended configuration for scalability and performance.
 */

const axios = require('axios');
const https = require('https');
const http = require('http');

// Create optimized agents for connection pooling
const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 60000,
  keepAliveTimeout: 30000,
});

const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 60000,
  keepAliveTimeout: 30000,
});

/**
 * Create configured axios instance with connection pooling
 * @param {Object} options - Axios configuration options
 * @returns {Object} Configured axios instance
 */
function createHttpClient(options = {}) {
  return axios.create({
    // Default configuration
    timeout: 10000,
    maxRedirects: 5,
    
    // Connection pooling
    httpsAgent,
    httpAgent,
    
    // Performance settings
    maxContentLength: 10 * 1024 * 1024, // 10MB
    maxBodyLength: 10 * 1024 * 1024, // 10MB
    decompress: true,
    
    // Status validation
    validateStatus: (status) => status >= 200 && status < 300,
    
    ...options
  });
}

// Default shared instance
const httpClient = createHttpClient();

/**
 * Add monitoring interceptors to axios instance
 * @param {Object} instance - Axios instance to enhance
 */
function addMonitoringInterceptors(instance) {
  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      config.metadata = { startTime: Date.now() };
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      const duration = Date.now() - response.config.metadata.startTime;
      response.config.metadata.duration = duration;
      
      if (duration > 5000) {
        console.warn(`Slow HTTP request: ${response.config.method?.toUpperCase()} ${response.config.url} took ${duration}ms`);
      }
      
      return response;
    },
    (error) => {
      if (error.config) {
        const duration = Date.now() - (error.config.metadata?.startTime || Date.now());
        error.config.metadata = { ...error.config.metadata, duration };
      }
      return Promise.reject(error);
    }
  );
}

// Add monitoring to default instance
addMonitoringInterceptors(httpClient);

/**
 * Cleanup function to close connection pools
 */
function cleanup() {
  httpsAgent.destroy();
  httpAgent.destroy();
}

// Register cleanup on process exit
if (typeof process !== 'undefined') {
  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGUSR2', cleanup);
}

module.exports = {
  httpClient,
  createHttpClient,
  addMonitoringInterceptors,
  cleanup,
  httpsAgent,
  httpAgent
};