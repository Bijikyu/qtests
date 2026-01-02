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
  limit?: number;
  offset?: number;
  batchSize?: number;
}

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  duration: number;
  cached: boolean;
  hasMore?: boolean;
  nextOffset?: number;
  totalRows?: number;
}

export interface DatabaseMetrics {
  totalQueries: number;
  cachedQueries: number;
  failedQueries: number;
  averageQueryTime: number;
  activeConnections: number;
  connectionPoolHits: number;
  connectionPoolMisses: number;
  truncatedQueries: number;
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
  private cleanupInterval?: NodeJS.Timeout;
  
  // Query optimization properties
  private queryPatterns = new Map<string, { avgResultSize: number; complexity: number; frequency: number }>();
  private readonly maxQueryPatterns = 1000; // Prevent unbounded growth
  private queryComplexityThresholds = { simple: 1, medium: 5, complex: 10 };
  
  // Index optimization properties
  private indexSuggestions = new Map<string, { fields: string[]; score: number; lastAnalyzed: number }>();
  private fieldUsageStats = new Map<string, { selectCount: number; whereCount: number; joinCount: number; orderByCount: number }>();
  private readonly maxIndexSuggestions = 100; // Prevent unbounded growth
  private readonly indexAnalysisInterval = 300000; // Analyze every 5 minutes
  
  // Metrics tracking
  private metrics: DatabaseMetrics = {
    totalQueries: 0,
    cachedQueries: 0,
    failedQueries: 0,
    averageQueryTime: 0,
    activeConnections: 0,
    connectionPoolHits: 0,
    connectionPoolMisses: 0,
    truncatedQueries: 0
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
    this.startIndexAnalysis();
  }

