/**
 * Timer Management Utility
 * 
 * Prevents resource leaks by tracking and cleaning up timers
 */

export class TimerManager {
  private timers = new Set<NodeJS.Timeout>();
  private intervals = new Set<NodeJS.Timeout>();

  /**
   * Create a tracked timeout
   */
  setTimeout(callback: () => void, delay: number): NodeJS.Timeout {
    const timer = setTimeout(() => {
      callback();
      this.timers.delete(timer);
    }, delay);
    
    this.timers.add(timer);
    return timer;
  }

  /**
   * Create a tracked interval
   */
  setInterval(callback: () => void, delay: number): NodeJS.Timeout {
    const interval = setInterval(callback, delay);
    this.intervals.add(interval);
    return interval;
  }

  /**
   * Clear a specific timeout
   */
  clearTimeout(timer: NodeJS.Timeout): void {
    clearTimeout(timer);
    this.timers.delete(timer);
  }

  /**
   * Clear a specific interval
   */
  clearInterval(interval: NodeJS.Timeout): void {
    clearInterval(interval);
    this.intervals.delete(interval);
  }

  /**
   * Clear all tracked timers and intervals
   */
  cleanup(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.intervals.forEach(interval => clearInterval(interval));
    
    this.timers.clear();
    this.intervals.clear();
  }

  /**
   * Get count of active timers
   */
  getActiveCount(): number {
    return this.timers.size + this.intervals.size;
  }

  /**
   * Check if timer is tracked
   */
  hasTimer(timer: NodeJS.Timeout): boolean {
    return this.timers.has(timer) || this.intervals.has(timer);
  }

  /**
   * Get statistics
   */
  getStats(): { timeouts: number; intervals: number; total: number } {
    return {
      timeouts: this.timers.size,
      intervals: this.intervals.size,
      total: this.timers.size + this.intervals.size
    };
  }
}

// Global timer manager instance
export const globalTimerManager = new TimerManager();

// Convenience functions
export const trackedTimeout = (callback: () => void, delay: number): NodeJS.Timeout => {
  return globalTimerManager.setTimeout(callback, delay);
};

export const trackedInterval = (callback: () => void, delay: number): NodeJS.Timeout => {
  return globalTimerManager.setInterval(callback, delay);
};

export const cleanupAllTimers = (): void => {
  globalTimerManager.cleanup();
};