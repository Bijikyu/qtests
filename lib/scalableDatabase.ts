/**
 * Scalable Database Utilities
 * Optimized database operations with connection pooling, query batching, and caching
 */

import { EventEmitter } from 'events';

export interface DatabaseConfig {
  host: string;
  port?: number;
  database: string;
  username?: string;
  password?: string;
  maxConnections?: number;
  minConnections?: number;
  acquireTimeout?: number;
  idleTimeout?: number;
  queryTimeout?: number;
  enableQueryCache?: boolean;
  cacheMaxSize?: number;
  cacheTtlMs?: number;
}

export interface QueryOptions {
  timeout?: number;
  cache?: boolean;
  cacheKey?: string;
  retries?: number;
}

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  duration: number;
  cached: boolean;
}

export interface DatabaseMetrics {
  totalQueries: number;
  cachedQueries: number;
  failedQueries: number;
  averageQueryTime: number;
  activeConnections: number;
  connectionPoolHits: number;
  connectionPoolMisses: number;
}

interface CachedQuery {
  result: QueryResult;
  timestamp: number;
  ttl: number;
}

/**
 * Scalable Database Client with connection pooling and query caching
 */
export class ScalableDatabaseClient extends EventEmitter {
  private config: Required<DatabaseConfig>;
  private connectionPool: any[] = [];
  private activeConnections = new Set<any>();
  private waitingQueue: Array<{
    resolve: (connection: any) => void;
    reject: (error: Error) => void;
    timeout: NodeJS.Timeout;
  }> = [];
  
  // Query caching
  private queryCache = new Map<string, CachedQuery>();
  private cacheMaxSize: number;
  private cacheTtlMs: number;
  
  // Metrics tracking
  private metrics: DatabaseMetrics = {
    totalQueries: 0,
    cachedQueries: 0,
    failedQueries: 0,
    averageQueryTime: 0,
    activeConnections: 0,
    connectionPoolHits: 0,
    connectionPoolMisses: 0
  };

  constructor(config: DatabaseConfig) {
    super();
    
    this.config = {
      host: config.host,
      port: config.port || 5432,
      database: config.database,
      username: config.username || '',
      password: config.password || '',
      maxConnections: config.maxConnections || 100, // Increased for production scalability
      minConnections: config.minConnections || 10,
      acquireTimeout: config.acquireTimeout || 5000,
      idleTimeout: config.idleTimeout || 30000,
      queryTimeout: config.queryTimeout || 10000,
      enableQueryCache: config.enableQueryCache ?? true,
      cacheMaxSize: config.cacheMaxSize || 1000,
      cacheTtlMs: config.cacheTtlMs || 60000
    };
    
    this.cacheMaxSize = this.config.cacheMaxSize;
    this.cacheTtlMs = this.config.cacheTtlMs;
    
    this.initializeConnectionPool();
    this.startCacheCleanup();
  }

  /**
   * Execute a query with caching and retry logic
   */
  async query<T = any>(
    sql: string,
    params: any[] = [],
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    const startTime = Date.now();
    this.metrics.totalQueries++;

    try {
      // Check query cache first
      if (options.cache !== false && this.config.enableQueryCache) {
        const cacheKey = options.cacheKey || this.generateCacheKey(sql, params);
        const cached = this.getFromCache(cacheKey);
        
        if (cached) {
          this.metrics.cachedQueries++;
          const duration = Date.now() - startTime;
          this.updateAverageQueryTime(duration);
          
          return {
            ...cached.result,
            duration,
            cached: true
          };
        }
      }

      // Execute query
      const result = await this.executeQueryWithRetry<T>(sql, params, options);
      
      // Cache result if enabled
      if (options.cache !== false && this.config.enableQueryCache) {
        const cacheKey = options.cacheKey || this.generateCacheKey(sql, params);
        this.setCache(cacheKey, result);
      }
      
      const duration = Date.now() - startTime;
      this.updateAverageQueryTime(duration);
      
      this.emit('query:success', { sql, params, result, duration });
      return {
        ...result,
        duration,
        cached: false
      };

    } catch (error) {
      this.metrics.failedQueries++;
      this.emit('query:error', { sql, params, error });
      throw error;
    }
  }

