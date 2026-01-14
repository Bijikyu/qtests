/**
 * Thread-Safe Port Allocator for Test Environments
 * Prevents port conflicts during parallel test execution with race condition protection
 */

import * as fs from 'fs';
import * as path from 'path';
import { EventEmitter } from 'events';
import qerrors from 'qerrors';

interface PortAllocation {
  port: number;
  pid: number;
  timestamp: number;
  testFile?: string;
}

interface PortAllocatorOptions {
  basePort?: number;
  maxPort?: number;
  cleanupIntervalMs?: number;
  allocationTimeoutMs?: number;
}

export class PortAllocator extends EventEmitter {
  private static instance: PortAllocator | null = null;
  private readonly basePort: number;
  private readonly maxPort: number;
  private readonly allocationFile: string;
  private readonly cleanupIntervalMs: number;
  private readonly allocationTimeoutMs: number;
  private allocatedPorts: Set<number> = new Set();
  public cleanupTimer?: NodeJS.Timeout;
  private cleanupInProgress = false;

  private constructor(options: PortAllocatorOptions = {}) {
    super();
    this.basePort = options.basePort || 4005;
    this.maxPort = options.maxPort || 4999;
    this.cleanupIntervalMs = options.cleanupIntervalMs || 30000;
    this.allocationTimeoutMs = options.allocationTimeoutMs || 300000;
    this.allocationFile = path.join(process.cwd(), '.test-port-allocations.json');

    this.startCleanupTimer();
  }

  static getInstance(options?: PortAllocatorOptions): PortAllocator {
    if (!PortAllocator.instance) {
      PortAllocator.instance = new PortAllocator(options);
    }
    return PortAllocator.instance;
  }

  async allocatePort(testFile?: string): Promise<number> {
    if (this.cleanupInProgress) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await this.cleanupStaleAllocations();

    const allocations = await this.loadAllocations();
    const usedPorts = new Set(allocations.map((a) => a.port));

    for (let port = this.basePort; port <= this.maxPort; port++) {
      if (!usedPorts.has(port) && !this.allocatedPorts.has(port)) {
        if (await this.isPortAvailable(port)) {
          this.allocatedPorts.add(port);

          const allocation: PortAllocation = {
            port,
            pid: process.pid,
            timestamp: Date.now(),
            testFile,
          };

          allocations.push(allocation);
          await this.saveAllocations(allocations);

          this.emit('port-allocated', port, allocation);
          return port;
        }
      }
    }

    throw new Error(`No available ports in range ${this.basePort}-${this.maxPort}`);
  }

  async releasePort(port: number): Promise<void> {
    this.allocatedPorts.delete(port);

    const allocations = await this.loadAllocations();
    const filtered = allocations.filter((a) => a.port !== port);
    await this.saveAllocations(filtered);

    this.emit('port-released', port);
  }

  async releaseAllPorts(): Promise<void> {
    try {
      const allocations = await this.loadAllocations();
      const filtered = allocations.filter((a) => a.pid !== process.pid);
      await this.saveAllocations(filtered);
      this.allocatedPorts.clear();

      this.emit('all-ports-released');
    } catch (error) {
      qerrors(error as Error, 'PortAllocator.releaseAllPorts failed', {
        allocationFile: this.allocationFile,
      });
    }
  }

  private async isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const net = require('net');
      const server = net.createServer();

      server.listen(port, () => {
        server.once('close', () => resolve(true));
        server.close();
      });

