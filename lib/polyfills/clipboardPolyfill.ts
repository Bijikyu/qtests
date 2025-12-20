/**
 * Clipboard API Polyfill for Testing
 */

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