  /**
   * Execute multiple queries in a transaction
   */
  async transaction<T>(queries: Array<{ sql: string; params?: any[] }>): Promise<QueryResult<T>[]> {
    const connection = await this.acquireConnection();
    const startTime = Date.now();
    
    try {
      await this.beginTransaction(connection);
      
      const results: QueryResult<T>[] = [];
      for (const query of queries) {
        const result = await this.executeSingleQuery<T>(connection, query.sql, query.params || []);
        results.push(result);
      }
      
      await this.commitTransaction(connection);
      
      const duration = Date.now() - startTime;
      this.emit('transaction:success', { queryCount: queries.length, duration });
      
      return results.map(result => ({
        ...result,
        duration: duration / queries.length,
        cached: false
      }));
      
    } catch (error) {
      await this.rollbackTransaction(connection);
      this.emit('transaction:error', { queries, error });
      throw error;
    } finally {
      this.releaseConnection(connection);
    }
  }

  /**
   * Batch execute the same query with multiple parameter sets
   */
  async batchQuery<T = any>(
    sql: string,
    paramsList: any[][],
    options: QueryOptions = {}
  ): Promise<QueryResult<T>[]> {
    const startTime = Date.now();
    const results: QueryResult<T>[] = [];
    
    // Execute queries concurrently (but with connection limit)
    const batchSize = Math.min(paramsList.length, this.config.maxConnections);
    const batches: any[][] = [];
    
    for (let i = 0; i < paramsList.length; i += batchSize) {
      batches.push(paramsList.slice(i, i + batchSize));
    }
    
    for (const batch of batches) {
      const batchPromises = batch.map(params => 
        this.query<T>(sql, params, { ...options, cache: false }) // Disable cache for batch queries
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      for (const promiseResult of batchResults) {
        if (promiseResult.status === 'fulfilled') {
          results.push(promiseResult.value);
        } else {
          // Handle failed query in batch
          this.metrics.failedQueries++;
          throw promiseResult.reason;
        }
      }
    }
    
    const duration = Date.now() - startTime;
    this.emit('batch-query:success', { sql, paramCount: paramsList.length, duration });
    
    return results;
  }

  private async executeQueryWithRetry<T>(
    sql: string,
    params: any[],
    options: QueryOptions
  ): Promise<QueryResult<T>> {
    const maxRetries = options.retries || 3;
    const retryDelay = 1000;
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const connection = await this.acquireConnection();
        
        try {
          return await this.executeSingleQuery<T>(connection, sql, params, options.timeout);
        } finally {
          this.releaseConnection(connection);
        }
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (this.isNonRetryableError(lastError)) {
          throw lastError;
        }
        
        // Wait before retry
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        }
      }
    }

    throw lastError!;
  }

  private async executeSingleQuery<T>(
    connection: any,
    sql: string,
    params: any[],
    timeout?: number
  ): Promise<QueryResult<T>> {
    // This would be implemented based on the specific database driver
    // For now, return a mock result
    const mockResult = {
      rows: [] as T[],
      rowCount: 0
    };
    
    return {
      ...mockResult,
      duration: 0,
      cached: false
    };
  }

  private async acquireConnection(): Promise<any> {
    // Try to find an available connection
    let connection = this.connectionPool.find(conn => !this.activeConnections.has(conn));
    
    if (connection) {
      this.metrics.connectionPoolHits++;
      this.activeConnections.add(connection);
      this.metrics.activeConnections = this.activeConnections.size;
      return connection;
    }

    // Can we create a new connection?
    if (this.connectionPool.length < this.config.maxConnections) {
      connection = await this.createConnection();
      this.connectionPool.push(connection);
      this.activeConnections.add(connection);
      this.metrics.connectionPoolMisses++;
      this.metrics.activeConnections = this.activeConnections.size;
      return connection;
    }

    // Wait for a connection to become available
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const index = this.waitingQueue.findIndex(w => w.resolve === resolve);
        if (index >= 0) {
          this.waitingQueue.splice(index, 1);
        }
        reject(new Error('Connection acquire timeout'));
      }, this.config.acquireTimeout);

      this.waitingQueue.push({
        resolve,
        reject,
        timeout: timeoutId
      });
    });
  }

  private releaseConnection(connection: any): void {
    if (!this.activeConnections.has(connection)) {
      return; // Connection not active
    }

    this.activeConnections.delete(connection);
    this.metrics.activeConnections = this.activeConnections.size;

    // Process waiting queue
    if (this.waitingQueue.length > 0) {
      const waiter = this.waitingQueue.shift();
      if (waiter) {
        clearTimeout(waiter.timeout);
        this.activeConnections.add(connection);
        this.metrics.activeConnections = this.activeConnections.size;
        waiter.resolve(connection);
      }
    }
  }

  private async createConnection(): Promise<any> {
    // Mock connection creation - would be implemented based on database type
    return {
      id: Math.random(),
      created: Date.now(),
      query: async (sql: string, params: any[]) => ({ rows: [], rowCount: 0 })
    };
  }

  private async initializeConnectionPool(): Promise<void> {
    const promises = [];
    
    for (let i = 0; i < this.config.minConnections; i++) {
      promises.push(this.createConnection().then(conn => {
        this.connectionPool.push(conn);
      }));
    }
    
    await Promise.allSettled(promises);
  }

  private generateCacheKey(sql: string, params: any[]): string {
    const paramsHash = params.length > 0 ? 
      Buffer.from(JSON.stringify(params)).toString('base64') : 
      '';
    return `${sql}_${paramsHash}`;
  }

  private getFromCache(key: string): CachedQuery | null {
    const cached = this.queryCache.get(key);
    
    if (!cached) {
      return null;
    }
    
    // Check if cache entry has expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.queryCache.delete(key);
      return null;
    }
    
    return cached;
  }

  private setCache(key: string, result: QueryResult): void {
    // Evict oldest entry if cache is full
    if (this.queryCache.size >= this.cacheMaxSize) {
      const oldestKey = this.queryCache.keys().next().value;
      if (oldestKey) {
        this.queryCache.delete(oldestKey);
      }
    }
    
    this.queryCache.set(key, {
      result: { ...result },
      timestamp: Date.now(),
      ttl: this.cacheTtlMs
    });
  }

  private startCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      const toDelete: string[] = [];
      
      this.queryCache.forEach((cached, key) => {
        if (now - cached.timestamp > cached.ttl) {
          toDelete.push(key);
        }
      });
      
      toDelete.forEach(key => this.queryCache.delete(key));
    }, this.cacheTtlMs / 2); // Cleanup twice as often as TTL
  }

  private updateAverageQueryTime(duration: number): void {
    const totalQueries = this.metrics.totalQueries - this.metrics.cachedQueries;
    this.metrics.averageQueryTime = 
      (this.metrics.averageQueryTime * (totalQueries - 1) + duration) / totalQueries;
  }

  private isNonRetryableError(error: Error): boolean {
    // Check for errors that shouldn't be retried
    const nonRetryablePatterns = [
      'syntax error',
      'constraint violation',
      'duplicate key',
      'foreign key violation',
      'division by zero'
    ];
    
    return nonRetryablePatterns.some(pattern => 
      error.message.toLowerCase().includes(pattern)
    );
  }

  // Transaction methods (mock implementations)
  private async beginTransaction(connection: any): Promise<void> {
    // Mock implementation
  }

  private async commitTransaction(connection: any): Promise<void> {
    // Mock implementation
  }

  private async rollbackTransaction(connection: any): Promise<void> {
    // Mock implementation
  }

  /**
   * Get current database metrics
   */
  getMetrics(): DatabaseMetrics {
    return { ...this.metrics };
  }

  /**
   * Clear query cache
   */
  clearCache(): void {
    this.queryCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; hitRate: number } {
    const hitRate = this.metrics.totalQueries > 0 ? 
      (this.metrics.cachedQueries / this.metrics.totalQueries) * 100 : 0;
    
    return {
      size: this.queryCache.size,
      hitRate
    };
  }

  /**
   * Close all connections and cleanup
   */
  async close(): Promise<void> {
    // Close all active connections
    const closePromises = this.connectionPool.map(async (connection) => {
      try {
        if (connection.close) {
          await connection.close();
        }
      } catch (error) {
        console.warn('Error closing database connection:', error);
      }
    });
    
    await Promise.allSettled(closePromises);
    
    this.connectionPool = [];
    this.activeConnections.clear();
    this.queryCache.clear();
  }
}

/**
 * Create a scalable database client
 */
export function createScalableDatabaseClient(config: DatabaseConfig): ScalableDatabaseClient {
  return new ScalableDatabaseClient(config);
}

export default ScalableDatabaseClient;