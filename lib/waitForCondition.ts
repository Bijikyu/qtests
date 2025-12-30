import qerrors from './qerrorsFallback';

export interface WaitForConditionOptions {
  timeoutMs?: number;
  intervalMs?: number;
}

export async function waitForCondition(
  predicate: () => boolean | Promise<boolean>,
  opts: WaitForConditionOptions = {}
): Promise<void> {
  const timeoutMs = opts.timeoutMs ?? 2000;
  const intervalMs = opts.intervalMs ?? 25;
  const start = Date.now();

  // Add safety check for minimum timeout
  if (timeoutMs < 100) {
    console.warn('waitForCondition: timeoutMs too low, setting minimum of 100ms');
  }

  while (true) {
    // Check timeout before predicate to prevent infinite loops
    const elapsed = Date.now() - start;
    if (elapsed > timeoutMs) {
      const timeoutError = new Error(`waitForCondition: timeout after ${timeoutMs}ms`);
      qerrors(timeoutError, 'waitForCondition: timeout exceeded', { 
        timeoutMs, 
        intervalMs, 
        elapsedMs: elapsed 
      });
      throw timeoutError;
    }

    let ok = false;
    try {
      ok = await predicate();
    } catch (error: any) {
      qerrors(error, 'waitForCondition: predicate execution failed', { 
        timeoutMs, 
        intervalMs, 
        elapsedMs: elapsed 
      });
      ok = false;
    }

    if (ok) return;

    try {
      await new Promise<void>((resolve) => {
        const timeoutId = setTimeout(() => resolve(), intervalMs);
        // Add cleanup mechanism to prevent hanging
        if (timeoutMs - elapsed < intervalMs) {
          clearTimeout(timeoutId);
          setTimeout(() => resolve(), Math.max(1, timeoutMs - elapsed));
        }
      });
    } catch (error: any) {
      qerrors(error, 'waitForCondition: setTimeout Promise failed', {
        intervalMs,
        elapsedMs: Date.now() - start,
        operation: 'createDelayPromise'
      });
      // Add minimum delay even if timer fails to prevent CPU spinning
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
}

export default waitForCondition;
