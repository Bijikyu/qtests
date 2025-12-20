/**
 * Polyfill Orchestrator - Coordinates all polyfill setup
 */

import { setupClipboard, ClipboardSpies } from './clipboardPolyfill.js';
import { setupIntersectionObserver } from './intersectionObserverPolyfill.js';
import { setupMatchMedia } from './mediaQueryPolyfill.js';
import { setupResizeObserver } from './resizeObserverPolyfill.js';

declare const globalThis: any;

export function setupAllPolyfills(globalScope: any = globalThis): ClipboardSpies {
  const clipboardSpies = setupClipboard(globalScope);
  setupIntersectionObserver(globalScope);
  setupMatchMedia(globalScope);
  setupResizeObserver(globalScope);
  return clipboardSpies;
}