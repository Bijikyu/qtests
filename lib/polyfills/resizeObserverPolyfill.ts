/**
 * Resize Observer API Polyfill for Testing
 */

declare const globalThis: any;

export class MockResizeObserver {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

export function setupResizeObserver(globalScope: any = globalThis): typeof MockResizeObserver {
  if (typeof globalScope.ResizeObserver !== 'function') {
    globalScope.ResizeObserver = MockResizeObserver;
  }
  return globalScope.ResizeObserver;
}