      server.on('error', () => resolve(false));
    });
  }

  private async loadAllocations(): Promise<PortAllocation[]> {
    try {
      if (!fs.existsSync(this.allocationFile)) {
        return [];
      }

      const lockFile = this.allocationFile + '.lock';
      const lockContent = `${process.pid}-${Date.now()}`;
      let attempts = 0;
      const maxAttempts = 50;

      while (attempts < maxAttempts) {
        try {
          fs.writeFileSync(lockFile, lockContent, { flag: 'wx' });
          break;
        } catch (lockError: any) {
          if (lockError.code === 'EEXIST') {
            try {
              const existingLock = fs.readFileSync(lockFile, 'utf8');
              const [, timestamp] = existingLock.split('-');
              const age = Date.now() - parseInt(timestamp);
              if (age > 10000) {
                try {
                  fs.unlinkSync(lockFile);
                } catch {
                  // Ignore stale lock removal errors
                }
                continue;
              } else {
                attempts++;
                await new Promise((resolve) => setTimeout(resolve, 100));
                continue;
              }
            } catch {
              // Ignore lock read errors
            }
          } else {
            try {
              fs.unlinkSync(lockFile);
            } catch {
              // Ignore cleanup errors
            }
            attempts++;
            await new Promise((resolve) => setTimeout(resolve, 100));
            continue;
          }
        }
      }

      if (attempts >= maxAttempts) {
        console.warn('Port allocation file lock timeout, using empty state');
        return [];
      }

      try {
        const content = await fs.promises.readFile(this.allocationFile, 'utf8');
        let parsed;
        try {
          parsed = JSON.parse(content);
        } catch {
          return [];
        }
        return Array.isArray(parsed) ? parsed : [];
      } finally {
        try {
          fs.unlinkSync(lockFile);
        } catch {
          // Ignore lock cleanup errors
        }
      }
    } catch (error) {
      qerrors(error as Error, 'PortAllocator.loadAllocations failed', {
        allocationFile: this.allocationFile,
      });
      return [];
    }
  }

  private async saveAllocations(allocations: PortAllocation[]): Promise<void> {
    try {
      const lockFile = this.allocationFile + '.lock';
      const maxWait = 5000;
      const start = Date.now();

      try {
        while (fs.existsSync(lockFile) && Date.now() - start < maxWait) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        if (fs.existsSync(lockFile)) {
          console.warn('Port allocation file lock timeout during save');
          return;
        }
      } catch {
        return;
      }

      try {
        fs.writeFileSync(lockFile, '');
        await fs.promises.writeFile(
          this.allocationFile,
          JSON.stringify(allocations, null, 2),
          'utf8'
        );
      } finally {
        try {
          fs.unlinkSync(lockFile);
        } catch {
          // Ignore lock cleanup errors
        }
      }
    } catch (error) {
      qerrors(error as Error, 'PortAllocator.saveAllocations failed', {
        allocationFile: this.allocationFile,
      });
    }
  }

  private async cleanupStaleAllocations(): Promise<void> {
    const allocations = await this.loadAllocations();
    const now = Date.now();
    const alivePids = new Set<number>();

    for (const allocation of allocations) {
      try {
        process.kill(allocation.pid, 0);
        if (process.pid !== allocation.pid) {
          alivePids.add(allocation.pid);
        }
      } catch {
        // Process is dead
        continue;
      }
    }

    const filtered = allocations.filter((allocation) => {
      const isAlive = alivePids.has(allocation.pid);
      const isExpired = now - allocation.timestamp > this.allocationTimeoutMs;
      return isAlive && !isExpired;
    });

    if (filtered.length !== allocations.length) {
      await this.saveAllocations(filtered);
    }
  }

  private startCleanupTimer(): void {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    this.cleanupTimer = setInterval(() => {
      if (!this.cleanupInProgress) {
        this.cleanupStaleAllocations().catch(console.error);
      }
    }, this.cleanupIntervalMs);
  }

  async destroy(): Promise<void> {
    this.cleanupInProgress = true;

    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }

    await this.releaseAllPorts();

    try {
      if (fs.existsSync(this.allocationFile)) {
        await fs.promises.unlink(this.allocationFile);
      }
    } catch {
      // Ignore cleanup errors
    }

    PortAllocator.instance = null;
    this.emit('destroyed');
  }
}

export async function allocatePort(testFile?: string): Promise<number> {
  return PortAllocator.getInstance().allocatePort(testFile);
}

export async function releasePort(port: number): Promise<void> {
  return PortAllocator.getInstance().releasePort(port);
}

export async function releaseAllPorts(): Promise<void> {
  return PortAllocator.getInstance().releaseAllPorts();
}

export async function cleanupPortAllocator(): Promise<void> {
  const allocator = PortAllocator.getInstance();
  if (allocator.cleanupTimer) {
    clearInterval(allocator.cleanupTimer);
    allocator.cleanupTimer = undefined;
  }
  await allocator.destroy();
}

export const portAllocator = PortAllocator.getInstance();

let cleanupRegistered = false;

function setupProcessHandlers(): void {
  if (cleanupRegistered || process.env.NODE_ENV === 'test') {
    return;
  }
  cleanupRegistered = true;

  let cleanupInProgress = false;

  const cleanup = async () => {
    if (cleanupInProgress) return;
    cleanupInProgress = true;

    try {
      const allocator = PortAllocator.getInstance();
      if (allocator.cleanupTimer) {
        clearInterval(allocator.cleanupTimer);
        allocator.cleanupTimer = undefined;
      }
      await allocator.destroy();
    } catch (error) {
      console.error('Error during port allocator cleanup:', error);
    } finally {
      cleanupInProgress = false;
    }
  };

  process.on('exit', cleanup);
  process.on('SIGINT', () => cleanup().then(() => process.exit(0)));
  process.on('SIGTERM', () => cleanup().then(() => process.exit(0)));
}

setupProcessHandlers();

export default PortAllocator;
