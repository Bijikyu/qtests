/**
 * Legacy Test Polyfills - Refactored for SRP
 * 
 * This file now serves as a compatibility layer that re-exports
 * the modular polyfill functionality while maintaining backward compatibility.
 * 
 * The actual implementation has been split into:
 * - polyfills/clipboardPolyfill.ts - Clipboard API polyfill
 * - polyfills/intersectionObserverPolyfill.ts - Intersection Observer polyfill
 * - polyfills/mediaQueryPolyfill.ts - Media Query polyfill
 * - polyfills/resizeObserverPolyfill.ts - Resize Observer polyfill
 * - polyfills/polyfillOrchestrator.ts - Coordinates all polyfill setup
 */

// Import polyfill components
import {
  initializePolyfills,
  resetPolyfills,
  getResizeObserver,
  getIntersectionObserver,
  matchMedia,
  ClipboardAPI,
  clipboard,
  ResizeObserver,
  IntersectionObserver,
  polyfillOrchestrator
} from './polyfills/index.js';

// Re-export all functionality for backward compatibility
export {
  initializePolyfills,
  resetPolyfills,
  getResizeObserver,
  getIntersectionObserver,
  matchMedia,
  ClipboardAPI,
  clipboard,
  ResizeObserver,
  IntersectionObserver,
  polyfillOrchestrator
};
