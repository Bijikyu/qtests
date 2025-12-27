import qerrors from 'qerrors';

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

  while (true) {
    let ok = false;
    try {
      ok = await predicate();
    } catch (error) {
      qerrors(error, 'waitForCondition: predicate execution failed', { 
        timeoutMs, 
        intervalMs, 
        elapsedMs: Date.now() - start 
      });
      ok = false;
    }

    if (ok) return;

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

    await new Promise((r) => setTimeout(r, intervalMs));
  }
}

export default waitForCondition;
