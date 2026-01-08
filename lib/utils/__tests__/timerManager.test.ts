/**
 * Timer Manager Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { 
  TimerManager, 
  globalTimerManager, 
  trackedTimeout, 
  trackedInterval, 
  cleanupAllTimers 
} from '../timerManager.js';

describe('Timer Manager', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    globalTimerManager.cleanup();
  });

  afterEach(() => {
    jest.useRealTimers();
    globalTimerManager.cleanup();
  });

  describe('TimerManager', () => {
    let manager: TimerManager;

    beforeEach(() => {
      manager = new TimerManager();
    });

    afterEach(() => {
      manager.cleanup();
    });

    it('should create tracked timeout', () => {
      const callback = jest.fn();
      const timer = manager.setTimeout(callback, 100);

      expect(timer).toBeDefined();
      expect(manager.hasTimer(timer)).toBe(true);
      expect(manager.getStats().timeouts).toBe(1);
    });

    it('should execute timeout callback', () => {
      const callback = jest.fn();
      manager.setTimeout(callback, 100);

      jest.advanceTimersByTime(100);

      expect(callback).toHaveBeenCalled();
      expect(manager.getStats().timeouts).toBe(0);
    });

    it('should create tracked interval', () => {
      const callback = jest.fn();
      const interval = manager.setInterval(callback, 100);

      expect(interval).toBeDefined();
      expect(manager.hasTimer(interval)).toBe(true);
      expect(manager.getStats().intervals).toBe(1);
    });

    it('should execute interval callback multiple times', () => {
      const callback = jest.fn();
      manager.setInterval(callback, 100);

      jest.advanceTimersByTime(300);

      expect(callback).toHaveBeenCalledTimes(3);
      expect(manager.getStats().intervals).toBe(1);
    });

    it('should clear specific timeout', () => {
      const callback = jest.fn();
      const timer = manager.setTimeout(callback, 100);

      manager.clearTimeout(timer);

      jest.advanceTimersByTime(100);

      expect(callback).not.toHaveBeenCalled();
      expect(manager.getStats().timeouts).toBe(0);
    });

    it('should clear specific interval', () => {
      const callback = jest.fn();
      const interval = manager.setInterval(callback, 100);

      manager.clearInterval(interval);

      jest.advanceTimersByTime(300);

      expect(callback).not.toHaveBeenCalled();
      expect(manager.getStats().intervals).toBe(0);
    });

    it('should cleanup all timers', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      manager.setTimeout(callback1, 100);
      manager.setInterval(callback2, 100);

      expect(manager.getStats().total).toBe(2);

      manager.cleanup();

      expect(manager.getStats().total).toBe(0);

      jest.advanceTimersByTime(100);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });

    it('should get active count', () => {
      expect(manager.getActiveCount()).toBe(0);

      manager.setTimeout(jest.fn(), 100);
      expect(manager.getActiveCount()).toBe(1);

      manager.setInterval(jest.fn(), 100);
      expect(manager.getActiveCount()).toBe(2);

      manager.cleanup();
      expect(manager.getActiveCount()).toBe(0);
    });

    it('should provide accurate stats', () => {
      manager.setTimeout(jest.fn(), 100);
      manager.setTimeout(jest.fn(), 200);
      manager.setInterval(jest.fn(), 50);
      manager.setInterval(jest.fn(), 75);

      const stats = manager.getStats();

      expect(stats.timeouts).toBe(2);
      expect(stats.intervals).toBe(2);
      expect(stats.total).toBe(4);
    });
  });

  describe('Global Timer Manager', () => {
    it('should use shared global instance', () => {
      const callback = jest.fn();
      const timer = trackedTimeout(callback, 100);

      expect(globalTimerManager.hasTimer(timer)).toBe(true);
    });

    it('should track intervals globally', () => {
      const callback = jest.fn();
      const interval = trackedInterval(callback, 100);

      expect(globalTimerManager.hasTimer(interval)).toBe(true);
    });

    it('should cleanup all global timers', () => {
      trackedTimeout(jest.fn(), 100);
      trackedInterval(jest.fn(), 100);

      expect(globalTimerManager.getActiveCount()).toBe(2);

      cleanupAllTimers();

      expect(globalTimerManager.getActiveCount()).toBe(0);
    });
  });

  describe('Resource Leak Prevention', () => {
    it('should prevent timer leaks after cleanup', () => {
      const callback = jest.fn();
      
      trackedTimeout(callback, 100);
      trackedInterval(callback, 100);

      cleanupAllTimers();

      jest.advanceTimersByTime(200);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle cleanup on already cleared timers', () => {
      const callback = jest.fn();
      const timer = trackedTimeout(callback, 100);
      
      globalTimerManager.clearTimeout(timer);
      globalTimerManager.clearTimeout(timer); // Should not throw

      expect(globalTimerManager.getStats().total).toBe(0);
    });

    it('should handle multiple cleanup calls safely', () => {
      trackedTimeout(jest.fn(), 100);
      trackedInterval(jest.fn(), 100);

      cleanupAllTimers();
      cleanupAllTimers(); // Should not throw

      expect(globalTimerManager.getStats().total).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero delay timeouts', () => {
      const callback = jest.fn();
      const timer = trackedTimeout(callback, 0);

      jest.advanceTimersByTime(0);

      expect(callback).toHaveBeenCalled();
      expect(globalTimerManager.getStats().timeouts).toBe(0);
    });

    it('should handle very long delays', () => {
      const callback = jest.fn();
      trackedTimeout(callback, 999999);

      expect(globalTimerManager.getStats().timeouts).toBe(1);

      jest.advanceTimersByTime(999999);

      expect(callback).toHaveBeenCalled();
      expect(globalTimerManager.getStats().timeouts).toBe(0);
    });

    it('should handle rapid timer creation and cleanup', () => {
      for (let i = 0; i < 100; i++) {
        trackedTimeout(jest.fn(), 100);
        trackedInterval(jest.fn(), 100);
      }

      expect(globalTimerManager.getStats().total).toBe(200);

      cleanupAllTimers();

      expect(globalTimerManager.getStats().total).toBe(0);
    });
  });
});