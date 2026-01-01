/**
 * Scalable API Utilities
 * Optimized HTTP request handling with connection pooling, retries, and circuit breakers
 */

import { EventEmitter } from 'events';

export interface ApiRequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  circuitBreakerThreshold?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  duration: number;
}

export interface ApiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  circuitBreakerActivations: number;
}

interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

/**
 * Scalable API client with connection pooling, retries, and circuit breaker
 */
export class ScalableApiClient extends EventEmitter {
  private metrics: ApiMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    circuitBreakerActivations: 0
  };

  private circuitBreakers = new Map<string, CircuitBreakerState>();
  private activeRequests = new Set<string>();
  private requestQueue: Array<{ id: string; execute: () => Promise<any>; timestamp: number }> = [];
  private maxConcurrentRequests = 20; // Reduced to prevent overload
  private processingQueue = false;
  private readonly maxQueueSize = 100; // Reduced queue size for better memory management

  constructor(options: { maxConcurrentRequests?: number } = {}) {
    super();
    this.maxConcurrentRequests = options.maxConcurrentRequests || 20; // Reduced to prevent overload
  }

  /**
   * Execute API request with retry logic and circuit breaker protection
   */
  async request<T = any>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    const requestId = this.generateRequestId();
    const startTime = Date.now();
    
    // Add to queue if at concurrency limit
    if (this.activeRequests.size >= this.maxConcurrentRequests) {
      // Check queue size limit
      if (this.requestQueue.length >= this.maxQueueSize) {
        throw new Error('API request queue is full');
      }
      
      return new Promise((resolve, reject) => {
        this.requestQueue.push({
          id: requestId,
          execute: async () => {
            try {
              const result = await this.executeRequest<T>(config, requestId, startTime);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          },
          timestamp: Date.now()
        });
        this.processQueue();
      });
    }

    return this.executeRequest<T>(config, requestId, startTime);
  }

  private async executeRequest<T>(
    config: ApiRequestConfig,
    requestId: string,
    startTime: number
  ): Promise<ApiResponse<T>> {
    this.activeRequests.add(requestId);
    this.metrics.totalRequests++;

    try {
      // Check circuit breaker
      const circuitKey = this.getCircuitKey(config);
      if (!this.canExecuteRequest(circuitKey)) {
        throw new Error('Circuit breaker is OPEN');
      }

      // Execute request with retries
      const result = await this.executeWithRetries<T>(config, circuitKey);
      
      // Update metrics
      const duration = Date.now() - startTime;
      this.metrics.successfulRequests++;
      this.updateAverageResponseTime(duration);
      
      // Reset circuit breaker on success
      this.resetCircuitBreaker(circuitKey);
      
      const response: ApiResponse<T> = {
        ...result,
        duration
      };

      this.emit('request:success', { config, response, metrics: this.metrics });
      return response;

    } catch (error) {
      this.metrics.failedRequests++;
      this.handleCircuitBreakerFailure(this.getCircuitKey(config));
      
      this.emit('request:error', { config, error, metrics: this.metrics });
      throw error;
    } finally {
      this.activeRequests.delete(requestId);
      this.processQueue(); // Process next items in queue
    }
  }

  private async executeWithRetries<T>(config: ApiRequestConfig, circuitKey: string): Promise<ApiResponse<T>> {
    const maxRetries = Math.min(config.retries || 2, 2); // Limit retries to prevent resource waste
    const retryDelay = Math.min(config.retryDelay || 500, 500); // Faster retry
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.makeHttpRequest<T>(config);
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx) or timeouts
        if (error instanceof Error && (error.message.includes('4') || error.message.includes('timeout'))) {
          throw error;
        }
        
        // Wait before retry (exponential backoff with jitter)
        if (attempt < maxRetries) {
          const jitter = Math.random() * 100; // Add jitter to prevent thundering herd
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt) + jitter));
        }
      }
    }

    throw lastError!;
  }

  private async makeHttpRequest<T>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    // Use fetch if available, otherwise fallback to HTTP module
    if (typeof fetch !== 'undefined') {
      return this.makeFetchRequest<T>(config);
    } else {
      return this.makeNodeRequest<T>(config);
    }
  }

  private async makeFetchRequest<T>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await fetch(config.url, {
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body ? JSON.stringify(config.body) : undefined,
      signal: AbortSignal.timeout(config.timeout || 10000)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const headers: Record<string, string> = {};
    
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers,
      duration: 0 // Will be set by caller
    };
  }

  private async makeNodeRequest<T>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    // Fallback implementation for Node.js environments without fetch
    const https = await import('https');
    const http = await import('http');
    const url = new URL(config.url);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    return new Promise((resolve, reject) => {
      const req = client.request(config.url, {
        method: config.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        timeout: config.timeout || 10000
      }, (res: any) => {
        let data = '';
        
        res.on('data', (chunk: any) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            const headers: Record<string, string> = {};
            
            Object.entries(res.headers).forEach(([key, value]) => {
              headers[key] = Array.isArray(value) ? value.join(', ') : String(value);
            });

            resolve({
              data: parsedData,
              status: res.statusCode,
              statusText: res.statusMessage,
              headers,
              duration: 0 // Will be set by caller
            });
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (config.body) {
        req.write(JSON.stringify(config.body));
      }
      
      req.end();
    });
  }

  private processQueue(): void {
    if (this.processingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.processingQueue = true;
    
    while (this.requestQueue.length > 0 && this.activeRequests.size < this.maxConcurrentRequests) {
      const request = this.requestQueue.shift();
      if (request) {
        // Execute without waiting to allow concurrent processing
        request.execute().catch(() => {}); // Errors handled in the request itself
      }
    }
    
    this.processingQueue = false;
  }

  private canExecuteRequest(circuitKey: string): boolean {
    const circuit = this.circuitBreakers.get(circuitKey);
    if (!circuit) {
      return true; // No circuit breaker configured
    }

    const now = Date.now();
    const timeout = 60000; // 1 minute timeout

    switch (circuit.state) {
      case 'CLOSED':
        return true;
      case 'OPEN':
        // Check if we should try half-open
        return now - circuit.lastFailureTime > timeout;
      case 'HALF_OPEN':
        return true;
      default:
        return false;
    }
  }

  private handleCircuitBreakerFailure(circuitKey: string): void {
    let circuit = this.circuitBreakers.get(circuitKey);
    
    if (!circuit) {
      circuit = {
        failures: 0,
        lastFailureTime: 0,
        state: 'CLOSED'
      };
      this.circuitBreakers.set(circuitKey, circuit);
    }

    circuit.failures++;
    circuit.lastFailureTime = Date.now();

    // Open circuit after threshold failures
    if (circuit.failures >= 5 && circuit.state !== 'OPEN') {
      circuit.state = 'OPEN';
      this.metrics.circuitBreakerActivations++;
      this.emit('circuit-breaker:open', { circuitKey, failures: circuit.failures });
    }
  }

  private resetCircuitBreaker(circuitKey: string): void {
    const circuit = this.circuitBreakers.get(circuitKey);
    if (circuit && circuit.state !== 'CLOSED') {
      circuit.state = 'CLOSED';
      circuit.failures = 0;
      this.emit('circuit-breaker:close', { circuitKey });
    }
  }

  private getCircuitKey(config: ApiRequestConfig): string {
    const url = new URL(config.url);
    return `${url.hostname}:${url.port || (url.protocol === 'https:' ? 443 : 80)}`;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateAverageResponseTime(duration: number): void {
    const total = this.metrics.successfulRequests + this.metrics.failedRequests;
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (total - 1) + duration) / total;
  }

  /**
   * Get current API metrics
   */
  getMetrics(): ApiMetrics {
    return { ...this.metrics };
  }

  /**
   * Get current queue size and active requests
   */
  getQueueStatus(): { queueSize: number; activeRequests: number } {
    return {
      queueSize: this.requestQueue.length,
      activeRequests: this.activeRequests.size
    };
  }

  /**
   * Reset all metrics
   */
  resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      circuitBreakerActivations: 0
    };
  }
}

