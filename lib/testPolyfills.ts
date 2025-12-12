declare const globalThis: any;

export interface ClipboardSpies {
  clipboardWriteTextSpy: (...args: any[]) => Promise<void>;
}

export function setupClipboard(globalScope: any = globalThis): ClipboardSpies {
  const mockFactory = globalScope.jest?.fn ?? globalScope.vi?.fn ?? (() => async () => undefined);
  const clipboardWriteTextSpy = mockFactory(async () => undefined);

  if (!globalScope.navigator) {
    globalScope.navigator = {};
  }
  globalScope.navigator.clipboard = { writeText: clipboardWriteTextSpy };

  return { clipboardWriteTextSpy };
}

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

export interface MockMediaQueryList {
  matches: boolean;
  media: string;
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null;
  addListener: () => void;
  removeListener: () => void;
  addEventListener: () => void;
  removeEventListener: () => void;
  dispatchEvent: () => boolean;
}

export function setupMatchMedia(globalScope: any = globalThis): void {
  if (typeof globalScope.window !== 'undefined' && !globalScope.window.matchMedia) {
    globalScope.window.matchMedia = (query: string): MockMediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    });
  }
}

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

export function setupAllPolyfills(globalScope: any = globalThis): ClipboardSpies {
  const clipboardSpies = setupClipboard(globalScope);
  setupIntersectionObserver(globalScope);
  setupMatchMedia(globalScope);
  setupResizeObserver(globalScope);
  return clipboardSpies;
}
