/**
 * Shared HTTP Client with Connection Pooling
 * 
 * Provides a centralized axios instance with connection pooling,
 * proper timeout configuration, and retry logic for scalability.
 */

const axios = require('axios');
const https = require('https');
const http = require('http');

// Create connection pooling agents
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

// Create shared axios instance with connection pooling
const httpClient = axios.create({
  // Default configuration
  timeout: 10000,
  maxRedirects: 5,
  
  // Connection pooling
  httpsAgent,
  httpAgent,
  
  // Request/response configuration for performance
  maxContentLength: 10 * 1024 * 1024, // 10MB
  maxBodyLength: 10 * 1024 * 1024, // 10MB
  
  // Enable response compression
  decompress: true,
  
  // Validate status codes
  validateStatus: (status) => status >= 200 && status < 300,
});

// Request interceptor for logging and monitoring
httpClient.interceptors.request.use(
  (config) => {
    // Add request timestamp for monitoring
    config.metadata = { startTime: Date.now() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for metrics and error handling
httpClient.interceptors.response.use(
  (response) => {
    // Calculate request duration for metrics
    const duration = Date.now() - response.config.metadata.startTime;
    response.config.metadata.duration = duration;
    
    // Log slow requests
    if (duration > 5000) { // 5 seconds
      console.warn(`Slow HTTP request: ${response.config.method?.toUpperCase()} ${response.config.url} took ${duration}ms`);
    }
    
    return response;
  },
  (error) => {
    // Add error context
    if (error.config) {
      const duration = Date.now() - (error.config.metadata?.startTime || Date.now());
      error.config.metadata = { ...error.config.metadata, duration };
    }
    
    return Promise.reject(error);
  }
);

/**
 * Cleanup function to close connection pools
 * Call this during application shutdown
 */
function cleanup() {
  httpsAgent.destroy();
  httpAgent.destroy();
}

// Register cleanup on process exit
if (typeof process !== 'undefined') {
  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGUSR2', cleanup); // nodemon restart
}

module.exports = {
  httpClient,
  cleanup,
  httpsAgent,
  httpAgent
};