/**
 * Optimized Test Discovery Cache - Simplified Version
 */

import * as fs from 'fs';
import * as path from 'path';
import { EventEmitter } from 'events';

interface CacheEntry {
  files: string[];
  timestamp: number;
}

interface CacheOptions {
  ttl?: number;
  maxSize?: number;
}

export class TestDiscoveryCache extends EventEmitter {
  private cache = new Map<string, CacheEntry>();
  private readonly defaultTTL = 30000;
  private readonly defaultMaxSize = 1000;

  constructor(private options: CacheOptions = {}) {
    super();
    this.options.ttl = this.options.ttl ?? this.defaultTTL;
    this.options.maxSize = this.options.maxSize ?? this.defaultMaxSize;
  }

  get(key: string): string[] | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > (this.options.ttl!)) {
      this.cache.delete(key);
      return null;
    }

    return entry.files;
  }

  set(key: string, files: string[]): void {
    this.cleanupCache();

    const entry: CacheEntry = {
      files: [...files],
      timestamp: Date.now()
    };

    this.cache.set(key, entry);
  }

  clear(): void {
    this.cache.clear();
    this.emit('cleared');
  }

  private cleanupCache(): void {
    if (this.cache.size <= (this.options.maxSize!)) return;

    const entriesToRemove = Math.floor(this.cache.size * 0.25);
    const sortedEntries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp);

    for (let i = 0; i < entriesToRemove; i++) {
      const [key] = sortedEntries[i];
      this.cache.delete(key);
    }
  }

  getStats(): { size: number; watchers: number; hitRate?: number; } {
    return {
      size: this.cache.size,
      watchers: 0
    };
  }
}

export const testDiscoveryCache = new TestDiscoveryCache({
  ttl: 30000,
  maxSize: 1000
});