/**
 * Garbage Collection Utilities
 * Handles garbage collection and memory management
 */

declare const global: any;

export const forceGC = (): void => {
  if (global.gc) {
    for (let i = 0; i < 3; i++) {
      global.gc();
    }
  }
};