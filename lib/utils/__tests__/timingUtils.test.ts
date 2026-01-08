/**
 * Timing Utilities Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { Timer, measureAsyncTime, measureTime } from '../timingUtils.js';

describe('Timing Utilities', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Timer', () => {
    it('should create a new timer with operation name', () => {
      const timer = new Timer('test operation');

      expect(timer).toBeDefined();
      expect(timer.elapsed()).toBeGreaterThanOrEqual(0);
    });

    it('should measure elapsed time', () => {
      const timer = new Timer('test');
      
      jest.advanceTimersByTime(100);
      const elapsed = timer.elapsed();

      expect(elapsed).toBe(100);
    });

    it('should stop and return timing result', () => {
      const timer = new Timer('test');
      
      jest.advanceTimersByTime(50);
      const result = timer.stop();

      expect(result.duration).toBe(50);
      expect(result.formattedDuration).toBe('50ms');
      expect(result.startTime).toBeGreaterThan(0);
      expect(result.endTime).toBeGreaterThan(result.startTime);
    });

    it('should format elapsed time correctly', () => {
      const timer = new Timer('test');
      
      jest.advanceTimersByTime(1500);
      const formatted = timer.elapsedFormatted();

      expect(formatted).toBe('1.5s');
    });

    it('should stop and log result', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const timer = new Timer('test operation');
      
      jest.advanceTimersByTime(200);
      const result = timer.stopAndLog();

      expect(consoleSpy).toHaveBeenCalledWith('⏱️  test operation: 200ms');
      expect(result.duration).toBe(200);
      
      consoleSpy.mockRestore();
    });
  });

  describe('measureAsyncTime', () => {
    it('should measure async function execution time', async () => {
      const asyncFunction = jest.fn().mockImplementation(async () => {
        jest.advanceTimersByTime(50);
        return 'result';
      });

      const { result, timing } = await measureAsyncTime(asyncFunction as any);

      expect(result).toBe('result');
      expect(timing.duration).toBe(50);
      expect(asyncFunction).toHaveBeenCalled();
    });

    it('should handle async function errors', async () => {
      const error = new Error('Test error');
      const asyncFunction = jest.fn().mockImplementation(async () => {
        throw error;
      });

      await expect(measureAsyncTime(asyncFunction as any)).rejects.toThrow('Test error');
      expect(asyncFunction).toHaveBeenCalled();
    });

    it('should measure zero time for immediate functions', async () => {
      const asyncFunction = jest.fn().mockImplementation(async () => 'immediate');

      const { timing } = await measureAsyncTime(asyncFunction as any);

      expect(timing.duration).toBe(0);
    });
  });

  describe('measureTime', () => {
    it('should measure sync function execution time', () => {
      const syncFunction = jest.fn().mockImplementation(() => {
        jest.advanceTimersByTime(25);
        return 'sync result';
      });

      const { result, timing } = measureTime(syncFunction);

      expect(result).toBe('sync result');
      expect(timing.duration).toBe(25);
      expect(syncFunction).toHaveBeenCalled();
    });

    it('should handle sync function errors', () => {
      const error = new Error('Sync error');
      const syncFunction = jest.fn().mockImplementation(() => {
        throw error;
      });

      expect(() => measureTime(syncFunction)).toThrow('Sync error');
      expect(syncFunction).toHaveBeenCalled();
    });

    it('should measure zero time for simple functions', () => {
      const syncFunction = jest.fn().mockReturnValue('simple');

      const { timing } = measureTime(syncFunction);

      expect(timing.duration).toBe(0);
    });
  });

  describe('Integration Tests', () => {
    it('should work with real async operations', async () => {
      const timer = new Timer('integration test');
      
      const { result, timing } = await measureAsyncTime(async () => {
        jest.advanceTimersByTime(50);
        return 'done';
      });
      
      const elapsed = timer.elapsed();

      expect(result).toBe('done');
      expect(timing.duration).toBe(50);
      expect(elapsed).toBeGreaterThanOrEqual(50);
    });

    it('should handle complex timing scenarios', () => {
      const timer = new Timer('complex scenario');
      
      // Get first timing
      jest.advanceTimersByTime(20);
      const result1 = timer.stop();
      
      // Timer is stopped, create new one for second part
      const timer2 = new Timer('part 2');
      jest.advanceTimersByTime(30);
      const result2 = timer2.stop();
      
      const { result, timing } = measureTime(() => {
        jest.advanceTimersByTime(10);
        return 'complex';
      });

      expect(result).toBe('complex');
      expect(timing.duration).toBe(10);
      expect(result1.duration).toBe(20);
      expect(result2.duration).toBe(30);
    });
  });
});