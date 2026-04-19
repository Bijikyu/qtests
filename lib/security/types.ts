/**
 * Shared type definitions for the security-summary.json data structure.
 *
 * `security-summary.json` is written by the security test runner
 * (`scripts/security-test-runner.js` via `scripts/writeSummaryFile.js`) and
 * read by the TEST SUMMARY banner logic in `qtests-runner.mjs` (via
 * `readSecuritySummary()` in `lib/security/summaryHelpers.ts`).
 *
 * Defining the shape here gives compile-time safety on both ends and makes
 * the contract between writer and reader explicit.
 */

/**
 * Pass/total counts for one security test category.
 * Produced by `writeSummaryFile()` and consumed by `formatSecurityCategory()`.
 */
export interface SecurityCategoryInfo {
  passed: number;
  total: number;
}

/**
 * The JSON object written to `security-summary.json` after a successful
 * security test run.
 *
 * Each field holds the pass/total counts for one category, or `null` when
 * that category was not executed (e.g. penetration tests disabled).
 */
export interface SecuritySummary {
  /** Results from regression / unit-style security tests. */
  regression: SecurityCategoryInfo | null;
  /** Results from penetration / attack-simulation tests. */
  penetration: SecurityCategoryInfo | null;
  /** Results from configuration / policy validation checks. */
  configuration: SecurityCategoryInfo | null;
}