/**
 * Create a scalable API client with default configuration
 */
export function createScalableApiClient(options?: { maxConcurrentRequests?: number }): ScalableApiClient {
  return new ScalableApiClient(options);
}

/**
 * Default API client instance for common use cases
 */
export const defaultApiClient = createScalableApiClient();

/**
 * Convenience methods for common HTTP operations
 */
export const api = {
  get: <T = any>(url: string, config?: Partial<ApiRequestConfig>) =>
    defaultApiClient.request<T>({ ...config, url, method: 'GET' }),
    
  post: <T = any>(url: string, body?: any, config?: Partial<ApiRequestConfig>) =>
    defaultApiClient.request<T>({ ...config, url, method: 'POST', body }),
    
  put: <T = any>(url: string, body?: any, config?: Partial<ApiRequestConfig>) =>
    defaultApiClient.request<T>({ ...config, url, method: 'PUT', body }),
    
  delete: <T = any>(url: string, config?: Partial<ApiRequestConfig>) =>
    defaultApiClient.request<T>({ ...config, url, method: 'DELETE' }),
    
  patch: <T = any>(url: string, body?: any, config?: Partial<ApiRequestConfig>) =>
    defaultApiClient.request<T>({ ...config, url, method: 'PATCH', body })
};

export default defaultApiClient;