/**
 * Garbage Collection Utilities
 * Handles garbage collection and memory management
 */

interface GlobalWithGC {
  gc?: () => void;
}

declare const global: GlobalWithGC;

export const forceGC = (): void => {
  if (global.gc) {
    for (let i = 0; i < 3; i++) {
      global.gc();
    }
  }
};