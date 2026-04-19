/**
 * Shared helpers for producing and reading the per-category security summary
 * displayed in the TEST SUMMARY banner.
 *
 * Extracted from qtests-runner.mjs so that both the runner and unit tests can
 * import the same implementation without subprocess overhead.
 */

import fs from 'fs';
import path from 'path';

import type { SecurityCategoryInfo, SecuritySummary } from './types.js';

export type { SecurityCategoryInfo, SecuritySummary };

/** ANSI escape codes — same palette as qtests-runner.mjs. */
const colors = {
  green: '\u001b[32m',
  red:   '\u001b[31m',
  reset: '\u001b[0m',
};

/**
 * Format a per-category security count for the TEST SUMMARY banner.
 *
 * Returns a string like `"3/3 regression ✓"` (with ANSI colour marks) when
 * `info` is provided, or `null` when `info` is absent so the caller can
 * `filter(Boolean)` the results.
 */
export function formatSecurityCategory(
  label: string,
  info: SecurityCategoryInfo | null | undefined,
): string | null {
  if (!info) return null;
  const ok = info.passed === info.total;
  const mark = ok
    ? `${colors.green}✓${colors.reset}`
    : `${colors.red}✗${colors.reset}`;
  return `${info.passed}/${info.total} ${label} ${mark}`;
}

/**
 * Read the per-category summary written by the security runner.
 *
 * Returns `null` when the file is absent or its content cannot be parsed as
 * JSON — the caller falls back to a generic "passed" or "FAILED" label.
 *
 * @param summaryPath Absolute path to the JSON file (defaults to
 *   `security-summary.json` in the current working directory).
 */
export function readSecuritySummary(
  summaryPath: string = path.join(process.cwd(), 'security-summary.json'),
): SecuritySummary | null {
  try {
    const raw = fs.readFileSync(summaryPath, 'utf8');
    return JSON.parse(raw) as SecuritySummary;
  } catch {
    return null;
  }
}
