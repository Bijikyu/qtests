/**
 * Media Query API Polyfill for Testing
 */

declare const globalThis: any;

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