  /**
   * Execute a query with caching, retry logic, and pagination support
   */
  async query<T = any>(
    sql: string,
    params: any[] = [],
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    const startTime = Date.now();
    this.metrics.totalQueries++;

    try {
      // Apply pagination limits to prevent memory exhaustion
      const effectiveOptions = this.applyPaginationLimits(sql, options);
      
      // Check query cache first (only for non-paginated queries)
      if (effectiveOptions.cache !== false && this.config.enableQueryCache && !effectiveOptions.offset) {
        const cacheKey = effectiveOptions.cacheKey || this.generateCacheKey(sql, params);
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
      let result = await this.executeQueryWithRetry<T>(sql, params, { ...effectiveOptions, timeout: timeoutMs });
      
      // Update pattern tracking
      const patternKey = sql.substring(0, 100); // Use first 100 chars as pattern key
      const existing = this.queryPatterns.get(patternKey);
      const avgResultSize = existing ? ((existing.avgResultSize * existing.frequency) + result.rows.length) / (existing.frequency + 1) : result.rows.length;
      
      this.queryPatterns.set(patternKey, {
        avgResultSize,
        complexity: analysis.complexity,
        frequency: (existing?.frequency || 0) + 1
      });
      
      // Cleanup old patterns if map gets too large
      if (this.queryPatterns.size > this.maxQueryPatterns) {
        this.cleanupQueryPatterns();
      }
      
      // Apply result size limits and pagination metadata
      const processedResult = await this.processQueryResult<T>(result, effectiveOptions, analysis);
      
      // Cache result if enabled and size is reasonable (only first page)
      if (effectiveOptions.cache !== false && this.config.enableQueryCache && 
          processedResult.rows.length < 1000 && !effectiveOptions.offset) {
        const cacheKey = effectiveOptions.cacheKey || this.generateCacheKey(sql, params);
        this.setCache(cacheKey, processedResult);
      }
      
      const duration = Date.now() - startTime;
      this.updateAverageQueryTime(duration);
      
      this.emit('query:success', { sql, params, result: processedResult, duration });
      return {
        ...processedResult,
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
   * Apply pagination limits to prevent memory exhaustion
   */
  private applyPaginationLimits(sql: string, options: QueryOptions): QueryOptions {
    const effectiveOptions = { ...options };
    
    // Set default batch size if not specified
    if (!effectiveOptions.batchSize) {
      effectiveOptions.batchSize = Math.min(1000, this.maxResultRows);
    }
    
    // Enforce maximum batch size
    effectiveOptions.batchSize = Math.min(effectiveOptions.batchSize, this.maxResultRows);
    
    // If no limit specified, use batch size as limit
    if (!effectiveOptions.limit) {
      effectiveOptions.limit = effectiveOptions.batchSize;
    } else {
      // Enforce maximum limit
      effectiveOptions.limit = Math.min(effectiveOptions.limit, this.maxResultRows);
    }
    
    return effectiveOptions;
  }

  /**
   * Process query result with pagination and memory management
   */
  private async processQueryResult<T>(
    result: { rows: T[]; rowCount: number },
    options: QueryOptions,
    analysis: any
  ): Promise<QueryResult<T>> {
    const memoryPressure = this.getMemoryPressure();
    const adaptiveLimit = this.calculateAdaptiveResultLimit(result.rows.length, analysis.complexity, memoryPressure);
    
    let processedRows = result.rows;
    let hasMore = false;
    let nextOffset: number | undefined;
    let totalRows: number | undefined;
    
    // Apply adaptive limits
    if (processedRows.length > adaptiveLimit) {
      const originalCount = processedRows.length;
      processedRows = processedRows.slice(0, adaptiveLimit);
      
      // Enhanced warning with context and recommendations
      const warning = this.generateTruncationWarning(originalCount, adaptiveLimit, analysis, memoryPressure);
      console.warn(warning);
      
      // Emit detailed truncation event for application-level handling
      this.emit('query:truncated', { 
        originalCount, 
        truncatedCount: adaptiveLimit,
        adaptiveLimit,
        memoryPressure,
        complexity: analysis.complexity,
        recommendation: this.getTruncationRecommendation(analysis, memoryPressure)
      });
      
      // Update metrics for truncation tracking
      this.metrics.truncatedQueries = (this.metrics.truncatedQueries || 0) + 1;
    }
    
    // Handle pagination metadata
    if (options.limit && processedRows.length >= options.limit) {
      hasMore = true;
      nextOffset = (options.offset || 0) + options.limit;
    }
    
    // For paginated queries, try to get total count if feasible
    if (options.offset && options.limit && memoryPressure < 0.8) {
      try {
        totalRows = await this.getTotalCount(result.rowCount, options);
      } catch (error) {
        // Don't fail the query if count fails
        console.warn('Failed to get total row count for pagination:', error);
      }
    }
    
    return {
      rows: processedRows,
      rowCount: processedRows.length,
      hasMore,
      nextOffset,
      totalRows,
      duration: 0,
      cached: false
    };
  }

  /**
   * Get total row count for paginated queries
   */
  private async getTotalCount(currentRowCount: number, options: QueryOptions): Promise<number> {
    // This is a simplified implementation - in practice, you'd modify the query
    // to get COUNT(*) or use database-specific methods
    return currentRowCount + ((options.offset || 0) + (options.limit || 0));
  }

  /**
   * Execute paginated query to get all results efficiently
   */
  async queryAll<T = any>(
    sql: string,
    params: any[] = [],
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    const allRows: T[] = [];
    let offset = 0;
    let hasMore = true;
    let totalRows: number | undefined;
    const batchSize = options.batchSize || options.limit || 500;
    
    while (hasMore && offset < (this.maxResultRows * 2)) { // Safety limit
      const result = await this.query<T>(sql, params, {
        ...options,
        limit: batchSize,
        offset,
        cache: false // Don't cache paginated results
      });
      
      allRows.push(...result.rows);
      hasMore = result.hasMore || false;
      offset = result.nextOffset || offset + batchSize;
      
      if (result.totalRows !== undefined) {
        totalRows = result.totalRows;
      }
      
      // Stop if we got all results
      if (!hasMore || result.rows.length < batchSize) {
        break;
      }
      
      // Check memory pressure and stop if too high
      const memoryPressure = this.getMemoryPressure();
      if (memoryPressure > 0.9) {
        console.warn('High memory pressure detected, stopping paginated query');
        break;
      }
    }
    
    return {
      rows: allRows,
      rowCount: allRows.length,
      hasMore: false,
      totalRows,
      duration: 0,
      cached: false
    };
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
  this.cleanupInterval = setInterval(() => {
    if (this.isShutdown) {
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
        this.cleanupInterval = undefined;
      }
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
   * Cleanup old query patterns to prevent memory leaks
   */
  private cleanupQueryPatterns(): void {
    const entries = Array.from(this.queryPatterns.entries());
    
    // Sort by frequency (lowest first) to keep useful patterns
    entries.sort((a, b) => a[1].frequency - b[1].frequency);
    
    // Remove least frequent patterns (keep 80% of patterns)
    const removeCount = Math.floor(entries.length * 0.2);
    for (let i = 0; i < removeCount; i++) {
      this.queryPatterns.delete(entries[i][0]);
    }
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
   * Get current memory pressure (0-1 scale)
   */
  private getMemoryPressure(): number {
    try {
      const memUsage = process.memoryUsage();
      const totalMem = require('os').totalmem();
      const usedMem = totalMem - require('os').freemem();
      return Math.min(1, usedMem / totalMem);
    } catch {
      return 0.5; // Default to medium pressure on error
    }
  }

  /**
   * Calculate adaptive result limit based on conditions
   */
  private calculateAdaptiveResultLimit(resultCount: number, complexity: number, memoryPressure: number): number {
    let adaptiveLimit = this.maxResultRows;
    
    // Reduce limit based on memory pressure
    if (memoryPressure > 0.9) {
      adaptiveLimit = Math.floor(adaptiveLimit * 0.3); // 70% reduction
    } else if (memoryPressure > 0.8) {
      adaptiveLimit = Math.floor(adaptiveLimit * 0.5); // 50% reduction
    } else if (memoryPressure > 0.7) {
      adaptiveLimit = Math.floor(adaptiveLimit * 0.7); // 30% reduction
    }
    
    // Reduce limit based on query complexity
    if (complexity > 10) {
      adaptiveLimit = Math.floor(adaptiveLimit * 0.5); // Complex queries get smaller limits
    } else if (complexity > 5) {
      adaptiveLimit = Math.floor(adaptiveLimit * 0.7); // Medium complexity
    }
    
    // Ensure minimum limit
    return Math.max(10, adaptiveLimit);
  }

  /**
   * Generate detailed truncation warning
   */
  private generateTruncationWarning(originalCount: number, truncatedCount: number, analysis: any, memoryPressure: number): string {
    const complexityDesc = analysis.complexity > 10 ? 'very complex' : 
                          analysis.complexity > 5 ? 'complex' : 
                          analysis.complexity > 1 ? 'moderate' : 'simple';
    
    const pressureDesc = memoryPressure > 0.9 ? 'critical' : 
                        memoryPressure > 0.8 ? 'high' : 
                        memoryPressure > 0.7 ? 'medium' : 'low';
    
    return `Query result truncated from ${originalCount} to ${truncatedCount} rows. ` +
           `Query complexity: ${complexityDesc}, Memory pressure: ${pressureDesc}. ` +
           `Consider pagination, query optimization, or reducing result set size.`;
  }

  /**
   * Get truncation recommendation based on analysis
   */
  private getTruncationRecommendation(analysis: any, memoryPressure: number): string {
    const recommendations: string[] = [];
    
    if (analysis.complexity > 5) {
      recommendations.push('Consider query optimization or breaking into simpler queries');
    }
    
    if (memoryPressure > 0.8) {
      recommendations.push('Reduce memory usage by implementing pagination');
    }
    
    if (analysis.estimatedRows > 1000) {
      recommendations.push('Add LIMIT clause or implement cursor-based pagination');
    }
    
    recommendations.push('Consider caching frequently accessed results');
    
    return recommendations.join('; ');
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
    
    // Extract and analyze field usage for index optimization
    this.analyzeFieldUsage(sql, upperSql);
    
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
   * Analyze field usage for index optimization
   */
  private analyzeFieldUsage(sql: string, upperSql: string): void {
    // Extract field names from SELECT clause
    const selectMatch = upperSql.match(/SELECT\s+(.+?)\s+FROM/i);
    if (selectMatch) {
      const selectFields = this.extractFieldNames(selectMatch[1]);
      selectFields.forEach(field => {
        this.incrementFieldUsage(field, 'selectCount');
      });
    }
    
    // Extract field names from WHERE clause
    const whereMatch = upperSql.match(/WHERE\s+(.+?)(?:\s+GROUP\s+BY|\s+ORDER\s+BY|\s+LIMIT|$)/i);
    if (whereMatch) {
      const whereFields = this.extractFieldNames(whereMatch[1]);
      whereFields.forEach(field => {
        this.incrementFieldUsage(field, 'whereCount');
      });
    }
    
    // Extract field names from ORDER BY clause
    const orderByMatch = upperSql.match(/ORDER\s+BY\s+(.+?)(?:\s+LIMIT|$)/i);
    if (orderByMatch) {
      const orderByFields = this.extractFieldNames(orderByMatch[1]);
      orderByFields.forEach(field => {
        this.incrementFieldUsage(field, 'orderByCount');
      });
    }
    
    // Extract field names from JOIN conditions
    const joinMatches = upperSql.match(/JOIN\s+.+?\s+ON\s+(.+?)(?:\s+JOIN|\s+WHERE|$)/gi);
    if (joinMatches) {
      joinMatches.forEach(joinClause => {
        const joinFields = this.extractFieldNames(joinClause);
        joinFields.forEach(field => {
          this.incrementFieldUsage(field, 'joinCount');
        });
      });
    }
  }

  /**
   * Extract field names from SQL clause
   */
  private extractFieldNames(clause: string): string[] {
    const fields: string[] = [];
    
    // Remove functions and keep only field references
    const cleaned = clause.replace(/\b\w+\s*\([^)]*\)/g, '');
    
    // Match field patterns (table.field or field)
    const fieldPattern = /(?:\w+\.)?([a-zA-Z_][a-zA-Z0-9_]*)/g;
    let match;
    
    while ((match = fieldPattern.exec(cleaned)) !== null) {
      const field = match[1];
      // Skip SQL keywords and common functions
      if (!['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL', 'TRUE', 'FALSE', 'ASC', 'DESC', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN'].includes(field.toUpperCase())) {
        fields.push(field);
      }
    }
    
    return [...new Set(fields)]; // Remove duplicates
  }

  /**
   * Increment field usage statistics
   */
  private incrementFieldUsage(field: string, usageType: 'selectCount' | 'whereCount' | 'joinCount' | 'orderByCount'): void {
    const stats = this.fieldUsageStats.get(field) || { selectCount: 0, whereCount: 0, joinCount: 0, orderByCount: 0 };
    stats[usageType]++;
    this.fieldUsageStats.set(field, stats);
  }

  /**
   * Start periodic index analysis
   */
  private startIndexAnalysis(): void {
    setInterval(() => {
      this.performIndexAnalysis();
    }, this.indexAnalysisInterval);
  }

  /**
   * Perform index analysis and generate suggestions
   */
  private performIndexAnalysis(): void {
    if (this.fieldUsageStats.size === 0) return;
    
    const suggestions: Array<{ fields: string[]; score: number }> = [];
    
    // Analyze each field for index potential
    for (const [field, stats] of this.fieldUsageStats.entries()) {
      const score = this.calculateIndexScore(stats);
      
      if (score > 50) { // Threshold for index suggestion
        suggestions.push({
          fields: [field],
          score
        });
      }
    }
    
    // Look for composite index opportunities (fields frequently used together)
    const compositeSuggestions = this.findCompositeIndexOpportunities();
    suggestions.push(...compositeSuggestions);
    
    // Sort by score and keep only top suggestions
    suggestions.sort((a, b) => b.score - a.score);
    
    // Update index suggestions
    this.indexSuggestions.clear();
    const maxSuggestions = Math.min(suggestions.length, this.maxIndexSuggestions);
    
    for (let i = 0; i < maxSuggestions; i++) {
      const suggestion = suggestions[i];
      this.indexSuggestions.set(
        suggestion.fields.join('_'),
        {
          fields: suggestion.fields,
          score: suggestion.score,
          lastAnalyzed: Date.now()
        }
      );
    }
    
    // Emit index suggestions for monitoring
    if (this.indexSuggestions.size > 0) {
      this.emit('index:suggestions', this.getIndexSuggestions());
    }
  }

  /**
   * Calculate index score based on field usage statistics
   */
  private calculateIndexScore(stats: { selectCount: number; whereCount: number; joinCount: number; orderByCount: number }): number {
    let score = 0;
    
    // WHERE clause usage is most important for indexes
    score += stats.whereCount * 40;
    
    // JOIN conditions are also very important
    score += stats.joinCount * 30;
    
    // ORDER BY clauses benefit from indexes
    score += stats.orderByCount * 20;
    
    // SELECT alone (covering index) has some benefit
    score += stats.selectCount * 10;
    
    // Apply diminishing returns for very high usage
    return Math.min(100, score);
  }

  /**
   * Find composite index opportunities
   */
  private findCompositeIndexOpportunities(): Array<{ fields: string[]; score: number }> {
    const opportunities: Array<{ fields: string[]; score: number }> = [];
    
    // Look for field pairs that frequently appear together in WHERE clauses
    const fieldPairs = new Map<string, number>();
    
    // This is a simplified implementation - in practice, you'd analyze actual query patterns
    for (const [field1, stats1] of this.fieldUsageStats.entries()) {
      for (const [field2, stats2] of this.fieldUsageStats.entries()) {
        if (field1 >= field2) continue; // Avoid duplicates
        
        // Calculate co-occurrence score (simplified)
        const coOccurrenceScore = Math.min(stats1.whereCount, stats2.whereCount) * 0.3;
        
        if (coOccurrenceScore > 20) {
          const pairKey = `${field1}_${field2}`;
          fieldPairs.set(pairKey, coOccurrenceScore);
        }
      }
    }
    
    // Convert to opportunities array
    for (const [pairKey, score] of fieldPairs.entries()) {
      const [field1, field2] = pairKey.split('_');
      opportunities.push({
        fields: [field1, field2],
        score
      });
    }
    
    return opportunities;
  }

  /**
   * Get current index suggestions
   */
  public getIndexSuggestions(): Array<{ fields: string[]; score: number; recommendation: string }> {
    const suggestions: Array<{ fields: string[]; score: number; recommendation: string }> = [];
    
    for (const [key, suggestion] of this.indexSuggestions.entries()) {
      let recommendation = '';
      
      if (suggestion.score > 80) {
        recommendation = 'High priority - create index immediately';
      } else if (suggestion.score > 60) {
        recommendation = 'Medium priority - consider creating index';
      } else {
        recommendation = 'Low priority - monitor before creating index';
      }
      
      suggestions.push({
        fields: suggestion.fields,
        score: suggestion.score,
        recommendation
      });
    }
    
    return suggestions.sort((a, b) => b.score - a.score);
  }

  /**
   * Get field usage statistics for monitoring
   */
  public getFieldUsageStats(): Record<string, { selectCount: number; whereCount: number; joinCount: number; orderByCount: number }> {
    const stats: Record<string, { selectCount: number; whereCount: number; joinCount: number; orderByCount: number }> = {};
    
    for (const [field, usage] of this.fieldUsageStats.entries()) {
      stats[field] = { ...usage };
    }
    
    return stats;
  }

  /**
   * Close all connections and cleanup
   */
async close(): Promise<void> {
  if (this.isShutdown) {
    return;
  }
  
  this.isShutdown = true;

  // Clear cleanup interval
  if (this.cleanupInterval) {
    clearInterval(this.cleanupInterval);
    this.cleanupInterval = undefined;
  }

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