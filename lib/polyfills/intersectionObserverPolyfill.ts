/**
 * Intersection Observer API Polyfill for Testing
 */

declare const globalThis: any;

export class MockIntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];

  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

export function setupIntersectionObserver(globalScope: any = globalThis): typeof MockIntersectionObserver {
  globalScope.IntersectionObserver = MockIntersectionObserver;
  return globalScope.IntersectionObserver;
}