/**
 * Scalable Database Utilities
 * Memory-efficient database operations with optimized connection pooling and query caching
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
    timestamp: number;
  }> = [];
  
  private readonly maxQueueSize: number;
  private readonly maxResultRows = 10000; // Prevent memory bloat from large result sets
  private readonly maxBatchSize = 100; // Limit batch size for better performance
  private isShutdown = false;
  
  // Query caching
  private queryCache = new Map<string, CachedQuery>();
  private cacheMaxSize: number;
  private cacheTtlMs: number;
  
  // Query optimization properties
  private queryPatterns = new Map<string, { avgResultSize: number; complexity: number; frequency: number }>();
  private queryComplexityThresholds = { simple: 1, medium: 5, complex: 10 };
  
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
      maxConnections: config.maxConnections || 20, // Reduced to prevent resource exhaustion
      minConnections: config.minConnections || 2,
      acquireTimeout: config.acquireTimeout || 3000,
      idleTimeout: config.idleTimeout || 15000, // Shorter idle timeout
      queryTimeout: config.queryTimeout || 5000, // Faster query timeout
      enableQueryCache: config.enableQueryCache ?? true,
      cacheMaxSize: config.cacheMaxSize || 200, // Reduced cache size
      cacheTtlMs: config.cacheTtlMs || 30000 // Shorter cache TTL
    };
    
    this.cacheMaxSize = this.config.cacheMaxSize;
    this.cacheTtlMs = this.config.cacheTtlMs;
    this.maxQueueSize = Math.min(this.config.maxConnections * 2, 50); // Stricter queue limit
    
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

      // Analyze query pattern for optimization
      const analysis = this.analyzeQueryPattern(sql, params);
      
      // Execute query with memory limits and adaptive timeout
      const timeoutMs = Math.min(30000, analysis.complexity * 2000); // Adaptive timeout
      let result = await this.executeQueryWithRetry<T>(sql, params, { ...options, timeout: timeoutMs });
      
      // Update pattern tracking
      const patternKey = sql.substring(0, 100); // Use first 100 chars as pattern key
      const existing = this.queryPatterns.get(patternKey);
      const avgResultSize = existing ? ((existing.avgResultSize * existing.frequency) + result.rows.length) / (existing.frequency + 1) : result.rows.length;
      
      this.queryPatterns.set(patternKey, {
        avgResultSize,
        complexity: analysis.complexity,
        frequency: (existing?.frequency || 0) + 1
      });
      
      // Enforce result set size limits with early termination support and better warnings
      if (result.rows.length > this.maxResultRows) {
        console.warn(`Query result truncated from ${result.rows.length} to ${this.maxResultRows} rows. Consider pagination for large datasets.`);
        // Use more efficient array manipulation
        result.rows = result.rows.splice(0, this.maxResultRows);
        result.rowCount = this.maxResultRows;
        
        // Emit warning for application-level handling
        this.emit('query:truncated', { 
          originalCount: result.rows.length + this.maxResultRows, 
          truncatedCount: this.maxResultRows,
          sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : '')
        });
      }
      
      // Cache result if enabled and size is reasonable
      if (options.cache !== false && this.config.enableQueryCache && result.rows.length < 1000) {
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
  if (this.isShutdown) {
    throw new Error('Database client is shutdown');
  }

  // Limit batch size to prevent resource exhaustion
  if (paramsList.length > this.maxBatchSize) {
    throw new Error(`Batch size too large (${paramsList.length} > ${this.maxBatchSize})`);
  }

  const startTime = Date.now();
  const results: QueryResult<T>[] = [];
  
  // Execute queries concurrently with controlled parallelism
  const concurrencyLimit = Math.min(paramsList.length, this.config.maxConnections);
  const batches: any[][] = [];
  
  for (let i = 0; i < paramsList.length; i += concurrencyLimit) {
    batches.push(paramsList.slice(i, i + concurrencyLimit));
  }
  
  // Process batches sequentially but queries within each batch concurrently
  for (const batch of batches) {
    const batchPromises = batch.map(async (params, index) => {
      try {
        const result = await this.query<T>(sql, params, { ...options, cache: false });
        
        // Enforce result size limits to prevent memory bloat
        if (result.rows.length > this.maxResultRows) {
          console.warn(`Query result exceeds limit (${result.rows.length} > ${this.maxResultRows}), truncating`);
          result.rows = result.rows.slice(0, this.maxResultRows);
          result.rowCount = result.rows.length;
        }
        
        return result;
      } catch (error) {
        this.metrics.failedQueries++;
        throw new Error(`Batch query ${index} failed: ${(error as Error).message}`);
      }
    });
    
    const batchResults = await Promise.allSettled(batchPromises);
    
    // Collect successful results and fail fast on errors
    for (const promiseResult of batchResults) {
      if (promiseResult.status === 'fulfilled') {
        results.push(promiseResult.value);
      } else {
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
    // This would be implemented based on specific database driver
    // For now, return a mock result
    const mockResult = {
      rows: [] as T[],
      rowCount: 0
    };
    
    // Enforce result size limits
    if (mockResult.rows.length > this.maxResultRows) {
      console.warn(`Query returned ${mockResult.rows.length} rows, truncating to ${this.maxResultRows}`);
      mockResult.rows = mockResult.rows.slice(0, this.maxResultRows);
      mockResult.rowCount = mockResult.rows.length;
    }
    
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
    if (this.waitingQueue.length >= this.maxQueueSize) {
      throw new Error(`Connection waiting queue is full (${this.waitingQueue.length}/${this.maxQueueSize})`);
    }

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
        timeout: timeoutId,
        timestamp: Date.now()
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
  const cleanupInterval = setInterval(() => {
    if (this.isShutdown) {
      clearInterval(cleanupInterval);
      return;
    }

    const now = Date.now();
    const toDelete: string[] = [];
    
    // More efficient cleanup - avoid creating intermediate arrays when possible
    for (const [key, cached] of this.queryCache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        toDelete.push(key);
        // Early exit if we have many entries to delete
        if (toDelete.length >= 100) {
          break;
        }
      }
    }
    
    // Batch delete expired entries
    for (const key of toDelete) {
      this.queryCache.delete(key);
    }
    
    // If cache is getting full, do additional cleanup based on LRU
    if (this.queryCache.size > this.cacheMaxSize * 0.8) {
      this.evictLeastRecentlyUsed(Math.floor(this.cacheMaxSize * 0.2));
    }
  }, this.cacheTtlMs / 2); // Cleanup twice as often as TTL
}

  private updateAverageQueryTime(duration: number): void {
    const totalQueries = this.metrics.totalQueries - this.metrics.cachedQueries;
    this.metrics.averageQueryTime = 
      (this.metrics.averageQueryTime * (totalQueries - 1) + duration) / totalQueries;
  }

  /**
   * Evict least recently used cache entries
   */
  private evictLeastRecentlyUsed(count: number): void {
    const entries = Array.from(this.queryCache.entries());
    
    // Sort by timestamp (oldest first)
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove oldest entries
    for (let i = 0; i < Math.min(count, entries.length); i++) {
      this.queryCache.delete(entries[i][0]);
    }
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
   * Analyze query patterns for optimization
   */
  private analyzeQueryPattern(sql: string, params: any[]): { complexity: number; estimatedRows: number } {
    // Simple complexity scoring based on SQL patterns
    let complexity = this.queryComplexityThresholds.simple;
    let estimatedRows = 100; // Default estimate
    
    // Analyze SQL for complexity indicators
    const upperSql = sql.toUpperCase();
    
    // JOIN operations increase complexity
    const joinCount = (upperSql.match(/JOIN/g) || []).length;
    complexity += joinCount * this.queryComplexityThresholds.medium;
    
    // Subqueries increase complexity significantly
    const subqueryCount = (upperSql.match(/\(.*SELECT/g) || []).length;
    complexity += subqueryCount * this.queryComplexityThresholds.complex;
    
    // Aggregate functions
    const aggregateCount = (upperSql.match(/\b(COUNT|SUM|AVG|MAX|MIN)\b/g) || []).length;
    complexity += aggregateCount * this.queryComplexityThresholds.simple;
    
    // WHERE clauses
    const whereCount = (upperSql.match(/\bWHERE\b/g) || []).length;
    complexity += whereCount * this.queryComplexityThresholds.simple;
    
    // Estimate result rows based on query patterns
    if (upperSql.includes('LIMIT')) {
      const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        estimatedRows = parseInt(limitMatch[1]);
      }
    } else if (upperSql.includes('COUNT(')) {
      estimatedRows = 1; // COUNT queries return single row
    } else if (joinCount > 0 || subqueryCount > 0) {
      estimatedRows = 1000; // Complex queries likely return more data
    }
    
    // Adjust based on parameters (often indicates filtering)
    if (params.length > whereCount) {
      estimatedRows = Math.max(1, Math.floor(estimatedRows / params.length));
    }
    
    return { complexity, estimatedRows };
  }

  /**
   * Close all connections and cleanup
   */
async close(): Promise<void> {
  if (this.isShutdown) {
    return;
  }
  
  this.isShutdown = true;

  // Reject all waiting requests
  const waiting = this.waitingQueue.splice(0);
  for (const waiter of waiting) {
    clearTimeout(waiter.timeout);
    waiter.reject(new Error('Database client is shutdown'));
  }

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