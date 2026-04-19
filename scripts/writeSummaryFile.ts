/**
 * Serializes per-category security test results to `security-summary.json`.
 *
 * This file is the only writer of `security-summary.json`.  It is deliberately
 * kept as a thin, self-contained module so it can be imported by the security
 * test runner (a plain JS script) without pulling in the entire test framework.
 */

import fs from 'fs';
import path from 'path';

import type { SecurityCategoryInfo, SecuritySummary } from '../lib/security/types.js';

/** A single category result object returned by the security test runner. */
export interface SecurityResult {
  type: 'regression_tests' | 'penetration_tests' | 'configuration_validation';
  /** Pass/total counts — same shape as SecurityCategoryInfo in lib/security/types.ts. */
  summary: SecurityCategoryInfo;
}

/**
 * Serialize per-category security results to `security-summary.json` in the
 * current working directory.
 *
 * The shape written here is identical to the `SecuritySummary` interface read
 * by `readSecuritySummary()` in `lib/security/summaryHelpers.ts` — TypeScript
 * enforces that the two sides stay in sync at compile time.
 *
 * @param results - Category result objects from the runner.
 */
export function writeSummaryFile(results: SecurityResult[]): void {
  const regression    = results.find(r => r.type === 'regression_tests');
  const penetration   = results.find(r => r.type === 'penetration_tests');
  const configuration = results.find(r => r.type === 'configuration_validation');

  const summary: SecuritySummary = {
    regression:    regression    ? { passed: regression.summary.passed,    total: regression.summary.total    } : null,
    penetration:   penetration   ? { passed: penetration.summary.passed,   total: penetration.summary.total   } : null,
    configuration: configuration ? { passed: configuration.summary.passed, total: configuration.summary.total } : null,
  };

  try {
    fs.writeFileSync(
      path.resolve(process.cwd(), 'security-summary.json'),
      JSON.stringify(summary),
      'utf8',
    );
  } catch {
    // best-effort: caller continues even if summary file cannot be written
  }
}
