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
    } catch (_) {
      ok = false;
    }

    if (ok) return;

    if (Date.now() - start > timeoutMs) {
      throw new Error(`waitForCondition: timeout after ${timeoutMs}ms`);
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }
}

export default waitForCondition;
